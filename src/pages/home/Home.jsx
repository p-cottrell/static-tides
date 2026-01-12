import React from "react";
import "./Home.css";
import Planets from "../../components/planets/Planets";
import { Helmet } from "react-helmet";

export const Home = () => {
  const siteUrl = "https://tidesofstatic.com/";
  const title = "Tides of Static | Electronic Music + Releases";
  const description =
    "Tides of Static is an electronic music project. Listen to the debut studio EP “Burning Bright”, explore releases, and follow new music updates.";
  const ogImage = `${siteUrl}og/cover.jpg`; // change to real image path

  return (
    <div className="home-wrapper">
      <Helmet>
        <meta charSet="utf-8" />

        {/* Core SEO */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={siteUrl} />
        <meta name="robots" content="index,follow" />

        {/* Mobile / UI */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#01161E" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="Tides of Static" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            name: "Tides of Static",
            url: siteUrl,
            genre: ["Electronic, Synthwave, Chillwave, Retrowave, Datawave"],
            sameAs: ["https://tidesofstatic.bandcamp.com/",
                     "https://www.instagram.com/tidesofstatic/"
                    ],
          })}
        </script>
      </Helmet>
      <p className="announcement"> Announcing my first studio EP ‘Burning Bright’ <a className="ep-link" href="https://tidesofstatic.bandcamp.com/" target="_blank">out now!</a> </p>
      <Planets />
    </div>
  );
};