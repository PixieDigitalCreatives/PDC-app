import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, LayoutGroup, useScroll, useTransform } from "framer-motion";
import { HiArrowRight, HiOutlineArrowUpRight } from "react-icons/hi2";
import { useCms } from "../../context/CmsContext";
import { usePrefersReducedMotion } from "../../animations/hooks";
import { EASE } from "../../animations/variants";
import Reveal from "../../components/motion/Reveal";
import MaskText from "../../components/motion/MaskText";

const MAX = 6;
const pad = (n) => String(n).padStart(2, "0");

const useProjects = () => {
  const { portfolioProjects } = useCms();
  return useMemo(() => {
    const featured = portfolioProjects.filter((p) => p.featured);
    return (featured.length ? featured : portfolioProjects).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [portfolioProjects]);
};

// Label, title, filter pills (pop in with a spring) and the "view all" link.
const Header = ({ categories, filter, setFilter }) => (
  <div className="st-section st-work__intro">
    <Reveal as="span" className="st-label">Featured work</Reveal>
    <div className="st-head st-head--work">
      <div className="st-work__titlebar">
        <MaskText as="h2" className="st-title" lines={["Our Recent Projects"]} />
        <LayoutGroup id="work-filter">
          <div className="st-filters" role="tablist" aria-label="Filter projects">
            {categories.map((c, i) => (
              <motion.button
                key={c}
                type="button"
                role="tab"
                aria-selected={filter === c}
                className={`st-filter ${filter === c ? "is-active" : ""}`}
                onClick={() => setFilter(c)}
                initial={{ opacity: 0, scale: 0.6, y: 12 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.25 + i * 0.07 }}
              >
                {filter === c && <motion.span layoutId="work-filter-pill" className="st-filter__pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="st-filter__text">{c}</span>
              </motion.button>
            ))}
          </div>
        </LayoutGroup>
      </div>
      <Link to="/portfolio" className="st-link" data-cursor="Open">
        View All Projects <HiArrowRight />
      </Link>
    </div>
  </div>
);

const info = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/**
 * One card in the stack. Its slot is a full-screen sticky frame, so each card pins and the
 * next one slides up over it. While later cards arrive, this one shrinks back and dims;
 * its own screenshot settles from a zoom as it comes in.
 */
const StackCard = ({ project, i, n, progress, onOpen, reduce }) => {
  const slotRef = useRef(null);
  const { scrollYProgress: arrive } = useScroll({ target: slotRef, offset: ["start end", "start start"] });
  const imgScale = useTransform(arrive, [0, 1], [1.4, 1]);

  // Card i pins at i/(n-1) of the stack's scroll; it recedes while the cards after it slide over.
  const steps = Math.max(1, n - 1);
  const pinnedAt = Math.min(1, i / steps);
  const coveredAt = Math.min(1, (i + 1) / steps);
  const last = i === n - 1;
  const targetScale = 1 - (n - 1 - i) * 0.045;
  const scale = useTransform(progress, [pinnedAt, 1], [1, last ? 1 : targetScale]);
  const tilt = useTransform(progress, [pinnedAt, 1], [0, last ? 0 : i % 2 ? 1.2 : -1.2]);
  const dim = useTransform(progress, [pinnedAt, coveredAt], [0, last ? 0 : 0.55]);

  const tags = Array.isArray(project.tags) ? project.tags.slice(0, 4) : [];
  const subtitle = project.type || project.subtitle;

  return (
    <div className="st-stack__slot" ref={slotRef}>
      <motion.article
        className={`st-stack__card st-tone-${i % 6}`}
        style={{ "--i": i, ...(reduce ? {} : { scale, rotate: tilt }) }}
      >
        <span className="st-stack__glow" aria-hidden="true" />

        <motion.div className="st-stack__info" variants={info} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
          <motion.div className="st-stack__meta" variants={item}>
            <span className="st-stack__count"><b>{pad(i + 1)}</b> / {pad(n)}</span>
            {project.category && <span className="st-stack__cat">{project.category}</span>}
          </motion.div>
          <motion.h3 className="st-stack__title" variants={item}>{project.title}</motion.h3>
          {subtitle && <motion.p className="st-stack__type" variants={item}>{subtitle}</motion.p>}
          {project.description && <motion.p className="st-stack__desc" variants={item}>{project.description}</motion.p>}
          {tags.length > 0 && (
            <motion.ul className="st-stack__tags" variants={item}>
              {tags.map((t) => <li key={t}>{t}</li>)}
            </motion.ul>
          )}
          <motion.div className="st-stack__actions" variants={item}>
            <button type="button" className="btn-primary" onClick={() => onOpen(project)}>
              <span>View Project</span>
              <HiArrowRight />
            </button>
            {project.liveUrl && (
              <a className="btn-secondary" href={project.liveUrl} target="_blank" rel="noreferrer">
                Visit Site <HiOutlineArrowUpRight />
              </a>
            )}
          </motion.div>
        </motion.div>

        <button type="button" className="st-stack__media" onClick={() => onOpen(project)} data-cursor="View" aria-label={`Open ${project.title}`}>
          <span className="st-stack__browser" aria-hidden="true"><i /><i /><i /></span>
          <span className="st-stack__shot">
            <motion.img src={project.image || "/portfolio.jpg"} alt={project.title} loading="lazy" decoding="async" style={reduce ? undefined : { scale: imgScale }} />
          </span>
        </button>

        <motion.span className="st-stack__dim" style={reduce ? undefined : { opacity: dim }} aria-hidden="true" />
      </motion.article>
    </div>
  );
};

const Stack = ({ projects, onOpen, reduce }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div className="st-stack" ref={ref}>
      {projects.map((p, i) => (
        <StackCard key={p.id || p.title} project={p} i={i} n={projects.length} progress={scrollYProgress} onOpen={onOpen} reduce={reduce} />
      ))}
    </div>
  );
};

// Chapter 3 — proof. Real projects from the CMS, stacked like a deck as you scroll.
const WorkShowcase = () => {
  const { setSelectedProjectModal } = useCms();
  const reduce = usePrefersReducedMotion();
  const projects = useProjects();
  const [filter, setFilter] = useState("All");
  const categories = useMemo(() => ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))], [projects]);
  const shown = (filter === "All" ? projects : projects.filter((p) => p.category === filter)).slice(0, MAX);

  if (!projects.length) return null;

  return (
    <section className="st-work" id="work" aria-label="Recent projects">
      <Header categories={categories} filter={filter} setFilter={setFilter} />
      {/* Re-keying on the filter restarts the stack cleanly with the new set of cards */}
      <Stack key={filter} projects={shown} onOpen={setSelectedProjectModal} reduce={reduce} />
    </section>
  );
};

export default WorkShowcase;
