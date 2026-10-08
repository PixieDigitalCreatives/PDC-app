import React, { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate, useReducedMotion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import { useCms } from "../../context/CmsContext";
import { useIsDesktop } from "../../animations/hooks";
import { EASE, EASE_IN_OUT } from "../../animations/variants";
import Magnetic from "../../components/buttons/Magnetic";
import MaskText from "../../components/motion/MaskText";
import Reveal from "../../components/motion/Reveal";
import SilkWaves from "./SilkWaves";

const DEFAULT_TITLE = ["Let's Build Something", <><span className="grad-text">Amazing</span> Together</>];
const DEFAULT_TEXT = "Ready to take your brand to the next level? Let's discuss your project and turn your ideas into reality.";

// Final chapter — the invitation. The band unfolds from a rounded mask; a glow follows the cursor.
// `title` is an array of lines (strings or nodes); `text` and `button` override the default copy.
const CtaBand = ({ title = DEFAULT_TITLE, text = DEFAULT_TEXT, button = "Get a Free Consultation" }) => {
  const ref = useRef(null);
  const { setIsContactModalOpen } = useCms();
  const desktop = useIsDesktop();
  const reduce = useReducedMotion();
  const mx = useMotionValue(70);
  const my = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, var(--cta-glow), transparent 65%)`;
  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <section className="st-cta" id="start" aria-label="Start a project">
      <motion.div
        ref={ref}
        className="st-cta__band"
        onMouseMove={desktop && !reduce ? onMove : undefined}
        initial={reduce ? false : { clipPath: "inset(14% 10% 14% 10% round 48px)", opacity: 0.4 }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0% round 28px)", opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 1.3, ease: EASE_IN_OUT }}
      >
        <div className="st-cta__waves" aria-hidden="true">
          <SilkWaves lines={12} height={360} y0={300} y1={110} lineOpacity={0.7} fillOpacity={0.16} delay={0.4} />
        </div>
        <motion.span className="st-cta__glow" style={{ background: glow }} aria-hidden="true" />

        <MaskText as="h2" className="st-cta__title" lines={title} />
        <Reveal as="p" className="st-cta__text" delay={0.2}>{text}</Reveal>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
        >
          <Magnetic strength={0.3}>
            <button type="button" className="btn-primary st-cta__btn" onClick={() => setIsContactModalOpen(true)}>
              <span>{button}</span>
              <HiArrowRight />
            </button>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CtaBand;
