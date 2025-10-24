// About.jsx
import React from "react";
import "./About.css";
import last from "../../img/last.png";
import me from "../../img/me.jpeg";
import guitar from "../../img/guitar.jpg";
import cover from "../../img/cover.jpg";
import VFXScope from "../../components/VFXScope/VFXScope.jsx"

export const About = () => {
  return (
    <VFXScope
      selectors="img,h1,h2"
      strengthDesktop={0.30}
      strengthPhone={0.15}
      mode="auto"
      borderRadiusPx={24}
      className="about"
    >
      <section>
        <h1>The need...</h1>
          <img
            src="https://picsum.photos/id/737/800/600"
            alt="Static Tides"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={800}
            height={600}
          />
        <p>Static Tides is an attmept to create contemporary music using equipment from the past - machines that hum, click, and drift slightly out of tune. Their imperfections breathing life into modern soundscapes. Each synth hiss and tape flutter, an echo from an ealier time. This is my dialogue with the past - a conversation between human hands and circuitry born before I was.</p>
      </section>

      <section>
        <div className="right">
          <h2 className="display">to be...</h2>
        </div>
        <div className="col">
          <img src={me} alt="soft light across folded textures" loading="lazy" />
          <p>And if the soul remains, so too does its intent — not always clear, not always benevolent. What was the writer thinking? Or worse — what was it trying not to think? Language is a veil, but veils are thin when backlit by desire, or fear, or guilt. Read carefully. Something watches back when you stare too long into a sentence.</p>
        </div>
      </section>

      <section>
        <h2 className="display">forever...</h2>
        <div className="col reverse">
          <p>Somewhere between the folds, something breathes. Not a presence, but the memory of having been watched. Syntax curls back on itself, a serpent swallowing not its tail, but its own shadow. Read again. You missed it the first time. You always do.</p>
          <img src={guitar} alt="contrasting planes with sharp shadow edge" loading="lazy" />
        </div>
      </section>

      <section className="last">
          <img
            src={cover}
            alt="Last"
            loading="lazy"
            decoding="async"
            />
          <h2 data-z="1">burning bright.</h2>
      </section>
    </VFXScope>
  );
};

export default About;
