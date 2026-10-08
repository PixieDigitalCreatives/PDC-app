import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "../../animations/hooks";

// Thin gradient bar across the top of the viewport that fills as the page is read.
const ScrollProgress = () => {
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 32, restDelta: 0.001 });
  if (reduce) return null;
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
};

export default ScrollProgress;
