import "./header.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Pivot as Hamburger } from "hamburger-react";
import useMediaQuery from "../../hooks/useMediaQuery";

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
        <h1 className="title">
   T I D E S &nbsp; O F &nbsp; S T{" "}
  <span className="tri-outline" aria-hidden="true">
    <svg viewBox="0 0 24 24">
      <polygon points="12,3 22,21 2,21" />
    </svg>
  </span>{" "}
  T I C
</h1>
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
          <div className="hamburger-button">
            <Hamburger
              size={isPhone ? 18 : 24}
              toggled={isOpen}
              toggle={handleToggle}
            />
          </div>

          <nav className="menu-item-wrapper">
            <li className="menu-item">
              <Link onClick={handleToggle} to="/">home</Link>
            </li>
            <li className="menu-item">
              <Link onClick={handleToggle} to="/music">music</Link>
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
