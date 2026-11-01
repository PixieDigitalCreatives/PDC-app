import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import ContactModal from "../ContactModal";
import ProjectDetailModal from "../ProjectDetailModal";
import ScrollProgress from "../motion/ScrollProgress";
import MaskText from "../motion/MaskText";
import Reveal from "../motion/Reveal";
import { scrollToTarget } from "../../animations/lenis";
import { useReady } from "../../animations/ReadyContext";
import "../../sections/Story/story.scss";
import "../../styles/contentpages.scss";

// Arriving with a section in the URL (/services/seo#faq): go to that section once the page is in
// (after the preloader on a fresh visit), as the pricing page does.
const useHashJump = () => {
  const { hash } = useLocation();
  const ready = useReady();
  useEffect(() => {
    if (!ready) return undefined;
    let target = null;
    try {
      target = hash && document.querySelector(hash);
    } catch {
      // not a valid selector (hand-typed hash): stay at the top
    }
    if (!target) return undefined;
    const t = setTimeout(() => scrollToTarget(target), 900);
    return () => clearTimeout(t);
  }, [hash, ready]);
};

// Page frame shared with the other pages: navbar, main landmark, footer and the site's modals.
export const ContentShell = ({ children }) => {
  useHashJump();
  return (
    <div className="cp-page">
      <Navbar />
      <ScrollProgress />
      <main id="main">{children}</main>
      <Footer />
      <ContactModal />
      <ProjectDetailModal />
    </div>
  );
};

// Building blocks for the content pages (service, industry, blog and case-study pages). One look,
// taken from the existing design system: the inner-page glows, the H1 keyword line, glass panels
// and the pill buttons. Everything is real, crawlable HTML (headings, lists, details/summary).

export const Breadcrumbs = ({ items }) => (
  <nav className="cp-crumbs" aria-label="Breadcrumb">
    <ol>
      {items.map((c, i) => (
        <li key={c.path || c.name}>
          {i < items.length - 1 ? <Link to={c.path}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
        </li>
      ))}
    </ol>
  </nav>
);

export const ContentHero = ({ crumbs, kicker, title, lead, meta, children }) => (
  <section className="cp-hero" aria-label="Introduction">
    <div className="cp-hero__bg" aria-hidden="true">
      <span className="pg-glow pg-glow--a" />
      <span className="pg-glow pg-glow--b" />
      <span className="pg-glow pg-glow--c" />
    </div>
    <div className="cp-hero__inner container-custom">
      {crumbs && <Breadcrumbs items={crumbs} />}
      <MaskText
        as="h1"
        className="cp-hero__title"
        onReady
        lines={[<span className="h1-kicker" key="k">{kicker}</span>, title]}
      />
      {lead && <Reveal as="p" className="cp-hero__lead" delay={0.45}>{lead}</Reveal>}
      {meta && <Reveal className="cp-hero__meta" delay={0.55}>{meta}</Reveal>}
      {children && <Reveal className="cp-hero__actions" delay={0.65}>{children}</Reveal>}
    </div>
  </section>
);

export const Section = ({ id, eyebrow, title, intro, children, className = "" }) => (
  <section className={`cp-section ${className}`} id={id} aria-labelledby={`${id}-title`}>
    <div className="container-custom">
      <Reveal className="cp-section__head">
        {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
        <h2 className="cp-section__title" id={`${id}-title`}>{title}</h2>
        {intro && <p className="cp-section__intro">{intro}</p>}
      </Reveal>
      {children}
    </div>
  </section>
);

// items: [{ title, text, to?, linkLabel?, meta? }]
export const CardGrid = ({ items, columns = 3 }) => (
  <ul className={`cp-cards cp-cards--${columns}`}>
    {items.map((it, i) => (
      <Reveal as="li" className="cp-card glass-panel" key={it.title} delay={Math.min(i, 5) * 0.06}>
        {it.meta && <span className="cp-card__meta">{it.meta}</span>}
        <h3 className="cp-card__title">{it.to ? <Link to={it.to}>{it.title}</Link> : it.title}</h3>
        {it.text && <p className="cp-card__text">{it.text}</p>}
        {it.to && (
          <Link to={it.to} className="cp-card__link" aria-hidden="true" tabIndex={-1}>
            {it.linkLabel || "Learn more"} <span aria-hidden="true">→</span>
          </Link>
        )}
      </Reveal>
    ))}
  </ul>
);

// A short list with tick marks: who a service is for, what a client receives.
export const Checklist = ({ items }) => (
  <Reveal as="ul" className="cp-checklist">
    {items.map((t) => <li key={t}>{t}</li>)}
  </Reveal>
);

// Numbered steps: [{ name, text }].
export const Steps = ({ items }) => (
  <ol className="cp-steps">
    {items.map((s) => (
      <li key={s.name} className="glass-panel">
        {s.name}
        <span>{s.text}</span>
      </li>
    ))}
  </ol>
);

// Questions and answers as native disclosure widgets: readable by everyone, the first one open.
// items: [{ q, a, links?: [{ to, label }] }]
export const QaList = ({ items }) => (
  <div className="cp-qa">
    {items.map((f, i) => (
      <details key={f.q} className="cp-qa__item glass-panel" open={i === 0}>
        <summary>
          <h3>{f.q}</h3>
          <span className="cp-qa__icon" aria-hidden="true" />
        </summary>
        <p>{f.a}</p>
        {f.links?.length > 0 && (
          <p className="cp-qa__links">
            {f.links.map((l) => <Link key={l.to} to={l.to}>{l.label} →</Link>)}
          </p>
        )}
      </details>
    ))}
  </div>
);
