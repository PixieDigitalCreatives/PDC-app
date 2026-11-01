// Runs after `vite build` (see the "build" script). For every page it writes a static HTML file with
// the page's own head (title, description, canonical, social tags), structured data (JSON-LD) and the
// page's real content as semantic HTML, so search engines and AI crawlers that don't run JavaScript
// (OAI-SearchBot, PerplexityBot, ClaudeBot, link previews) read the same words visitors see. React
// replaces that copy as soon as the app starts. Also writes 404.html, sitemap.xml and llms.txt.
//
// Sources: src/data/* for pages and copy; the live CMS (projects, team, stats, pricing) fetched at
// build time. If the CMS can't be reached, the build still succeeds without the CMS-based parts.
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PAGES, NOT_FOUND, SITE_URL, SITE_NAME, OG_IMAGE, LOGO, absoluteUrl } from "../src/data/seo.js";
import { BRAND, SAME_AS } from "../src/data/brand.js";
import { JOURNEY_CHAPTERS, PILLARS_COPY, MANIFESTO, PROCESS_PHASES } from "../src/data/siteCopy.js";
import { SERVICE_PAGES, servicePage, servicePathFor } from "../src/data/servicePages.js";
import { INDUSTRIES, industryPage } from "../src/data/industries.js";
import { POSTS, blogPost, readingMinutes, postWords } from "../src/data/blog.js";
import { DEFAULT_PRICING, categoryRange, priceText } from "../src/data/pricing.js";
import { companyFaqs } from "../src/data/faq.js";
import { defaultServices } from "../src/data/initialData.js";
import { CHAPTER_BLURB } from "../src/sections/ServicesStory/data.js";
import { caseStudyMeta, projectServiceSlug, projectSlug, projectStatus } from "../src/data/projects.js";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const template = readFileSync(path.join(dist, "index.html"), "utf8");
const CMS_URL = process.env.CMS_URL || `${SITE_URL}/api/cms/all`;

// ---- CMS ------------------------------------------------------------------------------------------
const loadCms = async () => {
  try {
    const res = await fetch(CMS_URL, { signal: AbortSignal.timeout(45000) });
    const data = await res.json();
    if (!data.success) throw new Error("no success flag");
    return data;
  } catch (err) {
    console.warn(`prerender-seo  CMS not reachable (${err.message}): projects, team, stats and prices are left out`);
    return null;
  }
};
const cms = await loadCms();
const projects = cms?.portfolio || [];
const team = cms?.team || [];
const stats = cms?.stats || [];
// Prices are shown only when they are known to match the site: the database copy, or the built-in
// prices when the database has none yet. If the CMS was unreachable, plan names are shown without prices.
const pricing = cms ? (cms.pricing?.categories?.length ? cms.pricing.categories : DEFAULT_PRICING) : DEFAULT_PRICING;
const showPrices = Boolean(cms);

