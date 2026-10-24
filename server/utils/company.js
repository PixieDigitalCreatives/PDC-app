// Cleans company info sent from the Admin panel before it is saved: only the fields the site uses,
// plain strings with length limits, a valid email and http(s) social links.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOCIALS = ["instagram", "linkedin", "twitter", "facebook"];
const FIELDS = { name: 80, shortName: 20, email: 254, phone: 120, address: 200, tagline: 120, description: 600, website: 120 };
const LABELS = { name: "Studio name", email: "Email", instagram: "Instagram", linkedin: "LinkedIn", twitter: "Twitter / X", facebook: "Facebook" };

const text = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

/**
 * @returns {{ company: object, errors: string[] }}
 */
export const cleanCompany = (body) => {
  const b = body && typeof body === "object" ? body : {};
  const errors = [];
  const company = {};

  Object.entries(FIELDS).forEach(([field, max]) => {
    company[field] = text(b[field], max);
  });

  if (!company.name) errors.push(`${LABELS.name} is needed.`);
  if (!EMAIL_RE.test(company.email)) errors.push(`${LABELS.email} must be a valid email address.`);

  const socials = b.socials && typeof b.socials === "object" ? b.socials : {};
  company.socials = {};
  SOCIALS.forEach((key) => {
    const url = text(socials[key], 300);
    if (url && !/^https?:\/\/\S+$/i.test(url)) errors.push(`${LABELS[key]} must be a full link starting with https://`);
    company.socials[key] = url;
  });

  return { company, errors };
};
