// SEO for every page, in one place. Used in the browser (title and tags while moving between
// pages, see components/RouteSeo.jsx) and at build time by scripts/prerender-seo.mjs, which writes a
// static head, structured data and a crawlable copy of each page, plus the sitemap and llms.txt.
// Main pages are listed here; service, industry and blog pages are generated from their data files.
//
// Target keywords: website development, website, premium website, application development,
// digital agency, social media handling. Every line here must stay true to what the page says:
// `kicker` is the small keyword line inside each page's H1, `h1` the slogan after it, and `lead` the
// intro under it; the heroes import `kicker` and `lead`, so the page and its crawlable copy match.
import { defaultServices, defaultCompanyInfo } from "./initialData.js";
import { SERVICE_PAGES } from "./servicePages.js";
import { INDUSTRIES } from "./industries.js";
import { POSTS } from "./blog.js";

export const SITE_URL = "https://www.pixiedigitalcreatives.com";
export const SITE_NAME = "Pixie Digital Creatives";
export const OG_IMAGE = "/brand/og-image.png";
export const LOGO = "/brand/favicon-192.png";

const MAIN_PAGES = [
  {
    path: "/",
    title: "Website & App Development Agency | Pixie Digital Creatives",
    description:
      "Digital agency for premium website development, app development and social media handling. We design, build and grow websites and apps for ambitious brands.",
    kicker: "Digital agency for premium websites & apps",
    h1: "Brands That Inspire Growth",
    lead:
      "A digital agency for premium website development, application development and social media handling. We design, develop and market digital experiences that help businesses grow and stand out.",
    listServices: true,
  },
  {
    path: "/services",
    title: "Website & App Development Services | Pixie Digital Creatives",
    description:
      "Website development, application development, CRM, social media handling, content, video, SEO and ads: every digital service your business needs, from one team.",
    kicker: "Website development, apps & social media handling",
    h1: "Design, build, create and grow.",
    lead:
      "Website development, application development, CRM, content, social media handling, video and digital growth, handled by one team.",
    crumb: "Services",
    listServices: true,
  },
  {
    path: "/pricing",
    title: "Website & App Development Pricing | Pixie Digital Creatives",
    description:
      "Starting prices in INR for website development, app development, SEO, social media handling and video. Every project is scoped with you before you get a quote.",
    kicker: "Website & app development pricing",
    h1: "Clear pricing, built around you.",
    lead:
      "Starting prices for website development, app development, social media handling and everything else we do, in one place. Every project is scoped with you first, so your final quote fits what you actually need.",
    crumb: "Pricing",
  },
  {
    path: "/portfolio",
    title: "Portfolio: Premium Websites & Apps | Pixie Digital Creatives",
    description:
      "Premium websites, web applications and brands designed and built by Pixie Digital Creatives. See our recent website development and app projects.",
    kicker: "Premium websites & apps we've built",
    h1: "Work that speaks for itself.",
    lead: "A selection of the premium websites, web applications and digital products we have designed and built.",
    crumb: "Portfolio",
  },
  {
    path: "/about",
    title: "About Our Digital Agency | Pixie Digital Creatives",
    description:
      "Pixie Digital Creatives is a boutique digital agency helping founders and businesses turn ideas into premium websites, apps and digital experiences.",
    kicker: "About our digital agency",
    h1: "A small studio that makes things on purpose.",
    lead:
      "Pixie Digital Creatives is a boutique digital agency and creative technology studio helping ambitious founders, businesses and creators turn bold ideas into premium websites, apps and high-impact digital experiences.",
    crumb: "About",
  },
  {
    path: "/process",
    title: "Our Website Development Process | Pixie Digital Creatives",
    description:
      "How we run website and app development projects: seven clear steps from the first call to launch day, each with its own deliverables.",
    kicker: "Our website & app development process",
    h1: "From first call to launch day.",
    lead:
      "How we run website and app development projects: seven steps, each with clear deliverables, so you always know what is happening and what comes next.",
    crumb: "Process",
  },
  {
    path: "/contact",
    title: "Start Your Website or App Project | Pixie Digital Creatives",
    description:
      "Planning a website, app or social media project? Tell us what you are building and the Pixie Digital Creatives team will reply within 24 hours.",
    kicker: "Start your website or app project",
    h1: "Tell us what you're building.",
    lead:
      "Planning a website, app or social media project? We partner with founders and businesses globally. Reach out in your preferred currency and we'll reply within 24 hours.",
    crumb: "Contact",
  },
  {
    path: "/brochure",
    title: "Brochure | Pixie Digital Creatives",
    description:
      "The Pixie Digital Creatives brochure: our website development, app development, social media and growth services in a page-turning book.",
    h1: "Brochure",
    lead: "Our website development, app development, social media and growth services, in a page-turning book.",
    crumb: "Brochure",
  },
  {
    path: "/company-profile",
    title: "Company Profile | Pixie Digital Creatives",
    description:
      "The Pixie Digital Creatives company profile: who we are, our website, app and social media services, our process and pricing, in a page-turning book.",
    h1: "Company Profile",
    lead: "Who we are, our website, app and social media services, our process and pricing, in a page-turning book.",
    crumb: "Company Profile",
  },
  {
    path: "/admin",
    title: "CMS Admin | Pixie Digital Creatives",
    description: "Content management for the Pixie Digital Creatives website.",
    h1: "CMS Studio Access",
    lead: "Sign in with your administrator credentials to continue.",
    noindex: true,
  },
];

