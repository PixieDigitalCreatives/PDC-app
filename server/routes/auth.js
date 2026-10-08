import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/login — Email + Password
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Issue JWT
    const jwtSecret = process.env.JWT_SECRET || "pdc_fallback_jwt_secret_2026";
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role || "admin",
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      admin: {
        email: admin.email,
        role: admin.role,
      },
      message: "Authentication successful.",
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error during authentication.",
    });
  }
});

// GET /api/auth/verify
router.get("/verify", requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user,
    message: "Token is valid.",
  });
});

// POST /api/auth/change-password
router.post("/change-password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current and new password are required.",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters.",
      });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found." });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Incorrect current password.",
      });
    }

    admin.passwordHash = newPassword; // pre-save hook will hash it
    await admin.save();

    res.json({
      success: true,
      message: "Password successfully updated.",
    });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ success: false, error: "Failed to update password." });
  }
});

// GET /api/auth/admins — List all admin users (Protected)
router.get("/admins", requireAuth, async (req, res) => {
  try {
    const admins = await Admin.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });
    res.json({ success: true, admins });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/admins — Create a new admin user (Protected)
router.post("/admins", requireAuth, async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Admin.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: "An admin account with this email already exists.",
      });
    }

    const newAdmin = new Admin({
      email: normalizedEmail,
      passwordHash: password,
      role: role || "admin",
    });

    await newAdmin.save();

    res.json({
      success: true,
      admin: {
        id: newAdmin._id,
        email: newAdmin.email,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt,
      },
      message: `Admin user '${normalizedEmail}' created successfully.`,
    });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/auth/admins/:id — Delete an admin user (Protected)
router.delete("/admins/:id", requireAuth, async (req, res) => {
  try {
    const totalAdmins = await Admin.countDocuments();
    if (totalAdmins <= 1) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete the only remaining admin account.",
      });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: "You cannot delete your own currently logged-in account.",
      });
    }

    await Admin.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Admin account removed." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
