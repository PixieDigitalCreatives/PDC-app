import {
  RiCompass3Line,
  RiRouteLine,
  RiLayoutMasonryLine,
  RiCodeSSlashLine,
  RiShieldCheckLine,
  RiRocketLine,
  RiLifebuoyLine,
} from "react-icons/ri";

export const pad = (n) => String(n).padStart(2, "0");

// The seven phases. Copy describes what each phase involves and delivers; it makes no promises
// about how long a phase takes (that depends on the project).
export const PHASES = [
  {
    name: "Discovery and alignment",
    short: "Discovery",
    icon: RiCompass3Line,
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
    icon: RiRouteLine,
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
    icon: RiLayoutMasonryLine,
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
    icon: RiCodeSSlashLine,
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
    icon: RiShieldCheckLine,
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
    icon: RiRocketLine,
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
    icon: RiLifebuoyLine,
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

// A smooth path through one point per phase (Catmull-Rom -> cubic Bezier), in a 1000 x 200 box.
// The same points position the stops in the hero, so labels sit exactly on the line.
export const ROUTE_W = 1000;
export const ROUTE_H = 200;
export const routePoints = (n) =>
  Array.from({ length: n }, (_, i) => ({
    x: 50 + (i * (ROUTE_W - 100)) / Math.max(1, n - 1),
    y: i % 2 === 0 ? 135 : 62,
  }));

export const routePath = (pts) => {
  const f = (v) => v.toFixed(1);
  let d = `M ${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${f(c1.x)} ${f(c1.y)}, ${f(c2.x)} ${f(c2.y)}, ${f(p2.x)} ${f(p2.y)}`;
  }
  return d;
};
