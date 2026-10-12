import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Express, Request } from "express";
import { getContentDayNumber, getProgramDay, getProgramYear } from "../lib/raunaechte-program";
import { getRaunaechteDay } from "../lib/raunaechte-data";
import * as db from "./db";
import { getJournalTemplate } from "./journal-template";

export function berlinNow(now = new Date()): Date {
  const parts = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).format(now).split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2], 12);
}

interface JournalClaims { codeId: number; year: number; scope: "handoff" | "journal"; exp: number; browserId?: string; nonce: string }
function signingKey(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) throw new Error("Zugangsdienst ist nicht eingerichtet.");
  return createHmac("sha256", secret).update("rauhnaechte-journal-v1").digest("hex");
}
export function signJournalToken(claims: Omit<JournalClaims, "nonce">): string {
  const body = Buffer.from(JSON.stringify({ ...claims, nonce: randomBytes(16).toString("hex") })).toString("base64url");
  return `${body}.${createHmac("sha256", signingKey()).update(body).digest("base64url")}`;
}
export function verifyJournalToken(token: string, scope: JournalClaims["scope"], now = Date.now()): JournalClaims | null {
  try {
    const [body, signature, extra] = token.split(".");
    if (!body || !signature || extra) return null;
    const actual = Buffer.from(signature, "base64url"), expected = createHmac("sha256", signingKey()).update(body).digest();
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const data = JSON.parse(Buffer.from(body, "base64url").toString()) as JournalClaims;
    if (data.scope !== scope || !Number.isInteger(data.codeId) || !Number.isInteger(data.year) || data.exp <= now || !data.nonce) return null;
    return data;
  } catch { return null; }
}

function validIdentity(value: unknown): value is string { return typeof value === "string" && value.length >= 8 && value.length <= 255; }
function validCode(value: unknown): value is string { return typeof value === "string" && /^RN-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(value.toUpperCase().trim()); }
async function requireAppAccess(req: Request) {
  const { code, deviceId } = req.body || {};
  if (!validCode(code) || !validIdentity(deviceId)) return null;
  const row = await db.getActiveRaunaechteAccess(code.toUpperCase().trim(), deviceId);
  if (!row || row.year !== getProgramYear(berlinNow())) return null;
  return row;
}
const attempts = new Map<string, { count: number; expires: number }>();
const usedHandoffs = new Map<string, number>();
function rateAllowed(ip: string): boolean {
  const now = Date.now();
  for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
  const entry = attempts.get(ip) || { count: 0, expires: now + 15 * 60_000 };
  entry.count++; attempts.set(ip, entry);
  return entry.count <= 30;
}
function tokenFor(codeId: number, year: number, browserId: string) {
  return signJournalToken({ codeId, year, browserId, scope: "journal", exp: Date.now() + 12 * 60 * 60_000 });
}

