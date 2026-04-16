var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
var roleEnum, users, meditations, communityUsers, affiliateCodes, affiliateClicks, affiliateSales, affiliatePayouts, pushTokens, pushMessages, seelenjournalClients, seelenjournalEntries, seelenjournalAttachments, seelenjournalMessages;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    roleEnum = pgEnum("role", ["user", "admin"]);
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: roleEnum("role").default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    meditations = pgTable("meditations", {
      id: serial("id").primaryKey(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description"),
      emoji: varchar("emoji", { length: 10 }).default("\u{1F9D8}\u200D\u2640\uFE0F"),
      audioUrl: text("audioUrl").notNull(),
      isPremium: integer("isPremium").default(1).notNull(),
      isActive: integer("isActive").default(1).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    communityUsers = pgTable("community_users", {
      id: serial("id").primaryKey(),
      email: varchar("email", { length: 320 }).notNull().unique(),
      password: varchar("password", { length: 255 }).notNull(),
      name: varchar("name", { length: 255 }).notNull(),
      mustChangePassword: integer("mustChangePassword").default(0).notNull(),
      isActive: integer("isActive").default(1).notNull(),
      emailConsent: integer("emailConsent").default(0).notNull(),
      emailConsentDate: timestamp("emailConsentDate"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    affiliateCodes = pgTable("affiliate_codes", {
      id: serial("id").primaryKey(),
      email: varchar("email", { length: 320 }).notNull().unique(),
      // Community-User E-Mail
      code: varchar("code", { length: 20 }).notNull().unique(),
      // z.B. "SP-7X3K9"
      name: varchar("name", { length: 255 }).notNull(),
      // Name des Affiliates
      isActive: integer("isActive").default(1).notNull(),
      totalClicks: integer("totalClicks").default(0).notNull(),
      totalSales: integer("totalSales").default(0).notNull(),
      totalEarnings: integer("totalEarnings").default(0).notNull(),
      // in Cent
      totalPaid: integer("totalPaid").default(0).notNull(),
      // in Cent
      password: varchar("password", { length: 255 }),
      // Passwort für Dashboard-Login
      paypalEmail: varchar("paypalEmail", { length: 320 }),
      // für Auszahlung
      iban: varchar("iban", { length: 50 }),
      // alternativ IBAN
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    affiliateClicks = pgTable("affiliate_clicks", {
      id: serial("id").primaryKey(),
      affiliateCode: varchar("affiliateCode", { length: 20 }).notNull(),
      ipHash: varchar("ipHash", { length: 64 }),
      // gehashte IP für Unique-Tracking
      userAgent: text("userAgent"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    affiliateSales = pgTable("affiliate_sales", {
      id: serial("id").primaryKey(),
      affiliateCode: varchar("affiliateCode", { length: 20 }).notNull(),
      productName: varchar("productName", { length: 255 }).notNull(),
      saleAmount: integer("saleAmount").notNull(),
      // Verkaufsbetrag in Cent
      commissionRate: integer("commissionRate").default(20).notNull(),
      // Prozent
      commissionAmount: integer("commissionAmount").notNull(),
      // Provision in Cent
      customerEmail: varchar("customerEmail", { length: 320 }),
      customerName: varchar("customerName", { length: 255 }),
      status: varchar("status", { length: 20 }).default("pending").notNull(),
      // pending, confirmed, paid
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    affiliatePayouts = pgTable("affiliate_payouts", {
      id: serial("id").primaryKey(),
      affiliateCode: varchar("affiliateCode", { length: 20 }).notNull(),
      amount: integer("amount").notNull(),
      // Betrag in Cent
      method: varchar("method", { length: 50 }).default("paypal").notNull(),
      // paypal, bank
      reference: varchar("reference", { length: 255 }),
      // Überweisungsreferenz
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    pushTokens = pgTable("push_tokens", {
      id: serial("id").primaryKey(),
      token: varchar("token", { length: 255 }).notNull().unique(),
      platform: varchar("platform", { length: 20 }),
      // ios, android, web
      communityEmail: varchar("communityEmail", { length: 320 }),
      // optional: verknüpftes Community-Mitglied
      isActive: integer("isActive").default(1).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
    pushMessages = pgTable("push_messages", {
      id: serial("id").primaryKey(),
      title: varchar("title", { length: 255 }).notNull(),
      body: text("body").notNull(),
      data: text("data"),
      // JSON-String mit zusätzlichen Daten
      sentTo: integer("sentTo").default(0).notNull(),
      // Anzahl Empfänger
      sentSuccess: integer("sentSuccess").default(0).notNull(),
      sentFailed: integer("sentFailed").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    seelenjournalClients = pgTable("seelenjournal_clients", {
      id: serial("id").primaryKey(),
      email: varchar("email", { length: 320 }).notNull().unique(),
      password: varchar("password", { length: 255 }).notNull(),
      name: varchar("name", { length: 255 }).notNull(),
      readingDate: timestamp("readingDate"),
      internalNote: text("internalNote"),
      isActive: integer("isActive").default(1).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    seelenjournalEntries = pgTable("seelenjournal_entries", {
      id: serial("id").primaryKey(),
      clientId: integer("clientId").notNull(),
      title: varchar("title", { length: 500 }).notNull(),
      content: text("content"),
      category: varchar("category", { length: 100 }),
      date: timestamp("date").defaultNow().notNull(),
      isPublished: integer("isPublished").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
    seelenjournalAttachments = pgTable("seelenjournal_attachments", {
      id: serial("id").primaryKey(),
      entryId: integer("entryId").notNull(),
      filename: varchar("filename", { length: 500 }).notNull(),
      url: text("url").notNull(),
      type: varchar("type", { length: 20 }).notNull(),
      // "pdf" | "image"
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    seelenjournalMessages = pgTable("seelenjournal_messages", {
      id: serial("id").primaryKey(),
      clientId: integer("clientId").notNull(),
      content: text("content").notNull(),
      fromAdmin: integer("fromAdmin").default(0).notNull(),
      // 1 = Lara, 0 = Klientin
      isRead: integer("isRead").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  addAcademyWaitlist: () => addAcademyWaitlist,
  createAffiliate: () => createAffiliate,
  createAffiliatePayout: () => createAffiliatePayout,
  createAffiliateSale: () => createAffiliateSale,
  createCommunityUser: () => createCommunityUser,
  createMeditation: () => createMeditation,
  createPushMessage: () => createPushMessage,
  deactivatePushToken: () => deactivatePushToken,
  deleteCommunityUser: () => deleteCommunityUser,
  deleteMeditation: () => deleteMeditation,
  generateAffiliateCode: () => generateAffiliateCode,
  getAcademyWaitlist: () => getAcademyWaitlist,
  getActiveMeditations: () => getActiveMeditations,
  getAffiliateByCode: () => getAffiliateByCode,
  getAffiliateByEmail: () => getAffiliateByEmail,
  getAffiliateClicks: () => getAffiliateClicks,
  getAffiliatePayouts: () => getAffiliatePayouts,
  getAffiliateSales: () => getAffiliateSales,
  getAllActivePushTokens: () => getAllActivePushTokens,
  getAllAffiliatePayouts: () => getAllAffiliatePayouts,
  getAllAffiliateSales: () => getAllAffiliateSales,
  getAllAffiliates: () => getAllAffiliates,
  getAllCommunityUsers: () => getAllCommunityUsers,
  getAllMeditations: () => getAllMeditations,
  getCommunityUserByEmail: () => getCommunityUserByEmail,
  getCommunityUsersWithEmailConsent: () => getCommunityUsersWithEmailConsent,
  getDb: () => getDb,
  getPushMessageHistory: () => getPushMessageHistory,
  getPushTokenCount: () => getPushTokenCount,
  getUserByOpenId: () => getUserByOpenId,
  recordAffiliateClick: () => recordAffiliateClick,
  registerPushToken: () => registerPushToken,
  resetDb: () => resetDb,
  updateAffiliate: () => updateAffiliate,
  updateAffiliateSaleStatus: () => updateAffiliateSaleStatus,
  updateCommunityUser: () => updateCommunityUser,
  updateCommunityUserEmailConsent: () => updateCommunityUserEmailConsent,
  updateMeditation: () => updateMeditation,
  updatePushMessage: () => updatePushMessage,
  upsertUser: () => upsertUser
});
import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
function getSslConfig(dbUrl) {
  if (dbUrl.includes(".render.com") || dbUrl.match(/dpg-[a-z0-9]+-a/)) {
    console.log("[Database] Render-internal DB detected, SSL disabled");
    return false;
  }
  return "require";
}
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    const sslConfig = getSslConfig(process.env.DATABASE_URL);
    for (let attempt = 1; attempt <= MAX_DB_RETRIES; attempt++) {
      try {
        const client = postgres(process.env.DATABASE_URL, {
          ssl: sslConfig,
          max: 5,
          connect_timeout: 30,
          idle_timeout: 20,
          max_lifetime: 60 * 5,
          connection: {
            statement_timeout: 15e3,
            lock_timeout: 1e4
          }
        });
        _db = drizzle(client);
        _dbRetries = 0;
        console.log(`[Database] Connected successfully (attempt ${attempt})`);
        break;
      } catch (error) {
        console.warn(`[Database] Connection attempt ${attempt}/${MAX_DB_RETRIES} failed:`, error.message || error);
        _db = null;
        if (attempt < MAX_DB_RETRIES) {
          await new Promise((r) => setTimeout(r, 2e3));
        }
      }
    }
  }
  return _db;
}
function resetDb() {
  _db = null;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAllMeditations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(meditations).orderBy(desc(meditations.createdAt));
}
async function getActiveMeditations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(meditations).where(eq(meditations.isActive, 1)).orderBy(desc(meditations.createdAt));
}
async function createMeditation(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(meditations).values(data).returning({ id: meditations.id });
  return result[0].id;
}
async function deleteMeditation(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(meditations).where(eq(meditations.id, id));
}
async function updateMeditation(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(meditations).set(data).where(eq(meditations.id, id));
}
async function getAllCommunityUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(communityUsers).orderBy(desc(communityUsers.createdAt));
}
async function getCommunityUserByEmail(email) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(communityUsers).where(eq(communityUsers.email, email.toLowerCase())).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createCommunityUser(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(communityUsers).values({
    email: data.email.toLowerCase(),
    password: data.password,
    name: data.name,
    mustChangePassword: data.mustChangePassword || 0
  }).returning({ id: communityUsers.id });
  return result[0].id;
}
async function updateCommunityUser(email, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(communityUsers).set(data).where(eq(communityUsers.email, email.toLowerCase()));
}
async function deleteCommunityUser(email) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(communityUsers).where(eq(communityUsers.email, email.toLowerCase()));
}
async function updateCommunityUserEmailConsent(email, consent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(communityUsers).set({
    emailConsent: consent ? 1 : 0,
    emailConsentDate: consent ? /* @__PURE__ */ new Date() : null
  }).where(eq(communityUsers.email, email.toLowerCase()));
}
async function getCommunityUsersWithEmailConsent() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(communityUsers).where(eq(communityUsers.emailConsent, 1));
}
async function generateAffiliateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SP-";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}
async function getAffiliateByEmail(email) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(affiliateCodes).where(eq(affiliateCodes.email, email.toLowerCase())).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAffiliateByCode(code) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(affiliateCodes).where(eq(affiliateCodes.code, code.toUpperCase())).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAllAffiliates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliateCodes).orderBy(desc(affiliateCodes.createdAt));
}
async function createAffiliate(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(affiliateCodes).values({
    email: data.email.toLowerCase(),
    name: data.name,
    code: data.code.toUpperCase()
  }).returning({ id: affiliateCodes.id });
  return result[0].id;
}
async function updateAffiliate(code, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(affiliateCodes).set(data).where(eq(affiliateCodes.code, code.toUpperCase()));
}
async function recordAffiliateClick(code, ipHash, userAgent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(affiliateClicks).values({
    affiliateCode: code.toUpperCase(),
    ipHash: ipHash || null,
    userAgent: userAgent || null
  });
  await db.update(affiliateCodes).set({ totalClicks: sql`"totalClicks" + 1` }).where(eq(affiliateCodes.code, code.toUpperCase()));
}
async function getAffiliateClicks(code) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliateClicks).where(eq(affiliateClicks.affiliateCode, code.toUpperCase())).orderBy(desc(affiliateClicks.createdAt));
}
async function createAffiliateSale(data) {
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
    notes: data.notes || null
  }).returning({ id: affiliateSales.id });
  await db.update(affiliateCodes).set({
    totalSales: sql`"totalSales" + 1`,
    totalEarnings: sql`"totalEarnings" + ${data.commissionAmount}`
  }).where(eq(affiliateCodes.code, data.affiliateCode.toUpperCase()));
  return result[0].id;
}
async function getAffiliateSales(code) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliateSales).where(eq(affiliateSales.affiliateCode, code.toUpperCase())).orderBy(desc(affiliateSales.createdAt));
}
async function getAllAffiliateSales() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliateSales).orderBy(desc(affiliateSales.createdAt));
}
async function updateAffiliateSaleStatus(id, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(affiliateSales).set({ status }).where(eq(affiliateSales.id, id));
}
async function createAffiliatePayout(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(affiliatePayouts).values({
    affiliateCode: data.affiliateCode.toUpperCase(),
    amount: data.amount,
    method: data.method,
    reference: data.reference || null,
    notes: data.notes || null
  }).returning({ id: affiliatePayouts.id });
  await db.update(affiliateCodes).set({ totalPaid: sql`"totalPaid" + ${data.amount}` }).where(eq(affiliateCodes.code, data.affiliateCode.toUpperCase()));
  return result[0].id;
}
async function getAffiliatePayouts(code) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliatePayouts).where(eq(affiliatePayouts.affiliateCode, code.toUpperCase())).orderBy(desc(affiliatePayouts.createdAt));
}
async function getAllAffiliatePayouts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliatePayouts).orderBy(desc(affiliatePayouts.createdAt));
}
async function registerPushToken(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(pushTokens).values({
    token: data.token,
    platform: data.platform || null,
    communityEmail: data.communityEmail || null,
    isActive: 1,
    updatedAt: /* @__PURE__ */ new Date()
  }).onConflictDoUpdate({
    target: pushTokens.token,
    set: {
      platform: data.platform || null,
      communityEmail: data.communityEmail || null,
      isActive: 1,
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
}
async function getAllActivePushTokens() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pushTokens).where(eq(pushTokens.isActive, 1));
}
async function deactivatePushToken(token) {
  const db = await getDb();
  if (!db) return;
  await db.update(pushTokens).set({ isActive: 0 }).where(eq(pushTokens.token, token));
}
async function createPushMessage(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pushMessages).values(data).returning({ id: pushMessages.id });
  return result[0].id;
}
async function updatePushMessage(id, data) {
  const db = await getDb();
  if (!db) return;
  await db.update(pushMessages).set(data).where(eq(pushMessages.id, id));
}
async function getPushMessageHistory() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pushMessages).orderBy(desc(pushMessages.createdAt)).limit(50);
}
async function getPushTokenCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql`count(*)` }).from(pushTokens).where(eq(pushTokens.isActive, 1));
  return Number(result[0]?.count || 0);
}
async function addAcademyWaitlist(email) {
  const db = await getDb();
  if (!db) throw new Error("No database connection");
  const client = postgres(process.env.DATABASE_URL, { ssl: getSslConfig(process.env.DATABASE_URL) });
  try {
    await client`INSERT INTO academy_waitlist (email) VALUES (${email.toLowerCase()}) ON CONFLICT (email) DO NOTHING`;
  } finally {
    await client.end();
  }
  return { success: true };
}
async function getAcademyWaitlist() {
  const db = await getDb();
  if (!db) return [];
  const client = postgres(process.env.DATABASE_URL, { ssl: getSslConfig(process.env.DATABASE_URL) });
  try {
    const rows = await client`SELECT id, email, "createdAt" FROM academy_waitlist ORDER BY "createdAt" DESC`;
    return rows;
  } finally {
    await client.end();
  }
}
var _db, _dbRetries, MAX_DB_RETRIES;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
    _dbRetries = 0;
    MAX_DB_RETRIES = 3;
  }
});

