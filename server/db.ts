import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { InsertUser, users, meditations, InsertMeditation, communityUsers, InsertCommunityUser, pushTokens, pushMessages, InsertPushToken, InsertPushMessage, communityQuestions, InsertCommunityQuestion } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: any = null;
let _pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (_pool) return _pool;
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL nicht gesetzt");
  _pool = mysql.createPool({
    uri: dbUrl,
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 10,
    connectTimeout: 15000,
    ssl: { rejectUnauthorized: true },
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  });
  (_pool as any).on("error", (err: any) => {
    const errMsg = String(err?.message || err);
    console.error("[Database] Pool error:", errMsg);
    if (errMsg.includes("ECONNRESET") || errMsg.includes("PROTOCOL_CONNECTION_LOST") || errMsg.includes("ETIMEDOUT")) {
      console.log("[Database] Resetting pool due to connection error...");
      _pool = null;
      _db = null;
    }
  });
  return _pool;
}

function getDbSync() {
  if (!_db) {
    _db = drizzle(getPool());
  }
  return _db!;
}

// Keep the async version for backward compatibility but use the sync pattern
export async function getDb() {
  try {
    return getDbSync();
  } catch (e) {
    return null;
  }
}

export function resetDb() {
  if (_pool) {
    try { _pool.end(); } catch (e) { /* ignore */ }
  }
  _db = null;
  _pool = null;
  console.log("[Database] Connection reset");
}

// Wrapper to retry DB operations on connection failure
async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const msg = err.message || "";
      const isConnectionError = msg.includes("ECONNRESET") || msg.includes("PROTOCOL_CONNECTION_LOST") ||
        msg.includes("ETIMEDOUT") || msg.includes("Connection lost") || msg.includes("ECONNREFUSED") ||
        msg.includes("Failed query") || msg.includes("Can't add new command") || msg.includes("DATABASE_URL");
      if (isConnectionError && attempt < retries) {
        console.log(`[Database] Connection error on attempt ${attempt}, resetting and retrying...`);
        resetDb();
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }
      throw err;
    }
  }
  throw new Error("withRetry: should not reach here");
}

export function getSslConfig(dbUrl: string): any {
  return { rejectUnauthorized: true };
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  return withRetry(async () => {
    const db = getDbSync();
    try {
      const values: InsertUser = {
        openId: user.openId,
        email: user.email ?? null,
        name: user.name ?? null,
  
      };
      await db.insert(users).values(values).onDuplicateKeyUpdate({
        set: {
          email: sql`VALUES(email)`,
          name: sql`VALUES(name)`,
        },
      });
    } catch (error) {
      console.error("[Database] Failed to upsert user:", error);
    }
  });
}

export async function getUserByOpenId(openId: string) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  });
}

// ── Meditations ──

export async function getActiveMeditations() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(meditations).where(eq(meditations.isActive, 1)).orderBy(desc(meditations.createdAt));
  });
}

export async function updateMeditation(id: number, data: Partial<{ title: string; description: string; emoji: string; isPremium: number; isActive: number }>) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(meditations).set(data).where(eq(meditations.id, id));
  });
}

export async function getAllMeditations() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(meditations).orderBy(desc(meditations.createdAt));
  });
}

export async function createMeditation(data: InsertMeditation) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.insert(meditations).values(data);
    return Number(result[0].insertId);
  });
}

export async function deleteMeditation(id: number) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.delete(meditations).where(eq(meditations.id, id));
  });
}

// ── Community Users ──

export async function getAllCommunityUsers() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(communityUsers).orderBy(desc(communityUsers.createdAt));
  });
}

export async function getCommunityUserByEmail(email: string) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.select().from(communityUsers).where(eq(communityUsers.email, email.toLowerCase())).limit(1);
    return result.length > 0 ? result[0] : undefined;
  });
}

export async function createCommunityUser(data: { email: string; password: string; name: string; mustChangePassword?: number }) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.insert(communityUsers).values({
      email: data.email.toLowerCase(),
      password: data.password,
      name: data.name,
      mustChangePassword: data.mustChangePassword || 0,
    });
    return Number(result[0].insertId);
  });
}

export async function updateCommunityUser(email: string, data: Partial<{ password: string; name: string; mustChangePassword: number; isActive: number }>) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(communityUsers).set(data).where(eq(communityUsers.email, email.toLowerCase()));
  });
}

export async function deleteCommunityUser(email: string) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.delete(communityUsers).where(eq(communityUsers.email, email.toLowerCase()));
  });
}

export async function updateCommunityUserEmailConsent(email: string, consent: boolean) {
  return setCommunityEmailConsent(email, consent ? 1 : 0);
}

export async function setCommunityEmailConsent(email: string, consent: number) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(communityUsers).set({
      emailConsent: consent,
      emailConsentDate: consent === 1 ? new Date().toISOString() : null,
    }).where(eq(communityUsers.email, email.toLowerCase()));
  });
}

export async function getCommunityUsersWithEmailConsent() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(communityUsers).where(eq(communityUsers.emailConsent, 1));
  });
}

// ── Push Token Registration ──

export async function registerPushToken(data: { token: string; platform?: string; communityEmail?: string }) {
  return withRetry(async () => {
    const db = getDbSync();
    const existing = await db.select().from(pushTokens).where(eq(pushTokens.token, data.token)).limit(1);
    if (existing.length > 0) {
      await db.update(pushTokens).set({ isActive: 1, platform: data.platform || null }).where(eq(pushTokens.token, data.token));
    } else {
      await db.insert(pushTokens).values({ token: data.token, platform: data.platform || null, isActive: 1 });
    }
  });
}

