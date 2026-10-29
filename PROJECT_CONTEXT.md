# PDC WEB — Project context (handoff)

Paste this into a new chat so the assistant understands the project. Last updated 2026-10-08.

---

## 1. What this is
Marketing website + admin CMS for **Pixie Digital Creatives (PDC)**, a creative/technology agency
(websites, apps, CRM, video/content, social, SEO/GEO/AEO, Meta ads).

- **Location:** `D:\PDC WEB` (Windows). **Not a git repo** — there is no undo history, so back up before big changes.
- **Frontend:** React 19 + Vite 7, SCSS (Dart Sass, `@use`), framer-motion 12, GSAP (only for Lenis/ScrollTrigger plumbing), Lenis smooth scroll, react-router-dom 7, react-icons (hi2 / fa6 / ri / md).
- **Backend:** Express 5 (`server/server.js`), MongoDB Atlas (mongoose), JWT admin auth, Cloudinary uploads, Zoho SMTP for contact mails.
- **Run:** `npm run dev` (Vite on :5173, proxies `/api` and `/uploads` to :5000), `npm run server` (API on :5000), `npm start` (both), `npm run build`.
- **.env (root) keys:** PORT, NODE_ENV, JWT_SECRET, MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, (optional) SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD, CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET, ZOHO_EMAIL, ZOHO_APP_PASSWORD, CONTACT_RECEIVE_EMAIL. (Optional: GEMINI_API_KEY, GEMINI_IMAGE_MODEL for the image script.)

## 2. Hard rules from the owner
1. **Only real data from the DB.** No mock/demo/fallback content (no fake projects, stats, testimonials or team). If the DB has nothing, the section hides.
   - `CmsContext` loads portfolio, team, stats, company from `GET /api/cms/all`. Portfolio/team/stats start as `[]`.
   - Services list (15 items) and company info defaults live in `src/data/initialData.js` (services are real offerings, not in the DB).
   - The server no longer seeds demo projects/team/stats (only the admin account + company info).
2. **Currency defaults to INR** (`src/context/CurrencyContext.jsx`).
3. Don't invent claims/metrics in copy. Use DB stats (currently: 95% Client Satisfaction, 10+ Happy Clients, 6+ Projects Delivered, 5+ Years Experience).
4. Premium, storytelling motion with framer-motion is the expected standard for new UI work.

## 3. Current design (implemented on the live site)
Based on a reference design: "Brands That Inspire Growth", silk wave ribbons, handwritten notes, Poppins font.
**Rebrand 2026-10-30:** new chrome `pdc` logo in polished silver + royal blue with a navy "PIXIE DIGITAL CREATIVES"
wordmark; the whole palette follows it (royal blue / electric blue / steel silver, navy type) and **light is the default theme**.

- **Fonts:** Poppins (display/body/labels), Caveat (handwriting). Loaded in `index.html`.
- **Themes: dark + light with a toggle** (navbar + mobile menu).
  - `src/context/ThemeContext.jsx` — sets `data-theme` on `<html>`, saves to `localStorage('pdc-theme-v2')` (key bumped at the rebrand so old saved "dark" choices reset), first visit is always light; toggle uses a View Transitions circular reveal from the click point. `useLockupSrc()` returns the full logo for the theme (`primary-480.png`, or `primary-480-dark.png` with a light wordmark).
  - `index.html` has an inline script that applies the theme before first paint (no flash) and sets `meta[theme-color]`.
  - `src/components/ThemeToggle.jsx` (+ `styles/themetoggle.scss`).
- **Design tokens = CSS custom properties**, defined in `src/index.scss` under `:root,[data-theme='dark']` and `[data-theme='light']`:
  `--bg --bg-2 --surface --surface-2 --fg --fg-2 --fg-3 --fg-4 --accent(peach/coral) --accent-2(pink) --accent-3(purple) --on-accent --btn-bg --btn-fg --btn-glow --grad-accent --grad-text --grad-text-2 --grad-chrome --glow-1..3 --wave-1..3 --glass --shadow --grain-opacity`.
  Story-only vars (`--spot --cta-bg --cta-glow --arrow-bg --card-shadow --glow-strength`, tile tones `.st-tone-0..5`) are in `src/sections/Story/story.scss`.
  - Light (default): bg `#f5f7fc`, navy `#0b1430` text, accent royal blue `#1a4bf0`, accent-2 electric blue `#2f7df6`, accent-3 steel `#56668a`, blue gradient buttons. Dark: bg `#050914`, white text, accent `#5b8cff`, accent-3 silver `#c3cbdb`.
  - Section tone tiles (`.st-/.sv-/.ab-/.pr-tone-*`) use the same blue / electric / steel family.
