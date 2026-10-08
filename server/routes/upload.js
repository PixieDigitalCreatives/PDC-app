import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { requireAuth } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

// POST /api/upload (Protected by JWT)
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image file provided." });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const isCloudinaryConfigured =
      cloudName &&
      apiKey &&
      apiSecret &&
      cloudName !== "your_cloud_name" &&
      apiKey !== "your_api_key";

    if (isCloudinaryConfigured) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });

      // Upload stream to Cloudinary with explicit credentials
      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              cloud_name: cloudName,
              api_key: apiKey,
              api_secret: apiSecret,
              folder: "pixie_digital_creatives",
              resource_type: "image",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
      };

      const result = await uploadToCloudinary();
      console.log(`☁️ Cloudinary upload successful: ${result.secure_url}`);
      return res.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        message: "Image uploaded to Cloudinary successfully.",
      });
    } else {
      // Local fallback storage in public/uploads/
      const uploadsDir = path.join(__dirname, "../../public/uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const ext = path.extname(req.file.originalname) || ".jpg";
      const filename = `pdc-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, req.file.buffer);

      return res.json({
        success: true,
        url: `/uploads/${filename}`,
        message: "Image saved locally.",
      });
    }
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to upload image: " + (err.message || "Unknown error"),
    });
  }
});

export default router;
