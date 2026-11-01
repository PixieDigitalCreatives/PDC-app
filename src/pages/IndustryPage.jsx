import React from "react";
import { useParams } from "react-router-dom";
import { useCms } from "../context/CmsContext";
import { INDUSTRIES, industryPage } from "../data/industries";
import { servicePage } from "../data/servicePages";
import { projectSlug, projectStatus } from "../data/projects";
import { seoPage } from "../data/seo";
import CtaBand from "../sections/Story/CtaBand";
import { ContentShell, ContentHero, Section, CardGrid, QaList } from "../components/content/ContentKit";
import NotFoundPage from "./NotFoundPage";

// Industry landing pages (/industries/<slug>) and their index (/industries), from src/data/industries.js.
// Projects are the real ones from the CMS, matched by title, each linking to its case study.

export const IndustriesPage = () => {
  const page = seoPage("/industries");
  return (
    <ContentShell>
      <ContentHero crumbs={[{ name: "Home", path: "/" }, { name: "Industries" }]} kicker={page.kicker} title={page.h1} lead={page.lead} />
      <Section id="industries" eyebrow="Industries" title="Who we build for">
        <CardGrid items={INDUSTRIES.map((i) => ({ title: i.name, text: i.lead, to: `/industries/${i.slug}`, meta: i.kicker }))} columns={2} />
      </Section>
      <CtaBand />
    </ContentShell>
  );
};

const IndustryPage = () => {
  const { slug } = useParams();
  const { portfolioProjects, setIsContactModalOpen } = useCms();
  const page = industryPage(slug);
  if (!page) return <NotFoundPage />;

  const services = page.services.map(servicePage).filter(Boolean);
  const projects = page.projects.map((title) => {
    const p = portfolioProjects.find((x) => x.title === title);
    return p
      ? { title: p.title, text: p.description, to: `/work/${projectSlug(p.title)}`, meta: `${p.type || p.category} · ${projectStatus(p)}`, linkLabel: "Read the case study" }
      : { title, to: `/work/${projectSlug(title)}`, linkLabel: "Read the case study" };
  });

  return (
    <ContentShell>
      <ContentHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }, { name: page.name }]}
        kicker={page.kicker}
        title={page.h1}
        lead={page.lead}
      >
        <button type="button" className="btn-primary" onClick={() => setIsContactModalOpen(true)}>
          <span>Start your project</span>
        </button>
      </ContentHero>

      <Section id="needs" eyebrow={page.name} title={`What ${page.name.toLowerCase()} need from a website`}>
        <CardGrid items={page.needs} columns={2} />
      </Section>

      <Section id="work" eyebrow="Our work" title={`Projects for ${page.name.toLowerCase()}`}>
        <CardGrid items={projects} columns={2} />
      </Section>

      <Section id="services" eyebrow="Services" title="How we help">
        <CardGrid items={services.map((s) => ({ title: s.name, text: s.description, to: `/services/${s.slug}`, meta: "Service" }))} />
      </Section>

      <Section id="faq" eyebrow="Questions" title="Common questions">
        <QaList items={page.faqs} />
      </Section>

      <CtaBand />
    </ContentShell>
  );
};

export default IndustryPage;
