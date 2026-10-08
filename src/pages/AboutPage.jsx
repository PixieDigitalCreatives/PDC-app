import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import ProjectDetailModal from "../components/ProjectDetailModal";
import AboutLeadership from "../components/AboutLeadership";
import Marquee from "../components/motion/Marquee";
import ScrollProgress from "../components/motion/ScrollProgress";
import CtaBand from "../sections/Story/CtaBand";
import AboutHero from "../sections/AboutStory/AboutHero";
import Manifesto from "../sections/AboutStory/Manifesto";
import Pillars from "../sections/AboutStory/Pillars";
import { useCms } from "../context/CmsContext";
import { disciplines } from "../data/story";
import "../sections/Story/story.scss";
import "../sections/AboutStory/aboutstory.scss";
import "../styles/aboutpage.scss";

// The about page reads as one story, like the home page:
// who we are (hero) -> why we exist (words that light up as you scroll, then the numbers)
// -> how we work (four pillars) -> the people (3D leadership ring) -> the invitation.
const AboutPage = () => {
  const { setIsContactModalOpen } = useCms();
  const openContact = () => setIsContactModalOpen(true);

  return (
    <div className="about-page">
      <Navbar />
      <ScrollProgress />

      <main id="main">
        <AboutHero openContact={openContact} />
        <Marquee items={disciplines} speed={36} />
        <Manifesto />
        <Pillars />
        <AboutLeadership />
        <CtaBand
          title={["Let's build", <><span className="grad-text">what comes next.</span></>]}
          text="Have a challenge or digital product in mind? Let's talk through your roadmap."
          button="Let's Talk"
        />
      </main>

      <Footer />
      <ContactModal />
      <ProjectDetailModal />
    </div>
  );
};

export default AboutPage;
