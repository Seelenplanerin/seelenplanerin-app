import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, meditations, InsertMeditation, communityUsers, InsertCommunityUser, affiliateCodes, affiliateClicks, affiliateSales, affiliatePayouts, InsertAffiliateCode, InsertAffiliateSale, InsertAffiliatePayout } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL, { ssl: "require" });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
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

    // PostgreSQL upsert using onConflictDoUpdate
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
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
  const result = await db.insert(meditations).values(data).returning({ id: meditations.id });
  return result[0].id;
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
  }).returning({ id: communityUsers.id });
  return result[0].id;
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
  }).returning({ id: affiliateCodes.id });
  return result[0].id;
}

export async function updateAffiliate(code: string, data: Partial<{ isActive: number; paypalEmail: string; iban: string; totalClicks: number; totalSales: number; totalEarnings: number; totalPaid: number }>) {
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
    .set({ totalClicks: sql`"totalClicks" + 1` })
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
  }).returning({ id: affiliateSales.id });
  // Update affiliate totals
  await db.update(affiliateCodes)
    .set({
      totalSales: sql`"totalSales" + 1`,
      totalEarnings: sql`"totalEarnings" + ${data.commissionAmount}`,
    })
    .where(eq(affiliateCodes.code, data.affiliateCode.toUpperCase()));
  return result[0].id;
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
  }).returning({ id: affiliatePayouts.id });
  // Update totalPaid
  await db.update(affiliateCodes)
    .set({ totalPaid: sql`"totalPaid" + ${data.amount}` })
    .where(eq(affiliateCodes.code, data.affiliateCode.toUpperCase()));
  return result[0].id;
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
