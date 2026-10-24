import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import { requireAuth, requireAuthAllowPending, requireSuperAdmin } from "../middleware/auth.js";
import { checkPassword, getJwtSecret, isSuperAdmin, publicAdmin, temporaryPassword } from "../config/auth.js";

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Compared against when the email is unknown, so a wrong email takes as long as a wrong password.
const DUMMY_HASH = bcrypt.hashSync("pdc-no-such-admin", 12);
const text = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

const signToken = (admin) =>
  jwt.sign({ id: admin._id, email: admin.email, role: isSuperAdmin(admin) ? "superadmin" : "admin" }, getJwtSecret(), {
    expiresIn: "7d",
  });

const serverError = (res, label, err) => {
  console.error(`${label}:`, err);
  const notConfigured = err?.message === "JWT_SECRET is not set";
  return res.status(500).json({
    success: false,
    error: notConfigured ? "Login is not configured on the server." : "Something went wrong. Please try again.",
  });
};

// POST /api/auth/login — Email + Password
router.post("/login", async (req, res) => {
  try {
    const email = text(req.body?.email, 254).toLowerCase();
    const password = typeof req.body?.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    const admin = await Admin.findOne({ email });
    let valid = false;
    if (admin) valid = await admin.comparePassword(password);
    else await bcrypt.compare(password, DUMMY_HASH);
    if (!valid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    const token = signToken(admin);
    await Admin.updateOne({ _id: admin._id }, { $set: { lastLoginAt: new Date() } });

    return res.json({
      success: true,
      token,
      admin: publicAdmin(admin),
      message: "Authentication successful.",
    });
  } catch (err) {
    return serverError(res, "Login error", err);
  }
});

// GET /api/auth/me — the logged-in account (also while a new password is still required)
router.get("/me", requireAuthAllowPending, (req, res) => {
  res.json({ success: true, admin: publicAdmin(req.admin) });
});

// GET /api/auth/verify
router.get("/verify", requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user,
    message: "Token is valid.",
  });
});

// POST /api/auth/change-password — any admin, including one who must replace a temporary password.
// Returns a fresh token: tokens from before the change stop working.
router.post("/change-password", requireAuthAllowPending, async (req, res) => {
  try {
    const currentPassword = typeof req.body?.currentPassword === "string" ? req.body.currentPassword : "";
    const newPassword = typeof req.body?.newPassword === "string" ? req.body.newPassword : "";

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: "Current and new password are required." });
    }
    const problem = checkPassword(newPassword);
    if (problem) {
      return res.status(400).json({ success: false, error: problem });
    }

    const admin = req.admin;
    if (!(await admin.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, error: "Your current password is not correct." });
    }
    if (await admin.comparePassword(newPassword)) {
      return res.status(400).json({ success: false, error: "Choose a password different from the current one." });
    }

    admin.passwordHash = newPassword; // pre-save hook hashes it and stamps passwordChangedAt
    admin.mustChangePassword = false;
    await admin.save();

    res.json({
      success: true,
      token: signToken(admin),
      admin: publicAdmin(admin),
      message: "Password updated.",
    });
  } catch (err) {
    return serverError(res, "Change password error", err);
  }
});

// ---- Admin accounts (super admin only) ----

// GET /api/auth/admins
router.get("/admins", requireSuperAdmin, async (req, res) => {
  try {
    const admins = await Admin.find().sort({ createdAt: 1 });
    res.json({ success: true, admins: admins.map(publicAdmin) });
  } catch (err) {
    return serverError(res, "List admins error", err);
  }
});

// POST /api/auth/admins — { email, name?, password? }. Without a password one is generated.
// The new admin must change it at first login. The temporary password is returned once.
router.post("/admins", requireSuperAdmin, async (req, res) => {
  try {
    const email = text(req.body?.email, 254).toLowerCase();
    const name = text(req.body?.name, 80);
    const chosen = typeof req.body?.password === "string" ? req.body.password.trim() : "";

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, error: "Enter a valid email address." });
    }
    if (chosen) {
      const problem = checkPassword(chosen);
      if (problem) return res.status(400).json({ success: false, error: `Temporary password: ${problem.charAt(0).toLowerCase()}${problem.slice(1)}` });
    }
    if (await Admin.exists({ email })) {
      return res.status(400).json({ success: false, error: "An admin with this email already exists." });
    }

    const password = chosen || temporaryPassword();
    const admin = await Admin.create({
      email,
      name,
      passwordHash: password, // hashed by the pre-save hook
      role: "admin",
      mustChangePassword: true,
      createdBy: req.admin.email,
    });

    res.status(201).json({
      success: true,
      admin: publicAdmin(admin),
      temporaryPassword: password,
      message: `Admin ${email} added.`,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ success: false, error: "An admin with this email already exists." });
    }
    return serverError(res, "Create admin error", err);
  }
});

// POST /api/auth/admins/:id/reset-password — new temporary password; signs the admin out everywhere
router.post("/admins/:id/reset-password", requireSuperAdmin, async (req, res) => {
  try {
    const admin = mongoose.isValidObjectId(req.params.id) ? await Admin.findById(req.params.id) : null;
    if (!admin) return res.status(404).json({ success: false, error: "Admin not found." });
    if (isSuperAdmin(admin)) {
      return res.status(400).json({ success: false, error: "Change your own password with “Change password”." });
    }

    const password = temporaryPassword();
    admin.passwordHash = password;
    admin.mustChangePassword = true;
    await admin.save();

    res.json({ success: true, admin: publicAdmin(admin), temporaryPassword: password });
  } catch (err) {
    return serverError(res, "Reset admin password error", err);
  }
});

// DELETE /api/auth/admins/:id
router.delete("/admins/:id", requireSuperAdmin, async (req, res) => {
  try {
    const admin = mongoose.isValidObjectId(req.params.id) ? await Admin.findById(req.params.id) : null;
    if (!admin) return res.status(404).json({ success: false, error: "Admin not found." });
    if (isSuperAdmin(admin)) {
      return res.status(400).json({ success: false, error: "The super admin account cannot be removed." });
    }

    await Admin.deleteOne({ _id: admin._id });
    res.json({ success: true, message: `Admin ${admin.email} removed.` });
  } catch (err) {
    return serverError(res, "Delete admin error", err);
  }
});

export default router;
