import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";
import { CmsProvider } from "./context/CmsContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { ThemeProvider } from "./context/ThemeContext";
import Preloader from "./components/Preloader";
import Home from "./pages/Home";
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ProcessPage = lazy(() => import("./pages/ProcessPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
import Cursor from "./components/cursor/Cursor";
import SmoothScroll from "./components/motion/SmoothScroll";
import ScrollAnimationManager from "./components/ScrollAnimationManager";
import { ReadyContext } from "./animations/ReadyContext";
import { EASE_IN_OUT } from "./animations/variants";
import { scrollToTop } from "./animations/lenis";
import "./App.scss";

// Routes + a short cinematic transition: a dark layer wipes up over the old page,
// the route swaps underneath it, then the layer exits upward. ~0.9s total, content swaps at ~0.4s.
// Resolve when the animation ends OR after `ms` — a hidden tab pauses animation frames and must never block navigation.
const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((resolve) => setTimeout(resolve, ms))]);

const AnimatedRoutes = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const curtain = useAnimationControls();

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) {
      setDisplayLocation(location);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      await withTimeout(curtain.start({ y: "0%", transition: { duration: 0.42, ease: EASE_IN_OUT } }), 900);
      if (cancelled) return;
      setDisplayLocation(location);
      scrollToTop(true);
      await withTimeout(curtain.start({ y: "-100%", transition: { duration: 0.5, ease: EASE_IN_OUT, delay: 0.06 } }), 1200);
      if (!cancelled) curtain.set({ y: "100%" });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <>
      <ScrollAnimationManager pathKey={displayLocation.pathname} />
      <Suspense fallback={null}>
      <Routes location={displayLocation}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>
      <motion.div
        className="route-curtain"
        initial={{ y: "100%" }}
        animate={curtain}
        aria-hidden="true"
      >
        <span className="route-curtain__mark">PDC</span>
      </motion.div>
    </>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ThemeProvider>
    <CmsProvider>
      <CurrencyProvider>
        <ReadyContext.Provider value={!loading}>
          <a className="skip-link" href="#main">Skip to content</a>
          <SmoothScroll />
          <Cursor />
          <Router>
            <AnimatedRoutes />
          </Router>
          {loading && <Preloader onFinish={() => setLoading(false)} />}
        </ReadyContext.Provider>
      </CurrencyProvider>
    </CmsProvider>
    </ThemeProvider>
  );
}

export default App;
