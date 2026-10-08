import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  country: { type: String, default: "US" },
  service: { type: String, default: "General Inquiry" },
  budget: { type: String, default: "Not specified" },
  message: { type: String, required: true },
  ip: { type: String },
  emailSent: { type: Boolean, default: false },
}, { timestamps: true });

const Inquiry = mongoose.model("Inquiry", inquirySchema);
export default Inquiry;
