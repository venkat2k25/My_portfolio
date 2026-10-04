import { useEffect, useRef, useState } from "react";
import useScrollStory from "../hooks/useScrollStory";
import SectionHead from "./SectionHead";
import { Arrow } from "./Icons";
import { contact, socials } from "../data/content";

const TIME_ZONE = "Asia/Kolkata";

/** Text that rolls up to a copy of itself on hover. */
function Roll({ children }) {
  return (
    <span className="roll">
      <span className="roll__in">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </span>
  );
}

function LocalTime() {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(
      new Date()
    );
  const [now, setNow] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setNow(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return <time className="contact__clock">{now} IST</time>;
}

export default function Contact() {
  const root = useRef(null);
  const [copied, setCopied] = useState(false);
  useScrollStory(root);

  const phoneHref = contact.phone ? `tel:${contact.phone.replace(/[^\d+]/g, "")}` : null;
  const links = (socials || []).filter((s) => s.href?.startsWith("http"));

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  }

  return (
    <section className="section contact" id="contact" ref={root}>
      <SectionHead index="06" label="Contact" title="Have something" accent="in mind?" />

      <h3 className="contact__big" data-split="chars">
        Let&rsquo;s talk.
      </h3>

      <a className="contact__mail" href={`mailto:${contact.email}`} data-magnetic="0.12" data-cursor-label="Write">
        <Roll>{contact.email}</Roll>
        <Arrow />
      </a>

      <div className="contact__grid">
        <p className="contact__lead" data-reveal>
          Functional testing, AI/ML, or full-stack work: send a note and I&rsquo;ll get back to you.
        </p>

        <dl className="contact__list" data-stagger>
          <div className="contact__row">
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </dd>
            <button type="button" className="contact__copy" onClick={copyEmail} aria-live="polite" data-magnetic="0.3">
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>

          {phoneHref && (
            <div className="contact__row">
              <dt>Phone</dt>
              <dd>
                <a href={phoneHref}>{contact.phone}</a>
              </dd>
            </div>
          )}

          {links.length > 0 && (
            <div className="contact__row">
              <dt>Elsewhere</dt>
              <dd className="contact__links">
                {links.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                    <Roll>{s.label}</Roll> <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </dd>
            </div>
          )}

          <div className="contact__row">
            <dt>Local time</dt>
            <dd>
              <LocalTime />
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
