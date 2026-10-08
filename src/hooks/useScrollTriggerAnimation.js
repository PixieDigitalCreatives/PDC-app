import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Sub-page reveals now live in the framer-motion kit (components/motion/*).
// This only re-measures ScrollTrigger (used by Lenis) once a newly displayed route has laid out.
export const useScrollTriggerAnimation = (pathKey) => {
  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => clearTimeout(timer);
  }, [pathKey]);
};
