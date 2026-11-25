// All talk with the backend (events database + photo storage) goes through this file.

import { generateClient } from "aws-amplify/data";
import { getUrl, remove, uploadData } from "aws-amplify/storage";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CenterEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  description: string;
  photoPath: string | null; // where the photo is stored
  imageUrl: string | null; // temporary link for showing the photo
};

export type EventInput = {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
};

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type Row = Schema["CenterEvent"]["type"];

async function toEvent(row: Row): Promise<CenterEvent> {
  let imageUrl: string | null = null;

  if (row.photoPath) {
    try {
      const result = await getUrl({
        path: row.photoPath,
        options: { expiresIn: 3600 },
      });
      imageUrl = result.url.toString();
    } catch {
      imageUrl = null; // a missing photo shouldn't hide the event
    }
  }

  return {
    id: row.id,
    title: row.title,
    date: row.date,
    time: row.time ?? "",
    location: row.location ?? "",
    description: row.description ?? "",
    photoPath: row.photoPath ?? null,
    imageUrl,
  };
}

// Today's date in the visitor's own time zone, as YYYY-MM-DD
export function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// Public visitors use the guest role. Admins (signed in) pass admin: true.
export async function getEvents(
  options: { from?: string; admin?: boolean } = {}
): Promise<CenterEvent[]> {
  const { data, errors } = await client.models.CenterEvent.list({
    authMode: options.admin ? "userPool" : "identityPool",
    filter: options.from ? { date: { ge: options.from } } : undefined,
    limit: 1000,
  });

  if (errors?.length) throw new Error(errors[0].message);

  const events = await Promise.all(data.map(toEvent));
  return events.sort(
    (a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title)
  );
}

// Creates a new event, or updates `existing`. Handles the photo too.
export async function saveEvent(
  input: EventInput,
  options: {
    existing?: CenterEvent | null;
    file?: File | null;
    removePhoto?: boolean;
  } = {}
): Promise<void> {
  const { existing = null, file = null, removePhoto = false } = options;

  let uploadedPath: string | null = null;

  if (file) {
    const extension = EXTENSIONS[file.type];
    if (!extension) throw new Error("Photos must be JPG, PNG or WebP.");
    if (file.size > MAX_PHOTO_BYTES) {
      throw new Error("Photos must be 5 MB or smaller.");
    }

    // Random file name, so names never clash and nothing private leaks into URLs
    uploadedPath = `event-photos/${crypto.randomUUID()}.${extension}`;
    await uploadData({
      path: uploadedPath,
      data: file,
      options: { contentType: file.type },
    }).result;
  }

  const photoPath =
    uploadedPath ?? (removePhoto ? null : (existing?.photoPath ?? null));

  const fields = {
    title: input.title.trim(),
    date: input.date,
    time: input.time.trim(),
    location: input.location.trim(),
    description: input.description.trim(),
    photoPath,
  };

  try {
    const { errors } = existing
      ? await client.models.CenterEvent.update({ id: existing.id, ...fields })
      : await client.models.CenterEvent.create(fields);

    if (errors?.length) throw new Error(errors[0].message);
  } catch (error) {
    // Don't leave an orphaned photo behind if saving the event failed
    if (uploadedPath) await remove({ path: uploadedPath }).catch(() => {});
    throw error;
  }

  // Saved. If the old photo was replaced or removed, delete it from storage.
  if (existing?.photoPath && existing.photoPath !== photoPath) {
    await remove({ path: existing.photoPath }).catch(() => {});
  }
}

export async function deleteEvent(event: CenterEvent): Promise<void> {
  const { errors } = await client.models.CenterEvent.delete({ id: event.id });
  if (errors?.length) throw new Error(errors[0].message);

  if (event.photoPath) {
    await remove({ path: event.photoPath }).catch(() => {});
  }
}
