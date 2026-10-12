import { createHmac, scryptSync, timingSafeEqual, randomBytes } from "node:crypto";
import type { Express } from "express";

export function verifyAdminPassword(password: unknown): boolean {
  const expected = process.env.RAUHNAECHTE_ADMIN_PASSWORD;
  if (!expected || expected.length < 12 || typeof password !== "string" || password.length > 256) return false;
  const salt = "seelenplanerin-rauh-admin-v1";
  return timingSafeEqual(scryptSync(password, salt, 32), scryptSync(expected, salt, 32));
}
function key() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) throw new Error("Admin-Anmeldung ist nicht eingerichtet.");
  return createHmac("sha256", secret).update("rauhnaechte-admin-session-v1").digest();
}
export function issueRauhAdminToken(): string {
  const body = Buffer.from(JSON.stringify({ scope: "rauh-admin", exp: Date.now() + 8 * 60 * 60_000, nonce: randomBytes(24).toString("hex") })).toString("base64url");
  return body + "." + createHmac("sha256", key()).update(body).digest("base64url");
}
export function verifyRauhAdminToken(token: string, now = Date.now()): boolean {
  try {
    const [body, sig, extra] = token.split(".");
    if (!body || !sig || extra) return false;
    const expected = createHmac("sha256", key()).update(body).digest(), actual = Buffer.from(sig, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    return payload.scope === "rauh-admin" && typeof payload.exp === "number" && payload.exp > now;
  } catch { return false; }
}
const attempts = new Map<string, { count: number; expires: number }>();
export function registerRauhAdminAuth(app: Express) {
  app.post("/api/rauhnaechte/admin/login", (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    const now = Date.now(), ip = req.ip || "unknown";
    for (const [k, v] of attempts) if (v.expires <= now) attempts.delete(k);
    const entry = attempts.get(ip) || { count: 0, expires: now + 15 * 60_000 };
    if (entry.count >= 10) { res.status(429).json({ error: "Zu viele Anmeldeversuche. Bitte warte 15 Minuten." }); return; }
    entry.count++; attempts.set(ip, entry);
    if (!process.env.RAUHNAECHTE_ADMIN_PASSWORD) { res.status(503).json({ error: "Dein sicheres Adminpasswort muss zuerst eingerichtet werden." }); return; }
    if (!verifyAdminPassword(req.body?.password)) { res.status(401).json({ error: "Admin-Anmeldung fehlgeschlagen. Bitte prüfe dein Passwort." }); return; }
    attempts.delete(ip);
    res.json({ token: issueRauhAdminToken(), expiresIn: 8 * 60 * 60 });
  });
}
