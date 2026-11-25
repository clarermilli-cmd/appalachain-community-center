
import { Link } from "react-router-dom";

export default function Events() {
  return (
    <>
      <header className="container">
        <h1 className="site-heading">
          <span className="site-heading-upper">Events</span>
          <span className="site-heading-lower">
            What's coming up
          </span>
        </h1>
      </header>

      <section className="container pb-5">
        <ul className="event-list">
          <li className="event">
            <div>
              <h2 className="event-title">
                Art Connect Slime Workshop
              </h2>

              <p className="event-meta">
                Sunday, December 13, 2026
                <br />
                2:00 PM – 4:00 PM
                <br />
                All ages welcome!
              </p>

              <p>
                Join us for a fun Slime Workshop at Art Connect
                Community Studio!
              </p>

              <p>
                <strong>Location:</strong>
                <br />
                Art Connect Community Studio
                <br />
                215 Wood Ave E, Suite B
                <br />
                Big Stone Gap
              </p>

              <p>
                <strong>Cost:</strong> $10 per person
              </p>

              <p>
                <strong>Payment:</strong>
                <br />
                Venmo: @APPALACHIANAID
              </p>

              <p>
                All proceeds go to Appalachian Aid.
              </p>

              <img
                className="event-img"
                src="/images/slime-workshop.jpeg"
                alt="Art Connect Slime Workshop flyer"
                loading="lazy"
              />
            </div>
          </li>
        </ul>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-inner text-center">
            <h2>Want to host an event?</h2>

            <p className="mx-auto prose">
              Our spaces are available to neighbors, clubs and
              local groups. Tell us what you have in mind.
            </p>

            <Link
              to="/contact"
              className="btn btn-primary btn-lg"
            >
              Ask about booking
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
