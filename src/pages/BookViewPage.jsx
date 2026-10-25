import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import ContactModal from "../components/ContactModal";
import FlipBook from "../components/flipbook/FlipBook";
import { useReady } from "../animations/ReadyContext";
import { EASE } from "../animations/variants";
import { BOOKS } from "../data/books";
import "../styles/bookpage.scss";

// Brochure and Company Profile: one screen with the nav bar and the book, nothing else.
const BookViewPage = ({ bookId }) => {
  const book = BOOKS[bookId];
  const ready = useReady();

  return (
    <div className="bk-page">
      <Navbar />

      <main id="main" className="bk">
        <h1 className="bk__title">{book.title}</h1>

        <motion.div
          className="bk__viewer"
          initial={{ opacity: 0, y: 40 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
        >
          <FlipBook book={book} />
        </motion.div>
      </main>

      <ContactModal />
    </div>
  );
};

export default BookViewPage;
