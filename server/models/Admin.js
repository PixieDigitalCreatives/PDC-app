import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
    default: "",
  },
  passwordHash: {
    type: String,
    required: true,
  },
  // Display only: who is super admin is decided by email (config/auth.js), never by this field.
  role: {
    type: String,
    default: "admin",
  },
  // Set when the super admin creates the account or resets its password: the admin must choose
  // their own password before they can use the CMS.
  mustChangePassword: {
    type: Boolean,
    default: false,
  },
  // Tokens issued before this moment are no longer accepted (see middleware/auth.js).
  passwordChangedAt: Date,
  lastLoginAt: Date,
  createdBy: String,
}, { timestamps: true });

// Hash password before saving
adminSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  if (!this.isNew) this.passwordChangedAt = new Date();
});

// Compare password method
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
