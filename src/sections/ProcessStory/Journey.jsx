import React, { useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useIsDesktop, usePrefersReducedMotion } from "../../animations/hooks";
import { EASE } from "../../animations/variants";
import DrawTick from "../../components/motion/DrawTick";
import MaskText from "../../components/motion/MaskText";
import Reveal from "../../components/motion/Reveal";
import SilkWaves from "../Story/SilkWaves";
import { jumpToPhase } from "./jump";
import { PHASES, pad } from "./data";

const N = PHASES.length;

// Hold on each phase, then travel: the row "clicks" from one panel to the next.
const settle = (raw, max) => {
  const base = Math.min(Math.floor(raw), max);
  const f = raw - base;
  const e = Math.min(1, Math.max(0, (f - 0.2) / 0.6));
  return Math.min(max, base + e * e * (3 - 2 * e));
};

const Deliverables = ({ items, on }) => (
  <div className="pr-deliver">
    <h4 className="pr-deliver__head">Deliverables</h4>
    <ul>
      {items.map((item, i) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, x: -16 }}
          animate={on ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.7, ease: EASE, delay: 0.25 + i * 0.1 }}
        >
          <DrawTick on={on} delay={0.35 + i * 0.1} />
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  </div>
);

// One phase in the pinned row. Its size, opacity and tilt follow its distance from the centre;
// its giant numeral drifts against the scroll.
const Panel = ({ phase, i, pos, active, seen }) => {
  const Icon = phase.icon;
  const dist = useTransform(pos, (v) => Math.abs(i - v));
  const scale = useTransform(dist, [0, 1], [1, 0.9]);
  const opacity = useTransform(dist, [0, 1, 2], [1, 0.32, 0.12]);
  const rotateY = useTransform(pos, (v) => Math.max(-1, Math.min(1, v - i)) * 9);
  const numX = useTransform(pos, (v) => (i - v) * -90);

  return (
    <motion.article
      className={`pr-panel pr-tone-${i % 4} ${active ? "is-active" : ""}`}
      style={{ scale, opacity, rotateY, transformPerspective: 1500 }}
      aria-label={`Phase ${pad(i + 1)}: ${phase.name}`}
    >
      <span className="pr-panel__glow" aria-hidden="true" />
      <motion.span className="pr-panel__num" style={{ x: numX }} aria-hidden="true">{pad(i + 1)}</motion.span>

      <div className="pr-panel__main">
        <div className="pr-panel__top">
          <span className="pr-tile"><Icon /></span>
          <span className="pr-meta">Phase {pad(i + 1)} / {pad(N)}</span>
        </div>
        <h3 className="pr-panel__title">{phase.name}</h3>
        <p className="pr-panel__tagline">{phase.tagline}</p>
        <p className="pr-panel__desc">{phase.desc}</p>
      </div>

      <Deliverables items={phase.deliverables} on={seen} />
    </motion.article>
  );
};

