import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { useFinePointer, usePrefersReducedMotion } from "../../animations/hooks";
import { EASE, VIEWPORT } from "../../animations/variants";
import { pad } from "./data";

const FALLBACK = "/portfolio.jpg";
const onImgError = (e) => {
  if (!e.target.dataset.fb) {
    e.target.dataset.fb = "1";
    e.target.src = FALLBACK;
  }
};

const list = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const row = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

// The index: every project as one huge typographic line. Point at a line and a preview of the
// project follows the cursor, leaning into the direction you move; the other lines step back.
const ProjectIndex = ({ projects, onOpen }) => {
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();
  const [hover, setHover] = useState(null);
  const last = useRef(0);
  const x = useSpring(0, { stiffness: 240, damping: 28, mass: 0.5 });
  const y = useSpring(0, { stiffness: 240, damping: 28, mass: 0.5 });
  const rotate = useSpring(0, { stiffness: 160, damping: 18 });
  const preview = fine && !reduce;

  const onMove = (e) => {
    if (!preview) return;
    x.set(e.clientX);
    y.set(e.clientY);
    rotate.set(Math.max(-9, Math.min(9, (e.clientX - last.current) * 0.35)));
    last.current = e.clientX;
  };

  return (
    <>
      <motion.ul
        className={`pf-index ${hover ? "has-hover" : ""}`}
        variants={list}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {projects.map((p, i) => (
          <motion.li key={p.id || p.title} variants={row}>
            <button
              type="button"
              className={`pf-row ${hover?.id === p.id ? "is-hover" : ""}`}
              onMouseEnter={() => preview && setHover(p)}
              onFocus={() => preview && setHover(p)}
              onBlur={() => setHover(null)}
              onClick={() => onOpen(p)}
              aria-label={`Open ${p.title}`}
            >
              <span className="pf-row__n">{pad(i + 1)}</span>
              <span className="pf-row__t">{p.title}</span>
              <span className="pf-row__thumb" aria-hidden="true">
                <img src={p.image || FALLBACK} alt="" loading="lazy" decoding="async" onError={onImgError} />
              </span>
              <span className="pf-row__c">{p.category}</span>
              <span className="pf-row__y">{p.year}</span>
              <span className="pf-row__a" aria-hidden="true"><HiOutlineArrowUpRight /></span>
            </button>
          </motion.li>
        ))}
      </motion.ul>

      {preview &&
        createPortal(
          <AnimatePresence>
            {hover && (
              <motion.div
                className="pf-preview"
                style={{ x, y, rotate }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.35, ease: EASE }}
                aria-hidden="true"
              >
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={hover.id}
                    src={hover.image || FALLBACK}
                    alt=""
                    onError={onImgError}
                    initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.25 }}
                    animate={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default ProjectIndex;
