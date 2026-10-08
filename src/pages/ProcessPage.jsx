import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import ProjectDetailModal from "../components/ProjectDetailModal";
import ScrollProgress from "../components/motion/ScrollProgress";
import CtaBand from "../sections/Story/CtaBand";
import ProcessHero from "../sections/ProcessStory/ProcessHero";
import Journey from "../sections/ProcessStory/Journey";
import { useCms } from "../context/CmsContext";
import "../sections/Story/story.scss";
import "../sections/ProcessStory/processstory.scss";
import "../styles/processpage.scss";

// The process page reads as a journey: a map of the seven stops (hero), then the phases
// travelling past one by one in a pinned scene, then the invitation to begin Phase 01.
const ProcessPage = () => {
  const { setIsContactModalOpen } = useCms();
  const openContact = () => setIsContactModalOpen(true);

  return (
    <div className="process-page">
      <Navbar />
      <ScrollProgress />

      <main id="main">
        <ProcessHero openContact={openContact} />
        <Journey />
        <CtaBand
          title={["Ready to begin", <><span className="grad-text">Phase 01</span> with us?</>]}
          text="Let's set up a discovery session and map out your project requirements."
          button="Let's Talk"
        />
      </main>

      <Footer />
      <ContactModal />
      <ProjectDetailModal />
    </div>
  );
};

export default ProcessPage;
