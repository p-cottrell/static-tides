// Footer.jsx
import React from "react";
import "./footer.css";
import { FaBandcamp, FaSpotify, FaInstagram, FaYoutube} from "react-icons/fa";
import useMediaQuery from "../../hooks/useMediaQuery";

const Footer = () => {

  const year = new Date().getFullYear();
  const isPhone = useMediaQuery("(max-width: 767px)");

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <a
          href="https://tidesofstatic.bandcamp.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          {isPhone ? <FaBandcamp/> : "Bandcamp"}
        </a>

        <a
          href="https://open.spotify.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          {isPhone ? <FaSpotify/> : "Spotify"}
        </a>

        <a
          href="https://www.instagram.com/tidesofstatic"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          {isPhone ? <FaInstagram/> : "Instagram"}
        </a>
      </div>

      <div className="footer-meta">© {year} Tides of Static</div>
    </footer>
  );
};

export default Footer;