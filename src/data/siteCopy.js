// Page copy shared by the components that show it and by scripts/prerender-seo.mjs, which writes the
// same words into each page's HTML for crawlers that don't run JavaScript. Plain data only (no JSX,
// no icons), so Node can import it. Edit the words here and both stay in step.

// The four handwritten words from the hero become the four chapters of the story.
export const JOURNEY_CHAPTERS = [
  {
    key: "Ideas",
    title: "Every brand starts as a spark.",
    text: "We listen first: your goals, your audience and what makes you different. Strategy and content planning turn a rough idea into a clear direction.",
    visual: "idea",
    services: ["social", "content"],
  },
  {
    key: "Design",
    title: "Then we give it a face.",
    text: "Interfaces, identity and motion designed to feel like you, on every screen and in every scroll.",
    visual: "wordpress",
    services: ["web", "wordpress", "edit"],
  },
  {
    key: "Develop",
    title: "Built to perform.",
    text: "Websites, apps and systems engineered for speed, security and scale, with a CMS your team can actually use.",
    visual: "web",
    services: ["app", "crm", "stack"],
  },
  {
    key: "Grow",
    title: "And then, it grows.",
    text: "SEO, GEO and AEO get you found, paid campaigns bring the right people in, and content keeps them coming back.",
    visual: "reach",
    services: ["search", "ads", "handling"],
  },
];

export const PILLARS_COPY = [
  {
    title: "Strategy first",
    desc: "We begin with the core business objective and user psychology before writing a single line of code or placing a pixel.",
  },
  {
    title: "Creative with purpose",
    desc: "Every visual decision, typeface and micro-interaction serves usability, brand clarity and how the business is perceived.",
  },
  {
    title: "Built to scale",
    desc: "We engineer systems designed to handle growing traffic, expanding catalogues and growing team operations.",
  },
  {
    title: "Long-term partnership",
    desc: "We don't disappear on launch day. We act as your long-term technical and creative partner as the business grows.",
  },
];

// About page: the sentence that lights up word by word (accent words in the gradient) and the line under it.
export const MANIFESTO = {
  text:
    "Pixie Digital Creatives started with a simple idea: design and engineering should be planned together, so what looks good also works properly and keeps the business growing.",
  accent: ["planned", "together"],
  sub: "We care about how a site looks and how it performs in equal measure.",
};

// The seven phases. Copy describes what each phase involves and delivers; it makes no promises
// about how long a phase takes (that depends on the project).
export const PROCESS_PHASES = [
  {
    name: "Discovery and alignment",
    short: "Discovery",
    tagline: "Uncovering goals, user behavior and the competitive landscape.",
    desc: "Every exceptional digital product begins with careful listening. We talk to stakeholders, look at market benchmarks, audit existing systems and define clear business measures of success.",
    deliverables: [
      "Discovery workshop and goal blueprint",
      "User persona and flow mapping",
      "Competitor landscape benchmark",
      "Technical feasibility scope",
    ],
  },
  {
    name: "Strategy and architecture",
    short: "Strategy",
    tagline: "Structuring the information architecture and the project roadmap.",
    desc: "We turn what we learned into a clear roadmap: information hierarchy, data requirements, conversion paths and the technical stack, all settled before design begins.",
    deliverables: [
      "Information architecture",
      "Technical stack architecture",
      "Content strategy and copy outlines",
      "Milestone and schedule",
    ],
  },
  {
    name: "UI/UX design",
    short: "Design",
    tagline: "Crafting bespoke, high-conversion visual interfaces.",
    desc: "Our designers build visual concepts in Figma, combining considered typography, a consistent visual system, responsive layouts and interactive details, and refine them with your feedback.",
    deliverables: [
      "Wireframes and low-fidelity concepts",
      "High-fidelity desktop and mobile UI",
      "Design system and tokens",
      "Interactive Figma prototype",
    ],
  },
  {
    name: "Full-stack development",
    short: "Develop",
    tagline: "Writing clean, scalable, high-performance code.",
    desc: "We build pixel-accurate front-end components with React and dependable back-end services, with a focus on clean code, database design, modular architecture and fast load times.",
    deliverables: [
      "Responsive front-end implementation",
      "API and database integration",
      "CMS setup and custom fields",
      "Staging environment deployment",
    ],
  },
  {
    name: "Testing and QA",
    short: "QA",
    tagline: "Multi-device testing, security checks and speed optimisation.",
    desc: "Thorough testing across browsers, screen sizes and operating systems, plus speed audits, SEO checks, form verification and security sweeps.",
    deliverables: [
      "Cross-browser and device QA",
      "Speed optimisation",
      "SEO and metadata validation",
      "Security and SSL verification",
    ],
  },
  {
    name: "Launch",
    short: "Launch",
    tagline: "A planned, carefully managed launch.",
    desc: "We take care of DNS and SSL activation, live data migration, analytics connection and CMS handoff training, so your team feels confident from day one.",
    deliverables: [
      "Production server deployment",
      "DNS migration and SSL activation",
      "Google Analytics 4 and Search Console",
      "CMS video walkthrough and training",
    ],
  },
  {
    name: "Growth and support",
    short: "Growth",
    tagline: "Ongoing maintenance and conversion optimisation.",
    desc: "We stay in your corner. Through monthly maintenance and retainer agreements we monitor performance, apply security updates and ship iterative improvements.",
    deliverables: [
      "Uptime and performance monitoring",
      "Regular security updates and backups",
      "Monthly feature enhancements",
      "Retainer-based technical support",
    ],
  },
];
