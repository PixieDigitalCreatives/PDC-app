// Brand facts in one place. AI search tools and Google trust a business more when the same facts
// (name, website, contact details, profiles) appear identically everywhere, so the structured data,
// llms.txt and the crawlable page copy all read them from here. Only facts the owner has confirmed:
// remote studio, no public street address, one phone number.
import { defaultCompanyInfo } from "./initialData.js";

export const BRAND = {
  name: defaultCompanyInfo.name,
  shortName: defaultCompanyInfo.shortName,
  url: "https://www.pixiedigitalcreatives.com",
  description: defaultCompanyInfo.description,
  tagline: defaultCompanyInfo.tagline,
  email: defaultCompanyInfo.email,
  phone: defaultCompanyInfo.phone,
  phoneHref: `tel:${defaultCompanyInfo.phone.replace(/[^\d+]/g, "")}`,
  workStyle: "Remote digital studio working with clients worldwide",
  areaServed: "Worldwide",
  languages: ["English"],
  socials: defaultCompanyInfo.socials,
};

// Profiles that represent the brand (schema.org `sameAs`): the official social accounts.
export const SAME_AS = Object.values(BRAND.socials).filter(Boolean);
