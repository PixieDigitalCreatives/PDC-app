import React, { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import { useCms } from "../../context/CmsContext";
import { useReady } from "../../animations/ReadyContext";
import { useFinePointer, useIsDesktop, usePrefersReducedMotion } from "../../animations/hooks";
import { scrollToTarget } from "../../animations/lenis";
import { EASE, EASE_IN_OUT } from "../../animations/variants";
import { KineticLine, KineticWord } from "../../components/motion/KineticText";
import Magnetic from "../../components/buttons/Magnetic";
import SilkWaves from "../Story/SilkWaves";

const FALLBACK = "/rishi.jpg";
const onImgError = (e) => {
  if (!e.target.dataset.fb) {
    e.target.dataset.fb = "1";
    e.target.src = FALLBACK;
  }
};

// Where each arch sits inside the collage (percent of the collage box) and how far it travels
// with the cursor / scroll. Bigger `depth` = closer to the viewer.
const SPOTS = [
  { l: 1, t: 10, w: 46, ar: "3 / 4", depth: 1 },
  { l: 52, t: 0, w: 41, ar: "3 / 4", depth: 1.7 },
  { l: 57, t: 51, w: 37, ar: "1 / 1.15", depth: 0.7 },
  { l: 8, t: 68, w: 36, ar: "1 / 1.05", depth: 2.1 },
];
const SPRING = { stiffness: 60, damping: 18, mass: 0.8 };

const Plate = ({ item, spot, index, ready, nx, ny, scrollP, motionOn }) => {
  const x = useTransform(nx, (v) => v * spot.depth * 38);
  const cursorY = useTransform(ny, (v) => v * spot.depth * 28);
  const scrollY = useTransform(scrollP, [0, 1], [0, spot.depth * -90]);
  const y = useTransform([cursorY, scrollY], ([a, b]) => a + b);

  return (
    <motion.div
      className="ab-plate"
      style={{ left: `${spot.l}%`, top: `${spot.t}%`, width: `${spot.w}%`, aspectRatio: spot.ar, ...(motionOn ? { x, y } : {}) }}
    >
      <div className="ab-plate__float" style={{ animationDelay: `${-index * 1.7}s`, animationDuration: `${6 + index}s` }}>
        <motion.figure
          className="ab-plate__frame"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={ready ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
          transition={{ duration: 1.3, ease: EASE_IN_OUT, delay: 0.55 + index * 0.18 }}
        >
          <motion.img
            src={item.image || FALLBACK}
            alt={item.alt}
            decoding="async"
            onError={onImgError}
            draggable="false"
            initial={{ scale: 1.45 }}
            animate={ready ? { scale: 1 } : undefined}
            transition={{ duration: 1.8, ease: EASE, delay: 0.55 + index * 0.18 }}
          />
          <span className="ab-plate__shade" />
          <figcaption>
            <b>{item.name}</b>
            {item.sub && <span>{item.sub}</span>}
          </figcaption>
        </motion.figure>
      </div>
    </motion.div>
  );
};

// A ring of text (the company tagline) turning around the logo.
const Ring = ({ text, ready }) => (
  <motion.div
    className="ab-ring"
    aria-hidden="true"
    initial={{ scale: 0, rotate: -90, opacity: 0 }}
    animate={ready ? { scale: 1, rotate: 0, opacity: 1 } : undefined}
    transition={{ type: "spring", stiffness: 120, damping: 16, delay: 1.5 }}
  >
    <svg viewBox="0 0 200 200" className="ab-ring__text">
      <defs>
        <path id="ab-ring-path" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
      </defs>
      <text>
        <textPath href="#ab-ring-path" startOffset="0" textLength="484" lengthAdjust="spacing">{`${text} • `}</textPath>
      </text>
    </svg>
    <img src="/brand/mark-256.png" alt="" className="ab-ring__logo" />
  </motion.div>
);

// Chapter 0 — who we are. The headline rises letter by letter while the people behind the studio
// open as arches, each drifting at its own depth with the cursor and the scroll.
const AboutHero = ({ openContact }) => {
  const ref = useRef(null);
  const ready = useReady();
  const reduce = usePrefersReducedMotion();
  const desktop = useIsDesktop();
  const fine = useFinePointer();
  const { teamMembers, portfolioProjects, companyInfo } = useCms();
  const motionOn = !reduce;

  // The faces of the studio when we have them; otherwise real project screenshots. Never stock images.
  const plates = useMemo(() => {
    const team = [...teamMembers].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).filter((m) => m.image);
    if (team.length) {
      return team.slice(0, 4).map((m) => ({ image: m.image, alt: m.name, name: m.name.split(" ")[0], sub: m.role }));
    }
    return portfolioProjects
      .filter((p) => p.image)
      .slice(0, 4)
      .map((p) => ({ image: p.image, alt: p.title, name: p.title, sub: p.category }));
  }, [teamMembers, portfolioProjects]);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(p, [0, 1], ["0%", "-22%"]);
  const copyO = useTransform(p, [0, 0.62], [1, 0]);
  const glowY = useTransform(p, [0, 1], ["0%", "26%"]);
  const waveY = useTransform(p, [0, 1], ["0%", "-14%"]);
  const ghostX = useTransform(p, [0, 1], ["0%", "-14%"]);

  // Cursor: spotlight on the hero + depth drift for the arches
  const nx = useSpring(0, SPRING);
  const ny = useSpring(0, SPRING);
  const mx = useMotionValue(62);
  const my = useMotionValue(42);
  const spot = useMotionTemplate`radial-gradient(620px circle at ${mx}% ${my}%, var(--ab-spot), transparent 62%)`;
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
  const tagline = (companyInfo?.tagline || "Creative. Strategic. Impactful.").replace(/\.$/, "");

  return (
    <section className="ab-hero" id="top" ref={ref} aria-label="About Pixie Digital Creatives">
      <motion.div className="ab-hero__bg" style={fx({ y: glowY })} aria-hidden="true">
        <span className="pg-glow pg-glow--a" />
        <span className="pg-glow pg-glow--b" />
        <span className="pg-glow pg-glow--c" />
      </motion.div>
      {desktop && <motion.div className="ab-hero__spot" style={{ background: spot }} aria-hidden="true" />}
      <motion.div className="ab-hero__waves" style={fx({ y: waveY })} aria-hidden="true">
        {ready && <SilkWaves lines={desktop ? 13 : 7} delay={0.4} y0={640} y1={330} lineOpacity={0.5} />}
      </motion.div>
      <motion.span className="ab-hero__ghost" style={fx({ x: ghostX })} aria-hidden="true">PDC</motion.span>

      <div className="ab-hero__inner">
        <motion.div className="ab-hero__copy" style={fx({ y: copyY, opacity: copyO })}>
          <motion.span className="pg-badge" {...enter(0.1)}>
            <i /> Our story <span className="pg-badge__more"><b>•</b> Pixie Digital Creatives</span>
          </motion.span>

          <h1 className="ab-hero__title" aria-label="A small studio that makes things on purpose.">
            <KineticLine text="A small studio" from={4} ready={ready} />
            <KineticLine text="that makes things" from={18} ready={ready} />
            <KineticWord className="grad-text text-shimmer" delay={0.8} ready={ready}>on purpose.</KineticWord>
          </h1>

          <motion.p className="ab-hero__lead" {...enter(0.85)}>
            Pixie Digital Creatives is a boutique creative technology studio helping ambitious founders, businesses and
            creators turn bold ideas into high-impact digital experiences.
          </motion.p>

          <motion.div className="ab-hero__ctas" {...enter(1)}>
            <Magnetic strength={0.25}>
              <button type="button" className="btn-primary" onClick={openContact}>
                <span>Let&apos;s talk</span>
                <HiArrowRight />
              </button>
            </Magnetic>
            {teamMembers.length > 0 && (
              <button type="button" className="btn-secondary" onClick={() => scrollToTarget("#about", { offset: 0 })}>
                Meet the team
              </button>
            )}
          </motion.div>
        </motion.div>

        <div className="ab-hero__visual">
          <div className="ab-collage">
            {plates.map((item, i) => (
              <Plate key={item.alt} item={item} spot={SPOTS[i]} index={i} ready={ready} nx={nx} ny={ny} scrollP={p} motionOn={motionOn} />
            ))}
            <Ring text={tagline} ready={ready} />
            {plates.length > 0 && (
              <div className="ab-note" aria-hidden="true">
                <motion.span
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={ready ? { clipPath: "inset(0 0% 0 0)" } : undefined}
                  transition={{ duration: 0.9, ease: EASE, delay: 2.2 }}
                >
                  the people behind it
                </motion.span>
                <svg viewBox="0 0 70 92" fill="none">
                  <motion.path
                    d="M58 4 C 68 42, 42 72, 8 82"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={ready ? { pathLength: 1 } : undefined}
                    transition={{ duration: 0.9, delay: 2.9, ease: EASE }}
                  />
                  <motion.path
                    d="M19 74 L 8 82 L 21 88"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={ready ? { pathLength: 1 } : undefined}
                    transition={{ duration: 0.4, delay: 3.7 }}
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      <motion.button type="button" className="pg-scroll" onClick={() => scrollToTarget("#manifesto", { offset: 0 })} {...enter(1.5)}>
        <span>Scroll to explore</span>
        <i />
      </motion.button>
    </section>
  );
};

export default AboutHero;
