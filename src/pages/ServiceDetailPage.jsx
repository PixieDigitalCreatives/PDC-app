import React from "react";
import { Link, useParams } from "react-router-dom";
import { useCms } from "../context/CmsContext";
import { servicePage } from "../data/servicePages";
import { industryPage } from "../data/industries";
import { POSTS } from "../data/blog";
import { PROCESS_PHASES } from "../data/siteCopy";
import { priceText } from "../data/pricing";
import CtaBand from "../sections/Story/CtaBand";
import Reveal from "../components/motion/Reveal";
import { ContentShell, ContentHero, Section, CardGrid, Checklist, Steps, QaList } from "../components/content/ContentKit";
import NotFoundPage from "./NotFoundPage";

// One page per main service (/services/<slug>), from src/data/servicePages.js. Headings are the
// questions people ask, each answered right below. Plans and prices come from the live pricing
// (Admin → Pricing & Plans); website and app pages show the studio's 7-step process from siteCopy.js.
const ServiceDetailPage = () => {
  const { slug } = useParams();
  const { pricing, setIsContactModalOpen } = useCms();
  const page = servicePage(slug);
  if (!page) return <NotFoundPage />;

  const { term } = page;
  const category = (pricing?.categories || []).find((c) => c.slug === page.pricingSlug);
  const related = page.related.map(servicePage).filter(Boolean);
  const guides = POSTS.filter((p) => p.services.includes(page.slug));
  const industries = page.industries
    .map((u) => ({ ...u, industry: industryPage(u.slug) }))
    .filter((u) => u.industry);
  const steps = page.steps || PROCESS_PHASES.map((p) => ({ name: p.name, text: p.tagline }));

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

      <Section id="what" eyebrow={page.name} title={`What is ${term}?`}>
        <Reveal as="p" className="cp-summary">{page.summary}</Reveal>
      </Section>

      <Section id="who" eyebrow="Who it's for" title={`Who is ${term} for?`}>
        <Checklist items={page.audience} />
      </Section>

      <Section id="benefits" eyebrow="Benefits" title={`What are the benefits of ${term}?`}>
        <CardGrid items={page.benefits} />
      </Section>

      <Section id="included" eyebrow="What's included" title={`What does our ${term} service include?`}>
        <CardGrid items={page.includes} />
      </Section>

      {industries.length > 0 && (
        <Section id="industries" eyebrow="By industry" title={`How is ${term} used in different industries?`}>
          <CardGrid
            items={industries.map(({ industry, text }) => ({
              title: industry.name,
              text,
              to: `/industries/${industry.slug}`,
              meta: "Industry",
              linkLabel: `More for ${industry.name}`,
            }))}
            columns={2}
          />
        </Section>
      )}

      {category && (
        <Section id="plans" eyebrow={category.title} title={`How much does ${term} cost?`} intro={page.plansIntro}>
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

      <Section
        id="process"
        eyebrow="How we work"
        title={page.steps ? `How does our ${term} service work?` : `How does a ${term} project work?`}
      >
        <Steps items={steps} />
        {!page.steps && <Link to="/process" className="cp-more">See our full process →</Link>}
        <h3 className="cp-subhead">What you receive</h3>
        <Checklist items={page.deliverables} />
      </Section>

      <Section id="faq" eyebrow="Questions" title={`${page.name}: frequently asked questions`}>
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