- **SCSS abstracts** (`src/styles/abstracts/`): `_tokens.scss` maps Sass vars to CSS vars (`$black: var(--bg)`, `$white: var(--fg)`, `$accent: var(--accent)`, `$chrome*: var(--fg-2..4)` …) and provides `alpha($color, $amount)` → `color-mix(...)` (use it instead of `rgba($var, a)`). `_mixins.scss`: `display()`, `meta`, `container`, `up/down($bp)`, `hover-device`, `reduced-motion`.
  - Never hard-code colours; every page stylesheet was migrated to the variables (only red error states are literal). Legacy aliases `--gold-*`, `--silver-*`, `--gradient-*` still exist for older page styles.
- Global UI in `index.scss`: `.btn-primary` (gradient pill / ink pill + hover sheen), `.btn-secondary`, `.glass-panel`, `.section-eyebrow`, `.section-heading`, `.grad-text`, `.grad-text-2`, skip link, film-grain overlay, focus rings.

**Brand assets** (masters in `public/`: `primary.png` = pdc + wordmark lockup, `secondary.png` = pdc letters only, `favicon.png` = pdc letters on a square; all transparent, trimmed copies of the owner-supplied high-res `public/1.png` (lockup) and `public/2.png` (letters only), 2000x1465). Web-sized copies live in `public/brand/` (made with PIL; regenerate from the masters if the logo changes):
- `primary-480.png` Navbar (top of page) / Footer / Admin lock screen / book covers · `primary-480-dark.png` same with a light wordmark, used in the dark theme via `useLockupSrc()` · `secondary-1200.webp` Home hero `ChromeLogo` (image, sheen mask and reflection) · `secondary-400.png` compact logo that fades in on the Navbar once it shrinks on scroll, and in the Admin header · `mark-256.png` centre of the About tagline ring.
- Favicons in `index.html`: `favicon.ico` (16/32/48), `favicon-32.png`, `favicon-192.png` (pdc letters, transparent), `apple-touch-icon.png` (on white). Social card: `og-image.png` (1200x630, lockup on a soft light-blue canvas). `og:image` is a relative path: crawlers need an absolute URL, so set the final domain there when it is known.

## 4. Home page = one scroll story (`src/pages/Home.jsx`)
Sections live in `src/sections/Story/` (styles: `story.scss`):
1. **Hero** (`Hero.jsx`) — badge, MaskText headline with shimmering gradient words, CTAs, client-site avatar stack (from DB project images) + "Happy clients" stat, `ChromeLogo.jsx` (3D cursor tilt, float, masked light sheen, reflection), handwritten "Ideas/Design/Develop/Grow" + drawn arrow, cursor spotlight, drifting glows, `SilkWaves.jsx` (animated SVG ribbons using `--wave-*`), scroll parallax.
2. **StatsBar** (`StatsBar.jsx`) — frosted bar overlapping hero, DB stats with CountUp, icons by label (`icons.js`).
3. **Journey** (`Journey.jsx`, `#journey`) — pinned 4-chapter story (Ideas → Design → Develop → Grow): handwritten chapter word, copy, real service chips, 3D-flipping glass card with self-drawing `ServiceVisual`, scroll-drawn silk, clickable progress rail. Stacked list on mobile.
4. **ServicesGrid** (`ServicesGrid.jsx`, `#services`) — pinned "card deal": 6 service cards start as a fanned hand and are dealt into the row on scroll; icons draw on landing (paths normalised with `pathLength=1`), sweep + arrow pulse, counter. Featured visuals: web, app, crm, handling, content, wordpress.
5. **WorkShowcase** (`WorkShowcase.jsx`, `#work`) — header with spring-pop category filters, then **sticky stacking cards**: each DB project is a large split card (info + screenshot in a browser frame) that pins while the next slides over; buried cards scale down/dim/tilt (timing keyed to `i/(n-1)`); image zoom-settle on arrival. Shows "View Project" (opens `ProjectDetailModal`) and "Visit Site" (if `liveUrl`).
6. **AboutLeadership** (`src/components/AboutLeadership.jsx`, `#about`, styles `styles/aboutleadership.scss`) — pinned **3D coverflow arc** of founders: arc rotates with scroll (holds on each person), front card gets spinning conic gradient edge, kinetic per-letter name, role/bio/socials, giant outlined ghost name, index pills that jump. Phones: portrait centre-reveal list. Social links that are bare homepages (e.g. `https://x.com`) are hidden on purpose.
7. **CtaBand** (`CtaBand.jsx`, `#start`) — band unfolds from a rounded mask, silk waves, cursor glow, magnetic "Get a Free Consultation" (opens contact modal).
Then `Footer.jsx` (reference layout: logo+tagline, Quick Links, Services, Follow Us, legal row).

