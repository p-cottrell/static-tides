import React, { useEffect } from "react";
import "./Home.css";
import Planets from "../../components/planets/Planets";
import { Helmet } from "react-helmet";

export const Home = () => {
  const siteUrl = "https://tidesofstatic.com";
  const pageUrl = `${siteUrl}/`;

  // Home-specific
  const title = "Tides of Static";
  const description =
    "Tides of Static is an electronic music project. Listen to the debut studio EP “Burning Bright”, explore releases, and follow new music updates.";

  useEffect(() => {
    document.body.classList.add("home-no-scroll");

    const block = (e) => e.preventDefault();
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });

    const keyBlock = (e) => {
      const keys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
        "Spacebar",
      ];
      if (keys.includes(e.key)) e.preventDefault();
    };
    window.addEventListener("keydown", keyBlock, { passive: false });

    return () => {
      document.body.classList.remove("home-no-scroll");
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", keyBlock);
    };
  }, []);

  return (
    <section className="home">
      <Helmet>

        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />

        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      <p className="home-announcement">
        Announcing my first studio EP ‘Burning Bright’{" "}
        <a
          className="ep-link"
          href="https://tidesofstatic.bandcamp.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          out now!
        </a>
      </p>

      <div className="home-planets">
        <Planets />
      </div>
    </section>
  );
};
