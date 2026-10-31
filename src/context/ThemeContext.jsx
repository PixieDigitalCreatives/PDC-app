import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";

const ThemeContext = createContext(null);
// v3: dark (plum) became the default; the theme is saved on every visit, so older saved values are ignored.
const STORAGE_KEY = "pdc-theme-v3";
const META = { dark: "#230220", light: "#faf4ee" };

// index.html already set data-theme before first paint; start from that.
const initialTheme = () => {
  const t = typeof document !== "undefined" ? document.documentElement.getAttribute("data-theme") : null;
  return t === "light" ? "light" : "dark";
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", META[theme]);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable: the theme still applies for this visit */
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Toggle with a circular reveal that grows from the point the user clicked.
  // Falls back to an instant swap where View Transitions or motion are unavailable.
  const toggleTheme = useCallback((event) => {
    const next = theme === "dark" ? "light" : "dark";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const swap = () => {
      flushSync(() => setTheme(next));
      applyTheme(next);
    };
    if (!document.startViewTransition || reduce) {
      swap();
      return;
    }
    const x = event?.clientX ?? window.innerWidth - 80;
    const y = event?.clientY ?? 40;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(swap);
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 750, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" }
        );
      })
      .catch(() => {});
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};

// Logo files per theme: a plum version for the light theme, the cream logo as supplied for the dark one.
const LOGOS = {
  light: {
    lockup: "/brand/primary-480.png",
    mark: "/brand/secondary-400.png",
    hero: "/brand/secondary-1200.webp",
    ring: "/brand/mark-256.png",
  },
  dark: {
    lockup: "/brand/primary-480-dark.png",
    mark: "/brand/secondary-400-dark.png",
    hero: "/brand/secondary-1200-dark.webp",
    ring: "/brand/mark-256-dark.png",
  },
};
export const useLogos = () => LOGOS[useTheme().theme];