Pinned sections are desktop-only (`useIsDesktop` = ≥1024px) and disabled for `prefers-reduced-motion`; each has a simpler mobile fallback.

## 5. Shared motion kit (`src/components/motion/` + `src/animations/`)
`MaskText` (line mask reveal; trigger on outer element; `onReady` waits for preloader), `Reveal` (fade-up, delay merged into variant), `Stagger/StaggerItem`, `TiltCard` (cursor spotlight + 3D tilt; pass `variants={undefined}` to disable its built-in fade), `CountUp`, `Marquee`, `HeroAurora` (inner-page hero glow/orbs), `ParallaxImage`, `SmoothScroll` (Lenis), `Magnetic` button wrapper. `animations/variants.js` (EASE, EASE_IN_OUT, VIEWPORT…), `animations/hooks.js` (`useIsDesktop`, `useFinePointer`, `usePrefersReducedMotion`), `animations/lenis.js` (`getLenis`, `scrollToTarget`, lock/unlock), `ReadyContext` (true after preloader).

## 6. Other pages
`ServicesPage`, `PortfolioPage`, `AboutPage`, `ProcessPage`, `ContactPage`, `NotFoundPage` (404 route), `Admin` (CMS). Navbar has a sliding hover pill, currency selector, theme toggle, "Let's Talk".

**Services page = a scroll story too** (`src/pages/ServicesPage.jsx`, parts in `src/sections/ServicesStory/`, styles `servicesstory.scss`; `styles/servicespage.scss` is just the page shell). It renders whatever services the CMS holds, grouped by `category` in order of first appearance (`data.js` → `groupServices`; currently Build 5, Social 2, Content 3, Growth 5):
- `ServicesHero` — letter-by-letter kinetic headline after the preloader, cursor spotlight, silk waves, category quick-links, and `ServiceOrbit`: every service as a node on 3 slowly turning rings around a glowing core (leans toward the cursor, pauses on hover, a node click jumps to that service).
- `ServiceChapter` (one per category) — a giant word whose gradient fill is wiped in by scroll, a handwritten blurb, a sticky index rail on the left (scroll-spy, click to jump), and the cards on the right.
- `ServiceCard` — desktop: driven by its own scroll progress (tips up out of the page, settles, then recedes), line-art / giant numeral / reading rail drift at different speeds, the card nearest screen centre gets a spinning gradient edge; icon strokes and ticks draw themselves. Phones: rise-in reveal. Reduced motion: fades only.
- Service pictures: `components/media/ServiceArt.jsx` shows a glossy 3D PNG per service (`public/assets/services/<visual>.png`, plus `idea.png` for the Home "Ideas" chapter) that pops in, floats over a glow and ground shadow, with twinkling stars. Used by `ServiceCard` and the Home `Journey` orb card. Assets are the **3dicons** set by realvjy, gradient style, CC0 (mapping + source URL pattern in `public/assets/services/LICENSE.txt`), recoloured at the rebrand from violet/pink/orange to royal blue → silver (a fresh download needs the same hue remap). If a PNG is missing it falls back to the old line drawing (`ServiceVisual`). To swap a picture, replace the PNG with the same name (transparent, square, ~400px works well).
- Page extras: scroll progress bar, two marquees, the shared `CtaBand`. Category blurbs in `data.js` only describe what a category covers (no metrics).
- Layout notes: sticky needs no `overflow:hidden` ancestor (the page shell uses `overflow-x: clip`); flipped cards swap their grid columns so the stage keeps its width.

