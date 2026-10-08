import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeIn, fadeUp, staggerChildren, VIEWPORT } from "../../animations/variants";

// Parent that reveals its <StaggerItem>/<TiltCard> children one after another when scrolled into view.
export const Stagger = ({ as = "div", stagger = 0.09, delay = 0, className = "", children, ...rest }) => {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      variants={staggerChildren(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export const StaggerItem = ({ as = "div", className = "", children, ...rest }) => {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.div;
  return (
    <Tag className={className} variants={reduce ? fadeIn : fadeUp} {...rest}>
      {children}
    </Tag>
  );
};

export default Stagger;
