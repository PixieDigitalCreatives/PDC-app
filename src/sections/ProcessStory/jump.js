import { getLenis } from "../../animations/lenis";

// Scroll to phase `i` of `n`. In the pinned journey a phase sits dead centre at i / (n - 1) of the
// track's scroll; in the stacked (phone) layout each card has its own id.
export const jumpToPhase = (i, n) => {
  const card = document.getElementById(`phase-${i + 1}`);
  const track = document.getElementById("journey");
  let y;
  if (card) {
    y = window.scrollY + card.getBoundingClientRect().top - 110;
  } else if (track) {
    const top = window.scrollY + track.getBoundingClientRect().top;
    y = top + (track.offsetHeight - window.innerHeight) * (n > 1 ? i / (n - 1) : 0);
  } else {
    return;
  }
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(y, { duration: 1.6 });
  else window.scrollTo({ top: y, behavior: "smooth" });
};
