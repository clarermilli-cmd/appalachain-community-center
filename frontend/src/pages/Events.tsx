import { Link } from "react-router-dom";
import "./Events.css";

export default function Events() {
  return (
    <>
      <header className="container events-header">
        <h1 className="site-heading">
          <span className="site-heading-upper">Events</span>
          <span className="site-heading-lower">What's coming up</span>
        </h1>
      </header>

      <section className="container events-section" aria-labelledby="featured-event-title">
        <article className="event-feature">
          <div className="event-feature-copy">
            <p className="event-kicker">Featured event</p>
            <h2 id="featured-event-title" className="event-feature-title">
              Art Connect Slime Workshop
            </h2>
            <p className="event-intro">
              Get creative and make your own slime at Art Connect Community Studio.
              All ages are welcome!
            </p>

            <div className="event-highlights" aria-label="Event date and time">
              <div className="event-highlight">
                <span className="event-highlight-label">When</span>
                <strong>Sunday, December 13, 2026</strong>
              </div>
              <div className="event-highlight">
                <span className="event-highlight-label">Time</span>
                <strong>2:00 PM – 4:00 PM</strong>
              </div>
              <div className="event-highlight">
                <span className="event-highlight-label">Cost</span>
                <strong>$10 per person</strong>
              </div>
            </div>

            <div className="event-info-grid">
              <section className="event-info-block" aria-labelledby="event-location-heading">
                <h3 id="event-location-heading">Where to find us</h3>
                <p>
                  <strong>Art Connect Community Studio</strong>
                  <br />
                  215 Wood Ave E, Suite B
                  <br />
                  Big Stone Gap
                </p>
              </section>

              <section className="event-info-block" aria-labelledby="event-payment-heading">
                <h3 id="event-payment-heading">Payment</h3>
                <p>
                  Venmo
                  <br />
                  <strong className="event-venmo">@APPALACHIANAID</strong>
                </p>
              </section>
            </div>

            <p className="event-proceeds">
              All proceeds go to Appalachian Aid.
            </p>
          </div>

          <aside className="event-flyer" aria-label="Event flyer">
            <a
              className="event-flyer-link"
              href="/images/slime-workshop.jpeg"
              target="_blank"
              rel="noreferrer"
              aria-label="Open the full-size Art Connect Slime Workshop flyer"
            >
              <img
                src="/images/slime-workshop.jpeg"
                alt="Art Connect Slime Workshop flyer with event information"
                loading="eager"
              />
              <span className="event-flyer-hint">View full-size flyer ↗</span>
            </a>
          </aside>
        </article>
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
