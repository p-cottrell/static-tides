import React from "react";
import "./header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
    <div className="title-container">
      <Link to="/" className="title-link">
        <h1 className="title">S T A T I C &nbsp; T I D E S</h1>
      </Link>
    </div>
    </>
  );
};

export default Header;