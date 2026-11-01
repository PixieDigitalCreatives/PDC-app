# AEO Implementation Report: pixiedigitalcreatives.com
**Date:** 1 Nov 2026 · Builds on `AEO-Audit-2026-11-01.md` and the SEO/GEO work · Status: built and validated locally, **not committed or deployed**

> AEO makes it easier for search engines, AI tools and voice assistants to use the site's content as a direct answer. It cannot guarantee featured snippets, AI Overview mentions or citations in ChatGPT, Perplexity, Copilot or Gemini, and one appearance in an AI answer is not stable visibility.

## 1. AEO audit (summary)
Full audit: `reports/AEO-Audit-2026-11-01.md`. The SEO/GEO base was solid (crawlable HTML, schema, sitemap, robots.txt). The AEO gaps were:

| Priority | Gap | Fixed |
|---|---|---|
| High | Service pages answered "what is" but not who it's for, benefits, deliverables or industry use; H2s were labels, not questions | Yes |
| High | No answer to "How much does a website cost in India?" although PDC publishes INR prices | Yes (guide with live prices) |
| High | No company Q&A (founders, location, clients outside India, how to start) | Yes (/faq) |
| High | Founders not described as people (no bio/profiles in schema) | Yes (Person schema) |
| High | Visible Q&A not marked up | Yes (FAQPage) |
| Medium | Example customer questions unanswered (technology choice, how app development works, AEO vs GEO, appearing in AI answers, small-business visibility) | Yes |
| Medium | Non-build services showed the website/app process | Yes (own steps) |
| Medium | Soft 404 (unknown URLs returned 200), no `404.html`, trailing slashes not normalised | Yes |
| Medium | No analytics, so AI referrals and conversions can't be measured | Manual task |
| Medium | Main JS bundle ≈ 1 MB | Recommendation |
| Low | Thin case studies; unverifiable CMS stats; stale Netlify config | Manual tasks |

## 2. Files
**Created**
- `src/data/faq.js`: company questions; founders and projects from the CMS
- `src/pages/FaqPage.jsx`: the /faq page
- `reports/AEO-Audit-2026-11-01.md`, this report, `reports/AEO-Test-Tracker-2026-11-01.xlsx`

**Modified**
- `src/data/servicePages.js`: `term`, `audience`, `benefits`, `industries`, `steps`, `deliverables`, 6 new or rewritten questions, FAQ `links`
- `src/pages/ServiceDetailPage.jsx`: question-led sections in a new order
- `src/data/blog.js`: 2 new guides, short answer on WordPress vs custom, `price` sections
- `src/pages/BlogPage.jsx`: live price table
- `src/data/pricing.js`: `categoryRange`
- `src/data/industries.js`, `src/pages/IndustryPage.jsx`: `who` field, question headings
- `src/components/content/ContentKit.jsx`: `Checklist`, `Steps`, Q&A links, `#section` jumps after the preloader
- `src/styles/contentpages.scss`: checklist, sub-heading, Q&A link, article link styles; `scroll-margin-top`
- `src/data/seo.js`: /faq page
- `src/App.jsx`: /faq route
- `src/components/Footer.jsx`: FAQ link
- `scripts/prerender-seo.mjs`: same sections in the crawlable HTML, FAQPage, Person, price blocks, /faq, `404.html`, llms.txt FAQ line
- `vercel.json`: catch-all removed, `/work/:slug` fallback, `trailingSlash: false`
- `PROJECT_CONTEXT.md`: section 13

No packages installed. No design, animation or route removed.

## 3. Structured data
| Type | Where | Count |
|---|---|---|
| Organization | every page; `founder` now references Person nodes by `@id` | 36 |
| WebSite | every page | 36 |
| WebPage / AboutPage / ContactPage / CollectionPage | every page | 35 |
| **FAQPage** (new) | 7 service pages and 4 industry pages (linked as `hasPart` of the page), and /faq, which is itself an FAQPage | 12 pages, 61 questions, none repeated across pages |
| **Person** (new) | /about: Rishi (Founder), Arpit Prajapati (Co-Founder & GenAI Lead), Shyam Mohan Vishwakarma (Co-Founder & Outreach), with bio, photo, LinkedIn/X/GitHub and `worksFor` | 3 |
| BreadcrumbList | all inner pages | 35 |
| Service | service pages | 7 |
| BlogPosting | guides | 6 |
| CreativeWork | case studies | 7 |

Every Question and Answer in the markup is checked to appear word for word in the page's visible text.

**Not added, on purpose:** ProfessionalService/LocalBusiness (needs a street address; PDC is remote), HowTo (retired by Google in 2023), Speakable (news publishers only), Review/AggregateRating (no genuine reviews exist).

**FAQPage note:** Google stopped showing FAQ rich results on 7 May 2026. Its documentation says the markup is still used to understand pages, and other engines read it. Expect no visual change in Google results.

