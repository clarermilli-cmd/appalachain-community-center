import express from "express";
import type { ErrorRequestHandler, RequestHandler } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import multer from "multer";
import { ZodError } from "zod";
import { purgeExpiredSessions } from "./auth.ts";
import { config } from "./config.ts";
import "./db.ts"; // opens the database and creates tables on first run
import { HttpError } from "./errors.ts";
import { authRouter } from "./routes/auth.ts";
import { eventsRouter } from "./routes/events.ts";

const app = express();

app.set("trust proxy", 1); // we'll sit behind a proxy/load balancer in production
app.use(
  helmet({
    // Lets the website (a different address) display uploaded photos
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors({ origin: config.allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));

// Extra protection for cookie logins: reject writes that come from other websites
const originCheck: RequestHandler = (req, res, next) => {
  const safeMethod = ["GET", "HEAD", "OPTIONS"].includes(req.method);
  const origin = req.get("origin");

  if (!safeMethod && origin && !config.allowedOrigins.includes(origin)) {
    res.status(403).json({ error: "Origin not allowed." });
    return;
  }
  next();
};
app.use(originCheck);

app.use("/uploads", express.static(config.uploadDir, { maxAge: "7d", index: false }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});
app.use("/api/auth", authRouter);
app.use("/api/events", eventsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found." });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
  } else if (err instanceof ZodError) {
    res.status(400).json({ error: err.issues[0]?.message ?? "Invalid input." });
  } else if (err instanceof multer.MulterError) {
    res.status(400).json({
      error:
        err.code === "LIMIT_FILE_SIZE"
          ? "Photos must be 5 MB or smaller."
          : "The upload failed.",
    });
  } else if (typeof err?.status === "number" && err.status < 500) {
    res.status(err.status).json({ error: "Bad request." }); // e.g. malformed JSON
  } else {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
};
app.use(errorHandler);

purgeExpiredSessions();
setInterval(purgeExpiredSessions, 60 * 60 * 1000).unref();

app.listen(config.port, () => {
  console.log(`API running at http://localhost:${config.port}`);
});
