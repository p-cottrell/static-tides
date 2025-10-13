import React from "react";
import "./Music.css";
import albumArt from "../../img/burning-bright-alt.png";

export const Music = () => {
  return (
    <main className="music">
      <section className="music-container">
        <h1 className="music-title">burning bright EP</h1>
        <p className="music-subtitle">My first studio EP - out now</p>

        <figure className="music-figure">
          <img
            src={albumArt}
            alt="Burning Bright EP cover art"
            className="music-art"
            loading="lazy"
          />
          <figcaption className="music-credits">
            <ul className="music-credits-list">
              <li>Cover photography - Ellie Cottrell</li>
              <li>Written & produced - Paul Cottrell</li>
              <li>Mastering - Al "Alien" Smith</li>
              <li>Copyright - Paul Cottrell</li>
            </ul>
          </figcaption>
        </figure>
      </section>
    </main>
  );
};