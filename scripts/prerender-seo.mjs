// Runs after `vite build` (see the "build" script). Writes one static HTML file per page from
// src/data/seo.js, so every URL starts with its own title, description, canonical link, social tags
// and structured data, plus a plain copy of the page's headline and intro that crawlers without
// JavaScript (AI crawlers, link previews) can read. React replaces that copy when the app starts.
// Also writes dist/sitemap.xml. To add a page: add it to PAGES in src/data/seo.js.
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PAGES, SITE_URL, SITE_NAME, OG_IMAGE, LOGO, SERVICES, COMPANY, absoluteUrl } from "../src/data/seo.js";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const template = readFileSync(path.join(dist, "index.html"), "utf8");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const indexable = PAGES.filter((p) => !p.noindex);

// --- Structured data -------------------------------------------------------------------------------
const PAGE_TYPES = { "/about": "AboutPage", "/contact": "ContactPage", "/portfolio": "CollectionPage" };

const organization = (withServices) => ({
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  alternateName: COMPANY.shortName,
  url: `${SITE_URL}/`,
  logo: { "@type": "ImageObject", url: absoluteUrl(LOGO), width: 192, height: 192 },
  image: absoluteUrl(OG_IMAGE),
  description: COMPANY.description,
  slogan: COMPANY.tagline,
  email: COMPANY.email,
  sameAs: Object.values(COMPANY.socials || {}).filter(Boolean),
  knowsAbout: [
    "Website development",
    "Premium website design",
    "Application development",
    "Social media handling",
    "Search engine optimisation",
    "Digital marketing",
  ],
  ...(withServices && {
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digital agency services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.description, provider: { "@id": ORG_ID } },
      })),
    },
  }),
});

const structuredData = (page) => {
  const url = absoluteUrl(page.path);
  const graph = [
    organization(page.listServices),
    { "@type": "WebSite", "@id": SITE_ID, url: `${SITE_URL}/`, name: SITE_NAME, publisher: { "@id": ORG_ID }, inLanguage: "en" },
    {
      "@type": PAGE_TYPES[page.path] || "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": SITE_ID },
      about: { "@id": ORG_ID },
      inLanguage: "en",
      ...(page.crumb && { breadcrumb: { "@id": `${url}#breadcrumb` } }),
    },
  ];
  if (page.crumb) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: page.crumb, item: url },
      ],
    });
  }
  // "<" escaped so the JSON can never close the script tag early
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
};

// --- Head --------------------------------------------------------------------------------------------
const headTags = (page) => {
  const url = absoluteUrl(page.path);
  const image = absoluteUrl(OG_IMAGE);
  return [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<meta name="robots" content="${page.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}" />`,
    !page.noindex && `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
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
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    !page.noindex && `<script type="application/ld+json">${structuredData(page)}</script>`,
  ]
    .filter(Boolean)
    .map((t) => `    ${t}`)
    .join("\n");
};

// --- Crawlable copy of the page (same words the page shows) -----------------------------------------
const bodyCopy = (page) => {
  const nav = indexable
    .map((p) => `<a href="${p.path}">${esc(p.crumb || "Home")}</a>`)
    .join(" ");
  const services = page.listServices
    ? `<h2>Our services</h2><ul>${SERVICES.map((s) => `<li><strong>${esc(s.title)}</strong>: ${esc(s.description)}</li>`).join("")}</ul>`
    : "";
  const kicker = page.kicker ? `<span class="h1-kicker">${esc(page.kicker)}</span> ` : "";
  return (
    `<div class="seo-prerender">` +
    `<nav aria-label="Primary"><a href="/"><strong>${esc(SITE_NAME)}</strong></a> ${nav}</nav>` +
    `<main><h1>${kicker}${esc(page.h1)}</h1><p>${esc(page.lead)}</p>${services}` +
    `<p><a href="/contact">Start your project</a> · <a href="mailto:${esc(COMPANY.email)}">${esc(COMPANY.email)}</a></p>` +
    `</main></div>`
  );
};

// --- Write -------------------------------------------------------------------------------------------
const stripSeo = (html) =>
  html
    .replace(/[ \t]*<!-- SEO:[\s\S]*?-->\r?\n/, "")
    .replace(/[ \t]*<title>[\s\S]*?<\/title>\r?\n/, "")
    .replace(/[ \t]*<meta (?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)"[^>]*>\r?\n/g, "")
    .replace(/[ \t]*<link rel="canonical"[^>]*>\r?\n/g, "");

const base = stripSeo(template);
const viewport = base.match(/[ \t]*<meta name="viewport"[^>]*>\r?\n/);
if (!viewport || !base.includes('<div id="root"></div>')) {
  throw new Error("prerender-seo: dist/index.html is missing the viewport meta or the empty #root");
}

const warnings = [];
for (const page of PAGES) {
  if (!page.noindex && page.title.length > 65) warnings.push(`${page.path}: title is ${page.title.length} chars (keep under ~65)`);
  if (!page.noindex && (page.description.length < 70 || page.description.length > 160))
    warnings.push(`${page.path}: description is ${page.description.length} chars (aim for 70-160)`);

  const html = base
    .replace(viewport[0], `${viewport[0]}${headTags(page)}\n`)
    .replace('<div id="root"></div>', `<div id="root">${bodyCopy(page)}</div>`);
  // Flat files (services.html): Vercel serves them at /services with "cleanUrls" (vercel.json), Netlify
  // and `vite preview` do the same; every other path still falls back to index.html.
  const file = path.join(dist, page.path === "/" ? "index.html" : `${page.path.slice(1)}.html`);
  writeFileSync(file, html);
  console.log(`prerender-seo  ${page.path.padEnd(17)} ${page.noindex ? "(noindex)" : page.title}`);
}

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  indexable.map((p) => `  <url><loc>${absoluteUrl(p.path)}</loc></url>`).join("\n") +
  `\n</urlset>\n`;
writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
console.log(`prerender-seo  sitemap.xml with ${indexable.length} pages`);
warnings.forEach((w) => console.warn(`prerender-seo  warning: ${w}`));
