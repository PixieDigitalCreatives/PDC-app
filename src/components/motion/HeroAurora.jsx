import React, { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useFinePointer } from "../../animations/hooks";

const SPRING = { stiffness: 60, damping: 20, mass: 0.8 };

// Decorative backdrop for inner-page heroes: an optional (Gemini) image that drifts with scroll,
// two blurred light orbs that lean towards the cursor, and a faint grid. Place it as the first
// child of a `.has-aurora` section.
const HeroAurora = ({ image = null }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const mx = useSpring(0, SPRING);
  const my = useSpring(0, SPRING);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "22%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, reduce ? 1.08 : 1.18]);
  const fade = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  const aX = useTransform(mx, (v) => v * 60);
  const aY = useTransform(my, (v) => v * 40);
  const bX = useTransform(mx, (v) => v * -80);
  const bY = useTransform(my, (v) => v * -50);

  useEffect(() => {
    if (!fine || reduce) return undefined;
    const onMove = (e) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine, reduce, mx, my]);

  return (
    <div ref={ref} className="aurora" aria-hidden="true">
      {image && (
        <motion.img
          className="aurora__img"
          src={image}
          alt=""
          decoding="async"
          style={{ y: imgY, scale: imgScale, opacity: fade }}
        />
      )}
      <motion.span className="aurora__orb aurora__orb--a" style={{ x: aX, y: aY }}>
        <i />
      </motion.span>
      <motion.span className="aurora__orb aurora__orb--b" style={{ x: bX, y: bY }}>
        <i />
      </motion.span>
      <span className="aurora__grid" />
      <span className="aurora__fade" />
    </div>
  );
};

export default HeroAurora;
