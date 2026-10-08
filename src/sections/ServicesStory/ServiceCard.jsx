import React, { useEffect, useLayoutEffect, useRef } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import { EASE, fadeIn, VIEWPORT } from "../../animations/variants";
import MaskText from "../../components/motion/MaskText";
import Reveal from "../../components/motion/Reveal";
import TiltCard from "../../components/motion/TiltCard";
import DrawTick from "../../components/motion/DrawTick";
import ParallaxImage from "../../components/media/ParallaxImage";
import ServiceArt from "../../components/media/ServiceArt";
import { genImage } from "../../data/images";
import { SERVICE_ICONS } from "../Story/icons";
import { pad } from "./data";

// Phones / tablets: the card rises into place when it enters the viewport.
const riseIn = {
  hidden: { opacity: 0, y: 64, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: EASE } },
};

/**
 * One service as a big split card.
 * mode "scroll" (desktop): the card is driven by its own scroll progress — it tips up out of the page, settles flat,
 * then recedes — while the line-art, the giant numeral and a rail inside it drift at different speeds.
 * The card closest to the middle of the screen is "active": a spinning gradient edge lights it up.
 */
const ServiceCard = ({ service, n, total, flip, mode, onActive, openContact }) => {
  const scrollFx = mode === "scroll";
  const cellRef = useRef(null);
  const tileRef = useRef(null);
  const Icon = SERVICE_ICONS[service.visual] || SERVICE_ICONS.web;
  const image = genImage(`service-${service.visual}`);
  const approaches = Array.isArray(service.approaches) ? service.approaches : [];
  const points = Array.isArray(service.points) ? service.points : [];

  const seen = useInView(cellRef, { once: true, margin: "0px 0px -22% 0px" });
  const inBand = useInView(cellRef, { margin: "-42% 0px -42% 0px" });
  useEffect(() => {
    if (inBand) onActive?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inBand]);

  // Outline icons draw their own strokes (paths are normalised to length 1, see the stylesheet).
  useLayoutEffect(() => {
    tileRef.current?.querySelectorAll("path").forEach((el) => el.setAttribute("pathLength", "1"));
  }, []);

  const { scrollYProgress } = useScroll({ target: cellRef, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4, restDelta: 0.0005 });
  const y = useTransform(p, [0, 0.3, 0.72, 1], [160, 0, 0, -70]);
  const rotateX = useTransform(p, [0, 0.3], [20, 0]);
  const scale = useTransform(p, [0, 0.3, 0.72, 1], [0.86, 1, 1, 0.93]);
  const opacity = useTransform(p, [0, 0.2, 0.8, 1], [0, 1, 1, 0.35]);
  const artY = useTransform(p, [0, 1], [56, -56]);
  const artRotate = useTransform(p, [0, 1], [-6, 6]);
  const numX = useTransform(p, [0, 1], [-36, 36]);
  const rail = useTransform(p, [0.14, 0.72], [0, 1]);

  const cardMotion = scrollFx
    ? { style: { y, rotateX, scale, opacity, transformPerspective: 1500, transformOrigin: "50% 100%" } }
    : { variants: mode === "rise" ? riseIn : fadeIn, initial: "hidden", whileInView: "show", viewport: VIEWPORT };

  return (
    <li className="sv-cell" id={`service-${n + 1}`} ref={cellRef}>
      <TiltCard
        as="article"
        tilt={0}
        className={`sv-card sv-tone-${n % 6} ${flip ? "is-flipped" : ""} ${inBand ? "is-active" : ""} ${seen ? "is-seen" : ""}`}
        aria-labelledby={`service-title-${n + 1}`}
        {...cardMotion}
      >
        {scrollFx && <motion.span className="sv-card__rail" style={{ scaleY: rail }} aria-hidden="true" />}

        <div className="sv-stage">
          <span className="sv-stage__glow" aria-hidden="true" />
          <span className="sv-stage__grid" aria-hidden="true" />
          <motion.span className="sv-stage__num" style={scrollFx ? { x: numX } : undefined} aria-hidden="true">
            {pad(n + 1)}
          </motion.span>
          <motion.div className={`sv-stage__art ${image ? "sv-stage__art--image" : ""}`} style={scrollFx ? { y: artY, rotate: artRotate } : undefined}>
            {image ? (
              <ParallaxImage src={image} alt={service.title} className="sv-stage__img" tonal={false} strength={7} />
            ) : (
              <ServiceArt type={service.visual || "web"} live={seen} />
            )}
          </motion.div>
          {service.category && <span className="sv-stage__cat">{service.category}</span>}
          <i className="sv-corner sv-corner--tl" aria-hidden="true" />
          <i className="sv-corner sv-corner--br" aria-hidden="true" />
        </div>

        <div className="sv-body">
          <div className="sv-body__top">
            <span className="sv-tile" ref={tileRef}><Icon /></span>
            <span className="sv-count"><b>{pad(n + 1)}</b> / {pad(total)}</span>
          </div>

          <MaskText as="h3" id={`service-title-${n + 1}`} className="sv-title" lines={[service.title]} />
          <Reveal as="p" className="sv-desc" delay={0.12}>{service.description}</Reveal>

          {approaches.length > 0 && (
            <ul className="sv-pills" aria-label="Approaches">
              {approaches.map((a, i) => (
                <motion.li
                  key={a}
                  initial={{ opacity: 0, scale: 0.7, y: 10 }}
                  animate={seen ? { opacity: 1, scale: 1, y: 0 } : undefined}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.35 + i * 0.09 }}
                >
                  {a}
                </motion.li>
              ))}
            </ul>
          )}

          {points.length > 0 && (
            <div className="sv-included">
              <h4 className="sv-included__head">What&apos;s included</h4>
              <ul>
                {points.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -18 }}
                    animate={seen ? { opacity: 1, x: 0 } : undefined}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.3 + i * 0.1 }}
                  >
                    <DrawTick on={seen} delay={0.4 + i * 0.1} />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          <div className="sv-body__foot">
            <button type="button" className="btn-primary" onClick={openContact} data-cursor="Talk">
              <span>Discuss this service</span>
              <HiArrowRight />
            </button>
          </div>
        </div>
      </TiltCard>
    </li>
  );
};

export default ServiceCard;
