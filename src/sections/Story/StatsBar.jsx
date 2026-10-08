import React from "react";
import { useCms } from "../../context/CmsContext";
import { Stagger, StaggerItem } from "../../components/motion/Stagger";
import CountUp from "../../components/motion/CountUp";
import { statIcon } from "./icons";

// Same order as the design: projects, clients, years, satisfaction. Anything else keeps its place after those.
const ORDER = [/project/i, /client/i, /year|experience/i, /satisf|rating/i];
const rank = (label) => {
  const i = ORDER.findIndex((re) => re.test(label) && !(re.source === "client" && /satisf/i.test(label)));
  return i < 0 ? ORDER.length : i;
};

// Frosted bar that overlaps the bottom of the hero. Numbers come from the CMS and count up on entry.
const StatsBar = () => {
  const { stats } = useCms();
  if (!stats.length) return null;
  const items = [...stats].sort((a, b) => rank(a.label) - rank(b.label)).slice(0, 4);

  return (
    <section className="st-stats" aria-label="The studio in numbers">
      <Stagger className="st-stats__bar" stagger={0.12}>
        {items.map((s, i) => {
          const Icon = statIcon(s.label);
          return (
            <StaggerItem key={s.id || i} className="st-stat">
              <span className={`st-stat__tile st-tone-${i % 4}`}>
                <Icon />
              </span>
              <span className="st-stat__text">
                <CountUp className="st-stat__num" value={s.number} />
                <span className="st-stat__label">{s.label}</span>
              </span>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
};

export default StatsBar;
