import React from "react";
import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import { useReady } from "../../animations/ReadyContext";
import { EASE } from "../../animations/variants";
import { KineticLine, KineticWord } from "../../components/motion/KineticText";
import Magnetic from "../../components/buttons/Magnetic";
import { useCurrency } from "../../context/CurrencyContext";
import { categoryFrom } from "../../data/pricing";

// Opening: the promise on the left, a price guide on the right (every service with the lowest
// confirmed price it starts at), each row jumping to its section.
const PricingHero = ({ categories, pricesReady, onQuote, openContact, onJump }) => {
  const ready = useReady();
  const { selectedCountry } = useCurrency();

  const enter = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE, delay },
  });

  return (
    <section className="pc-hero" aria-label="Pricing and plans">
      <div className="pc-hero__bg" aria-hidden="true">
        <span className="pg-glow pg-glow--a" />
        <span className="pg-glow pg-glow--b" />
      </div>

      <div className="pc-hero__inner">
        <div className="pc-hero__copy">

          <h1 className="pc-hero__title" aria-label="Clear pricing, built around you.">
            <KineticLine text="Clear pricing," ready={ready} />
            <KineticWord className="grad-text" delay={0.55} ready={ready}>built around you.</KineticWord>
          </h1>

          <motion.p className="pc-hero__lead" {...enter(0.7)}>
            Starting prices for everything we do, in one place. Every project is scoped with you first, so your final
            quote fits what you actually need.
          </motion.p>

          <motion.div className="pc-hero__ctas" {...enter(0.85)}>
            <Magnetic strength={0.25}>
              <button type="button" className="btn-primary" onClick={() => onQuote()}>
                <span>Request a custom quote</span>
                <HiArrowRight />
              </button>
            </Magnetic>
            <button type="button" className="btn-secondary" onClick={openContact}>
              Discuss your project
            </button>
          </motion.div>

          <motion.p className="pc-hero__note" {...enter(1)}>
            All prices are in Indian Rupees (₹).
            {selectedCountry.countryCode !== "IN" && ` Outside India? Ask us for a quote in ${selectedCountry.currencyCode}.`}
          </motion.p>
        </div>

        <motion.nav className="pc-index" aria-label="Price guide" {...enter(0.6)}>
          <div className="pc-index__head">
            <span>Price guide</span>
            <span>Starting from</span>
          </div>
          <ul aria-busy={!pricesReady}>
            {!pricesReady &&
              [0, 1, 2, 3].map((i) => (
                <li key={i} className="pc-index__ghost" aria-hidden="true">
                  <i />
                </li>
              ))}
            {pricesReady && categories.map((c) => {
              const from = categoryFrom(c);
              return (
                <li key={c.slug}>
                  <button type="button" className="pc-index__row" onClick={() => onJump(c.slug)}>
                    <b>{c.number}</b>
                    <span className="pc-index__title">{c.title}</span>
                    <span className="pc-index__price">{from || "On request"}</span>
                    <HiArrowRight aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      </div>
    </section>
  );
};

export default PricingHero;
