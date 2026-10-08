import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_IN_OUT, EASE } from "../animations/variants";
import "../styles/preloader.scss";

const SEEN_KEY = "pdc-preloader-seen";

// Short, typographic preloader (~1.4s). Shown once per session; repeat visits skip it.
const Preloader = ({ onFinish }) => {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const skip = (() => {
    try {
      return sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    if (skip) {
      onFinish();
      return undefined;
    }
    const total = reduce ? 400 : 1100;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / total);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setLeaving(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [skip, reduce, onFinish]);

  if (skip) return null;

  const finish = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage unavailable — fine */
    }
    onFinish();
  };

  return (
    <motion.div
      className="preloader"
      initial={{ y: 0 }}
      animate={leaving ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: reduce ? 0.2 : 0.8, ease: EASE_IN_OUT }}
      onAnimationComplete={() => leaving && finish()}
      role="status"
      aria-label="Loading Pixie Digital Creatives"
    >
      <div className="preloader__inner">
        <span className="preloader__meta">Pixie Digital Creatives</span>
        <div className="preloader__word" aria-hidden="true">
          {["P", "D", "C"].map((ch, i) => (
            <span className="preloader__mask" key={ch}>
              <motion.span
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, ease: EASE, delay: reduce ? 0 : 0.08 * i }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </div>
        <div className="preloader__foot">
          <span className="preloader__count">{String(count).padStart(3, "0")}</span>
          <span className="preloader__rule">
            <span style={{ transform: `scaleX(${count / 100})` }} />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