**About, Portfolio and Process are scroll stories too** (pages in `src/pages/`, parts in `src/sections/{AboutStory,PortfolioStory,ProcessStory}/`, each with its own `*story.scss`; `styles/{about,portfolio,process}page.scss` are just page shells that use `overflow-x: clip` so pinned parts keep working). Shared pieces: `components/motion/KineticText` (letters rise out of a mask: `KineticLine`, `KineticWord` for gradient words), `ScrollProgress` (top bar), `DrawTick`, `ScrollWords` (now takes `accent` words), shared hero classes `.pg-glow / .pg-badge / .pg-scroll` in `motionkit.scss`, and `CtaBand` (now takes optional `title / text / button`).
- **About** — `AboutHero`: the team portraits (CMS `teamMembers[].image`; falls back to project screenshots; never stock photos) open as arches that drift at different depths with cursor + scroll, plus a rotating ring of the company tagline. `Manifesto`: pinned; the sentence lights up word by word, then the CMS stats count up *with the scroll*. `Pillars`: a strip of four panels, the one you point at (or, when idle, the next in turn) opens wide. Then the existing `AboutLeadership` 3D ring, then `CtaBand`.
- **Portfolio** — `PortfolioHero`: tilted wall of the real project screenshots drifting in three columns; category quick-links. `PortfolioControls`: filter bar that scrolls with the page (sliding category pill, search, Showcase/Index switch). `ProjectPoster`: case-study poster per project — the screenshot is uncovered by a scroll wipe (alternating sides) inside a browser frame with the live-site host, glass info panel slides over its edge. `ProjectIndex`: giant typographic list; hovering a row dims the rest and a preview follows the cursor (portalled to `<body>`). Everything comes from the CMS; with no projects the wall is hidden and the page says new work is coming.
- **Process** — `ProcessHero`: a winding route with one stop per phase that draws itself, with a light travelling along it (desktop; phones get a list of phases). `Journey`: pinned horizontal scene — the seven phases (data in `ProcessStory/data.js`) travel past left to right, holding on each; progress rail with comet, ghost numeral; vertical timeline on phones. `jump.js` scrolls to a phase from the route / rail.
- Copy rules applied on these pages: removed invented claims (week-by-week timings, "24/7", "zero downtime", "enterprise SaaS / luxury DTC", "headless commerce"); copy only describes what the studio does.
- Layout gotchas learned: in a pinned `display:grid` stage always set `grid-template-columns: minmax(0, 1fr)` (otherwise the column grows to the width of a wide child row); use CSS `translate` (not `transform`) for centring offsets on elements framer animates.

**Contact flow** (Contact page form + the "Let's Talk" modal, both use `src/utils/sendInquiry.js` -> `POST /api/contact`):
- The forms show "received" only when the server says `success`; otherwise an inline error appears (with the studio email), the typed text is kept and the button is disabled while sending. Timeout 60 s (a sleeping free-tier server can take that long to wake). No budget is sent (the forms have no budget field).
- `server/routes/contact.js` validates (strings only, email format, length limits), saves the inquiry to MongoDB **first**, then sends the email through Zoho SMTP (`server/config/mailer.js`, visitor text is HTML-escaped) to `CONTACT_RECEIVE_EMAIL`. `Inquiry.emailSent` records whether the mail went out. There is no inbox for inquiries in the Admin yet, so a lead whose email failed is only in the database.
- `server.js` sets `trust proxy` (1 hop, override with `TRUST_PROXY_HOPS`): behind Render the socket address is the proxy's, which used to put every visitor in one rate-limit bucket (5 per hour for the whole site). Failed/rejected submissions no longer use up the quota.
- Production: Netlify/Vercel rewrite `/api/*` to the Render API (`pdc-api-6e15.onrender.com`), so the server-side changes only apply after the API is redeployed.
- Test (2026-10-08): API started via `.claude/launch.json` entry `pdc-api`; 12 invalid payloads -> 400; one submission from each form -> saved + email sent. Two test inquiries ("TEST - Claude (ignore)") remain in the database.

