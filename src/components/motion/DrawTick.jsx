import React from "react";
import { motion } from "framer-motion";
import { EASE } from "../../animations/variants";

// A tick that draws itself inside a ring when `on` turns true. Style it with the `.draw-tick` class.
const DrawTick = ({ on, delay = 0 }) => (
  <svg className="draw-tick" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <motion.circle
      cx="10"
      cy="10"
      r="9"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: on ? 1 : 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    />
    <motion.path
      d="M5.6 10.4l3 3 5.8-6.4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: on ? 1 : 0 }}
      transition={{ duration: 0.45, delay: delay + 0.3, ease: EASE }}
    />
  </svg>
);

export default DrawTick;
