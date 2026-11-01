# GEO Implementation Report: pixiedigitalcreatives.com
**Date:** 1 Nov 2026 · Builds on the audit in `GEO-Audit-2026-11-01.md` · Status: built and validated locally, **not deployed yet**

> GEO makes the site easier for AI search tools to find, understand and cite. It does not guarantee that ChatGPT, Google AI Overviews, Gemini, Perplexity or Copilot will recommend Pixie Digital Creatives.

## 1. Audit summary
3 critical, 5 high, 4 medium, 2 low findings. Full report: `reports/GEO-Audit-2026-11-01.md`. The critical ones: most content invisible to AI crawlers, no page per service, no URLs for projects.

## 2. Implemented changes

### Technical GEO
| Change | Detail |
|---|---|
| robots.txt | Three explicit groups: **search & AI-answer crawlers** (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User, Applebot, DuckAssistBot), **AI training crawlers** (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, meta-externalagent) and everyone else. All allowed (owner's choice); `/admin` and `/api/` blocked; sitemap linked. Training can later be switched off in one group without affecting search. |
| Full crawlable HTML | Every page's real content is written into its HTML at build time (same words visitors see). Home 255 → **772** words, Pricing 62 → **481**, Process 55 → **405**, Portfolio 45 → **348**, About 59 → **301**. Header with logo + nav and a footer with brand facts on every page. |
| llms.txt | `/llms.txt`: brand summary, contact, profiles, services, industries, case studies, guides, company pages (optional resource, not a ranking factor). |
| Sitemap | 9 → **33 URLs** (main pages, 7 services, industries index + 4, blog index + 4 articles, 7 case studies); `lastmod` on articles. |
| Canonical / OG / Twitter | Per page, absolute URLs; `og:type=article` on articles; `twitter:site=@pixiedigital`. |
| Semantic HTML | `header`, `nav`, `main`, `section`, `article`, `footer`; one H1 per page; Q&A as `details/summary`; tables with `th scope`; `time datetime` on articles. |

### Structured data (JSON-LD)
| Type | Where | Notes |
|---|---|---|
| Organization | every page | name, alternateName, URL, logo, description, slogan, email, **telephone**, **contactPoint**, **areaServed: Worldwide**, **founders** (from the CMS team), sameAs (4 profiles), knowsAbout; services catalogue on Home + Services |
| WebSite | every page | publisher → Organization |
| WebPage / AboutPage / ContactPage / CollectionPage | every page | breadcrumb + mainEntity links |
| BreadcrumbList | 32 inner pages | 2-3 levels (e.g. Home › Services › SEO) |
| Service | 7 service pages | provider, areaServed, plan catalogue (no prices in schema) |
| BlogPosting | 4 articles | headline, dates, author/publisher, image, wordCount |
| CreativeWork | 7 case studies | creator, status (Live / In progress / Concept), year, live URL, image, keywords |
| ItemList | Portfolio, Blog, Industries | links to each item |

**Not added, on purpose:** LocalBusiness / ProfessionalService (no public street address; owner confirmed remote), FAQPage (Google retired FAQ rich results; the Q&A is visible content instead), reviews/ratings (none exist on the site).

### Content
| Page type | Pages | What they contain |
|---|---|---|
| Service pages `/services/<slug>` | Website Development, App Development, Social Media Marketing, Model & Influencer Marketing, SEO, AEO, GEO | Keyword H1, quotable definition ("What is …?"), what's included, plans with **live prices from the CMS**, 7-step process, 4-6 Q&A, related services and guides |
| Industry pages `/industries/<slug>` | Restaurants & Cafés, E-commerce & D2C, Fitness & Wellness, Creators & Authors + index | Needs, real projects (linked case studies), services, Q&A |
| Blog `/blog/<slug>` | SEO vs AEO vs GEO · What is GEO · WordPress vs custom website · How to plan a website project | Comparisons (tables), checklists, the studio's real 7-step process |
| Case studies `/work/<slug>` | All 7 CMS projects | Only CMS facts + honest status: GhGameZone & Ocean Rare **In progress**, Moti Restro **Concept**, others **Live** |

Rules kept: no invented testimonials, results, awards, addresses, statistics or timelines; "we can't guarantee" stated where true (rankings, reach, AI recommendations).

### Brand entity
- One phone number everywhere: **+91 96086 84177** (was two different sets; the Company Profile book showed the old ones).
- `src/data/brand.js`: one source for name, URL, email, phone, work style ("Remote digital studio working with clients worldwide"), profiles.
- Same facts in Organization schema, llms.txt, every page footer, Contact page.

### Links (no redesign)
Navbar: Services › **Industries**, About › **Blog**. Footer: Quick Links + **Industries, Blog**; Services column → the 7 service pages. Service cards: **Learn more** → service page. Project popup: **Read the case study**.

## 3. Files
**Created:** `src/data/brand.js`, `siteCopy.js`, `servicePages.js`, `industries.js`, `blog.js`, `projects.js` · `src/components/content/ContentKit.jsx` · `src/pages/ServiceDetailPage.jsx`, `IndustryPage.jsx`, `BlogPage.jsx`, `CaseStudyPage.jsx` · `src/styles/contentpages.scss` · `reports/GEO-Audit-2026-11-01.md`, this report.

**Modified:** `scripts/prerender-seo.mjs` (full content, schema, llms.txt, sitemap, CMS fetch) · `src/data/seo.js` (27 routes) · `src/components/RouteSeo.jsx` (`useSeo` for case studies) · `src/App.jsx` (6 routes) · `public/robots.txt` · `index.html` (`twitter:site`) · `Navbar.jsx`, `Footer.jsx`, `ProjectDetailModal.jsx`, `ServiceCard.jsx` (links) · `Journey.jsx`, `Pillars.jsx`, `Manifesto.jsx`, `ProcessStory/data.js` (copy moved to `siteCopy.js`, display unchanged) · phone: `initialData.js`, `books.js`, `BookFace.jsx`, `ContactPage.jsx`, `Admin.jsx`, `server/models/CmsModels.js`.

## 4. Validation results (local build)
| Check | Result |
|---|---|
| Pages built | **34** (33 indexable + `/admin` noindex) |
| JSON-LD | **34/34 parse**; required fields present per type; every `@id` reference resolves; breadcrumb positions and targets valid |
| Schema counts | Organization 33 · WebSite 33 · WebPage 28 · BreadcrumbList 32 · Service 7 · CreativeWork 7 · BlogPosting 4 · CollectionPage 3 · AboutPage 1 · ContactPage 1 |
| Head tags | exactly 1 title / description / robots / og:url per page; canonical = own URL; no duplicates; titles ≤ 65, descriptions 70-160 chars |
| Links | 0 broken internal links in the crawlable HTML; sitemap (33) and llms.txt (26 links) all resolve |
| robots.txt | search, training and default groups as intended; sitemap line present |
| Browser | service, case-study, blog and industry pages render in the site's design; desktop + 375 px phone; dark + light theme; no console errors; all new links work |
| Lint / build | 0 errors; `npm run build` passes |

To repeat after deploying: Google **Rich Results Test** and **validator.schema.org** on `/services/seo`, `/blog/seo-vs-aeo-vs-geo` and `/work/mehfil`.

## 5. Remaining external / manual tasks
1. **Deploy** (Vercel). Check the build log shows `CMS loaded`; if it says `NOT loaded` (Render API asleep), redeploy so case studies, team and prices are included.
2. **Search Console:** resubmit `sitemap.xml` (it now has 33 URLs) and request indexing for the 7 service pages and the blog.
3. **Bing Webmaster Tools:** import from Search Console (Bing feeds ChatGPT search and Copilot).
4. **Enrich case studies in Admin:** current descriptions are 21-45 words. Add the challenge, what was built and any real outcome you can share; that text flows into the case study automatically.
5. **Add GhSnapflix** to the portfolio in Admin to get its case study.
6. **Facebook profile URL:** replace the share link (`facebook.com/share/…`) with the page's real profile URL in Admin → Company Info.
7. **Google Business Profile** (service-area business, no address shown) and directory listings (Clutch, GoodFirms, DesignRush, LinkedIn company page details) using the **same name, website, email and phone**.
8. **Render API redeploy** (from earlier work) so the Admin's project ordering works in production.

## 6. GEO monitoring strategy
| What | How | How often |
|---|---|---|
| AI answers | Ask ChatGPT (search on), Perplexity, Gemini, Copilot and Google (AI Overview) a fixed list of prompts, e.g. "website development agency for restaurants", "what is GEO", "Pixie Digital Creatives". Record: mentioned? cited URL? description accurate? | Monthly |
| AI referrals | GA4 traffic from chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com | Monthly |
| Search | Search Console: indexed pages (target 33), queries, clicks, impressions per new page | Weekly for the first month, then monthly |
| Crawl health | Rich Results Test on 3 sample pages; check `/robots.txt`, `/sitemap.xml`, `/llms.txt` return text/XML | After every major deploy |
| Brand consistency | Same phone/email/name on site, Google profile, directories, social bios | Quarterly |

## 7. Recommended next steps
1. Deploy and complete tasks 1-3 above (this week).
2. Write longer case studies for the 4 live projects (biggest content gain; AI tools cite concrete work).
3. Publish one new guide a month on a real customer question (e.g. "How much does an e-commerce website cost in India?" using the published prices).
4. Reduce the 930 KB main JavaScript bundle (faster first paint on phones; Core Web Vitals).
5. Return a real 404 status for unknown URLs (needs a Vercel routing change).
6. Re-run this audit in 4-6 weeks and compare AI-answer results with the first monthly check.
