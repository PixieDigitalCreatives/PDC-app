import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import MaskText from "../components/motion/MaskText";
import Reveal from "../components/motion/Reveal";
import HeroAurora from "../components/motion/HeroAurora";
import "../styles/notfound.scss";

const LINKS = [
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const NotFoundPage = () => (
  <div className="nf-page">
    <Navbar />
    <main id="main" className="nf has-aurora">
      <HeroAurora />
      <div className="container-custom nf__inner">
        <Reveal as="span" className="section-eyebrow" delay={0.35}>Error 404</Reveal>
        <MaskText as="h1" className="nf__title" delay={5} lines={["This page", <em key="e">wandered off.</em>]} />
        <Reveal as="p" className="nf__text" delay={0.7}>
          The link may be old, or the page has moved. Everything we make is still one click away.
        </Reveal>
        <Reveal className="nf__actions" delay={0.85}>
          <Link to="/" className="btn-primary">
            <span>Back to home</span>
            <HiOutlineArrowUpRight />
          </Link>
          <nav className="nf__links" aria-label="Popular pages">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to}>{l.label}</Link>
            ))}
          </nav>
        </Reveal>
      </div>
    </main>
    <Footer />
    <ContactModal />
  </div>
);

export default NotFoundPage;
