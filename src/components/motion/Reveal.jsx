import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, fadeIn, VIEWPORT } from "../../animations/variants";

const Reveal = ({ as = "div", children, delay = 0, simple = false, className = "", ...rest }) => {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.div;
  const base = reduce || simple ? fadeIn : fadeUp;
  // The variant's own transition wins over a `transition` prop, so the delay goes into the variant.
  const variants = delay ? { ...base, show: { ...base.show, transition: { ...base.show.transition, delay } } } : base;
  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