**Brochure (`/brochure`) and Company Profile (`/company-profile`)** — one page component, `src/pages/BookViewPage.jsx` (styles `styles/bookpage.scss`): exactly one screen with only the nav bar and a page-turning book (no visible title, intro or footer; the `h1` is screen-reader only), `components/flipbook/FlipBook.jsx` (+ `BookFace.jsx`, styles `styles/flipbook.scss`; no extra library). Pages turn like paper: the corner is pulled across, the sheet folds along a line (`fold.js`: clip-path polygons + a reflection matrix for the back of the sheet, shading strips along the fold), hovering a corner lifts it. Pages turn by dragging, clicking a page, the side arrows / toolbar, the arrow keys, or the page slider; the toolbar has full screen (falls back to a fixed overlay where element full screen is unavailable, e.g. iPhone). The layout is automatic, with no switch: **Landscape** (two-page spread) whenever the stage is wide enough for two pages to keep ≥ 80% of a single page's size (`SPREAD_MIN`), otherwise **Portrait** (one page). It is re-decided on every resize, so rotating a phone flips it, and the current page is kept.
- Content lives in `src/data/books.js`: each book has `pageAspect` (one page, width/height), optional `pdf` (adds a download button) and `pages` (`cover`, `back`, `image` with `src` under `public/books/<slug>/`, or `placeholder`). Covers use the brand logo + CMS company name/tagline/email/website. **Interior pages are placeholders until the owner supplies the content.**

**Navbar** has 5 entries; related pages sit in dropdowns (`navLinks` in `Navbar.jsx`, an entry with `children`): Home · Services ▾ (All services, Pricing, Process) · Portfolio · About ▾ (About us, Company Profile, Brochure) · Contact. Dropdowns open on mouse hover or on click / tap, close on leave, Escape or an outside click. The mobile menu shows each group's main page big with the other pages as chips under it. The row shows from 1024px (`$bp-nav`).

**Pricing (`/pricing`)** — `src/pages/PricingPage.jsx`, parts in `src/sections/PricingStory/` (`pricingstory.scss`). **Prices are edited in Admin → "Pricing & Plans"** (`src/components/admin/PricingEditor.jsx`): sections and plans can be added, removed, reordered; per plan: name, tag, price from/to (₹), billing unit, "Price confirmed", "+", flat price, highlight, best for, included lines, internal note; per section: title, tab label, number, layout, description, note, which services on /services show "See pricing"; plus the proposal form's budget ranges. It edits a draft; "Save pricing" sends the whole document to `PUT /api/cms/pricing` (JWT, cleaned/validated by `server/utils/pricing.js`, stored as the single `Pricing` document in `CmsModels.js`), and `GET /api/cms/all` returns it as `pricing` (null until first saved).
- `src/data/pricing.js` holds the **built-in defaults** (`DEFAULT_PRICING`, `DEFAULT_BUDGET_RANGES`) plus the price helpers. The site shows the defaults while the database has no pricing; Admin's "Load built-in prices" puts them back into the editor. `CmsContext` exposes `pricing`, `pricingReady`, `savePricing`; the last database copy is cached in localStorage (`pdc_cms_pricing_v1`) and a first-time visitor sees loading placeholders instead of possibly outdated prices (20 s fallback to defaults).
- INR numbers, formatted ₹1,50,000; the currency selector does not convert them, the hero says prices are in INR and invites non-Indian visitors to ask for a quote in their currency.
- Hero with a price guide (lowest confirmed price per service), a floating tab bar (scroll-spy), one section per service: Website, Apps (Android & iOS), SEO & AI Search, Social, Video (rate list), Models & Influencers (two cards + "Good to know" note), then the **custom proposal form** (name, business, email or phone, service, budget range, requirements) which posts to `/api/contact`. "Get started" on a plan carries that plan into the form; "Discuss your project" opens the existing contact modal.
- A plan with "Price confirmed" off shows "Quote on request"; the billing unit (e.g. `/month`) is only filled in once confirmed; internal notes are never shown. Pending owner confirmation (2026-10-25): SEO billing period; Social Growth / Full-Service billing period and Full-Service deliverables; Basic / Professional video editing unit; Shoot + Edit Package scope (hidden); Full-Day Agency Production billing unit (hidden); Influencer Full-Day price (hidden).
- `/services`: hero has "See pricing"; each service card whose `visual` is listed in a pricing category's `services` links to `/pricing#price-<slug>`.
- Contact API now also takes `business` and `phone`, and needs an email **or** a phone (was: email required); `Inquiry` model and the notification email include them; the auto-reply only goes out when there is an email. **Redeploy the Render API** for this to work in production.

