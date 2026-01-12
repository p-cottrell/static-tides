import React, { useEffect } from "react";
import "./Home.css";
import Planets from "../../components/planets/Planets";
import { Helmet } from "react-helmet";

export const Home = () => {
  const siteUrl = "https://tidesofstatic.com/";
  const title = "Tides of Static";
  const description =
    "Tides of Static is an electronic music project. Listen to the debut studio EP “Burning Bright”, explore releases, and follow new music updates.";
  const ogImage = `${siteUrl}og/cover.jpg`;

  useEffect(() => {
    // 1) Lock page scrolling (layout)
    document.body.classList.add("home-no-scroll");

    // 2) Block scroll input (wheel/trackpad/touch) so Planets can't react
    const block = (e) => {
      e.preventDefault();
    };

    // Wheel + trackpad
    window.addEventListener("wheel", block, { passive: false });
    // Touch scrolling
    window.addEventListener("touchmove", block, { passive: false });

    // Keyboard scroll keys (space, arrows, page up/down, home/end)
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
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={siteUrl} />
        <meta name="robots" content="index,follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#01161E" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="Tides of Static" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            name: "Tides of Static",
            url: siteUrl,
            genre: ["Electronic", "Synthwave", "Chillwave", "Retrowave", "Datawave"],
            sameAs: [
              "https://tidesofstatic.bandcamp.com/",
              "https://www.instagram.com/tidesofstatic/",
            ],
          })}
        </script>
      </Helmet>

      <p className="home-announcement">
        Announcing my first studio EP ‘Burning Bright’{" "}
        <a
          className="ep-link"
          href="https://tidesofstatic.bandcamp.com/"
          target="_blank"
          rel="noreferrer"
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
