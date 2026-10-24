// Pricing page (/pricing).
//
// Prices are edited in the Admin panel (tab "Pricing & Plans") and stored in the database. The lists
// below are the built-in starting point: the site shows them until pricing is first saved from the
// Admin, and the Admin's "Load built-in prices" puts them back into the editor.
//
// All amounts are Indian Rupees, written as plain numbers (12000, not "12k"); the page formats them
// in the Indian style (₹1,50,000).
//
// A plan:
//   name        plan title
//   price       { from, to, plus, unit }
//                 from only       -> "Starting at ₹50,000"
//                 fixed: true     -> one flat price: "₹5,000"
//                 from + to       -> "₹12,000 – ₹30,000"
//                 plus: true      -> "+" after the top of the range
//                 unit            -> shown after the price ("/month", "/reel"). Only set it once the
//                                    billing period / unit is confirmed; leave it out otherwise.
//   confirmed   false -> the price is NOT shown; the card says "Quote on request" until confirmed.
//   fit         who the plan suits (optional)
//   details     short scope lines (confirmed facts only)
//   tag         optional label on the card
//   featured    true -> the emphasised card of its category
//   review      internal note on what still needs confirming. Never shown on the site.
//
// A category:
//   slug, number, title, kicker, blurb
//   layout      "tiers" (cards), "rates" (a rate list), "duo" (two cards + a note)
//   note        optional line under the plans
//   services    `visual` keys of the services on /services that link to this category

export const DEFAULT_PRICING = [
  {
    slug: "website",
    number: "01",
    title: "Website Development",
    kicker: "Websites",
    blurb: "From a focused business site to a custom platform, designed and built by one team.",
    layout: "tiers",
    services: ["web", "wordpress", "stack"],
    plans: [
      {
        name: "Basic / Static Website",
        price: { from: 12000, to: 30000 },
        fit: "Basic business websites and landing pages.",
        details: ["Approximately 5–10 pages"],
      },
      {
        name: "Small Business / CMS Website",
        price: { from: 30000, to: 100000 },
        fit: "Business websites with content management requirements.",
        details: [],
      },
      {
        name: "E-commerce Website",
        price: { from: 50000, to: 200000, plus: true },
        fit: "Online stores and product-selling businesses.",
        details: [],
      },
      {
        name: "Enterprise Platform",
        price: { from: 150000, to: 300000, plus: true },
        fit: "Complex, custom business platforms.",
        details: [],
        tag: "Custom build",
        featured: true,
      },
    ],
  },
  {
    slug: "apps",
    number: "02",
    title: "Application Development",
    kicker: "Android & iOS",
    blurb: "Mobile apps for Android and iOS, from a first version to a full shopping experience.",
    layout: "tiers",
    services: ["app"],
    plans: [
      {
        name: "MVP / Simple Application",
        price: { from: 50000 },
        fit: "An initial product or a simple mobile application.",
        details: [],
      },
      {
        name: "Service Application",
        price: { from: 100000, to: 300000, plus: true },
        fit: "Service-based businesses and booking-oriented applications.",
        details: [],
      },
      {
        name: "E-commerce Application",
        price: { from: 250000, to: 700000, plus: true },
        fit: "Businesses that need mobile shopping and e-commerce features.",
        details: [],
        tag: "Full commerce",
        featured: true,
      },
    ],
  },
  {
    slug: "seo",
    number: "03",
    title: "SEO & AI Search Visibility",
    kicker: "Search",
    blurb: "Be found on Google and in AI answers: local SEO, technical SEO and high-competition search.",
    layout: "tiers",
    services: ["search", "ai", "answer"],
    note: "Billing terms are confirmed in your proposal.",
    plans: [
      {
        name: "Starter",
        price: { from: 15000, to: 20000 },
        fit: "Local SEO and AI search visibility.",
        details: [],
        review: "Billing period not stated (monthly, one-time or per project).",
      },
      {
        name: "Growth",
        price: { from: 21000, to: 40000 },
        fit: "Full technical SEO.",
        details: [],
        review: "Billing period not stated (monthly, one-time or per project).",
      },
      {
        name: "High-Competition",
        price: { from: 50000, to: 80000 },
        fit: "High-competition SEO and multi-location setup.",
        details: [],
        tag: "Multi-location",
        featured: true,
        review: "Billing period not stated (monthly, one-time or per project).",
      },
    ],
  },
  {
    slug: "social",
    number: "04",
    title: "Social Media Management",
    kicker: "Social",
    blurb: "Consistent, on-brand social channels, from one platform to full-service management.",
    layout: "tiers",
    services: ["social", "handling"],
    note: "Billing terms are confirmed in your proposal.",
    plans: [
      {
        name: "Starter",
        price: { from: 5000, fixed: true, unit: "/month" },
        details: ["20 posts", "1 social media platform"],
      },
      {
        name: "Growth",
        price: { from: 10000, to: 15000 },
        details: ["Approximately 30 posts", "2 social media platforms"],
        review: "Billing period not stated (the Starter plan is per month).",
      },
      {
        name: "Full-Service Agency",
        price: { from: 30000, to: 80000 },
        fit: "Full-service social media management and marketing.",
        details: ["3 social media platforms"],
        tag: "Full service",
        featured: true,
        review: "Billing period and number of posts / deliverables not stated.",
      },
    ],
  },
  {
    slug: "video",
    number: "05",
    title: "Video Production & Editing",
    kicker: "Video",
    blurb: "Reels, local brand content and promotional videos: edited, or shot and edited for you.",
    layout: "rates",
    services: ["edit", "shoot"],
    plans: [
      {
        name: "Basic Video Editing",
        price: { from: 300, to: 1000 },
        fit: "Basic edits, transitions and captions.",
        details: [],
        review: "Billing unit not stated (per video is assumed in the notes, not written).",
      },
      {
        name: "Professional Video Editing",
        price: { from: 1000, to: 4000 },
        fit: "Dynamic editing, motion graphics, sound design and custom typography.",
        details: [],
        review: "Billing unit not stated (per video is assumed in the notes, not written).",
      },
      {
        name: "Shoot + Edit",
        price: { from: 1000, to: 5000, unit: "/reel" },
        fit: "We shoot and edit the reel for you.",
        details: [],
      },
      {
        name: "Shoot + Edit Package",
        price: { from: 25000, to: 60000 },
        confirmed: false,
        fit: "A package of shoot + edit deliverables, agreed with you.",
        details: [],
        review: "Notes say ₹25,000–₹60,000 for approximately 10–20 deliverables. Confirm deliverables and scope, then set confirmed: true.",
      },
      {
        name: "Full-Day Agency Production",
        price: { from: 6000, to: 15000, plus: true },
        confirmed: false,
        fit: "Full-day production service.",
        details: [],
        review: "Confirm whether ₹6,000–₹15,000+ is the agency service fee, the shoot fee or another unit, then set confirmed: true.",
      },
    ],
  },
  {
    slug: "influencer",
    number: "06",
    title: "Models & Influencer Marketing",
    kicker: "Creators",
    blurb: "Collaborations with models and influencers for your shoots and campaigns.",
    layout: "duo",
    services: [],
    note: "Final pricing depends on the creator, deliverables, usage rights and campaign requirements. We don't guarantee specific reach or results.",
    plans: [
      {
        name: "Half-Day Collaboration",
        price: { from: 2500, to: 5000 },
        fit: "A half-day collaboration with a model or influencer.",
        details: [],
      },
      {
        name: "Full-Day Collaboration",
        price: { from: 5000, to: 7000 },
        confirmed: false,
        fit: "A full-day collaboration with a model or influencer.",
        details: [],
        review: "The notes mark ₹5,000–₹7,000 as needing confirmation. Confirm, then set confirmed: true.",
      },
    ],
  },
];