// server/email.ts
var email_exports = {};
__export(email_exports, {
  sendAcademyWaitlistEmail: () => sendAcademyWaitlistEmail,
  sendAffiliateAdminNotification: () => sendAffiliateAdminNotification,
  sendAffiliatePayoutEmail: () => sendAffiliatePayoutEmail,
  sendAffiliateSaleNotification: () => sendAffiliateSaleNotification,
  sendAffiliateWelcomeEmail: () => sendAffiliateWelcomeEmail,
  sendBroadcastEmail: () => sendBroadcastEmail,
  sendPasswordResetEmail: () => sendPasswordResetEmail,
  sendSeelenjournalEntryNotification: () => sendSeelenjournalEntryNotification,
  sendSeelenjournalMessageNotification: () => sendSeelenjournalMessageNotification,
  sendWelcomeEmail: () => sendWelcomeEmail,
  verifySmtpConnection: () => verifySmtpConnection
});
import nodemailer from "nodemailer";
function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromName = process.env.SMTP_FROM_NAME || "Die Seelenplanerin";
  if (!host || !user || !pass) {
    throw new Error("SMTP-Konfiguration fehlt. Bitte SMTP_HOST, SMTP_USER und SMTP_PASS setzen.");
  }
  return { host, port, user, pass, fromName };
}
function createTransporter() {
  const config = getSmtpConfig();
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass
    }
  });
}
function emailTemplate(content) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#FDF8F4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FDF8F4;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background-color:#FFFFFF;border-radius:24px;border:1px solid #EDD9D0;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#F9EDE8;padding:32px 32px 24px;text-align:center;">
              <div style="font-size:40px;margin-bottom:12px;">\u{1F338}</div>
              <h1 style="margin:0;font-size:24px;color:#5C3317;font-weight:700;">Die Seelenplanerin</h1>
              <p style="margin:6px 0 0;font-size:14px;color:#A08070;">Dein spiritueller Begleiter</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #EDD9D0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#A08070;line-height:20px;">
                Mit Liebe gesendet von der Seelenplanerin \u2728<br>
                <a href="https://www.instagram.com/die.seelenplanerin" style="color:#C4826A;text-decoration:none;">@die.seelenplanerin</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