// Any path the site does not have: the app shows its 404 page, and search engines are told not to index it.
export const NOT_FOUND = {
  path: null,
  title: "Page Not Found | Pixie Digital Creatives",
  description: "The link may be old, or the page has moved.",
  noindex: true,
};

// Content pages generated from their data files. `kind` tells the build step which template to use;
// `parent` adds the middle breadcrumb (Home > Services > Website Development).
const SERVICES_CRUMB = { name: "Services", path: "/services" };
const INDUSTRIES_CRUMB = { name: "Industries", path: "/industries" };
const BLOG_CRUMB = { name: "Blog", path: "/blog" };

const CONTENT_PAGES = [
  ...SERVICE_PAGES.map((s) => ({
    path: `/services/${s.slug}`, kind: "service", slug: s.slug, title: s.title, description: s.description,
    kicker: s.kicker, h1: s.h1, lead: s.lead, crumb: s.name, parent: SERVICES_CRUMB,
  })),
  {
    path: "/industries", kind: "industries", title: "Industries We Build For | Pixie Digital Creatives",
    description: "Website and app development for restaurants and cafés, e-commerce brands, fitness businesses and creators, each backed by real Pixie Digital Creatives projects.",
    kicker: "Industries", h1: "Built for the way your industry works.",
    lead: "Every industry needs something different from its website. These are the industries we have designed and built for, with the real projects behind them.",
    crumb: "Industries",
  },
  ...INDUSTRIES.map((i) => ({
    path: `/industries/${i.slug}`, kind: "industry", slug: i.slug, title: i.title, description: i.description,
    kicker: i.kicker, h1: i.h1, lead: i.lead, crumb: i.name, parent: INDUSTRIES_CRUMB,
  })),
  {
    path: "/blog", kind: "blog", title: "Blog: Websites, SEO & AI Search Guides | Pixie Digital Creatives",
    description: "Practical guides on website development, SEO, AEO and GEO from Pixie Digital Creatives: comparisons, checklists and how-to articles for growing businesses.",
    kicker: "Blog", h1: "Guides for building and growing online.",
    lead: "Practical articles on website development, SEO, AEO and GEO: what they are, how they compare and what to do first.",
    crumb: "Blog",
  },
  {
    path: "/faq", kind: "faq", title: "Frequently Asked Questions | Pixie Digital Creatives",
    description: "Answers about Pixie Digital Creatives: who we are, who founded the studio, where we work, our services, industries, previous work, prices and how to start.",
    kicker: "Frequently asked questions", h1: "Questions about working with us.",
    lead: "Short, straight answers about who we are, how we work and how to start a project. Questions about a single service are answered on that service's page.",
    crumb: "FAQ",
  },
  ...POSTS.map((p) => ({
    path: `/blog/${p.slug}`, kind: "post", slug: p.slug, description: p.description,
    // brand suffix only when it still fits in a search result
    title: `${p.title} | Pixie Digital Creatives`.length <= 65 ? `${p.title} | Pixie Digital Creatives` : p.title,
    kicker: p.kicker, h1: p.title, lead: p.lead, crumb: p.title, parent: BLOG_CRUMB,
  })),
];

export const PAGES = [...MAIN_PAGES, ...CONTENT_PAGES];

// Case studies (/work/<slug>) come from the CMS, so their page sets its own tags (see useSeo).
export const DYNAMIC = { dynamic: true };

const normalize = (pathname) => (pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname) || "/";

export const seoPage = (pathname) => {
  const path = normalize(pathname);
  if (path.startsWith("/work/")) return DYNAMIC;
  return PAGES.find((p) => p.path === path) || NOT_FOUND;
};

export const absoluteUrl = (path) => `${SITE_URL}${path}`;

// Real offerings shown on the site (Services page, Home); used for the crawlable copy and structured data.
export const SERVICES = defaultServices.map(({ title, description, category }) => ({ title, description, category }));
export const COMPANY = defaultCompanyInfo;
