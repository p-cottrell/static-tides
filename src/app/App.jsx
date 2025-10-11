import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import useMediaQuery from "../hooks/useMediaQuery";

import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import { Home } from "../pages/home/Home";
import { Music } from "../pages/music/Music";
import { About } from "../pages/about/About";
import { Contact } from "../pages/contact/Contact";


export default function App() {
  const location = useLocation();
  const isPhone = useMediaQuery("(max-width: 767px)");

  const refs = React.useRef(new Map());
  const getNodeRef = (key) => {
    if (!refs.current.has(key)) refs.current.set(key, React.createRef());
    return refs.current.get(key);
  };

  const timeout = isPhone ? 240 : 520;
  const nodeRef = getNodeRef(location.pathname);

  return (
    <>
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
