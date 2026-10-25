// The two flipbooks: /brochure and /company-profile (viewer: components/flipbook/FlipBook.jsx).
//
// A book is a list of pages, read front to back. Each page is one of:
//   { type: "cover" }                               branded front cover (title from the book)
//   { type: "cover", headline: [line1, line2], services: [...], text, tagline, website }
//                                                   the book's own designed cover
//   { type: "cards", kicker, title, subtitle, cards: [{ label, price, text }], note }
//                                                   an inside page of price / service cards (two columns)
//   { type: "services", kicker, title, categories: ["Build"] }
//                                                   the services of these categories with their description
//                                                   and key points (same text as the Services page)
//   { type: "process", kicker, title, subtitle }    the seven phases of the Process page
//   { type: "back" }                                branded back cover (contact details from the CMS)
//   { type: "back", title, text, website, note }    back cover with the book's closing message
//   { type: "image", src: "/books/brochure/03.webp", alt: "What we do" }
//                                                   a finished page exported as an image (put files in public/books/<slug>/)
//   { type: "placeholder" }                         an empty numbered page, until the real content is in
//
// pageAspect = width / height of ONE page (A4 portrait = 210 / 297, A4 landscape = 297 / 210).
// pdf (optional) = a file in public/ offered as "Download PDF" in the toolbar.
//
// The brochure's prices are its own printed text: they do not follow the Pricing page (CMS).
// Its service and process pages do follow the website (services and process data).

const placeholders = (n) => Array.from({ length: n }, () => ({ type: "placeholder" }));

