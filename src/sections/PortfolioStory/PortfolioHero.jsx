import React, { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import { useReady } from "../../animations/ReadyContext";
import { useFinePointer, useIsDesktop, usePrefersReducedMotion } from "../../animations/hooks";
import { scrollToTarget } from "../../animations/lenis";
import { EASE } from "../../animations/variants";
import { KineticLine, KineticWord } from "../../components/motion/KineticText";
import Magnetic from "../../components/buttons/Magnetic";
import { pad } from "./data";

const COLS = 3;
const SPRING = { stiffness: 60, damping: 18, mass: 0.8 };

// Spread the projects over the columns; every column gets at least four frames so the loop has no gap.
const buildColumns = (items) => {
  const cols = Array.from({ length: COLS }, () => []);
  items.forEach((it, i) => cols[i % COLS].push(it));
  return cols.map((col, c) => {
    const out = [...col];
    for (let k = 0; out.length < 4; k++) out.push(items[(c + 1 + k * 2) % items.length]);
    return out;
  });
};

// The wall: real project screenshots drifting up and down in three tilted columns.
const Wall = ({ projects, onOpen, ready, nx, ny, scrollP, motionOn }) => {
  const cols = useMemo(() => buildColumns(projects), [projects]);
  const x = useTransform(nx, (v) => v * -34);
  const cursorY = useTransform(ny, (v) => v * -24);
  const scrollY = useTransform(scrollP, [0, 1], [0, -110]);
  const y = useTransform([cursorY, scrollY], ([a, b]) => a + b);

  return (
    <motion.div className="pf-wall" style={motionOn ? { x, y } : undefined}>
      <div className="pf-wall__tilt">
        {cols.map((col, c) => (
          <motion.div
            key={c}
            className="pf-col"
            style={{ "--dur": `${40 + c * 7}s`, "--dir": c === 1 ? "reverse" : "normal" }}
            initial={{ opacity: 0, y: c === 1 ? -80 : 80 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1.4, ease: EASE, delay: 0.5 + c * 0.15 }}
          >
            <div className="pf-col__track">
              {[0, 1].map((copy) => (
                <div className="pf-col__set" key={copy} aria-hidden={copy === 1 ? "true" : undefined}>
                  {col.map((p, i) => (
                    <button
                      key={`${p.id}-${i}`}
                      type="button"
                      className="pf-frame"
                      onClick={() => onOpen(p)}
                      tabIndex={copy === 1 ? -1 : 0}
                      data-cursor="View"
                      aria-label={`Open ${p.title}`}
                    >
                      <img src={p.image} alt="" loading="eager" decoding="async" draggable="false" />
                      <span className="pf-frame__label">
                        <b>{p.title}</b>
                        {p.category && <em>{p.category}</em>}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Chapter 0 — the promise. The headline rises letter by letter beside a wall of the real work.
const PortfolioHero = ({ projects, categories, onPickCategory, onOpen, openContact }) => {
  const ref = useRef(null);
  const ready = useReady();
  const reduce = usePrefersReducedMotion();
  const desktop = useIsDesktop();
  const fine = useFinePointer();
  const withImages = useMemo(() => projects.filter((p) => p.image), [projects]);
  const motionOn = !reduce;

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(p, [0, 1], ["0%", "-22%"]);
  const copyO = useTransform(p, [0, 0.62], [1, 0]);
  const glowY = useTransform(p, [0, 1], ["0%", "26%"]);

  const nx = useSpring(0, SPRING);
  const ny = useSpring(0, SPRING);
  const mx = useMotionValue(62);
  const my = useMotionValue(42);
  const spot = useMotionTemplate`radial-gradient(620px circle at ${mx}% ${my}%, var(--pf-spot), transparent 62%)`;
  useEffect(() => {
    if (!fine || reduce) return undefined;
    const onMove = (e) => {
      nx.set(e.clientX / window.innerWidth - 0.5);
      ny.set(e.clientY / window.innerHeight - 0.5);
      const r = ref.current?.getBoundingClientRect();
      if (r) {
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine, reduce, nx, ny, mx, my]);

  const enter = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE, delay },
  });
  const fx = (style) => (reduce ? undefined : style);

  return (
    <section className={`pf-hero ${withImages.length ? "has-wall" : ""}`} id="top" ref={ref} aria-label="Portfolio introduction">
      <motion.div className="pf-hero__bg" style={fx({ y: glowY })} aria-hidden="true">
        <span className="pg-glow pg-glow--a" />
        <span className="pg-glow pg-glow--b" />
        <span className="pg-glow pg-glow--c" />
      </motion.div>
      {desktop && <motion.div className="pf-hero__spot" style={{ background: spot }} aria-hidden="true" />}

      <div className="pf-hero__inner">
        <motion.div className="pf-hero__copy" style={fx({ y: copyY, opacity: copyO })}>
          <motion.span className="pg-badge" {...enter(0.1)}>
            <i /> Selected work {projects.length > 0 && <span className="pg-badge__more"><b>•</b> {pad(projects.length)} {projects.length === 1 ? "project" : "projects"}</span>}
          </motion.span>

          <h1 className="pf-hero__title" aria-label="Work that speaks for itself.">
            <KineticLine text="Work that speaks" from={4} ready={ready} />
            <KineticWord className="grad-text text-shimmer" delay={0.7} ready={ready}>for itself.</KineticWord>
          </h1>

          <motion.p className="pf-hero__lead" {...enter(0.8)}>
            A selection of the websites and digital products we have designed and built.
          </motion.p>

          <motion.div className="pf-hero__ctas" {...enter(0.95)}>
            <Magnetic strength={0.25}>
              <button type="button" className="btn-primary" onClick={() => scrollToTarget("#work", { offset: -40 })}>
                <span>Explore the work</span>
                <HiArrowRight />
              </button>
            </Magnetic>
            <button type="button" className="btn-secondary" onClick={openContact}>Start a project</button>
          </motion.div>

          {categories.length > 1 && (
            <motion.ul className="pf-cats" {...enter(1.1)} aria-label="Project categories">
              {categories.map(({ name, count }) => (
                <li key={name}>
                  <button type="button" className="pf-cat" onClick={() => onPickCategory(name)}>
                    <span>{name}</span>
                    <b>{pad(count)}</b>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </motion.div>

        {withImages.length > 0 && (
          <div className="pf-hero__visual">
            <Wall projects={withImages} onOpen={onOpen} ready={ready} nx={nx} ny={ny} scrollP={p} motionOn={motionOn} />
          </div>
        )}
      </div>

      <motion.button type="button" className="pg-scroll" onClick={() => scrollToTarget("#work", { offset: -40 })} {...enter(1.5)}>
        <span>Scroll to explore</span>
        <i />
      </motion.button>
    </section>
  );
};

export default PortfolioHero;
