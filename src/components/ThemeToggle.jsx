import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { useTheme } from "../context/ThemeContext";
import "../styles/themetoggle.scss";

const SPRING = { type: "spring", stiffness: 520, damping: 34 };

// Dark / light switch. The thumb slides with a spring; the icon inside it rotates out and in.
const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const light = theme === "light";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      className={`theme-toggle ${light ? "is-light" : "is-dark"} ${className}`}
      onClick={toggleTheme}
      data-cursor={light ? "Dark" : "Light"}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <HiOutlineMoon className="theme-toggle__ghost theme-toggle__ghost--moon" />
        <HiOutlineSun className="theme-toggle__ghost theme-toggle__ghost--sun" />
      </span>
      <motion.span className="theme-toggle__thumb" layout transition={SPRING} aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            className="theme-toggle__icon"
            initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            {light ? <HiOutlineSun /> : <HiOutlineMoon />}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );
};

export default ThemeToggle;
