import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { InsertUser, users, meditations, InsertMeditation, communityUsers, InsertCommunityUser, affiliateCodes, affiliateClicks, affiliateSales, affiliatePayouts, InsertAffiliateCode, InsertAffiliateSale, InsertAffiliatePayout, pushTokens, pushMessages, InsertPushToken, InsertPushMessage } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: any = null;
let _pool: mysql.Pool | null = null;

export async function getDb() {
  // Always try to reconnect if _db is null
  if (!_db && process.env.DATABASE_URL) {
    // Clean up stale pool first
    if (_pool) {
      try { _pool.end(); } catch (e) { /* ignore */ }
      _pool = null;
    }
    try {
      const dbUrl = process.env.DATABASE_URL;
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
      // Handle pool errors to prevent crashes
      (_pool as any).on("error", (err: any) => {
        const errMsg = String(err?.message || err);
        console.error("[Database] Pool error:", errMsg);
        if (errMsg.includes("ECONNRESET") || errMsg.includes("PROTOCOL_CONNECTION_LOST") || errMsg.includes("ETIMEDOUT")) {
          console.log("[Database] Resetting pool due to connection error...");
          _db = null;
          _pool = null;
        }
      });
      // Test the connection
      const conn = await _pool.getConnection();
      await conn.query("SELECT 1");
      conn.release();
      _db = drizzle(_pool);
      console.log("[Database] Connected successfully via MySQL");
    } catch (error: any) {
      console.error("[Database] Connection failed:", error.message || error);
      _db = null;
      _pool = null;
    }
  }
  return _db;
}

export function resetDb() {
  if (_pool) {
    try { _pool.end(); } catch (e) { /* ignore */ }
  }
  _db = null;
  _pool = null;
  console.log("[Database] Connection reset");
}

export function getSslConfig(dbUrl: string): any {
  return { rejectUnauthorized: true };
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    // MySQL upsert using onDuplicateKeyUpdate
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ── Meditationen ──

export async function getAllMeditations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(meditations).orderBy(desc(meditations.createdAt));
}

export async function getActiveMeditations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(meditations).where(eq(meditations.isActive, 1)).orderBy(desc(meditations.createdAt));
}

export async function createMeditation(data: InsertMeditation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(meditations).values(data);
  return Number(result[0].insertId);
}

export async function deleteMeditation(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(meditations).where(eq(meditations.id, id));
}

export async function updateMeditation(id: number, data: Partial<InsertMeditation>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(meditations).set(data).where(eq(meditations.id, id));
}

// ── Community Users ──

export async function getAllCommunityUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(communityUsers).orderBy(desc(communityUsers.createdAt));
}

export async function getCommunityUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(communityUsers).where(eq(communityUsers.email, email.toLowerCase())).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCommunityUser(data: { email: string; password: string; name: string; mustChangePassword?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(communityUsers).values({
    email: data.email.toLowerCase(),
    password: data.password,
    name: data.name,
    mustChangePassword: data.mustChangePassword || 0,
  });
  return Number(result[0].insertId);
}

export async function updateCommunityUser(email: string, data: Partial<{ password: string; name: string; mustChangePassword: number; isActive: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(communityUsers).set(data).where(eq(communityUsers.email, email.toLowerCase()));
}

export async function deleteCommunityUser(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(communityUsers).where(eq(communityUsers.email, email.toLowerCase()));
}

export async function updateCommunityUserEmailConsent(email: string, consent: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(communityUsers).set({
    emailConsent: consent ? 1 : 0,
    emailConsentDate: consent ? new Date() : null,
  }).where(eq(communityUsers.email, email.toLowerCase()));
}

export async function getCommunityUsersWithEmailConsent() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(communityUsers).where(eq(communityUsers.emailConsent, 1));
}

// ── Affiliate-System ──

export async function generateAffiliateCode(): Promise<string> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SP-";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function getAffiliateByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(affiliateCodes).where(eq(affiliateCodes.email, email.toLowerCase())).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAffiliateByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(affiliateCodes).where(eq(affiliateCodes.code, code.toUpperCase())).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllAffiliates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliateCodes).orderBy(desc(affiliateCodes.createdAt));
}

export async function createAffiliate(data: { email: string; name: string; code: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(affiliateCodes).values({
    email: data.email.toLowerCase(),
    name: data.name,
    code: data.code.toUpperCase(),
  });
  return Number(result[0].insertId);
}

export async function updateAffiliate(code: string, data: Partial<{ isActive: number; paypalEmail: string; iban: string; totalClicks: number; totalSales: number; totalEarnings: number; totalPaid: number; password: string }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(affiliateCodes).set(data).where(eq(affiliateCodes.code, code.toUpperCase()));
}

export async function recordAffiliateClick(code: string, ipHash?: string, userAgent?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(affiliateClicks).values({
    affiliateCode: code.toUpperCase(),
    ipHash: ipHash || null,
    userAgent: userAgent || null,
  });
  // Update total clicks
  await db.update(affiliateCodes)
    .set({ totalClicks: sql`totalClicks + 1` })
    .where(eq(affiliateCodes.code, code.toUpperCase()));
}

export async function getAffiliateClicks(code: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliateClicks).where(eq(affiliateClicks.affiliateCode, code.toUpperCase())).orderBy(desc(affiliateClicks.createdAt));
}

