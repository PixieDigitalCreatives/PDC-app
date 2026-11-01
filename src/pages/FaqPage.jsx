import React from "react";
import { useCms } from "../context/CmsContext";
import { companyFaqs } from "../data/faq";
import { SERVICE_PAGES } from "../data/servicePages";
import { seoPage } from "../data/seo";
import CtaBand from "../sections/Story/CtaBand";
import { ContentShell, ContentHero, Section, CardGrid, QaList } from "../components/content/ContentKit";

// Company FAQ (/faq), from src/data/faq.js; founders and projects come from the CMS. Service questions
// stay on their service pages, linked below, so each question has one home.
const FaqPage = () => {
  const { teamMembers, portfolioProjects } = useCms();
  const page = seoPage("/faq");
  const faqs = companyFaqs({ team: teamMembers, projects: portfolioProjects });

  return (
    <ContentShell>
      <ContentHero crumbs={[{ name: "Home", path: "/" }, { name: "FAQ" }]} kicker={page.kicker} title={page.h1} lead={page.lead} />

      <Section id="company" eyebrow="About us" title="Questions about Pixie Digital Creatives">
        <QaList items={faqs} />
      </Section>

      <Section id="by-service" eyebrow="By service" title="Questions about a specific service">
        <CardGrid
          items={SERVICE_PAGES.map((s) => ({
            title: s.name,
            text: `${s.faqs.length} questions answered, including "${s.faqs[0].q}"`,
            to: `/services/${s.slug}#faq`,
            meta: "Service",
            linkLabel: `${s.name} questions`,
          }))}
        />
      </Section>

      <CtaBand />
    </ContentShell>
  );
};

export default FaqPage;