## 4. Optimised content
### Service pages (all 7): one question per section, answer first
1. What is {service}? (definition, ~50 words)
2. Who is {service} for? (checklist)
3. What are the benefits of {service}? (no promised results)
4. What does our {service} service include?
5. How is {service} used in different industries? (links to the industry pages)
6. How much does {service} cost? (live plans and prices)
7. How does a {service} project work? / How does our {service} service work? + **What you receive** (deliverables)
8. {Service}: frequently asked questions (with links to the guides)

New questions: Which technology is best for a business website? · How does mobile app development work? · What is the difference between AEO and GEO? · How can a business appear in AI-generated answers? · What can a small business do first to be found online?

### New pages
| Page | Answers | Snippet format |
|---|---|---|
| `/blog/website-cost-in-india` | How much does a website / an app cost in India? Cost factors, ongoing costs, why quotes differ, how to get an accurate quote | Sentence with the range + table (live CMS prices), lists |
| `/blog/improve-online-visibility-small-business` | How can a small business improve its online visibility? (8 steps, measurement, what to avoid) | Numbered list + sections |
| `/faq` | What is PDC? Who founded it? Where is it based? Clients outside India? Services, industries, previous work, how to start, prices, contact | Q&A |

### Other
- Industry pages: question headings ("What do restaurants and cafés need from a website?", "Which projects have we built for…", "How can we help…").
- WordPress vs custom guide: "The short answer" first.
- Location: prices are framed for India (INR) because that is factual; no city pages, since PDC is remote with no address.

### Snippet and voice opportunities
| Query type | Example | Where it is answered |
|---|---|---|
| Definition (paragraph) | What is website development? | Service page, first section |
| Price (table) | Website cost in India | Price guide, short answer |
| Comparison (table) | SEO vs AEO vs GEO; WordPress vs custom | Guides |
| List / how-to | How to plan a website project; improve online visibility | Guides |
| Brand (voice) | Who founded Pixie Digital Creatives? | /faq |

Rules kept: no invented clients, results, statistics, timelines, awards or reviews; "we can't guarantee" where true. **Please review** the drafted parts that describe how PDC works: the `steps` for social media, influencer, SEO, AEO and GEO; the `deliverables`; and the `audience`/`benefits` lines (`src/data/servicePages.js`).

## 5. Technical improvements
| Change | Effect |
|---|---|
| `dist/404.html` + no catch-all rewrite | Unknown URLs return a **real 404** instead of the home page with 200 (soft 404) |
| `/work/:slug` → app | Case studies for projects added in the Admin after the last build still load |
| `trailingSlash: false` | `/about/` redirects to `/about` (one URL per page) |
| `#section` links | `/services/seo#faq` jumps to the section after the preloader (same approach as the pricing page) |
| Sitemap | 33 → **36 URLs**; llms.txt 26 → 29 links (FAQ and the 2 guides) |
| Bundle | The new copy adds ≈ 8 KB gzip to the main JS (≈ 3%); see recommendation 6 |

## 6. Validation results (local build)
| Check | Result |
|---|---|
| `npm run build` | passes; CMS loaded; 38 files written (37 pages + 404) |
| Validator (scratchpad `check_aeo.py`) | **All checks passed**: 1 title/description/robots/og:url per page, correct canonicals, JSON-LD parses, required fields per type, every `@id` resolves, breadcrumbs valid, 0 broken internal links, sitemap and llms.txt links resolve, robots.txt groups intact |
| AEO checks | 12 FAQPage, 61 questions, all visible on their page, none duplicated across pages; 3 Person nodes; one H1 per page; **no skipped heading levels**; 404.html is noindex without a canonical |
| Titles / descriptions | no length warnings (≤ 65 / 70-160 characters) |
| Browser (dev server) | service page sections and headings, price guide (live ₹ prices), /faq with CMS founders and projects, 404 page (noindex, no canonical), 375 px phone + light theme: no horizontal scroll |
| Lint | 0 errors (3 earlier warnings unchanged) |
| Test tracker | 608 formulas, 0 errors (recalculated in Excel); a test entry is counted correctly by platform, question and month |

**Not verifiable locally:** Vercel's 404 status and trailing-slash redirect (check after deploy, below); the `#faq` jump animation (the browser pane was hidden, which pauses smooth scrolling; the existing pricing-page jump behaves the same there); real AI-answer visibility (needs weeks).

**After deploy, check:**
```
curl.exe -s -o NUL -w "%{http_code}" https://www.pixiedigitalcreatives.com/no-such-page     → 404
curl.exe -s -o NUL -w "%{http_code}" https://www.pixiedigitalcreatives.com/faq             → 200
curl.exe -s -o NUL -w "%{http_code}" https://www.pixiedigitalcreatives.com/about/          → 308
```
Then the Rich Results Test / validator.schema.org on `/services/seo`, `/faq` and `/about`.

