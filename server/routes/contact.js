import express from "express";
import Inquiry from "../models/Inquiry.js";
import { sendInquiryEmail, sendAutoReplyEmail } from "../config/mailer.js";

const router = express.Router();

// Longest value accepted for each field (the message gets the most room)
const LIMITS = { name: 100, business: 120, email: 254, phone: 30, country: 80, service: 160, budget: 80, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9][0-9\s().-]{5,28}$/;

// Only plain strings are accepted; anything else (objects, arrays, numbers) becomes empty.
const text = (value) => (typeof value === "string" ? value.trim() : "");

// POST /api/contact — Public inquiry receiver
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    const name = text(body.name);
    const business = text(body.business);
    const email = text(body.email);
    const phone = text(body.phone);
    const message = text(body.message);
    const country = text(body.country);
    const service = text(body.service);
    const budget = text(body.budget);

    // Visitors can be reached by email or phone: at least one is needed.
    if (!name || !message || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        error: "Name, message and an email or phone number are required.",
      });
    }

    if (email && !EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, error: "Please enter a valid email address." });
    }

    if (phone && !PHONE_RE.test(phone)) {
      return res.status(400).json({ success: false, error: "Please enter a valid phone number." });
    }

    for (const [field, value] of Object.entries({ name, business, email, phone, country, service, budget, message })) {
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
      business,
      email,
      phone,
      country: country || "Not specified",
      service: service || "General Inquiry",
      budget: budget || "Not specified",
      message,
      ip: req.ip,
    });

    // 2. Send email via Zoho SMTP
    const emailResult = await sendInquiryEmail({
      name,
      business,
      email,
      phone,
      country,
      service,
      budget,
      message,
    });

    if (emailResult.sent && email) {
      await sendAutoReplyEmail({ name, email, service });
    }

    // Update inquiry with email status
    inquiry.emailSent = emailResult.sent;
    await inquiry.save();

    console.log(
      `📩 Inquiry ${inquiry._id} from ${name} (${email || phone}) — Email ${emailResult.sent ? "sent ✅" : `NOT sent ⚠️ (${emailResult.reason})`}`
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
