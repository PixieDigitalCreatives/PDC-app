import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { imageReveal, VIEWPORT } from "../../animations/variants";
import { useIsDesktop } from "../../animations/hooks";

// Image plate: clip-path reveal on entry, subtle scroll parallax inside the frame,
// tonal (grayscale -> colour) treatment via CSS. Transform / clip-path / filter only.
const ParallaxImage = ({
  src,
  alt = "",
  className = "",
  strength = 9, // % of travel
  fallback = "/portfolio.jpg",
  position = "center",
  tonal = true,
  priority = false,
  ...rest
}) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const range = reduce || !desktop ? 0 : strength;
  const y = useTransform(scrollYProgress, [0, 1], [`-${range}%`, `${range}%`]);

  return (
    <motion.div
      ref={ref}
      className={`px-image ${tonal ? "is-tonal" : ""} ${className}`}
      variants={reduce ? undefined : imageReveal}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={VIEWPORT}
      style={{ overflow: "hidden", position: "relative" }}
      {...rest}
    >
      <motion.img
        src={src || fallback}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={(e) => {
          if (!e.target.dataset.fb) {
            e.target.dataset.fb = "1";
            e.target.src = fallback;
          }
        }}
        style={{
          y,
          width: "100%",
          height: `${100 + range * 2}%`,
          marginTop: `-${range}%`,
          objectFit: "cover",
          objectPosition: position,
          willChange: "transform",
        }}
      />
    </motion.div>
  );
};

export default ParallaxImage;
