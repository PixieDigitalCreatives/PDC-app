import express from "express";
import Inquiry from "../models/Inquiry.js";
import { sendInquiryEmail, sendAutoReplyEmail } from "../config/mailer.js";

const router = express.Router();

// Longest value accepted for each field (the message gets the most room)
const LIMITS = { name: 100, email: 254, country: 80, service: 120, budget: 80, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Only plain strings are accepted; anything else (objects, arrays, numbers) becomes empty.
const text = (value) => (typeof value === "string" ? value.trim() : "");

// POST /api/contact — Public inquiry receiver
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    const name = text(body.name);
    const email = text(body.email);
    const message = text(body.message);
    const country = text(body.country);
    const service = text(body.service);
    const budget = text(body.budget);

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and message are required.",
      });
    }

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, error: "Please enter a valid email address." });
    }

    for (const [field, value] of Object.entries({ name, email, country, service, budget, message })) {
      if (value.length > LIMITS[field]) {
        return res.status(400).json({
          success: false,
          error: `The ${field} is too long (maximum ${LIMITS[field]} characters).`,
        });
      }
    }

    // 1. Save inquiry to MongoDB first, so a lead is never lost if the email fails
    const inquiry = await Inquiry.create({
      name,
      email,
      country: country || "Not specified",
      service: service || "General Inquiry",
      budget: budget || "Not specified",
      message,
      ip: req.ip,
    });

    // 2. Send email via Zoho SMTP
    const emailResult = await sendInquiryEmail({
      name,
      email,
      country,
      service,
      budget,
      message,
    });

    if (emailResult.sent) {
      await sendAutoReplyEmail({ name, email, service });
    }

    // Update inquiry with email status
    inquiry.emailSent = emailResult.sent;
    await inquiry.save();

    console.log(
      `📩 Inquiry ${inquiry._id} from ${name} (${email}) — Email ${emailResult.sent ? "sent ✅" : `NOT sent ⚠️ (${emailResult.reason})`}`
    );

    res.json({
      success: true,
      message: "Inquiry received successfully. We'll get back to you soon!",
      emailSent: emailResult.sent,
    });
  } catch (err) {
    console.error("Contact inquiry error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to process your inquiry. Please try again.",
    });
  }
});

export default router;