## 7. Remaining manual tasks
1. **Review the drafted service copy** (section 4) and correct anything that doesn't match how you work.
2. **Deploy.** The build log must say `CMS loaded`; if it says `NOT loaded`, redeploy (the price guide then shows plan types without prices, and /faq leaves out founders and projects).
3. Run the three `curl` checks above.
4. **Search Console:** resubmit `sitemap.xml` (36 URLs); request indexing for `/faq`, the 2 new guides and the 7 service pages.
5. **Bing Webmaster Tools:** import from Search Console (Bing feeds ChatGPT Search and Copilot).
6. **Install analytics** (GA4 or Vercel Web Analytics). Without it, AI referral traffic and conversions can't be measured. GA4 may need a cookie notice, depending on your visitors' countries.
7. **Google Business Profile** as a service-area business (no address shown), plus Clutch, GoodFirms, DesignRush and LinkedIn listings with exactly the same name, website, email and phone.
8. **Genuine client reviews** on Google and those directories. They are the biggest missing trust signal for "best agency" questions.
9. **Enrich case studies in the Admin:** challenge, approach, what was built and any real outcome you can share. Add GhSnapflix.
10. **Confirm or remove the CMS stats** (95% satisfaction, 10+ clients, 6+ projects, 5+ years) unless you can back them up.
11. **Confirm billing terms** flagged in `pricing.js` (SEO plans, social Growth/Full-Service). This unlocks a social media pricing guide.
12. From earlier: Facebook profile URL in the Admin; Render API redeploy; optionally update the stale `netlify.toml` / `public/_redirects` API URL.

## 8. Monitoring and reporting
**Tracker:** `reports/AEO-Test-Tracker-2026-11-01.xlsx`
- **Questions:** 32 fixed questions: brand (7), definitions, comparisons, how-to, India price, discovery, process. Each has the PDC page that should be cited.
- **Log:** one row per question × platform (ChatGPT, Google AI Overviews, AI Mode, Gemini, Perplexity, Copilot, Claude, Google snippets/People also ask, voice), with dropdowns.
- **Summary:** mention rate and citation rate per platform and per question; last-checked date.
- **KPIs:** a monthly table for Nov 2026 to Feb 2027. Search Console impressions and clicks, indexed pages, question-query count, Bing impressions, AI referral sessions, enquiries, qualified leads and projects won are typed in. AI mentions, citations and accuracy are counted from the Log.

| What | Source | How often |
|---|---|---|
| Organic impressions, clicks, question queries | Search Console (filter queries: what/how/which/why) | Weekly in month 1, then monthly |
| Featured snippet / People also ask | Manual check of the snippet questions (Q08-Q22) in Google; Search Console can't isolate snippets | Monthly |
| AI referral traffic | Analytics: chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com, claude.ai | Monthly (once analytics is installed) |
| Brand mentions and citations in AI answers | Tracker (32 questions × platforms) | Monthly |
| Qualified leads and conversions | Contact form / inbox | Monthly |

**Reading the results:** treat a question as "won" only when PDC appears in at least 2 of 3 consecutive months. Inaccurate answers matter more than missing ones: fix the source of the wrong fact.

## 9. Editorial roadmap and the next 90 days
Each topic answers a real pre-purchase question that no page answers yet (no near-duplicates of existing pages).

| When | Content | Type | Needs from you |
|---|---|---|---|
| Weeks 1-2 | Deploy + manual tasks 1-6 | Technical | Review, deploy |
| Weeks 2-4 | Rewrite 4 live case studies (PetMitra, AksharCanvas, MEHFIL, ELV8): challenge → approach → build → result | Case studies | Real project facts, permission, screenshots |
| Weeks 3-4 | Google Business Profile, directory listings, first review requests | Off-site trust | Account access, client contacts |
| Month 2 | "How to choose a website development agency: 10 questions to ask" | Problem-solving guide | None |
| Month 2 | "Restaurant website checklist: what guests look for" (links to the industry page and MEHFIL) | Industry guide | None |
| Month 2 | "How to scope an MVP app" | Tutorial | None |
| Month 3 | "Is your website visible to AI crawlers? A 10-minute check" | Tutorial | None |
| Month 3 | "Social media management cost in India" | Pricing guide | Confirmed billing terms (task 11) |
| Month 3 | "What does website maintenance include?" | Explainer | Maintenance scope and price, if you publish one |
| Monthly | Run the tracker; update the KPIs tab | Measurement | 60-90 min |
| Day 90 | Compare months 1-3; re-audit; decide the next quarter's topics from the questions PDC still misses | Review | None |

**Prioritised recommendations**
1. Deploy and get indexed (nothing is visible to answer engines until then).
2. Genuine reviews and directory listings: the main gap for discovery questions where many agencies compete.
3. Longer, factual case studies: AI tools cite concrete work.
4. Analytics, so AI referrals and leads become measurable.
5. One new question-led guide a month from the roadmap; update the price guide whenever prices change (it reads them live at build time).
6. Performance: split the 1 MB main bundle (e.g. load long page copy only on the pages that use it, and split large libraries into separate chunks). A faster first load on phones helps both visitors and Core Web Vitals.
7. Re-run the full audit after 90 days.
