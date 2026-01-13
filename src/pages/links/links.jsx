import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import VFXScope from "../../components/VFXScope/VFXScope.jsx";
import "./Links.css";
import BackgroundVideo from "../../components/BackgroundVideo/BackgroundVideo.jsx";


export const Links = () => {
  const siteUrl = "https://tidesofstatic.com";
  const pageUrl = `${siteUrl}/contact`;

  const title = "Contact | Tides of Static";
  const description =
    "Contact Tides of Static for bookings, collaborations, or general enquiries. Send a message via the contact form.";

  return (
    <VFXScope selectors="h1, h3" strengthDesktop={0.30} strengthPhone={0.15} mode="scoped">
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

      <main className="links">
        <h1 className="links-title">links</h1>
        <div className="links-container">
            <BackgroundVideo />
            <div className="links-content">
                <div className="links-buttons">
                    <h3 className="link-sub-head">music</h3>
                    <a className="btn-link" href="https://tidesofstatic.bandcamp.com/" target="_blank">Bandcamp</a>
                    <a className="btn-link" href="...">Spotify</a>
                    <a className="btn-link" href="...">Apple Music </a>
                    <h3 className="link-sub-head">socials</h3>
                    <a className="btn-link" href="https://www.instagram.com/tidesofstatic/" target="_blank">Instagram</a>
                    <a className="btn-link" href="...">YouTube </a>
                </div>
            </div>
        </div>
      </main>
    </VFXScope>
  );
};
