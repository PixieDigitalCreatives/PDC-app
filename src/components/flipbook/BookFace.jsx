import React from "react";
import { useCms } from "../../context/CmsContext";
import { SERVICE_ICONS } from "../../sections/Story/icons";
import { CHAPTER_BLURB } from "../../sections/ServicesStory/data";
import { PHASES, pad } from "../../sections/ProcessStory/data";

// What is printed on one side of a sheet. Sizes inside a page use container units (cqw),
// so a page reads the same at any book size. Page types are described in src/data/books.js.

const siteUrl = (website) => `https://${website.replace(/^https?:\/\//, "")}`;

// Front cover. With `headline` it is the book's own designed cover; without, a generic one with
// the book title.
const Cover = ({ book, page }) => {
  const { companyInfo } = useCms();

  if (page.headline) {
    return (
      <div className="fb-cover fb-cover--rich">
        <span className="fb-cover__glow fb-cover__glow--a" />
        <span className="fb-cover__glow fb-cover__glow--b" />
        <img className="fb-cover__logo" src="/brand/primary-480.png" alt="Pixie Digital Creatives" draggable={false} />
        <div className="fb-cover__body">
          <h2 className="fb-cover__headline">
            <span>{page.headline[0]}</span>
            {page.headline[1] && <span className="fb-cover__grad">{page.headline[1]}</span>}
          </h2>
          {page.services?.length > 0 && (
            <ul className="fb-cover__services">
              {page.services.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
          {page.text && <p className="fb-cover__text">{page.text}</p>}
        </div>
        <div className="fb-cover__foot fb-cover__foot--split">
          {page.tagline && <span>{page.tagline}</span>}
          {page.website && <span className="fb-cover__site">{page.website}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="fb-cover">
      <span className="fb-cover__glow fb-cover__glow--a" />
      <span className="fb-cover__glow fb-cover__glow--b" />
      <img className="fb-cover__logo" src="/brand/primary-480.png" alt="Pixie Digital Creatives" draggable={false} />
      <div className="fb-cover__body">
        <span className="fb-cover__eyebrow">{companyInfo?.name || "Pixie Digital Creatives"}</span>
        <h2 className="fb-cover__title">{book.title}</h2>
        {companyInfo?.tagline && <p className="fb-cover__tag">{companyInfo.tagline}</p>}
      </div>
      <span className="fb-cover__foot">{new Date().getFullYear()}</span>
    </div>
  );
};

// Back cover. With `title` it carries the book's closing message; without, the contact details.
const BackCover = ({ page }) => {
  const { companyInfo } = useCms();
  const email = companyInfo?.email || "info@pixiedigitalcreatives.com";
  const website = page.website || companyInfo?.website || "pixiedigitalcreatives.com";

  if (page.title) {
    return (
      <div className="fb-cover fb-cover--back fb-cover--closing">
        <span className="fb-cover__glow fb-cover__glow--a" />
        <span className="fb-cover__glow fb-cover__glow--b" />
        <img className="fb-cover__mark" src="/brand/secondary-400.png" alt="PDC" draggable={false} />
        <h2 className="fb-cover__closing">{page.title}</h2>
        {page.text && <p className="fb-cover__text">{page.text}</p>}
        <div className="fb-cover__contact">
          <span className="fb-cover__label">Website</span>
          <a href={siteUrl(website)} target="_blank" rel="noreferrer">{website}</a>
        </div>
        {page.note && <p className="fb-cover__note">{page.note}</p>}
      </div>
    );
  }

  return (
    <div className="fb-cover fb-cover--back">
      <span className="fb-cover__glow fb-cover__glow--a" />
      <span className="fb-cover__glow fb-cover__glow--b" />
      <img className="fb-cover__mark" src="/brand/secondary-400.png" alt="PDC" draggable={false} />
      {companyInfo?.tagline && <p className="fb-cover__tag">{companyInfo.tagline}</p>}
      <div className="fb-cover__contact">
        <a href={`mailto:${email}`}>{email}</a>
        <a href={siteUrl(website)} target="_blank" rel="noreferrer">{website}</a>
      </div>
    </div>
  );
};

// Running footer of the inside pages
const PageFoot = ({ number }) => (
  <footer className="fb-cards__foot">
    <span>Pixie Digital Creatives</span>
    <span>
      pixiedigitalcreatives.com <b>{pad(number)}</b>
    </span>
  </footer>
);

const PageHead = ({ page, subtitle = page.subtitle }) => (
  <header className="fb-cards__head">
    {page.kicker && <span className="fb-cards__kicker">{page.kicker}</span>}
    <h2 className="fb-cards__title">{page.title}</h2>
    {subtitle && <p className="fb-cards__sub">{subtitle}</p>}
  </header>
);

// What we do: the services of one or more categories, with the same descriptions and key points
// as the Services page (CMS services).
const ServicesPage = ({ page, number }) => {
  const { services } = useCms();
  const groups = page.categories
    .map((cat) => ({ cat, blurb: CHAPTER_BLURB[cat] || "", items: services.filter((s) => s.category === cat) }))
    .filter((g) => g.items.length > 0);
  const single = groups.length === 1;

  return (
    <div className="fb-cards fb-svc">
      <PageHead page={page} subtitle={single ? groups[0].blurb : page.subtitle} />
      <div className="fb-svc__body">
        {groups.map((g) => (
          <section key={g.cat} className="fb-svc__group">
            {!single && (
              <h3 className="fb-svc__cat">
                {g.cat}
                {g.blurb && <span>{g.blurb}</span>}
              </h3>
            )}
            <ul className="fb-svc__list">
              {g.items.map((s) => {
                const Icon = SERVICE_ICONS[s.visual] || SERVICE_ICONS.web;
                const points = Array.isArray(s.points) ? s.points : [];
                return (
                  <li key={s.id || s.title} className="fb-svc__item">
                    <span className="fb-svc__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <div className="fb-svc__copy">
                      <h4>{s.title}</h4>
                      {s.description && <p>{s.description}</p>}
                      {points.length > 0 && (
                        <ul className="fb-svc__points">
                          {points.map((pt) => (
                            <li key={pt}>{pt}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <PageFoot number={number} />
    </div>
  );
};

// How we work: the seven phases of the Process page.
const ProcessPage = ({ page, number }) => (
  <div className="fb-cards fb-proc">
    <PageHead page={page} />
    <ol className="fb-proc__steps">
      {PHASES.map((ph, i) => (
        <li key={ph.short}>
          <b>{pad(i + 1)}</b>
          <div>
            <h4>{ph.name}</h4>
            <p>{ph.tagline}</p>
          </div>
        </li>
      ))}
    </ol>
    <PageFoot number={number} />
  </div>
);

// An inside page of price / service cards with a title, an optional footnote and a running footer.
const CardsPage = ({ page, number }) => (
  <div className="fb-cards">
    <PageHead page={page} />
    <ul className={`fb-cards__grid ${page.cards.length > 6 ? "is-dense" : ""}`}>
      {page.cards.map((c) => (
        <li key={c.label} className="fb-card">
          <span className="fb-card__label">{c.label}</span>
          <span className="fb-card__price">{c.price}</span>
          {c.text && <span className="fb-card__text">{c.text}</span>}
        </li>
      ))}
    </ul>
    {page.note && <p className="fb-cards__note">{page.note}</p>}
    <PageFoot number={number} />
  </div>
);

const Placeholder = ({ number }) => (
  <div className="fb-blank">
    <span className="fb-blank__note">Content coming soon</span>
    <span className="fb-blank__num">{String(number).padStart(2, "0")}</span>
  </div>
);

const BookFace = ({ page, number, book }) => {
  if (!page) return <div className="fb-sheet fb-sheet--reverse" />;
  return (
    <div className="fb-sheet">
      {page.type === "image" && (
        <img className="fb-img" src={page.src} alt={page.alt || `Page ${number}`} draggable={false} decoding="async" />
      )}
      {page.type === "cover" && <Cover book={book} page={page} />}
      {page.type === "cards" && <CardsPage page={page} number={number} />}
      {page.type === "services" && <ServicesPage page={page} number={number} />}
      {page.type === "process" && <ProcessPage page={page} number={number} />}
      {page.type === "back" && <BackCover page={page} />}
      {page.type === "placeholder" && <Placeholder number={number} />}
    </div>
  );
};

export default BookFace;
