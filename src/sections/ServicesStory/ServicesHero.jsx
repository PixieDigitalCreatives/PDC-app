import React, { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import { useReady } from "../../animations/ReadyContext";
import { useIsDesktop, usePrefersReducedMotion } from "../../animations/hooks";
import { scrollToTarget } from "../../animations/lenis";
import { EASE } from "../../animations/variants";
import { KineticLine, KineticWord } from "../../components/motion/KineticText";
import Magnetic from "../../components/buttons/Magnetic";
import SilkWaves from "../Story/SilkWaves";
import ServiceOrbit from "./ServiceOrbit";
import { pad } from "./data";

// Chapter 0 — the promise. Letters rise in after the preloader, the orbit assembles, and on scroll
// the copy drifts up while the orbit sinks and turns away.
const ServicesHero = ({ services, groups, openContact }) => {
  const ref = useRef(null);
  const ready = useReady();
  const reduce = usePrefersReducedMotion();
  const desktop = useIsDesktop();

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(p, [0, 1], ["0%", "-24%"]);
  const copyO = useTransform(p, [0, 0.62], [1, 0]);
  const orbitY = useTransform(p, [0, 1], ["0%", "16%"]);
  const orbitS = useTransform(p, [0, 1], [1, 0.78]);
  const orbitR = useTransform(p, [0, 1], [0, 18]);
  const orbitO = useTransform(p, [0.2, 0.95], [1, 0]);
  const glowY = useTransform(p, [0, 1], ["0%", "26%"]);
  const waveY = useTransform(p, [0, 1], ["0%", "-14%"]);

  // Soft spotlight that follows the cursor across the hero
  const mx = useMotionValue(62);
  const my = useMotionValue(42);
  const spot = useMotionTemplate`radial-gradient(620px circle at ${mx}% ${my}%, var(--sv-spot), transparent 62%)`;
  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  const enter = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE, delay },
  });
  const fx = (style) => (reduce ? undefined : style);

  return (
    <section className="sv-hero" id="top" ref={ref} onMouseMove={desktop && !reduce ? onMove : undefined} aria-label="Services introduction">
      <motion.div className="sv-hero__bg" style={fx({ y: glowY })} aria-hidden="true">
        <span className="sv-glow sv-glow--a" />
        <span className="sv-glow sv-glow--b" />
        <span className="sv-glow sv-glow--c" />
      </motion.div>
      <motion.div className="sv-hero__spot" style={{ background: spot }} aria-hidden="true" />
      <motion.div className="sv-hero__waves" style={fx({ y: waveY })} aria-hidden="true">
        {ready && <SilkWaves lines={desktop ? 15 : 8} delay={0.4} y0={620} y1={300} />}
      </motion.div>

      <div className="sv-hero__inner">
        <motion.div className="sv-hero__copy" style={fx({ y: copyY, opacity: copyO })}>
          <motion.span className="sv-badge" {...enter(0.1)}>
            <i /> Services <b>•</b> {pad(services.length)} ways we help
          </motion.span>

          <h1 className="sv-hero__title" aria-label="Design, build, create and grow.">
            <KineticLine text="Design, build," from={4} ready={ready} />
            <KineticLine text="create &" from={20} ready={ready} />
            <KineticWord className="grad-text text-shimmer" delay={0.75} ready={ready}>grow.</KineticWord>
          </h1>

          <motion.p className="sv-hero__lead" {...enter(0.8)}>
            Website and app development, CRM, content, social, video and digital growth, handled by one team.
          </motion.p>

          <motion.div className="sv-hero__ctas" {...enter(0.95)}>
            <Magnetic strength={0.25}>
              <button type="button" className="btn-primary" onClick={openContact}>
                <span>Discuss your project</span>
                <HiArrowRight />
              </button>
            </Magnetic>
            <button type="button" className="btn-secondary" onClick={() => scrollToTarget("#chapters", { offset: -20 })}>
              Explore services
            </button>
          </motion.div>

          {groups.length > 1 && (
            <motion.ul className="sv-chips" {...enter(1.1)} aria-label="Service categories">
              {groups.map((g) => (
                <li key={g.slug}>
                  <button type="button" className="sv-chip-link" onClick={() => scrollToTarget(`#chapter-${g.slug}`, { offset: -10 })}>
                    <span>{g.key}</span>
                    <b>{pad(g.items.length)}</b>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </motion.div>

        <motion.div
          className="sv-hero__visual"
          style={fx({ y: orbitY, scale: orbitS, rotate: orbitR, opacity: orbitO })}
        >
          <ServiceOrbit services={services} ready={ready} />
          <div className="sv-notes" aria-hidden="true">
            <motion.span
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={ready ? { clipPath: "inset(0 0% 0 0)" } : undefined}
              transition={{ duration: 0.8, ease: EASE, delay: 2.1 }}
            >
              pick one, or all
            </motion.span>
            <svg viewBox="0 0 70 92" fill="none">
              <motion.path
                d="M58 4 C 68 42, 42 72, 8 82"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={ready ? { pathLength: 1 } : undefined}
                transition={{ duration: 0.9, delay: 2.7, ease: EASE }}
              />
              <motion.path
                d="M19 74 L 8 82 L 21 88"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={ready ? { pathLength: 1 } : undefined}
                transition={{ duration: 0.4, delay: 3.5 }}
              />
            </svg>
          </div>
        </motion.div>
      </div>

      <motion.button type="button" className="sv-scroll" onClick={() => scrollToTarget("#chapters", { offset: -20 })} {...enter(1.5)}>
        <span>Scroll to explore</span>
        <i />
      </motion.button>
    </section>
  );
};

export default ServicesHero;
