// Case studies (/work/<slug>) are built from the real portfolio projects in the CMS. Nothing here adds
// results or claims; it only gives each project a URL, an honest status and the related service.

export const projectSlug = (title = "") =>
  title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "project";

// Status confirmed by the owner (1 Nov 2026). Projects not listed are finished, live work.
// A project whose CMS client is "Demo" is a concept even if it is not listed here.
const STATUS = {
  ghgamezone: "In progress",
  "ocean-rare": "In progress",
  "moti-restro": "Concept",
};

export const projectStatus = (project) =>
  STATUS[projectSlug(project.title)] || (/^demo$/i.test((project.client || "").trim()) ? "Concept" : "Live");

// CMS category -> the service page that describes that kind of work.
const CATEGORY_SERVICE = {
  "Web Application": "website-development",
  "Web Development": "website-development",
  "E-commerce": "website-development",
  Branding: "website-development",
};
export const projectServiceSlug = (project) => CATEGORY_SERVICE[project.category] || "website-development";

export const findProject = (projects, slug) => projects.find((p) => projectSlug(p.title) === slug) || null;

// Title and description for a case study, shared by the page (in the browser) and the build step.
export const caseStudyMeta = (project) => {
  const full = `${project.title} Case Study | Pixie Digital Creatives`;
  const desc = `${project.title}: ${project.type || project.category}. ${project.description || ""}`.replace(/\s+/g, " ").trim();
  return {
    path: `/work/${projectSlug(project.title)}`,
    title: full.length <= 65 ? full : `${project.title} Case Study`,
    description: desc.length <= 158 ? desc : `${desc.slice(0, 157).replace(/\s+\S*$/, "")}…`,
  };
};
