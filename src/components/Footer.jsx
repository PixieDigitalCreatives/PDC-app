import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCms } from "../context/CmsContext";
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { EASE, VIEWPORT } from "../animations/variants";
import "../styles/footer.scss";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Process", path: "/process" },
  { name: "Contact", path: "/contact" },
];

const col = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: i * 0.08 } }),
};

const Footer = () => {
  const { companyInfo, services } = useCms();
  const socials = [
    { label: "Instagram", Icon: FaInstagram, href: companyInfo?.socials?.instagram || "https://www.instagram.com/pixiedigitalcreatives/" },
    { label: "LinkedIn", Icon: FaLinkedinIn, href: companyInfo?.socials?.linkedin || "https://www.linkedin.com/company/pixiedigitalcreatives" },
    { label: "X", Icon: FaXTwitter, href: companyInfo?.socials?.twitter || "https://x.com/pixiedigital" },
    { label: "Facebook", Icon: FaFacebookF, href: companyInfo?.socials?.facebook || "https://www.facebook.com/share/17iSpzyfRY/" },
  ];

  return (
    <footer className="footer-wrapper">
      <span className="footer-glow" aria-hidden="true" />
      <motion.div className="footer-container" initial="hidden" whileInView="show" viewport={VIEWPORT}>
        <div className="footer-grid">
          <motion.div className="footer-col brand-col" variants={col} custom={0}>
            <Link to="/" className="footer-logo-link" aria-label="Pixie Digital Creatives — home">
              <img src="/brand/primary-480.png" alt="Pixie Digital Creatives" className="footer-logo" />
            </Link>
            <p className="footer-statement">
              Creative solutions for modern brands.
              <br />
              Design. Develop. Market. Grow.
            </p>
            <ul className="footer-contact">
              {companyInfo?.email && <li><a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a></li>}
              {companyInfo?.phone && <li>{companyInfo.phone}</li>}
              {companyInfo?.address && <li>{companyInfo.address}</li>}
            </ul>
          </motion.div>

          <motion.div className="footer-col" variants={col} custom={1}>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map((l) => (
                <li key={l.path}><Link to={l.path}>{l.name}</Link></li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="footer-col" variants={col} custom={2}>
            <h4 className="footer-col-title">Services</h4>
            <ul className="footer-links">
              {services.slice(0, 6).map((s) => (
                <li key={s.id || s.title}><Link to={s.link || "/services"}>{s.title}</Link></li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="footer-col" variants={col} custom={3}>
            <h4 className="footer-col-title">Follow Us</h4>
            <div className="footer-socials">
              {socials.map(({ label, Icon, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                  <Icon />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Pixie Digital Creatives. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/about">Privacy Policy</Link>
            <Link to="/about">Terms &amp; Conditions</Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
