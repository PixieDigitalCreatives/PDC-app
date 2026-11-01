import React from "react";
import { useParams } from "react-router-dom";
import { POSTS, blogPost, readingMinutes } from "../data/blog";
import { servicePage } from "../data/servicePages";
import { seoPage } from "../data/seo";
import CtaBand from "../sections/Story/CtaBand";
import Reveal from "../components/motion/Reveal";
import { ContentShell, ContentHero, Section, CardGrid } from "../components/content/ContentKit";
import NotFoundPage from "./NotFoundPage";

// Blog index (/blog) and articles (/blog/<slug>), from src/data/blog.js.

const fmtDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const postCard = (p) => ({
  title: p.title,
  text: p.description,
  to: `/blog/${p.slug}`,
  meta: `${fmtDate(p.date)} · ${readingMinutes(p)} min read`,
  linkLabel: "Read the guide",
});

export const BlogIndexPage = () => {
  const page = seoPage("/blog");
  return (
    <ContentShell>
      <ContentHero crumbs={[{ name: "Home", path: "/" }, { name: "Blog" }]} kicker={page.kicker} title={page.h1} lead={page.lead} />
      <Section id="posts" eyebrow="Latest" title="All guides">
        <CardGrid items={POSTS.map(postCard)} columns={2} />
      </Section>
      <CtaBand />
    </ContentShell>
  );
};

const ArticleSection = ({ s }) => {
  const List = s.ordered ? "ol" : "ul";
  return (
    <>
      <h2>{s.h2}</h2>
      {(s.p || []).map((t) => <p key={t.slice(0, 40)}>{t}</p>)}
      {s.table && (
        <div className="cp-table-wrap">
          <table className="cp-table">
            <thead>
              <tr>{s.table.head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {s.table.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {s.list && (
        <>
          {s.listLabel && <p className="cp-article__label">{s.listLabel}</p>}
          <List>{s.list.map((li) => <li key={li}>{li}</li>)}</List>
        </>
      )}
    </>
  );
};

export const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogPost(slug);
  if (!post) return <NotFoundPage />;

  const services = post.services.map(servicePage).filter(Boolean);
  const more = POSTS.filter((p) => p.slug !== post.slug);

  return (
    <ContentShell>
      <ContentHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title }]}
        kicker={post.kicker}
        title={post.title}
        lead={post.lead}
        meta={
          <>
            <span>By {post.author}</span>
            <time dateTime={post.date}>{fmtDate(post.date)}</time>
            <span>{readingMinutes(post)} min read</span>
          </>
        }
      />

      <section className="cp-section" aria-label="Article">
        <div className="container-custom">
          <Reveal as="article" className="cp-article">
            {post.sections.map((s) => <ArticleSection key={s.h2} s={s} />)}
          </Reveal>
        </div>
      </section>

      <Section id="services" eyebrow="Related services" title="Need a hand with this?">
        <CardGrid items={services.map((s) => ({ title: s.name, text: s.description, to: `/services/${s.slug}`, meta: "Service" }))} />
      </Section>

      <Section id="more" eyebrow="More guides" title="Keep reading">
        <CardGrid items={more.map(postCard)} columns={2} />
      </Section>

      <CtaBand />
    </ContentShell>
  );
};
