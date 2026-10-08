import React, { useEffect, useMemo } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useFinePointer, usePrefersReducedMotion } from "../../animations/hooks";
import { scrollToTarget } from "../../animations/lenis";
import { EASE } from "../../animations/variants";
import CountUp from "../../components/motion/CountUp";
import { SERVICE_ICONS } from "../Story/icons";

// Three concentric rings; every service is a node on one of them (round-robin, so any list length works).
const RINGS = [
  { d: 0.44, dur: 70, reverse: false },
  { d: 0.69, dur: 96, reverse: true },
  { d: 0.94, dur: 124, reverse: false },
];
const TILT = { stiffness: 70, damping: 18, mass: 0.8 };

// The hero's centrepiece: all services orbiting a glowing core. The rings turn slowly and pause
// on hover, the whole disc leans towards the cursor, and each node jumps to its service below.
const ServiceOrbit = ({ services, ready }) => {
  const reduce = usePrefersReducedMotion();
  const fine = useFinePointer();
  const nx = useSpring(0, TILT);
  const ny = useSpring(0, TILT);
  const rotateY = useTransform(nx, (v) => v * 16);
  const rotateX = useTransform(ny, (v) => v * -14);

  useEffect(() => {
    if (!fine || reduce) return undefined;
    const onMove = (e) => {
      nx.set(e.clientX / window.innerWidth - 0.5);
      ny.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine, reduce, nx, ny]);

  const rings = useMemo(() => {
    const lanes = RINGS.map(() => []);
    services.forEach((service, i) => lanes[i % RINGS.length].push({ service, i }));
    return lanes;
  }, [services]);

  return (
    <div className="sv-orbit" role="group" aria-label="All services">
      <motion.div className="sv-orbit__tilt" style={reduce ? undefined : { rotateX, rotateY }}>
        <span className="sv-orbit__halo" aria-hidden="true" />

        <svg className="sv-orbit__lines" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          {RINGS.map((r, k) => (
            <motion.circle
              key={r.d}
              cx="50"
              cy="50"
              r={r.d * 50}
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={ready ? { pathLength: 1, opacity: 1 } : undefined}
              transition={{ duration: 2.2, delay: 0.5 + k * 0.28, ease: EASE }}
            />
          ))}
        </svg>

        <div className="sv-core" aria-hidden="true">
          <span className="sv-core__spin" />
          <span className="sv-core__face">
            <b><CountUp value={String(services.length)} /></b>
            <small>services</small>
          </span>
        </div>

        {rings.map((nodes, k) => {
          const ring = RINGS[k];
          return (
            <div
              key={ring.d}
              className="sv-ring"
              style={{
                "--d": ring.d,
                "--dur": `${ring.dur}s`,
                "--dir": ring.reverse ? "reverse" : "normal",
                "--dir-rev": ring.reverse ? "normal" : "reverse",
              }}
            >
              {nodes.map(({ service, i }, j) => {
                const Icon = SERVICE_ICONS[service.visual] || SERVICE_ICONS.web;
                const angle = (j / nodes.length) * 360 + k * 41 - 90;
                return (
                  <div key={service.id || service.title} className="sv-node" style={{ "--a": `${angle}deg` }}>
                    <div className="sv-node__upright">
                      <div className="sv-node__spin">
                        <motion.button
                          type="button"
                          className="sv-chip"
                          aria-label={`${service.title} — jump to this service`}
                          onClick={() => scrollToTarget(`#service-${i + 1}`, { offset: -90 })}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={ready ? { scale: 1, opacity: 1 } : undefined}
                          transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.9 + i * 0.07 }}
                          whileHover={{ scale: 1.22 }}
                          whileTap={{ scale: 0.94 }}
                        >
                          <Icon />
                          <span className="sv-chip__label">{service.title}</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ServiceOrbit;
