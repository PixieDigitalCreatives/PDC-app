import React from "react";
import { HiArrowRight, HiCheck, HiOutlineInformationCircle } from "react-icons/hi2";
import Reveal from "../../components/motion/Reveal";
import { Stagger, StaggerItem } from "../../components/motion/Stagger";
import { priceParts } from "../../data/pricing";

// The price as it reads on a card: "₹12,000 – ₹30,000", "Starting at ₹50,000", "₹5,000 /month".
// Plans whose price is not confirmed yet say "Quote on request".
const Price = ({ plan }) => {
  const p = priceParts(plan);
  if (!p) {
    return (
      <p className="pc-price pc-price--quote">
        <span className="pc-price__main">Quote on request</span>
      </p>
    );
  }
  return (
    <p className="pc-price">
      {p.startingAt && <span className="pc-price__pre">Starting at</span>}
      <span className="pc-price__main">{p.from}</span>
      {p.to && <span className="pc-price__to">– {p.to}</span>}
      {p.unit && <span className="pc-price__unit">{p.unit}</span>}
    </p>
  );
};

const PlanCard = ({ plan, onPick }) => {
  const details = plan.details || [];
  const quote = plan.confirmed === false;
  return (
    <StaggerItem as="article" className={`pc-plan ${plan.featured ? "is-featured" : ""}`}>
      <div className="pc-plan__top">
        <h3 className="pc-plan__name">{plan.name}</h3>
        {plan.tag && <span className="pc-plan__tag">{plan.tag}</span>}
      </div>
      <Price plan={plan} />
      {plan.fit && <p className="pc-plan__fit">{plan.fit}</p>}
      {details.length > 0 && (
        <ul className="pc-plan__list">
          {details.map((d) => (
            <li key={d}>
              <HiCheck aria-hidden="true" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      )}
      <button type="button" className={plan.featured ? "btn-primary pc-plan__cta" : "pc-btn pc-plan__cta"} onClick={() => onPick(plan)}>
        <span>{quote ? "Ask for a quote" : "Get started"}</span>
        <HiArrowRight />
      </button>
    </StaggerItem>
  );
};

const RateRow = ({ plan, onPick }) => (
  <StaggerItem as="li" className="pc-rate">
    <div className="pc-rate__info">
      <h3>{plan.name}</h3>
      {plan.fit && <p>{plan.fit}</p>}
    </div>
    <Price plan={plan} />
    <button
      type="button"
      className="pc-rate__go"
      onClick={() => onPick(plan)}
      aria-label={`${plan.confirmed === false ? "Ask for a quote" : "Get started"}: ${plan.name}`}
    >
      <HiArrowRight />
    </button>
  </StaggerItem>
);

// One service: its heading, then the plans as cards ("tiers"), a rate list ("rates") or two cards
// with a note beside them ("duo").
const PricingCategory = ({ category, onPick, openContact }) => {
  const { slug, number, title, kicker, blurb, layout, plans, note } = category;
  const pick = (plan) => onPick(category, plan);

  return (
    <section className="pc-cat" id={`price-${slug}`} data-pricing-section data-slug={slug} aria-labelledby={`price-${slug}-title`}>
      <Reveal as="header" className="pc-cat__head">
        <span className="pc-cat__num" aria-hidden="true">{number}</span>
        <div className="pc-cat__name">
          <span className="pc-cat__kicker">{kicker}</span>
          <h2 className="pc-cat__title" id={`price-${slug}-title`}>{title}</h2>
        </div>
        <div className="pc-cat__side">
          <p className="pc-cat__blurb">{blurb}</p>
          <button type="button" className="pc-link" onClick={openContact}>
            <span>Discuss your project</span>
            <HiArrowRight />
          </button>
        </div>
      </Reveal>

      {layout === "tiers" && (
        <Stagger className={`pc-tiers pc-tiers--${plans.length}`}>
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} onPick={pick} />
          ))}
        </Stagger>
      )}

      {layout === "rates" && (
        <Stagger as="ul" className="pc-rates" stagger={0.07}>
          {plans.map((plan) => (
            <RateRow key={plan.name} plan={plan} onPick={pick} />
          ))}
        </Stagger>
      )}

      {layout === "duo" && (
        <Stagger className="pc-duo">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} onPick={pick} />
          ))}
          {note && (
            <StaggerItem as="aside" className="pc-notecard">
              <HiOutlineInformationCircle aria-hidden="true" />
              <h3>Good to know</h3>
              <p>{note}</p>
            </StaggerItem>
          )}
        </Stagger>
      )}

      {note && layout !== "duo" && (
        <p className="pc-cat__note">
          <HiOutlineInformationCircle aria-hidden="true" />
          {note}
        </p>
      )}
    </section>
  );
};

export default PricingCategory;
