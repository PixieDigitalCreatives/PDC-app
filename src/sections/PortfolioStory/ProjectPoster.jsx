import React, { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";
import { HiArrowRight, HiOutlineArrowUpRight } from "react-icons/hi2";
import { EASE, VIEWPORT } from "../../animations/variants";
import { host, pad } from "./data";

const FALLBACK = "/portfolio.jpg";
const onImgError = (e) => {
  if (!e.target.dataset.fb) {
    e.target.dataset.fb = "1";
    e.target.src = FALLBACK;
  }
};

// Phones / reduced motion: the whole poster rises into place once.
const rise = {
  hidden: { opacity: 0, y: 56 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

/**
 * One project as a case-study poster. The screenshot is uncovered by a wipe as the poster scrolls in
 * (from the left, then from the right on the next one), settling from a zoom while it drifts inside
 * its frame; the glass info panel slides in from the opposite side over its edge.
 */
const ProjectPoster = ({ project, i, n, mode, onOpen }) => {
  const ref = useRef(null);
  const flip = i % 2 === 1;
  const scroll = mode === "scroll";
  const tags = Array.isArray(project.tags) ? project.tags.slice(0, 5) : [];
  const site = host(project.liveUrl);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4, restDelta: 0.0005 });
  const wipe = useTransform(p, [0.04, 0.4], [100, 0]);
  const clipFromLeft = useMotionTemplate`inset(0 ${wipe}% 0 0)`;
  const clipFromRight = useMotionTemplate`inset(0 0 0 ${wipe}%)`;
  const imgY = useTransform(p, [0, 1], ["-6%", "6%"]);
  const imgScale = useTransform(p, [0.04, 0.5], [1.22, 1]); // settles flat, so no text is cropped
  const infoX = useTransform(p, [0.1, 0.44], [flip ? -90 : 90, 0]);
  const infoO = useTransform(p, [0.12, 0.36], [0, 1]);
  const numY = useTransform(p, [0, 1], [110, -110]);

  return (
    <motion.li
      ref={ref}
      className={`pf-poster ${flip ? "is-flipped" : ""}`}
      variants={scroll ? undefined : rise}
      initial={scroll ? undefined : "hidden"}
      whileInView={scroll ? undefined : "show"}
      viewport={VIEWPORT}
    >
      <motion.span className="pf-poster__num" style={scroll ? { y: numY } : undefined} aria-hidden="true">
        {pad(i + 1)}
      </motion.span>

      <motion.button
        type="button"
        className="pf-poster__media"
        style={scroll ? { clipPath: flip ? clipFromRight : clipFromLeft } : undefined}
        onClick={() => onOpen(project)}
        data-cursor="View"
        aria-label={`Open ${project.title}`}
      >
        <span className="pf-poster__bar" aria-hidden="true">
          <i /><i /><i />
          {site && <em>{site}</em>}
        </span>
        <span className="pf-poster__shot">
          <motion.img
            src={project.image || FALLBACK}
            alt={project.title}
            loading="lazy"
            decoding="async"
            onError={onImgError}
            style={scroll ? { y: imgY, scale: imgScale } : undefined}
          />
        </span>
        <span className="pf-poster__hover" aria-hidden="true">
          View project <HiArrowRight />
        </span>
      </motion.button>

      <motion.div className="pf-poster__info" style={scroll ? { x: infoX, opacity: infoO } : undefined}>
        <div className="pf-poster__meta">
          <span className="pf-poster__count"><b>{pad(i + 1)}</b> / {pad(n)}</span>
          {project.category && <span className="pf-poster__cat">{project.category}</span>}
          {project.year && <span className="pf-poster__year">{project.year}</span>}
        </div>
        <h3 className="pf-poster__title">{project.title}</h3>
        {(project.type || project.subtitle) && <p className="pf-poster__type">{project.type || project.subtitle}</p>}
        {project.description && <p className="pf-poster__desc">{project.description}</p>}
        {tags.length > 0 && (
          <ul className="pf-poster__tags" aria-label="Technologies and disciplines">
            {tags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
        <div className="pf-poster__actions">
          <button type="button" className="btn-primary" onClick={() => onOpen(project)}>
            <span>View Project</span>
            <HiArrowRight />
          </button>
          {project.liveUrl && (
            <a className="btn-secondary" href={project.liveUrl} target="_blank" rel="noreferrer">
              Visit Site <HiOutlineArrowUpRight />
            </a>
          )}
        </div>
      </motion.div>
    </motion.li>
  );
};

export default ProjectPoster;
