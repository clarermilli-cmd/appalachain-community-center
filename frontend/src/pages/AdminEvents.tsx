import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import {
  MAX_PHOTO_BYTES,
  deleteEvent,
  getEvents,
  saveEvent,
  todayISO,
} from "../services/api";
import type { CenterEvent } from "../services/api";

type FormState = {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
};

const emptyForm: FormState = {
  title: "",
  date: "",
  time: "",
  location: "",
  description: "",
};

// Parse as local time so the date doesn't shift by a day
const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const messageFrom = (err: unknown) =>
  err instanceof Error && err.message
    ? err.message
    : "Something went wrong. Please try again.";

/* ---------- Page: sign-in screen, then the dashboard ---------- */

export default function AdminEvents() {
  return (
    <>
      <meta name="robots" content="noindex" />

      <header className="container">
        <h1 className="site-heading">
          <span className="site-heading-upper">Admin</span>
          <span className="site-heading-lower">Manage events</span>
        </h1>
      </header>

      <section className="container pb-5 mb-5">
        {/* Sign-up is hidden here, and also switched off on the server */}
        <Authenticator hideSignUp>
          {({ signOut, user }) => (
            <Dashboard
              email={user?.signInDetails?.loginId ?? ""}
              onSignOut={() => signOut?.()}
            />
          )}
        </Authenticator>
      </section>
    </>
  );
}

/* ---------- Dashboard (only rendered once signed in) ---------- */

function Dashboard({
  email,
  onSignOut,
}: {
  email: string;
  onSignOut: () => void;
}) {
  const [events, setEvents] = useState<CenterEvent[] | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState<CenterEvent | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [fileKey, setFileKey] = useState(0); // changing this clears the file input
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const load = useCallback(async () => {
    try {
      setEvents(await getEvents({ admin: true }));
    } catch (err) {
      setError(messageFrom(err));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
    setFile(null);
    setRemovePhoto(false);
    setFileKey((key) => key + 1);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0] ?? null;

    if (chosen && chosen.size > MAX_PHOTO_BYTES) {
      setError("Photos must be 5 MB or smaller.");
      e.target.value = "";
      setFile(null);
      return;
    }

    setError("");
    setFile(chosen);
  };

  const startEdit = (event: CenterEvent) => {
    setEditing(event);
    setForm({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
    });
    setFile(null);
    setRemovePhoto(false);
    setFileKey((key) => key + 1);
    setError("");
    setNotice("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    try {
      await saveEvent(form, { existing: editing, file, removePhoto });
      setNotice(editing ? "Event updated." : "Event added.");
      resetForm();
      await load();
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (event: CenterEvent) => {
    if (!window.confirm(`Delete "${event.title}"? This can't be undone.`)) return;

    setError("");
    setNotice("");

    try {
      await deleteEvent(event);
      if (editing?.id === event.id) resetForm();
      setNotice("Event deleted.");
      await load();
    } catch (err) {
      setError(messageFrom(err));
    }
  };

  const today = todayISO();
  const showCurrentPhoto = editing?.imageUrl && !removePhoto && !file;

  return (
    <>
      <p className="d-flex flex-wrap align-items-center gap-3 mb-4">
        <span>Signed in as {email}</span>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={onSignOut}
        >
          Sign out
        </button>
      </p>

      <div className="row g-5">
        {/* Add / edit form */}
        <div className="col-lg-5">
          <form ref={formRef} onSubmit={handleSubmit}>
            <h2>{editing ? "Edit event" : "Add an event"}</h2>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {notice && (
              <div className="alert alert-success" role="status">
                {notice}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                id="title"
                name="title"
                className="form-control"
                maxLength={120}
                required
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <label htmlFor="date" className="form-label">
                  Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className="form-control"
                  required
                  value={form.date}
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-6">
                <label htmlFor="time" className="form-label">
                  Time
                </label>
                <input
                  id="time"
                  name="time"
                  className="form-control"
                  placeholder="5:00 to 8:00 pm"
                  maxLength={60}
                  value={form.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                id="location"
                name="location"
                className="form-control"
                maxLength={120}
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows={4}
                maxLength={2000}
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="form-label">
                Photo{" "}
                <span className="fw-normal">
                  (optional, JPG, PNG or WebP, up to 5 MB)
                </span>
              </label>

              {showCurrentPhoto && editing?.imageUrl && (
                <div className="d-flex align-items-center gap-3 mb-2">
                  <img
                    className="admin-thumb"
                    src={editing.imageUrl}
                    alt="Current event photo"
                  />
                  <div className="form-check">
                    <input
                      id="removePhoto"
                      type="checkbox"
                      className="form-check-input"
                      checked={removePhoto}
                      onChange={(e) => setRemovePhoto(e.target.checked)}
                    />
                    <label htmlFor="removePhoto" className="form-check-label">
                      Remove this photo
                    </label>
                  </div>
                </div>
              )}

              <input
                key={fileKey}
                id="image"
                type="file"
                className="form-control"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFile}
              />
              {editing?.imageUrl && (
                <div className="form-text">
                  Choosing a new photo replaces the current one.
                </div>
              )}
            </div>

            <div className="d-flex flex-wrap gap-2">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? "Saving…" : editing ? "Save changes" : "Add event"}
              </button>
              {editing && (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing events */}
        <div className="col-lg-7">
          <h2>All events</h2>

          {events === null && <p>Loading&hellip;</p>}

          {events?.length === 0 && (
            <p>No events yet. Add your first one using the form.</p>
          )}

          {events && events.length > 0 && (
            <ul className="list-unstyled p-0 m-0">
              {events.map((event) => (
                <li key={event.id} className="admin-event">
                  {event.imageUrl && (
                    <img className="admin-thumb" src={event.imageUrl} alt="" />
                  )}

                  <div className="admin-event-body">
                    <h3 className="h5 mb-1">
                      {event.title}
                      {event.date < today && (
                        <span className="badge text-bg-secondary ms-2">Past</span>
                      )}
                    </h3>
                    <p className="mb-0 small">
                      {formatDate(event.date)}
                      {event.time && ` · ${event.time}`}
                      {event.location && ` · ${event.location}`}
                    </p>
                  </div>

                  <div className="admin-event-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => startEdit(event)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(event)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
