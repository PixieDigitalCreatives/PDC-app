import React from "react";
import { motion } from "framer-motion";
import { EASE } from "../../animations/variants";
import { usePrefersReducedMotion } from "../../animations/hooks";

const LETTER = {
  hidden: { y: "118%", rotate: 10 },
  show: (i) => ({ y: "0%", rotate: 0, transition: { duration: 0.95, ease: EASE, delay: i * 0.03 } }),
};

// A headline line whose letters rise out of a mask one after another. Words stay unbreakable.
// `from` offsets the stagger so consecutive lines chain; `ready` gates the start (preloader).
// The line is aria-hidden: give the heading an aria-label with the full text.
export const KineticLine = ({ text, from = 0, ready = true, className = "" }) => {
  const reduce = usePrefersReducedMotion();
  let k = from;
  return (
    <span className={`kin__line ${className}`} aria-hidden="true">
      {text.split(" ").map((word, w) => (
        <React.Fragment key={w}>
          {w > 0 && " "}
          <span className="kin__word">
            {[...word].map((ch) => (
              <span className="kin__mask" key={k}>
                <motion.span
                  className="kin__ch"
                  variants={LETTER}
                  custom={k++}
                  initial={reduce ? false : "hidden"}
                  animate={ready ? "show" : "hidden"}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
          </span>
        </React.Fragment>
      ))}
    </span>
  );
};

// A whole word or phrase sliding up in one mask. Use it for gradient text: per-letter transforms
// would break `background-clip: text`. Pass the gradient class (e.g. "grad-text") as className.
export const KineticWord = ({ children, ready = true, delay = 0, className = "" }) => {
  const reduce = usePrefersReducedMotion();
  return (
    <span className="kin__line" aria-hidden="true">
      <span className="kin__mask kin__mask--word">
        <motion.span
          className={`kin__ch ${className}`}
          initial={reduce ? false : { y: "118%", rotate: 6 }}
          animate={ready ? { y: "0%", rotate: 0 } : undefined}
          transition={{ duration: 1.1, ease: EASE, delay }}
        >
          {children}
        </motion.span>
      </span>
    </span>
  );
};
