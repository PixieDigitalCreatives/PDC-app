import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import FlipBook from "../components/flipbook/FlipBook";
import { KineticLine } from "../components/motion/KineticText";
import { useReady } from "../animations/ReadyContext";
import { EASE } from "../animations/variants";
import { BOOKS } from "../data/books";
import "../styles/bookpage.scss";

// Brochure and Company Profile: the first screen is one full panel holding the book.
const BookViewPage = ({ bookId }) => {
  const book = BOOKS[bookId];
  const ready = useReady();

  const enter = (delay) => ({
    initial: { opacity: 0, y: 18 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <div className="bk-page">
      <Navbar />

      <main id="main" className="bk">
        <header className="bk__head">
          <div className="bk__titles">
            <h1 className="bk__title" aria-label={book.title}>
              <KineticLine text={book.title} ready={ready} />
            </h1>
          </div>
          <motion.p className="bk__intro" {...enter(0.5)}>{book.intro}</motion.p>
        </header>

        <motion.div
          className="bk__viewer"
          initial={{ opacity: 0, y: 40 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
        >
          <FlipBook book={book} />
        </motion.div>
      </main>

      <Footer />
      <ContactModal />
    </div>
  );
};

export default BookViewPage;
