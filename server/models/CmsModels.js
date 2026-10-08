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
  phone: { type: String, default: "+1 (555) 019-2834" },
  address: { type: String, default: "Digital Studio Worldwide & Remote" },
  tagline: { type: String, default: "Creative. Strategic. Impactful." },
  description: { type: String, default: "We craft digital experiences that inspire, engage, and drive real business results." },
  socials: {
    instagram: { type: String, default: "https://www.instagram.com/pixiedigitalcreatives/" },
    linkedin: { type: String, default: "https://www.linkedin.com/company/pixiedigitalcreatives" },
    twitter: { type: String, default: "https://x.com/pixiedigital" },
    facebook: { type: String, default: "https://www.facebook.com/share/17iSpzyfRY/" },
  },
}, { timestamps: true });

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export const Team = mongoose.model("Team", teamSchema);
export const Stat = mongoose.model("Stat", statSchema);
export const Company = mongoose.model("Company", companySchema);
