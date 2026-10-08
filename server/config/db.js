import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import { Company } from "../models/CmsModels.js";
import { defaultCompanyInfo } from "../../src/data/initialData.js";

export const connectDb = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("❌ MONGODB_URI not set in .env — cannot start server.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Atlas connected successfully.");

    // Seed admin if none exists
    await seedAdmin();
    // Seed CMS data if collections are empty
    await seedCmsData();
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@pixiedigitalcreatives.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const admin = new Admin({
      email: adminEmail,
      passwordHash: adminPassword, // pre-save hook will bcrypt hash this
    });
    await admin.save();
    console.log(`🔒 Default admin account created: ${adminEmail}`);
  }
};

// Portfolio, team and stats are never seeded: they hold only what the admin adds.
const seedCmsData = async () => {
  // Seed or heal company info
  const existingCompany = await Company.findOne();
  if (!existingCompany && defaultCompanyInfo) {
    await Company.create(defaultCompanyInfo);
    console.log("🏢 Seeded company info.");
  } else if (existingCompany && (!existingCompany.socials || !existingCompany.socials.instagram)) {
    existingCompany.socials = defaultCompanyInfo.socials;
    if (!existingCompany.shortName) existingCompany.shortName = defaultCompanyInfo.shortName;
    if (!existingCompany.description) existingCompany.description = defaultCompanyInfo.description;
    await existingCompany.save();
    console.log("🏢 Updated company info with full socials.");
  }
};
