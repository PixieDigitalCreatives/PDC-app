import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useFinePointer } from "../../animations/hooks";
import { EASE } from "../../animations/variants";

const SPRING = { stiffness: 90, damping: 18, mass: 0.7 };

/**
 * The chrome PDC mark as a living object: tilts in 3D toward the cursor, floats,
 * catches a travelling light sheen (masked to the logo's own shape) and sits on a soft reflection.
 */
const ChromeLogo = ({ ready = true, className = "", style }) => {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, SPRING);
  const sy = useSpring(my, SPRING);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const glowX = useTransform(sx, [-0.5, 0.5], ["-12%", "12%"]);

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
    <motion.div className={`chrome-logo ${className}`} style={style}>
      <motion.span className="chrome-logo__glow" style={{ x: glowX }} aria-hidden="true" />
      <motion.div
        className="chrome-logo__tilt"
        style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
        initial={{ opacity: 0, scale: 0.86, filter: "blur(18px)" }}
        animate={ready ? { opacity: 1, scale: 1, filter: "blur(0px)" } : undefined}
        transition={{ duration: 1.6, ease: EASE, delay: 0.25 }}
      >
        <motion.div
          className="chrome-logo__float"
          animate={reduce ? undefined : { y: [0, -14, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="/brand/secondary-1200.webp" alt="Pixie Digital Creatives" className="chrome-logo__img" draggable="false" />
          <span className="chrome-logo__sheen" aria-hidden="true" />
        </motion.div>
        <img src="/brand/secondary-1200.webp" alt="" className="chrome-logo__reflection" aria-hidden="true" draggable="false" />
      </motion.div>
    </motion.div>
  );
};

export default ChromeLogo;
