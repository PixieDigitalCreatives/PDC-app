// Company questions for /faq: who the studio is, who runs it, where it works and how to start.
// Questions about a single service live on that service page, so no question is answered twice.
// Founders and projects come from the CMS (pass them in); a question is left out when its data is
// missing, never filled with a guess. Used by the page and by the build step (FAQPage structured data).
import { BRAND } from "./brand.js";
import { SERVICE_PAGES } from "./servicePages.js";
import { INDUSTRIES } from "./industries.js";
import { projectStatus } from "./projects.js";

// "a, b and c"
const joinAnd = (items) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`);

const socialNames = { instagram: "Instagram", linkedin: "LinkedIn", twitter: "X", facebook: "Facebook" };

export const companyFaqs = ({ team = [], projects = [] } = {}) => {
  const founders = team.filter((t) => /founder/i.test(t.role || ""));
  const socials = Object.keys(BRAND.socials).filter((k) => BRAND.socials[k]).map((k) => socialNames[k] || k);
  const projectText = (p) => {
    const status = projectStatus(p);
    return `${p.title} (${p.type || p.category}${status === "Live" ? "" : `, ${status.toLowerCase()}`})`;
  };

  return [
    {
      q: "What is Pixie Digital Creatives?",
      a: `Pixie Digital Creatives (PDC) is a remote digital studio working with clients worldwide. ${BRAND.description} Our services are ${joinAnd(SERVICE_PAGES.map((s) => s.term))}.`,
      links: [{ to: "/services", label: "All services" }],
    },
    founders.length > 0 && {
      q: "Who founded Pixie Digital Creatives?",
      a: `The founders of Pixie Digital Creatives are ${joinAnd(founders.map((f) => `${f.name} (${f.role})`))}.`,
      links: [{ to: "/about", label: "Meet the team" }],
    },
    {
      q: "Where is Pixie Digital Creatives based?",
      a: `We are a remote digital studio and work with clients worldwide, so there is no public office address. You can reach us by email at ${BRAND.email} or by phone on ${BRAND.phone}.`,
    },
    {
      q: "Do you work with clients outside India?",
      a: "Yes. We work remotely with businesses worldwide. Prices on our website are in Indian rupees (INR); if you are outside India, ask for a quote in your currency.",
    },
    {
      q: "What services does Pixie Digital Creatives offer?",
      a: `${joinAnd(SERVICE_PAGES.map((s) => s.name))}, plus CRM setup, content creation and video production and editing. Each service has its own page with what is included, prices and common questions.`,
      links: [{ to: "/services", label: "Our services" }, { to: "/pricing", label: "Pricing" }],
    },
    {
      q: "Which industries do you work with?",
      a: `We have designed and built for ${INDUSTRIES.length} industries: ${INDUSTRIES.map((i) => i.who).slice(0, -1).join("; ")}; and ${INDUSTRIES[INDUSTRIES.length - 1].who}. Each industry page shows the real projects behind it.`,
      links: [{ to: "/industries", label: "Industries we build for" }],
    },
    projects.length > 0 && {
      q: "Can I see your previous work?",
      a: `Yes. Our portfolio includes ${joinAnd(projects.map(projectText))}. Each project has its own case study.`,
      links: [{ to: "/portfolio", label: "See the portfolio" }],
    },
    {
      q: "How do I start a project with Pixie Digital Creatives?",
      a: "Tell us what you are planning through the contact page, by email or by phone. We reply within 24 hours, then start with a discovery conversation about your goals before we propose a scope and a quote.",
      links: [{ to: "/contact", label: "Contact us" }, { to: "/process", label: "How a project runs" }],
    },
    {
      q: "How are your prices set?",
      a: "Our pricing page lists starting prices in INR for every service. Each project is then scoped with you, so the final quote reflects the pages, features and content you actually need.",
      links: [{ to: "/pricing", label: "See pricing" }, { to: "/blog/website-cost-in-india", label: "Website cost guide" }],
    },
    {
      q: "How can I contact Pixie Digital Creatives?",
      a: `By email at ${BRAND.email}, by phone on ${BRAND.phone}, through the contact form on our website, or on ${joinAnd(socials)}.`,
      links: [{ to: "/contact", label: "Contact page" }],
    },
  ].filter(Boolean);
};
