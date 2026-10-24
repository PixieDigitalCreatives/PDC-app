import crypto from "crypto";

// Shared auth settings: the JWT secret, who the super admin is, password rules.

const DEV_FALLBACK_SECRET = "pdc_fallback_secure_jwt_secret_key_2026_xyz";

// In production a missing JWT_SECRET must not fall back to a value that is in the source code:
// anyone could then sign their own admin tokens. Logins fail (500) until it is set.
export const getJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production") throw new Error("JWT_SECRET is not set");
  return DEV_FALLBACK_SECRET;
};

// The super admin is the account with this email (SUPER_ADMIN_EMAIL overrides it). It is checked
// on every request against the database, so no one can promote themselves.
export const superAdminEmail = () =>
  (process.env.SUPER_ADMIN_EMAIL || "rishisrivastava1910@gmail.com").trim().toLowerCase();

export const isSuperAdmin = (admin) => !!admin && admin.email === superAdminEmail();

// What the Admin panel may see about an account (never the password hash).
export const publicAdmin = (admin) => ({
  id: admin._id.toString(),
  email: admin.email,
  name: admin.name || "",
  role: isSuperAdmin(admin) ? "superadmin" : "admin",
  mustChangePassword: !!admin.mustChangePassword,
  createdBy: admin.createdBy || "",
  createdAt: admin.createdAt,
  lastLoginAt: admin.lastLoginAt || null,
});

export const PASSWORD_RULE = "at least 8 characters, with at least one letter and one number";

// Returns an error message, or null when the password is acceptable.
export const checkPassword = (password) => {
  if (typeof password !== "string" || password.length < 8) return `Password must be ${PASSWORD_RULE}.`;
  if (password.length > 128) return "Password must be at most 128 characters.";
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) return `Password must be ${PASSWORD_RULE}.`;
  return null;
};

// A temporary password for a new or reset account: 12 characters, no look-alikes (0/O, 1/l/I).
export const temporaryPassword = () => {
  const letters = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
  const digits = "23456789";
  const all = letters + digits;
  const pick = (set) => set[crypto.randomInt(set.length)];
  const chars = [pick(letters), pick(digits), ...Array.from({ length: 10 }, () => pick(all))];
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = crypto.randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
};