// ---- HTML helpers ---------------------------------------------------------------------------------
const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const a = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;
const ul = (items, ordered = false) => (items.length ? `<${ordered ? "ol" : "ul"}>${items.map((i) => `<li>${i}</li>`).join("")}</${ordered ? "ol" : "ul"}>` : "");
const section = (title, body) => `<section><h2>${esc(title)}</h2>${body}</section>`;
const qa = (faqs) =>
  faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>${f.links?.length ? `<p>${f.links.map((l) => a(l.to, l.label)).join(" · ")}</p>` : ""}`).join("");
const checklist = (items) => ul(items.map(esc));
const h1 = (page) => `<h1>${page.kicker ? `<span class="h1-kicker">${esc(page.kicker)}</span> ` : ""}${esc(page.h1)}</h1>`;

const SERVICE_LINKS = SERVICE_PAGES.map((s) => ({ path: `/services/${s.slug}`, name: s.name }));
const NAV = [
  { path: "/", name: "Home" }, { path: "/services", name: "Services" }, { path: "/pricing", name: "Pricing" },
  { path: "/portfolio", name: "Portfolio" }, { path: "/industries", name: "Industries" }, { path: "/process", name: "Process" },
  { path: "/about", name: "About" }, { path: "/blog", name: "Blog" }, { path: "/faq", name: "FAQ" }, { path: "/contact", name: "Contact" },
];

const chrome = (main) =>
  `<div class="seo-prerender">` +
  `<header><a href="/"><img src="${LOGO}" alt="${esc(SITE_NAME)} logo" width="48" height="48"> <strong>${esc(SITE_NAME)}</strong></a>` +
  `<nav aria-label="Primary">${NAV.map((n) => a(n.path, n.name)).join(" ")}</nav></header>` +
  `<main>${main}</main>` +
  `<footer><p><strong>${esc(SITE_NAME)}</strong>: ${esc(BRAND.description)} ${esc(BRAND.workStyle)}.</p>` +
  `<p>Email: <a href="mailto:${esc(BRAND.email)}">${esc(BRAND.email)}</a> · Phone: <a href="${BRAND.phoneHref}">${esc(BRAND.phone)}</a></p>` +
  `<p>Services: ${SERVICE_LINKS.map((s) => a(s.path, s.name)).join(" · ")}</p>` +
  `<p>Follow us: ${Object.entries(BRAND.socials).map(([k, v]) => a(v, k[0].toUpperCase() + k.slice(1))).join(" · ")}</p></footer>` +
  `</div>`;

const projectLine = (p) =>
  `<h3>${a(`/work/${projectSlug(p.title)}`, p.title)}</h3><p>${esc(p.type || p.category)} · ${esc(projectStatus(p))}${p.year ? ` · ${esc(p.year)}` : ""}</p><p>${esc(p.description)}</p>`;
const planLines = (cat) =>
  ul((cat.plans || []).map((p) =>
    `<strong>${esc(p.name)}</strong>${showPrices ? `: ${esc(priceText(p))}` : ""}${p.fit ? `. ${esc(p.fit)}` : ""}${p.details?.length ? ` (${esc(p.details.join(", "))})` : ""}`));
const statsLine = () => (stats.length ? ul(stats.map((s) => `<strong>${esc(s.number)}</strong> ${esc(s.label)}`)) : "");

// ---- Page content ---------------------------------------------------------------------------------
const byCategory = () => {
  const order = [];
  const map = new Map();
  defaultServices.forEach((s) => {
    if (!map.has(s.category)) { map.set(s.category, []); order.push(s.category); }
    map.get(s.category).push(s);
  });
  return order.map((c) => ({ category: c, items: map.get(c) }));
};
const serviceItem = (s) => {
  const link = servicePathFor(s.visual);
  return `<strong>${link ? a(link, s.title) : esc(s.title)}</strong>: ${esc(s.description)}${s.points?.length ? ` (${esc(s.points.join(", "))})` : ""}`;
};

const MAIN_CONTENT = {
  "/": (page) =>
    h1(page) + `<p>${esc(page.lead)}</p>` +
    section("From idea to growth, in four chapters", JOURNEY_CHAPTERS.map((c) => `<h3>${esc(c.key)}: ${esc(c.title)}</h3><p>${esc(c.text)}</p>`).join("")) +
    section("Everything you need to build and grow your brand", ul(defaultServices.map(serviceItem))) +
    (stats.length ? section("In numbers", statsLine()) : "") +
    (projects.length ? section("Our recent projects", projects.filter((p) => p.featured).map(projectLine).join("")) : "") +
    (team.length ? section("The people behind the studio", ul(team.map((t) => `<strong>${esc(t.name)}</strong>, ${esc(t.role)}`))) : ""),
  "/services": (page) =>
    h1(page) + `<p>${esc(page.lead)}</p>` +
    byCategory().map(({ category, items }) => section(category, `<p>${esc(CHAPTER_BLURB[category] || "")}</p>${ul(items.map(serviceItem))}`)).join("") +
    section("Service guides", ul(SERVICE_PAGES.map((s) => `${a(`/services/${s.slug}`, s.name)}: ${esc(s.description)}`))),
  "/pricing": (page) =>
    h1(page) + `<p>${esc(page.lead)}</p><p>Prices are in Indian rupees (INR). Visitors outside India can ask for a quote in their currency.</p>` +
    pricing.map((c) => {
      const svc = SERVICE_PAGES.find((s) => s.pricingSlug === c.slug);
      return section(c.title, `<p>${esc(c.blurb || "")}</p>${planLines(c)}${c.note ? `<p>${esc(c.note)}</p>` : ""}${svc ? `<p>${a(`/services/${svc.slug}`, `About our ${svc.name} service`)}</p>` : ""}`);
    }).join(""),
  "/portfolio": (page) =>
    h1(page) + `<p>${esc(page.lead)}</p>` +
    (projects.length ? section("Projects", projects.map(projectLine).join("")) : "<p>New work is coming soon.</p>"),
  "/about": (page) =>
    h1(page) + `<p>${esc(page.lead)}</p>` +
    section("Why we started", `<p>${esc(MANIFESTO.text)}</p><p>${esc(MANIFESTO.sub)}</p>${statsLine()}`) +
    section("How we work", PILLARS_COPY.map((p) => `<h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p>`).join("")) +
    (team.length ? section("Leadership", team.map((t) => `<h3>${esc(t.name)}</h3><p>${esc(t.role)}</p>${t.bio ? `<p>${esc(t.bio)}</p>` : ""}`).join("")) : ""),
  "/process": (page) =>
    h1(page) + `<p>${esc(page.lead)}</p>` +
    PROCESS_PHASES.map((p, i) => section(`${String(i + 1).padStart(2, "0")}. ${p.name}`, `<p>${esc(p.tagline)}</p><p>${esc(p.desc)}</p><p>What this step delivers:</p>${ul(p.deliverables.map(esc))}`)).join(""),
  "/contact": (page) =>
    h1(page) + `<p>${esc(page.lead)}</p>` +
    section("Contact details", ul([
      `Email: <a href="mailto:${esc(BRAND.email)}">${esc(BRAND.email)}</a>`,
      `Phone: <a href="${BRAND.phoneHref}">${esc(BRAND.phone)}</a>`,
      esc(BRAND.workStyle),
      ...Object.entries(BRAND.socials).map(([k, v]) => `${esc(k[0].toUpperCase() + k.slice(1))}: ${a(v, v)}`),
    ])) +
    section("Before you get in touch", `<p>See ${a("/pricing", "our pricing")}, ${a("/process", "how a project runs")} and ${a("/portfolio", "our work")}.</p>`),
  "/brochure": (page) => h1(page) + `<p>${esc(page.lead)}</p>` + section("Inside the brochure", ul(SERVICE_LINKS.map((s) => a(s.path, s.name)))),
  "/company-profile": (page) => h1(page) + `<p>${esc(page.lead)}</p>` +
    section("Inside the company profile", ul([a("/about", "Who we are"), a("/services", "Our services"), a("/process", "Our process"), a("/pricing", "Pricing"), a("/contact", "Contact")])),
  "/admin": (page) => h1(page) + `<p>${esc(page.lead)}</p>`,
};

// Same sections and question headings as pages/ServiceDetailPage.jsx.
const serviceContent = (page) => {
  const s = servicePage(page.slug);
  const { term } = s;
  const cat = pricing.find((c) => c.slug === s.pricingSlug);
  const guides = POSTS.filter((p) => p.services.includes(s.slug));
  const uses = s.industries.map((u) => ({ ...u, industry: industryPage(u.slug) })).filter((u) => u.industry);
  const steps = s.steps || PROCESS_PHASES.map((p) => ({ name: p.name, text: p.tagline }));
  const cards = (items) => items.map((i) => `<h3>${esc(i.title)}</h3><p>${esc(i.text)}</p>`).join("");
  return (
    h1(page) + `<p>${esc(s.lead)}</p>` +
    section(`What is ${term}?`, `<p>${esc(s.summary)}</p>`) +
    section(`Who is ${term} for?`, checklist(s.audience)) +
    section(`What are the benefits of ${term}?`, cards(s.benefits)) +
    section(`What does our ${term} service include?`, cards(s.includes)) +
    (uses.length ? section(`How is ${term} used in different industries?`, uses.map((u) => `<h3>${a(`/industries/${u.industry.slug}`, u.industry.name)}</h3><p>${esc(u.text)}</p>`).join("")) : "") +
    (cat ? section(`How much does ${term} cost?`, `<p>${esc(s.plansIntro)}</p>${planLines(cat)}${cat.note ? `<p>${esc(cat.note)}</p>` : ""}<p>${a(`/pricing#price-${cat.slug}`, "See full pricing")}</p>`) : "") +
    section(s.steps ? `How does our ${term} service work?` : `How does a ${term} project work?`,
      ul(steps.map((p) => `<strong>${esc(p.name)}</strong>: ${esc(p.text)}`), true) +
      (s.steps ? "" : `<p>${a("/process", "See our full process")}</p>`) +
      `<h3>What you receive</h3>${checklist(s.deliverables)}`) +
    section(`${s.name}: frequently asked questions`, qa(s.faqs)) +
    section("Related services and guides", ul([
      ...s.related.map(servicePage).filter(Boolean).map((r) => a(`/services/${r.slug}`, r.name)),
      ...guides.map((g) => a(`/blog/${g.slug}`, g.title)),
    ]))
  );
};

const industryContent = (page) => {
  const ind = industryPage(page.slug);
  const work = ind.projects.map((t) => projects.find((p) => p.title === t)).filter(Boolean);
  return (
    h1(page) + `<p>${esc(ind.lead)}</p>` +
    section(`What do ${ind.who} need from a website?`, ind.needs.map((n) => `<h3>${esc(n.title)}</h3><p>${esc(n.text)}</p>`).join("")) +
    (work.length ? section(`Which projects have we built for ${ind.who}?`, work.map(projectLine).join("")) : "") +
    section(`How can we help ${ind.who}?`, ul(ind.services.map(servicePage).filter(Boolean).map((s) => `${a(`/services/${s.slug}`, s.name)}: ${esc(s.description)}`))) +
    section(`Questions from ${ind.who}`, qa(ind.faqs))
  );
};

// A pricing category as a sentence and a table (same as PriceTable in pages/BlogPage.jsx). Without the
// CMS the build can't be sure of the prices, so it lists the plan types and points to the pricing page.
const priceBlock = (slug) => {
  const cat = pricing.find((c) => c.slug === slug);
  if (!cat) return "";
  const range = showPrices && categoryRange(cat);
  const head = showPrices ? ["Type", "Price (INR)", "Best for"] : ["Type", "Best for"];
  const rows = cat.plans.map((pl) => [pl.name, ...(showPrices ? [priceText(pl)] : []), [pl.fit?.replace(/\.$/, ""), ...(pl.details || [])].filter(Boolean).join(" · ")]);
  return (
    (range ? `<p>At ${esc(SITE_NAME)}, ${esc(cat.title.toLowerCase())} currently costs from ${esc(range.from)} to ${esc(range.to)}, depending on the type of project:</p>` : "") +
    `<table><thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => (i ? `<td>${esc(c)}</td>` : `<th scope="row">${esc(c)}</th>`)).join("")}</tr>`).join("")}</tbody></table>` +
    `<p>${a(`/pricing#price-${cat.slug}`, `See all current ${cat.title.toLowerCase()} prices`)}</p>`
  );
};

