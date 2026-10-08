import React, { useId } from "react";
import "../../styles/servicevisual.scss";

// One line-drawn motif per service, in chrome strokes with a blue/violet accent.
// Pure SVG + CSS (stroke-dashoffset), triggered by the `active` class — no JS animation loop.
const D = (props) => <path pathLength="1" className="d" {...props} />;

const Frame = ({ x, y, w, h, r = 10, ...rest }) => (
  <rect x={x} y={y} width={w} height={h} rx={r} pathLength="1" className="d" {...rest} />
);

const motifs = {
  web: () => (
    <>
      <g className="layer l1">
        <Frame x="70" y="110" w="220" h="150" />
        <D d="M90 140h80M90 165h120M90 190h60" />
        <text x="82" y="248" className="lbl">Design</text>
      </g>
      <g className="layer l2">
        <Frame x="100" y="140" w="220" h="150" data-acc />
        <D d="M120 250c30-60 60 0 90-40s50-20 80-30" data-acc />
        <text x="112" y="278" className="lbl">Motion</text>
      </g>
      <g className="layer l3">
        <Frame x="130" y="170" w="220" h="150" />
        <D d="M170 225l-22 18 22 18M310 225l22 18-22 18M250 218l-22 50" />
        <text x="142" y="308" className="lbl">Development</text>
      </g>
    </>
  ),
  wordpress: () => (
    <>
      <Frame x="60" y="90" w="280" h="220" />
      <D d="M60 128h280" />
      <D d="M82 109h.1M100 109h.1M118 109h.1" strokeLinecap="round" strokeWidth="6" />
      <Frame x="82" y="148" w="110" h="70" r="4" />
      <Frame x="208" y="148" w="110" h="30" r="4" data-acc />
      <D d="M208 198h110M208 218h80M82 244h236M82 266h180" />
    </>
  ),
  app: () => (
    <>
      <Frame x="130" y="60" w="140" h="280" r="24" />
      <D d="M180 78h40" />
      <Frame x="150" y="110" w="100" h="60" r="8" data-acc />
      <D d="M150 196h100M150 218h70M150 250h100M150 272h60" />
      <D d="M185 318h30" />
    </>
  ),
  crm: () => (
    <>
      <D d="M200 200L110 120M200 200L300 130M200 200L120 290M200 200L295 285" />
      <circle cx="200" cy="200" r="30" className="d" pathLength="1" data-acc />
      {[[110, 120], [300, 130], [120, 290], [295, 285]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="16" className="d" pathLength="1" />
      ))}
    </>
  ),
  social: () => (
    <>
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <Frame key={`${r}${c}`} x={80 + c * 85} y={80 + r * 85} w="70" h="70" r="8"
            stroke={r === 1 && c === 1 ? "url(#acc)" : undefined} />
        ))
      )}
    </>
  ),
  content: () => (
    <>
      <Frame x="90" y="110" w="190" h="190" r="8" />
      <Frame x="110" y="90" w="190" h="190" r="8" />
      <Frame x="130" y="70" w="190" h="190" r="8" data-acc />
      <D d="M155 110h100M155 135h120M155 160h80" />
    </>
  ),
  stack: () => (
    <>
      <D d="M200 90l120 50-120 50-120-50z" data-acc />
      <D d="M80 190l120 50 120-50" />
      <D d="M80 240l120 50 120-50" />
      <D d="M80 140v100M320 140v100" />
    </>
  ),
  edit: () => (
    <>
      <Frame x="70" y="90" w="260" h="130" r="8" />
      <D d="M185 130l45 25-45 25z" data-acc />
      <D d="M70 265h260" />
      <Frame x="70" y="285" w="90" h="26" r="4" />
      <Frame x="166" y="285" w="70" h="26" r="4" data-acc />
      <Frame x="242" y="285" w="88" h="26" r="4" />
      <D d="M200 250v75" data-acc />
    </>
  ),
  shoot: () => (
    <>
      <Frame x="70" y="100" w="260" h="190" r="6" />
      <D d="M70 140v-20h24M330 140v-20h-24M70 250v20h24M330 250v20h-24" />
      <circle cx="200" cy="195" r="42" className="d" pathLength="1" />
      <circle cx="200" cy="195" r="14" className="d" pathLength="1" data-acc />
      <circle cx="300" cy="125" r="5" className="d" pathLength="1" data-acc />
    </>
  ),
  handling: () => (
    <>
      <circle cx="200" cy="200" r="110" className="d" pathLength="1" />
      <D d="M200 200V130M200 200l55 32" data-acc />
      {[0, 90, 180, 270].map((a) => (
        <D key={a} d="M200 98v14" transform={`rotate(${a} 200 200)`} />
      ))}
    </>
  ),
  search: () => (
    <>
      <circle cx="175" cy="175" r="80" className="d" pathLength="1" data-acc />
      <D d="M232 232l70 70" />
      <D d="M130 160h90M130 185h60M130 210h75" />
    </>
  ),
  ai: () => (
    <>
      <circle cx="200" cy="200" r="30" className="d" pathLength="1" data-acc />
      <circle cx="200" cy="200" r="75" className="d" pathLength="1" />
      <circle cx="200" cy="200" r="120" className="d" pathLength="1" />
      <D d="M200 70v-0.1M330 200h.1M200 330v.1M70 200h.1" strokeWidth="8" strokeLinecap="round" />
    </>
  ),
  answer: () => (
    <>
      <D d="M90 100h220a12 12 0 0 1 12 12v110a12 12 0 0 1-12 12H180l-50 40v-40H90a12 12 0 0 1-12-12V112a12 12 0 0 1 12-12z" />
      <D d="M110 135h120M110 160h90" />
      <Frame x="110" y="185" w="180" h="36" r="6" data-acc />
    </>
  ),
  ads: () => (
    <>
      <D d="M80 310h250" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Frame key={i} x={95 + i * 48} y={290 - (i + 1) * 36} w="32" h={(i + 1) * 36} r="3"
          stroke={i === 4 ? "url(#acc)" : undefined} />
      ))}
      <D d="M100 190l80-50 60 30 90-80" data-acc />
    </>
  ),
  reach: () => (
    <>
      <circle cx="140" cy="200" r="18" className="d" pathLength="1" data-acc />
      <D d="M165 185c40-40 80-60 150-60M165 200h150M165 215c40 40 80 60 150 60" />
      {[125, 200, 275].map((y) => (
        <circle key={y} cx="325" cy={y} r="11" className="d" pathLength="1" />
      ))}
    </>
  ),
};

const ServiceVisual = ({ type = "web", className = "", live = false }) => {
  const id = useId().replace(/:/g, "");
  const Motif = motifs[type] || motifs.web;
  return (
    <svg
      className={`sv sv--${type} ${live ? "is-live" : ""} ${className}`}
      viewBox="0 0 400 400"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`acc-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--accent-3)" }} />
          <stop offset="1" style={{ stopColor: "var(--accent-2)" }} />
        </linearGradient>
      </defs>
      <g className="sv__art" style={{ "--acc": `url(#acc-${id})` }}>
        <Motif />
      </g>
    </svg>
  );
};

export default ServiceVisual;