// Budget choices in the custom proposal form
export const DEFAULT_BUDGET_RANGES = [
  "Under ₹25,000",
  "₹25,000 – ₹1,00,000",
  "₹1,00,000 – ₹3,00,000",
  "₹3,00,000 – ₹7,00,000",
  "₹7,00,000+",
  "Not sure yet",
];

const inr = (amount) => `₹${amount.toLocaleString("en-IN")}`;

// A price is shown only when it is confirmed and has a starting amount.
export const isConfirmed = (plan) => plan.confirmed !== false && Number.isFinite(plan.price?.from);

// { from: "₹12,000", to: "₹30,000", unit, startingAt } for display, or null when not confirmed.
export const priceParts = (plan) => {
  if (!isConfirmed(plan)) return null;
  const { from, to, plus, unit, fixed } = plan.price;
  return {
    from: inr(from),
    to: to ? `${inr(to)}${plus ? "+" : ""}` : null,
    unit: unit || null,
    startingAt: !to && !fixed,
  };
};

export const priceText = (plan) => {
  const p = priceParts(plan);
  if (!p) return "Quote on request";
  const range = p.to ? `${p.from} – ${p.to}` : p.startingAt ? `Starting at ${p.from}` : p.from;
  return p.unit ? `${range} ${p.unit}` : range;
};

// Lowest confirmed starting price of a category, for the overview ("from ₹12,000").
export const categoryFrom = (category) => {
  const prices = (category.plans || []).filter(isConfirmed).map((p) => p.price.from);
  return prices.length ? inr(Math.min(...prices)) : null;
};

// The pricing category for a service on /services (by its `visual` key), if it has one.
export const pricingForService = (categories, visual) =>
  (categories || []).find((c) => (c.services || []).includes(visual)) || null;
