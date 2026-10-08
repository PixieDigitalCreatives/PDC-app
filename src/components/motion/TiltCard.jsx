import React, { useRef } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import { fadeIn, fadeUp } from "../../animations/variants";
import { useFinePointer } from "../../animations/hooks";

const SPRING = { stiffness: 160, damping: 18, mass: 0.6 };

// Card with a cursor-following spotlight and a gentle 3D tilt (fine pointers only).
// Carries fadeUp variants, so inside a <Stagger> it also reveals in sequence.
// `tilt={0}` keeps the spotlight but disables the tilt (for large blocks).
const TiltCard = ({ as = "div", tilt = 6, className = "", children, ...rest }) => {
  const ref = useRef(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const rx = useSpring(0, SPRING);
  const ry = useSpring(0, SPRING);
  const Tag = motion[as] || motion.div;
  const interactive = fine && !reduce;

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    if (tilt) {
      ry.set((x - 0.5) * tilt * 2);
      rx.set(-(y - 0.5) * tilt * 2);
    }
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <Tag
      ref={ref}
      className={`tilt-card ${className}`}
      variants={reduce ? fadeIn : fadeUp}
      style={interactive && tilt ? { rotateX: rx, rotateY: ry, transformPerspective: 1000 } : undefined}
      onMouseMove={interactive ? onMove : undefined}
      onMouseLeave={interactive ? onLeave : undefined}
      {...rest}
    >
      {children}
      <span className="tilt-card__glare" aria-hidden="true" />
    </Tag>
  );
};

export default TiltCard;
