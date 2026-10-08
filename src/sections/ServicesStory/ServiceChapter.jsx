import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { scrollToTarget } from "../../animations/lenis";
import ServiceCard from "./ServiceCard";
import { pad } from "./data";

const SPRING = { type: "spring", stiffness: 140, damping: 26 };

// One category of services. A giant word sweeps across as its banner scrolls by (outline first, then
// a gradient fill wiped in from the left); beneath it, a sticky index follows the cards on the right.
const ServiceChapter = ({ group, chapters, totalServices, mode, desktop, openContact }) => {
  const bannerRef = useRef(null);
  const [active, setActive] = useState(0);
  const scroll = mode === "scroll";
  const count = group.items.length;

  const { scrollYProgress: ap } = useScroll({ target: bannerRef, offset: ["start end", "end start"] });
  const wordX = useTransform(ap, [0, 1], ["9%", "-9%"]);
  const wipe = useTransform(ap, [0.14, 0.58], [100, 0]);
  const clip = useMotionTemplate`inset(0 ${wipe}% 0 0)`;
  const noteY = useTransform(ap, [0, 1], [40, -40]);

  const jump = (n) => scrollToTarget(`#service-${n + 1}`, { offset: -90 });

  return (
    <section className="sv-chapter" id={`chapter-${group.slug}`} aria-label={`${group.key} services`}>
      <div className="sv-banner" ref={bannerRef}>
        <div className="sv-banner__inner">
          <div className="sv-banner__meta">
            <span className="sv-meta">Chapter {pad(group.index + 1)} / {pad(chapters)}</span>
            <span className="sv-meta sv-meta--dim">{pad(count)} {count === 1 ? "service" : "services"}</span>
          </div>

          <motion.h2 className="sv-banner__word" style={scroll ? { x: wordX } : undefined}>
            <span className="sv-banner__stroke" aria-hidden="true">{group.key}</span>
            <motion.span className="sv-banner__fill" style={scroll ? { clipPath: clip } : undefined} aria-hidden="true">
              {group.key}
            </motion.span>
            <span className="sv-sr">{group.key}</span>
          </motion.h2>

          {group.blurb && (
            <motion.p className="sv-banner__note" style={scroll ? { y: noteY } : undefined}>
              {group.blurb}
            </motion.p>
          )}
        </div>
      </div>

      <div className="sv-chapter__body">
        <aside className="sv-side" aria-label={`${group.key} index`}>
          <div className="sv-side__inner">
            {desktop && (
              <nav className="sv-index">
                <span className="sv-index__track" aria-hidden="true">
                  <motion.i
                    initial={false}
                    animate={{ scaleY: count > 1 ? active / (count - 1) : 1 }}
                    transition={SPRING}
                  />
                </span>
                <ol>
                  {group.items.map(({ service, n }, j) => (
                    <li key={service.id || service.title}>
                      <button
                        type="button"
                        className={`sv-index__row ${j <= active ? "is-on" : ""} ${j === active ? "is-active" : ""}`}
                        onClick={() => jump(n)}
                        aria-current={j === active ? "true" : undefined}
                      >
                        <i />
                        <span className="sv-index__n">{pad(n + 1)}</span>
                        <span className="sv-index__t">{service.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <span className="sv-side__count" aria-hidden="true">
              <b>{pad(active + 1)}</b> / {pad(count)}
            </span>
          </div>
        </aside>

        <ol className="sv-cards">
          {group.items.map(({ service, n }, j) => (
            <ServiceCard
              key={service.id || service.title}
              service={service}
              n={n}
              total={totalServices}
              flip={n % 2 === 1}
              mode={mode}
              onActive={() => setActive(j)}
              openContact={openContact}
            />
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ServiceChapter;
