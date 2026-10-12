import { useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/events", label: "Events" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  // Close the mobile menu after navigating (Bootstrap won't do this on its own
  // because React Router changes pages without a reload)
  useEffect(() => {
    document.getElementById("mainNav")?.classList.remove("show");

    const toggler = document.querySelector(".navbar-toggler");
    toggler?.classList.add("collapsed");
    toggler?.setAttribute("aria-expanded", "false");
  }, [pathname]);

  return (
    <nav className="navbar navbar-expand-lg" aria-label="Main">
      <div className="container">
        <Link className="navbar-brand" to="/" aria-label="Appalachian Community Center, home">
          <svg
            className="brand-mark"
            width="42"
            height="42"
            viewBox="0 0 40 40"
            aria-hidden="true"
          >
            <path
              d="M2 32 15 10l7 11 5-8 11 19z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="31" cy="8" r="3.5" style={{ fill: "var(--cc-amber)" }} />
          </svg>
          <span className="brand-text">
            <span className="brand-name">Appalachian</span>
            <span className="brand-sub">Community Center</span>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {links.map((link) => (
              <li className="nav-item" key={link.to}>
                {/* NavLink adds the "active" class on the current page */}
                <NavLink className="nav-link" to={link.to} end={link.end}>
                  {link.label}
                </NavLink>
              </li>
            ))}

            <li className="nav-item">
              <NavLink className="nav-link nav-contact" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}