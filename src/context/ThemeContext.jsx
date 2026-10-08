import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";

const ThemeContext = createContext(null);
const STORAGE_KEY = "pdc-theme";
const META = { dark: "#0b0711", light: "#fffbfc" };

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
