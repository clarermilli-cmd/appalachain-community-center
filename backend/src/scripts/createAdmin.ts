// Usage: npm run create-admin -- you@example.org
// Creates an admin account, or resets the password if the email already exists.
import { createInterface } from "node:readline";
import { Writable } from "node:stream";
import { hashPassword } from "../auth.ts";
import { db } from "../db.ts";

function askHidden(question: string): Promise<string> {
  let muted = false;
  const output = new Writable({
    write(chunk, _encoding, callback) {
      if (!muted) process.stdout.write(chunk);
      callback();
    },
  });
  const rl = createInterface({ input: process.stdin, output, terminal: true });

  return new Promise((resolve) => {
    process.stdout.write(question);
    muted = true; // don't echo the password as it's typed
    rl.question("", (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const email = (process.argv[2] ?? "").trim().toLowerCase();
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  console.error("Usage: npm run create-admin -- you@example.org");
  process.exit(1);
}

const password = await askHidden("Password (at least 12 characters): ");
const confirm = await askHidden("Confirm password: ");

if (password.length < 12) {
  console.error("That password is too short. Use at least 12 characters.");
  process.exit(1);
}
if (password !== confirm) {
  console.error("The passwords didn't match.");
  process.exit(1);
}

const passwordHash = await hashPassword(password);

db.prepare(
  `INSERT INTO users (email, password_hash) VALUES (?, ?)
   ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash`
).run(email, passwordHash);

// Sign out any existing sessions for this account (matters after a reset)
db.prepare(
  "DELETE FROM sessions WHERE user_id = (SELECT id FROM users WHERE email = ?)"
).run(email);

console.log(`Admin account ready: ${email}`);
