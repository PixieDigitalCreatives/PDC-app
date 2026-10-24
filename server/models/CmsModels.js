import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  category: String,
  type: String,
  description: String,
  image: String,
  client: String,
  year: String,
  tags: [String],
  liveUrl: String,
  caseStudyUrl: String,
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  isFounder: { type: Boolean, default: false },
  bio: String,
  image: String,
  linkedin: String,
  twitter: String,
  github: String,
  email: String,
  order: { type: Number, default: 0 },
}, { timestamps: true });

const statSchema = new mongoose.Schema({
  number: { type: String, required: true },
  label: { type: String, required: true },
  icon: String,
}, { timestamps: true });

const companySchema = new mongoose.Schema({
  name: { type: String, default: "Pixie Digital Creatives" },
  shortName: { type: String, default: "PDC" },
  email: { type: String, default: "info@pixiedigitalcreatives.com" },
  phone: { type: String, default: "+91 97089 76946, +91 88253 10738" },
  address: { type: String, default: "Digital Studio Worldwide & Remote" },
  website: { type: String, default: "pixiedigitalcreatives.com" },
  tagline: { type: String, default: "Creative. Strategic. Impactful." },
  description: { type: String, default: "We help businesses turn ideas into premium digital experiences through thoughtful design, modern development, and custom digital solutions." },
  services: { type: String, default: "Website Development • App Development • CRM • Social Media • SEO • Ads" },
  digitalPresence: { type: String, default: "Serving businesses through digital-first solutions" },
  socials: {
    instagram: { type: String, default: "https://www.instagram.com/pixiedigitalcreatives/" },
    linkedin: { type: String, default: "https://www.linkedin.com/company/pixiedigitalcreatives" },
    twitter: { type: String, default: "https://x.com/pixiedigital" },
    facebook: { type: String, default: "https://www.facebook.com/share/17iSpzyfRY/" },
  },
}, { timestamps: true });

// Pricing page (/pricing): one document holding every service section and its plans.
// Cleaned and validated in server/utils/pricing.js before it is saved.
const pricePlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: {
    from: Number,
    to: Number,
    plus: Boolean,
    fixed: Boolean,
    unit: String,
  },
  confirmed: { type: Boolean, default: true },
  fit: String,
  details: [String],
  tag: String,
  featured: Boolean,
  review: String,
}, { _id: false });

const priceCategorySchema = new mongoose.Schema({
  slug: { type: String, required: true },
  number: String,
  title: { type: String, required: true },
  kicker: String,
  blurb: String,
  layout: { type: String, enum: ["tiers", "rates", "duo"], default: "tiers" },
  note: String,
  services: [String],
  plans: [pricePlanSchema],
}, { _id: false });

const pricingSchema = new mongoose.Schema({
  categories: [priceCategorySchema],
  budgetRanges: [String],
}, { timestamps: true });

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export const Team = mongoose.model("Team", teamSchema);
export const Stat = mongoose.model("Stat", statSchema);
export const Company = mongoose.model("Company", companySchema);
export const Pricing = mongoose.model("Pricing", pricingSchema);