export async function createAffiliateSale(data: { affiliateCode: string; productName: string; saleAmount: number; commissionAmount: number; customerEmail?: string; customerName?: string; notes?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(affiliateSales).values({
    affiliateCode: data.affiliateCode.toUpperCase(),
    productName: data.productName,
    saleAmount: data.saleAmount,
    commissionRate: 20,
    commissionAmount: data.commissionAmount,
    customerEmail: data.customerEmail || null,
    customerName: data.customerName || null,
    notes: data.notes || null,
  });
  // Update affiliate totals
  await db.update(affiliateCodes)
    .set({
      totalSales: sql`totalSales + 1`,
      totalEarnings: sql`totalEarnings + ${data.commissionAmount}`,
    })
    .where(eq(affiliateCodes.code, data.affiliateCode.toUpperCase()));
  return Number(result[0].insertId);
}

export async function getAffiliateSales(code: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliateSales).where(eq(affiliateSales.affiliateCode, code.toUpperCase())).orderBy(desc(affiliateSales.createdAt));
}

export async function getAllAffiliateSales() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliateSales).orderBy(desc(affiliateSales.createdAt));
}

export async function updateAffiliateSaleStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(affiliateSales).set({ status }).where(eq(affiliateSales.id, id));
}

export async function createAffiliatePayout(data: { affiliateCode: string; amount: number; method: string; reference?: string; notes?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(affiliatePayouts).values({
    affiliateCode: data.affiliateCode.toUpperCase(),
    amount: data.amount,
    method: data.method,
    reference: data.reference || null,
    notes: data.notes || null,
  });
  // Update totalPaid
  await db.update(affiliateCodes)
    .set({ totalPaid: sql`totalPaid + ${data.amount}` })
    .where(eq(affiliateCodes.code, data.affiliateCode.toUpperCase()));
  return Number(result[0].insertId);
}

export async function getAffiliatePayouts(code: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliatePayouts).where(eq(affiliatePayouts.affiliateCode, code.toUpperCase())).orderBy(desc(affiliatePayouts.createdAt));
}

export async function getAllAffiliatePayouts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliatePayouts).orderBy(desc(affiliatePayouts.createdAt));
}

// ── Push-Benachrichtigungen ──

export async function registerPushToken(data: { token: string; platform?: string; communityEmail?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // MySQL upsert
  await db.insert(pushTokens).values({
    token: data.token,
    platform: data.platform || null,
    communityEmail: data.communityEmail || null,
    isActive: 1,
    updatedAt: new Date(),
  }).onDuplicateKeyUpdate({
    set: {
      platform: data.platform || null,
      communityEmail: data.communityEmail || null,
      isActive: 1,
      updatedAt: new Date(),
    },
  });
}

export async function getAllActivePushTokens() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pushTokens).where(eq(pushTokens.isActive, 1));
}

export async function deactivatePushToken(token: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(pushTokens).set({ isActive: 0 }).where(eq(pushTokens.token, token));
}

export async function createPushMessage(data: InsertPushMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pushMessages).values(data);
  return Number(result[0].insertId);
}

export async function updatePushMessage(id: number, data: Partial<InsertPushMessage>) {
  const db = await getDb();
  if (!db) return;
  await db.update(pushMessages).set(data).where(eq(pushMessages.id, id));
}

export async function getPushMessageHistory() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pushMessages).orderBy(desc(pushMessages.createdAt)).limit(50);
}

export async function getPushTokenCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(pushTokens).where(eq(pushTokens.isActive, 1));
  return Number(result[0]?.count || 0);
}

// ─── Academy Waitlist ─────────────────────────────────────────────────────────
export async function addAcademyWaitlist(email: string) {
  const db = await getDb();
  if (!db) throw new Error("No database connection");
  // Use raw pool for this simple query
  if (_pool) {
    await _pool.execute(
      "INSERT IGNORE INTO academy_waitlist (email) VALUES (?)",
      [email.toLowerCase()]
    );
  }
  return { success: true };
}

export async function getAcademyWaitlist() {
  const db = await getDb();
  if (!db) return [];
  if (_pool) {
    const [rows] = await _pool.execute("SELECT id, email, createdAt FROM academy_waitlist ORDER BY createdAt DESC");
    return rows as any[];
  }
  return [];
}
