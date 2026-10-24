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
          {page.eyebrow && <span className="fb-cover__eyebrow-pill">{page.eyebrow}</span>}
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
        <span className="fb-cover__eyebrow">{page.eyebrow || companyInfo?.name || "Pixie Digital Creatives"}</span>
        <h2 className="fb-cover__title">{page.title || book.title}</h2>
        {(page.tagline || companyInfo?.tagline) && (
          <p className="fb-cover__tag">{page.tagline || companyInfo.tagline}</p>
        )}
      </div>
      <span className="fb-cover__foot">{page.year || new Date().getFullYear()}</span>
    </div>
  );
};

// Back cover. With `title` it carries the book's closing message; without, minimal clean brand mark.
const BackCover = ({ page }) => {
  const { companyInfo } = useCms();
  const website = page?.website || companyInfo?.website || "pixiedigitalcreatives.com";
  const tagline = page?.tagline || companyInfo?.tagline || "Turning ideas into digital experiences.";

  if (page?.title) {
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
      {tagline && <p className="fb-cover__tag">{tagline}</p>}
      <div className="fb-cover__site-badge">
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

// 01 — About Pixie: overview, approach, who we work with, positioning, promise, values
const ProfileAboutPage = ({ page, number }) => (
  <div className="fb-cards fb-pabout">
    <PageHead page={page} />
    {page.overview && <p className="fb-pabout__lead">{page.overview}</p>}
    <div className="fb-pabout__body">
      {page.approach && (
        <section className="fb-pabout__section">
          <h3 className="fb-pabout__section-title">Our Approach</h3>
          <ul className="fb-pabout__approach-grid">
            {page.approach.map((app) => (
              <li key={app.title} className="fb-pabout__app-item">
                <h4>{app.title}</h4>
                <p>{app.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="fb-pabout__mid-split">
        {page.whoWeWorkWith && (
          <div className="fb-pabout__box">
            <h3 className="fb-pabout__section-title">Who We Work With</h3>
            <ul className="fb-pabout__clients-list">
              {page.whoWeWorkWith.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        )}
        {page.positioning && (
          <div className="fb-pabout__box">
            <h3 className="fb-pabout__section-title">Our Positioning</h3>
            <p>{page.positioning}</p>
          </div>
        )}
      </div>

      {page.brandPromise && (
        <div className="fb-pabout__promise-banner">
          <span>Brand Promise</span>
          <blockquote>&ldquo;{page.brandPromise}&rdquo;</blockquote>
        </div>
      )}

      {page.coreValues && (
        <ul className="fb-pabout__values">
          {page.coreValues.map((v) => (
            <li key={v.label}>
              <b>{v.label}</b>
              <span>{v.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
    <PageFoot number={number} />
  </div>
);

// 02 — Core Services: 6 service cards with visual icons and highlights
const ProfileServicesPage = ({ page, number }) => (
  <div className="fb-cards fb-pservices">
    <PageHead page={page} />
    <ul className="fb-pservices__grid">
      {page.services.map((s) => {
        const Icon = SERVICE_ICONS[s.visual] || SERVICE_ICONS.web;
        return (
          <li key={s.title} className="fb-pservices__card">
            <div className="fb-pservices__head">
              <span className="fb-pservices__icon" aria-hidden="true">
                <Icon />
              </span>
              <div>
                <span className="fb-cards__kicker">{s.category}</span>
                <h4 className="fb-pservices__title">{s.title}</h4>
              </div>
            </div>
            <p className="fb-pservices__offer">{s.offer}</p>
            {s.highlights?.length > 0 && (
              <ul className="fb-pservices__highlights">
                {s.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
    {page.note && <p className="fb-pservices__note">{page.note}</p>}
    <PageFoot number={number} />
  </div>
);

// 03 — Pricing Overview: structured categories, package scopes, and prices
const ProfilePricingPage = ({ page, number }) => (
  <div className="fb-cards fb-ppricing">
    <PageHead page={page} />
    <div className="fb-ppricing__body">
      {page.groups.map((group) => (
        <section key={group.category} className="fb-ppricing__group">
          <div className="fb-ppricing__group-header">
            <h3 className="fb-ppricing__cat-title">{group.category}</h3>
            {group.badge && <span className="fb-ppricing__badge">{group.badge}</span>}
          </div>
          <ul className="fb-ppricing__table">
            {group.rows.map((row) => (
              <li key={row.name} className="fb-ppricing__row">
                <div className="fb-ppricing__row-info">
                  <b>{row.name}</b>
                  {row.scope && <span>{row.scope}</span>}
                </div>
                <span className="fb-ppricing__price">{row.price}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
    {page.note && <p className="fb-ppricing__note">{page.note}</p>}
    <PageFoot number={number} />
  </div>
);

// 04 — Engagement Process: 5 structured phases + client needs & commitment
const ProfileProcessPage = ({ page, number }) => (
  <div className="fb-cards fb-pprocess">
    <PageHead page={page} />
    <ol className="fb-pprocess__steps">
      {page.steps.map((st) => (
        <li key={st.number} className="fb-pprocess__step">
          <b className="fb-pprocess__num">{st.number}</b>
          <div className="fb-pprocess__copy">
            <h4>
              {st.title} {st.tagline && <span>• {st.tagline}</span>}
            </h4>
            <p>{st.description}</p>
          </div>
        </li>
      ))}
    </ol>
    <div className="fb-pprocess__dual">
      {page.clientNeeds && (
        <div className="fb-pprocess__box">
          <h5>{page.clientNeeds.title}</h5>
          <p>{page.clientNeeds.text}</p>
        </div>
      )}
      {page.ourCommitment && (
        <div className="fb-pprocess__box">
          <h5>{page.ourCommitment.title}</h5>
          <p>{page.ourCommitment.text}</p>
        </div>
      )}
    </div>
    <PageFoot number={number} />
  </div>
);

// 05 — Let's Work Together: inside paper page for contact & getting started
const ProfileContactPage = ({ page, number }) => {
  const { companyInfo } = useCms();
  const website = page.website || companyInfo?.website || "pixiedigitalcreatives.com";
  const email = page.email || companyInfo?.email || "info@pixiedigitalcreatives.com";
  const phone = page.phone || companyInfo?.phone || "+91 97089 76946";

  return (
    <div className="fb-cards fb-pcontact">
      <PageHead page={page} />
      {page.text && <p className="fb-pcontact__lead">{page.text}</p>}

      <div className="fb-pcontact__body">
        <ul className="fb-pcontact__channels">
          <li className="fb-pcontact__chan">
            <span>Website</span>
            <a href={siteUrl(website)} target="_blank" rel="noreferrer">
              {website}
            </a>
          </li>
          <li className="fb-pcontact__chan">
            <span>Enquiries</span>
            <a href={`mailto:${email}`}>{email}</a>
          </li>
          <li className="fb-pcontact__chan">
            <span>Direct Call</span>
            <a href={`tel:${phone.split(",")[0].trim()}`}>{phone}</a>
          </li>
        </ul>

        {page.actionNote && <p className="fb-pcontact__action">{page.actionNote}</p>}

        {page.steps && (
          <div className="fb-pcontact__steps-box">
            <h4 className="fb-pcontact__steps-title">Next Steps to Get Started</h4>
            <ol className="fb-pcontact__steps-list">
              {page.steps.map((st, i) => (
                <li key={st.title || i}>
                  <b>0{i + 1}</b>
                  <div>
                    <h5>{st.title}</h5>
                    <p>{st.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <PageFoot number={number} />
    </div>
  );
};

// 06 — Project Scope, Terms & Disclaimer: inside paper page
const ProfileTermsPage = ({ page, number }) => (
  <div className="fb-cards fb-pterms">
    <PageHead page={page} />
    <div className="fb-pterms__body">
      {page.disclaimer && (
        <div className="fb-pterms__disclaimer-box">
          <h4 className="fb-pterms__box-title">{page.disclaimer.title}</h4>
          <p className="fb-pterms__box-text">{page.disclaimer.text}</p>
        </div>
      )}

      {page.safeguards && (
        <div className="fb-pterms__safeguards">
          <h4 className="fb-pterms__section-title">Our Working Principles</h4>
          <ul className="fb-pterms__grid">
            {page.safeguards.map((sg) => (
              <li key={sg.title} className="fb-pterms__card">
                <h5>{sg.title}</h5>
                <p>{sg.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {page.brandPromise && (
        <div className="fb-pterms__promise">
          <span>Brand Commitment</span>
          <p>&ldquo;{page.brandPromise}&rdquo;</p>
        </div>
      )}
    </div>
    <PageFoot number={number} />
  </div>
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
      {page.type === "profile-about" && <ProfileAboutPage page={page} number={number} />}
      {page.type === "profile-services" && <ProfileServicesPage page={page} number={number} />}
      {page.type === "profile-pricing" && <ProfilePricingPage page={page} number={number} />}
      {page.type === "profile-process" && <ProfileProcessPage page={page} number={number} />}
      {page.type === "profile-contact" && <ProfileContactPage page={page} number={number} />}
      {page.type === "profile-terms" && <ProfileTermsPage page={page} number={number} />}
      {page.type === "back" && <BackCover page={page} />}
      {page.type === "placeholder" && <Placeholder number={number} />}
    </div>
  );
};

export default BookFace;
