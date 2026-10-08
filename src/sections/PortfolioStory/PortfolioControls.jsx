import React from "react";
import { LayoutGroup, motion } from "framer-motion";
import { HiOutlineListBullet, HiOutlineMagnifyingGlass, HiOutlineRectangleStack, HiOutlineXMark } from "react-icons/hi2";
import { pad } from "./data";

const VIEWS = [
  { key: "showcase", label: "Showcase", Icon: HiOutlineRectangleStack },
  { key: "index", label: "Index", Icon: HiOutlineListBullet },
];
const PILL = { type: "spring", stiffness: 420, damping: 34 };

// Sticky bar: category pills with a sliding highlight, a search box, and the Showcase / Index switch.
const PortfolioControls = ({ categories, filter, setFilter, query, setQuery, view, setView, total, shown }) => (
  <div className="pf-controls">
    <div className="pf-controls__bar">
      <LayoutGroup id="pf-filters">
        <div className="pf-filters" role="tablist" aria-label="Filter projects">
          {["All", ...categories.map((c) => c.name)].map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={filter === name}
              className={`pf-filter ${filter === name ? "is-active" : ""}`}
              onClick={() => setFilter(name)}
            >
              {filter === name && <motion.span layoutId="pf-filter-pill" className="pf-filter__pill" transition={PILL} />}
              <span className="pf-filter__text">{name}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      <label className="pf-search">
        <HiOutlineMagnifyingGlass aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, tech or keyword"
          aria-label="Search projects"
        />
        {query && (
          <button type="button" className="pf-search__clear" onClick={() => setQuery("")} aria-label="Clear search">
            <HiOutlineXMark />
          </button>
        )}
      </label>

      <LayoutGroup id="pf-views">
        <div className="pf-views" role="group" aria-label="View">
          {VIEWS.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              className={`pf-view ${view === key ? "is-active" : ""}`}
              aria-pressed={view === key}
              onClick={() => setView(key)}
              title={label}
            >
              {view === key && <motion.span layoutId="pf-view-pill" className="pf-view__pill" transition={PILL} />}
              <Icon aria-hidden="true" />
              <span className="pf-view__text">{label}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>
    </div>
    <span className="pf-controls__count" aria-live="polite">
      {pad(shown)} / {pad(total)}
    </span>
  </div>
);

export default PortfolioControls;
