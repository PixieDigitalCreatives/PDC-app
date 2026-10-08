import React, { useState, useEffect } from "react";
import { useCms } from "../context/CmsContext";
import { useCurrency } from "../context/CurrencyContext";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { RiCloseLine, RiCheckLine } from "react-icons/ri";
import { sendInquiry } from "../utils/sendInquiry";
import "../styles/contactmodal.scss";

const ContactModal = () => {
  const { isContactModalOpen, setIsContactModalOpen, companyInfo, services } = useCms();
  const { selectedCountry, countries, selectCountryByCode, getBudgetRanges } = useCurrency();

  const budgetOptions = getBudgetRanges();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: selectedCountry.countryCode,
    service: services[0]?.title || "Website Development",
    budget: budgetOptions[1] || budgetOptions[0],
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      country: selectedCountry.countryCode,
      budget: budgetOptions[1] || budgetOptions[0],
    }));
  }, [selectedCountry]);

  if (!isContactModalOpen) return null;

  const handleCountryChange = (e) => {
    const code = e.target.value;
    selectCountryByCode(code);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    setError("");

    const result = await sendInquiry({
      name: formData.name,
      email: formData.email,
      country: `${selectedCountry.countryName} (${selectedCountry.countryCode})`,
      service: formData.service,
      message: formData.message,
    });

    setIsSending(false);
    if (!result.ok) {
      // Keep what the visitor typed, so nothing is lost and they can retry
      setError(result.error);
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsContactModalOpen(false);
      setFormData({
        name: "",
        email: "",
        country: selectedCountry.countryCode,
        service: services[0]?.title || "Website Development",
        budget: budgetOptions[1] || budgetOptions[0],
        message: "",
      });
    }, 3000);
  };

  return (
    <div className="contact-modal-overlay" data-lenis-prevent onClick={() => setIsContactModalOpen(false)}>
      <div className="contact-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={() => setIsContactModalOpen(false)}
          aria-label="Close modal"
        >
          <RiCloseLine />
        </button>

        {submitted ? (
          <div className="modal-success-state">
            <div className="success-icon-wrap">
              <RiCheckLine />
            </div>
            <h3 className="success-title">Inquiry Received</h3>
            <p className="success-desc">
              Thank you for reaching out to Pixie Digital Creatives. We'll analyze your requirements and get back to you with a tailored estimate in {selectedCountry.currencyCode} within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <span className="section-eyebrow">GET IN TOUCH</span>
              <h2 className="modal-title">
                Let's Discuss Your <em>Project.</em>
              </h2>
              <p className="modal-subtitle">
                Fill in the details below or direct email us at{" "}
                <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* Row 1: Name and Email */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="modal-name">YOUR NAME *</label>
                  <input
                    id="modal-name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="modal-email">YOUR EMAIL *</label>
                  <input
                    id="modal-email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Row 2: Service Required */}
              <div className="form-group">
                <label htmlFor="modal-service">SERVICE REQUIRED</label>
                <select
                  id="modal-service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                >
                  {services.map((sv) => (
                    <option key={sv.id || sv.title} value={sv.title}>{sv.title}</option>
                  ))}
                  <option value="Something else">Something else</option>
                </select>
              </div>

              {/* Row 3: Message */}
              <div className="form-group">
                <label htmlFor="modal-message">PROJECT DETAILS & GOALS *</label>
                <textarea
                  id="modal-message"
                  rows="3"
                  required
                  placeholder="Tell us about your project, requirements, timeline, and goals..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              {error && (
                <p className="form-error" role="alert">
                  {error} Please try again, or email us at <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>.
                </p>
              )}

              <button type="submit" className="btn-primary modal-submit-btn" disabled={isSending} aria-busy={isSending}>
                <span>{isSending ? "SENDING…" : "SEND INQUIRY"}</span>
                <span className="arrow"><HiOutlineArrowUpRight /></span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
