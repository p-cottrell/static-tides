import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import VFXScope from "../../components/VFXScope/VFXScope.jsx";
import "./Links.css";
import BackgroundVideo from "../../components/BackgroundVideo/BackgroundVideo.jsx";
import redBlur from "../../img/purple-blur.webp";
import { FaBandcamp, FaSpotify, FaInstagram, FaYoutube, FaSoundcloud} from "react-icons/fa";
import { SiApplemusic, SiTidal } from "react-icons/si";
import { FaSquareLetterboxd } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export const Links = () => {
  const siteUrl = "https://tidesofstatic.com";
  const pageUrl = `${siteUrl}/links`;

  const title = "Links | Tides of Static";
  const description =
    "Official links for Tides of Static — stream Burning Bright, follow on socials, and find all platforms in one place.";

  return (
    <VFXScope selectors="h1, h3" strengthDesktop={0.30} strengthPhone={0.15} mode="scoped">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={pageUrl} />
        <meta name="robots" content="index,follow" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Links",
            url: pageUrl,
            description,
            isPartOf: {
              "@type": "WebSite",
              name: "Tides of Static",
              url: siteUrl,
            },
            about: {
              "@type": "MusicGroup",
              name: "Tides of Static",
              url: siteUrl,
              sameAs: [
                "https://tidesofstatic.bandcamp.com/",
                "https://www.instagram.com/tidesofstatic/",
              ],
            },
          })}
        </script>
      </Helmet>

      <main className="links">
        <h1 className="links-title">links</h1>

        <div className="links-container">
          <BackgroundVideo />

          <div className="links-content">
            <div className="hero-links">
              <img
                src={redBlur}
                alt="me"
                loading="eagery"
                />
            </div>
            <div className="links-buttons">
              <h3 className="link-sub-head">music</h3>

              <div className="bandcamp-embed">
                <iframe
                  title="Burning Bright on Bandcamp"
                  src="https://bandcamp.com/EmbeddedPlayer/album=3627720496/size=large/bgcol=333333/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/"
                  seamless
                  loading="lazy"
                />
              </div>
              <a
                className="btn-link"
                href="https://tidesofstatic.bandcamp.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bandcamp (opens in a new tab)"
              >
                <FaBandcamp/> &nbsp; Bandcamp
              </a>

              <a
                className="btn-link"
                href="https://open.spotify.com/artist/3VmSWPVbpx3DJKaVRAZhhC?si=61aEN-RyRR2MRlp-foojWQ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Spotify (opens in a new tab)"
              >
                <FaSpotify/> &nbsp; Spotify
              </a>

              <a
                className="btn-link"
                href="https://music.apple.com/us/artist/tides-of-static/1872346936"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Apple Music (opens in a new tab)"
              >
               <SiApplemusic/> &nbsp; Apple Music
              </a>

              <a
                className="btn-link"
                href="https://tidal.com/artist/73646217"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Tidal (opens in a new tab)"
              >
               <SiTidal /> &nbsp; Tidal
              </a>

              <a
                className="btn-link"
                href="https://soundcloud.com/tidesofstatic"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Soundcloud (opens in a new tab)"
              >
               <FaSoundcloud /> &nbsp; Soundcloud
              </a>


              <h3 className="link-sub-head">socials</h3>

              <a
                className="btn-link"
                href="https://www.instagram.com/tidesofstatic/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram (opens in a new tab)"
              >
                <FaInstagram/> &nbsp; Instagram
              </a>

              <a
                className="btn-link"
                href="https://www.youtube.com/@tidesofstatic"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube (opens in a new tab)"
              >
                <FaYoutube/> &nbsp; YouTube
              </a>
              <a
                className="btn-link"
                href="https://letterboxd.com/PaulCottrell/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Letterboxd (opens in a new tab)"
              >
                <FaSquareLetterboxd/> &nbsp; Letterboxd
              </a>

              <h3 className="link-sub-head">contact</h3>

             <Link
                to="/contact"
                className="btn-link"
                aria-label="Contact me"
              >
                <MdEmail /> &nbsp; Contact Me
              </Link>

            </div>
          </div>
        </div>
      </main>
    </VFXScope>
  );
};
