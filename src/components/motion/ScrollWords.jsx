import React from "react";
import { motion, useTransform } from "framer-motion";

const Word = ({ progress, start, end, accent, children }) => {
  const opacity = useTransform(progress, [start, end], [0.14, 1]);
  return (
    <motion.span className={accent ? "grad-text" : undefined} style={{ opacity, display: "inline-block", willChange: "opacity" }}>
      {children}
    </motion.span>
  );
};

const clean = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

// Words light up one by one as a scroll progress value moves through `range`.
// Opacity only — cheap, and readable at every point of the scroll.
// `accent` is a list of words that also get the gradient text treatment.
const ScrollWords = ({ text, progress, range = [0, 1], accent = [], className = "", as: Tag = "p" }) => {
  const words = text.split(" ");
  const accents = new Set(accent.map(clean));
  const [a, b] = range;
  const step = (b - a) / words.length;
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <Word progress={progress} start={a + i * step} end={a + (i + 1) * step * 1.6} accent={accents.has(clean(w))}>
            {w}
          </Word>
          {i < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </Tag>
  );
};

export default ScrollWords;