// ── Push Notifications (additional) ──

export async function getPushTokenCount() {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.select({ count: sql<number>`COUNT(*)` }).from(pushTokens).where(eq(pushTokens.isActive, 1));
    return result[0]?.count || 0;
  });
}

export async function getAllActivePushTokens() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(pushTokens).where(eq(pushTokens.isActive, 1));
  });
}

export async function createPushMessage(data: InsertPushMessage) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.insert(pushMessages).values(data);
    return Number(result[0].insertId);
  });
}

// ── Push Token Management ──

export async function deactivatePushToken(token: string) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(pushTokens).set({ isActive: 0 }).where(eq(pushTokens.token, token));
  });
}

export async function updatePushMessage(id: number, data: { sentSuccess?: number; sentFailed?: number }) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(pushMessages).set(data).where(eq(pushMessages.id, id));
  });
}

export async function getPushMessageHistory() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(pushMessages).orderBy(desc(pushMessages.createdAt));
  });
}

// ── Community Q&A ──

export async function getAllCommunityQuestions() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(communityQuestions).orderBy(desc(communityQuestions.datum));
  });
}

export async function createCommunityQuestion(data: { frage: string; von: string; vonEmail?: string }) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.insert(communityQuestions).values({
      frage: data.frage,
      von: data.von,
      vonEmail: data.vonEmail || null,
    });
    return Number(result[0].insertId);
  });
}

export async function answerCommunityQuestion(id: number, antwort: string) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(communityQuestions).set({
      antwort,
      antwortDatum: new Date(),
    }).where(eq(communityQuestions.id, id));
  });
}

export async function deleteCommunityQuestion(id: number) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.delete(communityQuestions).where(eq(communityQuestions.id, id));
  });
}

// ── Academy Waitlist ──

import { academyWaitlist, InsertAcademyWaitlist } from "../drizzle/schema";

export async function addAcademyWaitlist(email: string) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.insert(academyWaitlist).values({ email: email.toLowerCase() });
  });
}

export async function getAcademyWaitlist() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(academyWaitlist).orderBy(desc(academyWaitlist.createdAt));
  });
}

// ── Raunächte Zugangscodes ──
import { raunaechteCode, InsertRaunaechteCode } from "../drizzle/schema";

export async function createRaunaechteCode(code: string, year: number) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.insert(raunaechteCode).values({ code, year });
    return result[0].insertId;
  });
}

export async function createRaunaechteCodesBatch(codes: string[], year: number) {
  return withRetry(async () => {
    const db = getDbSync();
    const values = codes.map(code => ({ code, year }));
    await db.insert(raunaechteCode).values(values);
    return codes.length;
  });
}

export async function validateRaunaechteCode(code: string, deviceId: string) {
  return withRetry(async () => {
    const db = getDbSync();
    const results = await db.select().from(raunaechteCode).where(eq(raunaechteCode.code, code));
    if (results.length === 0) return { valid: false, error: "Code nicht gefunden" };
    const entry = results[0];
    if (!entry.isActive) return { valid: false, error: "Code ist deaktiviert" };
    // Prüfe Geräte-Bindung
    if (entry.deviceId && entry.deviceId !== deviceId) {
      return { valid: false, error: "Code ist bereits auf einem anderen Gerät aktiviert" };
    }
    // Aktiviere den Code auf diesem Gerät
    if (!entry.deviceId) {
      await db.update(raunaechteCode)
        .set({ deviceId, activatedAt: new Date() })
        .where(eq(raunaechteCode.id, entry.id));
    }
    return { valid: true, year: entry.year };
  });
}

export async function getAllRaunaechteCodesForYear(year: number) {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(raunaechteCode)
      .where(eq(raunaechteCode.year, year))
      .orderBy(desc(raunaechteCode.createdAt));
  });
}

export async function deactivateRaunaechteCode(id: number) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(raunaechteCode).set({ isActive: 0 }).where(eq(raunaechteCode.id, id));
  });
}

export async function getRaunaechteCodeStats(year: number) {
  return withRetry(async () => {
    const db = getDbSync();
    const all = await db.select().from(raunaechteCode).where(eq(raunaechteCode.year, year));
    const total = all.length;
    const activated = all.filter((c: any) => c.deviceId !== null).length;
    const available = all.filter((c: any) => c.deviceId === null && c.isActive === 1).length;
    const deactivated = all.filter((c: any) => c.isActive === 0).length;
    return { total, activated, available, deactivated };
  });
}

// ── Web Push Subscriptions ──

import { webPushSubscriptions } from "../drizzle/schema";

export async function getAllWebPushSubscriptions() {
  const conn = await getDb();
  return conn.select().from(webPushSubscriptions).where(eq(webPushSubscriptions.isActive, 1));
}

export async function saveWebPushSubscription(endpoint: string, subscription: string): Promise<void> {
  const conn = await getDb();
  await conn.insert(webPushSubscriptions).values({ endpoint, subscription }).onDuplicateKeyUpdate({ set: { subscription, isActive: 1 } });
}

export async function deactivateWebPushSubscription(id: number): Promise<void> {
  const conn = await getDb();
  await conn.update(webPushSubscriptions).set({ isActive: 0 }).where(eq(webPushSubscriptions.id, id));
}

export async function getWebPushSubscriptionCount(): Promise<number> {
  const conn = await getDb();
  const result = await conn.select({ count: sql<number>`COUNT(*)` }).from(webPushSubscriptions).where(eq(webPushSubscriptions.isActive, 1));
  return result[0]?.count ?? 0;
}