**Admin accounts** (added 2026-10-25):
- **Super admin** = the account whose email is `SUPER_ADMIN_EMAIL` (default `rishisrivastava1910@gmail.com`), decided by email on every request (`server/config/auth.js`), never by a stored field. On start-up `config/db.js` marks it `role: "superadmin"` (display only); if the account does not exist it is created from `SUPER_ADMIN_PASSWORD` when set, otherwise a warning is logged.
- Super admin only (Admin → "Admins" tab, `components/admin/AdminUsers.jsx`; API `GET/POST /api/auth/admins`, `POST /api/auth/admins/:id/reset-password`, `DELETE /api/auth/admins/:id`): add an admin (email, optional name, temporary password typed or generated: shown once with "Copy details"), reset a password (new temporary one, signs them out), remove (access ends at once). The super admin account cannot be removed or reset there.
- New / reset accounts have `mustChangePassword`: after login the Admin shows only "Set your own password" (`components/admin/ChangePasswordForm.jsx`); every CMS write route answers 403 `PASSWORD_CHANGE_REQUIRED` until then. Every admin has "Change password" in the header (`POST /api/auth/change-password`, rate-limited with login; returns a fresh token).
- `middleware/auth.js` now checks the account in the database on every request: removed accounts and tokens issued before the last password change (`passwordChangedAt`) are refused. Password rule: 8+ characters with a letter and a number. Unknown emails take as long as wrong passwords at login.
- One JWT secret helper (`getJwtSecret`): login and the token check used two different hard-coded fallbacks before. In production a missing `JWT_SECRET` now disables login (500) instead of using a secret from the source code.
- Tested 2026-10-25 against a throwaway local MongoDB (28 API checks + the screens); not yet against Atlas.

## 7. Unused / leftover
- Old home sections no longer used (kept, not deleted): `src/sections/{ServiceStory,Showcase,Philosophy,Ecosystem,Content,Growth,Presence,Cta}`, plus `components/{ProcessSection,Testimonials,TrustedBy,WhyPixie,CustomCursor}.jsx`. Safe to delete if confirmed.
- `scripts/generate-images.mjs` (`npm run images`) generates art via Google Gemini into `public/generated/` and records them in `src/data/generatedImages.json`; `src/data/images.js` → `genImage(key, fallback)`. Needs `GEMINI_API_KEY`; not run yet (manifest is `{}`), so pages use fallbacks.
- A pre-redesign backup of `src/` + `index.html` exists only in the previous session's temp scratchpad (not in the project).

## 8. Known data issues (fix in Admin panel)
- Company phone in DB looks like a placeholder: `+1 (555) 019-2834`. (Admin → Company Info now really saves, since 2026-10-25: before that the Save button only showed a toast and edits stayed in the browser.)
- Admin → Company Info edits a draft (Save / Discard, "Unsaved changes"); `PUT /api/cms/company` keeps only the known fields (`server/utils/company.js`: name, shortName, email, phone, address, tagline, description, website, socials) and checks the email and https social links. `website` was added to the Company schema (it was silently dropped before). Tagline and Address are now editable too.
- Team social placeholders: Ashish (LinkedIn/X/GitHub are bare homepages → no social buttons shown); Arpit (X and GitHub placeholders).

## 9. Figma
File "PDC Website — Light": https://www.figma.com/design/6rJLH9ak1BycNoNkLlZEnE (Starter plan: 1 mode per variable collection, limited MCP calls).
Pages: "Home — Light" (Papaya Whip palette), "Grape & Salmon — Light / Dark", "Reference build — Dark / Light" (the design now implemented in code; frames 16:152 dark, 16:262 light).
Known Figma nit: in the dark reference footer, LinkedIn/X/Facebook icons need their fill set to white.

## 10. Lint note
ESLint reports false "defined but never used" for components used only as JSX (`motion`, `Icon`) and react-refresh warnings on context files — pre-existing config quirks, not real errors. `npm run build` passes.
