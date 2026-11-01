import React, { useMemo } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

// Cinematic layers for the home hero: stage light behind the logo (slow rays + a one-time anamorphic
// flare as the logo comes into focus) and out-of-focus dust at three depths that drifts and follows
// the cursor. Decorative only (aria-hidden, no pointer events); CSS in story.scss (.st-stage, .st-dust).

// Stage light: lives inside .st-hero__visual so it follows the logo's layout and scroll movement.
export const StageLight = ({ ready, reduce }) => (
  <div className="st-stage" aria-hidden="true">
    <motion.span
      className="st-stage__rays"
      initial={{ opacity: 0, scale: 0.82 }}
      animate={ready ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
    />
    {!reduce && (
      <motion.span
        className="st-stage__flare"
        initial={{ opacity: 0, scaleX: 0.2, x: "-38%" }}
        animate={ready ? { opacity: [0, 1, 0.85, 0], scaleX: [0.2, 1, 1, 0.5], x: ["-38%", "-6%", "8%", "38%"] } : undefined}
        transition={{ duration: 2.1, ease: "easeInOut", times: [0, 0.35, 0.7, 1], delay: 0.35 }}
      />
    )}
  </div>
);

// Deterministic "random" numbers, so the specks sit in the same place on every visit.
const rand = (seed) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// depth: how far the layer moves with the cursor (px); size in px; blur in px.
const LAYERS = {
  back: { desktop: 12, mobile: 6, size: [2, 4], blur: 1, depth: 8, opacity: [0.25, 0.55] },
  mid: { desktop: 8, mobile: 4, size: [3, 6], blur: 2.5, depth: 18, opacity: [0.2, 0.45] },
  front: { desktop: 5, mobile: 0, size: [7, 13], blur: 5, depth: 34, opacity: [0.12, 0.28] },
};

const DustLayer = ({ name, mx, my, desktop, reduce, ready }) => {
  const cfg = LAYERS[name];
  const count = desktop ? cfg.desktop : cfg.mobile;
  const specks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const s = i * 7 + name.length * 31;
        const lerp = ([a, b], t) => a + (b - a) * t;
        return {
          left: `${(rand(s) * 100).toFixed(2)}%`,
          top: `${(8 + rand(s + 1) * 84).toFixed(2)}%`,
          size: lerp(cfg.size, rand(s + 2)),
          opacity: lerp(cfg.opacity, rand(s + 3)),
          dur: `${(9 + rand(s + 4) * 10).toFixed(1)}s`,
          delay: `${(-rand(s + 5) * 14).toFixed(1)}s`,
        };
      }),
    [count, name, cfg]
  );
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });
  const x = useTransform(sx, [0, 100], [cfg.depth, -cfg.depth]);
  const y = useTransform(sy, [0, 100], [cfg.depth * 0.6, -cfg.depth * 0.6]);

  if (!count) return null;
  return (
    <motion.div
      className={`st-dust st-dust--${name}`}
      style={reduce ? undefined : { x, y }}
      initial={{ opacity: 0 }}
      animate={ready ? { opacity: 1 } : undefined}
      transition={{ duration: 2.4, delay: 1.1 }}
      aria-hidden="true"
    >
      {specks.map((p, i) => (
        <span
          key={i}
          className="st-dust__speck"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            filter: `blur(${cfg.blur}px)`,
            "--dur": p.dur,
            "--delay": p.delay,
          }}
        />
      ))}
    </motion.div>
  );
};

// Back and mid layers sit behind the copy; the front layer floats over the logo side only.
export const Dust = ({ front = false, ...props }) =>
  front ? (
    <DustLayer name="front" {...props} />
  ) : (
    <>
      <DustLayer name="back" {...props} />
      <DustLayer name="mid" {...props} />
    </>
  );
