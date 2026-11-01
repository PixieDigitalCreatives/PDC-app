import React from "react";
import { Link, useParams } from "react-router-dom";
import { useCms } from "../context/CmsContext";
import { caseStudyMeta, findProject, projectServiceSlug, projectSlug, projectStatus } from "../data/projects";
import { INDUSTRIES } from "../data/industries";
import { servicePage } from "../data/servicePages";
import { useSeo } from "../components/RouteSeo";
import CtaBand from "../sections/Story/CtaBand";
import Reveal from "../components/motion/Reveal";
import { ContentShell, ContentHero, Section, CardGrid } from "../components/content/ContentKit";
import NotFoundPage from "./NotFoundPage";

// Case study per real portfolio project (/work/<slug>), from the CMS. It shows only what the CMS
// holds (description, type, client, year, technologies, live site) plus an honest status; no results
// or quotes are added. Owners can enrich a case study by writing a longer description in the Admin.
const CaseStudyPage = () => {
  const { slug } = useParams();
  const { portfolioProjects, pricingReady } = useCms();
  const project = findProject(portfolioProjects, slug);
  const loaded = pricingReady; // set once the CMS request has finished

  const status = project ? projectStatus(project) : null;
  useSeo(
    project
      ? caseStudyMeta(project)
      : loaded
        ? { title: "Project not found | Pixie Digital Creatives", description: "This project could not be found.", noindex: true }
        : null
  );

  if (!project) {
    return loaded ? <NotFoundPage /> : (
      <ContentShell>
        <div className="cp-loading" role="status">Loading the case study…</div>
      </ContentShell>
    );
  }

  const service = servicePage(projectServiceSlug(project));
  const industry = INDUSTRIES.find((i) => i.projects.includes(project.title));
  const others = portfolioProjects.filter((p) => p !== project).slice(0, 4);
  const linkLabel = status === "Live" ? "Visit the live site" : "View the current build";

  return (
    <ContentShell>
      <ContentHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Portfolio", path: "/portfolio" }, { name: project.title }]}
        kicker={`Case study · ${project.category || "Project"}`}
        title={project.title}
        lead={project.type}
        meta={<span className="cp-status">{status === "Live" ? "Live project" : status}</span>}
      />

      <Section id="overview" eyebrow="Overview" title="The project">
        <div className="cp-case">
          <Reveal className="cp-case__shot">
            <div className="cp-case__bar" aria-hidden="true"><i /><i /><i /></div>
            {project.image && <img src={project.image} alt={`${project.title} website`} loading="lazy" />}
          </Reveal>
          <Reveal className="cp-facts glass-panel" delay={0.1}>
            <dl>
              {project.client && <><dt>Client</dt><dd>{project.client}</dd></>}
              {project.year && <><dt>Year</dt><dd>{project.year}</dd></>}
              <dt>Category</dt><dd>{project.category}</dd>
              <dt>Status</dt><dd>{status === "Live" ? "Live" : status}</dd>
              {project.liveUrl && (
                <>
                  <dt>Website</dt>
                  <dd><a href={project.liveUrl} target="_blank" rel="noreferrer">{linkLabel}</a></dd>
                </>
              )}
            </dl>
          </Reveal>
        </div>
        <Reveal as="p" className="cp-summary cp-case__desc" delay={0.15}>{project.description}</Reveal>
      </Section>

      {project.tags?.length > 0 && (
        <Section id="stack" eyebrow="Technologies & disciplines" title="What it was built with">
          <ul className="cp-tags">{project.tags.map((t) => <li key={t} className="cp-tag">{t}</li>)}</ul>
        </Section>
      )}

      <Section id="related" eyebrow="Related" title="Related service and industry">
        <CardGrid
          items={[
            service && { title: service.name, text: service.description, to: `/services/${service.slug}`, meta: "Service" },
            industry && { title: industry.name, text: industry.lead, to: `/industries/${industry.slug}`, meta: "Industry" },
          ].filter(Boolean)}
          columns={2}
        />
      </Section>

      {others.length > 0 && (
        <Section id="more" eyebrow="More work" title="Other projects">
          <CardGrid
            items={others.map((p) => ({ title: p.title, text: p.type || p.category, to: `/work/${projectSlug(p.title)}`, meta: projectStatus(p), linkLabel: "Read the case study" }))}
            columns={2}
          />
          <Link to="/portfolio" className="cp-more">See the full portfolio →</Link>
        </Section>
      )}

      <CtaBand
        title={["Want something", <>like <span className="grad-text">{project.title}</span>?</>]}
        text="Tell us about your project and we'll suggest the right approach."
        button="Let's Talk"
      />
    </ContentShell>
  );
};

export default CaseStudyPage;