const postContent = (page) => {
  const p = blogPost(page.slug);
  const body = p.sections.map((s) =>
    `<h2>${esc(s.h2)}</h2>` +
    (s.price ? priceBlock(s.price) : "") +
    (s.p || []).map((t) => `<p>${esc(t)}</p>`).join("") +
    (s.table ? `<table><thead><tr>${s.table.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${s.table.rows.map((r) => `<tr>${r.map((c, i) => (i ? `<td>${esc(c)}</td>` : `<th>${esc(c)}</th>`)).join("")}</tr>`).join("")}</tbody></table>` : "") +
    (s.list ? `${s.listLabel ? `<p>${esc(s.listLabel)}</p>` : ""}${ul(s.list.map(esc), s.ordered)}` : "")
  ).join("");
  return (
    `<article>${h1(page)}<p>By ${esc(p.author)} · <time datetime="${p.date}">${esc(p.date)}</time> · ${readingMinutes(p)} min read</p><p>${esc(p.lead)}</p>${body}</article>` +
    section("Related services", ul(p.services.map(servicePage).filter(Boolean).map((s) => a(`/services/${s.slug}`, s.name)))) +
    section("More guides", ul(POSTS.filter((x) => x.slug !== p.slug).map((x) => a(`/blog/${x.slug}`, x.title))))
  );
};

