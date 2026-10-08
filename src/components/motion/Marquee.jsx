import React from "react";

// Endless horizontal ticker. The list is rendered twice and the track slides by -50%,
// so the loop is seamless. CSS-only; pauses on hover and stops for reduced motion.
const Marquee = ({ items = [], speed = 40, reverse = false, className = "" }) => {
  if (items.length === 0) return null;
  const loop = [...items, ...items];
  return (
    <div className={`marquee ${reverse ? "marquee--reverse" : ""} ${className}`} aria-hidden="true">
      <div className="marquee__track" style={{ animationDuration: `${speed}s` }}>
        {loop.map((item, i) => (
          <span className="marquee__item" key={i}>
            {item}
            <i className="marquee__sep" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
