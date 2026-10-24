import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const PILL_SPRING = { type: "spring", stiffness: 420, damping: 36 };

// Floating tab bar that follows the reader down the page: one tab per service, the current one
// lit (one IntersectionObserver), plus a shortcut to the custom quote.
const PricingNav = ({ categories, onJump, onQuote }) => {
  const [active, setActive] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.dataset.slug, e.isIntersecting));
        const current = categories.find((c) => seen.get(c.slug));
        setActive(current ? current.slug : null);
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    document.querySelectorAll("[data-pricing-section]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [categories]);

  // Keep the lit tab in view when the bar scrolls sideways (phones).
  useEffect(() => {
    const list = listRef.current;
    const tab = list?.querySelector(".is-on");
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  return (
    <nav className="pc-nav" aria-label="Pricing sections">
      <ul ref={listRef}>
        {categories.map((c) => (
          <li key={c.slug}>
            <a
              href={`#price-${c.slug}`}
              className={active === c.slug ? "is-on" : ""}
              aria-current={active === c.slug ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                onJump(c.slug);
              }}
            >
              {active === c.slug && <motion.i layoutId="pc-nav-pill" className="pc-nav__pill" transition={PILL_SPRING} />}
              <span>{c.kicker}</span>
            </a>
          </li>
        ))}
        <li>
          <a
            href="#proposal"
            className="pc-nav__quote"
            onClick={(e) => {
              e.preventDefault();
              onQuote();
            }}
          >
            <span>Custom quote</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default PricingNav;
