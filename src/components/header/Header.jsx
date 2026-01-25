import "./header.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Pivot as Hamburger } from "hamburger-react";
import useMediaQuery from "../../hooks/useMediaQuery";
import logo from "../../img/text_logo_fff.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isPhone = useMediaQuery("(max-width: 767px)");

  const handleToggle = () => {
    if (isOpen) {
      // trigger fade-out before unmount
      setIsOpen(false);
      setTimeout(() => setIsVisible(false), 300); // match CSS transition
    } else {
      setIsVisible(true);
      setTimeout(() => setIsOpen(true), 0);
    }
  };

  // auto fade-out cleanup if user navigates away
  useEffect(() => {
    return () => setIsVisible(false);
  }, []);

  return (
    <header className="header-container">
      <Link to="/" className="title-link">
        <img src={logo} alt="Tides of Static logo" className="title" />
      </Link>

      <div className="hamburger-button">
        <Hamburger
          size={isPhone ? 18 : 24}
          toggled={isOpen}
          toggle={handleToggle}
        />
      </div>

      {isVisible && (
        <div className={`menu ${isOpen ? "open" : "closing"}`}>

          <nav className="menu-item-wrapper">
            <li className="menu-item">
              <Link onClick={handleToggle} to="/">home</Link>
            </li>
            <li className="menu-item">
              <Link onClick={handleToggle} to="/music">music</Link>
            </li>
            <li className="menu-item">
              <Link onClick={handleToggle} to="/links">links</Link>
            </li>
            <li className="menu-item">
              <Link onClick={handleToggle} to="/about">about</Link>
            </li>
            <li className="menu-item">
              <Link onClick={handleToggle} to="/contact">contact</Link>
            </li>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
