import type { ReactNode } from "react";
import { Link } from "react-router-dom";

// TODO: all copy below is placeholder. Replace with the center's real details.

type Pillar = {
  title: string;
  text: string;
  tone: "forest" | "amber" | "blue";
  icon: ReactNode;
};

const pillars: Pillar[] = [
  {
    title: "Welcome",
    text: "Every neighbor has a seat at the table, whatever their age, background or budget.",
    tone: "forest",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    title: "Learning",
    text: "Homework help, skills classes and workshops led by people who live here.",
    tone: "amber",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 6c-1.5-1.3-3.5-2-6-2H3v14h3c2.5 0 4.5.7 6 2 1.5-1.3 3.5-2 6-2h3V4h-3c-2.5 0-4.5.7-6 2zM12 6v14" />
      </svg>
    ),
  },
  {
    title: "Together",
    text: "Meals, music and game nights that turn neighbors into friends.",
    tone: "blue",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2 20c0-3.6 3-6 7-6s7 2.4 7 6z" />
        <circle cx="17.5" cy="9" r="2.5" />
        <path d="M17 14c3 0 5 1.8 5 4.5V20h-4" />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <>
      {/* Page title */}
      <header className="container">
        <h1 className="site-heading">
          <span className="site-heading-upper">About</span>
          <span className="site-heading-lower">Our community center</span>
        </h1>
      </header>

      {/* Intro + key facts */}
      <section className="container pb-5">
        <p className="lead prose">
          Appalachian Community Center is a gathering place for the whole
          neighborhood. We offer classes, meals, events and a quiet room to
          get things done, all run by neighbors for neighbors.
        </p>

        <dl className="facts mt-4">
          <div>
            <dt>Who we serve</dt>
            <dd>All ages</dd>
          </div>
          <div>
            <dt>Programs</dt>
            <dd>20+ every month</dd>
          </div>
          <div>
            <dt>Cost</dt>
            <dd>Free or sliding scale</dd>
          </div>
          <div>
            <dt>Open</dt>
            <dd>Monday to Saturday</dd>
          </div>
        </dl>
      </section>

      {/* Our story: swap the placeholder div for an <img className="media-split-img"> */}
      <section className="page-section pt-0">
        <div className="container">
          <div className="media-split">
            <div
              className="media-split-img"
              role="img"
              aria-label="Neighbors gathered at the community center"
              style={{ backgroundColor: "var(--cc-sage)" }}
            />
            <div>
              <h2>How we started</h2>
              <p>
                The center began with a handful of neighbors and a borrowed
                room. They wanted a dependable place for kids to do homework,
                for older residents to share a meal, and for everyone to meet
                the people on their own street.
              </p>
              <p>
                Today we still run on that idea. Volunteers lead most of our
                programs, local businesses help keep the doors open, and the
                schedule grows with whatever the community asks for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we stand for */}
      <section className="page-section page-section--tint">
        <div className="container">
          <h2 className="mb-4">What we care about</h2>
          <div className="pillars">
            {pillars.map((p) => (
              <div key={p.title} className={`pillar pillar--${p.tone}`}>
                <span className="pillar-icon">{p.icon}</span>
                <h3 className="pillar-title">{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="page-section">
        <div className="container">
          <blockquote className="pull-quote">
            <p>
              “This is where my kids found their friends and where I found
              mine. It feels like an extension of home.”
            </p>
            <footer>Add a neighbor's name, Community member</footer>
          </blockquote>
        </div>
      </section>

      {/* Call to action */}
      <section className="cta">
        <div className="container">
          <div className="cta-inner text-center">
            <h2>Come see for yourself</h2>
            <p className="mx-auto prose">
              Drop in during open hours, or tell us what you would like to see
              here.
            </p>
            <Link to="/contact" className="btn btn-primary btn-lg">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}