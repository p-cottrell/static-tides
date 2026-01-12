import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import emailjs from "@emailjs/browser";
import VFXScope from "../../components/VFXScope/VFXScope.jsx";
import "./Contact.css";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const MIN_SUBMIT_MS = 2000;
const MAX_MESSAGE_CHARS = 5000;

export const Contact = () => {
  const siteUrl = "https://tidesofstatic.com";
  const pageUrl = `${siteUrl}/contact`;

  const title = "Contact | Tides of Static";
  const description =
    "Contact Tides of Static for bookings, collaborations, or general enquiries. Send a message via the contact form.";

  const form = useRef();
  const startedAtRef = useRef(Date.now());

  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [isSending, setIsSending] = useState(false);

  // Normalise message content + prevent big blank gaps
  const normalizeMessage = (text) =>
    text
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{2,}/g, "\n")
      .trim();

  const sendEmail = async (e) => {
    e.preventDefault();

    // Guard against double send
    if (isSending) return;

    setStatus(null);
    setIsSending(true);

    // Time-based trap
    const elapsed = Date.now() - startedAtRef.current;
    if (elapsed < MIN_SUBMIT_MS) {
      // Pretend success to avoid teaching bots
      setStatus("success");
      setIsSending(false);
      form.current?.reset();
      return;
    }

    // Honeypot check
    const honeyEl = form.current?.querySelector('input[name="company"]');
    if (honeyEl && honeyEl.value.trim().length > 0) {
      // Pretend success to avoid teaching bots
      setStatus("success");
      setIsSending(false);
      form.current?.reset();
      return;
    }

    // Normalise textarea content + cap length before sending
    const messageEl = form.current?.querySelector('textarea[name="message"]');
    if (messageEl) {
      messageEl.value = normalizeMessage(messageEl.value).slice(0, MAX_MESSAGE_CHARS);
    }

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, {
        publicKey: PUBLIC_KEY,
      });

      setStatus("success");
      form.current?.reset();
      // reset timer after successful submission
      startedAtRef.current = Date.now();
    } catch (error) {
      console.error("EmailJS failed:", error?.status, error?.text || error);
      setStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <VFXScope selectors="h1" strengthDesktop={0.30} strengthPhone={0.15} mode="scoped">
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

      <main className="contact" role="main">
        <h1 id="contact-title" className="contact-title">
          contact me
        </h1>

        <section className="contact-container" aria-labelledby="contact-title">
          <p className="contact-subtitle">
            Have a gig in mind or just want to say hello? Fill out the form and I’ll get
            back to you soon.
          </p>

          <form ref={form} onSubmit={sendEmail} className="contact-form" noValidate>
            <div
              style={{
                position: "absolute",
                left: "-10000px",
                top: "auto",
                width: "1px",
                height: "1px",
                overflow: "hidden",
              }}
              aria-hidden="true"
            >
              <label htmlFor="company">Company</label>
              <input
                id="company"
                type="text"
                name="company"
                tabIndex="-1"
                autoComplete="off"
                defaultValue=""
              />
            </div>

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
                  maxLength={MAX_MESSAGE_CHARS}
                />
              </div>
            </div>

            <button type="submit" className="btn-send" disabled={isSending}>
              {isSending ? "Sending…" : "Send Message"}
            </button>

            <p className={`form-status ${status || ""}`} aria-live="polite" aria-atomic="true">
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
