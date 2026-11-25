import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents, todayISO } from "../services/api";
import type { CenterEvent } from "../services/api";

// Parse as local time so the date doesn't shift by a day in US time zones
const toDate = (iso: string) => new Date(`${iso}T00:00:00`);

export default function Events() {
  const [events, setEvents] = useState<CenterEvent[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Only events from today onward, soonest first
    getEvents({ from: todayISO() })
      .then((data) => {
        if (!cancelled) setEvents(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <header className="container">
        <h1 className="site-heading">
          <span className="site-heading-upper">Events</span>
          <span className="site-heading-lower">What's coming up</span>
        </h1>
      </header>

      <section className="container pb-5">
        {failed && (
          <p className="lead">
            We couldn't load events right now. Please try again in a moment.
          </p>
        )}

        {!failed && events === null && <p>Loading events&hellip;</p>}

        {events && events.length > 0 && (
          <ul className="event-list">
            {events.map((e) => {
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
                      {d.toLocaleDateString("en-US", { weekday: "long" })}
                      {e.time && `, ${e.time}`}
                      {e.location && ` · ${e.location}`}
                    </p>
                    {e.description && <p className="mb-0">{e.description}</p>}
                    {e.imageUrl && (
                      <img
                        className="event-img"
                        src={e.imageUrl}
                        alt=""
                        loading="lazy"
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {events && events.length === 0 && (
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
