import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue, useMotionTemplate } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import { useCms } from "../../context/CmsContext";
import { useReady } from "../../animations/ReadyContext";
import { useIsDesktop } from "../../animations/hooks";
import { scrollToTarget } from "../../animations/lenis";
import { EASE } from "../../animations/variants";
import Magnetic from "../../components/buttons/Magnetic";
import MaskText from "../../components/motion/MaskText";
import SilkWaves from "./SilkWaves";
import ChromeLogo from "./ChromeLogo";

const NOTES = ["Ideas", "Design", "Develop", "Grow"];

// Chapter 0 — the promise. Everything enters after the preloader, then parallaxes apart on scroll.
const Hero = () => {
  const ref = useRef(null);
  const ready = useReady();
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const { portfolioProjects, stats, setIsContactModalOpen } = useCms();
  const clients = portfolioProjects.filter((p) => p.image).slice(0, 5);
  const clientStat = stats.find((s) => /client/i.test(s.label) && !/satisf/i.test(s.label));

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(p, [0, 1], ["0%", "-26%"]);
  const copyO = useTransform(p, [0, 0.6], [1, 0]);
  const logoY = useTransform(p, [0, 1], ["0%", "30%"]);
  const logoS = useTransform(p, [0, 1], [1, 0.8]);
  const waveY = useTransform(p, [0, 1], ["0%", "-16%"]);
  const glowY = useTransform(p, [0, 1], ["0%", "30%"]);

  // Soft spotlight that follows the cursor across the hero
  const mx = useMotionValue(60);
  const my = useMotionValue(40);
  const spot = useMotionTemplate`radial-gradient(640px circle at ${mx}% ${my}%, var(--spot), transparent 62%)`;
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

  return (
    <section className="st-hero" id="hero" ref={ref} onMouseMove={desktop && !reduce ? onMove : undefined} aria-label="Introduction">
      <motion.div className="st-hero__bg" style={reduce ? undefined : { y: glowY }} aria-hidden="true">
        <span className="st-glow st-glow--a" />
        <span className="st-glow st-glow--b" />
        <span className="st-glow st-glow--c" />
      </motion.div>
      <motion.div className="st-hero__spot" style={{ background: spot }} aria-hidden="true" />
      <motion.div className="st-hero__waves" style={reduce ? undefined : { y: waveY }} aria-hidden="true">
        {ready && <SilkWaves lines={desktop ? 16 : 9} delay={0.5} />}
      </motion.div>

      <div className="st-hero__inner">
        <motion.div className="st-hero__copy" style={reduce ? undefined : { y: copyY, opacity: copyO }}>
          <motion.span className="st-badge" {...enter(0.1)}>
            <i /> Creative ideas <b>•</b> Digital solutions
          </motion.span>
          <MaskText
            as="h1"
            className="st-hero__title"
            onReady
            delay={2}
            lines={[
              "Brands",
              <>That <span className="grad-text st-shimmer">Inspire</span></>,
              <span className="grad-text-2 st-shimmer" key="g">Growth</span>,
            ]}
          />
          <motion.p className="st-hero__lead" {...enter(0.6)}>
            We design, develop and market digital experiences that help businesses grow and stand out.
          </motion.p>
          <motion.div className="st-hero__ctas" {...enter(0.75)}>
            <Magnetic strength={0.25}>
              <button type="button" className="btn-primary" onClick={() => setIsContactModalOpen(true)}>
                <span>Get Started</span>
                <HiArrowRight />
              </button>
            </Magnetic>
            <button type="button" className="btn-secondary" onClick={() => scrollToTarget("#work")}>
              Our Work
            </button>
          </motion.div>
          {clients.length > 0 && (
            <motion.div className="st-proof" {...enter(0.9)}>
              <div className="st-proof__stack">
                {clients.map((c, i) => (
                  <motion.img
                    key={c.id || i}
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    initial={{ opacity: 0, x: -14, scale: 0.5 }}
                    animate={ready ? { opacity: 1, x: 0, scale: 1 } : undefined}
                    transition={{ delay: 1.1 + i * 0.09, type: "spring", stiffness: 320, damping: 20 }}
                  />
                ))}
              </div>
              {clientStat && (
                <div className="st-proof__text">
                  <b>{clientStat.number}</b>
                  <span>Happy clients</span>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        <motion.div className="st-hero__visual" style={reduce ? undefined : { y: logoY, scale: logoS }}>
          <ChromeLogo ready={ready} />
          <div className="st-notes" aria-hidden="true">
            {NOTES.map((n, i) => (
              <motion.span
                key={n}
                className="st-notes__word"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={ready ? { clipPath: "inset(0 0% 0 0)" } : undefined}
                transition={{ duration: 0.7, ease: EASE, delay: 1.6 + i * 0.3 }}
              >
                {n}
              </motion.span>
            ))}
            <svg className="st-notes__arrow" viewBox="0 0 70 92" fill="none">
              <motion.path d="M58 4 C 68 42, 42 72, 8 82" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={ready ? { pathLength: 1 } : undefined} transition={{ duration: 0.9, delay: 2.9, ease: EASE }} />
              <motion.path d="M19 74 L 8 82 L 21 88" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={ready ? { pathLength: 1 } : undefined} transition={{ duration: 0.4, delay: 3.7 }} />
            </svg>
          </div>
        </motion.div>
      </div>

      <motion.button type="button" className="st-scroll" onClick={() => scrollToTarget("#journey")} {...enter(1.5)}>
        <span>Scroll to explore</span>
        <i />
      </motion.button>
    </section>
  );
};

export default Hero;