const caseContent = (project) => {
  const service = servicePage(projectServiceSlug(project));
  const industry = INDUSTRIES.find((i) => i.projects.includes(project.title));
  return (
    `<h1><span class="h1-kicker">Case study · ${esc(project.category)}</span> ${esc(project.title)}</h1>` +
    `<p>${esc(project.type)}</p>` +
    section("The project", `<p>${esc(project.description)}</p><dl>` +
      (project.client ? `<dt>Client</dt><dd>${esc(project.client)}</dd>` : "") +
      (project.year ? `<dt>Year</dt><dd>${esc(project.year)}</dd>` : "") +
      `<dt>Category</dt><dd>${esc(project.category)}</dd><dt>Status</dt><dd>${esc(projectStatus(project))}</dd>` +
      (project.liveUrl ? `<dt>Website</dt><dd>${a(project.liveUrl, project.liveUrl)}</dd>` : "") + `</dl>`) +
    (project.tags?.length ? section("Technologies and disciplines", ul(project.tags.map(esc))) : "") +
    section("Related", ul([service && a(`/services/${service.slug}`, service.name), industry && a(`/industries/${industry.slug}`, industry.name), a("/portfolio", "All projects")].filter(Boolean)))
  );
};

const faqs = companyFaqs({ team, projects });
const faqContent = (page) =>
  h1(page) + `<p>${esc(page.lead)}</p>` +
  section("Questions about Pixie Digital Creatives", qa(faqs)) +
  section("Questions about a specific service", ul(SERVICE_PAGES.map((s) => `${a(`/services/${s.slug}#faq`, `${s.name} questions`)}: ${s.faqs.length} questions answered, including "${esc(s.faqs[0].q)}"`)));

const notFoundContent = () =>
  `<h1>Page not found</h1><p>${esc(NOT_FOUND.description)}</p>` +
  section("Where to go next", ul(NAV.map((n) => a(n.path, n.name))));

const listContent = (page, items) => h1(page) + `<p>${esc(page.lead)}</p>` + section(page.crumb, ul(items));

// ---- Structured data ------------------------------------------------------------------------------
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const founders = team.filter((t) => /founder/i.test(t.role || ""));
const personId = (t) => `${SITE_URL}/about#${projectSlug(t.name)}`;
// Placeholder links such as "https://x.com" point at a homepage, not a profile (as on the About page).
const isProfile = (url) => {
  try { return new URL(url).pathname.replace(/\/+$/, "").length > 0; } catch { return false; }
};
// The team as shown on /about (name, role, bio, photo, profiles).
const person = (t) => {
  const sameAs = [t.linkedin, t.twitter, t.github].filter((u) => u && isProfile(u));
  return {
    "@type": "Person",
    "@id": personId(t),
    name: t.name,
    jobTitle: t.role,
    ...(t.bio && { description: t.bio.trim() }),
    ...(t.image && { image: t.image }),
    ...(sameAs.length && { sameAs }),
    worksFor: { "@id": ORG_ID },
  };
};

const organization = (withServices) => ({
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  alternateName: BRAND.shortName,
  url: `${SITE_URL}/`,
  logo: { "@type": "ImageObject", url: absoluteUrl(LOGO), width: 192, height: 192 },
  image: absoluteUrl(OG_IMAGE),
  description: BRAND.description,
  slogan: BRAND.tagline,
  email: BRAND.email,
  telephone: BRAND.phone.replace(/\s+/g, ""),
  areaServed: BRAND.areaServed,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: BRAND.email,
    telephone: BRAND.phone.replace(/\s+/g, ""),
    areaServed: BRAND.areaServed,
    availableLanguage: BRAND.languages,
  },
  sameAs: SAME_AS,
  ...(founders.length && { founder: founders.map((f) => ({ "@type": "Person", "@id": personId(f), name: f.name, jobTitle: f.role })) }),
  knowsAbout: ["Website development", "Premium website design", "Application development", "Social media marketing",
    "Social media handling", "Model and influencer marketing", "Search engine optimisation", "Answer engine optimisation",
    "Generative engine optimisation"],
  ...(withServices && {
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digital agency services",
      itemListElement: SERVICE_PAGES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: absoluteUrl(`/services/${s.slug}`), provider: { "@id": ORG_ID } },
      })),
    },
  }),
});

