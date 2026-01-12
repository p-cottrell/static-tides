// About.jsx
import React from "react";
import { Helmet } from "react-helmet";
import "./About.css";
import me from "../../img/me.jpeg";
import guitar from "../../img/guitar.jpg";
import cover from "../../img/cover.jpg";
import VFXScope from "../../components/VFXScope/VFXScope.jsx";

export const About = () => {
  const siteUrl = "https://tidesofstatic.com";
  const pageUrl = `${siteUrl}/about`;

  const title = "About | Tides of Static";
  const description =
    "Learn about Tides of Static — an electronic music project based in Perth, Western Australia, shaped by vintage gear, texture, atmosphere, and film/sci-fi influences.";

  return (
    <VFXScope
      selectors="img,h1,h2"
      strengthDesktop={0.30}
      strengthPhone={0.30}
      mode="auto"
      borderRadiusPx={24}
      className="about"
    >
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={pageUrl} />

        {/* Override per-page URL + copy (image inherited from App.jsx) */}
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />

        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      <section>
        <h1>The need...</h1>
        <img
          src="https://picsum.photos/id/737/800/600"
          alt="Abstract monochrome textures with soft light and grain"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={800}
          height={600}
        />
        <p>
          Tides of Static is an attempt to create contemporary music using
          equipment from the past - machines that hum, click, and drift slightly
          out of tune. Their imperfections breathing life into modern
          soundscapes. Each synth hiss and tape flutter, an echo from an earlier
          time. This is my dialogue with the past - a conversation between human
          hands and circuitry born before I was.
        </p>
      </section>

      <section>
        <div className="right">
          <h2 className="display">to be...</h2>
        </div>
        <div className="col">
          <img src={me} alt="Portrait in soft light" loading="lazy" />
          <p>
            I’m a lifelong musician based in Perth, Western Australia, having
            moved through a wide range of genres over the years. Tides of Static
            is where those influences meet my interest in electronic sound,
            atmosphere, and texture.
          </p>
        </div>
      </section>

      <section>
        <h2 className="display">forever...</h2>
        <div className="col reverse">
          <p>
            The project is influenced by science fiction, film sound, and the
            world around me, as well as a long-standing appreciation for the
            character of older equipment. Those influences inform the mood and
            texture of the music, giving it a sense of space, tension, and
            familiarity.
          </p>
          <img
            src={guitar}
            alt="Guitar in shadow with strong contrast"
            loading="lazy"
          />
        </div>
      </section>

      <section className="last">
        <img src={cover} alt="Burning Bright EP cover art" loading="lazy" decoding="async" />
        <h2 data-text="burning bright." data-z="1">
          burning bright.
        </h2>
      </section>
    </VFXScope>
  );
};

export default About;
