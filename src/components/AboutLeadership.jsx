import React, { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { FaLinkedinIn, FaXTwitter, FaGithub } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import { useCms } from "../context/CmsContext";
import { useIsDesktop, usePrefersReducedMotion } from "../animations/hooks";
import { getLenis } from "../animations/lenis";
import { EASE, EASE_IN_OUT } from "../animations/variants";
import Reveal from "./motion/Reveal";
import MaskText from "./motion/MaskText";
import "../styles/aboutleadership.scss";

const FALLBACK = "/rishi.jpg";
const STEP = 32; // degrees between portraits on the arc
const RADIUS = 560; // arc radius in px
const pad = (n) => String(n).padStart(2, "0");

// Placeholder links such as "https://x.com" point at a homepage, not a profile: skip them.
const isProfile = (url) => {
  try {
    return new URL(url).pathname.replace(/\/+$/, "").length > 0;
  } catch {
    return false;
  }
};
const badgeOf = (m) => (m.isFounder ? (/co-founder/i.test(m.role || "") ? "Co-Founder" : "Founder") : null);
const onImgError = (e) => {
  if (!e.target.dataset.fb) {
    e.target.dataset.fb = "1";
    e.target.src = FALLBACK;
  }
};

const Socials = ({ m }) => {
  const links = [
    m.linkedin && isProfile(m.linkedin) && { href: m.linkedin, label: "LinkedIn", Icon: FaLinkedinIn },
    m.twitter && isProfile(m.twitter) && { href: m.twitter, label: "X", Icon: FaXTwitter },
    m.github && isProfile(m.github) && { href: m.github, label: "GitHub", Icon: FaGithub },
    m.email && { href: `mailto:${m.email}`, label: "Email", Icon: MdOutlineMailOutline },
  ].filter(Boolean);
  if (!links.length) return null;
  return (
    <motion.div className="ld-socials" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.55 } } }}>
      {links.map(({ href, label, Icon }) => (
        <motion.a
          key={label}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noreferrer"
          aria-label={`${m.name} on ${label}`}
          variants={{ hidden: { opacity: 0, scale: 0.4, rotate: -40 }, show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 420, damping: 18 } } }}
        >
          <Icon />
        </motion.a>
      ))}
    </motion.div>
  );
};

