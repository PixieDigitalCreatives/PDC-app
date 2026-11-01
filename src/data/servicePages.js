// One page per main service (/services/<slug>). Every statement is grounded in what the site already
// says: the services list (initialData.js), the pricing plans (pricing.js), the 7-step process and the
// real projects. No invented results, timelines, guarantees or statistics. Questions are answered
// plainly, including "we can't guarantee" where that is the honest answer. Plain data, so the build
// step can use it.
//
// Sections are written answer-first for search and AI answers: each heading is a question people ask
// (built from `term`), with the short answer directly under it.
//   term          the service in a sentence ("website development"), used in the question headings
//   audience      who the service is for (a list)
//   benefits      why it matters, without promising results
//   industries    how it applies to each industry page ({ slug of industries.js, text })
//   steps         how the service runs; website and app pages use the studio's 7-step process instead
//   deliverables  what the client receives
//   faqs          { q, a, links?: [{ to, label }] }; also published as FAQPage structured data
//   pricingSlug   links to /pricing#price-<slug> and lists that category's plans
//   visuals       the service keys (initialData `visual`) this page covers, used to link cards

export const SERVICE_PAGES = [
  {
    slug: "website-development",
    name: "Website Development",
    term: "website development",
    title: "Website Development Agency | Pixie Digital Creatives",
    description:
      "Website development: premium websites, WordPress, e-commerce stores and full-stack web platforms, designed and built by one team at Pixie Digital Creatives.",
    kicker: "Website development agency",
    h1: "Websites designed to be experienced, and built to perform.",
    lead:
      "Custom website development for businesses that want a premium website: designed around your brand, responsive on every screen and built on clean, fast code. From a focused business site to an online store or a custom platform, one team handles design, development and launch.",
    summary:
      "Website development is the work of planning, designing, building and launching a website. At Pixie Digital Creatives it covers custom-designed websites, WordPress websites, e-commerce stores and full-stack web platforms, with a content management system (CMS) wherever your team needs to edit content.",
    audience: [
      "Businesses that need their first professional website",
      "Brands replacing a dated or template website with a premium one",
      "Online stores and D2C brands that sell products",
      "Companies that need a custom platform with accounts, data or integrations",
    ],
    benefits: [
      { title: "A first impression that fits your brand", text: "Your website is often the first place people check before they contact you. A design built around your brand, not a template, shows the quality of your work." },
      { title: "Works on every phone", text: "Most visits happen on a phone, so every page is designed and tested for small screens." },
      { title: "Easier to find", text: "Search foundations (titles, structured data, a sitemap and Search Console) are set up at launch, not added later." },
      { title: "Yours to update", text: "With a CMS set up for your content, your team can change text, images and products without a developer." },
    ],
    includes: [
      { title: "Custom design and build", text: "Layouts, typography and motion designed for your brand rather than taken from a template, including storytelling and premium animation websites." },
      { title: "Responsive on every screen", text: "Designed and tested for phones, tablets and desktops across browsers." },
      { title: "Performance-minded code", text: "Clean front-end code, optimised images and attention to load speed." },
      { title: "WordPress websites", text: "Custom themes, editable page layouts and plugin integration, so your team can keep the site up to date." },
      { title: "Full-stack development", text: "Front-end interfaces, APIs, back end and databases built together as one system." },
      { title: "Search-ready launch", text: "Page titles and descriptions, structured data, a sitemap, Google Analytics 4 and Search Console set up at launch." },
    ],
    industries: [
      { slug: "restaurants-cafes", text: "Menus that read well on a phone, location and opening details, and a design that carries the atmosphere of the venue." },
      { slug: "ecommerce", text: "Online stores with clear categories, product pages that answer buyers' questions and mobile-first shopping." },
      { slug: "fitness-wellness", text: "Programmes, coaches and memberships explained in seconds, with an enquiry form or booking built in." },
      { slug: "creators-authors", text: "Editorial websites that bring a biography, books and works together in one place." },
    ],
    deliverables: [
      "Information architecture and content outlines, agreed before design",
      "Wireframes, desktop and mobile designs and an interactive Figma prototype",
      "A responsive website with a CMS set up for your content",
      "A staging site to review before launch",
      "Launch: deployment, DNS and SSL, Google Analytics 4 and Search Console",
      "A CMS walkthrough and training for your team",
    ],
    plansIntro: "Website types we build (current starting prices are on the pricing page):",
    pricingSlug: "website",
    visuals: ["web", "wordpress", "stack"],
    faqs: [
      {
        q: "How much does a website cost?",
        a: "It depends on the type of website and its features. Our pricing page lists current starting prices in INR for basic, CMS, e-commerce and enterprise websites. Every project is scoped with you first, so the final quote matches what you actually need.",
        links: [{ to: "/blog/website-cost-in-india", label: "Website cost in India: our price guide" }],
      },
      { q: "How long does it take to build a website?", a: "It depends on the number of pages, the features and how quickly content and feedback arrive. We agree a schedule with milestones during the strategy phase, before design begins, so you know what happens when." },
      {
        q: "Which technology is best for a business website?",
        a: "There is no single best choice. WordPress suits websites your team edits often; a custom build suits premium animated experiences and platforms with custom features. Our recent custom projects are built with React and Vite, using GSAP, Framer Motion and Three.js for animation and 3D. We recommend one after the discovery phase, based on your goals.",
        links: [{ to: "/blog/wordpress-vs-custom-website", label: "WordPress vs custom website compared" }],
      },
      { q: "Will I be able to update the website myself?", a: "Yes, when you need to. We set up a CMS with the fields your content needs and include a walkthrough and training at launch." },
      { q: "Is SEO included in website development?", a: "Every website launches with the technical foundations: titles and descriptions, structured data, a sitemap, Google Analytics 4 and Search Console. Ongoing SEO work is a separate service." },
      { q: "Do you support the website after launch?", a: "Yes. Through monthly maintenance or a retainer we monitor performance, apply security updates and backups, and keep improving the site." },
    ],
    related: ["app-development", "seo", "geo"],
  },
  {
    slug: "app-development",
    name: "App Development",
    term: "app development",
    title: "App Development for Android, iOS & Web | Pixie Digital Creatives",
    description:
      "Application development for Android, iOS and the web: MVPs, booking and e-commerce apps and the APIs and databases behind them, by Pixie Digital Creatives.",
    kicker: "Application development",
    h1: "Apps built around how your users actually work.",
    lead:
      "Application development for Android, iOS and the web: from a first version (MVP) to a booking app or a full mobile shopping experience. We plan the product with you, design the interface and build the front end, back end and database as one system.",
    summary:
      "Application development is the process of planning, designing, building and launching software people use on their phones or in a browser. Pixie Digital Creatives builds web applications and mobile apps for Android and iOS, together with the APIs, databases and business systems (such as CRMs) behind them.",
    audience: [
      "Founders testing an idea with a first version (MVP)",
      "Service businesses that take bookings or appointments",
      "Retail and D2C brands that want a mobile shopping app",
      "Teams that need a web app, dashboard or CRM for their own work",
    ],
    benefits: [
      { title: "Start with what users need", text: "Goals, users and flows are mapped first, so the first version stays focused and you can learn from real use sooner." },
      { title: "One system, one team", text: "The app, its API and its database are planned and built together, so the parts fit." },
      { title: "Room to grow", text: "A modular architecture makes it easier to add features after launch." },
    ],
    includes: [
      { title: "Mobile apps for Android and iOS", text: "Apps designed for how your customers use their phones, from booking to shopping." },
      { title: "Web applications", text: "Browser-based applications and dashboards for customers or for your own team." },
      { title: "Product thinking first", text: "Goals, user personas and flows are mapped before features, so the first version focuses on what matters." },
      { title: "APIs, back end and databases", text: "The services and data behind the app, built and integrated with your existing systems where needed." },
      { title: "CRM and business systems", text: "Lead and customer tracking, workflow setup and integrations that keep follow-ups in one place." },
      { title: "Testing across devices", text: "Cross-device and browser testing, speed checks and security checks before launch." },
    ],
    industries: [
      { slug: "ecommerce", text: "A mobile shopping app alongside your online store." },
      { slug: "fitness-wellness", text: "Class and session booking for members, in a service and booking app." },
      { slug: "restaurants-cafes", text: "Table reservations and bookings through a service app." },
    ],
    deliverables: [
      "User personas, flow maps and a technical feasibility scope",
      "A technical stack plan with milestones",
      "High-fidelity mobile and desktop UI and an interactive prototype",
      "The app front end, with its API and database",
      "Testing across devices and browsers",
      "Production deployment, with support options after launch",
    ],
    plansIntro: "App types we build (current starting prices are on the pricing page):",
    pricingSlug: "apps",
    visuals: ["app", "crm"],
    faqs: [
      { q: "How does mobile app development work?", a: "In stages. Discovery sets the goals, the users and the core features; strategy fixes the scope of the first version and the technical stack; then we design each screen, build the app with its API and database, test it across devices and launch it. Mobile apps are released through Google Play and the Apple App Store, and updates follow after launch." },
      {
        q: "How much does it cost to build an app?",
        a: "It depends on the type of app and its features. The pricing page lists current starting prices for an MVP or simple app, a service or booking app and an e-commerce app. Every project is scoped with you before you receive a final quote.",
        links: [{ to: "/blog/website-cost-in-india", label: "Website and app costs in India: our price guide" }],
      },
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
    term: "social media marketing",
    title: "Social Media Marketing & Handling | Pixie Digital Creatives",
    description:
      "Social media marketing and handling: platform strategy, content planning, daily posting, reels and Meta Ads, from one platform to full-service management.",
    kicker: "Social media marketing & handling",
    h1: "A brand presence shaped by strategy, then kept active every day.",
    lead:
      "Social media marketing and social media handling for brands that want consistent, on-brand channels: platform strategy, content planning, day-to-day posting and community upkeep, plus paid campaigns on Facebook and Instagram when you want to reach more of the right people.",
    summary:
      "Social media marketing is using platforms such as Instagram and Facebook to build a brand and reach customers. Social media handling is the day-to-day part: planning, creating and posting content and looking after the community. Pixie Digital Creatives does both, and runs paid social campaigns.",
    audience: [
      "Businesses that don't have time to post consistently",
      "Brands starting on a new platform or relaunching their channels",
      "Businesses ready to run paid campaigns on Facebook and Instagram",
      "Venues and shops that sell through visuals, such as cafés, gyms and boutiques",
    ],
    benefits: [
      { title: "Consistency without the daily effort", text: "A content calendar and scheduled posting keep your channels active while you run the business." },
      { title: "Content that looks like your brand", text: "One voice and one visual style across every post, reel and ad." },
      { title: "Reach beyond your followers", text: "Meta Ads show your content to new audiences you choose, on Facebook and Instagram." },
    ],
    includes: [
      { title: "Platform strategy", text: "Which platforms to focus on, the content direction for each and a consistent brand voice." },
      { title: "Social media handling", text: "Scheduling and posting, community upkeep and a consistent presence, so your channels stay active." },
      { title: "Content and reels", text: "Brand and promo edits and social-first cuts, plus on-location shoots when you need new footage." },
      { title: "Meta Ads", text: "Facebook and Instagram campaigns: setup, creative and audiences, and ongoing optimisation." },
      { title: "Social media ads", text: "Platform-specific creative and audience targeting for paid social campaigns." },
      { title: "Content planning", text: "Content calendars and editable content systems that keep everything on-brand." },
    ],
    industries: [
      { slug: "restaurants-cafes", text: "Reels of new dishes, events and the atmosphere of the venue." },
      { slug: "fitness-wellness", text: "Classes, coaches and community content that keeps members engaged." },
      { slug: "ecommerce", text: "Product reels and Meta Ads for launches and offers." },
      { slug: "creators-authors", text: "Announcements of new work, books and events." },
    ],
    steps: [
      { name: "Strategy", text: "Agree the platforms, the content direction and the brand voice." },
      { name: "Content plan", text: "Build the content calendar for the month." },
      { name: "Create", text: "Design posts and edit reels; shoot new footage on location when needed." },
      { name: "Publish and manage", text: "Schedule and post, and look after the community." },
      { name: "Paid campaigns", text: "Set up and optimise Meta Ads when they are part of your plan." },
      { name: "Review", text: "Look at what worked and adjust the next month's plan." },
    ],
    deliverables: [
      "A platform strategy and content direction",
      "A monthly content calendar",
      "Posts and reels published on your channels (20 a month on Starter, about 30 on Growth)",
      "Community upkeep on the platforms in your plan",
      "Meta Ads campaigns, when they are included",
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
    term: "model and influencer marketing",
    title: "Model & Influencer Marketing | Pixie Digital Creatives",
    description:
      "Model and influencer collaborations for brand shoots and social campaigns: half-day and full-day options, combined with video shoots, edits and social media.",
    kicker: "Model & influencer marketing",
    h1: "Models and creators for your shoots and campaigns.",
    lead:
      "We arrange collaborations with models and influencers for brand shoots and social campaigns, as a half-day or a full-day collaboration, and can combine them with our video shoots, editing and social media handling.",
    summary:
      "Influencer marketing means working with creators who have an engaged audience to promote a brand; a model collaboration brings a professional face to your photos and videos. Pixie Digital Creatives arranges these collaborations for shoots and campaigns. Final pricing depends on the creator, deliverables, usage rights and campaign requirements.",
    audience: [
      "Brands planning a photo or video shoot",
      "Product launches that need creator content",
      "Businesses whose social content needs real faces",
    ],
    benefits: [
      { title: "People in your content", text: "A model or creator gives your photos and videos a human face." },
      { title: "Content ready for social", text: "Footage from the collaboration is edited into brand, promo and social-first videos." },
      { title: "Clear terms upfront", text: "Deliverables, usage rights and requirements are agreed before the collaboration." },
    ],
    includes: [
      { title: "Half-day collaboration", text: "A half-day collaboration with a model or influencer for a shoot or campaign." },
      { title: "Full-day collaboration", text: "A full-day collaboration for larger shoots or more content." },
      { title: "Shoot planning and direction", text: "Planning and on-location direction, with footage ready for editing." },
      { title: "Edits for social", text: "Brand and promo edits and social-first cuts from the shoot." },
      { title: "Deliverables agreed upfront", text: "Deliverables, usage rights and campaign requirements are set before the collaboration." },
    ],
    industries: [
      { slug: "restaurants-cafes", text: "Creators filming the venue, the food and the experience." },
      { slug: "ecommerce", text: "Creators showing products in use, for launches and ads." },
      { slug: "fitness-wellness", text: "Models for campaign shoots and class promotions." },
    ],
    steps: [
      { name: "Brief", text: "Agree the goal, the content you need and the budget." },
      { name: "Match", text: "Arrange a model or influencer who suits the brand and the campaign." },
      { name: "Agree terms", text: "Set the deliverables, usage rights and requirements." },
      { name: "Shoot", text: "Plan and direct the shoot on location, as a half or full day." },
      { name: "Edit", text: "Edit the footage into brand, promo and social-first videos." },
      { name: "Publish", text: "Use the content in your social media plan or campaigns." },
    ],
    deliverables: [
      "A half-day or full-day collaboration with a model or influencer",
      "Shoot planning and on-location direction",
      "Edited brand, promo and social-first videos",
      "Deliverables and usage rights agreed before the shoot",
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
    term: "SEO",
    title: "SEO Services & Local SEO | Pixie Digital Creatives",
    description:
      "SEO services: technical SEO, on-page optimisation, content for search and local SEO, from starter plans to high-competition and multi-location sites.",
    kicker: "SEO services",
    h1: "Be found on Google by the people searching for you.",
    lead:
      "Search engine optimisation (SEO) for businesses that want to be found on Google: technical foundations, on-page optimisation and content written for search, from local SEO to high-competition markets and multi-location setups.",
    summary:
      "SEO (search engine optimisation) is improving a website so search engines can crawl, understand and rank it, and so it appears for the searches your customers make. It combines technical work, on-page optimisation and useful content.",
    audience: [
      "Local businesses that want to be found in their area",
      "Websites whose pages don't show up on Google",
      "Businesses in competitive markets",
      "Brands with several locations",
    ],
    benefits: [
      { title: "Found when customers search", text: "SEO aims to put your pages in front of people who are already looking for what you offer." },
      { title: "Visits you don't pay per click for", text: "Visits from search results don't stop when an ad budget runs out." },
      { title: "Decisions based on data", text: "Search Console and Analytics show which searches bring people in and which pages need work." },
    ],
    includes: [
      { title: "Technical foundations", text: "Crawling and indexing, site speed, canonical URLs, sitemaps, robots.txt and structured data." },
      { title: "On-page optimisation", text: "Page titles, meta descriptions, headings and internal links built around the searches that matter." },
      { title: "Content for search", text: "Pages and articles that answer what your customers are searching for." },
      { title: "Local SEO", text: "Visibility for searches in your area, alongside AI search visibility." },
      { title: "Search Console and analytics", text: "Google Search Console and Analytics set up, so progress is measured on real data." },
    ],
    industries: [
      { slug: "restaurants-cafes", text: "Local searches such as 'café near me', and searches for the venue's name." },
      { slug: "ecommerce", text: "Category and product pages structured for search." },
      { slug: "fitness-wellness", text: "Local searches for gyms, classes and trainers." },
      { slug: "creators-authors", text: "Being found when readers search for your name or your books." },
    ],
    steps: [
      { name: "Audit", text: "Check crawling, indexing, speed and structured data, and find what holds the site back." },
      { name: "Research", text: "Find the searches and questions that matter to your customers." },
      { name: "Fix the foundations", text: "Technical fixes: canonical URLs, sitemap, robots.txt, structured data and speed." },
      { name: "Optimise pages", text: "Titles, descriptions, headings and internal links." },
      { name: "Create content", text: "Pages and articles that answer what customers search for." },
      { name: "Measure", text: "Report on the work done and on your Search Console data." },
    ],
    deliverables: [
      "Technical fixes on your website",
      "Optimised titles, descriptions, headings and internal links",
      "New or improved pages and articles",
      "Google Search Console and Analytics set up",
      "Reports on the work done and on your Search Console data",
    ],
    plansIntro: "SEO plans (current prices are on the pricing page; billing terms are confirmed in your proposal):",
    pricingSlug: "seo",
    visuals: ["search"],
    faqs: [
      { q: "How long does SEO take to show results?", a: "SEO builds over time: search engines need to recrawl and re-evaluate pages, and competition varies by industry and location. We don't promise rankings or timelines; we report on the work done and on your Search Console data." },
      { q: "Can you guarantee first-page rankings?", a: "No. Nobody can honestly guarantee rankings, because search engines decide them. We focus on the things that are in your control: a technically sound site, relevant content and a clear brand." },
      {
        q: "What is the difference between SEO, AEO and GEO?",
        a: "SEO helps you rank in search results, AEO (answer engine optimisation) helps your content become the direct answer to a question, and GEO (generative engine optimisation) helps AI assistants understand and mention your brand.",
        links: [{ to: "/blog/seo-vs-aeo-vs-geo", label: "SEO vs AEO vs GEO, side by side" }],
      },
      {
        q: "What can a small business do first to be found online?",
        a: "Start with a Google Business Profile, a fast website with one page per service, clear answers to the questions customers ask and the same business details everywhere. Then add genuine reviews and keep measuring in Search Console.",
        links: [{ to: "/blog/improve-online-visibility-small-business", label: "How a small business can improve its online visibility" }],
      },
      { q: "Do you offer local SEO?", a: "Yes. Our Starter plan covers local SEO and AI search visibility; Growth covers full technical SEO and High-Competition covers competitive markets and multi-location setups." },
      { q: "What do you need from us to start?", a: "Access to your website or CMS and to Google Search Console (we can set it up), plus a clear picture of your services, customers and the areas you serve." },
    ],
    related: ["aeo", "geo", "website-development"],
  },
  {
    slug: "aeo",
    name: "AEO",
    term: "AEO",
    title: "AEO: Answer Engine Optimisation | Pixie Digital Creatives",
    description:
      "Answer engine optimisation (AEO): question-led content and answer-ready structure, so search engines and assistants can show your content as the direct answer.",
    kicker: "AEO: answer engine optimisation",
    h1: "Be the direct answer to your customers' questions.",
    lead:
      "Answer engine optimisation (AEO) structures your content around the questions people actually ask, so search engines and voice assistants can show it as the direct answer: question-led content, answer-ready structure and markup that is easy to quote.",
    summary:
      "AEO (answer engine optimisation) is the practice of shaping content so search engines and assistants can lift it as a direct answer, for example in featured snippets, 'People also ask' boxes or voice results. It builds on SEO and focuses on real questions with short, accurate answers.",
    audience: [
      "Businesses whose customers ask the same questions before buying",
      "Service providers who need to explain pricing, process or options",
      "Websites that rank but rarely appear as the answer",
    ],
    benefits: [
      { title: "The answer, not just a result", text: "Clear answers are what featured snippets, 'People also ask' boxes and voice assistants can show." },
      { title: "Trust before the first call", text: "Customers who find straight answers to their questions arrive better informed." },
      { title: "Ready for AI answers", text: "The same clear structure helps AI search tools quote your content accurately." },
    ],
    includes: [
      { title: "Question research", text: "Finding the questions your customers ask before they buy." },
      { title: "Question-led content", text: "Pages and sections that answer one question each, clearly and in plain language." },
      { title: "Answer-ready structure", text: "The short answer first, then detail; clear headings, lists and tables that are easy to quote." },
      { title: "Featured results", text: "Content shaped for featured snippets and 'People also ask' results." },
      { title: "Structured data", text: "Markup that tells search engines exactly what a page is about." },
    ],
    industries: [
      { slug: "restaurants-cafes", text: "Answers about opening hours, the menu and bookings." },
      { slug: "ecommerce", text: "Answers about sizing, delivery and returns on product and help pages." },
      { slug: "fitness-wellness", text: "Answers about memberships, class times and trial sessions." },
    ],
    steps: [
      { name: "Collect questions", text: "From your customers, your sales conversations, Search Console and 'People also ask'." },
      { name: "Map them to pages", text: "Decide which page answers each question, so your pages don't compete." },
      { name: "Write the answers", text: "The short answer first, then the detail, in plain language." },
      { name: "Structure", text: "Question headings, lists, tables and structured data." },
      { name: "Check and refine", text: "See how your pages appear for the target questions and improve them." },
    ],
    deliverables: [
      "A list of customer questions, each mapped to a page",
      "New or rewritten question-led sections and pages",
      "Answer-ready structure: question headings, lists and tables",
      "Structured data on key pages",
      "Checks of how your pages appear for the target questions",
    ],
    plansIntro: "AEO is part of our SEO & AI search plans (current prices are on the pricing page):",
    pricingSlug: "seo",
    visuals: ["answer"],
    faqs: [
      { q: "How is AEO different from SEO?", a: "SEO aims for a good position in the list of results. AEO aims for your content to be the answer itself: the snippet at the top, the 'People also ask' answer or what a voice assistant reads out. Good AEO needs good SEO underneath." },
      { q: "What is the difference between AEO and GEO?", a: "AEO aims for your content to be the single direct answer: a featured snippet, a 'People also ask' answer or what a voice assistant reads out. GEO aims for AI tools that write answers from several sources (ChatGPT Search, Google AI Overviews, Gemini, Perplexity, Copilot) to understand and mention your brand accurately. Both rest on SEO." },
      { q: "Does AEO help with voice search?", a: "It helps. Voice assistants usually read a single answer, so clear, concise answers to common questions are the content they can use." },
      { q: "Do I need an FAQ page for AEO?", a: "Not necessarily. What matters is that real questions get clear answers on the most relevant pages. Google no longer shows FAQ rich results, but clear question-and-answer content still helps people and answer engines." },
      { q: "Is AEO included in your SEO plans?", a: "Yes. AEO is part of our SEO & AI search work; the exact scope is agreed in your proposal." },
    ],
    related: ["seo", "geo"],
  },
  {
    slug: "geo",
    name: "GEO",
    term: "GEO",
    title: "GEO: Generative Engine Optimisation | Pixie Digital Creatives",
    description:
      "Generative engine optimisation (GEO): help ChatGPT Search, Google AI Overviews, Gemini, Perplexity and Copilot find, understand and cite your business.",
    kicker: "GEO: generative engine optimisation",
    h1: "Help AI assistants understand and mention your brand.",
    lead:
      "Generative engine optimisation (GEO) makes your business easier for AI search tools such as ChatGPT Search, Google AI Overviews, Gemini, Perplexity and Copilot to find, understand and cite: crawlable pages, consistent brand facts, structured data and clear, quotable content.",
    summary:
      "GEO (generative engine optimisation) is improving how a brand appears in answers written by AI tools. It focuses on making content accessible to AI crawlers, stating facts about the business clearly and consistently, and publishing well-structured information worth citing. Nobody can guarantee that an AI assistant will recommend a particular business.",
    audience: [
      "Brands that want ChatGPT, Gemini and Perplexity to describe them correctly",
      "Websites built with JavaScript frameworks that AI crawlers may not read",
      "Businesses whose details differ between their website and their profiles",
    ],
    benefits: [
      { title: "Described accurately", text: "Consistent facts make it more likely that AI tools describe your business correctly." },
      { title: "Readable by AI crawlers", text: "Content in plain HTML can be read by crawlers that don't run JavaScript." },
      { title: "Builds on your SEO", text: "The same foundations help search engines too." },
    ],
    includes: [
      { title: "AI crawler access", text: "Content readable without JavaScript and a robots.txt that treats AI search crawlers and AI training crawlers separately." },
      { title: "Brand and entity clarity", text: "The same name, contact details and profiles everywhere, plus Organization structured data." },
      { title: "Structured, clear content", text: "Definitions, comparisons and answers written so they can be quoted accurately." },
      { title: "Citable proof", text: "Real case studies and service pages that AI tools can point to." },
      { title: "llms.txt", text: "An optional plain-text summary of your site for AI tools (helpful, but not a ranking requirement)." },
      { title: "Visibility in AI answers", text: "Regular checks of how AI tools describe your brand for the questions your customers ask." },
    ],
    industries: [
      { slug: "ecommerce", text: "Accurate descriptions when shoppers ask AI tools which brands to try." },
      { slug: "restaurants-cafes", text: "Correct details when people ask an AI assistant where to eat." },
      { slug: "creators-authors", text: "AI tools describing your work and your books correctly." },
    ],
    steps: [
      { name: "Check access", text: "Test what AI crawlers can read and review robots.txt." },
      { name: "Fix crawlability", text: "Make key content readable without JavaScript." },
      { name: "Align brand facts", text: "The same name, contact details and profiles everywhere, plus Organization structured data." },
      { name: "Publish citable content", text: "Service pages, definitions, comparisons and case studies." },
      { name: "Monitor", text: "Ask AI tools your customers' questions regularly and record how your brand appears." },
    ],
    deliverables: [
      "An AI crawler access review and a robots.txt policy",
      "Key content readable without JavaScript",
      "Organization, Service and Article structured data",
      "Consistent brand facts across the website and profiles",
      "An llms.txt file",
      "Regular checks of how AI tools describe your brand",
    ],
    plansIntro: "GEO is part of our SEO & AI search plans (current prices are on the pricing page):",
    pricingSlug: "seo",
    visuals: ["ai"],
    faqs: [
      { q: "What is the difference between GEO and SEO?", a: "SEO aims for rankings in search results. GEO aims for your brand to be understood and mentioned correctly in AI-written answers. They share the same foundations (a crawlable site, clear content, structured data); GEO adds a focus on consistent brand facts and quotable information." },
      {
        q: "How can a business appear in AI-generated answers?",
        a: "There is no switch to turn on. Make your content readable without JavaScript, allow AI search crawlers in robots.txt, keep your business details identical everywhere, describe the business with structured data and publish clear, useful pages worth citing, such as service pages, guides and case studies. Even then, the AI tools decide what to include.",
        links: [{ to: "/blog/what-is-generative-engine-optimization", label: "Our practical guide to GEO" }],
      },
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