// Desktop: the section pins and the seven phases travel past, left to right.
const Scene = () => {
  const trackRef = useRef(null);
  const rowRef = useRef(null);
  const max = N - 1;
  const [active, setActive] = useState(0);
  const [reached, setReached] = useState(0); // furthest phase shown so far: its ticks stay drawn
  const step = useMotionValue(0);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 24, mass: 0.4, restDelta: 0.0005 });
  const pos = useTransform(smooth, (v) => settle(v * max, max));
  const x = useTransform([pos, step], ([v, s]) => -v * s);
  const railFill = useTransform(pos, (v) => v / max);
  const cometLeft = useTransform(railFill, (v) => `${v * 100}%`);
  const draw = useTransform(scrollYProgress, [0, 0.95], [0.04, 1]);
  const ghostX = useTransform(pos, (v) => `${-v * 6}%`);

  // Distance between two neighbouring panels' centres
  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return undefined;
    const measure = () => {
      const [a, b] = row.children;
      if (a && b) step.set(b.offsetLeft - a.offsetLeft);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    return () => ro.disconnect();
  }, [step]);

  useMotionValueEvent(pos, "change", (v) => {
    const i = Math.round(v);
    setActive((prev) => (prev === i ? prev : i));
    setReached((prev) => Math.max(prev, i));
  });

  return (
    <div className="pr-track" ref={trackRef} style={{ height: `${N * 86 + 40}svh` }}>
      <div className="pr-stage">
        <div className="pr-stage__waves" aria-hidden="true">
          <SilkWaves progress={draw} lines={12} y0={640} y1={250} lineOpacity={0.5} fillOpacity={0.09} />
        </div>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={active}
            className="pr-stage__ghost"
            style={{ x: ghostX }}
            aria-hidden="true"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {pad(active + 1)}
          </motion.span>
        </AnimatePresence>

        <nav className="pr-rail" aria-label="Phases">
          <span className="pr-rail__track" aria-hidden="true">
            <motion.i style={{ scaleX: railFill }} />
            <motion.b className="pr-rail__comet" style={{ left: cometLeft }} />
          </span>
          {PHASES.map((ph, i) => (
            <button
              key={ph.short}
              type="button"
              className={`pr-rail__node ${i <= active ? "is-on" : ""} ${i === active ? "is-active" : ""}`}
              style={{ left: `${(i / max) * 100}%` }}
              onClick={() => jumpToPhase(i, N)}
              aria-current={i === active ? "step" : undefined}
            >
              <i />
              <span><b>{pad(i + 1)}</b> {ph.short}</span>
            </button>
          ))}
        </nav>

        <div className="pr-view">
          <motion.div className="pr-row" ref={rowRef} style={{ x }}>
            {PHASES.map((phase, i) => (
              <Panel key={phase.short} phase={phase} i={i} pos={pos} active={i === active} seen={i <= reached} />
            ))}
          </motion.div>
        </div>

        <footer className="pr-foot">
          <span className="pr-foot__count"><b>{pad(active + 1)}</b> / {pad(N)}</span>
          <span className="pr-foot__hint">Keep scrolling</span>
        </footer>
      </div>
    </div>
  );
};

// A phase in the vertical layout. Its ticks draw once it is on screen.
const PhaseCard = ({ phase, i }) => {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  const Icon = phase.icon;
  return (
    <Reveal as="li" className={`pr-card pr-tone-${i % 4}`} id={`phase-${i + 1}`}>
      <div ref={ref}>
        <span className="pr-card__num" aria-hidden="true">{pad(i + 1)}</span>
        <div className="pr-panel__top">
          <span className="pr-tile"><Icon /></span>
          <span className="pr-meta">Phase {pad(i + 1)} / {pad(N)}</span>
        </div>
        <h3 className="pr-panel__title">{phase.name}</h3>
        <p className="pr-panel__tagline">{phase.tagline}</p>
        <p className="pr-panel__desc">{phase.desc}</p>
        <Deliverables items={phase.deliverables} on={seen} />
      </div>
    </Reveal>
  );
};

// Phones / reduced motion: the same seven phases as a vertical timeline.
const Stacked = ({ reduce }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <div className="pr-stack">
      <Reveal as="span" className="st-label">The journey</Reveal>
      <MaskText as="h2" className="st-title" lines={["How a project", <>unfolds, <span className="grad-text">step by step</span></>]} />
      <div className="pr-stack__body" ref={ref}>
        <span className="pr-stack__rail" aria-hidden="true">
          <motion.i style={reduce ? { scaleY: 1 } : { scaleY: fill }} />
        </span>
        <ol>
          {PHASES.map((phase, i) => (
            <PhaseCard key={phase.short} phase={phase} i={i} />
          ))}
        </ol>
      </div>
    </div>
  );
};

const Journey = () => {
  const desktop = useIsDesktop();
  const reduce = usePrefersReducedMotion();
  return (
    <section className="pr-journey" id="journey" aria-label="The seven phases">
      {desktop && !reduce ? <Scene /> : <Stacked reduce={reduce} />}
    </section>
  );
};

export default Journey;
