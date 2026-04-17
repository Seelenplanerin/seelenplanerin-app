import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { InsertUser, users, meditations, InsertMeditation, communityUsers, InsertCommunityUser, affiliateCodes, affiliateClicks, affiliateSales, affiliatePayouts, InsertAffiliateCode, InsertAffiliateSale, InsertAffiliatePayout, pushTokens, pushMessages, InsertPushToken, InsertPushMessage } from "../drizzle/schema";
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

// ── Affiliate ──

export async function getAffiliateByEmail(email: string) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.select().from(affiliateCodes).where(eq(affiliateCodes.email, email.toLowerCase())).limit(1);
    return result.length > 0 ? result[0] : undefined;
  });
}

export async function getAffiliateByCode(code: string) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.select().from(affiliateCodes).where(eq(affiliateCodes.code, code.toUpperCase())).limit(1);
    return result.length > 0 ? result[0] : undefined;
  });
}

export async function createAffiliate(data: InsertAffiliateCode) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.insert(affiliateCodes).values({
      ...data,
      email: data.email.toLowerCase(),
      code: data.code.toUpperCase(),
    });
    return Number(result[0].insertId);
  });
}

export async function updateAffiliate(email: string, data: Partial<{ password: string; paypalEmail: string; isActive: number }>) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(affiliateCodes).set(data).where(eq(affiliateCodes.email, email.toLowerCase()));
  });
}

export async function getAllAffiliates() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(affiliateCodes).orderBy(desc(affiliateCodes.createdAt));
  });
}

export async function recordAffiliateClick(code: string, ipHash?: string, userAgent?: string) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.insert(affiliateClicks).values({ affiliateCode: code.toUpperCase(), ipHash: ipHash || null, userAgent: userAgent || null });
    await db.update(affiliateCodes).set({
      totalClicks: sql`total_clicks + 1`,
    }).where(eq(affiliateCodes.code, code.toUpperCase()));
  });
}

export async function createAffiliateSale(data: InsertAffiliateSale) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.insert(affiliateSales).values(data);
    await db.update(affiliateCodes).set({
      totalSales: sql`total_sales + 1`,
      totalEarnings: sql`total_earnings + ${data.commissionAmount}`,
    }).where(eq(affiliateCodes.code, data.affiliateCode.toUpperCase()));
    return Number(result[0].insertId);
  });
}

export async function getAffiliateSales(code: string) {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(affiliateSales).where(eq(affiliateSales.affiliateCode, code.toUpperCase())).orderBy(desc(affiliateSales.createdAt));
  });
}

export async function getAllAffiliateSales() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(affiliateSales).orderBy(desc(affiliateSales.createdAt));
  });
}

export async function updateAffiliateSaleStatus(saleId: number, status: string) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(affiliateSales).set({ status }).where(eq(affiliateSales.id, saleId));
  });
}

export async function createAffiliatePayout(data: InsertAffiliatePayout) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.insert(affiliatePayouts).values(data);
    await db.update(affiliateCodes).set({
      totalPaid: sql`total_paid + ${data.amount}`,
    }).where(eq(affiliateCodes.code, data.affiliateCode.toUpperCase()));
    return Number(result[0].insertId);
  });
}

// ── Push Notifications ──

export async function registerPushToken(data: { token: string; platform?: string; communityEmail?: string }) {
  return withRetry(async () => {
    const db = getDbSync();
    const existing = await db.select().from(pushTokens).where(eq(pushTokens.token, data.token)).limit(1);
    if (existing.length > 0) {
      await db.update(pushTokens).set({
        platform: data.platform || "unknown",
        communityEmail: data.communityEmail || null,
        isActive: 1,
      }).where(eq(pushTokens.token, data.token));
      return existing[0].id;
    }
    const result = await db.insert(pushTokens).values({
      token: data.token,
      platform: data.platform || "unknown",
      communityEmail: data.communityEmail || null,
      isActive: 1,
    });
    return Number(result[0].insertId);
  });
}

export async function getAllPushTokens() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(pushTokens).where(eq(pushTokens.isActive, 1));
  });
}

export async function savePushMessage(data: InsertPushMessage) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.insert(pushMessages).values(data);
    return Number(result[0].insertId);
  });
}

export async function getPushMessages() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(pushMessages).orderBy(desc(pushMessages.createdAt));
  });
}


// ── Meditations (additional) ──

export async function getActiveMeditations() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(meditations).where(eq(meditations.isActive, 1)).orderBy(desc(meditations.createdAt));
  });
}

export async function updateMeditation(id: number, data: Partial<{ title: string; description: string | null; emoji: string; isPremium: number; isActive: number }>) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(meditations).set(data).where(eq(meditations.id, id));
  });
}

// ── Community Users (additional) ──

export async function updateCommunityUserEmailConsent(email: string, consent: boolean) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(communityUsers).set({
      emailConsent: consent ? 1 : 0,
      emailConsentDate: consent ? new Date().toISOString() : null,
    }).where(eq(communityUsers.email, email.toLowerCase()));
  });
}

// ── Affiliate (additional) ──

export async function getAffiliatePayouts(code: string) {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(affiliatePayouts).where(eq(affiliatePayouts.affiliateCode, code.toUpperCase())).orderBy(desc(affiliatePayouts.createdAt));
  });
}

export async function getAllAffiliatePayouts() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(affiliatePayouts).orderBy(desc(affiliatePayouts.createdAt));
  });
}

export async function generateAffiliateCode(): Promise<string> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SP";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
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
