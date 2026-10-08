export const pad = (n) => String(n).padStart(2, "0");

// "https://www.aksharcanvas.com/" -> "aksharcanvas.com" (shown in the browser frame's address bar)
export const host = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

export const byOrder = (projects) => [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export const searchable = (p) =>
  [p.title, p.subtitle, p.type, p.category, p.client, p.description, ...(Array.isArray(p.tags) ? p.tags : [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
