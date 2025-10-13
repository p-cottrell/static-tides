import "./header.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Pivot as Hamburger } from "hamburger-react";
import { CSSTransition } from "react-transition-group";
import useMediaQuery from "../../hooks/useMediaQuery";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isPhone = useMediaQuery("(max-width: 767px)");

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };


  return (
    <header className="header-container">
      <Link to="/" className="title-link">
          <h1 className="title">S T A T I C &nbsp; T I D E S</h1>
        </Link>
        <div className="hamburger-button">
          <div>
                <Hamburger
                  size = {isPhone ? 18 : 24}
                  toggled={isOpen}
                  toggle={setIsOpen}
                  />
                {isOpen && (
                <div className="menu">
                  <div className="hamburger-button">
                    <Hamburger
                      size={isPhone ? 18 : 24}
                      toggled={isOpen}
                      toggle={setIsOpen}
                    />
                  </div>
                  <nav className="menu-item-wrapper">
                    <li className="menu-item ">
                    <Link  onClick={handleToggle} to="/">home</Link>
                    </li>
                    <li className="menu-item">
                      <Link  onClick={handleToggle} to="/music" > music</Link>
                    </li>
                    <li className="menu-item">
                    <Link onClick={handleToggle} to="/about" >about</Link>
                    </li>
                    <li className="menu-item">
                    <Link onClick={handleToggle} to="/contact" > contact</Link>
                    </li>
                  </nav>
                </div>
              )}
              </div>
        </div>
    </header>
  );
};

export default Header;