const website = { "@type": "WebSite", "@id": SITE_ID, url: `${SITE_URL}/`, name: SITE_NAME, publisher: { "@id": ORG_ID }, inLanguage: "en" };

const breadcrumb = (page, url) => {
  const items = [{ name: "Home", item: `${SITE_URL}/` }];
  if (page.parent) items.push({ name: page.parent.name, item: absoluteUrl(page.parent.path) });
  items.push({ name: page.crumb, item: url });
  return { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, ...it })) };
};

const PAGE_TYPES = { "/about": "AboutPage", "/contact": "ContactPage", "/portfolio": "CollectionPage", "/blog": "CollectionPage", "/industries": "CollectionPage", "/faq": "FAQPage" };

// Visible questions and answers as schema.org Questions. Google no longer shows FAQ rich results
// (May 2026) but still reads the markup to understand the page; other engines use it too.
const questions = (items) =>
  items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }));

const structuredData = (page, extra = {}) => {
  const url = absoluteUrl(page.path);
  const graph = [organization(page.path === "/" || page.path === "/services"), website];
  const pageNode = {
    "@type": PAGE_TYPES[page.path] || "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en",
    ...(page.crumb && { breadcrumb: { "@id": `${url}#breadcrumb` } }),
    ...(extra.mainEntity && { mainEntity: { "@id": extra.mainEntity["@id"] } }),
  };
  graph.push(pageNode);
  if (extra.mainEntity) graph.push(extra.mainEntity);
  if (extra.itemList) pageNode.mainEntity = { "@type": "ItemList", itemListElement: extra.itemList.map((u, i) => ({ "@type": "ListItem", position: i + 1, url: u })) };
  // Q&A: the FAQ page is itself an FAQPage; on other pages the Q&A is one part of the page.
  if (extra.faqs?.length && pageNode["@type"] === "FAQPage") pageNode.mainEntity = questions(extra.faqs);
  else if (extra.faqs?.length) {
    graph.push({ "@type": "FAQPage", "@id": `${url}#faq`, url, name: `${page.crumb}: frequently asked questions`, isPartOf: { "@id": `${url}#webpage` }, mainEntity: questions(extra.faqs) });
    pageNode.hasPart = { "@id": `${url}#faq` };
  }
  if (extra.people?.length) graph.push(...extra.people);
  if (page.crumb) graph.push(breadcrumb(page, url));
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
};

