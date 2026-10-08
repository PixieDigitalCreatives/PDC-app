import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import ProjectDetailModal from "../components/ProjectDetailModal";
import { useCms } from "../context/CmsContext";
import { useCurrency } from "../context/CurrencyContext";
import { HiOutlineArrowUpRight, HiOutlineEnvelope, HiOutlinePhone, HiOutlineSparkles } from "react-icons/hi2";
import { FaInstagram, FaLinkedinIn, FaXTwitter, FaFacebookF } from "react-icons/fa6";
import { RiCheckLine, RiGlobalLine, RiComputerLine } from "react-icons/ri";
import MaskText from "../components/motion/MaskText";
import Reveal from "../components/motion/Reveal";
import HeroAurora from "../components/motion/HeroAurora";
import TiltCard from "../components/motion/TiltCard";
import { Stagger } from "../components/motion/Stagger";
import { genImage } from "../data/images";
import { sendInquiry } from "../utils/sendInquiry";
import "../styles/contactpage.scss";

const ContactPage = () => {
  const { companyInfo, services } = useCms();
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
      setFormData({
        name: "",
        email: "",
        country: selectedCountry.countryCode,
        service: services[0]?.title || "Website Development",
        budget: budgetOptions[1] || budgetOptions[0],
        message: "",
      });
    }, 4000);
  };

  return (
    <div className="contact-page">
      <Navbar />

      <main id="main" className="contact-page-main">
        {/* Hero Section */}
        <section className="contact-page-hero has-aurora">
          <HeroAurora image={genImage("hero-contact")} />
          <div className="container-custom">
            <div className="hero-content-center">
              <Reveal as="span" className="section-eyebrow" delay={0.35}>GET IN TOUCH</Reveal>
              <MaskText
                as="h1"
                className="contact-hero-title"
                delay={5}
                lines={["Tell us what", <>you're <em>building.</em></>]}
              />
              <Reveal as="p" className="contact-hero-desc" delay={0.75}>
                Partnering with founders and businesses globally. Reach out in your preferred currency and we'll reply within 24 hours.
              </Reveal>
            </div>
          </div>
        </section>

        {/* Contact Split Grid */}
        <section className="contact-split-section">
          <div className="container-custom">
            <Stagger className="contact-split-grid" stagger={0.15}>
              {/* Left Column: Studio Information */}
              <TiltCard tilt={3} className="contact-info-card glass-panel">
                <h2 className="info-card-title">Studio details</h2>
                <p className="info-card-desc">
                  We help businesses turn ideas into premium digital experiences through thoughtful design, modern development, and custom digital solutions.
                </p>

                <div className="info-items-list">
                  <div className="info-item">
                    <span className="info-icon"><HiOutlineEnvelope /></span>
                    <div>
                      <span className="info-lbl">DIRECT EMAIL</span>
                      <a href={`mailto:${companyInfo?.email || "info@pixiedigitalcreatives.com"}`} className="info-val">
                        {companyInfo?.email || "info@pixiedigitalcreatives.com"}
                      </a>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon"><HiOutlinePhone /></span>
                    <div>
                      <span className="info-lbl">PHONE NUMBER</span>
                      <div className="info-phone-links">
                        <a href="tel:+919708976946" className="info-val">+91 97089 76946</a>
                        <span className="phone-sep">, </span>
                        <a href="tel:+918825310738" className="info-val">+91 88253 10738</a>
                      </div>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon"><RiGlobalLine /></span>
                    <div>
                      <span className="info-lbl">WEBSITE</span>
                      <a
                        href="https://www.pixiedigitalcreatives.com"
                        target="_blank"
                        rel="noreferrer"
                        className="info-val"
                      >
                        pixiedigitalcreatives.com
                      </a>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon"><HiOutlineSparkles /></span>
                    <div>
                      <span className="info-lbl">SERVICES</span>
                      <span className="info-val services-tags">
                        Website Development • App Development • CRM • Social Media • SEO • Ads
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon"><RiComputerLine /></span>
                    <div>
                      <span className="info-lbl">DIGITAL PRESENCE</span>
                      <span className="info-val">
                        Serving businesses through digital-first solutions
                      </span>
                    </div>
                  </div>
                </div>

                <div className="info-socials-block">
                  <span className="socials-lbl">FOLLOW THE STUDIO</span>
                  <div className="socials-links-row">
                    <a href={companyInfo?.socials?.instagram || "https://www.instagram.com/pixiedigitalcreatives/"} target="_blank" rel="noreferrer" title="Instagram">
                      <FaInstagram />
                    </a>
                    <a href={companyInfo?.socials?.linkedin || "https://www.linkedin.com/company/pixiedigitalcreatives"} target="_blank" rel="noreferrer" title="LinkedIn">
                      <FaLinkedinIn />
                    </a>
                    <a href={companyInfo?.socials?.twitter || "https://x.com/pixiedigital"} target="_blank" rel="noreferrer" title="Twitter / X">
                      <FaXTwitter />
                    </a>
                    <a href={companyInfo?.socials?.facebook || "https://www.facebook.com/share/17iSpzyfRY/"} target="_blank" rel="noreferrer" title="Facebook">
                      <FaFacebookF />
                    </a>
                  </div>
                </div>
              </TiltCard>

              {/* Right Column: Inquiry Form */}
              <TiltCard tilt={0} className="contact-form-card glass-panel">
                {submitted ? (
                  <div className="form-success-box">
                    <div className="success-icon"><RiCheckLine /></div>
                    <h3 className="success-heading">Inquiry received</h3>
                    <p className="success-sub">
                      Thank you for contacting Pixie Digital Creatives. We'll analyze your requirements and reach out with a tailored roadmap within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="page-inquiry-form">
                    <h2 className="form-heading">Start a conversation</h2>

                    <div className="form-row">
                      <div className="form-group">
                        <label>YOUR NAME *</label>
                        <input
                          type="text"
                          required
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>YOUR EMAIL *</label>
                        <input
                          type="email"
                          required
                          placeholder="you@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>SERVICE REQUIRED</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      >
                        {services.map((sv) => (
                    <option key={sv.id || sv.title} value={sv.title}>{sv.title}</option>
                  ))}
                  <option value="Something else">Something else</option>
                </select>
                    </div>

                    <div className="form-group">
                      <label>PROJECT DETAILS & GOALS *</label>
                      <textarea
                        rows="4"
                        required
                        placeholder="Tell us about your project, requirements, timeline, and goals..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      ></textarea>
                    </div>

                    {error && (
                      <p className="form-error" role="alert">
                        {error} Please try again, or email us at{" "}
                        <a href={`mailto:${companyInfo?.email || "info@pixiedigitalcreatives.com"}`}>
                          {companyInfo?.email || "info@pixiedigitalcreatives.com"}
                        </a>.
                      </p>
                    )}

                    <button type="submit" className="btn-primary form-submit-btn" disabled={isSending} aria-busy={isSending}>
                      <span>{isSending ? "SENDING…" : "SEND INQUIRY"}</span>
                      <HiOutlineArrowUpRight />
                    </button>
                  </form>
                )}
              </TiltCard>
            </Stagger>
          </div>
        </section>
      </main>

      <Footer />
      <ContactModal />
      <ProjectDetailModal />
    </div>
  );
};

export default ContactPage;
