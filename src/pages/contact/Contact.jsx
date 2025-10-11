import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";

export const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState(null); // success | error | null

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", form.current, {
        publicKey: "YOUR_PUBLIC_KEY",
      })
      .then(
        () => {
          setStatus("success");
          form.current.reset();
        },
        (error) => {
          console.error("FAILED...", error.text);
          setStatus("error");
        }
      );
  };

  return (
    <main className="contact">
      <section className="contact-container">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">
          Have a gig in mind or just want to say hello?  
          Fill out the form below and I’ll get back to you soon.
        </p>

        <form ref={form} onSubmit={sendEmail} className="contact-form">
          <label htmlFor="user_name">Name</label>
          <input
            id="user_name"
            type="text"
            name="user_name"
            placeholder="Your full name"
            required
          />

          <label htmlFor="user_email">Email</label>
          <input
            id="user_email"
            type="email"
            name="user_email"
            placeholder="you@example.com"
            required
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="6"
            placeholder="Type your message..."
            required
          />

          <input type="submit" value="Send Message" className="btn-send" />

          {status === "success" && (
            <p className="form-status success"> Message sent successfully!</p>
          )}
          {status === "error" && (
            <p className="form-status error">Something went wrong. Try again.</p>
          )}
        </form>
      </section>
    </main>
  );
};

export default Contact;
