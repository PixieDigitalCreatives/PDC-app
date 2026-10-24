import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import { getJwtSecret, isSuperAdmin } from "../config/auth.js";

// Checks the Bearer token, then the account itself in the database, so a removed admin or a
// changed password takes effect at once (not when the 7-day token runs out).
//   allowPendingPassword: lets an admin who still has to choose a password through (only the
//                         routes that let them do that)
//   superAdminOnly:       only the super admin
const authenticate = ({ allowPendingPassword = false, superAdminOnly = false } = {}) =>
  async (req, res, next) => {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Missing or invalid authentication token.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(header.slice(7), getJwtSecret());
    } catch (err) {
      if (err.message === "JWT_SECRET is not set") {
        return res.status(500).json({ success: false, error: "Login is not configured on the server." });
      }
      return res.status(403).json({
        success: false,
        error: "Forbidden: Expired or invalid token. Please log in again.",
      });
    }

    try {
      const admin = mongoose.isValidObjectId(decoded.id) ? await Admin.findById(decoded.id) : null;
      if (!admin) {
        return res.status(403).json({ success: false, error: "This account no longer has access. Please log in again." });
      }
      // A token from before the last password change is stale (1 s grace for clock rounding).
      if (admin.passwordChangedAt && decoded.iat * 1000 < admin.passwordChangedAt.getTime() - 1000) {
        return res.status(403).json({ success: false, error: "Your password was changed. Please log in again." });
      }
      if (admin.mustChangePassword && !allowPendingPassword) {
        return res.status(403).json({
          success: false,
          code: "PASSWORD_CHANGE_REQUIRED",
          error: "Please set a new password before using the CMS.",
        });
      }
      if (superAdminOnly && !isSuperAdmin(admin)) {
        return res.status(403).json({ success: false, error: "Only the super admin can do this." });
      }

      req.admin = admin;
      req.user = { id: admin._id.toString(), email: admin.email, role: isSuperAdmin(admin) ? "superadmin" : "admin" };
      next();
    } catch (err) {
      console.error("Auth check error:", err);
      return res.status(500).json({ success: false, error: "Could not check your session." });
    }
  };

export const requireAuth = authenticate();
export const requireAuthAllowPending = authenticate({ allowPendingPassword: true });
export const requireSuperAdmin = authenticate({ superAdminOnly: true });
