import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import { useCms } from "../../context/CmsContext";
import { useIsDesktop, usePrefersReducedMotion } from "../../animations/hooks";
import { EASE, VIEWPORT } from "../../animations/variants";
import Reveal from "../../components/motion/Reveal";
import MaskText from "../../components/motion/MaskText";
import TiltCard from "../../components/motion/TiltCard";
import { SERVICE_ICONS } from "./icons";

const FEATURED = ["web", "app", "crm", "handling", "content", "wordpress"];

const useCards = () => {
  const { services } = useCms();
  const picked = FEATURED.map((v) => services.find((s) => s.visual === v)).filter(Boolean);
  return picked.length >= 6 ? picked : services.slice(0, 6);
};

const Header = () => (
  <div className="st-head">
    <div>
      <Reveal as="span" className="st-label">Our services</Reveal>
      <MaskText
        as="h2"
        className="st-title"
        lines={["Everything You Need", <>to Build &amp; <span className="grad-text st-shimmer">Grow</span> Your Brand</>]}
      />
    </div>
    <Reveal className="st-head__aside" delay={0.15}>
      <p>From stunning websites to impactful marketing, we provide complete digital solutions under one roof.</p>
      <Link to="/services" className="st-link" data-cursor="Open">
        View All Services <HiArrowRight />
      </Link>
    </Reveal>
  </div>
);

// One card. When `on`, its icon draws itself, a light sweep crosses it and the arrow pulses.
const ServiceCard = ({ s, on }) => {
  const Icon = SERVICE_ICONS[s.visual] || SERVICE_ICONS.web;
  const tileRef = useRef(null);
  // Normalise every icon path to length 1 so the stroke can be drawn with a 0 -> 1 dash offset.
  useLayoutEffect(() => {
    tileRef.current?.querySelectorAll("path").forEach((p) => p.setAttribute("pathLength", "1"));
  }, []);
  return (
    <TiltCard tilt={7} className={`st-service ${on ? "is-on" : ""}`} variants={undefined}>
      <Link to="/services" className="st-service__link" aria-label={`${s.title} — view services`}>
        <span className="st-service__tile" ref={tileRef}><Icon /></span>
        <h3 className="st-service__title">{s.title}</h3>
        <p className="st-service__desc">{s.description}</p>
        <span className="st-service__arrow"><HiArrowRight /></span>
      </Link>
    </TiltCard>
  );
};

// A card in the dealt hand: starts fanned in the middle of the grid, flies to its own slot.
const DealCard = ({ s, i, n, p, delta }) => {
  const [on, setOn] = useState(false);
  const mid = (n - 1) / 2;
  const start = 0.08 + i * 0.065;
  const end = start + 0.34;
  const dx = useMotionValue(delta.x);
  const dy = useMotionValue(delta.y);
  useEffect(() => {
    dx.set(delta.x);
    dy.set(delta.y);
  }, [delta.x, delta.y, dx, dy]);

  const t = useTransform(p, [start, end], [0, 1], { clamp: true });
  const lift = 70 + Math.abs(i - mid) * 12; // the fanned hand sits a little low, outer cards lower
  const x = useTransform([t, dx], ([v, d]) => (1 - v) * d);
  const y = useTransform([t, dy], ([v, d]) => (1 - v) * (d + lift) - Math.sin(v * Math.PI) * 50); // arcs up in flight
  const rotate = useTransform(t, (v) => (1 - v) * (i - mid) * 9);
  const scale = useTransform(t, [0, 0.6, 1], [0.82, 1.04, 1]);
  const zIndex = useTransform(t, (v) => (v > 0.98 ? 1 : 20 - Math.round(Math.abs(i - mid) * 2)));

  useMotionValueEvent(t, "change", (v) => {
    if (v > 0.9) setOn(true);
    else if (v < 0.4) setOn(false);
  });

  return (
    <motion.li className={`st-services__cell st-tone-${i % 6}`} style={{ x, y, rotate, scale, zIndex }}>
      <ServiceCard s={s} on={on} />
    </motion.li>
  );
};

// Desktop: the section pins while the hand of six cards is dealt into the row.
const Dealt = ({ cards }) => {
  const ref = useRef(null);
  const gridRef = useRef(null);
  const [deltas, setDeltas] = useState(() => cards.map(() => ({ x: 0, y: 0 })));

  // Distance from each card's slot to the centre of the grid (layout positions ignore transforms).
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;
    const measure = () => {
      const W = grid.offsetWidth;
      const H = grid.offsetHeight;
      setDeltas([...grid.children].map((li) => ({
        x: W / 2 - (li.offsetLeft + li.offsetWidth / 2),
        y: H / 2 - (li.offsetTop + li.offsetHeight / 2),
      })));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    return () => ro.disconnect();
  }, [cards.length]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 130, damping: 26, mass: 0.35, restDelta: 0.0005 });
  const glowScale = useTransform(p, [0, 0.75], [0.35, 1.15]);
  const glowOpacity = useTransform(p, [0, 0.25, 1], [0, 0.85, 0.45]);
  const counter = useTransform(p, (v) => {
    const dealt = cards.filter((_, i) => v >= 0.08 + i * 0.065 + 0.34 * 0.9).length;
    return `${String(dealt).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
  });

  return (
    <div className="st-services__track" ref={ref}>
      <div className="st-services__stage">
        <motion.span className="st-services__glow" style={{ scale: glowScale, opacity: glowOpacity }} aria-hidden="true" />
        <Header />
        <ul className="st-services__grid" ref={gridRef}>
          {cards.map((s, i) => (
            <DealCard key={s.id || s.title} s={s} i={i} n={cards.length} p={p} delta={deltas[i] || { x: 0, y: 0 }} />
          ))}
        </ul>
        <motion.span className="st-services__count" aria-hidden="true">{counter}</motion.span>
      </div>
    </div>
  );
};

// Phones / reduced motion: cards flip up in sequence as the grid scrolls into view.
const flip = {
  hidden: { opacity: 0, y: 60, rotateX: 28 },
  show: (i) => ({ opacity: 1, y: 0, rotateX: 0, transition: { duration: 1, ease: EASE, delay: i * 0.08 } }),
};

const StaticCell = ({ s, i }) => {
  const [on, setOn] = useState(false);
  return (
    <motion.li variants={flip} custom={i} className={`st-services__cell st-tone-${i % 6}`} onAnimationComplete={() => setOn(true)}>
      <ServiceCard s={s} on={on} />
    </motion.li>
  );
};

const ServicesGrid = () => {
  const cards = useCards();
  const desktop = useIsDesktop();
  const reduce = usePrefersReducedMotion();
  if (!cards.length) return null;

  return (
    <section className="st-services" id="services" aria-label="Services">
      {desktop && !reduce ? (
        <Dealt cards={cards} />
      ) : (
        <div className="st-section">
          <Header />
          <motion.ul className="st-services__grid" initial="hidden" whileInView="show" viewport={VIEWPORT} style={{ perspective: 1200 }}>
            {cards.map((s, i) => (
              <StaticCell key={s.id || s.title} s={s} i={i} />
            ))}
          </motion.ul>
        </div>
      )}
    </section>
  );
};

export default ServicesGrid;
