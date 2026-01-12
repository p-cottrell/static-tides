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
      strengthPhone={0.30}
      mode="auto"
      borderRadiusPx={24}
      className="about"
    >
      <section>
        <h1>The need...</h1>
          <img
            src="https://picsum.photos/id/737/800/600"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={800}
            height={600}
          />
        <p>Tides of Static is an attempt to create contemporary music using equipment from the past - machines that hum, click, and drift slightly out of tune. Their imperfections breathing life into modern soundscapes. Each synth hiss and tape flutter, an echo from an earlier time. This is my dialogue with the past - a conversation between human hands and circuitry born before I was.</p>
      </section>

      <section>
        <div className="right">
          <h2 className="display">to be...</h2>
        </div>
        <div className="col">
          <img src={me} alt="soft light across folded textures" loading="lazy" />
          <p>I’m a lifelong musician based in Perth, Western Australia, having moved through a wide range of genres over the years. Tides of Static is where those influences meet my interest in electronic sound, atmosphere, and texture.</p>
        </div>
      </section>

      <section>
        <h2 className="display">forever...</h2>
        <div className="col reverse">
          <p>The project is influenced by science fiction, film sound, and the world around me, as well as a long-standing appreciation for the character of older equipment. Those influences inform the mood and texture of the music, giving it a sense of space, tension, and familiarity.</p>
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
          <h2 data-text="burning bright." data-z="1">burning bright.</h2>
      </section>
    </VFXScope>
  );
};

export default About;
