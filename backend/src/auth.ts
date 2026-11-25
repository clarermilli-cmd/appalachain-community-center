import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";
import { config } from "./config.ts";
import { db } from "./db.ts";

export const SESSION_COOKIE = "cc_session";
export const SESSION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const cookieOptions = {
  httpOnly: true, // JavaScript on the page can't read it
  sameSite: "lax",
  secure: config.isProd, // HTTPS-only in production
  path: "/",
} as const;

/* ---------- Passwords (scrypt, built into Node) ---------- */

const KEY_LENGTH = 64;

function derive(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (err, key) =>
      err ? reject(err) : resolve(key)
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [saltHex, keyHex] = stored.split(":");
  if (!saltHex || !keyHex) return false;
  const expected = Buffer.from(keyHex, "hex");
  const actual = await derive(password, Buffer.from(saltHex, "hex"));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// Burn the same time as a real check when the email isn't found, so response
// timing doesn't reveal which emails have accounts.
let dummyHash: Promise<string> | undefined;
export async function verifyAgainstDummy(password: string): Promise<void> {
  dummyHash ??= hashPassword(randomBytes(16).toString("hex"));
  await verifyPassword(password, await dummyHash);
}

/* ---------- Sessions (stored in the database, revocable) ---------- */

// Only a hash of the token is stored, so a leaked database can't be used to log in.
const sha256 = (value: string) =>
  createHash("sha256").update(value).digest("hex");

export function createSession(userId: number): string {
  const token = randomBytes(32).toString("hex");
  db.prepare(
    "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)"
  ).run(sha256(token), userId, Date.now() + SESSION_MS);
  return token;
}

export function findSessionUser(
  token: string
): { id: number; email: string } | undefined {
  return db
    .prepare(
      `SELECT u.id AS id, u.email AS email
         FROM sessions s JOIN users u ON u.id = s.user_id
        WHERE s.token_hash = ? AND s.expires_at > ?`
    )
    .get(sha256(token), Date.now()) as unknown as
    | { id: number; email: string }
    | undefined;
}

export function deleteSession(token: string): void {
  db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token));
}

export function purgeExpiredSessions(): void {
  db.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(Date.now());
}

/* ---------- Middleware ---------- */

export const requireAdmin: RequestHandler = (req, res, next) => {
  const token = req.cookies?.[SESSION_COOKIE];
  const user = typeof token === "string" ? findSessionUser(token) : undefined;

  if (!user) {
    res.status(401).json({ error: "Please sign in." });
    return;
  }

  res.locals.user = user;
  next();
};
