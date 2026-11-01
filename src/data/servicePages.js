// One page per main service (/services/<slug>). Every statement is grounded in what the site already
// says: the services list (initialData.js), the pricing plans (pricing.js) and the 7-step process.
// No invented results, timelines, guarantees or statistics. Questions are answered plainly, including
// "we can't guarantee" where that is the honest answer. Plain data, so the build step can use it.
//
// `pricingSlug` links to /pricing#price-<slug> and lists that category's plan names;
// `visuals` are the service keys (initialData `visual`) that this page covers, used to link cards.

export const SERVICE_PAGES = [
  {
    slug: "website-development",
    name: "Website Development",
    title: "Website Development Agency | Pixie Digital Creatives",
    description:
      "Website development: premium websites, WordPress, e-commerce stores and full-stack web platforms, designed and built by one team at Pixie Digital Creatives.",
    kicker: "Website development agency",
    h1: "Websites designed to be experienced, and built to perform.",
    lead:
      "Custom website development for businesses that want a premium website: designed around your brand, responsive on every screen and built on clean, fast code. From a focused business site to an online store or a custom platform, one team handles design, development and launch.",
    summary:
      "Website development is the work of planning, designing, building and launching a website. At Pixie Digital Creatives it covers custom-designed websites, WordPress websites, e-commerce stores and full-stack web platforms, with a content management system (CMS) wherever your team needs to edit content.",
    includes: [
      { title: "Custom design and build", text: "Layouts, typography and motion designed for your brand rather than taken from a template, including storytelling and premium animation websites." },
      { title: "Responsive on every screen", text: "Designed and tested for phones, tablets and desktops across browsers." },
      { title: "Performance-minded code", text: "Clean front-end code, optimised images and attention to load speed." },
      { title: "WordPress websites", text: "Custom themes, editable page layouts and plugin integration, so your team can keep the site up to date." },
      { title: "Full-stack development", text: "Front-end interfaces, APIs, back end and databases built together as one system." },
      { title: "Search-ready launch", text: "Page titles and descriptions, structured data, a sitemap, Google Analytics 4 and Search Console set up at launch." },
    ],
    plansIntro: "Website types we build (current starting prices are on the pricing page):",
    pricingSlug: "website",
    visuals: ["web", "wordpress", "stack"],
    faqs: [
      { q: "How much does a website cost?", a: "It depends on the type of website and its features. Our pricing page lists current starting prices in INR for basic, CMS, e-commerce and enterprise websites. Every project is scoped with you first, so the final quote matches what you actually need." },
      { q: "How long does it take to build a website?", a: "It depends on the number of pages, the features and how quickly content and feedback arrive. We agree a schedule with milestones during the strategy phase, before design begins, so you know what happens when." },
      { q: "Do you build on WordPress or with custom code?", a: "Both. WordPress suits websites your team will edit often. Custom builds (React and full-stack) suit premium animated experiences and platforms with custom features. We recommend one after the discovery phase, based on your goals." },
      { q: "Will I be able to update the website myself?", a: "Yes, when you need to. We set up a CMS with the fields your content needs and include a walkthrough and training at launch." },
      { q: "Is SEO included in website development?", a: "Every website launches with the technical foundations: titles and descriptions, structured data, a sitemap, Google Analytics 4 and Search Console. Ongoing SEO work is a separate service." },
      { q: "Do you support the website after launch?", a: "Yes. Through monthly maintenance or a retainer we monitor performance, apply security updates and backups, and keep improving the site." },
    ],
    related: ["app-development", "seo", "geo"],
  },
  {
    slug: "app-development",
    name: "App Development",
    title: "App Development for Android, iOS & Web | Pixie Digital Creatives",
    description:
      "Application development for Android, iOS and the web: MVPs, booking and e-commerce apps and the APIs and databases behind them, by Pixie Digital Creatives.",
    kicker: "Application development",
    h1: "Apps built around how your users actually work.",
    lead:
      "Application development for Android, iOS and the web: from a first version (MVP) to a booking app or a full mobile shopping experience. We plan the product with you, design the interface and build the front end, back end and database as one system.",
    summary:
      "Application development is the process of planning, designing, building and launching software people use on their phones or in a browser. Pixie Digital Creatives builds web applications and mobile apps for Android and iOS, together with the APIs, databases and business systems (such as CRMs) behind them.",
    includes: [
      { title: "Mobile apps for Android and iOS", text: "Apps designed for how your customers use their phones, from booking to shopping." },
      { title: "Web applications", text: "Browser-based applications and dashboards for customers or for your own team." },
      { title: "Product thinking first", text: "Goals, user personas and flows are mapped before features, so the first version focuses on what matters." },
      { title: "APIs, back end and databases", text: "The services and data behind the app, built and integrated with your existing systems where needed." },
      { title: "CRM and business systems", text: "Lead and customer tracking, workflow setup and integrations that keep follow-ups in one place." },
      { title: "Testing across devices", text: "Cross-device and browser testing, speed checks and security checks before launch." },
    ],
    plansIntro: "App types we build (current starting prices are on the pricing page):",
    pricingSlug: "apps",
    visuals: ["app", "crm"],
    faqs: [
      { q: "How much does it cost to build an app?", a: "It depends on the type of app and its features. The pricing page lists current starting prices for an MVP or simple app, a service or booking app and an e-commerce app. Every project is scoped with you before you receive a final quote." },
      { q: "Do you build apps for both Android and iOS?", a: "Yes. We build mobile apps for Android and iOS, and web applications that run in the browser." },
      { q: "What is an MVP?", a: "A minimum viable product is a first version with only the core features, so you can launch, learn from real users and add features later. Our MVP / Simple Application plan is designed for this." },
      { q: "Can the app connect to our existing systems?", a: "Usually, yes. API and database integration is part of development, and we check technical feasibility during the discovery phase." },
      { q: "Do you maintain apps after launch?", a: "Yes. Ongoing support covers monitoring, security updates and new features through a maintenance or retainer agreement." },
    ],
    related: ["website-development", "seo"],
  },
  {
    slug: "social-media-marketing",
    name: "Social Media Marketing",
    title: "Social Media Marketing & Handling | Pixie Digital Creatives",
    description:
      "Social media marketing and handling: platform strategy, content planning, daily posting, reels and Meta Ads, from one platform to full-service management.",
    kicker: "Social media marketing & handling",
    h1: "A brand presence shaped by strategy, then kept active every day.",
    lead:
      "Social media marketing and social media handling for brands that want consistent, on-brand channels: platform strategy, content planning, day-to-day posting and community upkeep, plus paid campaigns on Facebook and Instagram when you want to reach more of the right people.",
    summary:
      "Social media marketing is using platforms such as Instagram and Facebook to build a brand and reach customers. Social media handling is the day-to-day part: planning, creating and posting content and looking after the community. Pixie Digital Creatives does both, and runs paid social campaigns.",
    includes: [
      { title: "Platform strategy", text: "Which platforms to focus on, the content direction for each and a consistent brand voice." },
      { title: "Social media handling", text: "Scheduling and posting, community upkeep and a consistent presence, so your channels stay active." },
      { title: "Content and reels", text: "Brand and promo edits and social-first cuts, plus on-location shoots when you need new footage." },
      { title: "Meta Ads", text: "Facebook and Instagram campaigns: setup, creative and audiences, and ongoing optimisation." },
      { title: "Social media ads", text: "Platform-specific creative and audience targeting for paid social campaigns." },
      { title: "Content planning", text: "Content calendars and editable content systems that keep everything on-brand." },
    ],
    plansIntro: "Social media plans (current prices and billing terms are on the pricing page):",
    pricingSlug: "social",
    visuals: ["social", "handling", "ads", "reach", "content"],
    faqs: [
      { q: "What is the difference between social media marketing and social media handling?", a: "Social media handling is the day-to-day management of your accounts: planning, posting and replying. Social media marketing is broader: the strategy, content and paid campaigns that grow your brand. Our plans combine both." },
      { q: "How many posts are included?", a: "The Starter plan covers 20 posts a month on one platform. Growth covers approximately 30 posts across two platforms, and Full-Service Agency covers three platforms with full management and marketing. Billing terms are confirmed in your proposal." },
      { q: "Which platforms do you manage?", a: "We agree the platforms with you based on where your audience is. Plans cover one, two or three platforms." },
      { q: "Do you create the content, including reels?", a: "Yes. We edit reels and social-first videos, and can plan and shoot new footage on location." },
      { q: "Do you run paid ads?", a: "Yes: Meta Ads on Facebook and Instagram and other paid social campaigns, including setup, creative, targeting and ongoing optimisation." },
      { q: "Can you guarantee followers or sales?", a: "No. Nobody can honestly guarantee follower numbers or sales. We focus on a consistent, on-brand presence and campaigns that are optimised over time." },
    ],
    related: ["model-influencer-marketing", "seo", "website-development"],
  },
  {
    slug: "model-influencer-marketing",
    name: "Model & Influencer Marketing",
    title: "Model & Influencer Marketing | Pixie Digital Creatives",
    description:
      "Model and influencer collaborations for brand shoots and social campaigns: half-day and full-day options, combined with video shoots, edits and social media.",
    kicker: "Model & influencer marketing",
    h1: "Models and creators for your shoots and campaigns.",
    lead:
      "We arrange collaborations with models and influencers for brand shoots and social campaigns, as a half-day or a full-day collaboration, and can combine them with our video shoots, editing and social media handling.",
    summary:
      "Influencer marketing means working with creators who have an engaged audience to promote a brand; a model collaboration brings a professional face to your photos and videos. Pixie Digital Creatives arranges these collaborations for shoots and campaigns. Final pricing depends on the creator, deliverables, usage rights and campaign requirements.",
    includes: [
      { title: "Half-day collaboration", text: "A half-day collaboration with a model or influencer for a shoot or campaign." },
      { title: "Full-day collaboration", text: "A full-day collaboration for larger shoots or more content." },
      { title: "Shoot planning and direction", text: "Planning and on-location direction, with footage ready for editing." },
      { title: "Edits for social", text: "Brand and promo edits and social-first cuts from the shoot." },
      { title: "Deliverables agreed upfront", text: "Deliverables, usage rights and campaign requirements are set before the collaboration." },
    ],
    plansIntro: "Collaboration options (current prices are on the pricing page):",
    pricingSlug: "influencer",
    visuals: [],
    faqs: [
      { q: "How is the price of a collaboration decided?", a: "It depends on the creator, the deliverables, usage rights and the campaign's requirements. Starting prices for half-day and full-day collaborations are on our pricing page." },
      { q: "Do you guarantee reach or sales from influencer campaigns?", a: "No. We don't guarantee specific reach or results." },
      { q: "Can you also shoot and edit the content?", a: "Yes. We plan and shoot on location and edit the footage into brand, promo and social-first videos." },
      { q: "Can this be combined with social media handling?", a: "Yes. Content from a collaboration can feed straight into your social media plan." },
    ],
    related: ["social-media-marketing", "website-development"],
  },
  {
    slug: "seo",
    name: "SEO",
    title: "SEO Services & Local SEO | Pixie Digital Creatives",
    description:
      "SEO services: technical SEO, on-page optimisation, content for search and local SEO, from starter plans to high-competition and multi-location sites.",
    kicker: "SEO services",
    h1: "Be found on Google by the people searching for you.",
    lead:
      "Search engine optimisation (SEO) for businesses that want to be found on Google: technical foundations, on-page optimisation and content written for search, from local SEO to high-competition markets and multi-location setups.",
    summary:
      "SEO (search engine optimisation) is improving a website so search engines can crawl, understand and rank it, and so it appears for the searches your customers make. It combines technical work, on-page optimisation and useful content.",
    includes: [
      { title: "Technical foundations", text: "Crawling and indexing, site speed, canonical URLs, sitemaps, robots.txt and structured data." },
      { title: "On-page optimisation", text: "Page titles, meta descriptions, headings and internal links built around the searches that matter." },
      { title: "Content for search", text: "Pages and articles that answer what your customers are searching for." },
      { title: "Local SEO", text: "Visibility for searches in your area, alongside AI search visibility." },
      { title: "Search Console and analytics", text: "Google Search Console and Analytics set up, so progress is measured on real data." },
    ],
    plansIntro: "SEO plans (current prices are on the pricing page; billing terms are confirmed in your proposal):",
    pricingSlug: "seo",
    visuals: ["search"],
    faqs: [
      { q: "How long does SEO take to show results?", a: "SEO builds over time: search engines need to recrawl and re-evaluate pages, and competition varies by industry and location. We don't promise rankings or timelines; we report on the work done and on your Search Console data." },
      { q: "Can you guarantee first-page rankings?", a: "No. Nobody can honestly guarantee rankings, because search engines decide them. We focus on the things that are in your control: a technically sound site, relevant content and a clear brand." },
      { q: "What is the difference between SEO, AEO and GEO?", a: "SEO helps you rank in search results, AEO (answer engine optimisation) helps your content become the direct answer to a question, and GEO (generative engine optimisation) helps AI assistants understand and mention your brand. Our guide 'SEO vs AEO vs GEO' explains them side by side." },
      { q: "Do you offer local SEO?", a: "Yes. Our Starter plan covers local SEO and AI search visibility; Growth covers full technical SEO and High-Competition covers competitive markets and multi-location setups." },
      { q: "What do you need from us to start?", a: "Access to your website or CMS and to Google Search Console (we can set it up), plus a clear picture of your services, customers and the areas you serve." },
    ],
    related: ["aeo", "geo", "website-development"],
  },
  {
    slug: "aeo",
    name: "AEO",
    title: "AEO: Answer Engine Optimisation | Pixie Digital Creatives",
    description:
      "Answer engine optimisation (AEO): question-led content and answer-ready structure, so search engines and assistants can show your content as the direct answer.",
    kicker: "AEO: answer engine optimisation",
    h1: "Be the direct answer to your customers' questions.",
    lead:
      "Answer engine optimisation (AEO) structures your content around the questions people actually ask, so search engines and voice assistants can show it as the direct answer: question-led content, answer-ready structure and markup that is easy to quote.",
    summary:
      "AEO (answer engine optimisation) is the practice of shaping content so search engines and assistants can lift it as a direct answer, for example in featured snippets, 'People also ask' boxes or voice results. It builds on SEO and focuses on real questions with short, accurate answers.",
    includes: [
      { title: "Question research", text: "Finding the questions your customers ask before they buy." },
      { title: "Question-led content", text: "Pages and sections that answer one question each, clearly and in plain language." },
      { title: "Answer-ready structure", text: "The short answer first, then detail; clear headings, lists and tables that are easy to quote." },
      { title: "Featured results", text: "Content shaped for featured snippets and 'People also ask' results." },
      { title: "Structured data", text: "Markup that tells search engines exactly what a page is about." },
    ],
    plansIntro: "AEO is part of our SEO & AI search plans (current prices are on the pricing page):",
    pricingSlug: "seo",
    visuals: ["answer"],
    faqs: [
      { q: "How is AEO different from SEO?", a: "SEO aims for a good position in the list of results. AEO aims for your content to be the answer itself: the snippet at the top, the 'People also ask' answer or what a voice assistant reads out. Good AEO needs good SEO underneath." },
      { q: "Does AEO help with voice search?", a: "It helps. Voice assistants usually read a single answer, so clear, concise answers to common questions are the content they can use." },
      { q: "Do I need an FAQ page for AEO?", a: "Not necessarily. What matters is that real questions get clear answers on the most relevant pages. Google no longer shows FAQ rich results, but clear question-and-answer content still helps people and answer engines." },
      { q: "Is AEO included in your SEO plans?", a: "Yes. AEO is part of our SEO & AI search work; the exact scope is agreed in your proposal." },
    ],
    related: ["seo", "geo"],
  },
  {
    slug: "geo",
    name: "GEO",
    title: "GEO: Generative Engine Optimisation | Pixie Digital Creatives",
    description:
      "Generative engine optimisation (GEO): help ChatGPT Search, Google AI Overviews, Gemini, Perplexity and Copilot find, understand and cite your business.",
    kicker: "GEO: generative engine optimisation",
    h1: "Help AI assistants understand and mention your brand.",
    lead:
      "Generative engine optimisation (GEO) makes your business easier for AI search tools such as ChatGPT Search, Google AI Overviews, Gemini, Perplexity and Copilot to find, understand and cite: crawlable pages, consistent brand facts, structured data and clear, quotable content.",
    summary:
      "GEO (generative engine optimisation) is improving how a brand appears in answers written by AI tools. It focuses on making content accessible to AI crawlers, stating facts about the business clearly and consistently, and publishing well-structured information worth citing. Nobody can guarantee that an AI assistant will recommend a particular business.",
    includes: [
      { title: "AI crawler access", text: "Content readable without JavaScript and a robots.txt that treats AI search crawlers and AI training crawlers separately." },
      { title: "Brand and entity clarity", text: "The same name, contact details and profiles everywhere, plus Organization structured data." },
      { title: "Structured, clear content", text: "Definitions, comparisons and answers written so they can be quoted accurately." },
      { title: "Citable proof", text: "Real case studies and service pages that AI tools can point to." },
      { title: "llms.txt", text: "An optional plain-text summary of your site for AI tools (helpful, but not a ranking requirement)." },
      { title: "Visibility in AI answers", text: "Regular checks of how AI tools describe your brand for the questions your customers ask." },
    ],
    plansIntro: "GEO is part of our SEO & AI search plans (current prices are on the pricing page):",
    pricingSlug: "seo",
    visuals: ["ai"],
    faqs: [
      { q: "What is the difference between GEO and SEO?", a: "SEO aims for rankings in search results. GEO aims for your brand to be understood and mentioned correctly in AI-written answers. They share the same foundations (a crawlable site, clear content, structured data); GEO adds a focus on consistent brand facts and quotable information." },
      { q: "Can you guarantee that ChatGPT or Google AI will recommend my business?", a: "No. AI tools decide what to include, and nobody can guarantee a recommendation. GEO removes the obstacles and gives these tools clear, accurate information about your business." },
      { q: "How do you measure GEO?", a: "By regularly asking AI tools the questions your customers ask and recording whether and how your brand appears, together with referral traffic from AI tools in your analytics." },
      { q: "Do I need an llms.txt file?", a: "It is optional. llms.txt is a plain-text summary some AI tools may read; it is not a ranking requirement. We add one because it is quick and harmless." },
      { q: "Which AI crawlers should my website allow?", a: "AI search crawlers (such as OAI-SearchBot, PerplexityBot and Claude-SearchBot) fetch pages to show and cite them in answers. Training crawlers (such as GPTBot and ClaudeBot) collect data to train models. Each group can be allowed or blocked separately in robots.txt." },
    ],
    related: ["seo", "aeo", "website-development"],
  },
];

export const servicePage = (slug) => SERVICE_PAGES.find((s) => s.slug === slug) || null;

// Service key (initialData `visual`) -> its service page path; used to link service cards and the footer.
export const servicePathFor = (visual) => {
  const page = SERVICE_PAGES.find((s) => s.visuals.includes(visual));
  return page ? `/services/${page.slug}` : null;
};
