// Cleans the pricing sent from the Admin panel before it is saved: only known fields, plain
// strings and whole-rupee numbers, sensible limits. Problems an editor must fix come back as a list.

const LAYOUTS = ["tiers", "rates", "duo"];
const LIMITS = { categories: 12, plans: 12, details: 10, services: 20, budgetRanges: 10 };

const text = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const flag = (value) => value === true;
const rupees = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 && n <= 1e9 ? Math.round(n) : NaN;
};
const lines = (value, maxItems, maxLength) =>
  (Array.isArray(value) ? value : []).map((v) => text(v, maxLength)).filter(Boolean).slice(0, maxItems);
const slugify = (value) =>
  text(value, 60)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const cleanPlan = (raw, where, errors) => {
  const p = raw && typeof raw === "object" ? raw : {};
  const price = p.price && typeof p.price === "object" ? p.price : {};
  const name = text(p.name, 80);
  const from = rupees(price.from);
  const to = rupees(price.to);
  const confirmed = p.confirmed !== false;
  const label = name || "a plan";

  if (!name) errors.push(`${where}: every plan needs a name.`);
  if (Number.isNaN(from) || Number.isNaN(to)) errors.push(`${where} › ${label}: prices must be whole numbers in rupees.`);
  if (confirmed && from === null) errors.push(`${where} › ${label}: add a starting price, or untick "Price confirmed".`);
  if (from !== null && to !== null && to < from) errors.push(`${where} › ${label}: the top of the range is lower than the start.`);

  return {
    name,
    price: {
      from: Number.isNaN(from) ? null : from,
      to: Number.isNaN(to) ? null : to,
      plus: flag(price.plus),
      fixed: flag(price.fixed),
      unit: text(price.unit, 24),
    },
    confirmed,
    fit: text(p.fit, 240),
    details: lines(p.details, LIMITS.details, 120),
    tag: text(p.tag, 30),
    featured: flag(p.featured),
    review: text(p.review, 500),
  };
};

/**
 * @returns {{ pricing: { categories: object[], budgetRanges: string[] }, errors: string[] }}
 */
export const cleanPricing = (body) => {
  const errors = [];
  const rawCategories = Array.isArray(body?.categories) ? body.categories : [];
  if (rawCategories.length > LIMITS.categories) errors.push(`At most ${LIMITS.categories} service sections.`);

  const usedSlugs = new Set();
  const categories = rawCategories.slice(0, LIMITS.categories).map((raw, i) => {
    const c = raw && typeof raw === "object" ? raw : {};
    const title = text(c.title, 80);
    const where = title || `Section ${i + 1}`;
    if (!title) errors.push(`Section ${i + 1}: a title is needed.`);

    // The slug is the section's address (/pricing#price-<slug>); keep it unique.
    let slug = slugify(c.slug) || slugify(title) || `section-${i + 1}`;
    for (let n = 2; usedSlugs.has(slug); n += 1) slug = `${slugify(c.slug) || slugify(title)}-${n}`;
    usedSlugs.add(slug);

    const rawPlans = Array.isArray(c.plans) ? c.plans : [];
    if (rawPlans.length > LIMITS.plans) errors.push(`${where}: at most ${LIMITS.plans} plans.`);

    return {
      slug,
      number: text(c.number, 4) || String(i + 1).padStart(2, "0"),
      title,
      kicker: text(c.kicker, 30),
      blurb: text(c.blurb, 300),
      layout: LAYOUTS.includes(c.layout) ? c.layout : "tiers",
      note: text(c.note, 300),
      services: lines(c.services, LIMITS.services, 40),
      plans: rawPlans.slice(0, LIMITS.plans).map((p) => cleanPlan(p, where, errors)),
    };
  });

  return {
    pricing: { categories, budgetRanges: lines(body?.budgetRanges, LIMITS.budgetRanges, 60) },
    errors,
  };
};
