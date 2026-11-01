// Blog (/blog, /blog/<slug>): educational articles that explain, compare and guide. General knowledge
// and the studio's own process only: no invented statistics, studies, clients or guarantees.
// Section shape: { h2, p: [paragraphs], list?: [items], ordered?: bool, table?: { head: [], rows: [[]] } }
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
];

export const blogPost = (slug) => POSTS.find((p) => p.slug === slug) || null;

// Words in an article, for reading time (about 200 words per minute).
export const postWords = (post) =>
  [post.lead, ...post.sections.flatMap((s) => [s.h2, ...(s.p || []), ...(s.list || []), ...(s.table ? s.table.rows.flat() : [])])]
    .join(" ")
    .split(/\s+/).length;
export const readingMinutes = (post) => Math.max(1, Math.round(postWords(post) / 200));