async function sendWelcomeEmail(params) {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();
    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">Willkommen, ${params.toName}! \u{1F319}</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#8B5E3C;line-height:24px;">
        Sch\xF6n, dass du Teil unserer Community wirst. Hier sind deine Zugangsdaten f\xFCr die Seelenplanerin-App:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF3E7;border-radius:16px;border:1px solid #E8D5B0;margin:0 0 20px;">
        <tr>
          <td style="padding:20px;">
            <p style="margin:0 0 8px;font-size:13px;color:#A08070;font-weight:600;">E-Mail-Adresse</p>
            <p style="margin:0 0 16px;font-size:16px;color:#5C3317;font-weight:700;">${params.toEmail}</p>
            <p style="margin:0 0 8px;font-size:13px;color:#A08070;font-weight:600;">Tempor\xE4res Passwort</p>
            <p style="margin:0;font-size:20px;color:#C4826A;font-weight:700;letter-spacing:2px;">${params.tempPassword}</p>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 16px;font-size:14px;color:#8B5E3C;line-height:22px;">
        <strong>So geht's weiter:</strong>
      </p>
      <ol style="margin:0 0 20px;padding-left:20px;font-size:14px;color:#8B5E3C;line-height:24px;">
        <li>\xD6ffne die Seelenplanerin-App</li>
        <li>Gehe zum Tab <strong>Community</strong></li>
        <li>Melde dich mit deiner E-Mail und dem tempor\xE4ren Passwort an</li>
        <li>Du wirst aufgefordert, ein eigenes Passwort zu w\xE4hlen</li>
      </ol>
      <p style="margin:0;font-size:14px;color:#A08070;font-style:italic;text-align:center;">
        "Dieser Raum geh\xF6rt uns \u2013 ein sicherer Ort f\xFCr alle Frauen, die ihren spirituellen Weg gehen." \u2728
      </p>`;
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: params.toEmail,
      subject: `\u{1F338} Willkommen in der Seelenplanerin-Community, ${params.toName}!`,
      html: emailTemplate(content)
    });
    return { success: true };
  } catch (err) {
    console.error("[Email] Fehler beim Senden:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}
async function sendPasswordResetEmail(params) {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();
    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">Neues Passwort, ${params.toName} \u{1F511}</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#8B5E3C;line-height:24px;">
        Dein Passwort f\xFCr die Seelenplanerin-Community wurde zur\xFCckgesetzt. Hier ist dein neues tempor\xE4res Passwort:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9EDE8;border-radius:16px;border:1px solid #EDD9D0;margin:0 0 20px;">
        <tr>
          <td style="padding:20px;text-align:center;">
            <p style="margin:0 0 8px;font-size:13px;color:#A08070;font-weight:600;">Dein neues tempor\xE4res Passwort</p>
            <p style="margin:0;font-size:24px;color:#C4826A;font-weight:700;letter-spacing:3px;">${params.tempPassword}</p>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 16px;font-size:14px;color:#8B5E3C;line-height:22px;">
        Melde dich mit diesem Passwort in der App an. Du wirst dann aufgefordert, ein neues pers\xF6nliches Passwort zu w\xE4hlen.
      </p>
      <p style="margin:0;font-size:13px;color:#A08070;text-align:center;">
        Falls du kein neues Passwort angefordert hast, kannst du diese E-Mail ignorieren.
      </p>`;
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: params.toEmail,
      subject: `\u{1F511} Neues Passwort f\xFCr die Seelenplanerin-Community`,
      html: emailTemplate(content)
    });
    return { success: true };
  } catch (err) {
    console.error("[Email] Fehler beim Senden:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}
async function sendBroadcastEmail(params) {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();
    let sent = 0;
    let failed = 0;
    const errors = [];
    const safeMessage = params.message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
    for (const recipient of params.recipients) {
      try {
        const content = `
          <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">Nachricht von der Seelenplanerin \u{1F338}</h2>
          <p style="margin:0 0 16px;font-size:15px;color:#C4826A;">Hallo ${recipient.name},</p>
          <div style="margin:0 0 20px;font-size:15px;color:#8B5E3C;line-height:26px;">${safeMessage}</div>
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF3E7;border-radius:16px;border:1px solid #E8D5B0;margin:0 0 20px;">
            <tr>
              <td style="padding:16px;text-align:center;">
                <p style="margin:0;font-size:14px;color:#8B5E3C;">
                  \xD6ffne die <strong>Seelenplanerin-App</strong> f\xFCr mehr Inhalte \u2728
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:0;font-size:13px;color:#A08070;text-align:center;font-style:italic;">
            "Vertraue deinem Weg \u2013 die Sterne begleiten dich." \u{1F319}
          </p>`;
        await transporter.sendMail({
          from: `"${config.fromName}" <${config.user}>`,
          to: recipient.email,
          subject: params.subject,
          html: emailTemplate(content)
        });
        sent++;
      } catch (err) {
        failed++;
        errors.push(`${recipient.email}: ${err.message}`);
      }
    }
    return { success: failed === 0, sent, failed, errors };
  } catch (err) {
    console.error("[Email] Broadcast-Fehler:", err);
    return { success: false, sent: 0, failed: params.recipients.length, errors: [err.message] };
  }
}
async function sendAffiliateWelcomeEmail(params) {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();
    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">Willkommen bei \u201EGeben & Nehmen\u201C, ${params.toName}! \u{1F91D}</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#8B5E3C;line-height:24px;">
        Wie wundersch\xF6n, dass du dich entschieden hast, Teil unseres Empfehlungsprogramms zu werden! Du bist jetzt offiziell Botschafterin der Seelenplanerin \u2013 und verdienst <strong>20% Provision</strong> auf jeden Verkauf \xFCber deinen pers\xF6nlichen Link (nur auf den Produktpreis, nicht auf Versandkosten).
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF3E7;border-radius:16px;border:1px solid #E8D5B0;margin:0 0 20px;">
        <tr>
          <td style="padding:20px;text-align:center;">
            <p style="margin:0 0 8px;font-size:13px;color:#A08070;font-weight:600;">Dein pers\xF6nlicher Empfehlungscode</p>
            <p style="margin:0 0 16px;font-size:28px;color:#C9A96E;font-weight:700;letter-spacing:3px;">${params.affiliateCode}</p>
            <p style="margin:0 0 8px;font-size:13px;color:#A08070;">Der K\xE4ufer gibt diesen Code bei der Bestellung auf Tentary im Gutscheinfeld ein.</p>
            <p style="margin:0;font-size:12px;color:#A08070;">Dein Link: <a href="${params.affiliateLink}" style="color:#C4826A;">${params.affiliateLink}</a></p>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 12px;font-size:15px;color:#5C3317;font-weight:700;">So funktioniert\u2019s \u2013 in 3 Schritten:</p>

      <ol style="margin:0 0 20px;padding-left:20px;font-size:14px;color:#8B5E3C;line-height:26px;">
        <li><strong>Teile deinen Code</strong> \u2013 per WhatsApp, Instagram, Facebook oder pers\xF6nlich</li>
        <li><strong>Der K\xE4ufer gibt deinen Code bei der Bestellung ein</strong> \u2013 egal ob Armband, Kerze, Aura Reading, Soul Talk oder Seelenimpuls</li>
        <li><strong>Du erh\xE4ltst 20% Provision</strong> \u2013 sobald die Zahlung positiv eingegangen ist</li>
      </ol>

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9EDE8;border-radius:16px;border:1px solid #EDD9D0;margin:0 0 20px;">
        <tr>
          <td style="padding:16px;">
            <p style="margin:0 0 8px;font-size:14px;color:#5C3317;font-weight:700;">Beispiele \u2013 was du verdienen kannst:</p>
            <table width="100%" style="font-size:13px;color:#8B5E3C;">
              <tr><td style="padding:4px 0;">Seelenimpuls (17 \u20AC/Monat)</td><td style="text-align:right;font-weight:700;color:#4CAF50;">3,40 \u20AC</td></tr>
              <tr><td style="padding:4px 0;">Schutzarmband Mariposa (24 \u20AC)</td><td style="text-align:right;font-weight:700;color:#4CAF50;">4,80 \u20AC</td></tr>
              <tr><td style="padding:4px 0;">Runen-Charm einzeln (24 \u20AC)</td><td style="text-align:right;font-weight:700;color:#4CAF50;">4,80 \u20AC</td></tr>
              <tr><td style="padding:4px 0;">Meditationskerze (17 \u20AC)</td><td style="text-align:right;font-weight:700;color:#4CAF50;">3,40 \u20AC</td></tr>
              <tr><td style="padding:4px 0;">Aura Reading (77 \u20AC)</td><td style="text-align:right;font-weight:700;color:#4CAF50;">15,40 \u20AC</td></tr>
              <tr><td style="padding:4px 0;">Runen-Armband (94 \u20AC)</td><td style="text-align:right;font-weight:700;color:#4CAF50;">18,80 \u20AC</td></tr>
              <tr><td style="padding:4px 0;">Deep Talk (ab 111 \u20AC)</td><td style="text-align:right;font-weight:700;color:#4CAF50;">ab 22,20 \u20AC</td></tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 12px;font-size:14px;color:#8B5E3C;line-height:22px;">
        <strong>Wichtig:</strong> Bitte hinterlege deine <strong>PayPal-E-Mail</strong> in der App unter \u201EGeben & Nehmen\u201C \u2192 \u201EDeine Zahlungsdaten\u201C, damit wir dir deine Provision auszahlen k\xF6nnen. Es gibt <strong>keinen Mindestbetrag</strong> \u2013 jeder Cent wird ausgezahlt!
      </p>

      <p style="margin:0;font-size:14px;color:#A08070;font-style:italic;text-align:center;">
        \u201ETeile, was dir am Herzen liegt \u2013 und die F\xFClle kommt zu dir zur\xFCck.\u201C \u{1F319}\u2728
      </p>`;
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: params.toEmail,
      subject: `\u{1F91D} Willkommen bei \u201EGeben & Nehmen\u201C \u2013 Dein Empfehlungslink ist da, ${params.toName}!`,
      html: emailTemplate(content)
    });
    return { success: true };
  } catch (err) {
    console.error("[Email] Affiliate-Willkommen Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}
async function sendAffiliateSaleNotification(params) {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();
    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">Neuer Verkauf \xFCber deinen Link! \u{1F389}</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#8B5E3C;line-height:24px;">
        Hallo ${params.toName}, gro\xDFartige Neuigkeiten! Es wurde gerade ein Verkauf \xFCber deinen Empfehlungslink get\xE4tigt.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0FFF0;border-radius:16px;border:1px solid #C8E6C9;margin:0 0 20px;">
        <tr>
          <td style="padding:20px;">
            <table width="100%" style="font-size:14px;color:#5C3317;">
              <tr><td style="padding:6px 0;font-weight:600;">Produkt:</td><td style="text-align:right;">${params.product}</td></tr>
              <tr><td style="padding:6px 0;font-weight:600;">Verkaufsbetrag:</td><td style="text-align:right;">${params.amount} \u20AC</td></tr>
              <tr><td style="padding:6px 0;font-weight:600;">K\xE4ufer:</td><td style="text-align:right;">${params.customerName}</td></tr>
              <tr style="border-top:1px solid #C8E6C9;"><td style="padding:10px 0 6px;font-weight:700;font-size:16px;color:#4CAF50;">Deine Provision (20%):</td><td style="text-align:right;font-weight:700;font-size:16px;color:#4CAF50;">${params.commission} \u20AC</td></tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 12px;font-size:14px;color:#8B5E3C;line-height:22px;">
        Die Provision wird dir ausgezahlt, sobald die Zahlung positiv eingegangen ist. Du kannst deinen aktuellen Stand jederzeit in der App unter <strong>\u201EGeben & Nehmen\u201C</strong> einsehen.
      </p>

      <p style="margin:0 0 12px;font-size:14px;color:#8B5E3C;line-height:22px;">
        <strong>Dein Affiliate-Code:</strong> ${params.affiliateCode}
      </p>

      <p style="margin:0;font-size:14px;color:#A08070;font-style:italic;text-align:center;">
        Weiter so \u2013 du baust dir etwas Wundersch\xF6nes auf! \u{1F319}\u2728
      </p>`;
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: params.toEmail,
      subject: `\u{1F389} Neuer Verkauf! Du hast ${params.commission} \u20AC Provision verdient, ${params.toName}!`,
      html: emailTemplate(content)
    });
    return { success: true };
  } catch (err) {
    console.error("[Email] Affiliate-Sale-Benachrichtigung Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}
async function sendAcademyWaitlistEmail(email) {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();
    const content = `
      <div style="text-align:center;margin-bottom:20px;">
        <span style="font-size:48px;">\u{1F393}</span>
      </div>
      <h1 style="color:#C9A96E;text-align:center;font-size:24px;">Seelen Academy \u2013 Du bist dabei!</h1>
      <p style="text-align:center;color:#666;font-size:16px;line-height:1.6;">
        Liebe Seele,<br><br>
        vielen Dank, dass du dich f\xFCr die <strong>Seelen Academy</strong> interessierst!
        Du bist jetzt auf der Warteliste und wirst als Erste erfahren, wenn die Ausbildungen starten.
      </p>
      <div style="background:#FDF8F4;border-radius:12px;padding:20px;margin:20px 0;">
        <h3 style="color:#3D2314;margin-bottom:12px;">Geplante Ausbildungen:</h3>
        <p style="color:#666;margin:8px 0;">\u{1F441}\uFE0F <strong>Aura Reading Ausbildung</strong> \u2013 Coming Soon</p>
        <p style="color:#666;margin:8px 0;">\u{1F300} <strong>Theta Healing Ausbildung</strong> \u2013 Coming Soon</p>
      </div>
      <p style="text-align:center;color:#666;font-size:14px;line-height:1.6;">
        Ich freue mich riesig, dass du diesen Weg mit mir gehen m\xF6chtest.
        Sobald es Neuigkeiten gibt, melde ich mich bei dir!<br><br>
        Von Herzen,<br>
        <strong>Lara \u2013 Die Seelenplanerin</strong> \u2728
      </p>
    `;
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: email,
      subject: "\u{1F393} Seelen Academy \u2013 Du bist auf der Warteliste!",
      html: emailTemplate(content)
    });
    return { success: true };
  } catch (err) {
    console.error("[Email] Academy-Warteliste Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}
async function verifySmtpConnection() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { success: true };
  } catch (err) {
    console.error("[Email] SMTP-Verbindung fehlgeschlagen:", err);
    return { success: false, error: err.message || "Verbindung fehlgeschlagen" };
  }
}
async function sendAffiliateAdminNotification(params) {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();
    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">Neue Affiliate-Anmeldung! \u{1F91D}</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#8B5E3C;line-height:24px;">
        Es hat sich eine neue Person f\xFCr das Empfehlungsprogramm \u201EGeben & Nehmen" angemeldet.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF3E7;border-radius:16px;border:1px solid #E8D5B0;margin:0 0 20px;">
        <tr>
          <td style="padding:20px;">
            <table width="100%" style="font-size:14px;color:#5C3317;">
              <tr><td style="padding:6px 0;font-weight:600;">Name:</td><td style="text-align:right;">${params.affiliateName}</td></tr>
              <tr><td style="padding:6px 0;font-weight:600;">E-Mail:</td><td style="text-align:right;">${params.affiliateEmail}</td></tr>
              <tr><td style="padding:6px 0;font-weight:600;">Zugewiesener Code:</td><td style="text-align:right;font-weight:700;font-size:18px;color:#C9A96E;letter-spacing:2px;">${params.affiliateCode}</td></tr>
            </table>
          </td>
        </tr>
      </table>

      <div style="background-color:#FFF3E0;border-radius:12px;padding:16px;border:1px solid #FFE0B2;margin:0 0 16px;">
        <p style="margin:0;font-size:14px;color:#E65100;font-weight:700;">\u26A0\uFE0F N\xE4chster Schritt:</p>
        <p style="margin:8px 0 0;font-size:14px;color:#8B5E3C;line-height:22px;">
          Bitte lege den Gutscheincode <strong style="color:#C9A96E;">${params.affiliateCode}</strong> auf Tentary an, damit K\xE4ufer ihn bei der Bestellung eingeben k\xF6nnen.
        </p>
      </div>`;
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: config.user,
      // An Admin (= SMTP-User)
      subject: `\u{1F91D} Neue Affiliate-Anmeldung: ${params.affiliateName} (Code: ${params.affiliateCode})`,
      html: emailTemplate(content)
    });
    return { success: true };
  } catch (err) {
    console.error("[Email] Affiliate-Admin-Benachrichtigung Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}
async function sendAffiliatePayoutEmail(params) {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();
    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">Deine Provision wurde ausgezahlt! \u{1F4B8}</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#8B5E3C;line-height:24px;">
        Hallo ${params.toName}, wir haben dir soeben deine Provision \xFCberwiesen!
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#E8F5E9;border-radius:16px;border:1px solid #C8E6C9;margin:0 0 20px;">
        <tr>
          <td style="padding:20px;">
            <table width="100%" style="font-size:14px;color:#5C3317;">
              <tr><td style="padding:6px 0;font-weight:600;">Betrag:</td><td style="text-align:right;font-weight:700;font-size:18px;color:#4CAF50;">${params.amount} \u20AC</td></tr>
              <tr><td style="padding:6px 0;font-weight:600;">Methode:</td><td style="text-align:right;">PayPal</td></tr>
              ${params.reference ? `<tr><td style="padding:6px 0;font-weight:600;">Referenz:</td><td style="text-align:right;">${params.reference}</td></tr>` : ""}
            </table>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 12px;font-size:14px;color:#8B5E3C;line-height:22px;">
        Bitte pr\xFCfe dein PayPal-Konto \u2013 der Betrag sollte in K\xFCrze dort eingehen. Falls du Fragen hast, melde dich gerne bei uns.
      </p>

      <p style="margin:0;font-size:14px;color:#A08070;font-style:italic;text-align:center;">
        Danke, dass du Die Seelenplanerin weiterempfiehlst! \u{1F338}\u2728
      </p>`;
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: params.toEmail,
      subject: `\u{1F4B8} Auszahlung: ${params.amount} \u20AC wurden an dich \xFCberwiesen, ${params.toName}!`,
      html: emailTemplate(content)
    });
    return { success: true };
  } catch (err) {
    console.error("[Email] Affiliate-Auszahlungs-E-Mail Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}
async function sendSeelenjournalMessageNotification(params) {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();
    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">
        Neue Nachricht f\xFCr dich, ${params.toName} \u{1F48C}
      </h2>
      <p style="margin:0 0 20px;font-size:15px;color:#5C3317;line-height:1.6;">
        Du hast eine neue pers\xF6nliche Nachricht von der Seelenplanerin erhalten:
      </p>
      <div style="background-color:#F9EDE8;border-radius:16px;padding:20px;margin:0 0 24px;">
        <p style="margin:0;font-size:15px;color:#5C3317;line-height:1.6;font-style:italic;">
          \u201E${params.messagePreview.length > 200 ? params.messagePreview.substring(0, 200) + "..." : params.messagePreview}"
        </p>
      </div>
      <p style="margin:0 0 20px;font-size:14px;color:#A08070;">
        \xD6ffne dein Seelenjournal, um die vollst\xE4ndige Nachricht zu lesen und zu antworten.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://seelenplanerin-app.onrender.com/seelenjournal-login" 
           style="display:inline-block;background-color:#C4897B;color:#FFFFFF;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:600;font-size:15px;">
          Zum Seelenjournal \u2192
        </a>
      </div>
    `;
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: params.toEmail,
      subject: `\u{1F48C} Neue Nachricht von der Seelenplanerin, ${params.toName}!`,
      html: emailTemplate(content)
    });
    return { success: true };
  } catch (err) {
    console.error("[Email] Seelenjournal-Nachricht Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}
async function sendSeelenjournalEntryNotification(params) {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();
    const categoryBadge = params.entryCategory ? `<span style="display:inline-block;background-color:#E8F0E8;color:#5C6B5C;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;margin-bottom:12px;">${params.entryCategory}</span><br>` : "";
    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">
        Neuer Eintrag in deinem Seelenjournal \u2728
      </h2>
      <p style="margin:0 0 20px;font-size:15px;color:#5C3317;line-height:1.6;">
        Liebe ${params.toName}, es gibt etwas Neues f\xFCr dich in deinem pers\xF6nlichen Seelenjournal:
      </p>
      <div style="background-color:#F9EDE8;border-radius:16px;padding:20px;margin:0 0 24px;text-align:center;">
        ${categoryBadge}
        <p style="margin:0;font-size:18px;color:#5C3317;font-weight:700;">
          ${params.entryTitle}
        </p>
      </div>
      <p style="margin:0 0 20px;font-size:14px;color:#A08070;">
        Logge dich in dein Seelenjournal ein, um den vollst\xE4ndigen Eintrag zu lesen.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://seelenplanerin-app.onrender.com/seelenjournal-login" 
           style="display:inline-block;background-color:#C4897B;color:#FFFFFF;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:600;font-size:15px;">
          Zum Seelenjournal \u2192
        </a>
      </div>
    `;
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: params.toEmail,
      subject: `\u2728 Neuer Eintrag: ${params.entryTitle} \u2013 Dein Seelenjournal`,
      html: emailTemplate(content)
    });
    return { success: true };
  } catch (err) {
    console.error("[Email] Seelenjournal-Eintrag Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}
var init_email = __esm({
  "server/email.ts"() {
    "use strict";
  }
});

// server/_core/index.ts
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
var LOCAL_HOSTS = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "::1"]);
function isIpAddress(host) {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getParentDomain(hostname) {
  if (LOCAL_HOSTS.has(hostname) || isIpAddress(hostname)) {
    return void 0;
  }
  const parts = hostname.split(".");
  if (parts.length < 3) {
    return void 0;
  }
  return "." + parts.slice(-2).join(".");
}
function getSessionCookieOptions(req) {
  const hostname = req.hostname;
  const domain = getParentDomain(hostname);
  return {
    domain,
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(EXCHANGE_TOKEN_PATH, payload);
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(GET_USER_INFO_PATH, {
      accessToken: token.accessToken
    });
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(platforms.filter((p) => typeof p === "string"));
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice("Bearer ".length).trim();
    }
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = token || cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
async function syncUser(userInfo) {
  if (!userInfo.openId) {
    throw new Error("openId missing from user info");
  }
  const lastSignedIn = /* @__PURE__ */ new Date();
  await upsertUser({
    openId: userInfo.openId,
    name: userInfo.name || null,
    email: userInfo.email ?? null,
    loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
    lastSignedIn
  });
  const saved = await getUserByOpenId(userInfo.openId);
  return saved ?? {
    openId: userInfo.openId,
    name: userInfo.name,
    email: userInfo.email,
    loginMethod: userInfo.loginMethod ?? null,
    lastSignedIn
  };
}
function buildUserResponse(user) {
  return {
    id: user?.id ?? null,
    openId: user?.openId ?? null,
    name: user?.name ?? null,
    email: user?.email ?? null,
    loginMethod: user?.loginMethod ?? null,
    lastSignedIn: (user?.lastSignedIn ?? /* @__PURE__ */ new Date()).toISOString()
  };
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      await syncUser(userInfo);
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      const frontendUrl = process.env.EXPO_WEB_PREVIEW_URL || process.env.EXPO_PACKAGER_PROXY_URL || "http://localhost:8081";
      res.redirect(302, frontendUrl);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
  app.get("/api/oauth/mobile", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      const user = await syncUser(userInfo);
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({
        app_session_id: sessionToken,
        user: buildUserResponse(user)
      });
    } catch (error) {
      console.error("[OAuth] Mobile exchange failed", error);
      res.status(500).json({ error: "OAuth mobile exchange failed" });
    }
  });
  app.post("/api/auth/logout", (req, res) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });
  app.get("/api/auth/me", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      res.json({ user: buildUserResponse(user) });
    } catch (error) {
      console.error("[Auth] /api/auth/me failed:", error);
      res.status(401).json({ error: "Not authenticated", user: null });
    }
  });
  app.post("/api/auth/session", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
        res.status(400).json({ error: "Bearer token required" });
        return;
      }
      const token = authHeader.slice("Bearer ".length).trim();
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, user: buildUserResponse(user) });
    } catch (error) {
      console.error("[Auth] /api/auth/session failed:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  });
}

// server/routers.ts
import { z as z2 } from "zod";

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL("webdevtoken.v1.WebDevService/SendNotification", normalizedBase).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
init_email();

// server/storage.ts
init_env();
function getStorageConfig() {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}
function buildUploadUrl(baseUrl, relKey) {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}
function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function toFormData(data, contentType, fileName) {
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}
function buildAuthHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

// server/routers.ts
init_db();
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  email: router({
    verifySmtp: publicProcedure.query(async () => {
      return verifySmtpConnection();
    }),
    sendWelcome: publicProcedure.input(z2.object({
      toEmail: z2.string().email(),
      toName: z2.string().min(1),
      tempPassword: z2.string().min(1)
    })).mutation(async ({ input }) => {
      return sendWelcomeEmail(input);
    }),
    sendPasswordReset: publicProcedure.input(z2.object({
      toEmail: z2.string().email(),
      toName: z2.string().min(1),
      tempPassword: z2.string().min(1)
    })).mutation(async ({ input }) => {
      return sendPasswordResetEmail(input);
    }),
    sendBroadcast: publicProcedure.input(z2.object({
      subject: z2.string().min(1),
      message: z2.string().min(1)
    })).mutation(async ({ input }) => {
      const usersWithConsent = await getCommunityUsersWithEmailConsent();
      const recipients = usersWithConsent.map((u) => ({ email: u.email, name: u.name }));
      if (recipients.length === 0) {
        return { success: false, sent: 0, failed: 0, errors: ["Keine Mitglieder mit E-Mail-Einwilligung vorhanden."] };
      }
      return sendBroadcastEmail({ recipients, subject: input.subject, message: input.message });
    })
  }),
  meditations: router({
    // Alle aktiven Meditationen laden (für Community-Screen)
    list: publicProcedure.query(async () => {
      return getActiveMeditations();
    }),
    // Alle Meditationen laden (für Admin)
    listAll: publicProcedure.query(async () => {
      return getAllMeditations();
    }),
    // Neue Meditation erstellen
    create: publicProcedure.input(z2.object({
      title: z2.string().min(1),
      description: z2.string().optional(),
      emoji: z2.string().optional(),
      audioUrl: z2.string().min(1),
      isPremium: z2.number().default(1)
    })).mutation(async ({ input }) => {
      const id = await createMeditation({
        title: input.title,
        description: input.description || null,
        emoji: input.emoji || "\u{1F9D8}\u200D\u2640\uFE0F",
        audioUrl: input.audioUrl,
        isPremium: input.isPremium
      });
      return { success: true, id };
    }),
    // Meditation löschen
    delete: publicProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      await deleteMeditation(input.id);
      return { success: true };
    }),
    // Meditation aktualisieren
    update: publicProcedure.input(z2.object({
      id: z2.number(),
      title: z2.string().optional(),
      description: z2.string().optional(),
      emoji: z2.string().optional(),
      isPremium: z2.number().optional(),
      isActive: z2.number().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateMeditation(id, data);
      return { success: true };
    })
  }),
  communityUsers: router({
    // Login: Nutzer per E-Mail finden
    login: publicProcedure.input(z2.object({ email: z2.string().email(), password: z2.string().min(1) })).mutation(async ({ input }) => {
      const user = await getCommunityUserByEmail(input.email);
      if (!user) return { success: false, error: "not_found" };
      if (user.password !== input.password) return { success: false, error: "wrong_password" };
      return { success: true, user: { email: user.email, name: user.name, mustChangePassword: user.mustChangePassword === 1 } };
    }),
    // Alle Nutzer laden (für Admin)
    list: publicProcedure.query(async () => {
      return getAllCommunityUsers();
    }),
    // Neuen Nutzer erstellen (Admin oder Registrierung)
    create: publicProcedure.input(z2.object({
      email: z2.string().email(),
      password: z2.string().min(1),
      name: z2.string().min(1),
      mustChangePassword: z2.number().default(0)
    })).mutation(async ({ input }) => {
      const existing = await getCommunityUserByEmail(input.email);
      if (existing) return { success: false, error: "exists" };
      const id = await createCommunityUser(input);
      return { success: true, id };
    }),
    // Nutzer aktualisieren (Passwort ändern etc.)
    update: publicProcedure.input(z2.object({
      email: z2.string().email(),
      password: z2.string().optional(),
      name: z2.string().optional(),
      mustChangePassword: z2.number().optional()
    })).mutation(async ({ input }) => {
      const { email, ...data } = input;
      const updateData = {};
      if (data.password !== void 0) updateData.password = data.password;
      if (data.name !== void 0) updateData.name = data.name;
      if (data.mustChangePassword !== void 0) updateData.mustChangePassword = data.mustChangePassword;
      await updateCommunityUser(email, updateData);
      return { success: true };
    }),
    // Nutzer löschen
    delete: publicProcedure.input(z2.object({ email: z2.string().email() })).mutation(async ({ input }) => {
      await deleteCommunityUser(input.email);
      return { success: true };
    }),
    // E-Mail-Einwilligung setzen/lesen
    updateEmailConsent: publicProcedure.input(z2.object({
      email: z2.string().email(),
      consent: z2.boolean()
    })).mutation(async ({ input }) => {
      await updateCommunityUserEmailConsent(input.email, input.consent);
      return { success: true };
    }),
    getEmailConsent: publicProcedure.input(z2.object({ email: z2.string().email() })).query(async ({ input }) => {
      const user = await getCommunityUserByEmail(input.email);
      if (!user) return { consent: false, consentDate: null };
      return {
        consent: user.emailConsent === 1,
        consentDate: user.emailConsentDate || null
      };
    })
  }),
  // ── Affiliate-System ──
  affiliate: router({
    // Affiliate-Code für einen Nutzer erstellen oder abrufen
    // Login mit E-Mail + Passwort
    login: publicProcedure.input(z2.object({ email: z2.string().email(), password: z2.string().min(1) })).mutation(async ({ input }) => {
      const affiliate = await getAffiliateByEmail(input.email);
      if (!affiliate) return { success: false, error: "not_found" };
      if (!affiliate.password || affiliate.password !== input.password) {
        return { success: false, error: "wrong_password" };
      }
      return { success: true, affiliate };
    }),
    getOrCreate: publicProcedure.input(z2.object({ email: z2.string().email(), name: z2.string().min(1), password: z2.string().min(4).optional() })).mutation(async ({ input }) => {
      let affiliate = await getAffiliateByEmail(input.email);
      if (affiliate) {
        return { success: false, error: "already_registered" };
      }
      let code = await generateAffiliateCode();
      let attempts = 0;
      while (await getAffiliateByCode(code) && attempts < 10) {
        code = await generateAffiliateCode();
        attempts++;
      }
      const id = await createAffiliate({ email: input.email, name: input.name, code });
      if (input.password) {
        await updateAffiliate(code, { password: input.password });
      }
      affiliate = await getAffiliateByEmail(input.email);
      const affiliateLink = `https://seelenplanerin-app.onrender.com/ref/${code}`;
      sendAffiliateWelcomeEmail({
        toEmail: input.email,
        toName: input.name,
        affiliateCode: code,
        affiliateLink
      }).catch((err) => console.error("[Affiliate] Willkommens-E-Mail Fehler:", err));
      sendAffiliateAdminNotification({
        affiliateName: input.name,
        affiliateEmail: input.email,
        affiliateCode: code
      }).catch((err) => console.error("[Affiliate] Admin-Benachrichtigung Fehler:", err));
      (async () => {
        try {
          const tokens = await getAllActivePushTokens();
          if (tokens.length > 0) {
            const pushMessages2 = tokens.map((t2) => ({
              to: t2.token,
              sound: "default",
              title: "Neue Affiliate-Anmeldung!",
              body: `${input.name} hat sich als Affiliate registriert. Code: ${code} \u2013 Bitte bei Tentary anlegen!`,
              data: { type: "affiliate_new", code, name: input.name, email: input.email }
            }));
            for (let i = 0; i < pushMessages2.length; i += 100) {
              const chunk = pushMessages2.slice(i, i + 100);
              await fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify(chunk)
              });
            }
            console.log(`[Affiliate] Push-Nachricht an ${tokens.length} Ger\xE4te gesendet f\xFCr neuen Affiliate: ${code}`);
          }
        } catch (pushErr) {
          console.error("[Affiliate] Push-Benachrichtigung Fehler:", pushErr);
        }
      })();
      return { success: true, affiliate };
    }),
    // Affiliate-Daten per Code abrufen
    getByCode: publicProcedure.input(z2.object({ code: z2.string().min(1) })).query(async ({ input }) => {
      const affiliate = await getAffiliateByCode(input.code);
      return affiliate || null;
    }),
    // Affiliate-Daten per E-Mail abrufen
    getByEmail: publicProcedure.input(z2.object({ email: z2.string().email() })).query(async ({ input }) => {
      const affiliate = await getAffiliateByEmail(input.email);
      return affiliate || null;
    }),
    // Alle Affiliates laden (Admin)
    list: publicProcedure.query(async () => {
      return getAllAffiliates();
    }),
    // Klick tracken
    trackClick: publicProcedure.input(z2.object({ code: z2.string().min(1), ipHash: z2.string().optional(), userAgent: z2.string().optional() })).mutation(async ({ input }) => {
      const affiliate = await getAffiliateByCode(input.code);
      if (!affiliate) return { success: false, error: "code_not_found" };
      await recordAffiliateClick(input.code, input.ipHash, input.userAgent);
      return { success: true };
    }),
    // Verkäufe eines Affiliates abrufen
    getSales: publicProcedure.input(z2.object({ code: z2.string().min(1) })).query(async ({ input }) => {
      return getAffiliateSales(input.code);
    }),
    // Alle Verkäufe (Admin)
    listAllSales: publicProcedure.query(async () => {
      return getAllAffiliateSales();
    }),
    // Verkauf eintragen (Admin)
    createSale: publicProcedure.input(z2.object({
      affiliateCode: z2.string().min(1),
      productName: z2.string().min(1),
      saleAmount: z2.number().min(1),
      // in Cent
      customerEmail: z2.string().optional(),
      customerName: z2.string().optional(),
      notes: z2.string().optional()
    })).mutation(async ({ input }) => {
      const affiliate = await getAffiliateByCode(input.affiliateCode);
      if (!affiliate) return { success: false, error: "code_not_found" };
      const commissionAmount = Math.round(input.saleAmount * 0.2);
      const id = await createAffiliateSale({
        affiliateCode: input.affiliateCode,
        productName: input.productName,
        saleAmount: input.saleAmount,
        commissionAmount,
        customerEmail: input.customerEmail,
        customerName: input.customerName,
        notes: input.notes
      });
      sendAffiliateSaleNotification({
        toEmail: affiliate.email,
        toName: affiliate.name,
        product: input.productName,
        amount: (input.saleAmount / 100).toFixed(2).replace(".", ","),
        commission: (commissionAmount / 100).toFixed(2).replace(".", ","),
        affiliateCode: input.affiliateCode,
        customerName: input.customerName || "Unbekannt"
      }).catch((err) => console.error("[Affiliate] Verkaufs-E-Mail Fehler:", err));
      return { success: true, id, commissionAmount };
    }),
    // Verkaufsstatus ändern (Admin)
    updateSaleStatus: publicProcedure.input(z2.object({ id: z2.number(), status: z2.string().min(1) })).mutation(async ({ input }) => {
      await updateAffiliateSaleStatus(input.id, input.status);
      return { success: true };
    }),
    // Auszahlung erstellen (Admin)
    createPayout: publicProcedure.input(z2.object({
      affiliateCode: z2.string().min(1),
      amount: z2.number().min(1),
      // in Cent
      method: z2.string().default("paypal"),
      reference: z2.string().optional(),
      notes: z2.string().optional()
    })).mutation(async ({ input }) => {
      const id = await createAffiliatePayout(input);
      const affiliate = await getAffiliateByCode(input.affiliateCode);
      if (affiliate) {
        sendAffiliatePayoutEmail({
          toEmail: affiliate.email,
          toName: affiliate.name,
          amount: (input.amount / 100).toFixed(2).replace(".", ","),
          method: input.method,
          reference: input.reference
        }).catch((err) => console.error("[Affiliate] Auszahlungs-E-Mail Fehler:", err));
      }
      return { success: true, id };
    }),
    // Auszahlungen eines Affiliates
    getPayouts: publicProcedure.input(z2.object({ code: z2.string().min(1) })).query(async ({ input }) => {
      return getAffiliatePayouts(input.code);
    }),
    // Alle Auszahlungen (Admin)
    listAllPayouts: publicProcedure.query(async () => {
      return getAllAffiliatePayouts();
    }),
    // Affiliate aktivieren/deaktivieren (Admin)
    toggleActive: publicProcedure.input(z2.object({ code: z2.string().min(1), isActive: z2.number() })).mutation(async ({ input }) => {
      await updateAffiliate(input.code, { isActive: input.isActive });
      return { success: true };
    }),
    // Passwort vergessen: neues temporäres Passwort per E-Mail senden
    resetPassword: publicProcedure.input(z2.object({ email: z2.string().email() })).mutation(async ({ input }) => {
      const affiliate = await getAffiliateByEmail(input.email);
      if (!affiliate) return { success: false, error: "not_found" };
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let tempPw = "";
      for (let i = 0; i < 6; i++) tempPw += chars[Math.floor(Math.random() * chars.length)];
      await updateAffiliate(affiliate.code, { password: tempPw });
      try {
        const { sendPasswordResetEmail: sendReset } = await Promise.resolve().then(() => (init_email(), email_exports));
        await sendReset({
          toEmail: affiliate.email,
          toName: affiliate.name,
          tempPassword: tempPw
        });
      } catch (emailErr) {
        console.error("[Affiliate] Reset-E-Mail Fehler:", emailErr);
        return { success: false, error: "email_failed" };
      }
      return { success: true };
    }),
    // Passwort ändern (eingeloggt, mit altem Passwort bestätigen)
    changePassword: publicProcedure.input(z2.object({
      code: z2.string().min(1),
      oldPassword: z2.string().min(1),
      newPassword: z2.string().min(4)
    })).mutation(async ({ input }) => {
      const affiliate = await getAffiliateByCode(input.code);
      if (!affiliate) return { success: false, error: "not_found" };
      if (!affiliate.password || affiliate.password !== input.oldPassword) {
        return { success: false, error: "wrong_password" };
      }
      if (input.newPassword.length < 4) {
        return { success: false, error: "too_short" };
      }
      await updateAffiliate(input.code, { password: input.newPassword });
      return { success: true };
    }),
    // Affiliate-Zahlungsdaten aktualisieren
    updatePaymentInfo: publicProcedure.input(z2.object({
      code: z2.string().min(1),
      paypalEmail: z2.string().optional(),
      iban: z2.string().optional()
    })).mutation(async ({ input }) => {
      const updateData = {};
      if (input.paypalEmail !== void 0) updateData.paypalEmail = input.paypalEmail;
      if (input.iban !== void 0) updateData.iban = input.iban;
      await updateAffiliate(input.code, updateData);
      return { success: true };
    })
  }),
  // ── Push-Benachrichtigungen ──
  push: router({
    // Token registrieren (wird beim App-Start aufgerufen)
    registerToken: publicProcedure.input(z2.object({
      token: z2.string().min(1),
      platform: z2.string().optional(),
      communityEmail: z2.string().optional()
    })).mutation(async ({ input }) => {
      try {
        await registerPushToken(input);
        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }),
    // Anzahl registrierter Geräte
    tokenCount: publicProcedure.query(async () => {
      return getPushTokenCount();
    }),
    // Push-Nachricht an alle senden (Admin)
    sendToAll: publicProcedure.input(z2.object({
      title: z2.string().min(1),
      body: z2.string().min(1),
      data: z2.string().optional()
      // JSON-String
    })).mutation(async ({ input }) => {
      const tokens = await getAllActivePushTokens();
      if (tokens.length === 0) {
        return { success: false, sent: 0, failed: 0, error: "Keine registrierten Ger\xE4te vorhanden." };
      }
      const messageId = await createPushMessage({
        title: input.title,
        body: input.body,
        data: input.data || null,
        sentTo: tokens.length
      });
      const messages = tokens.map((t2) => ({
        to: t2.token,
        sound: "default",
        title: input.title,
        body: input.body,
        data: input.data ? JSON.parse(input.data) : void 0
      }));
      let sentSuccess = 0;
      let sentFailed = 0;
      const invalidTokens = [];
      for (let i = 0; i < messages.length; i += 100) {
        const chunk = messages.slice(i, i + 100);
        try {
          const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Accept-encoding": "gzip, deflate",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(chunk)
          });
          const result = await response.json();
          if (result.data) {
            for (const ticket of result.data) {
              if (ticket.status === "ok") {
                sentSuccess++;
              } else {
                sentFailed++;
                if (ticket.details?.error === "DeviceNotRegistered") {
                  const idx = result.data.indexOf(ticket);
                  if (chunk[idx]) invalidTokens.push(chunk[idx].to);
                }
              }
            }
          }
        } catch (e) {
          sentFailed += chunk.length;
        }
      }
      for (const token of invalidTokens) {
        await deactivatePushToken(token);
      }
      await updatePushMessage(messageId, { sentSuccess, sentFailed });
      return { success: true, sent: sentSuccess, failed: sentFailed, total: tokens.length };
    }),
    // Nachrichten-Historie (Admin)
    history: publicProcedure.query(async () => {
      return getPushMessageHistory();
    })
  }),
  academy: router({
    joinWaitlist: publicProcedure.input(z2.object({ email: z2.string().email() })).mutation(async ({ input }) => {
      try {
        const email = input.email.trim().toLowerCase();
        await addAcademyWaitlist(email);
        try {
          await sendAcademyWaitlistEmail(email);
        } catch (e) {
          console.error("Academy email failed:", e);
        }
        return { success: true };
      } catch (e) {
        if (e.message?.includes("duplicate") || e.code === "23505") {
          return { success: true, message: "Bereits eingetragen" };
        }
        throw e;
      }
    }),
    listWaitlist: publicProcedure.query(async () => {
      return getAcademyWaitlist();
    })
  }),
  storage: router({
    uploadAudio: publicProcedure.input(z2.object({
      fileName: z2.string().min(1),
      base64Data: z2.string().min(1),
      contentType: z2.string().default("audio/mpeg")
    })).mutation(async ({ input }) => {
      try {
        const buffer = Buffer.from(input.base64Data, "base64");
        const randomSuffix = Math.random().toString(36).slice(2, 8);
        const safeFileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
        const fileKey = `audio/${safeFileName}-${randomSuffix}.mp3`;
        const result = await storagePut(fileKey, buffer, input.contentType);
        return { success: true, url: result.url, key: result.key };
      } catch (err) {
        return { success: false, error: err.message || "Upload fehlgeschlagen" };
      }
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/index.ts
import multer2 from "multer";

// server/db-migrate.ts
import postgres2 from "postgres";
var MAX_RETRIES = 5;
var RETRY_DELAY_MS = 3e3;
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function getSslConfig2(dbUrl) {
  if (dbUrl.includes(".render.com") || dbUrl.match(/dpg-[a-z0-9]+-a/)) {
    console.log("[db-migrate] Render-internal DB detected, SSL disabled");
    return false;
  }
  return "require";
}
async function connectWithRetry(dbUrl, attempt = 1) {
  try {
    const sslConfig = getSslConfig2(dbUrl);
    const sql3 = postgres2(dbUrl, { ssl: sslConfig, max: 1, connect_timeout: 30 });
    await sql3`SELECT 1`;
    console.log(`[db-migrate] Connected to database (attempt ${attempt})`);
    return sql3;
  } catch (err) {
    console.error(`[db-migrate] Connection attempt ${attempt}/${MAX_RETRIES} failed:`, err.message || err);
    if (attempt >= MAX_RETRIES) {
      throw new Error(`[db-migrate] Failed to connect after ${MAX_RETRIES} attempts: ${err.message}`);
    }
    console.log(`[db-migrate] Retrying in ${RETRY_DELAY_MS}ms...`);
    await sleep(RETRY_DELAY_MS);
    return connectWithRetry(dbUrl, attempt + 1);
  }
}
async function runMigrations() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log("[db-migrate] No DATABASE_URL, skipping migrations");
    return;
  }
  console.log("[db-migrate] Starting migrations with retry logic...");
  const sql3 = await connectWithRetry(dbUrl);
  try {
    await sql3`
      DO $$ BEGIN
        CREATE TYPE role AS ENUM ('user', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    await sql3`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        "openId" VARCHAR(64) NOT NULL UNIQUE,
        name TEXT,
        email VARCHAR(320),
        "loginMethod" VARCHAR(64),
        role role DEFAULT 'user' NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "lastSignedIn" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql3`
      CREATE TABLE IF NOT EXISTS meditations (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        emoji VARCHAR(10) DEFAULT '🧘',
        "audioUrl" TEXT NOT NULL,
        "isPremium" INTEGER DEFAULT 1 NOT NULL,
        "isActive" INTEGER DEFAULT 1 NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql3`
      CREATE TABLE IF NOT EXISTS community_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(320) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        "mustChangePassword" INTEGER DEFAULT 0 NOT NULL,
        "isActive" INTEGER DEFAULT 1 NOT NULL,
        "emailConsent" INTEGER DEFAULT 0 NOT NULL,
        "emailConsentDate" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql3`
      CREATE TABLE IF NOT EXISTS affiliate_codes (
        id SERIAL PRIMARY KEY,
        email VARCHAR(320) NOT NULL UNIQUE,
        code VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        "isActive" INTEGER DEFAULT 1 NOT NULL,
        "totalClicks" INTEGER DEFAULT 0 NOT NULL,
        "totalSales" INTEGER DEFAULT 0 NOT NULL,
        "totalEarnings" INTEGER DEFAULT 0 NOT NULL,
        "totalPaid" INTEGER DEFAULT 0 NOT NULL,
        password VARCHAR(255),
        "paypalEmail" VARCHAR(320),
        iban VARCHAR(50),
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql3`
      CREATE TABLE IF NOT EXISTS affiliate_clicks (
        id SERIAL PRIMARY KEY,
        "affiliateCode" VARCHAR(20) NOT NULL,
        "ipHash" VARCHAR(64),
        "userAgent" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql3`
      CREATE TABLE IF NOT EXISTS affiliate_sales (
        id SERIAL PRIMARY KEY,
        "affiliateCode" VARCHAR(20) NOT NULL,
        "productName" VARCHAR(255) NOT NULL,
        "saleAmount" INTEGER NOT NULL,
        "commissionRate" INTEGER DEFAULT 20 NOT NULL,
        "commissionAmount" INTEGER NOT NULL,
        "customerEmail" VARCHAR(320),
        "customerName" VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending' NOT NULL,
        notes TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql3`
      CREATE TABLE IF NOT EXISTS affiliate_payouts (
        id SERIAL PRIMARY KEY,
        "affiliateCode" VARCHAR(20) NOT NULL,
        amount INTEGER NOT NULL,
        method VARCHAR(50) DEFAULT 'paypal' NOT NULL,
        reference VARCHAR(255),
        notes TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql3`
      CREATE TABLE IF NOT EXISTS academy_waitlist (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql3`
      CREATE TABLE IF NOT EXISTS push_tokens (
        id SERIAL PRIMARY KEY,
        token VARCHAR(255) NOT NULL UNIQUE,
        platform VARCHAR(20),
        "communityEmail" VARCHAR(320),
        "isActive" INTEGER DEFAULT 1 NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql3`
      CREATE TABLE IF NOT EXISTS push_messages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        data TEXT,
        "sentTo" INTEGER DEFAULT 0 NOT NULL,
        "sentSuccess" INTEGER DEFAULT 0 NOT NULL,
        "sentFailed" INTEGER DEFAULT 0 NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql3`
      CREATE TABLE IF NOT EXISTS seelenjournal_clients (
        id SERIAL PRIMARY KEY,
        email VARCHAR(320) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        "readingDate" TIMESTAMP,
        "internalNote" TEXT,
        "isActive" INTEGER DEFAULT 1 NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql3`
      CREATE TABLE IF NOT EXISTS seelenjournal_entries (
        id SERIAL PRIMARY KEY,
        "clientId" INTEGER NOT NULL,
        title VARCHAR(500) NOT NULL,
        content TEXT,
        category VARCHAR(100),
        date TIMESTAMP DEFAULT NOW() NOT NULL,
        "isPublished" INTEGER DEFAULT 0 NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql3`
      CREATE TABLE IF NOT EXISTS seelenjournal_attachments (
        id SERIAL PRIMARY KEY,
        "entryId" INTEGER NOT NULL,
        filename VARCHAR(500) NOT NULL,
        url TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql3`
      CREATE TABLE IF NOT EXISTS seelenjournal_messages (
        id SERIAL PRIMARY KEY,
        "clientId" INTEGER NOT NULL,
        content TEXT NOT NULL,
        "fromAdmin" INTEGER DEFAULT 0 NOT NULL,
        "isRead" INTEGER DEFAULT 0 NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log("[db-migrate] All tables created/verified successfully");
  } catch (err) {
    console.error("[db-migrate] Migration error:", err.message || err);
    throw err;
  } finally {
    await sql3.end();
  }
}

// server/seelenjournal-routes.ts
import { Router } from "express";
import { createHash } from "crypto";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// server/seelenjournal-db.ts
init_db();
init_schema();
import { eq as eq2, desc as desc2, and, sql as sql2 } from "drizzle-orm";
async function getAllJournalClients() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(seelenjournalClients).orderBy(desc2(seelenjournalClients.createdAt));
}
async function getJournalClientByEmail(email) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(seelenjournalClients).where(eq2(seelenjournalClients.email, email.toLowerCase())).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getJournalClientById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(seelenjournalClients).where(eq2(seelenjournalClients.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createJournalClient(data) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    try {
      console.log(`[SJ-DB] createJournalClient attempt ${attempt}: ${data.email}`);
      const result = await db.insert(seelenjournalClients).values({
        email: data.email.toLowerCase(),
        password: data.password,
        name: data.name,
        readingDate: data.readingDate || null,
        internalNote: data.internalNote || null
      }).returning({ id: seelenjournalClients.id });
      console.log(`[SJ-DB] createJournalClient success: id=${result[0].id}`);
      return result[0].id;
    } catch (err) {
      console.error(`[SJ-DB] createJournalClient attempt ${attempt} failed:`, err.message || err);
      if (attempt === 1) {
        console.log("[SJ-DB] Resetting DB connection for retry...");
        resetDb();
        await new Promise((r) => setTimeout(r, 1e3));
      } else {
        throw err;
      }
    }
  }
  throw new Error("createJournalClient: Alle Versuche fehlgeschlagen");
}
async function updateJournalClient(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(seelenjournalClients).set(data).where(eq2(seelenjournalClients.id, id));
}
async function deleteJournalClient(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const entries = await db.select({ id: seelenjournalEntries.id }).from(seelenjournalEntries).where(eq2(seelenjournalEntries.clientId, id));
  for (const entry of entries) {
    await db.delete(seelenjournalAttachments).where(eq2(seelenjournalAttachments.entryId, entry.id));
  }
  await db.delete(seelenjournalEntries).where(eq2(seelenjournalEntries.clientId, id));
  await db.delete(seelenjournalMessages).where(eq2(seelenjournalMessages.clientId, id));
  await db.delete(seelenjournalClients).where(eq2(seelenjournalClients.id, id));
}
async function getClientEntries(clientId, publishedOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (publishedOnly) {
    return db.select().from(seelenjournalEntries).where(and(eq2(seelenjournalEntries.clientId, clientId), eq2(seelenjournalEntries.isPublished, 1))).orderBy(desc2(seelenjournalEntries.date));
  }
  return db.select().from(seelenjournalEntries).where(eq2(seelenjournalEntries.clientId, clientId)).orderBy(desc2(seelenjournalEntries.date));
}
async function getEntryById(entryId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(seelenjournalEntries).where(eq2(seelenjournalEntries.id, entryId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createEntry(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(seelenjournalEntries).values({
    clientId: data.clientId,
    title: data.title,
    content: data.content || null,
    category: data.category || null,
    date: data.date || /* @__PURE__ */ new Date(),
    isPublished: data.isPublished ?? 0
  }).returning({ id: seelenjournalEntries.id });
  return result[0].id;
}
async function updateEntry(entryId, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(seelenjournalEntries).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(seelenjournalEntries.id, entryId));
}
async function deleteEntry(entryId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(seelenjournalAttachments).where(eq2(seelenjournalAttachments.entryId, entryId));
  await db.delete(seelenjournalEntries).where(eq2(seelenjournalEntries.id, entryId));
}
async function getEntryAttachments(entryId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(seelenjournalAttachments).where(eq2(seelenjournalAttachments.entryId, entryId)).orderBy(desc2(seelenjournalAttachments.createdAt));
}
async function createAttachment(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(seelenjournalAttachments).values(data).returning({ id: seelenjournalAttachments.id });
  return result[0].id;
}
async function getAttachmentById(id) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(seelenjournalAttachments).where(eq2(seelenjournalAttachments.id, id)).limit(1);
  return rows[0] || null;
}
async function deleteAttachment(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(seelenjournalAttachments).where(eq2(seelenjournalAttachments.id, id));
}
async function getClientMessages(clientId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(seelenjournalMessages).where(eq2(seelenjournalMessages.clientId, clientId)).orderBy(seelenjournalMessages.createdAt);
}
async function createMessage(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(seelenjournalMessages).values({
    clientId: data.clientId,
    content: data.content,
    fromAdmin: data.fromAdmin
  }).returning({ id: seelenjournalMessages.id });
  return result[0].id;
}
async function markMessagesAsRead(clientId, fromAdmin) {
  const db = await getDb();
  if (!db) return;
  await db.update(seelenjournalMessages).set({ isRead: 1 }).where(and(
    eq2(seelenjournalMessages.clientId, clientId),
    eq2(seelenjournalMessages.fromAdmin, fromAdmin),
    eq2(seelenjournalMessages.isRead, 0)
  ));
}
async function getUnreadMessageCount(clientId, fromAdmin) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql2`count(*)` }).from(seelenjournalMessages).where(and(
    eq2(seelenjournalMessages.clientId, clientId),
    eq2(seelenjournalMessages.fromAdmin, fromAdmin),
    eq2(seelenjournalMessages.isRead, 0)
  ));
  return Number(result[0]?.count || 0);
}
async function getClientsWithUnreadMessages() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({
    clientId: seelenjournalMessages.clientId,
    count: sql2`count(*)`
  }).from(seelenjournalMessages).where(and(
    eq2(seelenjournalMessages.fromAdmin, 0),
    eq2(seelenjournalMessages.isRead, 0)
  )).groupBy(seelenjournalMessages.clientId);
  return result;
}

// server/seelenjournal-routes.ts
init_email();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || ""
});
async function uploadFile(fileKey, buffer, mimetype) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary nicht konfiguriert. Bitte CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY und CLOUDINARY_API_SECRET setzen.");
  }
  return new Promise((resolve, reject) => {
    const resourceType = mimetype.startsWith("image/") ? "image" : "raw";
    const baseName = fileKey.replace(/\.[^.]+$/, "").replace(/[\/\s]/g, "_");
    const publicId = baseName;
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "seelenjournal",
        public_id: publicId,
        resource_type: resourceType
      },
      (error, result) => {
        if (error) {
          console.error("[Seelenjournal] Cloudinary Upload Fehler:", error.message);
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Kein Ergebnis von Cloudinary"));
        }
      }
    );
    uploadStream.end(buffer);
  });
}
var router2 = Router();
var SJ_SECRET = process.env.SEELENJOURNAL_JWT_SECRET || "seelenjournal-default-secret-change-me";
var SJ_ADMIN_EMAIL = process.env.SEELENJOURNAL_ADMIN_EMAIL || "lara@die-seelenplanerin.de";
var SJ_ADMIN_PASSWORD = process.env.SEELENJOURNAL_ADMIN_PASSWORD || "SeelenAdmin2026!";
function createToken(payload, expiresInHours = 168) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const now = Math.floor(Date.now() / 1e3);
  const body = Buffer.from(JSON.stringify({ ...payload, iat: now, exp: now + expiresInHours * 3600 })).toString("base64url");
  const signature = createHash("sha256").update(`${header}.${body}.${SJ_SECRET}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}
function verifyToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = createHash("sha256").update(`${header}.${body}.${SJ_SECRET}`).digest("base64url");
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1e3)) return null;
    return payload;
  } catch {
    return null;
  }
}
function authClient(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Nicht autorisiert" });
    return;
  }
  const payload = verifyToken(auth.slice(7));
  if (!payload || payload.role !== "client") {
    res.status(401).json({ error: "Ung\xFCltiges Token" });
    return;
  }
  req.sjClientId = payload.clientId;
  next();
}
function authAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Nicht autorisiert" });
    return;
  }
  const payload = verifyToken(auth.slice(7));
  if (!payload || payload.role !== "admin") {
    res.status(401).json({ error: "Kein Admin-Zugang" });
    return;
  }
  next();
}
var upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });
router2.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "E-Mail und Passwort erforderlich" });
      return;
    }
    const client = await getJournalClientByEmail(email);
    if (!client) {
      res.status(401).json({ error: "Kein Zugang gefunden. Bitte wende dich an die Seelenplanerin." });
      return;
    }
    if (Number(client.isActive) !== 1) {
      res.status(401).json({ error: "Zugang deaktiviert." });
      return;
    }
    if (client.password !== password) {
      res.status(401).json({ error: "Falsches Passwort." });
      return;
    }
    const token = createToken({ role: "client", clientId: client.id, email: client.email });
    res.json({ success: true, token, client: { id: client.id, name: client.name, email: client.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.get("/me", authClient, async (req, res) => {
  try {
    const client = await getJournalClientById(req.sjClientId);
    if (!client) {
      res.status(404).json({ error: "Nicht gefunden" });
      return;
    }
    res.json({ id: client.id, name: client.name, email: client.email, readingDate: client.readingDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.get("/entries", authClient, async (req, res) => {
  try {
    const entries = await getClientEntries(req.sjClientId, true);
    const entriesWithAttachments = await Promise.all(entries.map(async (entry) => {
      const attachments = await getEntryAttachments(entry.id);
      return { ...entry, attachments };
    }));
    res.json(entriesWithAttachments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.get("/entries/:id", authClient, async (req, res) => {
  try {
    const entry = await getEntryById(parseInt(req.params.id));
    if (!entry || entry.clientId !== req.sjClientId || entry.isPublished !== 1) {
      res.status(404).json({ error: "Eintrag nicht gefunden" });
      return;
    }
    const attachments = await getEntryAttachments(entry.id);
    res.json({ ...entry, attachments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.get("/messages", authClient, async (req, res) => {
  try {
    const clientId = req.sjClientId;
    const messages = await getClientMessages(clientId);
    await markMessagesAsRead(clientId, 1);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.post("/messages", authClient, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) {
      res.status(400).json({ error: "Nachricht darf nicht leer sein" });
      return;
    }
    const id = await createMessage({
      clientId: req.sjClientId,
      content: content.trim(),
      fromAdmin: 0
    });
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.get("/unread-count", authClient, async (req, res) => {
  try {
    const count = await getUnreadMessageCount(req.sjClientId, 1);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === SJ_ADMIN_EMAIL && password === SJ_ADMIN_PASSWORD) {
      const token = createToken({ role: "admin", email });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: "Ung\xFCltige Admin-Zugangsdaten" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.get("/admin/clients", authAdmin, async (_req, res) => {
  try {
    const clients = await getAllJournalClients();
    const unreadMap = await getClientsWithUnreadMessages();
    const clientsWithUnread = clients.map((c) => ({
      ...c,
      unreadMessages: Number(unreadMap.find((u) => u.clientId === c.id)?.count || 0)
    }));
    res.json(clientsWithUnread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.post("/admin/clients", authAdmin, async (req, res) => {
  try {
    const { email, password, name, readingDate, internalNote } = req.body;
    console.log(`[Seelenjournal] POST /admin/clients - email: ${email}, name: ${name}`);
    if (!email || !password || !name) {
      res.status(400).json({ error: "E-Mail, Passwort und Name sind erforderlich" });
      return;
    }
    const existing = await getJournalClientByEmail(email);
    if (existing) {
      res.status(400).json({ error: "E-Mail bereits vorhanden" });
      return;
    }
    const timeoutPromise = new Promise(
      (_, reject) => setTimeout(() => reject(new Error("Datenbank-Timeout: Operation dauerte zu lange (15s)")), 15e3)
    );
    const id = await Promise.race([
      createJournalClient({
        email,
        password,
        name,
        readingDate: readingDate ? new Date(readingDate) : null,
        internalNote: internalNote || null
      }),
      timeoutPromise
    ]);
    console.log(`[Seelenjournal] Klientin erstellt: id=${id}, email=${email}`);
    res.json({ success: true, id });
  } catch (err) {
    console.error(`[Seelenjournal] POST /admin/clients Fehler:`, err.message || err);
    res.status(500).json({ error: err.message || "Unbekannter Fehler" });
  }
});
router2.put("/admin/clients/:id", authAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, password, readingDate, internalNote, isActive } = req.body;
    const updateData = {};
    if (name !== void 0) updateData.name = name;
    if (password !== void 0) updateData.password = password;
    if (readingDate !== void 0) updateData.readingDate = readingDate ? new Date(readingDate) : null;
    if (internalNote !== void 0) updateData.internalNote = internalNote;
    if (isActive !== void 0) updateData.isActive = isActive;
    await updateJournalClient(id, updateData);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.delete("/admin/clients/:id", authAdmin, async (req, res) => {
  try {
    await deleteJournalClient(parseInt(req.params.id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.get("/admin/clients/:id/entries", authAdmin, async (req, res) => {
  try {
    const entries = await getClientEntries(parseInt(req.params.id), false);
    const entriesWithAttachments = await Promise.all(entries.map(async (entry) => {
      const attachments = await getEntryAttachments(entry.id);
      return { ...entry, attachments };
    }));
    res.json(entriesWithAttachments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.post("/admin/clients/:id/entries", authAdmin, async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    const { title, content, category, date, isPublished } = req.body;
    if (!title) {
      res.status(400).json({ error: "Titel ist erforderlich" });
      return;
    }
    const id = await createEntry({
      clientId,
      title,
      content: content || null,
      category: category || null,
      date: date ? new Date(date) : /* @__PURE__ */ new Date(),
      isPublished: isPublished ?? 0
    });
    if (Number(isPublished) === 1) {
      const client = await getJournalClientById(clientId);
      if (client?.email) {
        sendSeelenjournalEntryNotification({
          toEmail: client.email,
          toName: client.name,
          entryTitle: title,
          entryCategory: category || void 0
        }).catch((err) => console.error("[Seelenjournal] Eintrag-E-Mail Fehler:", err));
      }
    }
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.put("/admin/entries/:entryId", authAdmin, async (req, res) => {
  try {
    const entryId = parseInt(req.params.entryId);
    const { title, content, category, date, isPublished } = req.body;
    const updateData = {};
    if (title !== void 0) updateData.title = title;
    if (content !== void 0) updateData.content = content;
    if (category !== void 0) updateData.category = category;
    if (date !== void 0) updateData.date = new Date(date);
    if (isPublished !== void 0) updateData.isPublished = isPublished;
    console.log(`[Seelenjournal] PUT /admin/entries/${entryId} - updateData:`, JSON.stringify(updateData));
    await updateEntry(entryId, updateData);
    if (Number(isPublished) === 1) {
      console.log(`[Seelenjournal] Eintrag ${entryId} wird ver\xF6ffentlicht - E-Mail wird gesendet...`);
      const entry = await getEntryById(entryId);
      if (entry) {
        const client = await getJournalClientById(entry.clientId);
        console.log(`[Seelenjournal] Client gefunden: ${client?.name} (${client?.email})`);
        if (client?.email) {
          try {
            const emailResult = await sendSeelenjournalEntryNotification({
              toEmail: client.email,
              toName: client.name,
              entryTitle: entry.title,
              entryCategory: entry.category || void 0
            });
            console.log(`[Seelenjournal] E-Mail-Ergebnis:`, JSON.stringify(emailResult));
          } catch (emailErr) {
            console.error("[Seelenjournal] Eintrag-E-Mail Fehler:", emailErr);
          }
        } else {
          console.log(`[Seelenjournal] Keine E-Mail-Adresse f\xFCr Client ${entry.clientId}`);
        }
      } else {
        console.log(`[Seelenjournal] Eintrag ${entryId} nicht in DB gefunden nach Update`);
      }
    }
    console.log(`[Seelenjournal] PUT /admin/entries/${entryId} - Erfolg`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.delete("/admin/entries/:entryId", authAdmin, async (req, res) => {
  try {
    await deleteEntry(parseInt(req.params.entryId));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.post("/admin/upload", authAdmin, upload.array("file", 20), async (req, res) => {
  try {
    const files = req.files;
    const entryId = parseInt(req.body.entryId);
    if (!files || files.length === 0 || !entryId) {
      res.status(400).json({ error: "Mindestens eine Datei und entryId erforderlich" });
      return;
    }
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    const results = [];
    const errors = [];
    for (const file of files) {
      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`${file.originalname}: Typ nicht erlaubt (${file.mimetype})`);
        continue;
      }
      try {
        const randomSuffix = Math.random().toString(36).slice(2, 8);
        const safeName = (file.originalname || "file").replace(/[^a-zA-Z0-9._-]/g, "_");
        const extMatch = safeName.match(/\.[^.]+$/);
        const ext = extMatch ? extMatch[0] : "";
        const nameWithoutExt = ext ? safeName.slice(0, -ext.length) : safeName;
        const fileKey = `seelenjournal/${entryId}/${nameWithoutExt}-${randomSuffix}${ext}`;
        const fileUrl = await uploadFile(fileKey, file.buffer, file.mimetype);
        const type = file.mimetype === "application/pdf" ? "pdf" : "image";
        const attachmentId = await createAttachment({
          entryId,
          filename: file.originalname || safeName,
          url: fileUrl,
          type
        });
        results.push({ id: attachmentId, url: fileUrl, type, filename: file.originalname });
      } catch (fileErr) {
        errors.push(`${file.originalname}: ${fileErr.message}`);
      }
    }
    res.json({ success: true, uploaded: results.length, total: files.length, files: results, errors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.get("/download/:id", async (req, res) => {
  try {
    const attachment = await getAttachmentById(parseInt(req.params.id));
    if (!attachment) {
      res.status(404).json({ error: "Anhang nicht gefunden" });
      return;
    }
    const mimeTypes = {
      pdf: "application/pdf",
      image: "image/jpeg"
    };
    const contentType = mimeTypes[attachment.type] || "application/octet-stream";
    const response = await fetch(attachment.url);
    if (!response.ok) {
      res.status(502).json({ error: "Datei konnte nicht geladen werden" });
      return;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `inline; filename="${attachment.filename}"`);
    res.setHeader("Content-Length", buffer.length.toString());
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.delete("/admin/attachments/:id", authAdmin, async (req, res) => {
  try {
    await deleteAttachment(parseInt(req.params.id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.get("/admin/clients/:id/messages", authAdmin, async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    const messages = await getClientMessages(clientId);
    await markMessagesAsRead(clientId, 0);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.post("/admin/clients/:id/messages", authAdmin, async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    const { content } = req.body;
    if (!content?.trim()) {
      res.status(400).json({ error: "Nachricht darf nicht leer sein" });
      return;
    }
    const id = await createMessage({
      clientId,
      content: content.trim(),
      fromAdmin: 1
    });
    const client = await getJournalClientById(clientId);
    if (client?.email) {
      sendSeelenjournalMessageNotification({
        toEmail: client.email,
        toName: client.name,
        messagePreview: content.trim()
      }).catch((err) => console.error("[Seelenjournal] E-Mail-Benachrichtigung Fehler:", err));
    }
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
var seelenjournal_routes_default = router2;

// server/_core/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
function getWebDistPath() {
  const cwdWebDist = path.join(process.cwd(), "web-dist");
  if (fs.existsSync(cwdWebDist)) return cwdWebDist;
  const cwdDist = path.join(process.cwd(), "dist");
  if (fs.existsSync(path.join(cwdDist, "index.html"))) return cwdDist;
  const dirDist = path.join(__dirname, "..", "web-dist");
  if (fs.existsSync(dirDist)) return dirDist;
  return cwdDist;
}
async function startServer() {
  (async () => {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await runMigrations();
        console.log("[db] Migrations completed successfully");
        return;
      } catch (err) {
        console.error(`[db] Migration attempt ${attempt}/3 failed:`, err.message || err);
        if (attempt < 3) {
          console.log(`[db] Retrying migration in 10 seconds...`);
          await new Promise((r) => setTimeout(r, 1e4));
        } else {
          console.error("[db] All migration attempts failed. Use /api/run-migrations to retry manually.");
        }
      }
    }
  })();
  const app = express();
  const server = createServer(app);
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });
  app.use(express.json({ limit: "250mb" }));
  app.use(express.urlencoded({ limit: "250mb", extended: true }));
  registerOAuthRoutes(app);
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });
  app.get("/api", (_req, res) => {
    res.redirect("/api/app/");
  });
  app.get("/api/", (_req, res) => {
    res.redirect("/api/app/");
  });
  const webDistPath = getWebDistPath();
  console.log(`[api] Web dist path: ${webDistPath} (exists: ${fs.existsSync(webDistPath)})`);
  if (fs.existsSync(webDistPath)) {
    app.use("/api/_expo", express.static(path.join(webDistPath, "_expo")));
    app.use("/api/assets", express.static(path.join(webDistPath, "assets")));
    app.get("/api/favicon.ico", (_req, res) => {
      const faviconPath = path.join(webDistPath, "favicon.ico");
      if (fs.existsSync(faviconPath)) {
        res.sendFile(faviconPath);
      } else {
        res.status(404).end();
      }
    });
    app.use("/api/app", express.static(webDistPath));
    app.get("/api/app", (_req, res) => {
      res.sendFile(path.join(webDistPath, "index.html"));
    });
    app.get("/api/app/*", (req, res) => {
      const reqPath = req.path.replace("/api/app", "");
      const htmlFile = path.join(webDistPath, reqPath.endsWith(".html") ? reqPath : reqPath.replace(/\/$/, "") + ".html");
      if (fs.existsSync(htmlFile)) {
        res.sendFile(htmlFile);
      } else {
        res.sendFile(path.join(webDistPath, "index.html"));
      }
    });
  }
  app.get("/api/audio-proxy", async (req, res) => {
    const url = req.query.url;
    if (!url || !url.startsWith("https://")) {
      res.status(400).json({ error: "Invalid URL" });
      return;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        res.status(response.status).json({ error: "Upstream error" });
        return;
      }
      const contentType = response.headers.get("content-type") || "audio/mpeg";
      const contentLength = response.headers.get("content-length");
      res.setHeader("Content-Type", contentType);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Accept-Ranges", "bytes");
      if (contentLength) res.setHeader("Content-Length", contentLength);
      const buffer = await response.arrayBuffer();
      res.send(Buffer.from(buffer));
    } catch (err) {
      res.status(500).json({ error: "Proxy error" });
    }
  });
  const upload2 = multer2({ limits: { fileSize: 200 * 1024 * 1024 } });
  app.post("/api/upload-audio", upload2.single("file"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ success: false, error: "Keine Datei hochgeladen" });
        return;
      }
      const randomSuffix = Math.random().toString(36).slice(2, 8);
      const safeName = (file.originalname || "audio.mp3").replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileKey = `audio/${safeName}-${randomSuffix}`;
      const result = await storagePut(fileKey, file.buffer, file.mimetype || "audio/mpeg");
      res.json({ success: true, url: result.url, key: result.key });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ success: false, error: err.message || "Upload fehlgeschlagen" });
    }
  });
  app.get("/ref/:code", async (req, res) => {
    const code = (req.params.code || "").toUpperCase();
    try {
      const { createHash: createHash2 } = await import("crypto");
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
      const ipHash = createHash2("sha256").update(ip).digest("hex").slice(0, 16);
      const ua = req.headers["user-agent"] || "";
      const dbMod = await Promise.resolve().then(() => (init_db(), db_exports));
      const affiliate = await dbMod.getAffiliateByCode(code);
      if (affiliate) {
        await dbMod.recordAffiliateClick(code, ipHash, ua);
      }
    } catch (e) {
      console.error("[Affiliate] Click tracking error:", e);
    }
    res.redirect(`/?ref=${code}`);
  });
  app.get("/api/affiliate/validate/:code", async (req, res) => {
    const code = (req.params.code || "").toUpperCase();
    try {
      const dbMod = await Promise.resolve().then(() => (init_db(), db_exports));
      const affiliate = await dbMod.getAffiliateByCode(code);
      if (affiliate) {
        res.json({ valid: true, name: affiliate.name, code: affiliate.code });
      } else {
        res.json({ valid: false });
      }
    } catch (e) {
      res.json({ valid: false });
    }
  });
  app.get("/api/run-migrations", async (_req, res) => {
    try {
      console.log("[api] Manual migration triggered via /api/run-migrations");
      await runMigrations();
      res.json({ success: true, message: "Migrations completed successfully" });
    } catch (err) {
      console.error("[api] Manual migration failed:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.get("/api/test-email", async (_req, res) => {
    try {
      const smtpHost = process.env.SMTP_HOST;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS ? "***SET***" : "NOT SET";
      const smtpPort = process.env.SMTP_PORT || "587";
      const smtpFromName = process.env.SMTP_FROM_NAME || "Die Seelenplanerin";
      console.log(`[test-email] SMTP Config: host=${smtpHost}, user=${smtpUser}, pass=${smtpPass}, port=${smtpPort}`);
      if (!smtpHost || !smtpUser || !process.env.SMTP_PASS) {
        res.json({
          success: false,
          error: "SMTP nicht konfiguriert",
          config: { host: smtpHost || "NOT SET", user: smtpUser || "NOT SET", pass: smtpPass, port: smtpPort }
        });
        return;
      }
      const nodemailer2 = await import("nodemailer");
      const transporter = nodemailer2.default.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: parseInt(smtpPort) === 465,
        auth: { user: smtpUser, pass: process.env.SMTP_PASS }
      });
      await transporter.verify();
      console.log(`[test-email] SMTP-Verbindung erfolgreich!`);
      res.json({
        success: true,
        message: "SMTP-Verbindung erfolgreich",
        config: { host: smtpHost, user: smtpUser, pass: smtpPass, port: smtpPort, fromName: smtpFromName }
      });
    } catch (err) {
      console.error("[test-email] Fehler:", err);
      res.json({
        success: false,
        error: err.message,
        config: {
          host: process.env.SMTP_HOST || "NOT SET",
          user: process.env.SMTP_USER || "NOT SET",
          pass: process.env.SMTP_PASS ? "***SET***" : "NOT SET",
          port: process.env.SMTP_PORT || "587"
        }
      });
    }
  });
  app.get("/api/db-reset", async (_req, res) => {
    try {
      console.log("[api] DB connection reset triggered");
      const { resetDb: resetDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      resetDb2();
      const { getDb: getDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const db = await getDb2();
      if (db) {
        res.json({ success: true, message: "DB-Verbindung zur\xFCckgesetzt und neu verbunden" });
      } else {
        res.json({ success: false, message: "DB-Verbindung zur\xFCckgesetzt, aber Neuverbindung fehlgeschlagen" });
      }
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.get("/api/db-write-test", async (_req, res) => {
    try {
      console.log("[api] DB write test triggered");
      const { getDb: getDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const db = await getDb2();
      if (!db) {
        res.json({ success: false, error: "Keine DB-Verbindung" });
        return;
      }
      const timeout = new Promise(
        (_, reject) => setTimeout(() => reject(new Error("Write test timeout (10s)")), 1e4)
      );
      const writeTest = (async () => {
        const result = await db.execute(
          /*sql*/
          `SELECT 1 as test`
        );
        return result;
      })();
      await Promise.race([writeTest, timeout]);
      res.json({ success: true, message: "DB-Schreibtest erfolgreich" });
    } catch (err) {
      console.error("[api] DB write test failed:", err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.use("/api/seelenjournal", seelenjournal_routes_default);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  const publicPath = path.join(__dirname, "..", "..", "public");
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
  }
  if (fs.existsSync(webDistPath)) {
    app.use(express.static(webDistPath));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      const htmlFile = path.join(webDistPath, req.path.endsWith(".html") ? req.path : req.path.replace(/\/$/, "") + ".html");
      if (fs.existsSync(htmlFile)) {
        res.sendFile(htmlFile);
      } else {
        res.sendFile(path.join(webDistPath, "index.html"));
      }
    });
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });
}
startServer().catch(console.error);
