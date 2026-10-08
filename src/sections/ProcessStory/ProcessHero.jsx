import React, { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import { useReady } from "../../animations/ReadyContext";
import { useFinePointer, useIsDesktop, usePrefersReducedMotion } from "../../animations/hooks";
import { scrollToTarget } from "../../animations/lenis";
import { EASE } from "../../animations/variants";
import { KineticLine, KineticWord } from "../../components/motion/KineticText";
import Magnetic from "../../components/buttons/Magnetic";
import { jumpToPhase } from "./jump";
import { PHASES, ROUTE_H, ROUTE_W, pad, routePath, routePoints } from "./data";

// The route: one stop per phase on a winding line that draws itself, with a light travelling along it.
const Route = ({ ready, reduce }) => {
  const pts = useMemo(() => routePoints(PHASES.length), []);
  const d = useMemo(() => routePath(pts), [pts]);

  return (
    <div className="pr-route">
      <svg className="pr-route__svg" viewBox={`0 0 ${ROUTE_W} ${ROUTE_H}`} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="pr-route-g" x1="0" y1="0" x2={ROUTE_W} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" style={{ stopColor: "var(--wave-1)" }} />
            <stop offset="0.55" style={{ stopColor: "var(--wave-2)" }} />
            <stop offset="1" style={{ stopColor: "var(--wave-3)" }} />
          </linearGradient>
        </defs>
        <path d={d} className="pr-route__base" vectorEffect="non-scaling-stroke" />
        <motion.path
          d={d}
          className="pr-route__line"
          vectorEffect="non-scaling-stroke"
          stroke="url(#pr-route-g)"
          initial={{ pathLength: 0 }}
          animate={ready ? { pathLength: 1 } : undefined}
          transition={{ duration: 3, ease: EASE, delay: 0.6 }}
        />
        {!reduce && ready && (
          <circle r="6" className="pr-route__traveller">
            <animateMotion dur="14s" begin="3.4s" repeatCount="indefinite" path={d} />
          </circle>
        )}
      </svg>

      {pts.map((pt, i) => (
        <motion.button
          key={PHASES[i].short}
          type="button"
          className={`pr-stop ${i % 2 === 0 ? "is-low" : "is-high"}`}
          style={{ left: `${(pt.x / ROUTE_W) * 100}%`, top: `${(pt.y / ROUTE_H) * 100}%` }}
          onClick={() => jumpToPhase(i, PHASES.length)}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={ready ? { opacity: 1, scale: 1 } : undefined}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.9 + i * 0.28 }}
          aria-label={`Phase ${pad(i + 1)}: ${PHASES[i].name}`}
          data-cursor="Go"
        >
          <i className="pr-stop__dot" />
          <span className="pr-stop__label">
            <b>{pad(i + 1)}</b>
            {PHASES[i].short}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

// Chapter 0 — the map. The headline rises letter by letter, then the whole route is drawn:
// seven stops from first call to launch day (and what comes after).
const ProcessHero = ({ openContact }) => {
  const ref = useRef(null);
  const ready = useReady();
  const reduce = usePrefersReducedMotion();
  const desktop = useIsDesktop();
  const fine = useFinePointer();

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(p, [0, 1], ["0%", "-20%"]);
  const copyO = useTransform(p, [0, 0.6], [1, 0]);
  const routeY = useTransform(p, [0, 1], ["0%", "-8%"]);
  const glowY = useTransform(p, [0, 1], ["0%", "26%"]);

  const mx = useMotionValue(55);
  const my = useMotionValue(45);
  const spot = useMotionTemplate`radial-gradient(620px circle at ${mx}% ${my}%, var(--pr-spot), transparent 62%)`;
  useEffect(() => {
    if (!fine || reduce) return undefined;
    const onMove = (e) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      mx.set(((e.clientX - r.left) / r.width) * 100);
      my.set(((e.clientY - r.top) / r.height) * 100);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine, reduce, mx, my]);

  const enter = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE, delay },
  });
  const fx = (style) => (reduce ? undefined : style);

  return (
    <section className="pr-hero" id="top" ref={ref} aria-label="Our process">
      <motion.div className="pr-hero__bg" style={fx({ y: glowY })} aria-hidden="true">
        <span className="pg-glow pg-glow--a" />
        <span className="pg-glow pg-glow--b" />
        <span className="pg-glow pg-glow--c" />
      </motion.div>
      {desktop && <motion.div className="pr-hero__spot" style={{ background: spot }} aria-hidden="true" />}

      <div className="pr-hero__inner">
        <motion.div className="pr-hero__copy" style={fx({ y: copyY, opacity: copyO })}>
          <motion.span className="pg-badge" {...enter(0.1)}>
            <i /> Methodology &amp; workflow <span className="pg-badge__more"><b>•</b> {pad(PHASES.length)} phases</span>
          </motion.span>

          <h1 className="pr-hero__title" aria-label="From first call to launch day.">
            <KineticLine text="From first call" from={4} ready={ready} />
            <KineticWord className="grad-text text-shimmer" delay={0.7} ready={ready}>to launch day.</KineticWord>
          </h1>

          <motion.p className="pr-hero__lead" {...enter(0.85)}>
            Seven steps, each with clear deliverables, so you always know what is happening and what comes next.
          </motion.p>

          <motion.div className="pr-hero__ctas" {...enter(1)}>
            <Magnetic strength={0.25}>
              <button type="button" className="btn-primary" onClick={() => scrollToTarget("#journey", { offset: 0 })}>
                <span>Follow the journey</span>
                <HiArrowRight />
              </button>
            </Magnetic>
            <button type="button" className="btn-secondary" onClick={openContact}>Talk to us</button>
          </motion.div>

          {/* Phones: the route is replaced by a list of the phases */}
          <motion.ol className="pr-phases" {...enter(1.1)} aria-label="Phases">
            {PHASES.map((ph, i) => (
              <li key={ph.short}>
                <button type="button" onClick={() => jumpToPhase(i, PHASES.length)}>
                  <b>{pad(i + 1)}</b> {ph.short}
                </button>
              </li>
            ))}
          </motion.ol>
        </motion.div>

        {desktop && (
          <motion.div className="pr-hero__route" style={fx({ y: routeY })}>
            <Route ready={ready} reduce={reduce} />
          </motion.div>
        )}
      </div>

      <motion.button type="button" className="pg-scroll" onClick={() => scrollToTarget("#journey", { offset: 0 })} {...enter(1.5)}>
        <span>Scroll to explore</span>
        <i />
      </motion.button>
    </section>
  );
};

export default ProcessHero;
