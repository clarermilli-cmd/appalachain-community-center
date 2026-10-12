import { Link } from "react-router-dom";

//Keep in sync with Contact.tsx.

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <h2>Appalachian Community Center</h2>
            <p className="mb-0">
              Creating opportunities, providing support, and bringing people
              together.
            </p>
          </div>

          <div className="col-6 col-md-3">
            <h2>Explore</h2>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><Link to="/about">About</Link></li>
              <li className="mb-2"><Link to="/programs">Programs</Link></li>
              <li className="mb-2"><Link to="/events">Events</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-4">
            <h2>Visit</h2>
            <address className="mb-0">
              520 W Main St.
              <br />
              Appalachia, VA 24216
              <br />
              <a href="tel:+2762753594">(276) 275-3594</a>
              <br />
              <a href="mailto:hello@example.org">hello@example.org</a>
            </address>
          </div>
        </div>

        <p className="footer-bottom mb-0">
          &copy; {new Date().getFullYear()} Appalachian Aid Corporation. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}