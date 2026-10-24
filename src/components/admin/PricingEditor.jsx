import React, { useEffect, useMemo, useState } from "react";
import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowGoBackLine,
  RiArrowUpLine,
  RiDeleteBin6Line,
  RiErrorWarningLine,
  RiExternalLinkLine,
  RiSave3Line,
} from "react-icons/ri";
import { DEFAULT_BUDGET_RANGES, DEFAULT_PRICING, priceText } from "../../data/pricing";

// Admin editor for the Pricing page. Works on a draft copy; nothing reaches the site until "Save
// pricing" (PUT /api/cms/pricing, which validates again on the server).

const LAYOUTS = [
  { value: "tiers", label: "Cards" },
  { value: "rates", label: "Rate list" },
  { value: "duo", label: "Two cards + note" },
];

let lastKey = 0;
const newKey = () => `k${(lastKey += 1)}`;

// Draft form of a plan / section: numbers stay as typed text, lists as one line each.
const planToDraft = (p = {}) => ({
  _key: newKey(),
  name: p.name || "",
  from: p.price?.from ?? "",
  to: p.price?.to ?? "",
  plus: !!p.price?.plus,
  fixed: !!p.price?.fixed,
  unit: p.price?.unit || "",
  confirmed: p.confirmed !== false,
  fit: p.fit || "",
  detailsText: (p.details || []).join("\n"),
  tag: p.tag || "",
  featured: !!p.featured,
  review: p.review || "",
});

const categoryToDraft = (c = {}) => ({
  _key: newKey(),
  slug: c.slug || "",
  number: c.number || "",
  title: c.title || "",
  kicker: c.kicker || "",
  blurb: c.blurb || "",
  layout: c.layout || "tiers",
  note: c.note || "",
  services: [...(c.services || [])],
  plans: (c.plans || []).map(planToDraft),
});

const toDraft = (doc) => ({
  categories: (doc.categories || []).map(categoryToDraft),
  budgetText: (doc.budgetRanges || []).join("\n"),
});

const amount = (v) => (v === "" || v === null || v === undefined ? null : Number(v));
const splitLines = (text) => text.split("\n").map((s) => s.trim()).filter(Boolean);

const planFromDraft = (p) => ({
  name: p.name.trim(),
  price: { from: amount(p.from), to: amount(p.to), plus: p.plus, fixed: p.fixed, unit: p.unit.trim() },
  confirmed: p.confirmed,
  fit: p.fit.trim(),
  details: splitLines(p.detailsText),
  tag: p.tag.trim(),
  featured: p.featured,
  review: p.review.trim(),
});

const fromDraft = (draft) => ({
  categories: draft.categories.map((c) => ({
    slug: c.slug.trim(),
    number: c.number.trim(),
    title: c.title.trim(),
    kicker: c.kicker.trim(),
    blurb: c.blurb.trim(),
    layout: c.layout,
    note: c.note.trim(),
    services: c.services,
    plans: c.plans.map(planFromDraft),
  })),
  budgetRanges: splitLines(draft.budgetText),
});

// The same checks the server makes, so most problems show before anything is sent.
const check = (doc) => {
  const errors = [];
  doc.categories.forEach((c, i) => {
    const where = c.title || `Section ${i + 1}`;
    if (!c.title) errors.push(`Section ${i + 1}: a title is needed.`);
    c.plans.forEach((p) => {
      const label = p.name || "a plan";
      const { from, to } = p.price;
      if (!p.name) errors.push(`${where}: every plan needs a name.`);
      if ([from, to].some((v) => v !== null && (!Number.isInteger(v) || v < 0)))
        errors.push(`${where} › ${label}: prices must be whole numbers in rupees.`);
      else if (p.confirmed && from === null) errors.push(`${where} › ${label}: add a starting price, or untick "Price confirmed".`);
      else if (from !== null && to !== null && to < from) errors.push(`${where} › ${label}: the top of the range is lower than the start.`);
    });
  });
  return errors;
};

