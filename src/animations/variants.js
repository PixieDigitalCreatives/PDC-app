// Shared motion vocabulary. Slow when introducing, sharp when emphasising, almost no bounce.
export const EASE = [0.16, 1, 0.3, 1];        // expo-out: reveals
export const EASE_IN_OUT = [0.76, 0, 0.24, 1]; // transitions
export const EASE_SMOOTH = [0.45, 0, 0.15, 1];

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE_SMOOTH } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

export const scaleReveal = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: EASE } },
};

// Mask reveal for a single line of type: parent clips, child slides up.
export const textReveal = {
  hidden: { y: "108%" },
  show: (i = 0) => ({ y: "0%", transition: { duration: 1.05, ease: EASE, delay: i * 0.09 } }),
};

export const clipReveal = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.2, ease: EASE_IN_OUT } },
};

export const imageReveal = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  show: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.3, ease: EASE_IN_OUT },
  },
};

export const staggerChildren = (stagger = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" };
