import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCms } from "../../context/CmsContext";
import { useIsDesktop, usePrefersReducedMotion } from "../../animations/hooks";
import CountUp from "../../components/motion/CountUp";
import Reveal from "../../components/motion/Reveal";
import ScrollWords from "../../components/motion/ScrollWords";
import { Stagger, StaggerItem } from "../../components/motion/Stagger";
import SilkWaves from "../Story/SilkWaves";

const TEXT =
  "Pixie Digital Creatives started with a simple idea: design and engineering should be planned together, so what looks good also works properly and keeps the business growing.";
const ACCENT = ["planned", "together"];
const SUB = "We care about how a site looks and how it performs in equal measure.";

const NUM = /^(\D*)(\d+(?:[.,]\d+)?)(.*)$/;

// A stat whose number counts up as the scroll moves through [start, end] (not on a timer),
// so the count is always in step with what the reader is looking at.
const ScrollStat = ({ stat, p, start, end }) => {
  const m = String(stat.number ?? "").match(NUM);
  const target = m ? parseFloat(m[2].replace(",", ".")) : 0;
  const decimals = m && /[.,]/.test(m[2]) ? m[2].split(/[.,]/)[1].length : 0;
  const raw = useTransform(p, [start, end], [0, target], { clamp: true });
  const text = useTransform(raw, (v) => (m ? `${m[1]}${v.toFixed(decimals)}${m[3]}` : String(stat.number)));
  const opacity = useTransform(p, [start - 0.04, start + 0.06], [0, 1]);
  const y = useTransform(p, [start - 0.04, start + 0.06], [34, 0]);
  return (
    <motion.li className="ab-stat" style={{ opacity, y }}>
      <motion.b className="ab-stat__num">{text}</motion.b>
      <span className="ab-stat__label">{stat.label}</span>
    </motion.li>
  );
};

// Desktop: the section pins; the sentence lights up word by word, then the numbers count up.
const Scene = ({ stats }) => {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const draw = useTransform(p, [0, 0.9], [0.04, 1]);
  const ghostY = useTransform(p, [0, 1], ["14%", "-26%"]);
  const subO = useTransform(p, [0.58, 0.7], [0, 1]);
  const subY = useTransform(p, [0.58, 0.7], [24, 0]);
  const fill = useTransform(p, [0, 1], [0, 1]);

  return (
    <div className="ab-man__track" ref={ref}>
      <div className="ab-man__stage">
        <div className="ab-man__waves" aria-hidden="true">
          <SilkWaves progress={draw} lines={12} y0={620} y1={260} lineOpacity={0.5} fillOpacity={0.09} />
        </div>
        <motion.span className="ab-man__ghost" style={{ y: ghostY }} aria-hidden="true">Why</motion.span>

        <div className="ab-man__body">
          <header className="ab-man__head">
            <span className="st-label">Who we are</span>
            <span className="ab-man__meter" aria-hidden="true"><motion.i style={{ scaleX: fill }} /></span>
          </header>

          <ScrollWords as="h2" className="ab-man__text" text={TEXT} progress={p} range={[0.03, 0.56]} accent={ACCENT} />
          <motion.p className="ab-man__sub" style={{ opacity: subO, y: subY }}>{SUB}</motion.p>

          {stats.length > 0 && (
            <ul className="ab-stats" aria-label="The studio in numbers">
              {stats.map((s, i) => (
                <ScrollStat key={s.id || s.label} stat={s} p={p} start={0.64 + i * 0.07} end={0.84 + i * 0.05} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// Phones / reduced motion: the same words and numbers, revealed as ordinary content.
const Static = ({ stats }) => (
  <div className="ab-man__static">
    <Reveal as="span" className="st-label">Who we are</Reveal>
    <Reveal as="h2" className="ab-man__text ab-man__text--static" delay={0.05}>
      {TEXT.split(" ").map((w, i) => (
        <React.Fragment key={i}>
          <span className={ACCENT.includes(w.replace(/[^a-z]/gi, "").toLowerCase()) ? "grad-text" : undefined}>{w}</span>
          {" "}
        </React.Fragment>
      ))}
    </Reveal>
    <Reveal as="p" className="ab-man__sub ab-man__sub--static" delay={0.1}>{SUB}</Reveal>
    {stats.length > 0 && (
      <Stagger as="ul" className="ab-stats" stagger={0.1} aria-label="The studio in numbers">
        {stats.map((s) => (
          <StaggerItem as="li" key={s.id || s.label} className="ab-stat">
            <CountUp className="ab-stat__num" value={s.number} />
            <span className="ab-stat__label">{s.label}</span>
          </StaggerItem>
        ))}
      </Stagger>
    )}
  </div>
);

const Manifesto = () => {
  const { stats } = useCms();
  const desktop = useIsDesktop();
  const reduce = usePrefersReducedMotion();
  const items = stats.slice(0, 4);
  return (
    <section className="ab-man" id="manifesto" aria-label="Who we are">
      {desktop && !reduce ? <Scene stats={items} /> : <Static stats={items} />}
    </section>
  );
};

export default Manifesto;