const serviceEntity = (page) => {
  const s = servicePage(page.slug);
  const url = absoluteUrl(page.path);
  const cat = pricing.find((c) => c.slug === s.pricingSlug);
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: s.name,
    serviceType: s.name,
    description: s.summary,
    url,
    provider: { "@id": ORG_ID },
    areaServed: BRAND.areaServed,
    ...(cat && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: cat.title,
        itemListElement: cat.plans.map((p) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: p.name, ...(p.fit && { description: p.fit }) } })),
      },
    }),
  };
};

const postEntity = (page) => {
  const p = blogPost(page.slug);
  const url = absoluteUrl(page.path);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.date,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: { "@id": `${url}#webpage` },
    image: absoluteUrl(OG_IMAGE),
    wordCount: postWords(p),
    inLanguage: "en",
  };
};

const caseEntity = (project, url) => ({
  "@type": "CreativeWork",
  "@id": `${url}#work`,
  name: project.title,
  description: project.description,
  genre: project.type || project.category,
  creator: { "@id": ORG_ID },
  creativeWorkStatus: projectStatus(project),
  ...(project.year && { dateCreated: project.year }),
  ...(project.liveUrl && { url: project.liveUrl }),
  ...(project.image && { image: project.image }),
  ...(project.tags?.length && { keywords: project.tags.join(", ") }),
});

