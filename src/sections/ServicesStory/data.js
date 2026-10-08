// Services page: groups the CMS services into chapters by category, in the order they first appear.
// Copy here only describes what each category covers — no metrics or claims.

const CHAPTER_BLURB = {
  Build: "Websites, apps and systems, designed and engineered to perform.",
  Social: "A brand presence shaped by strategy, then kept active every day.",
  Content: "Footage, edits and content systems that carry your story.",
  Growth: "Getting found on Google and in AI answers, and reaching the right audience.",
};

export const pad = (n) => String(n).padStart(2, "0");

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "services";

// -> [{ key, slug, blurb, index, items: [{ service, n }] }]  (`n` is the 0-based position in the whole page)
export const groupServices = (services) => {
  const order = [];
  const map = new Map();
  services.forEach((service) => {
    const key = (service.category || "").trim() || "Services";
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key).push(service);
  });
  let n = 0;
  return order.map((key, index) => ({
    key,
    slug: slugify(key),
    blurb: CHAPTER_BLURB[key] || "",
    index,
    items: map.get(key).map((service) => ({ service, n: n++ })),
  }));
};
