import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ScrollToTop from "./components/scrollToTop";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import AdminEvents from "./pages/AdminEvents";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Navbar />

      <main id="main" className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/programs" element={<Navigate to="/events" replace />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin: not linked from the public menu. It shows its own sign-in. */}
          <Route path="/admin" element={<AdminEvents />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
