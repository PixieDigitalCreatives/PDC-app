// Copy for the scroll story. Only describes what PDC offers — no metrics, clients or claims.
import { genImage } from "./images";

export const heroCopy = {
  eyebrow: "Creative & technology agency",
  lines: ["Beyond", "websites."],
  statement:
    "Design, development, motion and digital growth, from first idea to everyday presence.",
};

export const disciplines = ["Design", "Development", "Digital Products", "Content", "Social", "Growth"];

export const philosophy = {
  eyebrow: "Philosophy",
  lead: "We don't just",
  struck: "build websites.",
  after: "We build presence.",
  body: "Every project is shaped across design, development, content and growth, so what we make looks right, works properly and keeps getting found.",
};

export const ecosystem = [
  { key: "Idea", text: "Every project starts with a clear idea." },
  { key: "Design", text: "Interface, identity and motion." },
  { key: "Develop", text: "Websites, apps and systems." },
  { key: "Content", text: "Video, content and content management." },
  { key: "Marketing", text: "SEO, GEO, AEO and paid ads." },
  { key: "Growth", text: "A presence that keeps building." },
];

export const growthSteps = [
  {
    key: "Build",
    title: "Build the foundation.",
    text: "Website Development, WordPress and Full-Stack Development give everything else somewhere to land.",
    items: ["Website Development", "WordPress", "Full-Stack"],
  },
  {
    key: "Reach",
    title: "Put it in front of people.",
    text: "Paid campaigns bring the right audience to what you have built.",
    items: ["Meta Ads", "Social Media Ads"],
  },
  {
    key: "Discoverability",
    title: "Be found, and be the answer.",
    text: "Three ways of being discovered, one for each place people now look.",
    items: ["SEO", "GEO", "AEO"],
    detail: [
      { k: "SEO", v: "Be found on search engines like Google." },
      { k: "GEO", v: "Be understood and mentioned by generative AI." },
      { k: "AEO", v: "Be the direct answer to a question." },
    ],
  },
  {
    key: "Leads",
    title: "Capture every enquiry.",
    text: "CRM Solutions keep leads, customers and follow-ups in one place.",
    items: ["CRM Solutions"],
  },
  {
    key: "Growth",
    title: "Keep it moving.",
    text: "Content and social keep the presence consistent while the rest compounds.",
    items: ["Content Management", "Social Media"],
  },
];

export const contentFrames = [
  { n: "01", label: "Video Shoot", note: "Planned and directed on location.", src: genImage("content-shoot", "/ser.jpg") },
  { n: "02", label: "Video Editing", note: "Cut for pace, polish and platform.", src: genImage("content-edit", "/about.jpg") },
  { n: "03", label: "Social Media Content", note: "Made to live on the feed.", src: genImage("content-social", "/hero1.jpg") },
];

export const presence = {
  eyebrow: "Social & content",
  title: ["Show up.", "Consistently."],
  text: "From the shoot to the schedule, we help a business keep a steady digital presence without it becoming a second job.",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  rows: [
    { label: "Video Shoot", cells: [1, 0, 0, 0, 1, 0, 0] },
    { label: "Video Editing", cells: [0, 1, 1, 0, 0, 1, 0] },
    { label: "Content Management", cells: [1, 1, 1, 1, 1, 0, 0] },
    { label: "Social Media Handling", cells: [1, 1, 1, 1, 1, 1, 1] },
  ],
};

export const cta = {
  lines: ["Ready to build", "what's next?"],
  support: "Tell us what you're building. We'll turn it into a digital experience.",
};
