import React, { forwardRef, useState } from "react";
import { HiArrowRight, HiChevronDown, HiOutlineCheckCircle } from "react-icons/hi2";
import Reveal from "../../components/motion/Reveal";
import { useCms } from "../../context/CmsContext";
import { useCurrency } from "../../context/CurrencyContext";
import { sendInquiry } from "../../utils/sendInquiry";

const EMPTY = { name: "", business: "", email: "", phone: "", budget: "", message: "" };

// "Custom proposal": for projects that don't fit a package, or for a plan picked above (the page
// passes it in as `service`). Sends through the same /api/contact endpoint as the other forms.
const ProposalForm = forwardRef(({ service, setService, categories, budgetRanges }, ref) => {
  const { companyInfo } = useCms();
  const { selectedCountry } = useCurrency();
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(null);

  const email = companyInfo?.email || "info@pixiedigitalcreatives.com";
  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (error) setError("");
  };
  // A plan picked on the page ("Website Development — E-commerce Website") joins the list.
  const services = [...categories.map((c) => c.title), "Something else"];
  const options = service && !services.includes(service) ? [service, ...services] : services;

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    if (!form.email.trim() && !form.phone.trim()) {
      setError("Add an email address or a phone number so we can reach you.");
      return;
    }
    setSending(true);
    setError("");
    const result = await sendInquiry({
      name: form.name,
      business: form.business,
      email: form.email,
      phone: form.phone,
      country: `${selectedCountry.countryName} (${selectedCountry.countryCode})`,
      service: service ? `Custom proposal: ${service}` : "Custom proposal",
      budget: form.budget,
      message: form.message,
    });
    setSending(false);
    if (!result.ok) {
      // Keep what the visitor typed, so nothing is lost and they can retry
      setError(`${result.error} Please try again, or email us at ${email}.`);
      return;
    }
    setSent({ name: form.name.trim().split(" ")[0], by: form.email.trim() ? "email" : "phone" });
    setForm(EMPTY);
    setService("");
  };

  return (
    <section className="pc-proposal" id="proposal" aria-labelledby="proposal-title">
      <div className="pc-proposal__panel">
        <Reveal className="pc-proposal__copy">
          <h2 className="pc-proposal__title" id="proposal-title">
            Need something <span className="grad-text">different?</span>
          </h2>
          <p className="pc-proposal__text">
            If your project doesn&apos;t fit a package, tell us what you need. We&apos;ll come back with a proposal built
            around your requirements and budget.
          </p>
          <ol className="pc-steps">
            <li><b>01</b> Share your requirements</li>
            <li><b>02</b> We review them with you</li>
            <li><b>03</b> You get a proposal with scope and price</li>
          </ol>
          <p className="pc-proposal__alt">
            Prefer email? <a href={`mailto:${email}`}>{email}</a>
          </p>
        </Reveal>

        <Reveal className="pc-form-wrap" delay={0.15}>
          {sent ? (
            <div className="pc-sent" role="status">
              <HiOutlineCheckCircle aria-hidden="true" />
              <h3>Request received</h3>
              <p>
                Thanks{sent.name ? `, ${sent.name}` : ""}. We&apos;ll review your requirements and get back to you by {sent.by}.
              </p>
              <button type="button" className="pc-btn" onClick={() => setSent(null)}>
                <span>Send another request</span>
              </button>
            </div>
          ) : (
            <form className="pc-form" onSubmit={submit} ref={ref}>
              <div className="pc-form__row">
                <div className="pc-form__field">
                  <label htmlFor="pc-name">Name *</label>
                  <input id="pc-name" type="text" required autoComplete="name" value={form.name} onChange={set("name")} placeholder="Your name" />
                </div>
                <div className="pc-form__field">
                  <label htmlFor="pc-business">Business name</label>
                  <input id="pc-business" type="text" autoComplete="organization" value={form.business} onChange={set("business")} placeholder="Your business" />
                </div>
              </div>

              <div className="pc-form__row">
                <div className="pc-form__field">
                  <label htmlFor="pc-email">Email</label>
                  <input id="pc-email" type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="you@company.com" />
                </div>
                <div className="pc-form__field">
                  <label htmlFor="pc-phone">Phone</label>
                  <input
                    id="pc-phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    pattern="\+?[0-9][0-9\s\(\)\.\-]{5,28}"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <p className="pc-form__hint">Email or phone: we need at least one to reach you.</p>

              <div className="pc-form__row">
                <div className="pc-form__field">
                  <label htmlFor="pc-service">Service required</label>
                  <div className="pc-form__select">
                    <select id="pc-service" value={service} onChange={(e) => setService(e.target.value)}>
                      <option value="">Choose a service</option>
                      {options.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    <HiChevronDown aria-hidden="true" />
                  </div>
                </div>
                <div className="pc-form__field">
                  <label htmlFor="pc-budget">Budget range</label>
                  <div className="pc-form__select">
                    <select id="pc-budget" value={form.budget} onChange={set("budget")}>
                      <option value="">Choose a range</option>
                      {budgetRanges.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <HiChevronDown aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="pc-form__field">
                <label htmlFor="pc-message">Project requirements *</label>
                <textarea
                  id="pc-message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="What do you need, by when, and anything we should know?"
                />
              </div>

              {error && (
                <p className="pc-form__error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="btn-primary pc-form__submit" disabled={sending} aria-busy={sending}>
                <span>{sending ? "Sending…" : "Request a custom quote"}</span>
                <HiArrowRight />
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
});

ProposalForm.displayName = "ProposalForm";

export default ProposalForm;
