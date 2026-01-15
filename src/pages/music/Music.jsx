import React from "react";
import { Helmet } from "react-helmet";
import "./Music.css";
import VFXScope from "../../components/VFXScope/VFXScope.jsx";
import albumArt from "../../img/burning-bright-1120.webp";

export const Music = () => {
  const siteUrl = "https://tidesofstatic.com";
  const pageUrl = `${siteUrl}/music`;

  const title = "Burning Bright EP | Tides of Static";
  const description =
    "Burning Bright is the debut studio EP by Tides of Static. An electronic release shaped by texture, atmosphere, and vintage equipment.";

  return (
    <VFXScope selectors="h1" strengthDesktop={0.30} strengthPhone={0.30} mode="auto">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={pageUrl} />

        {/* Per-page share metadata (image inherited globally) */}
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />

        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        {/* Music album structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicAlbum",
            name: "Burning Bright",
            byArtist: {
              "@type": "MusicGroup",
              name: "Tides of Static",
            },
            albumProductionType: "StudioAlbum",
            genre: ["Electronic", "Synthwave", "Chillwave", "Retrowave", "Datawave"],
            image: `${siteUrl}${albumArt.startsWith("/") ? "" : "/"}${albumArt}`,
            url: pageUrl,
          })}
        </script>
      </Helmet>

      <main className="music">
        <section className="music-container">
          <h1 className="music-title">burning bright EP</h1>
          <p className="music-subtitle">My first studio EP - out now</p>

          <figure className="music-figure">
            <img
              src={albumArt}
              className="music-art"
              alt="Burning Bright EP cover art"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={2286}
              height={2286}
            />
            <figcaption className="music-credits">
              <ul className="music-credits-list">
                <li>Written & produced - Paul Cottrell</li>
                <li>Mastering - <a href="https://www.thrash-wolf.com/" target="blank">Al &quot;Dr Alien&quot; Smith</a></li> 
                <li>Cover photography - <a href="https://www.elliecottrellwrites.com/" target="blank"> Ellie Cottrell</a></li>
                <li>Logo - <a href="https://www.thrash-wolf.com/" target="blank">ThrashWolf</a></li>
                <li>Copyright - Paul Cottrell</li>
              </ul>
            </figcaption>
          </figure>
        </section>
      </main>
    </VFXScope>
  );
};

export default Music;
