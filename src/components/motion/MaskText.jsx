import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { textReveal, VIEWPORT } from "../../animations/variants";
import { useReady } from "../../animations/ReadyContext";

// Typography reveal: each line is clipped by a mask and its content slides up.
// `lines` accepts strings or nodes so accent words (e.g. <em>) stay possible.
const MaskText = ({
  lines,
  as: Tag = "div",
  className = "",
  lineClassName = "",
  delay = 0,
  onReady = false, // true: wait for the preloader instead of the viewport
  ...rest
}) => {
  const reduce = useReducedMotion();
  const ready = useReady();
  const MotionTag = motion[Tag] || motion.div;

  // The trigger sits on the outer element: the inner lines start clipped by their mask, so an
  // IntersectionObserver on them can report "never visible". Lines follow via variant propagation.
  const trigger = onReady
    ? { initial: "hidden", animate: ready ? "show" : "hidden" }
    : { initial: "hidden", whileInView: "show", viewport: VIEWPORT };

  return (
    <MotionTag className={className} variants={{ hidden: {}, show: {} }} {...trigger} {...rest}>
      {lines.map((line, i) => (
        <span
          className={`mask-line ${lineClassName}`}
          key={i}
          style={{ display: "block", overflow: "hidden", paddingBottom: "0.1em", marginBottom: "-0.1em" }}
        >
          <motion.span
            style={{ display: "block", willChange: "transform" }}
            variants={reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : textReveal}
            custom={i + delay}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
};

export default MaskText;