// ---- Head ------------------------------------------------------------------------------------------
const twitterHandle = (BRAND.socials.twitter || "").match(/(?:x|twitter)\.com\/([^/?#]+)/)?.[1];

const headTags = (page, ld) => {
  const url = absoluteUrl(page.path);
  const image = absoluteUrl(OG_IMAGE);
  return [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<meta name="robots" content="${page.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}" />`,
    !page.noindex && `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${page.kind === "post" ? "article" : "website"}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(SITE_NAME)} logo" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    twitterHandle && `<meta name="twitter:site" content="@${esc(twitterHandle)}" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    ld && `<script type="application/ld+json">${ld}</script>`,
  ].filter(Boolean).map((t) => `    ${t}`).join("\n");
};

// ---- Write ------------------------------------------------------------------------------------------
const stripSeo = (html) =>
  html
    .replace(/[ \t]*<!-- SEO:[\s\S]*?-->\r?\n/, "")
    .replace(/[ \t]*<title>[\s\S]*?<\/title>\r?\n/, "")
    .replace(/[ \t]*<meta (?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)"[^>]*>\r?\n/g, "")
    .replace(/[ \t]*<link rel="canonical"[^>]*>\r?\n/g, "");
const base = stripSeo(template);
const viewport = base.match(/[ \t]*<meta name="viewport"[^>]*>\r?\n/);
if (!viewport || !base.includes('<div id="root"></div>')) throw new Error("prerender-seo: dist/index.html is missing the viewport meta or the empty #root");

const written = [];
const warnings = [];
const write = (page, main, ld) => {
  if (!page.noindex && page.title.length > 65) warnings.push(`${page.path}: title is ${page.title.length} chars`);
  if (!page.noindex && (page.description.length < 70 || page.description.length > 160)) warnings.push(`${page.path}: description is ${page.description.length} chars`);
  const html = base
    .replace(viewport[0], `${viewport[0]}${headTags(page, ld)}\n`)
    .replace('<div id="root"></div>', `<div id="root">${chrome(main)}</div>`);
  // Flat files (services.html, work/ocean-rare.html): served at /services, /work/ocean-rare with
  // "cleanUrls" on Vercel; Netlify and `vite preview` do the same.
  const file = path.join(dist, page.path === "/" ? "index.html" : `${page.path.slice(1)}.html`);
  writeFileSync(file, html, { flag: "w" });
  const words = main.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  written.push({ page, words });
};

const ensureDir = (p) => mkdirSync(path.dirname(path.join(dist, `${p.slice(1)}.html`)), { recursive: true });

for (const page of PAGES) {
  if (page.path !== "/") ensureDir(page.path);
  if (page.kind === "service") write(page, serviceContent(page), structuredData(page, { mainEntity: serviceEntity(page), faqs: servicePage(page.slug).faqs }));
  else if (page.kind === "industry") write(page, industryContent(page), structuredData(page, { faqs: industryPage(page.slug).faqs }));
  else if (page.kind === "faq") write(page, faqContent(page), structuredData(page, { faqs }));
  else if (page.kind === "industries") write(page, listContent(page, INDUSTRIES.map((i) => `${a(`/industries/${i.slug}`, i.name)}: ${esc(i.lead)}`)), structuredData(page, { itemList: INDUSTRIES.map((i) => absoluteUrl(`/industries/${i.slug}`)) }));
  else if (page.kind === "blog") write(page, listContent(page, POSTS.map((p) => `${a(`/blog/${p.slug}`, p.title)}: ${esc(p.description)}`)), structuredData(page, { itemList: POSTS.map((p) => absoluteUrl(`/blog/${p.slug}`)) }));
  else if (page.kind === "post") write(page, postContent(page), structuredData(page, { mainEntity: postEntity(page) }));
  else if (page.noindex) write(page, MAIN_CONTENT[page.path](page), null);
  else {
    const extra =
      page.path === "/portfolio" && projects.length ? { itemList: projects.map((p) => absoluteUrl(`/work/${projectSlug(p.title)}`)) }
      : page.path === "/about" && team.length ? { people: team.map(person) }
      : {};
    write(page, MAIN_CONTENT[page.path](page), structuredData(page, extra));
  }
}

const casePages = projects.map((p) => {
  const meta = caseStudyMeta(p);
  return { ...meta, kind: "case", crumb: p.title, parent: { name: "Portfolio", path: "/portfolio" }, project: p };
});
for (const page of casePages) {
  ensureDir(page.path);
  write(page, caseContent(page.project), structuredData(page, { mainEntity: caseEntity(page.project, absoluteUrl(page.path)) }));
}

// Served by Vercel with a real 404 status for any URL that has no file (see vercel.json); the app then
// shows its 404 page. Not in the sitemap.
write({ ...NOT_FOUND, path: "/404" }, notFoundContent(), null);

// ---- Sitemap and llms.txt ---------------------------------------------------------------------------
const indexable = [...PAGES.filter((p) => !p.noindex), ...casePages];
writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    indexable.map((p) => `  <url><loc>${absoluteUrl(p.path)}</loc>${p.kind === "post" ? `<lastmod>${blogPost(p.slug).date}</lastmod>` : ""}</url>`).join("\n") +
    `\n</urlset>\n`
);

const md = (path_, text) => `[${text}](${absoluteUrl(path_)})`;
const llms = [
  `# ${SITE_NAME}`,
  "",
  `> ${BRAND.description} ${BRAND.workStyle}. Services: website development, app development, social media marketing, model & influencer marketing, SEO, AEO and GEO.`,
  "",
  `- Website: ${SITE_URL}`,
  `- Email: ${BRAND.email}`,
  `- Phone: ${BRAND.phone}`,
  `- Profiles: ${SAME_AS.join(", ")}`,
  "",
  "## Services",
  ...SERVICE_PAGES.map((s) => `- ${md(`/services/${s.slug}`, s.name)}: ${s.description}`),
  "",
  "## Industries",
  ...INDUSTRIES.map((i) => `- ${md(`/industries/${i.slug}`, i.name)}: ${i.lead}`),
  ...(casePages.length ? ["", "## Case studies", ...casePages.map((c) => `- ${md(c.path, c.project.title)}: ${c.project.type || c.project.category} (${projectStatus(c.project)})`)] : []),
  "",
  "## Guides",
  ...POSTS.map((p) => `- ${md(`/blog/${p.slug}`, p.title)}: ${p.description}`),
  "",
  "## Company",
  `- ${md("/about", "About")}: who we are, how we work and the founders.`,
  `- ${md("/process", "Process")}: the seven steps of every project, from discovery to launch and support.`,
  `- ${md("/pricing", "Pricing")}: current starting prices in INR for every service.`,
  `- ${md("/faq", "FAQ")}: who we are, the founders, where we work and how to start a project.`,
  `- ${md("/contact", "Contact")}: start a project or ask a question.`,
  "",
].join("\n");
writeFileSync(path.join(dist, "llms.txt"), llms);

for (const { page, words } of written) console.log(`prerender-seo  ${page.path.padEnd(46)} ${String(words).padStart(5)} words  ${page.noindex ? "(noindex)" : ""}`);
console.log(`prerender-seo  sitemap.xml with ${indexable.length} pages · llms.txt · CMS ${cms ? "loaded" : "NOT loaded"}`);
warnings.forEach((w) => console.warn(`prerender-seo  warning: ${w}`));
