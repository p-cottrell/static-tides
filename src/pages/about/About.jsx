// About.jsx
import React from "react";
import { Helmet } from "react-helmet";
import "./About.css";
import redBlur from "../../img/red-blur.webp";
import tv from "../../img/tv.webp";
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

        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />

        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      <section>
        <h1>The need...</h1>
        <img
          className="first-img"
          src={redBlur}
          alt="Me"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={800}
          height={600}
        />
        <p>
          Old machines, new music.
          <br /><br />
          The latest project from Paul Cottrell (9 Foot Super Soldier, Cursed Earth),
          Tides of Static makes use of equipment from the past to create music for the now.
        </p>
      </section>

      <section>
        <div className="right">
          <h2 className="display">to be...</h2>
        </div>
        <div className="col">
          <img src={cover} alt="me" loading="lazy" />
          <p>
            In his debut EP, <em>Burning Bright</em>, machines hum, click, and whir,
            in an electronic soundscape that is at once
            nostalgic and forward-gazing. <br /><br />
            <em>Burning Bright</em> is Paul’s dialogue with the past — a conversation
            between human hands and circuitry born before he was.
          </p>
        </div>
      </section>

      <section>
        <h2 className="display">forever...</h2>
        <div className="col reverse">
          <p>
            A multidisciplinary musician based in Perth, Western Australia,
            Tides of Static is the culmination of Paul’s many influences and
            interests — music, science fiction, film sound, and a long-held fascination
            with analog equipment. <br /><br />
            It is only when these influences come together with Paul’s unique
            musicianship that Tides of Static flickers to life; a sense of
            saudade in every listen.
          </p>
          <img
            src={me}
            alt="me"
            loading="lazy"
          />
        </div>
      </section>

      <section className="last">
        <img src={tv} alt="Burning Bright EP cover art" loading="lazy" decoding="async" />
        <h2 data-text="burning bright." data-z="1">
          burning bright.
        </h2>
      </section>
    </VFXScope>
  );
};

export default About;
