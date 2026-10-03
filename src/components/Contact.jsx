import { useRef, useState } from "react";
import useScrollStory from "../hooks/useScrollStory";
import { contact, socials } from "../data/content";

const css = `
.contact {
  --c-rule: color-mix(in srgb, currentColor 18%, transparent);
  --c-muted: color-mix(in srgb, currentColor 64%, transparent);
  --c-hover: color-mix(in srgb, currentColor 6%, transparent);

  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow-x: clip;
  padding: clamp(4rem, 10vw, 9rem) clamp(1.25rem, 5vw, 4rem);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(2.5rem, 6vw, 4rem);
}
.contact *, .contact *::before, .contact *::after { box-sizing: border-box; }

/* Intro */
.contact__intro { min-width: 0; max-width: 36rem; }
.contact h2 {
  margin: 0.25em 0 0.35em;
  font-size: clamp(2.75rem, 9vw, 6.25rem);
  line-height: 0.96;
  letter-spacing: -0.035em;
  font-weight: 600;
  overflow-wrap: break-word;
}
.contact__lead {
  margin: 0 0 2rem;
  max-width: 32rem;
  font-size: clamp(1.05rem, 2.2vw, 1.25rem);
  line-height: 1.6;
  color: var(--c-muted);
}
.contact__actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.contact__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  padding: 0 1.5rem;
  border-radius: 999px;
  font: inherit;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid currentColor;
  color: inherit;
  background: transparent;
  transition: background-color .18s ease, color .18s ease;
}
.contact__btn--solid { background: currentColor; }
.contact__btn--solid span { color: var(--c-bg, #0b0b0c); mix-blend-mode: normal; }
.contact__btn:hover { background: var(--c-hover); }
.contact__btn--solid:hover { background: currentColor; opacity: .88; }

/* Directory */
.contact__list { margin: 0; padding: 0; min-width: 0; border-top: 1px solid var(--c-rule); }
.contact__row {
  display: grid;
  grid-template-columns: minmax(6.5rem, 0.28fr) minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.5rem 1.5rem;
  padding: 1.35rem 0;
  border-bottom: 1px solid var(--c-rule);
}
.contact__row dt { font-size: 0.95rem; color: var(--c-muted); }
.contact__row dd {
  margin: 0;
  min-width: 0;
  font-size: clamp(1.1rem, 2.6vw, 1.55rem);
  line-height: 1.3;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
}
.contact__row a {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: .28em;
  transition: text-decoration-color .15s ease;
}
.contact__row a:hover, .contact__row a:focus-visible { text-decoration-color: currentColor; }
.contact__links { display: flex; flex-wrap: wrap; gap: .25rem 1.5rem; }
.contact__copy {
  font: inherit;
  font-size: .85rem;
  padding: .4rem .85rem;
  border-radius: 999px;
  border: 1px solid var(--c-rule);
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: background-color .15s ease, border-color .15s ease;
}
.contact__copy:hover { background: var(--c-hover); border-color: currentColor; }

.contact a:focus-visible, .contact button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

/* Phones */
@media (max-width: 559px) {
  .contact__row { grid-template-columns: minmax(0, 1fr) auto; }
  .contact__row dt { grid-column: 1 / -1; }
  .contact__actions .contact__btn { flex: 1 1 100%; }
}

/* Desktop: headline left, directory right */
@media (min-width: 900px) {
  .contact {
    grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
    align-items: end;
    column-gap: clamp(3rem, 6vw, 6rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact * { transition: none !important; }
}
`;

export default function Contact() {
  const root = useRef(null);
  const [copied, setCopied] = useState(false);
  useScrollStory(root);

  const phoneHref = contact.phone
    ? `tel:${contact.phone.replace(/[^\d+]/g, "")}`
    : null;
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
    <section className="contact" id="contact" ref={root}>
      <style>{css}</style>

      <div className="contact__intro">
        <p className="section-label">Contact</p>
        <h2 data-zoom>Let&rsquo;s talk</h2>
        <p className="contact__lead" data-reveal>
          Functional testing, AI/ML, or full-stack work: send a note and
          I&rsquo;ll get back to you.
        </p>
        <div className="contact__actions" data-reveal>
          <a
            className="contact__btn contact__btn--solid"
            href={`mailto:${contact.email}`}
          >
            <span>Email me</span>
          </a>
          {contact.linkedin && (
            <a
              className="contact__btn"
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>

      <dl className="contact__list" data-stagger>
        <div className="contact__row">
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </dd>
          <button
            type="button"
            className="contact__copy"
            onClick={copyEmail}
            aria-live="polite"
          >
            {copied ? "Copied" : "Copy"}
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
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}