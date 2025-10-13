import React from "react";
import "./About.css";
import Planets from "../../components/planets/Planets";

export const About = () => {
  return (
    <main className="about">
      <section className="about-hero">
        <p className="about-title">
          A sonic journey through light and shadow.
        </p>
      </section>

      <section className="about-content">
        <div className="about-text">
          <h2 className="about-heading">The Story</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            laoreet, augue in tincidunt malesuada, enim urna suscipit sem, in
            laoreet justo felis nec neque. Integer facilisis, turpis in
            porttitor congue, ipsum nulla lacinia risus, vitae viverra turpis
            neque sit amet eros.
          </p>
          <p>
            Curabitur vel libero non orci pharetra vestibulum. Sed luctus
            feugiat orci, at tempor velit porttitor vel. Quisque fermentum
            fringilla urna, sit amet viverra enim interdum vel.
          </p>
        </div>

        <div className="about-text">
          <h2 className="about-heading">The Vision</h2>
          <p>
            Pellentesque ac mauris at arcu volutpat dictum. Aenean congue magna
            quis tortor suscipit, sit amet cursus orci imperdiet. Aliquam erat
            volutpat. Suspendisse in volutpat urna, sit amet cursus sapien.
          </p>
          <p>
            Integer ut sagittis magna, nec lobortis tortor. Nunc viverra
            facilisis purus a placerat. Vestibulum sit amet luctus ipsum, in
            ultricies magna.
          </p>
        </div>


        <div className="about-text">
          <h2 className="about-heading">The Vision</h2>
          <p>
            Pellentesque ac mauris at arcu volutpat dictum. Aenean congue magna
            quis tortor suscipit, sit amet cursus orci imperdiet. Aliquam erat
            volutpat. Suspendisse in volutpat urna, sit amet cursus sapien.
          </p>
          <p>
            Integer ut sagittis magna, nec lobortis tortor. Nunc viverra
            facilisis purus a placerat. Vestibulum sit amet luctus ipsum, in
            ultricies magna.
          </p>
        </div>
      </section>
    </main>
  );
};
