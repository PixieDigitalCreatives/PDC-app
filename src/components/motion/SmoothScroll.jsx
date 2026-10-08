import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { startLenis, stopLenis } from "../../animations/lenis";
import { usePrefersReducedMotion } from "../../animations/hooks";

// Mounts Lenis once. Skipped entirely for reduced-motion users (native scroll).
const SmoothScroll = () => {
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce) return undefined;
    startLenis();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      stopLenis();
    };
  }, [reduce]);

  return null;
};

export default SmoothScroll;
