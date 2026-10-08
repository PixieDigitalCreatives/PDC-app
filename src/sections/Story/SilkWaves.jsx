import React, { useId, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "../../animations/variants";

const W = 1440;

// One strand of the ribbon at a given "phase" (0 or 1). Animating between the two phases
// makes the silk breathe; each strand has its own duration so they never move in lockstep.
const strand = (i, phase, h, y0, y1) => {
  const o = i * 8;
  const p = phase;
  return `M -60 ${y0 + o} C ${W * 0.18} ${y0 - 90 + o * 1.2 + p * 46}, ${W * 0.32} ${y0 + 80 + o * 0.6 - p * 58}, ${W * 0.5} ${y0 - 40 + o + p * 24} S ${W * 0.8} ${y1 + o * 0.8 - p * 36}, ${W + 60} ${y1 + 50 + o * 1.4 + p * 12}`;
};

const ribbon = (phase, y0, y1) => {
  const p = phase;
  return `M -60 ${y0 - 40} C ${W * 0.18} ${y0 - 130 + p * 40}, ${W * 0.3} ${y0 + 40 - p * 50}, ${W * 0.5} ${y0 - 60 + p * 20} S ${W * 0.8} ${y1 - 40 - p * 30}, ${W + 60} ${y1 + 10} L ${W + 60} ${y1 + 120} C ${W * 0.8} ${y1 + 80 - p * 20}, ${W * 0.66} ${y0 + 40 + p * 30}, ${W * 0.5} ${y0 + 60} S ${W * 0.18} ${y0 + 20 - p * 30}, -60 ${y0 + 100} Z`;
};

/**
 * Flowing silk ribbons in the theme's wave colours (--wave-1..3).
 * - Draws itself in on mount, then breathes (path morph) forever.
 * - Pass `progress` (a MotionValue 0..1) to tie the drawing to scroll instead.
 */
const SilkWaves = ({ lines = 14, height = 820, y0 = 640, y1 = 330, lineOpacity = 0.6, fillOpacity = 0.22, progress, className = "", delay = 0 }) => {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const strands = useMemo(
    () => Array.from({ length: lines }, (_, i) => ({ a: strand(i, 0, height, y0, y1), b: strand(i, 1, height, y0, y1), i })),
    [lines, height, y0, y1]
  );
  const rib = useMemo(() => [ribbon(0, y0, y1), ribbon(1, y0, y1)], [y0, y1]);
  const breathe = (i) => ({ duration: 9 + i * 0.45, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" });

  return (
    <svg className={`silk ${className}`} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" y1="0" x2={W} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: "var(--wave-1)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--wave-2)" }} />
          <stop offset="1" style={{ stopColor: "var(--wave-3)" }} />
        </linearGradient>
      </defs>
      <motion.path
        d={rib[0]}
        fill={`url(#${uid}-g)`}
        initial={{ opacity: 0, d: rib[0] }}
        animate={reduce ? { opacity: fillOpacity } : { opacity: fillOpacity, d: rib }}
        transition={{ opacity: { duration: 1.6, delay, ease: EASE }, d: breathe(2) }}
      />
      {strands.map(({ a, b, i }) => (
        <motion.path
          key={i}
          d={a}
          fill="none"
          stroke={`url(#${uid}-g)`}
          strokeWidth="1.15"
          vectorEffect="non-scaling-stroke"
          strokeOpacity={(lineOpacity * (1 - i / (lines * 1.5))).toFixed(2)}
          style={progress ? { pathLength: progress } : undefined}
          initial={progress ? { d: a } : { pathLength: 0, d: a }}
          animate={progress ? (reduce ? undefined : { d: [a, b] }) : reduce ? { pathLength: 1 } : { pathLength: 1, d: [a, b] }}
          transition={{ pathLength: { duration: 2.4, delay: delay + i * 0.06, ease: EASE }, d: breathe(i) }}
        />
      ))}
    </svg>
  );
};

export default SilkWaves;
