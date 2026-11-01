import React from "react";
import { Link, useParams } from "react-router-dom";
import { useCms } from "../context/CmsContext";
import { servicePage } from "../data/servicePages";
import { POSTS } from "../data/blog";
import { PROCESS_PHASES } from "../data/siteCopy";
import { priceText } from "../data/pricing";
import CtaBand from "../sections/Story/CtaBand";
import Reveal from "../components/motion/Reveal";
import { ContentShell, ContentHero, Section, CardGrid, QaList } from "../components/content/ContentKit";
import NotFoundPage from "./NotFoundPage";

// One page per main service (/services/<slug>), from src/data/servicePages.js. Plans and prices
// come from the live pricing (Admin → Pricing & Plans), the process steps from siteCopy.js.
const ServiceDetailPage = () => {
  const { slug } = useParams();
  const { pricing, setIsContactModalOpen } = useCms();
  const page = servicePage(slug);
  if (!page) return <NotFoundPage />;

  const category = (pricing?.categories || []).find((c) => c.slug === page.pricingSlug);
  const related = page.related.map(servicePage).filter(Boolean);
  const guides = POSTS.filter((p) => p.services.includes(page.slug));

  return (
    <ContentShell>
      <ContentHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: page.name }]}
        kicker={page.kicker}
        title={page.h1}
        lead={page.lead}
      >
        <button type="button" className="btn-primary" onClick={() => setIsContactModalOpen(true)}>
          <span>Discuss your project</span>
        </button>
        <Link to={`/pricing#price-${page.pricingSlug}`} className="btn-secondary">
          <span>See pricing</span>
        </Link>
      </ContentHero>

      <Section id="what" eyebrow={page.name} title={`What is ${page.name}?`}>
        <Reveal as="p" className="cp-summary">{page.summary}</Reveal>
      </Section>

      <Section id="included" eyebrow="What's included" title={`What our ${page.name} service includes`}>
        <CardGrid items={page.includes} />
      </Section>

      {category && (
        <Section id="plans" eyebrow="Plans" title={category.title} intro={page.plansIntro}>
          <ul className="cp-plans">
            {category.plans.map((plan) => (
              <li className="cp-plan glass-panel" key={plan.name}>
                <h3>{plan.name}</h3>
                <span className="cp-plan__price">{priceText(plan)}</span>
                {plan.fit && <p className="cp-plan__fit">{plan.fit}</p>}
                {plan.details?.length > 0 && <p className="cp-plan__details">{plan.details.join(" · ")}</p>}
              </li>
            ))}
          </ul>
          {category.note && <p className="cp-plan__details">{category.note}</p>}
          <Link to={`/pricing#price-${category.slug}`} className="cp-more">See full pricing →</Link>
        </Section>
      )}

      <Section id="process" eyebrow="How we work" title="Seven clear steps, from first call to launch">
        <ol className="cp-steps">
          {PROCESS_PHASES.map((phase) => (
            <li key={phase.name} className="glass-panel">
              {phase.name}
              <span>{phase.tagline}</span>
            </li>
          ))}
        </ol>
        <Link to="/process" className="cp-more">See our full process →</Link>
      </Section>

      <Section id="faq" eyebrow="Questions" title={`${page.name}: common questions`}>
        <QaList items={page.faqs} />
      </Section>

      <Section id="related" eyebrow="Keep exploring" title="Related services and guides">
        <CardGrid
          items={[
            ...related.map((r) => ({ title: r.name, text: r.description, to: `/services/${r.slug}`, meta: "Service" })),
            ...guides.map((g) => ({ title: g.title, text: g.description, to: `/blog/${g.slug}`, meta: "Guide", linkLabel: "Read the guide" })),
          ]}
        />
      </Section>

      <CtaBand
        title={["Ready to talk about", <><span className="grad-text">{page.name}</span>?</>]}
        text="Tell us what you're planning and we'll suggest the right scope."
        button="Let's Talk"
      />
    </ContentShell>
  );
};

export default ServiceDetailPage;
