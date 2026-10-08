import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// One smooth-scroll instance for the whole app. Lenis drives GSAP's ticker so
// ScrollTrigger and Framer Motion's useScroll (native scroll events) stay in sync.
let instance = null;
let tickerFn = null;

export const getLenis = () => instance;

export const startLenis = () => {
  if (instance) return instance;
  instance = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.4,
  });
  instance.on("scroll", ScrollTrigger.update);
  tickerFn = (time) => instance && instance.raf(time * 1000);
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);
  return instance;
};

export const stopLenis = () => {
  if (!instance) return;
  gsap.ticker.remove(tickerFn);
  instance.destroy();
  instance = null;
  tickerFn = null;
};

export const lockScroll = () => instance && instance.stop();
export const unlockScroll = () => instance && instance.start();
export const scrollToTop = (immediate = true) => {
  if (instance) instance.scrollTo(0, { immediate });
  else window.scrollTo(0, 0);
};
export const scrollToTarget = (target, opts = {}) => {
  if (instance) instance.scrollTo(target, { offset: 0, duration: 1.4, ...opts });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el && el.scrollIntoView({ behavior: "smooth" });
  }
};
