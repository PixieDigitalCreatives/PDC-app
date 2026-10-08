import React, { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { EASE } from "../../animations/variants";

// Counts the numeric part of a value like "10+", "95%" or "₹4.5L" up from zero when it scrolls into view.
// Non-numeric values are rendered as-is.
const CountUp = ({ value, className = "", duration = 1.8 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const text = String(value ?? "");
  const match = text.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);

  useEffect(() => {
    if (!match || !inView || reduce || !ref.current) return undefined;
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num.replace(",", "."));
    const decimals = num.includes(".") || num.includes(",") ? num.split(/[.,]/)[1].length : 0;
    const node = ref.current;
    const controls = animate(0, target, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        node.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, text]);

  return (
    <span ref={ref} className={className}>
      {match && !reduce && !inView ? `${match[1]}0${match[3]}` : text}
    </span>
  );
};

export default CountUp;
