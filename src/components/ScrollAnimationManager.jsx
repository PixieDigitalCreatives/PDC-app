import { useScrollTriggerAnimation } from "../hooks/useScrollTriggerAnimation";

// Re-measures scroll triggers after each route change.
const ScrollAnimationManager = ({ pathKey }) => {
  useScrollTriggerAnimation(pathKey);
  return null;
};

export default ScrollAnimationManager;