// The name assembles letter by letter, each letter swinging up out of a 3D tilt.
const KineticName = ({ name, as: Tag = "h3", className = "" }) => {
  const MotionTag = motion[Tag];
  return (
    <MotionTag className={`ld-name ${className}`} aria-label={name} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}>
      {name.split(" ").map((word, w) => (
        <span className="ld-name__word" key={w} aria-hidden="true">
          {[...word].map((ch, c) => (
            <span className="ld-name__mask" key={c}>
              <motion.span
                className="ld-name__char"
                variants={{
                  hidden: { y: "115%", rotateX: -85, opacity: 0 },
                  show: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 0.8, ease: EASE } },
                }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </MotionTag>
  );
};

const fadeUp = { hidden: { opacity: 0, y: 18, filter: "blur(6px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } } };

const Details = ({ m, i, n }) => (
  <motion.div className="ld-details" initial="hidden" animate="show" exit="exit" variants={{ hidden: {}, show: {}, exit: { opacity: 0, y: -16, transition: { duration: 0.3 } } }}>
    <motion.div className="ld-details__meta" variants={fadeUp}>
      <span className="ld-count"><b>{pad(i + 1)}</b> / {pad(n)}</span>
      {badgeOf(m) && <span className="ld-badge">{badgeOf(m)}</span>}
    </motion.div>
    <KineticName name={m.name} />
    <motion.p className="ld-role" variants={fadeUp}>{m.role}</motion.p>
    {m.bio && <motion.p className="ld-bio" variants={fadeUp}>{m.bio}</motion.p>}
    <Socials m={m} />
  </motion.div>
);

// A portrait on the arc. Brightness and visibility follow its distance from the front.
const RingCard = ({ m, i, pos, active, onPick }) => {
  const dist = useTransform(pos, (v) => Math.abs(i - v));
  const bright = useTransform(dist, [0, 1, 2], [1, 0.38, 0.18]);
  const filter = useMotionTemplate`brightness(${bright})`;
  const opacity = useTransform(dist, [0, 1.5, 2.2], [1, 0.95, 0]);
  return (
    <div className="ld-slot" style={{ transform: `rotateY(${i * STEP}deg) translateZ(${RADIUS}px)` }}>
      <motion.button
        type="button"
        className={`ld-card ${active ? "is-active" : ""}`}
        style={{ filter, opacity }}
        onClick={() => onPick(i)}
        aria-label={`Show ${m.name}`}
        data-cursor={active ? undefined : "Meet"}
      >
        <img src={m.image || FALLBACK} alt={m.name} loading="lazy" decoding="async" onError={onImgError} draggable="false" />
        <span className="ld-card__shade" />
        <span className="ld-card__label">
          <b>{m.name.split(" ")[0]}</b>
          <span>{badgeOf(m) || m.role}</span>
        </span>
      </motion.button>
    </div>
  );
};

// Hold on each leader, then turn: the ring "clicks" from one person to the next.
const settle = (raw, max) => {
  const base = Math.min(Math.floor(raw), max);
  const f = raw - base;
  const e = Math.min(1, Math.max(0, (f - 0.22) / 0.56));
  return Math.min(max, base + e * e * (3 - 2 * e));
};

const Ring = ({ members }) => {
  const ref = useRef(null);
  const n = members.length;
  const max = n - 1;
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 24, mass: 0.4, restDelta: 0.0005 });
  const pos = useTransform(smooth, (v) => settle(v * max, max));
  const ringRotate = useTransform(pos, (v) => -v * STEP);
  const floorGlow = useTransform(pos, (v) => 0.75 + 0.25 * Math.cos((v % 1) * Math.PI * 2));

  useMotionValueEvent(pos, "change", (v) => {
    const i = Math.round(v);
    setActive((prev) => (prev === i ? prev : i));
  });

  const jump = (i) => {
    const el = ref.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const y = top + (el.offsetHeight - window.innerHeight) * (max ? i / max : 0);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.5 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const m = members[active];
  return (
    <div className="ld-track" ref={ref} style={{ height: `${n * 85 + 40}svh` }}>
      <div className="ld-stage">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={m.name}
            className="ld-ghost"
            aria-hidden="true"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {m.name.split(" ")[0]}
          </motion.span>
        </AnimatePresence>

        <header className="ld-head">
          <div>
            <Reveal as="span" className="st-label">Founders &amp; core leadership</Reveal>
            <MaskText as="h2" className="st-title" lines={[<>The people behind <span className="grad-text">every project</span></>]} />
          </div>
          <nav className="ld-index" aria-label="Leaders">
            {members.map((x, i) => (
              <button key={x.id || x.name} type="button" className={`ld-index__item ${i === active ? "is-active" : ""}`} onClick={() => jump(i)}>
                {i === active && <motion.span layoutId="ld-index-pill" className="ld-index__pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="ld-index__text">{pad(i + 1)} {x.name.split(" ")[0]}</span>
              </button>
            ))}
          </nav>
        </header>

        <div className="ld-body">
          <div className="ld-info" aria-live="polite">
            <AnimatePresence mode="wait">
              <Details key={m.id || m.name} m={m} i={active} n={n} />
            </AnimatePresence>
          </div>

          <div className="ld-scene">
            <motion.span className="ld-floor" style={{ opacity: floorGlow }} aria-hidden="true" />
            <motion.div className="ld-ring" style={{ rotateY: ringRotate, z: -RADIUS }}>
              {members.map((x, i) => (
                <RingCard key={x.id || x.name} m={x} i={i} pos={pos} active={i === active} onPick={jump} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Phones / reduced motion: each portrait opens from its centre, then the name assembles.
const Stacked = ({ members }) => (
  <div className="ld-stacked">
    <Reveal as="span" className="st-label">Founders &amp; core leadership</Reveal>
    <MaskText as="h2" className="st-title" lines={[<>The people behind <span className="grad-text">every project</span></>]} />
    <div className="ld-stacked__list">
      {members.map((m, i) => (
        <motion.article key={m.id || m.name} className="ld-item" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <motion.div
            className="ld-item__photo"
            variants={{ hidden: { clipPath: "inset(50% 50% 50% 50% round 24px)" }, show: { clipPath: "inset(0% 0% 0% 0% round 24px)", transition: { duration: 1.1, ease: EASE_IN_OUT } } }}
          >
            <motion.img
              src={m.image || FALLBACK}
              alt={m.name}
              loading="lazy"
              onError={onImgError}
              variants={{ hidden: { scale: 1.35 }, show: { scale: 1, transition: { duration: 1.5, ease: EASE } } }}
            />
            {badgeOf(m) && <span className="ld-badge ld-badge--photo">{badgeOf(m)}</span>}
          </motion.div>
          <motion.div variants={{ hidden: {}, show: { transition: { delayChildren: 0.45 } } }}>
            <span className="ld-count"><b>{pad(i + 1)}</b> / {pad(members.length)}</span>
            <KineticName name={m.name} />
            <motion.p className="ld-role" variants={fadeUp}>{m.role}</motion.p>
            {m.bio && <motion.p className="ld-bio" variants={fadeUp}>{m.bio}</motion.p>}
            <Socials m={m} />
          </motion.div>
        </motion.article>
      ))}
    </div>
  </div>
);

// Leadership: a scroll-driven 3D coverflow. Each founder swings to the front in turn.
const AboutLeadership = () => {
  const { teamMembers } = useCms();
  const desktop = useIsDesktop();
  const reduce = usePrefersReducedMotion();
  if (teamMembers.length === 0) return null;
  const members = [...teamMembers].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section className="ld" id="about" aria-label="Founders and core leadership">
      {desktop && !reduce && members.length > 1 ? <Ring members={members} /> : <Stacked members={members} />}
    </section>
  );
};

export default AboutLeadership;
