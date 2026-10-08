import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./config/db.js";
import { initMailer } from "./config/mailer.js";

// Routes
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";
import cmsRoutes from "./routes/cms.js";
import contactRoutes from "./routes/contact.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Behind a host's reverse proxy (Render, Netlify/Vercel rewrites) the socket address is the proxy's,
// so without this every visitor shares one IP: one rate-limit bucket for the whole site.
// 1 = trust the single proxy in front of this server; override with TRUST_PROXY_HOPS if the chain differs.
app.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS ?? 1));

// 1. Connect MongoDB
await connectDb();

// 2. Init Zoho Mailer
initMailer();

// 3. Security Headers (Helmet)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

// 4. CORS Policy
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.endsWith(".netlify.app") ||
        origin.includes("pixiedigitalcreatives.com")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev/staging
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 5. Body Parsers
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// 6. Brute-Force Rate Limiter for Auth
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 login attempts
  message: {
    success: false,
    error: "Too many login attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 7. Contact Form Rate Limiter (anti-spam)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // max 5 inquiries per IP per hour
  skipFailedRequests: true, // a rejected or failed submission does not use up the visitor's quota
  message: {
    success: false,
    error: "Too many messages sent. Please try again later.",
  },
});

// 8. Static uploads
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// 9. API Routes
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cms", cmsRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);

// 10. Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    studio: "Pixie Digital Creatives",
    database: "MongoDB Atlas",
    mailer: "Zoho SMTP",
    timestamp: new Date().toISOString(),
  });
});

// 11. 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: "API endpoint not found." });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 PDC Backend running on port ${PORT}`);
  console.log(`🔒 Security: Helmet + Rate Limiter + bcrypt + JWT`);
  console.log(`🍃 Database: MongoDB Atlas`);
  console.log(`📧 Mailer: Zoho SMTP`);
  console.log(`☁️  Storage: Cloudinary CDN`);
  console.log(`======================================================\n`);
});
