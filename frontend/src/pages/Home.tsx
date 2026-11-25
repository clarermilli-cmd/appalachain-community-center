import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="hero hero--sun">
        <div className="container hero-content">
          <p className="hero-kicker">Serving our Appalachian community</p>
          <h1>Together we grow</h1>
          <p className="hero-lead">
            The Appalachian Community Center is dedicated to creating
            opportunities, providing support, and bringing people together
            throughout our community.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Link to="/about" className="btn btn-light btn-lg">
              Learn about us
            </Link>
            <Link to="/events" className="btn btn-light btn-lg">
              See upcoming events
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <h2 className="section-heading">
            <span className="section-heading-upper">
              Community, support and opportunity
            </span>
            <span className="section-heading-lower">Our mission</span>
          </h2>

          <p className="lead prose">
            We are committed to building a welcoming community where
            individuals and families can find resources, connect with one
            another, and discover opportunities to grow and thrive.
          </p>

          <dl className="facts mt-4">
            <div>
              <dt>Who we serve</dt>
              <dd>All ages</dd>
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
        </div>
      </section>

      <section className="page-section page-section--tint">
        <div className="container">
          <h2 className="mb-4">Find your place</h2>

          <div className="tile-grid">
            <Link to="/events" className="tile">
              <div className="tile-img" role="img" aria-label="Events" />
              <div className="tile-body">
                <h3 className="tile-title">Events</h3>
                <p className="tile-meta">
                  Workshops and gatherings open to the community.
                </p>
              </div>
            </Link>

            <Link to="/about" className="tile">
              <div className="tile-img" role="img" aria-label="About us" />
              <div className="tile-body">
                <h3 className="tile-title">About us</h3>
                <p className="tile-meta">
                  Learn about the center and what we care about.
                </p>
              </div>
            </Link>

            <Link to="/contact" className="tile">
              <div className="tile-img" role="img" aria-label="Contact us" />
              <div className="tile-body">
                <h3 className="tile-title">Get in touch</h3>
                <p className="tile-meta">
                  Ask a question, share an idea, or find out how to connect.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-inner text-center">
            <h2>Visit us or get involved</h2>
            <p className="mx-auto prose">
              Stop by during open hours, volunteer your time, or ask how we
              can help.
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
