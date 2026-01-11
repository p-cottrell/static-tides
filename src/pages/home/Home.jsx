import React from "react";
import "./Home.css";
import Planets from "../../components/planets/Planets";

export const Home = () => {
  return (
    <div className="home-wrapper">
      <p className="announcement"> Announcing my first studio EP ‘Burning Bright’ <a className="ep-link" href="https://tidesofstatic.bandcamp.com/" target="_blank">out now!</a> </p>
      <Planets />
    </div>
  );
};