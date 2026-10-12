import { Link } from "react-router-dom";

// TODO: sample events. Replace with real ones (or load them from the backend later).
// Dates are ISO (YYYY-MM-DD). Past events are hidden automatically.

type CenterEvent = {
  id: string;
  date: string;
  time: string;
  title: string;
  location: string;
  description: string;
};

const events: CenterEvent[] = [
  {
    id: "harvest-supper",
    date: "2026-10-24",
    time: "5:00 to 8:00 pm",
    title: "Harvest supper",
    location: "Main hall",
    description:
      "A community meal with soup, cornbread and desserts. Bring a dish to share if you can.",
  },
  {
    id: "resume-clinic",
    date: "2026-11-07",
    time: "10:00 am to 12:00 pm",
    title: "Resume and job search clinic",
    location: "Computer room",
    description:
      "Volunteers help you update your resume and apply for jobs online. Walk-ins welcome.",
  },
  {
    id: "family-game-night",
    date: "2026-11-14",
    time: "5:00 to 8:00 pm",
    title: "Family game night",
    location: "Main hall",
    description:
      "Board games, snacks and a big open floor for kids. All ages welcome.",
  },
  {
    id: "holiday-market",
    date: "2026-12-05",
    time: "10:00 am to 3:00 pm",
    title: "Holiday makers' market",
    location: "Main hall and lawn",
    description:
      "Handmade gifts from local artists and growers. Table sign-ups are open now.",
  },
];

// Parse as local time so the date doesn't shift by a day in US time zones
const toDate = (iso: string) => new Date(`${iso}T00:00:00`);

export default function Events() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = events
    .filter((e) => toDate(e.date) >= today)
    .sort((a, b) => toDate(a.date).getTime() - toDate(b.date).getTime());

  return (
    <>
      <header className="container">
        <h1 className="site-heading">
          <span className="site-heading-upper">Events</span>
          <span className="site-heading-lower">What's coming up</span>
        </h1>
      </header>

      <section className="container pb-5">
        {upcoming.length > 0 ? (
          <ul className="event-list">
            {upcoming.map((e) => {
              const d = toDate(e.date);
              return (
                <li key={e.id} className="event">
                  <time className="event-date" dateTime={e.date}>
                    <span className="event-month">
                      {d.toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="event-day">{d.getDate()}</span>
                  </time>

                  <div>
                    <h2 className="event-title">{e.title}</h2>
                    <p className="event-meta">
                      {d.toLocaleDateString("en-US", { weekday: "long" })},{" "}
                      {e.time} &middot; {e.location}
                    </p>
                    <p className="mb-0">{e.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="lead">
            No events are scheduled right now. Check back soon, or get in
            touch to hear about what's planned.
          </p>
        )}
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-inner text-center">
            <h2>Want to host an event?</h2>
            <p className="mx-auto prose">
              Our spaces are available to neighbors, clubs and local groups.
              Tell us what you have in mind.
            </p>
            <Link to="/contact" className="btn btn-primary btn-lg">
              Ask about booking
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}