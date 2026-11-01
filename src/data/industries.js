// Industry landing pages (/industries/<slug>), each backed by real portfolio projects (matched by
// title in the CMS). The "needs" are general, honest observations about what such businesses need from
// a website; no invented results or client claims.

export const INDUSTRIES = [
  {
    slug: "restaurants-cafes",
    name: "Restaurants & Cafés",
    title: "Restaurant & Café Website Development | Pixie Digital Creatives",
    description:
      "Premium restaurant and café websites: menus, atmosphere and mobile-first design, plus social media content that brings guests in. By Pixie Digital Creatives.",
    kicker: "Websites for restaurants & cafés",
    h1: "Let guests taste the experience before they arrive.",
    lead:
      "Restaurant and café website development with a premium feel: your atmosphere, menu and story presented beautifully on every phone, backed by social media content that keeps people coming back.",
    needs: [
      { title: "A menu people can read on a phone", text: "Most guests check the menu on their phone before they visit, so it needs to load fast and read clearly on a small screen." },
      { title: "The atmosphere, not just the food", text: "Typography, imagery and motion that carry the feel of the place: the interiors, the coffee, the conversations." },
      { title: "Easy next steps", text: "Clear ways to call, find the venue or follow you on social media from every page." },
      { title: "Fresh social content", text: "Reels and posts that show what is new, managed alongside the website." },
    ],
    services: ["website-development", "social-media-marketing", "seo"],
    projects: ["MEHFIL", "Moti Restro"],
    faqs: [
      { q: "What should a restaurant website include?", a: "At minimum: the menu, location and opening information, ways to contact you, and photos that show the atmosphere. A premium site adds storytelling and design that match the experience in the venue." },
      { q: "Can you also manage our social media?", a: "Yes. Our social media marketing and handling plans cover strategy, posting, reels and Meta Ads." },
      { q: "Will the menu be easy to update?", a: "Yes. We set up content management so your team can change menu items and prices without a developer." },
    ],
  },
  {
    slug: "ecommerce",
    name: "E-commerce & D2C Brands",
    title: "E-commerce Website Development | Pixie Digital Creatives",
    description:
      "E-commerce website and app development for online stores and D2C brands: product discovery, premium storytelling and mobile shopping. Pixie Digital Creatives.",
    kicker: "E-commerce website development",
    h1: "Online stores that feel as premium as your products.",
    lead:
      "E-commerce website development for online stores and direct-to-consumer brands: product discovery, brand storytelling and smooth mobile shopping, with an e-commerce app when your customers want one.",
    needs: [
      { title: "Products that are easy to find", text: "Clear categories, search and product pages that answer buyers' questions." },
      { title: "A brand story, not just a catalogue", text: "Premium visuals and storytelling that explain why your products are worth it." },
      { title: "Mobile shopping that just works", text: "Most browsing happens on phones, so the store is designed mobile-first." },
      { title: "Found in search", text: "Technical SEO and product content structured for Google and AI search." },
    ],
    services: ["website-development", "app-development", "seo"],
    projects: ["PetMitra", "Ocean Rare"],
    faqs: [
      { q: "Do you build online stores?", a: "Yes. E-commerce websites are one of our website plans, and we also build e-commerce mobile apps." },
      { q: "Can you build an app for our store too?", a: "Yes. Our E-commerce Application plan covers mobile shopping features for Android and iOS." },
      { q: "How much does an e-commerce website cost?", a: "Current starting prices are listed on our pricing page. Every store is scoped with you first, based on products, features and integrations." },
    ],
  },
  {
    slug: "fitness-wellness",
    name: "Fitness & Wellness",
    title: "Websites for Gyms & Fitness Brands | Pixie Digital Creatives",
    description:
      "Premium websites for gyms, fitness studios and wellness brands: bold design, programmes and memberships, and booking apps, by Pixie Digital Creatives.",
    kicker: "Websites for gyms & fitness brands",
    h1: "A website with the same energy as your training floor.",
    lead:
      "Website development for gyms, fitness studios and wellness brands: bold, high-energy design that presents your programmes, coaches and memberships, with a booking app when you need one.",
    needs: [
      { title: "Programmes and memberships, clearly explained", text: "Visitors should understand what you offer and how to join in seconds." },
      { title: "A visual identity with energy", text: "Strong typography, imagery and motion that match the brand." },
      { title: "Booking and sign-up", text: "From a simple enquiry form to a service and booking app." },
      { title: "Content that keeps members engaged", text: "Social media handling and reels that show the community." },
    ],
    services: ["website-development", "app-development", "social-media-marketing"],
    projects: ["ELV8 Fitness"],
    faqs: [
      { q: "Can members book classes or sessions?", a: "Yes. Booking can be built into the website or delivered as a service and booking app, depending on what you need." },
      { q: "Do you create content for our social media?", a: "Yes: social media handling, reels and shoots, and paid campaigns through Meta Ads." },
      { q: "How do we start?", a: "With a discovery call to understand your goals, members and current systems; then we propose the right scope." },
    ],
  },
  {
    slug: "creators-authors",
    name: "Creators, Authors & Artists",
    title: "Websites for Authors & Creators | Pixie Digital Creatives",
    description:
      "Editorial websites for authors, poets, artists and creators: biographies, works, books and creative journeys, beautifully presented by Pixie Digital Creatives.",
    kicker: "Websites for creators, authors & artists",
    h1: "A digital home for your work and your story.",
    lead:
      "Website development for authors, poets, artists and creators: an editorial design that brings together your biography, your works and your creative journey in one place.",
    needs: [
      { title: "Your work, beautifully presented", text: "An editorial visual language that suits writing, art and creative portfolios." },
      { title: "Your story", text: "Biographies, inspiration and milestones presented with care." },
      { title: "Books and works in one place", text: "Clear pages for each book or body of work, easy to share." },
      { title: "Found by readers and fans", text: "Search-friendly structure, so people searching for your name find your site." },
    ],
    services: ["website-development", "seo", "social-media-marketing"],
    projects: ["AksharCanvas"],
    faqs: [
      { q: "Can the site present several creators?", a: "Yes. AksharCanvas, for example, brings together two poets, their biographies, poetry and books." },
      { q: "Will I be able to add new work myself?", a: "Yes. We set up content management so you can add new pieces, books and news." },
      { q: "Can you help people find me on Google?", a: "Yes. Every website launches with SEO foundations, and our SEO plans go further." },
    ],
  },
];

export const industryPage = (slug) => INDUSTRIES.find((i) => i.slug === slug) || null;
