import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import {
  SESSION_COOKIE,
  SESSION_MS,
  cookieOptions,
  createSession,
  deleteSession,
  requireAdmin,
  verifyAgainstDummy,
  verifyPassword,
} from "../auth.ts";
import { db } from "../db.ts";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().max(254),
  password: z.string().min(1).max(200),
});

// Slows down password guessing: 10 attempts per 15 minutes per IP address
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Please try again in a few minutes." },
});

authRouter.post("/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Enter your email and password." });
    return;
  }

  const { email, password } = parsed.data;
  const user = db
    .prepare("SELECT id, email, password_hash FROM users WHERE email = ?")
    .get(email) as unknown as
    | { id: number; email: string; password_hash: string }
    | undefined;

  let valid = false;
  if (user) {
    valid = await verifyPassword(password, user.password_hash);
  } else {
    await verifyAgainstDummy(password);
  }

  if (!user || !valid) {
    // Same message for both cases so attackers can't tell which emails exist
    res.status(401).json({ error: "Incorrect email or password." });
    return;
  }

  const previous = req.cookies?.[SESSION_COOKIE];
  if (typeof previous === "string") deleteSession(previous);

  const token = createSession(user.id);
  res.cookie(SESSION_COOKIE, token, { ...cookieOptions, maxAge: SESSION_MS });
  res.json({ email: user.email });
});

authRouter.post("/logout", (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (typeof token === "string") deleteSession(token);
  res.clearCookie(SESSION_COOKIE, cookieOptions);
  res.status(204).end();
});

// The frontend calls this on page load to find out whether you're signed in
authRouter.get("/me", requireAdmin, (_req, res) => {
  res.json({ email: res.locals.user.email });
});
