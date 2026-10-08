import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import { useCms } from "../context/CmsContext";
import { useCurrency } from "../context/CurrencyContext";
import { HiArrowRight, HiOutlineArrowUpRight, HiOutlineChevronDown } from "react-icons/hi2";
import { FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import Magnetic from "./buttons/Magnetic";
import ThemeToggle from "./ThemeToggle";
import { lockScroll, unlockScroll } from "../animations/lenis";
import { EASE, EASE_IN_OUT } from "../animations/variants";
import "../styles/navbar.scss";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "About", path: "/about" },
  { name: "Process", path: "/process" },
  { name: "Contact", path: "/contact" },
];

const homeSections = [
  { id: "hero", label: "Intro" },
  { id: "journey", label: "Our story" },
  { id: "services", label: "Services" },
  { id: "work", label: "Recent work" },
  { id: "about", label: "Team" },
  { id: "start", label: "Start a project" },
];

// Which home section is currently in view (single IntersectionObserver, no scroll listeners).
const useActiveSection = (enabled) => {
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (!enabled) return undefined;
    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        let best = null;
        let ratio = 0;
        seen.forEach((r, id) => {
          if (r > ratio) {
            ratio = r;
            best = id;
          }
        });
        if (best) setActive(best);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.1, 0.5, 1] }
    );
    homeSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [enabled]);
  return active;
};

const PILL_SPRING = { type: "spring", stiffness: 420, damping: 36 };

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [hoverPath, setHoverPath] = useState(null);
  const dropdownRef = useRef(null);

  const { setIsContactModalOpen, companyInfo } = useCms();
  const { selectedCountry, countries, setSelectedCountry } = useCurrency();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const activeSection = useActiveSection(isHome);
  const activeLabel = homeSections.find((s) => s.id === activeSection)?.label;

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  // State only flips at thresholds, so React does not re-render per scroll tick.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    if (y < 120) setHidden(false);
    else if (y > prev + 4) setHidden(true);
    else if (y < prev - 4) setHidden(false);
  });

  useEffect(() => {
    if (open) lockScroll();
    else unlockScroll();
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      unlockScroll();
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setCountryDropdownOpen(false);
      }
    };
    const onDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setCountryDropdownOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  const email = companyInfo?.email || "info@pixiedigitalcreatives.com";

  return (
    <>
      <motion.header
        className={`navbar-wrapper ${scrolled ? "scrolled" : ""} ${open ? "menu-open" : ""}`}
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/" className="logo-link" aria-label="Pixie Digital Creatives — home">
              <span className="logo-stack">
                <img src="/brand/primary-480.png" alt="Pixie Digital Creatives" className="logo-img logo-img--primary" />
                <img src="/brand/secondary-400.png" alt="" aria-hidden="true" className="logo-img logo-img--secondary" />
              </span>
            </Link>
          </div>

          <nav className="navbar-center" aria-label="Primary">
            {/* The pill follows the hovered link and settles back on the current page. */}
            <ul className="nav-list" onMouseLeave={() => setHoverPath(null)}>
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                const pillHere = (hoverPath ?? location.pathname) === link.path;
                return (
                  <li key={link.path} className="nav-item">
                    <Link
                      to={link.path}
                      className={`nav-link ${active ? "active" : ""}`}
                      aria-current={active ? "page" : undefined}
                      onMouseEnter={() => setHoverPath(link.path)}
                      onFocus={() => setHoverPath(link.path)}
                    >
                      {pillHere && <motion.span layoutId="nav-pill" className="nav-pill" transition={PILL_SPRING} />}
                      <span className="nav-link__text">{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="navbar-right">
            <div className="currency-selector-wrap" ref={dropdownRef}>
              <button
                className="currency-toggle-btn"
                onClick={() => setCountryDropdownOpen((v) => !v)}
                aria-label="Select country"
                aria-expanded={countryDropdownOpen}
              >
                <span className="country-code-pill">{selectedCountry.countryCode}</span>
                <span className="currency-code-text">{selectedCountry.currencyCode}</span>
                <HiOutlineChevronDown className={`chevron-icon ${countryDropdownOpen ? "open" : ""}`} />
              </button>

              <AnimatePresence>
                {countryDropdownOpen && (
                  <motion.div
                    className="currency-dropdown-menu"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    <div className="dropdown-header-lbl">Select your country</div>
                    {countries.map((c) => (
                      <button
                        key={c.countryCode}
                        className={`currency-option-item ${selectedCountry.countryCode === c.countryCode ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedCountry(c);
                          setCountryDropdownOpen(false);
                        }}
                      >
                        <span className="country-code-badge">{c.countryCode}</span>
                        <span className="name">{c.countryName}</span>
                        <span className="symbol">{c.currencyCode} ({c.symbol})</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ThemeToggle className="navbar-theme" />

            <Magnetic strength={0.2}>
              <button onClick={() => setIsContactModalOpen(true)} className="navbar-cta-btn">
                <span>Let&apos;s Talk</span>
                <HiArrowRight className="arrow-icon" />
              </button>
            </Magnetic>

            <button
              className={`hamburger-btn ${open ? "is-open" : ""}`}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
            >
              <span className="line" />
              <span className="line" />
            </button>
          </div>
        </div>

        <motion.span className="nav-progress" style={{ scaleX: progress }} aria-hidden="true" />
      </motion.header>

      {/* MOBILE: fullscreen cinematic menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            data-lenis-prevent
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE_IN_OUT }}
          >
            <div className="mobile-menu__top">
              <span className="mobile-menu__label">Menu</span>
              <ThemeToggle />
            </div>

            <nav className="mobile-menu__links" aria-label="Mobile">
              {navLinks.map((link, idx) => (
                <div className="mobile-menu__mask" key={link.path}>
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.25 + idx * 0.06 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setOpen(false)}
                      className={`mobile-menu__link ${location.pathname === link.path ? "active" : ""}`}
                    >
                      <span className="num">0{idx + 1}</span>
                      <span className="txt">{link.name}</span>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>

            <motion.div
              className="mobile-menu__foot"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
            >
              <div className="mobile-menu__pills" role="group" aria-label="Country">
                {countries.map((c) => (
                  <button
                    key={c.countryCode}
                    className={`pill ${selectedCountry.countryCode === c.countryCode ? "active" : ""}`}
                    onClick={() => setSelectedCountry(c)}
                  >
                    {c.countryCode} · {c.currencyCode}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  setIsContactModalOpen(true);
                }}
                className="btn-primary mobile-menu__cta"
              >
                <span>Let&apos;s talk</span>
                <HiOutlineArrowUpRight />
              </button>

              <div className="mobile-menu__contact">
                <a href={`mailto:${email}`}>{email}</a>
                <div className="socials">
                  <a href={companyInfo?.socials?.instagram || "https://www.instagram.com/pixiedigitalcreatives/"} target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
                  <a href={companyInfo?.socials?.linkedin || "https://www.linkedin.com/company/pixiedigitalcreatives"} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
                  <a href={companyInfo?.socials?.twitter || "https://x.com/pixiedigital"} target="_blank" rel="noreferrer" aria-label="X"><FaXTwitter /></a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
