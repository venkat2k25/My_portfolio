import { Arrow } from "./Icons";
import { contact, socials } from "../data/content";

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <p className="section-label">Contact</p>
      <h2>Let&rsquo;s talk</h2>
      <p className="contact__lead">
        Happy to talk about functional testing, AI/ML, or full-stack work — reach out anytime.
      </p>
      <div className="contact__actions">
        <a className="btn btn--primary" href={`mailto:${contact.email}`}>
          Email me <Arrow />
        </a>
        <a className="btn btn--secondary" href={contact.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>
      <div className="contact__channels">
        <div>
          <span>Email</span>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
        <div>
          <span>Phone</span>
          <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>{contact.phone}</a>
        </div>
        <div>
          <span>Elsewhere</span>
          {socials
            .filter((social) => social.href.startsWith("http"))
            .map((social, i, arr) => (
              <span key={social.label}>
                <a href={social.href} target="_blank" rel="noreferrer">
                  {social.label}
                </a>
                {i < arr.length - 1 && " · "}
              </span>
            ))}
        </div>
      </div>
    </section>
  );
}
