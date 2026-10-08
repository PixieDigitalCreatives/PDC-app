import nodemailer from "nodemailer";

let transporter = null;

export const initMailer = () => {
  const zohoEmail = process.env.ZOHO_EMAIL;
  const zohoPassword = process.env.ZOHO_APP_PASSWORD;

  if (!zohoEmail || !zohoPassword) {
    console.log("⚠️  Zoho Mail not configured — email delivery disabled.");
    return;
  }

  // Detect Indian datacenter vs global
  const isIndian = zohoEmail.endsWith(".in") || true; // Default to Indian datacenter for pixiedigitalcreatives.com
  const smtpHost = isIndian ? "smtp.zoho.in" : "smtp.zoho.com";

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: 465,
    secure: true, // SSL
    auth: {
      user: zohoEmail,
      pass: zohoPassword,
    },
  });

  // Verify connection
  transporter.verify((error) => {
    if (error) {
      console.error("❌ Zoho SMTP connection failed:", error.message);
      // Try global datacenter as fallback
      if (isIndian) {
        console.log("🔄 Retrying with smtp.zoho.com...");
        transporter = nodemailer.createTransport({
          host: "smtp.zoho.com",
          port: 465,
          secure: true,
          auth: {
            user: zohoEmail,
            pass: zohoPassword,
          },
        });
        transporter.verify((err2) => {
          if (err2) {
            console.error("❌ Zoho SMTP global also failed:", err2.message);
            transporter = null;
          } else {
            console.log("✅ Zoho Mail connected (global datacenter).");
          }
        });
      }
    } else {
      console.log("✅ Zoho Mail SMTP connected successfully.");
    }
  });
};

// Visitor text is untrusted: escape it before it goes into the HTML email.
const esc = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
// Header values must stay on one line
const oneLine = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

export const sendInquiryEmail = async ({ name, email, country, service, budget, message }) => {
  if (!transporter) {
    console.warn("Mailer not configured — skipping email.");
    return { sent: false, reason: "Mailer not configured" };
  }

  const safe = {
    name: esc(name),
    email: esc(email),
    country: esc(country || "Not specified"),
    service: esc(service || "General"),
    budget: esc(budget || "Not specified"),
    message: esc(message),
  };

  const toEmail = process.env.CONTACT_RECEIVE_EMAIL || process.env.ZOHO_EMAIL;
  const fromEmail = process.env.ZOHO_EMAIL;

  const mailOptions = {
    from: `"Pixie Digital Creatives" <${fromEmail}>`,
    to: toEmail,
    replyTo: email,
    subject: `🔔 New Inquiry from ${oneLine(name)} — ${oneLine(service || "General")}`,
    html: `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #000000; padding: 40px 20px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #060608; border-radius: 16px; overflow: hidden; font-family: 'Segoe UI', Arial, sans-serif; text-align: left; border: 1px solid #222; margin: 0 auto;">
        <tr>
          <td style="background: linear-gradient(135deg, #0d0d12 0%, #1a1a2e 100%); background-color: #1a1a2e; padding: 32px 28px 20px;">
            <h1 style="font-size: 22px; margin: 0 0 4px; color: #ffffff;">📩 New Client Inquiry</h1>
            <p style="font-size: 13px; color: #71717a; margin: 0;">Pixie Digital Creatives — Studio CMS</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 28px; background-color: #060608;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding: 10px 0; color: #71717a; font-size: 13px; width: 120px; vertical-align: top;">Name</td>
                <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${safe.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #71717a; font-size: 13px; vertical-align: top;">Email</td>
                <td style="padding: 10px 0; color: #d4d4d8; font-size: 14px;"><a href="mailto:${safe.email}" style="color: #a8bff5; text-decoration: underline;">${safe.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #71717a; font-size: 13px; vertical-align: top;">Country</td>
                <td style="padding: 10px 0; color: #d4d4d8; font-size: 14px;">${safe.country}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #71717a; font-size: 13px; vertical-align: top;">Service</td>
                <td style="padding: 10px 0; color: #d4d4d8; font-size: 14px;">${safe.service}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #71717a; font-size: 13px; vertical-align: top;">Budget</td>
                <td style="padding: 10px 0; color: #d4d4d8; font-size: 14px;">${safe.budget}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 16px; background-color: #111115; border: 1px solid #222222; border-radius: 10px;">
              <p style="color: #71717a; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.08em;">Message</p>
              <p style="color: #ffffff; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${safe.message}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 16px 28px; border-top: 1px solid #1a1a2e; text-align: center; background-color: #060608;">
            <p style="font-size: 11px; color: #52525b; margin: 0;">Sent via Pixie Digital Creatives Studio CMS</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Inquiry email sent to ${toEmail} (ID: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error("Email send failed:", err.message);
    return { sent: false, reason: err.message };
  }
};

export const sendAutoReplyEmail = async ({ name, email, service }) => {
  if (!transporter) return { sent: false, reason: "Mailer not configured" };

  const safe = {
    name: esc(name),
    service: esc(service || "General"),
  };

  const fromEmail = process.env.ZOHO_EMAIL;

  const mailOptions = {
    from: `"Pixie Digital Creatives" <${fromEmail}>`,
    to: email,
    subject: `We've received your inquiry!`,
    html: `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #000000; padding: 40px 20px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #060608; border-radius: 16px; overflow: hidden; font-family: 'Segoe UI', Arial, sans-serif; text-align: left; border: 1px solid #222; margin: 0 auto;">
        <tr>
          <td style="background: linear-gradient(135deg, #0d0d12 0%, #1a1a2e 100%); background-color: #1a1a2e; padding: 32px 28px 20px;">
            <h1 style="font-size: 22px; margin: 0 0 4px; color: #ffffff;">✨ Inquiry Received</h1>
            <p style="font-size: 13px; color: #71717a; margin: 0;">Pixie Digital Creatives</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 28px; background-color: #060608;">
            <p style="color: #ffffff; font-size: 15px; line-height: 1.6; margin-top: 0;">Hi ${safe.name},</p>
            <p style="color: #d4d4d8; font-size: 15px; line-height: 1.6;">Thank you for reaching out to Pixie Digital Creatives! We have received your inquiry regarding <strong>${safe.service}</strong> and will get back to you shortly.</p>
            <p style="color: #d4d4d8; font-size: 15px; line-height: 1.6;">In the meantime, feel free to check out our recent work or reply directly to this email if you have any immediate questions.</p>
            <p style="color: #d4d4d8; font-size: 15px; line-height: 1.6; margin-bottom: 0; margin-top: 24px;">Best regards,<br>The Pixie Digital Team</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 16px 28px; border-top: 1px solid #1a1a2e; text-align: center; background-color: #060608;">
            <p style="font-size: 11px; color: #52525b; margin: 0;">© Pixie Digital Creatives</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Auto-reply sent to ${email} (ID: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error("Auto-reply email send failed:", err.message);
    return { sent: false, reason: err.message };
  }
};
