import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer, usePrefersReducedMotion } from "../../animations/hooks";
import "../../styles/cursor.scss";

// Subtle ring that follows the pointer. Elements opt in to a label with data-cursor="View".
// Fine pointers only; never rendered on touch or for reduced-motion users.
const Cursor = () => {
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 36, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 420, damping: 36, mass: 0.35 });
  const [mode, setMode] = useState({ kind: "idle", label: "" });
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!fine || reduce) return undefined;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
    };
    const over = (e) => {
      const labelEl = e.target.closest?.("[data-cursor]");
      if (labelEl) return setMode({ kind: "label", label: labelEl.dataset.cursor });
      if (e.target.closest?.("a, button, [role='button'], input, select, textarea, label"))
        return setMode({ kind: "link", label: "" });
      return setMode((m) => (m.kind === "idle" ? m : { kind: "idle", label: "" }));
    };
    const leave = () => setHidden(true);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [fine, reduce, x, y]);

  if (!fine || reduce) return null;

  return (
    <motion.div
      className={`pdc-cursor is-${mode.kind} ${hidden ? "is-hidden" : ""}`}
      style={{ x: sx, y: sy }}
      aria-hidden="true"
    >
      <span className="pdc-cursor__ring" />
      <span className="pdc-cursor__label">{mode.label}</span>
    </motion.div>
  );
};

export default Cursor;
