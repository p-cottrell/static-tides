import React from "react";
import "./footer.css";
import useMediaQuery from "../../hooks/useMediaQuery";
import { FaSpotify,  FaInstagram,  FaBandcamp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <a href="https://tidesofstatic.bandcamp.com/" target="_blank" className="footer-link">Bandcamp</a>
        <a href="https://open.spotify.com/" target="_blank" className="footer-link">Spotify</a>
        <a href="https://www.instagram.com/tidesofstatic" target="_blank" className="footer-link">Instagram</a>
      </div>
    </footer>
  );
};

export default Footer;