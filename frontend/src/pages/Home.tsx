import { Link } from "react-router-dom";

// To add a hero photo: import it, then uncomment the <img> in the hero.
// import heroImage from "../assets/hero.jpg";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero hero--sun">
        {/* <img className="hero-media" src={heroImage} alt="Neighbors gathered at the community center" /> */}
        <div className="container hero-content">
          <p className="hero-kicker">Serving our Appalachian community</p>
          <h1>Together we grow</h1>
          <p className="hero-lead">
            The Appalachian Community Center is dedicated to creating
            opportunities, providing support, and bringing people together
            throughout our community.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Link to="/programs" className="btn btn-light btn-lg">
              Explore our programs
            </Link>
            <Link to="/events" className="btn btn-light btn-lg">
              See upcoming events
            </Link>
          </div>
        </div>
      </section>
      

      {/* Mission + key facts */}
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

          {/* TODO: placeholder facts */}
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
        </div>
      </section>

      {/* Where to go next. Swap each placeholder div for an <img className="tile-img"> */}
      <section className="page-section page-section--tint">
        <div className="container">
          <h2 className="mb-4">Find your place</h2>

          <div className="tile-grid">
            <Link to="/programs" className="tile">
              <div className="tile-img" role="img" aria-label="Programs" />
              <div className="tile-body">
                <h3 className="tile-title">Programs</h3>
                <p className="tile-meta">
                  Classes, tutoring, meals and more for every age.
                </p>
              </div>
            </Link>

            <Link to="/events" className="tile">
              <div className="tile-img" role="img" aria-label="Events" />
              <div className="tile-body">
                <h3 className="tile-title">Events</h3>
                <p className="tile-meta">
                  Suppers, workshops and markets open to everyone.
                </p>
              </div>
            </Link>

            <Link to="/about" className="tile">
              <div className="tile-img" role="img" aria-label="About us" />
              <div className="tile-body">
                <h3 className="tile-title">About us</h3>
                <p className="tile-meta">
                  Learn how the center started and what we care about.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to action */}
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