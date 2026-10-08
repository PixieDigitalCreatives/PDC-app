import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { RiCompass3Line, RiLightbulbFlashLine, RiCpuLine, RiInfinityLine } from "react-icons/ri";
import { useIsDesktop, usePrefersReducedMotion } from "../../animations/hooks";
import { EASE } from "../../animations/variants";
import MaskText from "../../components/motion/MaskText";
import Reveal from "../../components/motion/Reveal";

const PILLARS = [
  {
    icon: RiCompass3Line,
    title: "Strategy first",
    desc: "We begin with the core business objective and user psychology before writing a single line of code or placing a pixel.",
  },
  {
    icon: RiLightbulbFlashLine,
    title: "Creative with purpose",
    desc: "Every visual decision, typeface and micro-interaction serves usability, brand clarity and how the business is perceived.",
  },
  {
    icon: RiCpuLine,
    title: "Built to scale",
    desc: "We engineer systems designed to handle growing traffic, expanding catalogues and growing team operations.",
  },
  {
    icon: RiInfinityLine,
    title: "Long-term partnership",
    desc: "We don't disappear on launch day. We act as your long-term technical and creative partner as the business grows.",
  },
];

const AUTO_MS = 6500;
const pad = (n) => String(n + 1).padStart(2, "0");

const row = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const rise = {
  hidden: { opacity: 0, y: 70, clipPath: "inset(18% 0% 0% 0% round 28px)" },
  show: { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 28px)", transition: { duration: 1.1, ease: EASE } },
};

// Four pillars as panels of one strip. On desktop the one you point at opens wide (and, when nobody
// is pointing, they take turns); on phones every panel is simply open.
const Pillars = () => {
  const desktop = useIsDesktop();
  const reduce = usePrefersReducedMotion();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { margin: "-25% 0px -25% 0px" });
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const live = desktop && !reduce;

  useEffect(() => {
    if (!live || held || !inView) return undefined;
    const id = setInterval(() => setActive((a) => (a + 1) % PILLARS.length), AUTO_MS);
    return () => clearInterval(id);
  }, [live, held, inView, active]);

  return (
    <section className="ab-pillars" id="pillars" ref={sectionRef} aria-label="How we work">
      <div className="ab-pillars__wrap">
        <header className="ab-pillars__head">
          <Reveal as="span" className="st-label">How we work</Reveal>
          <MaskText as="h2" className="st-title" lines={["Four pillars,", <>one <span className="grad-text text-shimmer">way of working</span></>]} />
        </header>

        <motion.ul
          className="ab-pillars__row"
          variants={row}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
        >
          {PILLARS.map((pl, i) => {
            const Icon = pl.icon;
            const open = !live || i === active;
            return (
              <motion.li key={pl.title} className={`ab-pillar ab-tone-${i} ${open ? "is-active" : ""}`} variants={rise}>
                <button
                  type="button"
                  className="ab-pillar__btn"
                  aria-expanded={open}
                  onMouseEnter={() => live && setActive(i)}
                  onFocus={() => live && setActive(i)}
                  onClick={() => setActive(i)}
                  data-cursor={live && !open ? "Open" : undefined}
                >
                  <span className="ab-pillar__glow" aria-hidden="true" />
                  <span className="ab-pillar__num" aria-hidden="true">{pad(i)}</span>
                  <span className="ab-pillar__vtitle" aria-hidden="true">{pl.title}</span>

                  <span className="ab-pillar__body">
                    <span className="ab-pillar__icon"><Icon /></span>
                    <span className="ab-pillar__title">{pl.title}</span>
                    <span className="ab-pillar__desc">{pl.desc}</span>
                  </span>

                  {live && (
                    <span className="ab-pillar__bar" aria-hidden="true">
                      {i === active && !held && <i key={active} style={{ animationDuration: `${AUTO_MS}ms` }} />}
                    </span>
                  )}
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
};

export default Pillars;
