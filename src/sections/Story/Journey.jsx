import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { useCms } from "../../context/CmsContext";
import { useIsDesktop, usePrefersReducedMotion } from "../../animations/hooks";
import { getLenis } from "../../animations/lenis";
import { EASE } from "../../animations/variants";
import ServiceArt from "../../components/media/ServiceArt";
import Reveal from "../../components/motion/Reveal";
import SilkWaves from "./SilkWaves";
import { SERVICE_ICONS } from "./icons";

// The four handwritten words from the hero become the four chapters of the story.
const CHAPTERS = [
  {
    key: "Ideas",
    title: "Every brand starts as a spark.",
    text: "We listen first: your goals, your audience and what makes you different. Strategy and content planning turn a rough idea into a clear direction.",
    visual: "idea",
    services: ["social", "content"],
  },
  {
    key: "Design",
    title: "Then we give it a face.",
    text: "Interfaces, identity and motion designed to feel like you, on every screen and in every scroll.",
    visual: "wordpress",
    services: ["web", "wordpress", "edit"],
  },
  {
    key: "Develop",
    title: "Built to perform.",
    text: "Websites, apps and systems engineered for speed, security and scale, with a CMS your team can actually use.",
    visual: "web",
    services: ["app", "crm", "stack"],
  },
  {
    key: "Grow",
    title: "And then, it grows.",
    text: "SEO, GEO and AEO get you found, paid campaigns bring the right people in, and content keeps them coming back.",
    visual: "reach",
    services: ["search", "ads", "handling"],
  },
];
const pad = (n) => String(n).padStart(2, "0");

const useChapterServices = () => {
  const { services } = useCms();
  return (ids) => ids.map((id) => services.find((s) => s.visual === id)).filter(Boolean);
};

const Chips = ({ items }) => (
  <ul className="st-journey__chips">
    {items.map((s, i) => {
      const Icon = SERVICE_ICONS[s.visual] || SERVICE_ICONS.web;
      return (
        <motion.li
          key={s.id || s.title}
          initial={{ opacity: 0, y: 14, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.35 + i * 0.08 }}
        >
          <Icon /> {s.title}
        </motion.li>
      );
    })}
  </ul>
);

// The picture only pops in if it mounts hidden, so switch it "live" a frame later.
const LiveVisual = ({ type }) => {
  const [live, setLive] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setLive(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return <ServiceArt type={type} live={live} />;
};

const copyVariants = {
  out: { opacity: 0, y: 40, filter: "blur(10px)" },
  in: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease: EASE, staggerChildren: 0.07 } },
  exit: { opacity: 0, y: -30, filter: "blur(8px)", transition: { duration: 0.35, ease: EASE } },
};
const line = { out: { opacity: 0, y: 24 }, in: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } }, exit: { opacity: 0 } };

const Scene = () => {
  const ref = useRef(null);
  const pick = useChapterServices();
  const n = CHAPTERS.length;
  const [active, setActive] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const draw = useTransform(p, [0, 0.95], [0.04, 1]);
  const fill = useSpring(p, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const ghostY = useTransform(p, [0, 1], ["8%", "-22%"]);

  useMotionValueEvent(p, "change", (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    setActive((prev) => (prev === i ? prev : i));
  });

  const jump = (i) => {
    const el = ref.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const y = top + (el.offsetHeight - window.innerHeight) * ((i + 0.5) / n);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const ch = CHAPTERS[active];
  return (
    <div className="st-journey__track" ref={ref} style={{ height: `${n * 100 + 40}svh` }}>
      <div className="st-journey__stage">
        <div className="st-journey__waves" aria-hidden="true">
          <SilkWaves progress={draw} lines={12} y0={600} y1={250} lineOpacity={0.55} fillOpacity={0.1} />
        </div>
        <motion.span className="st-journey__ghost" style={{ y: ghostY }} aria-hidden="true">
          {pad(active + 1)}
        </motion.span>

        <header className="st-journey__head">
          <span className="st-label">Our story</span>
          <p className="st-journey__intro">From idea to growth, in four chapters.</p>
          <span className="st-journey__count"><b>{pad(active + 1)}</b> / {pad(n)}</span>
        </header>

        <div className="st-journey__body">
          <div className="st-journey__copy" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={ch.key} variants={copyVariants} initial="out" animate="in" exit="exit">
                <motion.span className="st-journey__num" variants={line}>Chapter {pad(active + 1)}</motion.span>
                <motion.h2 className="st-journey__word" variants={line}>
                  <span className={active % 2 ? "grad-text-2" : "grad-text"}>{ch.key}</span>
                </motion.h2>
                <motion.h3 className="st-journey__title" variants={line}>{ch.title}</motion.h3>
                <motion.p className="st-journey__text" variants={line}>{ch.text}</motion.p>
                <Chips items={pick(ch.services)} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="st-journey__visual">
            <AnimatePresence mode="wait">
              <motion.div
                key={ch.key}
                className="st-orb-card"
                initial={{ rotateY: -70, opacity: 0, scale: 0.85, z: -200 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1, z: 0 }}
                exit={{ rotateY: 70, opacity: 0, scale: 0.85, z: -200 }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                <span className="st-orb-card__glow" />
                <div className="st-orb-card__art">
                  <LiveVisual type={ch.visual} />
                </div>
                <span className="st-orb-card__tag">{pad(active + 1)} — {ch.key}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <nav className="st-rail" aria-label="Story chapters">
          <span className="st-rail__track"><motion.span className="st-rail__fill" style={{ scaleX: fill }} /></span>
          {CHAPTERS.map((c, i) => (
            <button
              key={c.key}
              type="button"
              className={`st-rail__node ${i <= active ? "is-on" : ""} ${i === active ? "is-active" : ""}`}
              onClick={() => jump(i)}
              aria-current={i === active ? "step" : undefined}
            >
              <i />
              <span>{c.key}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Phones and reduced motion: the same story as a calm vertical list.
const Stacked = () => {
  const pick = useChapterServices();
  return (
    <div className="st-journey__stacked">
      <Reveal as="span" className="st-label">Our story</Reveal>
      <Reveal as="p" className="st-journey__intro">From idea to growth, in four chapters.</Reveal>
      <ol>
        {CHAPTERS.map((c, i) => (
          <Reveal as="li" key={c.key} className="st-journey__item">
            <span className="st-journey__num">Chapter {pad(i + 1)}</span>
            <h2 className="st-journey__word"><span className={i % 2 ? "grad-text-2" : "grad-text"}>{c.key}</span></h2>
            <h3 className="st-journey__title">{c.title}</h3>
            <p className="st-journey__text">{c.text}</p>
            <Chips items={pick(c.services)} />
          </Reveal>
        ))}
      </ol>
    </div>
  );
};

const Journey = () => {
  const desktop = useIsDesktop();
  const reduce = usePrefersReducedMotion();
  return (
    <section className="st-journey" id="journey" aria-label="Our story: idea to growth">
      {desktop && !reduce ? <Scene /> : <Stacked />}
    </section>
  );
};

export default Journey;
