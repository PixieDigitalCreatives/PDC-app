// The two flipbooks: /brochure and /company-profile (viewer: components/flipbook/FlipBook.jsx).
//
// A book is a list of pages, read front to back. Each page is one of:
//   { type: "cover" }                               branded front cover (title from the book)
//   { type: "cover", headline: [line1, line2], services: [...], text, tagline, website }
//                                                   the book's own designed cover
//   { type: "cards", kicker, title, subtitle, cards: [{ label, price, text }], note }
//                                                   an inside page of price / service cards (two columns)
//   { type: "services", kicker, title, categories: ["Build"] }
//                                                   the services of these categories with their description
//                                                   and key points (same text as the Services page)
//   { type: "process", kicker, title, subtitle }    the seven phases of the Process page
//   { type: "back" }                                branded back cover (contact details from the CMS)
//   { type: "back", title, text, website, note }    back cover with the book's closing message
//   { type: "image", src: "/books/brochure/03.webp", alt: "What we do" }
//                                                   a finished page exported as an image (put files in public/books/<slug>/)
//   { type: "placeholder" }                         an empty numbered page, until the real content is in
//
// pageAspect = width / height of ONE page (A4 portrait = 210 / 297, A4 landscape = 297 / 210).
// pdf (optional) = a file in public/ offered as "Download PDF" in the toolbar.
//
// The brochure's prices are its own printed text: they do not follow the Pricing page (CMS).
// Its service and process pages do follow the website (services and process data).

const placeholders = (n) => Array.from({ length: n }, () => ({ type: "placeholder" }));

export const BOOKS = {
  brochure: {
    slug: "brochure",
    title: "Brochure",
    intro: "Turn the pages by dragging a corner, clicking a page or using the arrow keys. Switch between a two-page spread and a single page at any time.",
    pageAspect: 210 / 297,
    pdf: null,
    pages: [
      {
        type: "cover",
        headline: ["Digital experiences", "built around your business."],
        services: ["Websites", "Mobile Applications", "SEO & AI Search Visibility", "Social Media", "Video Production"],
        text: "We help businesses strengthen their digital presence with thoughtful design, practical technology, and creative marketing support.",
        tagline: "Your business deserves to be seen.",
        website: "pixiedigitalcreatives.com",
      },
      { type: "services", kicker: "What we do", title: "Build", categories: ["Build"] },
      { type: "services", kicker: "What we do", title: "Social & Content", categories: ["Social", "Content"] },
      { type: "services", kicker: "What we do", title: "Growth", categories: ["Growth"] },
      {
        type: "process",
        kicker: "How we work",
        title: "From first call to launch day.",
        subtitle: "Seven steps, each with clear deliverables, so you always know what is happening and what comes next.",
      },
      {
        type: "cards",
        title: "Services & Indicative Pricing",
        subtitle: "A clear starting point for planning your next digital project.",
        cards: [
          { label: "Basic / Static Website", price: "₹10,000–₹30,000", text: "Approx. 5–10 pages for a professional online presence." },
          { label: "Small Business / CMS", price: "₹30,000–₹1,00,000", text: "Business websites with content management requirements." },
          { label: "E-commerce Website", price: "₹50,000–₹3,00,000+", text: "Online store experiences for product-based businesses." },
          { label: "Enterprise Platform", price: "₹1,50,000–₹3,00,000+", text: "Custom platforms for complex business workflows." },
          { label: "MVP / Simple App", price: "From ₹50,000", text: "Android and iOS application development." },
          { label: "Service Application", price: "₹1,00,000–₹3,00,000+", text: "Service, booking, and customer-facing app experiences." },
          { label: "E-commerce App", price: "₹2,50,000–₹7,00,000+", text: "Mobile shopping and commerce functionality." },
          { label: "SEO & AI Search Visibility", price: "₹15,000–₹80,000", text: "Starter, growth, and high-competition options. Billing period to be confirmed." },
        ],
        note: "All prices are indicative. Final quotes depend on scope, integrations, content, complexity, and agreed deliverables.",
      },
      {
        type: "cards",
        title: "Creative & Growth Services",
        subtitle: "Extend your brand presence beyond the website.",
        cards: [
          { label: "Social Media — Starter", price: "₹5,000 / month", text: "20 posts for 1 platform." },
          { label: "Social Media — Growth", price: "₹10,000–₹15,000", text: "Approx. 30 posts across 2 platforms; billing cycle to confirm." },
          { label: "Full-Service Social", price: "₹30,000–₹80,000", text: "Custom social media management and marketing scope." },
          { label: "Video Editing", price: "₹300–₹4,000", text: "Basic and professional editing options; final rate depends on scope." },
          { label: "Video Production", price: "Custom quote", text: "Shoot + edit packages and full-day production; confirm deliverables and billing basis." },
          { label: "Influencer / Model Collabs", price: "₹2,500–₹70,000", text: "Indicative half-day and full-day collaboration ranges; creator and usage terms affect cost." },
        ],
      },
      {
        type: "back",
        title: "Let’s build something useful.",
        text: "Tell us what your business needs. We’ll discuss the scope, recommend a suitable approach, and prepare a proposal tailored to your goals.",
        website: "pixiedigitalcreatives.com",
        note: "Custom proposals are available for projects that need a tailored scope.",
      },
    ],
  },
  companyProfile: {
    slug: "company-profile",
    title: "Company Profile",
    intro: "Turn the pages by dragging a corner, clicking a page or using the arrow keys. Switch between a two-page spread and a single page at any time.",
    pageAspect: 210 / 297,
    pdf: null,
    pages: [{ type: "cover" }, ...placeholders(6), { type: "back" }],
  },
};
