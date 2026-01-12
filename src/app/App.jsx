import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Helmet } from "react-helmet";

import Wallpaper from "../components/wallpaper/Wallpaper";
import "../styles/app.css";

import useMediaQuery from "../hooks/useMediaQuery";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import { Home } from "../pages/home/Home";
import { Music } from "../pages/music/Music";
import { About } from "../pages/about/About";
import { Contact } from "../pages/contact/Contact";
import ScrollToTop from "../hooks/scrollToTop";

import Cover from "../img/cover.jpg";

export default function App() {
  const location = useLocation();
  const isPhone = useMediaQuery("(max-width: 767px)");

  const siteUrl = "https://tidesofstatic.com";
  const currentUrl = `${siteUrl}${location.pathname === "/" ? "/" : location.pathname}`;

  const defaultTitle = "Tides of Static | Electronic Music Project";
  const defaultDescription =
    "Tides of Static is an electronic music project. Listen to the debut studio EP “Burning Bright”, explore releases, and follow new music updates.";

  const ogImage = Cover;

  const refs = React.useRef(new Map());
  const getNodeRef = (key) => {
    if (!refs.current.has(key)) refs.current.set(key, React.createRef());
    return refs.current.get(key);
  };

  const timeout = isPhone ? 240 : 520;
  const nodeRef = getNodeRef(location.pathname);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="robots" content="index,follow" />
        <meta name="theme-color" content="#01161E" />

        <title>{defaultTitle}</title>
        <meta name="description" content={defaultDescription} />

        {/* Social defaults */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Tides of Static" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={defaultTitle} />
        <meta property="og:description" content={defaultDescription} />
        <meta property="og:image" content={ogImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={defaultTitle} />
        <meta name="twitter:description" content={defaultDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* Site-wide structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            name: "Tides of Static",
            url: `${siteUrl}/`,
            genre: ["Electronic", "Synthwave", "Chillwave", "Retrowave", "Datawave"],
            sameAs: [
              "https://tidesofstatic.bandcamp.com/",
              "https://www.instagram.com/tidesofstatic/",
            ],
          })}
        </script>
      </Helmet>

      <ScrollToTop />

      <Wallpaper
        numParticles={isPhone ? 10 : 20}
        distance={0}
        speed={0.5}
        radius={1}
        lineWidth={0.6}
        particleColor="#fff"
        lineColor="#61dafb"
        backgroundColor="#000"
      />

      <Header />

      <main className="page-container">
        <TransitionGroup component={null}>
          <CSSTransition
            key={location.pathname}
            classNames="route"
            timeout={timeout}
            nodeRef={nodeRef}
            unmountOnExit
          >
            <div ref={nodeRef} className="route-wrapper">
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/music" element={<Music />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </main>

      <Footer />
    </>
  );
}