export const BOOKS = {
  brochure: {
    slug: "brochure",
    title: "Brochure",
    pageAspect: 210 / 297,
    pdf: null,
    pages: [
      {
        type: "cover",
      },
      { type: "services", kicker: "What we do", title: "Build", categories: ["Build"] },
      { type: "services", kicker: "What we do", title: "Social & Content", categories: ["Social", "Content"] },
      { type: "services", kicker: "What we do", title: "Growth", categories: ["Growth"] },
      {
        type: "process",
        kicker: "How we work",
        title: "From first call to launch day.",
        subtitle: "Seven steps, each with clear deliverables, so you always know what is happening and what comes next.",
      },
      {
        type: "cards",
        title: "Services & Indicative Pricing",
        subtitle: "A clear starting point for planning your next digital project.",
        cards: [
          { label: "Basic / Static Website", price: "₹10,000–₹30,000", text: "Approx. 5–10 pages for a professional online presence." },
          { label: "Small Business / CMS", price: "₹30,000–₹1,00,000", text: "Business websites with content management requirements." },
          { label: "E-commerce Website", price: "₹50,000–₹3,00,000+", text: "Online store experiences for product-based businesses." },
          { label: "Enterprise Platform", price: "₹1,50,000–₹3,00,000+", text: "Custom platforms for complex business workflows." },
          { label: "MVP / Simple App", price: "From ₹50,000", text: "Android and iOS application development." },
          { label: "Service Application", price: "₹1,00,000–₹3,00,000+", text: "Service, booking, and customer-facing app experiences." },
          { label: "E-commerce App", price: "₹2,50,000–₹7,00,000+", text: "Mobile shopping and commerce functionality." },
          { label: "SEO & AI Search Visibility", price: "₹15,000–₹80,000", text: "Starter, growth, and high-competition options. Billing period to be confirmed." },
        ],
        note: "All prices are indicative. Final quotes depend on scope, integrations, content, complexity, and agreed deliverables.",
      },
      {
        type: "cards",
        title: "Creative & Growth Services",
        subtitle: "Extend your brand presence beyond the website.",
        cards: [
          { label: "Social Media — Starter", price: "₹5,000 / month", text: "20 posts for 1 platform." },
          { label: "Social Media — Growth", price: "₹10,000–₹15,000", text: "Approx. 30 posts across 2 platforms; billing cycle to confirm." },
          { label: "Full-Service Social", price: "₹30,000–₹80,000", text: "Custom social media management and marketing scope." },
          { label: "Video Editing", price: "₹300–₹4,000", text: "Basic and professional editing options; final rate depends on scope." },
          { label: "Video Production", price: "Custom quote", text: "Shoot + edit packages and full-day production; confirm deliverables and billing basis." },
          { label: "Influencer / Model Collabs", price: "₹2,500–₹70,000", text: "Indicative half-day and full-day collaboration ranges; creator and usage terms affect cost." },
        ],
        note: "Let’s build something useful — tell us what your business needs and we'll prepare a proposal tailored to your goals.",
      },
      {
        type: "back",
        tagline: "Your business deserves to be seen.",
        website: "pixiedigitalcreatives.com",
      },
    ],
  },
  companyProfile: {
    slug: "company-profile",
    title: "Company Profile",
    pageAspect: 210 / 297,
    pdf: null,
    pages: [
      // Page 1: Front Cover (Clean & Minimal: Logo + "Company Profile")
      {
        type: "cover",
      },

      // Page 2: 01 — About Pixie
      {
        type: "profile-about",
        kicker: "01 — ABOUT PIXIE",
        title: "A creative and technology partner for businesses.",
        subtitle: "A modern digital agency engineered for measurable business impact.",
        overview:
          "Pixie Digital Creatives helps businesses strengthen their digital presence through website development, application development, search visibility, social media support, and creative production. Our approach combines clear communication, practical solutions, and design-led execution.",
        approach: [
          { title: "Understand", text: "We understand your business model, competitive landscape, audience, and commercial goals before proposing code or design." },
          { title: "Recommend", text: "We recommend a suitable digital solution based on project scope, matching your budget without forced retainers." },
          { title: "Build", text: "We build clear, fast, user-friendly digital experiences that look premium and function effortlessly." },
          { title: "Support", text: "We support the brand with creative production and visibility-focused services where long-term momentum is needed." },
        ],
        whoWeWorkWith: [
          "Startups & New Ventures",
          "Local Businesses",
          "Professional Service Providers",
          "D2C & Product Brands",
          "Growing Organizations",
        ],
        positioning:
          "Professional digital work with scope-based proposals—designed to match business needs rather than force every client into the same package.",
        brandPromise: "Your business deserves to be seen.",
        coreValues: [
          { label: "Strategy-First", text: "Every pixel and feature serves a defined business purpose." },
          { label: "Transparent Scope", text: "Clear deliverables, realistic milestones, and no hidden charges." },
          { label: "Full Ownership", text: "You maintain complete ownership of your code, design assets, and accounts." },
        ],
      },

      // Page 3: 02 — Core Services
      {
        type: "profile-services",
        kicker: "02 — CORE SERVICES",
        title: "Comprehensive Digital Capabilities",
        subtitle: "Capabilities can be combined into a tailored, unified project.",
        services: [
          {
            visual: "web",
            title: "Website Development",
            category: "Build",
            offer:
              "Basic/static websites, CMS-enabled business websites (WordPress/custom), high-conversion e-commerce stores, and custom enterprise platforms.",
            highlights: ["5–10 Page Static Sites", "Custom CMS Platforms", "E-commerce & Stores", "Enterprise Platforms"],
          },
          {
            visual: "app",
            title: "Application Development",
            category: "Apps",
            offer:
              "MVPs and mobile applications for service businesses, customer experiences, booking workflows, and e-commerce use cases.",
            highlights: ["MVP Prototypes", "Service & Booking Apps", "Cross-Platform Mobile", "Custom API Systems"],
          },
          {
            visual: "search",
            title: "SEO & AI Search Visibility",
            category: "Growth",
            offer:
              "Local SEO, technical SEO, and multi-location/high-competition visibility work, plus GEO & AEO (AI answer optimization for ChatGPT & Perplexity).",
            highlights: ["Google Local Maps SEO", "Technical Site Audits", "Generative Engine (GEO)", "Answer Engine (AEO)"],
          },
          {
            visual: "social",
            title: "Social Media Management",
            category: "Social",
            offer:
              "Content planning, strategic post creation, and active community engagement for one or more social platforms, tailored to your audience.",
            highlights: ["Platform Strategy", "Content Calendars", "Reels & Graphic Design", "Community Engagement"],
          },
          {
            visual: "edit",
            title: "Video Production & Editing",
            category: "Creative",
            offer:
              "Basic and professional post-production editing, promotional content, shoot-and-edit services, and complete production support.",
            highlights: ["Shorts & Reels Editing", "Brand Commercials", "On-Location Shoots", "Sound & Color Polish"],
          },
          {
            visual: "reach",
            title: "Influencer & Model Marketing",
            category: "Campaigns",
            offer:
              "Campaign and collaboration support based on creator availability, deliverables, usage rights, licensing terms, and budget.",
            highlights: ["Creator Matching", "Campaign Coordination", "Commercial Usage Rights", "Performance Reporting"],
          },
        ],
        note: "Delivery scope, timelines, integrations, content requirements, and support arrangements are agreed during project discovery and proposal preparation.",
      },

      // Page 4: 03 — Pricing Overview
      {
        type: "profile-pricing",
        kicker: "03 — PRICING OVERVIEW",
        title: "Indicative Investment Ranges",
        subtitle: "Indicative ranges based on current planning notes.",
        groups: [
          {
            category: "Websites",
            badge: "Web Development",
            rows: [
              { name: "Basic / Static Website", scope: "Approx. 5–10 pages for a clean, fast online presence", price: "₹10,000–₹30,000" },
              { name: "Small Business / CMS", scope: "Business websites with dynamic content management", price: "₹30,000–₹1,00,000" },
              { name: "E-commerce Website", scope: "Online store experiences for product-based businesses", price: "₹50,000–₹3,00,000+" },
              { name: "Enterprise Platform", scope: "Custom platforms for complex business workflows", price: "₹1,50,000–₹3,00,000+" },
            ],
          },
          {
            category: "Apps",
            badge: "Application Development",
            rows: [
              { name: "MVP / Simple App", scope: "Android & iOS core prototype development", price: "From ₹50,000" },
              { name: "Service Application", scope: "Service, booking, and customer-facing app experiences", price: "₹1,00,000–₹3,00,000+" },
              { name: "E-commerce Mobile App", scope: "Mobile shopping and digital commerce functionality", price: "₹2,50,000–₹7,00,000+" },
            ],
          },
          {
            category: "Marketing & Creative",
            badge: "Growth & Visibility",
            rows: [
              { name: "SEO & AI Search Visibility", scope: "Starter, Growth & High-Competition visibility work", price: "₹15,000–₹80,000" },
              { name: "Social Media Management", scope: "Starter (20 posts/1 platform) to full-service agency scope", price: "₹5,000–₹80,000" },
              { name: "Video & Influencer Services", scope: "Editing (₹300–₹4,000), shoot packages & creator collabs", price: "₹300–₹70,000+" },
            ],
          },
        ],
        note: "Pricing note: These are indicative ranges, not final quotations. SEO billing period, some social/video billing units, and production deliverables must be confirmed before publication. Final pricing depends on scope, complexity, content, integrations, creator fees, and usage rights.",
      },

      // Page 5: 04 — Engagement Process
      {
        type: "profile-process",
        kicker: "04 — ENGAGEMENT PROCESS",
        title: "From First Call to Delivery",
        subtitle: "A simple process from first conversation to delivery.",
        steps: [
          {
            number: "01",
            title: "Discovery",
            tagline: "Understanding Foundation",
            description: "Understand the business, audience, goals, tech needs, and requirements.",
          },
          {
            number: "02",
            title: "Scope & Proposal",
            tagline: "Transparent Alignment",
            description: "Define deliverables, timeline, milestones, responsibilities, and pricing.",
          },
          {
            number: "03",
            title: "Design & Build",
            tagline: "Design-Led Execution",
            description: "Create the agreed solution, write clean code, and share progress for feedback.",
          },
          {
            number: "04",
            title: "Review & Handover",
            tagline: "QA & Deployment",
            description: "Test deliverables, resolve agreed revisions, and hand over production assets.",
          },
          {
            number: "05",
            title: "Ongoing Support",
            tagline: "Sustained Growth",
            description: "Discuss maintenance, content, SEO, or marketing support where required.",
          },
        ],
        clientNeeds: {
          title: "What We Need From A Client",
          text: "A clear project brief, timely feedback, required business content/assets, and agreement on scope and payment milestones help keep projects on track.",
        },
        ourCommitment: {
          title: "Our Commitment to You",
          text: "Proactive communication, zero hidden costs, clear milestone checkpoints, and production-ready code with complete client asset ownership.",
        },
      },

      // Page 6: 05 — Let’s Work Together (Inside Paper Page)
      {
        type: "profile-contact",
        kicker: "05 — LET’S WORK TOGETHER",
        title: "Have a project in mind?",
        subtitle: "Start with a conversation.",
        text: "Whether you need a website, mobile application, search visibility, social media support, or a creative campaign, Pixie Digital Creatives can help you define a practical next step.",
        actionNote: "Use the contact form on our website to discuss your project or request a custom proposal.",
        channels: [
          { label: "Website", value: "pixiedigitalcreatives.com", href: "https://pixiedigitalcreatives.com" },
          { label: "Enquiries", value: "info@pixiedigitalcreatives.com", href: "mailto:info@pixiedigitalcreatives.com" },
          { label: "Direct Call", value: "+91 97089 76946 / +91 88253 10738", href: "tel:+919708976946" },
        ],
        steps: [
          { title: "Initial Conversation", text: "Reach out via our form or call to discuss your vision, timeline, and requirements." },
          { title: "Tailored Proposal", text: "We prepare a transparent scope document with fixed deliverables and milestone pricing." },
          { title: "Collaborative Kickoff", text: "Once aligned, our team initiates design and build sprints with regular feedback cycles." },
        ],
      },

      // Page 7: 06 — Scope, Terms & Disclaimer (Inside Paper Page)
      {
        type: "profile-terms",
        kicker: "PROJECT CLARITY & COMMITMENT",
        title: "Scope, Terms & Transparency",
        subtitle: "Clear standards to ensure trust, speed, and delivery excellence.",
        disclaimer: {
          title: "PRICING & SCOPE DISCLAIMER",
          text: "All prices are indicative planning ranges and may change after project discovery. Final deliverables, timelines, billing terms, revisions, support, third-party charges, and applicable taxes should be documented in the approved proposal. No specific business growth, search ranking, reach, or sales outcome is guaranteed.",
        },
        safeguards: [
          {
            title: "Fixed Milestone Scopes",
            text: "Every project is governed by an agreed statement of work. No unexpected costs or bill shock.",
          },
          {
            title: "100% Asset & IP Ownership",
            text: "Upon final milestone completion, you own full rights to your code, designs, and content assets.",
          },
          {
            title: "Dedicated QA & Post-Launch Support",
            text: "All builds include rigorous testing across browsers and a support window for smooth stabilization.",
          },
        ],
        brandPromise: "Your business deserves to be seen.",
      },

      // Page 8: Back Cover (Clean & Minimal / Khaali)
      {
        type: "back",
        tagline: "Turning ideas into digital experiences.",
        website: "pixiedigitalcreatives.com",
      },
    ],
  },
};
