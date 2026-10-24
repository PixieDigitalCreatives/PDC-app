import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import ScrollProgress from "../components/motion/ScrollProgress";
import PricingHero from "../sections/PricingStory/PricingHero";
import PricingNav from "../sections/PricingStory/PricingNav";
import PricingCategory from "../sections/PricingStory/PricingCategory";
import ProposalForm from "../sections/PricingStory/ProposalForm";
import { useCms } from "../context/CmsContext";
import { scrollToTarget } from "../animations/lenis";
import "../sections/PricingStory/pricingstory.scss";
import "../styles/pricingpage.scss";

// Pricing: a price guide up top, one section per service (prices from the CMS, see
// CmsContext / src/data/pricing.js), and a custom proposal form at the end. Picking a plan carries
// it into the form.
const PricingPage = () => {
  const { setIsContactModalOpen, pricing, pricingReady } = useCms();
  const categories = pricing.categories;
  const openContact = () => setIsContactModalOpen(true);
  const [service, setService] = useState("");
  const formRef = useRef(null);

  // Where a section lands is set by its CSS scroll-margin-top (Lenis applies it), so no offsets here.
  const jump = (slug) => scrollToTarget(`#price-${slug}`);

  // Arriving from a service card (/pricing#price-video): go to that section once the page is in.
  const { hash } = useLocation();
  useEffect(() => {
    let target = null;
    try {
      target = hash && document.querySelector(hash);
    } catch {
      // not a valid selector (hand-typed hash): stay at the top
    }
    if (!target) return undefined;
    const t = setTimeout(() => scrollToTarget(target), 900);
    return () => clearTimeout(t);
  }, [hash, pricingReady]);

  const toProposal = (svc) => {
    if (svc) setService(svc);
    scrollToTarget("#proposal");
    setTimeout(() => formRef.current?.querySelector("input")?.focus({ preventScroll: true }), 1500);
  };

  const pick = (category, plan) => toProposal(`${category.title} — ${plan.name}`);

  return (
    <div className="pricing-page">
      <Navbar />
      <ScrollProgress />

      <main id="main">
        <PricingHero
          categories={categories}
          pricesReady={pricingReady}
          onQuote={() => toProposal()}
          openContact={openContact}
          onJump={jump}
        />
        {pricingReady && categories.length > 0 && (
          <PricingNav categories={categories} onJump={jump} onQuote={() => toProposal()} />
        )}
        <div className="pc-cats">
          {!pricingReady && (
            <div className="pc-loading" role="status">
              <span className="pc-loading__label">Loading prices…</span>
              <div className="pc-loading__cards" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            </div>
          )}
          {pricingReady && categories.length === 0 && (
            <p className="pc-empty">Our price list is being updated. Tell us what you need below and we&apos;ll send you a quote.</p>
          )}
          {pricingReady &&
            categories.map((c) => <PricingCategory key={c.slug} category={c} onPick={pick} openContact={openContact} />)}
        </div>
        <ProposalForm
          ref={formRef}
          service={service}
          setService={setService}
          categories={categories}
          budgetRanges={pricing.budgetRanges}
        />
      </main>

      <Footer />
      <ContactModal />
    </div>
  );
};

export default PricingPage;
