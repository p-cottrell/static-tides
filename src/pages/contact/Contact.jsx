// Contact.jsx
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import VFXScope from "../../components/VFXScope/VFXScope.jsx"
import "./Contact.css";


export const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [isSending, setIsSending] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus(null);
    setIsSending(true);

    emailjs
      .sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", form.current, {
        publicKey: "YOUR_PUBLIC_KEY",
      })
      .then(
        () => {
          setStatus("success");
          setIsSending(false);
          form.current.reset();
        },
        (error) => {
          console.error("FAILED...", error?.text || error);
          setIsSending(false);
          setStatus("error");
        }
      );
  };

  return (
    <VFXScope
              selectors="h1"
              strengthDesktop={0.30}
              strengthPhone={0.15}
              mode="scoped"
            >
    <main className="contact" role="main">
      <h1 id="contact-title" className="contact-title">contact me</h1>
      <section className="contact-container" aria-labelledby="contact-title">
        <p className="contact-subtitle">
          Have a gig in mind or just want to say hello? Fill out the form and I’ll get back to you soon.
        </p>

        <form ref={form} onSubmit={sendEmail} className="contact-form" noValidate>
          {/* Two-up on ≥640px */}
          <div className="form-row two-col">
            <div className="field">
              <label htmlFor="user_name">Name</label>
              <input
                id="user_name"
                type="text"
                name="user_name"
                placeholder="Your full name"
                required
                autoComplete="name"
              />
            </div>

            <div className="field">
              <label htmlFor="user_email">Email</label>
              <input
                id="user_email"
                type="email"
                name="user_email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                inputMode="email"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="Type your message…"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-send" disabled={isSending}>
            {isSending ? "Sending…" : "Send Message"}
          </button>

          <p
            className={`form-status ${status || ""}`}
            aria-live="polite"
            aria-atomic="true"
          >
            {status === "success" && "Message sent successfully!"}
            {status === "error" && "Something went wrong. Try again."}
          </p>
        </form>
      </section>
    </main>
    </VFXScope>
  );
};

export default Contact;