export function registerRauhnaechteAccessRoutes(app: Express) {
  app.use("/api/rauhnaechte", (_req, res, next) => { res.setHeader("Cache-Control", "no-store, private"); res.setHeader("X-Content-Type-Options", "nosniff"); next(); });
  app.post("/api/rauhnaechte/access/check", async (req, res) => {
    try {
      const row = await requireAppAccess(req);
      if (!row) { res.status(403).json({ valid: false, error: "Bitte löse zuerst deinen von Lara vergebenen Zugangscode ein." }); return; }
      res.json({ valid: true, year: row.year, currentDay: getProgramDay(row.year, berlinNow()) });
    } catch { res.status(503).json({ valid: false, error: "Zugang konnte nicht geprüft werden. Bitte erneut versuchen." }); }
  });
  app.post("/api/rauhnaechte/day", async (req, res) => {
    try {
      const row = await requireAppAccess(req);
      if (!row || req.body.year !== row.year) { res.status(403).json({ error: "Zugangscode erforderlich." }); return; }
      const day = req.body.day;
      if (!Number.isInteger(day) || getContentDayNumber(day) === null) { res.status(404).json({ error: "Heute gibt es keinen neuen Inhaltstag." }); return; }
      if (day > getProgramDay(row.year, berlinNow())) { res.status(403).json({ error: "Dieser Inhaltstag ist noch gesperrt. Freischaltung erst am jeweiligen Datum." }); return; }
      res.json({ content: getRaunaechteDay(row.year, day) });
    } catch { res.status(503).json({ error: "Inhalte konnten nicht geladen werden. Bitte erneut versuchen." }); }
  });
  app.post("/api/rauhnaechte/journal/ticket", async (req, res) => {
    try {
      const row = await requireAppAccess(req);
      if (!row) { res.status(403).json({ error: "Journal erst nach Code-Freischaltung verfügbar." }); return; }
      res.json({ ticket: signJournalToken({ codeId: row.id, year: row.year, scope: "handoff", exp: Date.now() + 120_000 }) });
    } catch { res.status(503).json({ error: "Journal-Zugang konnte nicht vorbereitet werden." }); }
  });
  app.post("/api/rauhnaechte/journal/session", async (req, res) => {
    if (!rateAllowed(req.ip || "unknown")) { res.status(429).json({ error: "Zu viele Versuche. Bitte warte 15 Minuten." }); return; }
    try {
      const { browserId, ticket, code } = req.body || {};
      if (!validIdentity(browserId)) { res.status(400).json({ error: "Browser-Zuordnung fehlt." }); return; }
      let row;
      if (typeof ticket === "string") {
        const claims = verifyJournalToken(ticket, "handoff");
        for (const [key, expires] of usedHandoffs) if (expires <= Date.now()) usedHandoffs.delete(key);
        if (!claims || usedHandoffs.has(claims.nonce)) { res.status(403).json({ error: "Journal-Übergabe abgelaufen. Bitte erneut aus der App öffnen." }); return; }
        row = await db.bindRaunaechteJournal(claims.codeId, browserId);
        if (row) usedHandoffs.set(claims.nonce, claims.exp);
      } else if (validCode(code)) {
        row = await db.bindRaunaechteJournalByCode(code.toUpperCase().trim(), browserId);
      }
      if (!row || row.year !== getProgramYear(berlinNow())) { res.status(403).json({ error: "Ungültiger, deaktivierter oder bereits in einem anderen Browser verwendeter Code. Den Zugangscode erhältst du nach der Buchung von Lara." }); return; }
      res.json({ token: tokenFor(row.id, row.year, browserId), year: row.year });
    } catch { res.status(503).json({ error: "Zugang konnte nicht geprüft werden. Es wird nichts freigeschaltet." }); }
  });
  app.post("/api/rauhnaechte/journal/document", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace(/^Bearer /, "") || "";
      const claims = verifyJournalToken(token, "journal");
      if (!claims || !claims.browserId || claims.browserId !== req.body?.browserId) { res.status(403).json({ error: "Bitte gib deinen Zugangscode ein." }); return; }
      const row = await db.getActiveRaunaechteJournal(claims.codeId, claims.browserId);
      if (!row || row.year !== claims.year || row.year !== getProgramYear(berlinNow())) { res.status(403).json({ error: "Zugang nicht mehr gültig. Bitte wende dich an Lara." }); return; }
      const currentDay = getProgramDay(row.year, berlinNow());
      const state = JSON.stringify({ year: row.year, currentDay, today: new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(new Date()) }).replace(/</g, "\\u003c");
      // Nicht freigeschaltete Impulse werden auch aus dem ausgelieferten Quelltext entfernt.
      const html = restrictJournalDays(getJournalTemplate(), currentDay).replace("/* SERVER_ACCESS_STATE */", `window.__RAUH_ACCESS__=${state};`);
      res.type("html").send(html);
    } catch { res.status(503).json({ error: "Journal konnte nicht sicher geladen werden." }); }
  });
}

export function restrictJournalDays(template: string, currentDay: number): string {
  let html = template;
  for (const [name, firstDay] of [["SPERR", 1], ["RAUH", 17]] as const) {
    const pattern = new RegExp(`const ${name} = (\\[[\\s\\S]*?\\n\\]);`);
    html = html.replace(pattern, (_whole, array) => {
      const entries = JSON.parse(array.replace(/,\s*\]/g, "]")) as [string, string, string[]][];
      const filtered = entries.map((entry, index) => firstDay + index <= currentDay ? entry : ["Noch gesperrt", "Freischaltung am jeweiligen Datum.", []]);
      return `const ${name} = ${JSON.stringify(filtered)};`;
    });
  }
  return html;
}
