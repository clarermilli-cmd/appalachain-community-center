import { useState } from "react";
import { Link } from "react-router-dom";

// TODO: sample programs. Replace with the center's real offerings.

const audiences = ["All", "Youth", "Adults", "Seniors", "Families"] as const;
type Audience = (typeof audiences)[number];
type ProgramAudience = Exclude<Audience, "All">;

type Program = {
  id: string;
  name: string;
  audience: ProgramAudience;
  ages: string;
  schedule: string;
  description: string;
};

const programs: Program[] = [
  {
    id: "homework-help",
    name: "After-school homework help",
    audience: "Youth",
    ages: "Ages 6 to 14",
    schedule: "Mon to Thu, 3:30 to 5:30 pm",
    description:
      "A quiet space, a snack and volunteer tutors for reading, math and projects.",
  },
  {
    id: "teen-night",
    name: "Teen night",
    audience: "Youth",
    ages: "Ages 13 to 18",
    schedule: "Fridays, 6 to 9 pm",
    description:
      "Open gym, music and games with mentors who know the neighborhood.",
  },
  {
    id: "computer-basics",
    name: "Computer basics and job help",
    audience: "Adults",
    ages: "Ages 18+",
    schedule: "Tuesdays, 10 am to noon",
    description:
      "Learn email, online forms and resume writing, with one-on-one help.",
  },
  {
    id: "community-garden",
    name: "Community garden",
    audience: "Adults",
    ages: "Ages 16+",
    schedule: "Saturdays, 9 to 11 am",
    description:
      "Plant, tend and harvest together. Beds and tools are free to use.",
  },
  {
    id: "senior-lunch",
    name: "Senior lunch and gentle fitness",
    audience: "Seniors",
    ages: "Ages 60+",
    schedule: "Wednesdays, 11 am to 1 pm",
    description:
      "A hot lunch after a low-impact movement class. Chairs provided.",
  },
  {
    id: "family-game-night",
    name: "Family game night",
    audience: "Families",
    ages: "All ages",
    schedule: "First Saturday, 5 to 8 pm",
    description:
      "Board games, a shared dinner and plenty of space for little ones to run.",
  },
];

export default function Programs() {
  const [selected, setSelected] = useState<Audience>("All");

  const visible =
    selected === "All"
      ? programs
      : programs.filter((p) => p.audience === selected);

  return (
    <>
      <header className="container">
        <h1 className="site-heading">
          <span className="site-heading-upper">Programs</span>
          <span className="site-heading-lower">Something for everyone</span>
        </h1>
      </header>

      <section className="container pb-5">
        <p className="lead prose">
          Our programs are free or low cost. Pick a group to see what is on
          offer, then stop by or get in touch to sign up.
        </p>

        {/* Filter */}
        <div
          className="d-flex flex-wrap gap-2 my-4"
          role="group"
          aria-label="Filter programs by audience"
        >
          {audiences.map((a) => (
            <button
              key={a}
              type="button"
              className={`btn btn-sm ${
                selected === a ? "btn-primary" : "btn-outline-primary"
              }`}
              aria-pressed={selected === a}
              onClick={() => setSelected(a)}
            >
              {a}
            </button>
          ))}
        </div>

        <p className="visually-hidden" aria-live="polite">
          Showing {visible.length} programs
        </p>

        {/* Program cards. Swap each placeholder div for an <img className="tile-img"> */}
        <div className="tile-grid">
          {visible.map((p) => (
            <article key={p.id} className="tile">
              <div
                className="tile-img"
                role="img"
                aria-label={p.name}
              />
              <div className="tile-body">
                <h2 className="tile-title">{p.name}</h2>
                <p className="tile-meta">
                  {p.ages} &middot; {p.schedule}
                </p>
                <p className="mt-2 mb-0">{p.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-inner text-center">
            <h2>Have an idea for a program?</h2>
            <p className="mx-auto prose">
              If you have a skill to share or something you wish we offered,
              we would like to hear from you.
            </p>
            <Link to="/contact" className="btn btn-primary btn-lg">
              Tell us your idea
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}