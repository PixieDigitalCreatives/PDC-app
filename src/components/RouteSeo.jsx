import { useEffect } from "react";
import { seoPage, absoluteUrl } from "../data/seo";

// Keeps the document head in step with the current page while moving around the site. The first
// load already has the right head (written per page at build time by scripts/prerender-seo.mjs);
// this updates the same tags in place, so nothing is duplicated.
const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

// page: { path, title, description, noindex? }
export const applySeo = (page) => {
  const url = page.path ? absoluteUrl(page.path) : null;
  document.title = page.title;
  setMeta("name", "description", page.description);
  setMeta("name", "robots", page.noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
  setCanonical(page.noindex ? null : url);
  setMeta("property", "og:title", page.title);
  setMeta("property", "og:description", page.description);
  if (url) setMeta("property", "og:url", url);
  setMeta("name", "twitter:title", page.title);
  setMeta("name", "twitter:description", page.description);
};

// For pages whose tags depend on data loaded at runtime (case studies from the CMS).
export const useSeo = (page) => {
  useEffect(() => {
    if (page) applySeo(page);
  }, [page?.path, page?.title, page?.description, page?.noindex]); // eslint-disable-line react-hooks/exhaustive-deps
};

const RouteSeo = ({ pathname }) => {
  useEffect(() => {
    const page = seoPage(pathname);
    if (!page.dynamic) applySeo(page);
  }, [pathname]);

  return null;
};

export default RouteSeo;
