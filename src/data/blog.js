// Blog (/blog, /blog/<slug>): educational articles that explain, compare and guide. General knowledge,
// the studio's own process and its own published prices only: no invented statistics, studies, clients
// or guarantees. Each article opens with a short answer, for readers and for answer engines.
// Section shape: { h2, p: [paragraphs], list?: [items], ordered?: bool, table?: { head: [], rows: [[]] },
//   price?: "<pricing category slug>" }. `price` shows that category's live prices (Admin → Pricing &
//   Plans) as a sentence and a table, right under the heading.
import { PROCESS_PHASES } from "./siteCopy.js";

const AUTHOR = "Pixie Digital Creatives";

export const POSTS = [
  {
    slug: "seo-vs-aeo-vs-geo",
    title: "SEO vs AEO vs GEO: What's the Difference?",
    description:
      "SEO, AEO and GEO compared side by side: what each one targets, how they fit together and what to do first to be found in search, answers and AI tools.",
    date: "2026-11-01",
    author: AUTHOR,
    kicker: "Search, answers and AI",
    lead:
      "People now find businesses in three places: the classic list of search results, direct answers at the top of the page or from a voice assistant, and answers written by AI tools such as ChatGPT Search, Google AI Overviews, Gemini, Perplexity and Copilot. SEO, AEO and GEO are the disciplines that target each of them.",
    services: ["seo", "aeo", "geo"],
    sections: [
      {
        h2: "The short answer",
        list: [
          "SEO (search engine optimisation) helps your pages rank in search results.",
          "AEO (answer engine optimisation) helps your content become the direct answer to a question.",
          "GEO (generative engine optimisation) helps AI tools understand your brand and mention it accurately in the answers they write.",
        ],
      },
      {
        h2: "SEO, AEO and GEO side by side",
        table: {
          head: ["", "SEO", "AEO", "GEO"],
          rows: [
            ["Goal", "Rank pages in search results", "Become the direct answer", "Be understood and cited by AI tools"],
            ["Where it shows", "Google and Bing results pages", "Featured snippets, 'People also ask', voice assistants", "ChatGPT Search, AI Overviews, Gemini, Perplexity, Copilot"],
            ["Main focus", "Technical health, relevant content, links", "Real questions with short, accurate answers", "Crawlable content, consistent brand facts, structured data, citable information"],
            ["How to measure", "Rankings, clicks and impressions in Search Console", "Snippet and 'People also ask' appearances", "Brand mentions in AI answers, referral traffic from AI tools"],
          ],
        },
      },
      {
        h2: "How they fit together",
        p: [
          "SEO, AEO and GEO are layers, not alternatives. AI tools and answer engines rely on the same foundations as search engines: pages they can crawl, content they can understand and a business they can identify. A site that is slow, hard to crawl or vague about what it does struggles in all three.",
          "On top of those foundations, AEO adds a focus on questions and concise answers, and GEO adds a focus on clear, consistent facts about the business and information that is worth quoting, such as definitions, comparisons and real case studies.",
        ],
      },
      {
        h2: "What should a business do first?",
        ordered: true,
        list: [
          "Fix the technical basics: a fast, secure site with unique page titles, a sitemap and content that is readable without JavaScript.",
          "Give every main service its own page that explains what it is, who it is for and what is included.",
          "Answer the questions customers really ask, on the pages where they would look for the answer.",
          "Keep brand facts identical everywhere (name, website, phone, email, social profiles) and describe them with structured data.",
          "Measure: use Google Search Console for search, and regularly ask AI tools the questions your customers ask to see whether and how your brand appears.",
        ],
      },
      {
        h2: "A note on guarantees",
        p: [
          "No agency can guarantee rankings, featured snippets or a recommendation from an AI assistant, because search engines and AI tools make those decisions. What a good strategy does is remove the obstacles and give these systems clear, accurate and useful information about your business.",
        ],
      },
    ],
  },
  {
    slug: "what-is-generative-engine-optimization",
    title: "What Is GEO? A Practical Guide to Generative Engine Optimisation",
    description:
      "A practical introduction to GEO (generative engine optimisation): how AI tools find information, a checklist for your website, what to avoid and how to measure.",
    date: "2026-11-01",
    author: AUTHOR,
    kicker: "GEO explained",
    lead:
      "Generative engine optimisation (GEO) is the work of making a business easy for AI tools to find, understand and cite. When someone asks ChatGPT Search, Google AI Overviews, Gemini, Perplexity or Copilot for a recommendation, those tools write an answer from the information they can access. GEO makes sure accurate information about your business is part of that picture.",
    services: ["geo", "seo", "aeo"],
    sections: [
      {
        h2: "How AI tools find information",
        p: [
          "AI search tools use crawlers, just as search engines do. Some crawlers fetch pages to answer a question right now and link to their sources (for example OAI-SearchBot, PerplexityBot and Claude-SearchBot). Others collect pages to train future models (for example GPTBot and ClaudeBot). Your robots.txt file can allow or block each group separately.",
          "Many of these crawlers do not run JavaScript. If your website only shows its text after JavaScript loads, they may see an almost empty page, even though visitors and Google see everything.",
        ],
      },
      {
        h2: "A GEO checklist for your website",
        ordered: true,
        list: [
          "Make sure your main content is in the HTML, readable without JavaScript.",
          "Decide your crawler policy and write it in robots.txt: search crawlers and training crawlers as separate groups.",
          "Keep brand facts identical everywhere: business name, website, phone, email and social profiles.",
          "Add structured data: Organization for the business, Service for each service, Article for guides and BreadcrumbList for navigation.",
          "Publish citable content: clear definitions, honest comparisons, detailed service pages and real case studies.",
          "Answer real questions in plain language, with the short answer first.",
          "Optionally add an llms.txt file: a plain-text summary of your site that some AI tools may read. It is not a ranking requirement.",
        ],
      },
      {
        h2: "What to avoid",
        list: [
          "Invented reviews, statistics, awards or client names: AI tools and search engines compare sources, and false claims damage trust.",
          "Stuffing pages with keywords: write for people, using the words they use.",
          "Hiding text that visitors cannot see: the content crawlers read should match what people read.",
        ],
      },
      {
        h2: "How to measure GEO",
        p: [
          "There is no single GEO ranking report. A practical approach is to keep a list of the questions your customers ask, put them to the main AI tools every month, and record whether your brand appears and whether the description is accurate.",
          "Your analytics can also show visits that arrive from AI tools, such as chatgpt.com or perplexity.ai, and Google Search Console includes clicks and impressions from AI features in its web search data.",
        ],
      },
      {
        h2: "Can GEO guarantee that AI tools recommend you?",
        p: [
          "No. AI tools decide what they include, and those decisions change as the tools evolve. GEO improves the odds by making accurate, useful information about your business easy to find, understand and quote.",
        ],
      },
    ],
  },
  {
    slug: "wordpress-vs-custom-website",
    title: "WordPress vs Custom Website: Which Should Your Business Choose?",
    description:
      "WordPress or a custom-built website? A plain comparison of editing, design freedom, features, performance and maintenance, and how to choose for your business.",
    date: "2026-11-01",
    author: AUTHOR,
    kicker: "Website development guide",
    lead:
      "Two common ways to build a business website are WordPress, a content management system with themes and plugins, and a custom build, where the site is designed and coded specifically for you. Both can produce a premium website. The right choice depends on how you will use it.",
    services: ["website-development"],
    sections: [
      {
        h2: "The short answer",
        p: [
          "Choose WordPress if your team will edit content often and the features you need are common ones, such as forms, a blog or galleries. Choose a custom website if the design, the interactions or the features are specific to your business. Both can be premium; the right choice depends on how you will use the site.",
        ],
      },
      {
        h2: "WordPress and custom websites compared",
        table: {
          head: ["", "WordPress", "Custom website"],
          rows: [
            ["Best for", "Content-heavy sites your team edits often", "Premium animated experiences and platforms with custom features"],
            ["Editing content", "Built-in editor; easy for non-technical teams", "Through a CMS set up for your content"],
            ["Design freedom", "High with a custom theme", "Complete: every layout and interaction is designed"],
            ["Custom features", "Through plugins or custom development", "Built exactly to your requirements"],
            ["Performance", "Depends on the theme and plugins", "Tuned specifically for the site"],
            ["Maintenance", "Regular core, theme and plugin updates", "Updates to the code and its dependencies"],
          ],
        },
      },
      {
        h2: "When WordPress is the better choice",
        list: [
          "Your team will publish or edit content every week.",
          "You need common features (forms, blogs, galleries) that plugins already cover well.",
          "You want a familiar editor that many people already know.",
        ],
      },
      {
        h2: "When a custom website is the better choice",
        list: [
          "The design relies on storytelling, motion and interactions that a theme cannot deliver.",
          "You need features or integrations that are specific to your business.",
          "The website is part of a larger product, such as a platform with accounts, data or an app.",
        ],
      },
      {
        h2: "Can you combine the two?",
        p: [
          "Yes. A 'headless' setup uses WordPress only to manage content, while a custom front end displays it. This gives editors a familiar tool and designers full freedom, at the cost of a more complex build.",
        ],
      },
      {
        h2: "How we decide with clients",
        p: [
          "We recommend a platform after the discovery phase, once we understand your goals, your team and the features you need. Either way, every website we launch includes the search foundations and a handover so your team can manage the content.",
        ],
      },
    ],
  },
  {
    slug: "how-to-plan-a-website-project",
    title: "How to Plan a Website Project: 7 Steps From First Call to Launch",
    description:
      "A step-by-step guide to planning a website or app project: discovery, strategy, design, development, testing, launch and growth, and what each step delivers.",
    date: "2026-11-01",
    author: AUTHOR,
    kicker: "Website project guide",
    lead:
      "A website project goes more smoothly when everyone knows what happens next. These are the seven steps we follow at Pixie Digital Creatives for every website and app, with what each step delivers.",
    services: ["website-development", "app-development"],
    sections: [
      ...PROCESS_PHASES.map((phase, i) => ({
        h2: `${i + 1}. ${phase.name}`,
        p: [`${phase.tagline} ${phase.desc}`],
        list: phase.deliverables,
        listLabel: "What this step delivers:",
      })),
      {
        h2: "Before you contact an agency: a short checklist",
        list: [
          "What should the website achieve? (For example enquiries, sales or bookings.)",
          "Who are your customers, and what do they need to find quickly?",
          "Two or three websites you like, and why.",
          "The content you already have: text, photos, videos, logo.",
          "A budget range and any fixed dates (such as a launch event).",
        ],
      },
    ],
  },
  {
    slug: "website-cost-in-india",
    title: "How Much Does a Website Cost in India? 2026 Price Guide",
    description:
      "Website and app development costs in India for 2026: our current INR prices by type, what affects the cost, ongoing costs and how to get an accurate quote.",
    date: "2026-11-01",
    author: AUTHOR,
    kicker: "Pricing guide",
    lead:
      "The honest answer is that it depends on what the website has to do. A basic business website and a custom e-commerce platform are different projects, with different prices. This guide uses our own current prices in Indian rupees (INR) to show the ranges, then explains what moves a quote up or down.",
    services: ["website-development", "app-development"],
    sections: [
      {
        h2: "The short answer",
        price: "website",
        p: [
          "The type of website matters most: how many pages it has, whether your team needs to edit it, whether it sells online and how much custom functionality it needs.",
        ],
      },
      {
        h2: "What affects the cost of a website?",
        list: [
          "Pages and templates: a five-page site and a fifty-page site are different projects.",
          "Custom design or a theme: a design made for your brand takes more time than adapting a ready-made theme.",
          "Content management: a CMS with fields for your content lets your team edit the site, and needs setting up.",
          "E-commerce: products, payments, shipping and order management add work.",
          "Custom features and integrations: bookings, customer accounts, CRMs or other business systems.",
          "Animation and interaction: storytelling, motion and 3D take extra design and development time.",
          "Content: whether the text, photos and videos already exist or still have to be created.",
        ],
      },
      {
        h2: "How much does an app cost in India?",
        price: "apps",
        p: [
          "Apps usually cost more than websites because they need a back end, a database and testing on many devices. Starting with an MVP (a first version with only the core features) keeps the first budget smaller.",
        ],
      },
      {
        h2: "Ongoing costs to plan for",
        p: ["The build is not the only cost. Ask any agency whether these are included in a quote:"],
        list: [
          "Domain name renewal",
          "Hosting, plus a database for apps and platforms",
          "Maintenance: security updates, backups and fixes",
          "Paid plugins, themes or third-party services the site uses",
          "New content, features and marketing after launch",
        ],
      },
      {
        h2: "Why do quotes for the same website differ so much?",
        p: [
          "Two quotes for 'a website' can describe very different work. One may adapt a ready-made theme with your logo; another may include research, a custom design, a CMS, search setup and training. Compare what each quote includes, not only the price.",
        ],
      },
      {
        h2: "How to get an accurate quote",
        ordered: true,
        list: [
          "Write down what the website should achieve: enquiries, sales or bookings.",
          "List the pages and features you need now, and the ones that can wait.",
          "Note the content you already have: text, photos, videos and logo.",
          "Share two or three websites you like, and why.",
          "Give a budget range, so the proposal can be shaped to fit it.",
        ],
      },
      {
        h2: "A note on these prices",
        p: [
          "The prices in this guide are Pixie Digital Creatives' current prices in INR, taken from our pricing page; they are not a survey of the market. Every project is scoped with you before you receive a final quote. If you are outside India, you can ask for a quote in your currency.",
        ],
      },
    ],
  },
  {
    slug: "improve-online-visibility-small-business",
    title: "How Can a Small Business Improve Its Online Visibility?",
    description:
      "A practical checklist for small businesses: Google Business Profile, a clear website, service pages, answers to customer questions, reviews and AI search.",
    date: "2026-11-01",
    author: AUTHOR,
    kicker: "Online visibility guide",
    lead:
      "Online visibility means being easy to find, and easy to understand, wherever customers look: Google Search and Maps, social media and now AI tools such as ChatGPT and Gemini. For a small business, most of it comes down to a few basics, done well and kept up to date.",
    services: ["seo", "geo", "social-media-marketing"],
    sections: [
      {
        h2: "The short answer",
        ordered: true,
        list: [
          "Set up and complete your Google Business Profile.",
          "Make sure your website says what you do, where you work and how to contact you, and works well on phones.",
          "Give each service its own page.",
          "Answer the questions customers ask before they buy.",
          "Use the same business name, phone, email and address (if you show one) everywhere.",
          "Ask happy customers for genuine reviews.",
          "Post regularly on the one or two social platforms your customers use.",
          "Make your website readable by AI search tools.",
        ],
      },
      {
        h2: "1. Set up your Google Business Profile",
        p: [
          "A Google Business Profile is what appears in Google Maps and in the business panel when people search for your name or for something like 'bakery near me'. It is free. Choose the right category, add your opening hours, services, photos and website, and keep it up to date. Businesses without a shop or office can set a service area instead of showing an address. Bing has an equivalent called Bing Places.",
        ],
      },
      {
        h2: "2. Make your website answer the basics",
        p: [
          "Within a few seconds, a visitor should know what you do, who it is for, where you work and how to get in touch. Most people will check on a phone, so the site needs to be fast and easy to read on a small screen.",
        ],
        list: [
          "A headline that says what you do",
          "Your services, with starting prices if you can share them",
          "Contact details on every page",
          "Page titles and descriptions that match what people search for",
        ],
      },
      {
        h2: "3. Give each service its own page",
        p: [
          "One page that lists everything you do rarely ranks for any of it. A page per service, explaining what it is, who it is for, what is included and what it costs, gives search engines and AI tools a clear answer to point to.",
        ],
      },
      {
        h2: "4. Answer the questions customers ask",
        p: [
          "Write down the questions you hear on calls and in messages: price, timing, process, what is included. Answer each one in plain language on the most relevant page, with the short answer first. This is the core of answer engine optimisation (AEO).",
        ],
      },
      {
        h2: "5. Keep your business details identical everywhere",
        p: [
          "Search engines and AI tools compare what different sources say about you. Use exactly the same business name, phone number, email, website and address (if you show one) on your website, your Google Business Profile, your social profiles and directory listings.",
        ],
      },
      {
        h2: "6. Collect genuine reviews",
        p: [
          "Reviews help people decide and help search engines judge a business. Ask customers after a good experience, and reply to reviews, including critical ones. Never buy reviews or write them yourself: it breaks Google's policies and damages trust.",
        ],
      },
      {
        h2: "7. Be active where your customers are",
        p: [
          "You don't need every platform. Pick the one or two your customers actually use, post consistently and link back to your website. A content calendar makes this manageable.",
        ],
      },
      {
        h2: "8. Make your website readable by AI search tools",
        p: [
          "AI tools such as ChatGPT Search, Perplexity and Google's AI Overviews write answers from pages they can read. Make sure your main content is in the HTML rather than only loaded by JavaScript, allow AI search crawlers in robots.txt and describe the business with structured data. This is generative engine optimisation (GEO). Nobody can guarantee that an AI tool will mention you, but these steps remove the obstacles.",
        ],
      },
      {
        h2: "How do you know it's working?",
        list: [
          "Google Search Console: the searches you appear for, with clicks and impressions",
          "Google Business Profile performance: calls, website clicks and direction requests",
          "Analytics: where visitors come from, including AI tools such as chatgpt.com and perplexity.ai",
          "A monthly check: ask AI tools the questions your customers ask and note whether you appear",
        ],
      },
      {
        h2: "What to avoid",
        list: [
          "Fake reviews and invented statistics or awards",
          "Stuffing pages with keywords",
          "Different names or phone numbers on different sites",
          "Buying links from link farms",
        ],
      },
    ],
  },
];

export const blogPost = (slug) => POSTS.find((p) => p.slug === slug) || null;

// Words in an article, for reading time (about 200 words per minute).
export const postWords = (post) =>
  [post.lead, ...post.sections.flatMap((s) => [s.h2, ...(s.p || []), ...(s.list || []), ...(s.table ? s.table.rows.flat() : [])])]
    .join(" ")
    .split(/\s+/).length;
export const readingMinutes = (post) => Math.max(1, Math.round(postWords(post) / 200));
