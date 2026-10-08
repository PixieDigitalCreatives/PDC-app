import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../animations/hooks";
import ServiceVisual from "./ServiceVisual";
import "../../styles/serviceart.scss";

// Little stars that twinkle around the object once it has landed
const SPARKS = [
  { x: "16%", y: "24%", s: 1, d: "0s" },
  { x: "80%", y: "18%", s: 0.7, d: "1.1s" },
  { x: "84%", y: "66%", s: 0.9, d: "2.1s" },
];

/**
 * The picture for one service: a glossy 3D object (public/assets/services/<type>.png) that pops in
 * when `live` turns true, then floats over a soft glow and ground shadow.
 * If the file is missing, falls back to the line drawing so a card is never empty.
 *
 * Assets: "3dicons" by realvjy (CC0), gradient style, dynamic angle — https://3dicons.co
 * (see public/assets/services/LICENSE.txt for the file -> icon mapping)
 */
const ServiceArt = ({ type = "web", live = false, className = "" }) => {
  const reduce = usePrefersReducedMotion();
  const [failed, setFailed] = useState(false);

  if (failed) return <ServiceVisual type={type} live={live} className={className} />;

  return (
    <span className={`art ${live ? "is-live" : ""} ${className}`} aria-hidden="true">
      <span className="art__glow" />
      <span className="art__ground" />
      <span className="art__float">
        <motion.img
          className="art__img"
          src={`/assets/services/${type}.png`}
          alt=""
          draggable="false"
          decoding="async"
          onError={() => setFailed(true)}
          initial={reduce ? false : { scale: 0.35, rotate: -22, opacity: 0, y: 46 }}
          animate={live ? { scale: 1, rotate: 0, opacity: 1, y: 0 } : undefined}
          transition={{ type: "spring", stiffness: 150, damping: 13, mass: 0.9 }}
        />
      </span>
      {SPARKS.map((sp, i) => (
        <i key={i} className="art__spark" style={{ "--x": sp.x, "--y": sp.y, "--s": sp.s, "--d": sp.d }} />
      ))}
    </span>
  );
};

export default ServiceArt;
