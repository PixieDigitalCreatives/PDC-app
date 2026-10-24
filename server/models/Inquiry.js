import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  business: { type: String, trim: true, default: "" },
  // At least one of email / phone (checked in routes/contact.js)
  email: { type: String, trim: true, lowercase: true, default: "" },
  phone: { type: String, trim: true, default: "" },
  country: { type: String, default: "US" },
  service: { type: String, default: "General Inquiry" },
  budget: { type: String, default: "Not specified" },
  message: { type: String, required: true },
  ip: { type: String },
  emailSent: { type: Boolean, default: false },
}, { timestamps: true });

const Inquiry = mongoose.model("Inquiry", inquirySchema);
export default Inquiry;