const move = (list, i, dir) => {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

const PricingEditor = ({ pricing, services, onSave, showToast }) => {
  const [draft, setDraft] = useState(() => toDraft(pricing));
  const [open, setOpen] = useState(() => new Set(draft.categories.slice(0, 1).map((c) => c._key)));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);

  const baseline = useMemo(() => JSON.stringify(fromDraft(toDraft(pricing))), [pricing]);
  const doc = fromDraft(draft);
  const dirty = JSON.stringify(doc) !== baseline;

  // Leaving the page with unsaved edits asks first.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (fn) => {
    setErrors([]);
    setDraft((d) => fn(d));
  };
  const setCat = (ci, patch) =>
    update((d) => ({ ...d, categories: d.categories.map((c, i) => (i === ci ? { ...c, ...patch } : c)) }));
  const setPlans = (ci, fn) =>
    update((d) => ({ ...d, categories: d.categories.map((c, i) => (i === ci ? { ...c, plans: fn(c.plans) } : c)) }));
  const setPlan = (ci, pi, patch) => setPlans(ci, (plans) => plans.map((p, i) => (i === pi ? { ...p, ...patch } : p)));

  const toggleOpen = (key, isOpen) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (isOpen) next.add(key);
      else next.delete(key);
      return next;
    });

  const addSection = () => {
    const section = categoryToDraft({ number: String(draft.categories.length + 1).padStart(2, "0"), plans: [{}] });
    update((d) => ({ ...d, categories: [...d.categories, section] }));
    toggleOpen(section._key, true);
  };

  const removeSection = (ci) => {
    const title = draft.categories[ci].title || "this section";
    if (window.confirm(`Delete "${title}" and all its plans? (Nothing changes on the site until you save.)`)) {
      update((d) => ({ ...d, categories: d.categories.filter((_, i) => i !== ci) }));
    }
  };

  const removePlan = (ci, pi) => {
    const name = draft.categories[ci].plans[pi].name || "this plan";
    if (window.confirm(`Delete "${name}"? (Nothing changes on the site until you save.)`)) {
      setPlans(ci, (plans) => plans.filter((_, i) => i !== pi));
    }
  };

  const loadDefaults = () => {
    if (window.confirm("Replace everything in the editor with the prices built into the website? Nothing changes on the site until you save.")) {
      const next = toDraft({ categories: DEFAULT_PRICING, budgetRanges: DEFAULT_BUDGET_RANGES });
      setErrors([]);
      setDraft(next);
      setOpen(new Set(next.categories.slice(0, 1).map((c) => c._key)));
    }
  };

  const discard = () => {
    if (window.confirm("Throw away your unsaved changes?")) {
      const next = toDraft(pricing);
      setErrors([]);
      setDraft(next);
      setOpen(new Set(next.categories.slice(0, 1).map((c) => c._key)));
    }
  };

  const save = async () => {
    const problems = check(doc);
    if (problems.length) {
      setErrors(problems);
      return;
    }
    setSaving(true);
    const result = await onSave(doc);
    setSaving(false);
    if (!result.ok) {
      setErrors(result.errors?.length ? result.errors : [result.error]);
      return;
    }
    showToast("Pricing saved. The Pricing page is updated.");
  };

  // Services that can link to a pricing section ("See pricing" on /services), one per kind.
  const serviceOptions = useMemo(() => {
    const seen = new Set();
    return (services || []).filter((s) => s.visual && !seen.has(s.visual) && seen.add(s.visual));
  }, [services]);

  const savedAt = pricing.updatedAt ? new Date(pricing.updatedAt).toLocaleString() : null;

  return (
    <div className="pe">
      {draft.categories.map((c, ci) => (
        <details
          key={c._key}
          className="pe-cat glass-panel"
          open={open.has(c._key)}
          onToggle={(e) => toggleOpen(c._key, e.currentTarget.open)}
        >
          <summary>
            <b>{c.number || "--"}</b>
            <span className="pe-cat__title">{c.title || "Untitled section"}</span>
            <span className="pe-cat__meta">
              {c.plans.length} {c.plans.length === 1 ? "plan" : "plans"} · {LAYOUTS.find((l) => l.value === c.layout)?.label}
            </span>
          </summary>

          <div className="pe-cat__body">
            <div className="pe-grid pe-grid--3">
              <div className="form-group">
                <label>Section title *</label>
                <input value={c.title} onChange={(e) => setCat(ci, { title: e.target.value })} placeholder="Website Development" />
              </div>
              <div className="form-group">
                <label>Short label (tab bar)</label>
                <input value={c.kicker} onChange={(e) => setCat(ci, { kicker: e.target.value })} placeholder="Websites" />
              </div>
              <div className="form-group">
                <label>Number</label>
                <input value={c.number} onChange={(e) => setCat(ci, { number: e.target.value })} placeholder="01" />
              </div>
            </div>

            <div className="pe-grid pe-grid--2">
              <div className="form-group">
                <label>Layout</label>
                <select value={c.layout} onChange={(e) => setCat(ci, { layout: e.target.value })}>
                  {LAYOUTS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Section ID (in links, e.g. /pricing#price-website)</label>
                <input value={c.slug} onChange={(e) => setCat(ci, { slug: e.target.value })} placeholder="made from the title if empty" />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea rows="2" value={c.blurb} onChange={(e) => setCat(ci, { blurb: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Note {c.layout === "duo" ? "(shown as the “Good to know” card)" : "(small line under the plans)"}</label>
              <textarea rows="2" value={c.note} onChange={(e) => setCat(ci, { note: e.target.value })} placeholder="Optional" />
            </div>

            {serviceOptions.length > 0 && (
              <fieldset className="pe-services">
                <legend>Show “See pricing” on these services (Services page)</legend>
                {serviceOptions.map((s) => (
                  <label key={s.visual}>
                    <input
                      type="checkbox"
                      checked={c.services.includes(s.visual)}
                      onChange={(e) =>
                        setCat(ci, {
                          services: e.target.checked ? [...c.services, s.visual] : c.services.filter((v) => v !== s.visual),
                        })
                      }
                    />
                    {s.title}
                  </label>
                ))}
              </fieldset>
            )}

            <div className="pe-plans">
              {c.plans.map((p, pi) => (
                <div className={`pe-plan ${p.featured ? "is-featured" : ""}`} key={p._key}>
                  <div className="pe-plan__head">
                    <div>
                      <strong>{p.name || "New plan"}</strong>
                      <span className="pe-preview">{priceText(planFromDraft(p))}</span>
                    </div>
                    <div className="pe-icons">
                      <button type="button" onClick={() => setPlans(ci, (plans) => move(plans, pi, -1))} disabled={pi === 0} aria-label="Move plan up">
                        <RiArrowUpLine />
                      </button>
                      <button type="button" onClick={() => setPlans(ci, (plans) => move(plans, pi, 1))} disabled={pi === c.plans.length - 1} aria-label="Move plan down">
                        <RiArrowDownLine />
                      </button>
                      <button type="button" className="danger" onClick={() => removePlan(ci, pi)} aria-label="Delete plan">
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  </div>

                  <div className="pe-grid pe-grid--2">
                    <div className="form-group">
                      <label>Plan name *</label>
                      <input value={p.name} onChange={(e) => setPlan(ci, pi, { name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Tag on the card</label>
                      <input value={p.tag} onChange={(e) => setPlan(ci, pi, { tag: e.target.value })} placeholder="Optional, e.g. Full service" />
                    </div>
                  </div>

                  <div className="pe-grid pe-grid--3">
                    <div className="form-group">
                      <label>Price from (₹)</label>
                      <input type="number" min="0" step="1" inputMode="numeric" value={p.from} onChange={(e) => setPlan(ci, pi, { from: e.target.value })} placeholder="12000" />
                    </div>
                    <div className="form-group">
                      <label>Price to (₹)</label>
                      <input type="number" min="0" step="1" inputMode="numeric" value={p.to} onChange={(e) => setPlan(ci, pi, { to: e.target.value })} placeholder="Optional" />
                    </div>
                    <div className="form-group">
                      <label>Billing unit</label>
                      <input value={p.unit} onChange={(e) => setPlan(ci, pi, { unit: e.target.value })} placeholder="e.g. /month (only if confirmed)" />
                    </div>
                  </div>

                  <div className="pe-checks form-checkbox-group">
                    <label>
                      <input type="checkbox" checked={p.confirmed} onChange={(e) => setPlan(ci, pi, { confirmed: e.target.checked })} />
                      Price confirmed <em>(off = “Quote on request”)</em>
                    </label>
                    <label>
                      <input type="checkbox" checked={p.plus} onChange={(e) => setPlan(ci, pi, { plus: e.target.checked })} />
                      “+” after the top price
                    </label>
                    <label>
                      <input type="checkbox" checked={p.fixed} onChange={(e) => setPlan(ci, pi, { fixed: e.target.checked })} />
                      Flat price <em>(no “Starting at”)</em>
                    </label>
                    <label>
                      <input type="checkbox" checked={p.featured} onChange={(e) => setPlan(ci, pi, { featured: e.target.checked })} />
                      Highlight this plan
                    </label>
                  </div>

                  <div className="form-group">
                    <label>Best for</label>
                    <input value={p.fit} onChange={(e) => setPlan(ci, pi, { fit: e.target.value })} placeholder="Who the plan suits (optional)" />
                  </div>

                  <div className="pe-grid pe-grid--2">
                    <div className="form-group">
                      <label>Included (one per line)</label>
                      <textarea rows="3" value={p.detailsText} onChange={(e) => setPlan(ci, pi, { detailsText: e.target.value })} placeholder={"20 posts\n1 social media platform"} />
                    </div>
                    <div className="form-group">
                      <label>Internal note (never shown on the site)</label>
                      <textarea rows="3" value={p.review} onChange={(e) => setPlan(ci, pi, { review: e.target.value })} placeholder="e.g. billing period still to confirm" />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" className="pe-add" onClick={() => setPlans(ci, (plans) => [...plans, planToDraft()])}>
                <RiAddLine /> Add plan
              </button>
            </div>

            <div className="pe-cat__foot">
              <button type="button" className="pe-btn" onClick={() => update((d) => ({ ...d, categories: move(d.categories, ci, -1) }))} disabled={ci === 0}>
                <RiArrowUpLine /> Move section up
              </button>
              <button
                type="button"
                className="pe-btn"
                onClick={() => update((d) => ({ ...d, categories: move(d.categories, ci, 1) }))}
                disabled={ci === draft.categories.length - 1}
              >
                <RiArrowDownLine /> Move section down
              </button>
              <button type="button" className="pe-btn danger" onClick={() => removeSection(ci)}>
                <RiDeleteBin6Line /> Delete section
              </button>
            </div>
          </div>
        </details>
      ))}

      <button type="button" className="pe-add pe-add--section" onClick={addSection}>
        <RiAddLine /> Add service section
      </button>

      <div className="pe-budget glass-panel">
        <div className="form-group">
          <label>Budget ranges in the custom proposal form (one per line)</label>
          <textarea
            rows="6"
            value={draft.budgetText}
            onChange={(e) => update((d) => ({ ...d, budgetText: e.target.value }))}
          />
        </div>
      </div>

      <div className="pe-reset">
        <button type="button" className="pe-btn" onClick={loadDefaults}>
          Load built-in prices
        </button>
        <span>Puts the prices built into the website back into the editor. Nothing changes on the site until you save.</span>
      </div>

      {/* Stays at the bottom of the screen while editing */}
      <div className="pe-bar glass-panel">
        <div className="pe-bar__status">
          <strong className={dirty ? "is-dirty" : ""}>{dirty ? "Unsaved changes" : "No unsaved changes"}</strong>
          <span>
            {savedAt
              ? `Last saved ${savedAt}.`
              : "The site is showing its built-in prices: pricing has not been saved from the CMS yet."}
          </span>
        </div>
        <div className="pe-bar__actions">
          <a className="pe-btn" href="/pricing" target="_blank" rel="noreferrer">
            View page <RiExternalLinkLine />
          </a>
          <button type="button" className="pe-btn" onClick={discard} disabled={!dirty || saving}>
            <RiArrowGoBackLine /> Discard
          </button>
          <button type="button" className="btn-primary pe-save" onClick={save} disabled={!dirty || saving} aria-busy={saving}>
            <RiSave3Line /> {saving ? "Saving…" : "Save pricing"}
          </button>
        </div>

        {errors.length > 0 && (
          <div className="pe-errors" role="alert">
            <strong><RiErrorWarningLine /> Fix these, then save again:</strong>
            <ul>
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingEditor;
