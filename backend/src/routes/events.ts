import { randomUUID } from "node:crypto";
import { mkdirSync, rmSync } from "node:fs";
import { basename, join } from "node:path";
import { Router } from "express";
import type { Request } from "express";
import multer from "multer";
import { z } from "zod";
import { requireAdmin } from "../auth.ts";
import { config } from "../config.ts";
import { db } from "../db.ts";
import { HttpError } from "../errors.ts";

export const eventsRouter = Router();

/* ---------- Types and helpers ---------- */

type EventRow = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string | null;
};

const toApi = (row: EventRow) => ({
  id: row.id,
  title: row.title,
  date: row.date,
  time: row.time,
  location: row.location,
  description: row.description,
  imageUrl: row.image ? `/uploads/${row.image}` : null,
});

const getEvent = (id: number) =>
  db.prepare("SELECT * FROM events WHERE id = ?").get(id) as unknown as
    | EventRow
    | undefined;

function parseId(value: string | undefined): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw new HttpError(400, "Invalid event id.");
  }
  return id;
}

function removeUpload(filename: string | null | undefined): void {
  if (!filename) return;
  // basename() guarantees we can only ever delete inside the uploads folder
  rmSync(join(config.uploadDir, basename(filename)), { force: true });
}

/* ---------- Validation ---------- */

const isRealDate = (value: string) => {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const eventSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120, "Title is too long."),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.")
    .refine(isRealDate, "Choose a valid date."),
  time: z.string().trim().max(60, "Time is too long.").default(""),
  location: z.string().trim().max(120, "Location is too long.").default(""),
  description: z.string().trim().max(2000, "Description is too long.").default(""),
});

// If the form is invalid, don't leave the just-uploaded photo behind
function parseBody(req: Request) {
  try {
    return eventSchema.parse(req.body);
  } catch (error) {
    removeUpload(req.file?.filename);
    throw error;
  }
}

/* ---------- Image uploads ---------- */

mkdirSync(config.uploadDir, { recursive: true });

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: config.uploadDir,
    // Random names: we never use the filename the browser sent
    filename: (_req, file, cb) =>
      cb(null, `${randomUUID()}${EXTENSIONS[file.mimetype]}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype in EXTENSIONS) {
      cb(null, true);
    } else {
      cb(new HttpError(400, "Photos must be JPG, PNG or WebP."));
    }
  },
});

/* ---------- Routes ---------- */

// Public. Optional ?from=YYYY-MM-DD returns only events on or after that date.
eventsRouter.get("/", (req, res) => {
  const from =
    typeof req.query.from === "string" && /^\d{4}-\d{2}-\d{2}$/.test(req.query.from)
      ? req.query.from
      : null;

  const rows = (
    from
      ? db
          .prepare("SELECT * FROM events WHERE date >= ? ORDER BY date, id")
          .all(from)
      : db.prepare("SELECT * FROM events ORDER BY date, id").all()
  ) as unknown as EventRow[];

  res.json(rows.map(toApi));
});

// Everything below requires an admin session. requireAdmin runs before the
// upload middleware so signed-out visitors can't write files to the disk.
eventsRouter.post("/", requireAdmin, upload.single("image"), (req, res) => {
  const data = parseBody(req);

  const result = db
    .prepare(
      "INSERT INTO events (title, date, time, location, description, image) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(
      data.title,
      data.date,
      data.time,
      data.location,
      data.description,
      req.file?.filename ?? null
    );

  const created = getEvent(Number(result.lastInsertRowid));
  res.status(201).json(toApi(created!));
});

eventsRouter.put("/:id", requireAdmin, upload.single("image"), (req, res) => {
  const id = parseId(req.params.id);
  const existing = getEvent(id);

  if (!existing) {
    removeUpload(req.file?.filename);
    throw new HttpError(404, "Event not found.");
  }

  const data = parseBody(req);

  let image = existing.image;
  if (req.file) {
    removeUpload(existing.image);
    image = req.file.filename;
  } else if (req.body?.removeImage === "true") {
    removeUpload(existing.image);
    image = null;
  }

  db.prepare(
    `UPDATE events
        SET title = ?, date = ?, time = ?, location = ?, description = ?,
            image = ?, updated_at = datetime('now')
      WHERE id = ?`
  ).run(data.title, data.date, data.time, data.location, data.description, image, id);

  res.json(toApi(getEvent(id)!));
});

eventsRouter.delete("/:id", requireAdmin, (req, res) => {
  const id = parseId(req.params.id);
  const existing = getEvent(id);
  if (!existing) throw new HttpError(404, "Event not found.");

  db.prepare("DELETE FROM events WHERE id = ?").run(id);
  removeUpload(existing.image);
  res.status(204).end();
});
