import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

// TODO: placeholder address, phone, email and hours. Replace with real details.

type FormState = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  topic: "",
  message: "",
};

const topics = [
  "General question",
  "Join a program",
  "Book a room or host an event",
  "Volunteer",
  "Something else",
];

const hours = [
  { days: "Monday to Thursday", time: "9 am to 8 pm" },
  { days: "Friday", time: "9 am to 6 pm" },
  { days: "Saturday", time: "10 am to 4 pm" },
  { days: "Sunday", time: "Closed" },
];

export default function Contact() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formNotice, setFormNotice] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Do not claim delivery until a real message service is configured.
    setFormNotice(
      "Your message has not been sent yet because this form is not connected. Please check back soon."
    );
  };

  return (
    <>
      <header className="container">
        <h1 className="site-heading">
          <span className="site-heading-upper">Contact</span>
          <span className="site-heading-lower">Let's talk</span>
        </h1>
      </header>

      <section className="container pb-5 mb-5">
        <div className="row g-5">
          {/* Form */}
          <div className="col-lg-7">
            <h2>Send us a message</h2>
            <p>We usually reply within two business days.</p>

            {formNotice && (
              <div className="alert alert-warning" role="alert">
                {formNotice}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-control"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label">
                    Phone <span className="fw-normal">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-control"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="topic" className="form-label">
                    What is this about?
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    className="form-select"
                    required
                    value={form.topic}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Choose a topic
                    </option>
                    {topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-control"
                    rows={6}
                    required
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Send message
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Visit info */}
          <div className="col-lg-5">
            <h2>Visit us</h2>
            <p className="mb-4">
              Verified address, phone number, and email details are being
              updated. Please check back soon.
            </p>

            <h2 className="h4">Hours</h2>
            <ul className="list-hours">
              {hours.map((h) => (
                <li key={h.days} className="list-hours-item">
                  <span>{h.days}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}