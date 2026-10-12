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
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users, meditations, communityUsers, affiliateCodes, affiliateClicks, affiliateSales, affiliatePayouts, pushTokens, pushMessages, seelenjournalClients, seelenjournalEntries, seelenjournalAttachments, seelenjournalMessages, communityQuestions, academyWaitlist, raunaechteWaitlist, raunaechteCode, webPushSubscriptions;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      id: int("id").autoincrement().primaryKey(),
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    meditations = mysqlTable("meditations", {
      id: int("id").autoincrement().primaryKey(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description"),
      emoji: varchar("emoji", { length: 10 }).default("\u{1F9D8}\u200D\u2640\uFE0F"),
      audioUrl: text("audioUrl").notNull(),
      isPremium: int("isPremium").default(1).notNull(),
      isActive: int("isActive").default(1).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    communityUsers = mysqlTable("community_users", {
      id: int("id").autoincrement().primaryKey(),
      email: varchar("email", { length: 320 }).notNull().unique(),
      password: varchar("password", { length: 255 }).notNull(),
      name: varchar("name", { length: 255 }).notNull(),
      mustChangePassword: int("mustChangePassword").default(0).notNull(),
      isActive: int("isActive").default(1).notNull(),
      emailConsent: int("emailConsent").default(0).notNull(),
      emailConsentDate: timestamp("emailConsentDate"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    affiliateCodes = mysqlTable("affiliate_codes", {
      id: int("id").autoincrement().primaryKey(),
      email: varchar("email", { length: 320 }).notNull().unique(),
      code: varchar("code", { length: 20 }).notNull().unique(),
      name: varchar("name", { length: 255 }).notNull(),
      isActive: int("isActive").default(1).notNull(),
      totalClicks: int("totalClicks").default(0).notNull(),
      totalSales: int("totalSales").default(0).notNull(),
      totalEarnings: int("totalEarnings").default(0).notNull(),
      totalPaid: int("totalPaid").default(0).notNull(),
      password: varchar("password", { length: 255 }),
      paypalEmail: varchar("paypalEmail", { length: 320 }),
      iban: varchar("iban", { length: 50 }),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    affiliateClicks = mysqlTable("affiliate_clicks", {
      id: int("id").autoincrement().primaryKey(),
      affiliateCode: varchar("affiliateCode", { length: 20 }).notNull(),
      ipHash: varchar("ipHash", { length: 64 }),
      userAgent: text("userAgent"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    affiliateSales = mysqlTable("affiliate_sales", {
      id: int("id").autoincrement().primaryKey(),
      affiliateCode: varchar("affiliateCode", { length: 20 }).notNull(),
      productName: varchar("productName", { length: 255 }).notNull(),
      saleAmount: int("saleAmount").notNull(),
      commissionRate: int("commissionRate").default(20).notNull(),
      commissionAmount: int("commissionAmount").notNull(),
      customerEmail: varchar("customerEmail", { length: 320 }),
      customerName: varchar("customerName", { length: 255 }),
      status: varchar("status", { length: 20 }).default("pending").notNull(),
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    affiliatePayouts = mysqlTable("affiliate_payouts", {
      id: int("id").autoincrement().primaryKey(),
      affiliateCode: varchar("affiliateCode", { length: 20 }).notNull(),
      amount: int("amount").notNull(),
      method: varchar("method", { length: 50 }).default("paypal").notNull(),
      reference: varchar("reference", { length: 255 }),
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    pushTokens = mysqlTable("push_tokens", {
      id: int("id").autoincrement().primaryKey(),
      token: varchar("token", { length: 255 }).notNull().unique(),
      platform: varchar("platform", { length: 20 }),
      communityEmail: varchar("communityEmail", { length: 320 }),
      isActive: int("isActive").default(1).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow()
    });
    pushMessages = mysqlTable("push_messages", {
      id: int("id").autoincrement().primaryKey(),
      title: varchar("title", { length: 255 }).notNull(),
      body: text("body").notNull(),
      data: text("data"),
      sentTo: int("sentTo").default(0).notNull(),
      sentSuccess: int("sentSuccess").default(0).notNull(),
      sentFailed: int("sentFailed").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    seelenjournalClients = mysqlTable("seelenjournal_clients", {
      id: int("id").autoincrement().primaryKey(),
      email: varchar("email", { length: 320 }).notNull().unique(),
      password: varchar("password", { length: 255 }).notNull(),
      name: varchar("name", { length: 255 }).notNull(),
      readingDate: timestamp("readingDate"),
      internalNote: text("internalNote"),
      isActive: int("isActive").default(1).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    seelenjournalEntries = mysqlTable("seelenjournal_entries", {
      id: int("id").autoincrement().primaryKey(),
      clientId: int("clientId").notNull(),
      title: varchar("title", { length: 500 }).notNull(),
      content: text("content"),
      category: varchar("category", { length: 100 }),
      date: timestamp("date").defaultNow().notNull(),
      isPublished: int("isPublished").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow()
    });
    seelenjournalAttachments = mysqlTable("seelenjournal_attachments", {
      id: int("id").autoincrement().primaryKey(),
      entryId: int("entryId").notNull(),
      filename: varchar("filename", { length: 500 }).notNull(),
      url: text("url").notNull(),
      type: varchar("type", { length: 20 }).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    seelenjournalMessages = mysqlTable("seelenjournal_messages", {
      id: int("id").autoincrement().primaryKey(),
      clientId: int("clientId").notNull(),
      content: text("content").notNull(),
      fromAdmin: int("fromAdmin").default(0).notNull(),
      isRead: int("isRead").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    communityQuestions = mysqlTable("community_questions", {
      id: int("id").autoincrement().primaryKey(),
      frage: text("frage").notNull(),
      von: varchar("von", { length: 255 }).notNull(),
      vonEmail: varchar("vonEmail", { length: 320 }),
      datum: timestamp("datum").defaultNow().notNull(),
      antwort: text("antwort"),
      antwortDatum: timestamp("antwortDatum")
    });
    academyWaitlist = mysqlTable("academy_waitlist", {
      id: int("id").autoincrement().primaryKey(),
      email: varchar("email", { length: 320 }).notNull().unique(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    raunaechteWaitlist = mysqlTable("raunaechte_waitlist", {
      id: int("id").autoincrement().primaryKey(),
      email: varchar("email", { length: 320 }).notNull().unique(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    raunaechteCode = mysqlTable("raunaechte_codes", {
      id: int("id").autoincrement().primaryKey(),
      code: varchar("code", { length: 16 }).notNull().unique(),
      deviceId: varchar("deviceId", { length: 255 }),
      year: int("year").notNull(),
      isActive: int("isActive").default(1).notNull(),
      activatedAt: timestamp("activatedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    webPushSubscriptions = mysqlTable("web_push_subscriptions", {
      id: int("id").autoincrement().primaryKey(),
      endpoint: varchar("endpoint", { length: 512 }).notNull().unique(),
      subscription: text("subscription").notNull(),
      isActive: int("isActive").default(1).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow()
    });
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  addAcademyWaitlist: () => addAcademyWaitlist,
  addRaunaechteWaitlist: () => addRaunaechteWaitlist,
  answerCommunityQuestion: () => answerCommunityQuestion,
  bindRaunaechteJournal: () => bindRaunaechteJournal,
  bindRaunaechteJournalByCode: () => bindRaunaechteJournalByCode,
  checkIfPushSentToday: () => checkIfPushSentToday,
  createCommunityQuestion: () => createCommunityQuestion,
  createCommunityUser: () => createCommunityUser,
  createMeditation: () => createMeditation,
  createPushMessage: () => createPushMessage,
  createRaunaechteCode: () => createRaunaechteCode,
  createRaunaechteCodesBatch: () => createRaunaechteCodesBatch,
  deactivatePushToken: () => deactivatePushToken,
  deactivateRaunaechteCode: () => deactivateRaunaechteCode,
  deactivateWebPushSubscription: () => deactivateWebPushSubscription,
  deleteCommunityQuestion: () => deleteCommunityQuestion,
  deleteCommunityUser: () => deleteCommunityUser,
  deleteMeditation: () => deleteMeditation,
  getAcademyWaitlist: () => getAcademyWaitlist,
  getActiveMeditations: () => getActiveMeditations,
  getActiveRaunaechteAccess: () => getActiveRaunaechteAccess,
  getActiveRaunaechteJournal: () => getActiveRaunaechteJournal,
  getAllActivePushTokens: () => getAllActivePushTokens,
  getAllCommunityQuestions: () => getAllCommunityQuestions,
  getAllCommunityUsers: () => getAllCommunityUsers,
  getAllMeditations: () => getAllMeditations,
  getAllRaunaechteCodesForYear: () => getAllRaunaechteCodesForYear,
  getAllWebPushSubscriptions: () => getAllWebPushSubscriptions,
  getCommunityUserByEmail: () => getCommunityUserByEmail,
  getCommunityUsersWithEmailConsent: () => getCommunityUsersWithEmailConsent,
  getDb: () => getDb,
  getPushMessageHistory: () => getPushMessageHistory,
  getPushRegistrationStats: () => getPushRegistrationStats,
  getPushTokenCount: () => getPushTokenCount,
  getRaunaechteCodeStats: () => getRaunaechteCodeStats,
  getRaunaechteWaitlist: () => getRaunaechteWaitlist,
  getSslConfig: () => getSslConfig,
  getUserByOpenId: () => getUserByOpenId,
  getWebPushSubscriptionCount: () => getWebPushSubscriptionCount,
  registerPushToken: () => registerPushToken,
  resetDb: () => resetDb,
  saveWebPushSubscription: () => saveWebPushSubscription,
  setCommunityEmailConsent: () => setCommunityEmailConsent,
  updateCommunityUser: () => updateCommunityUser,
  updateCommunityUserEmailConsent: () => updateCommunityUserEmailConsent,
  updateMeditation: () => updateMeditation,
  updatePushMessage: () => updatePushMessage,
  upsertUser: () => upsertUser,
  validateRaunaechteCode: () => validateRaunaechteCode
});
import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
function getPool() {
  if (_pool) return _pool;
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL nicht gesetzt");
  _pool = mysql.createPool({
    uri: dbUrl,
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 10,
    connectTimeout: 15e3,
    ssl: { rejectUnauthorized: true },
    enableKeepAlive: true,
    keepAliveInitialDelay: 1e4
  });
  _pool.on("error", (err) => {
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
  return _db;
}
async function getDb() {
  try {
    return getDbSync();
  } catch (e) {
    return null;
  }
}
function resetDb() {
  if (_pool) {
    try {
      _pool.end();
    } catch (e) {
    }
  }
  _db = null;
  _pool = null;
  console.log("[Database] Connection reset");
}
async function withRetry(fn, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const msg = err.message || "";
      const isConnectionError = msg.includes("ECONNRESET") || msg.includes("PROTOCOL_CONNECTION_LOST") || msg.includes("ETIMEDOUT") || msg.includes("Connection lost") || msg.includes("ECONNREFUSED") || msg.includes("Failed query") || msg.includes("Can't add new command") || msg.includes("DATABASE_URL");
      if (isConnectionError && attempt < retries) {
        console.log(`[Database] Connection error on attempt ${attempt}, resetting and retrying...`);
        resetDb();
        await new Promise((r) => setTimeout(r, 1e3));
        continue;
      }
      throw err;
    }
  }
  throw new Error("withRetry: should not reach here");
}
function getSslConfig(dbUrl) {
  return { rejectUnauthorized: true };
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  return withRetry(async () => {
    const db = getDbSync();
    try {
      const values = {
        openId: user.openId,
        email: user.email ?? null,
        name: user.name ?? null
      };
      await db.insert(users).values(values).onDuplicateKeyUpdate({
        set: {
          email: sql`VALUES(email)`,
          name: sql`VALUES(name)`
        }
      });
    } catch (error) {
      console.error("[Database] Failed to upsert user:", error);
    }
  });
}
async function getUserByOpenId(openId) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
    return result.length > 0 ? result[0] : void 0;
  });
}
async function getActiveMeditations() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(meditations).where(eq(meditations.isActive, 1)).orderBy(desc(meditations.createdAt));
  });
}
async function updateMeditation(id, data) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(meditations).set(data).where(eq(meditations.id, id));
  });
}
async function getAllMeditations() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(meditations).orderBy(desc(meditations.createdAt));
  });
}
async function createMeditation(data) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.insert(meditations).values(data);
    return Number(result[0].insertId);
  });
}
async function deleteMeditation(id) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.delete(meditations).where(eq(meditations.id, id));
  });
}
async function getAllCommunityUsers() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(communityUsers).orderBy(desc(communityUsers.createdAt));
  });
}
async function getCommunityUserByEmail(email) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.select().from(communityUsers).where(eq(communityUsers.email, email.toLowerCase())).limit(1);
    return result.length > 0 ? result[0] : void 0;
  });
}
async function createCommunityUser(data) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.insert(communityUsers).values({
      email: data.email.toLowerCase(),
      password: data.password,
      name: data.name,
      mustChangePassword: data.mustChangePassword || 0
    });
    return Number(result[0].insertId);
  });
}
async function updateCommunityUser(email, data) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(communityUsers).set(data).where(eq(communityUsers.email, email.toLowerCase()));
  });
}
async function deleteCommunityUser(email) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.delete(communityUsers).where(eq(communityUsers.email, email.toLowerCase()));
  });
}
async function updateCommunityUserEmailConsent(email, consent) {
  return setCommunityEmailConsent(email, consent ? 1 : 0);
}
async function setCommunityEmailConsent(email, consent) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(communityUsers).set({
      emailConsent: consent,
      emailConsentDate: consent === 1 ? (/* @__PURE__ */ new Date()).toISOString() : null
    }).where(eq(communityUsers.email, email.toLowerCase()));
  });
}
async function getCommunityUsersWithEmailConsent() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(communityUsers).where(eq(communityUsers.emailConsent, 1));
  });
}
async function registerPushToken(data) {
  return withRetry(async () => {
    const db = getDbSync();
    const communityEmail = data.communityEmail?.trim().toLowerCase() || null;
    const existing = await db.select().from(pushTokens).where(eq(pushTokens.token, data.token)).limit(1);
    if (existing.length > 0) {
      await db.update(pushTokens).set({
        isActive: 1,
        platform: data.platform || null,
        ...communityEmail ? { communityEmail } : {}
      }).where(eq(pushTokens.token, data.token));
    } else {
      await db.insert(pushTokens).values({
        token: data.token,
        platform: data.platform || null,
        communityEmail,
        isActive: 1
      });
    }
  });
}
async function getPushTokenCount() {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.select({ count: sql`COUNT(*)` }).from(pushTokens).where(eq(pushTokens.isActive, 1));
    return result[0]?.count || 0;
  });
}
async function getPushRegistrationStats() {
  return withRetry(async () => {
    const db = getDbSync();
    const [nativeRows, linkedDeviceRows, linkedMemberRows, webRows, communityRows] = await Promise.all([
      db.select({ count: sql`COUNT(*)` }).from(pushTokens).where(eq(pushTokens.isActive, 1)),
      db.select({ count: sql`COUNT(*)` }).from(pushTokens).where(and(
        eq(pushTokens.isActive, 1),
        sql`${pushTokens.communityEmail} IS NOT NULL AND ${pushTokens.communityEmail} <> ''`
      )),
      db.select({ count: sql`COUNT(DISTINCT ${pushTokens.communityEmail})` }).from(pushTokens).where(and(
        eq(pushTokens.isActive, 1),
        sql`${pushTokens.communityEmail} IS NOT NULL AND ${pushTokens.communityEmail} <> ''`
      )),
      db.select({ count: sql`COUNT(*)` }).from(webPushSubscriptions).where(eq(webPushSubscriptions.isActive, 1)),
      db.select({ count: sql`COUNT(*)` }).from(communityUsers).where(eq(communityUsers.isActive, 1))
    ]);
    const nativeDevices = Number(nativeRows[0]?.count || 0);
    const webSubscriptions = Number(webRows[0]?.count || 0);
    return {
      nativeDevices,
      webSubscriptions,
      totalSubscriptions: nativeDevices + webSubscriptions,
      linkedDevices: Number(linkedDeviceRows[0]?.count || 0),
      linkedMembers: Number(linkedMemberRows[0]?.count || 0),
      activeCommunityMembers: Number(communityRows[0]?.count || 0)
    };
  });
}
async function getAllActivePushTokens() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(pushTokens).where(eq(pushTokens.isActive, 1));
  });
}
async function createPushMessage(data) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.insert(pushMessages).values(data);
    return Number(result[0].insertId);
  });
}
async function deactivatePushToken(token) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(pushTokens).set({ isActive: 0 }).where(eq(pushTokens.token, token));
  });
}
async function updatePushMessage(id, data) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(pushMessages).set(data).where(eq(pushMessages.id, id));
  });
}
async function getPushMessageHistory() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(pushMessages).orderBy(desc(pushMessages.createdAt));
  });
}
async function checkIfPushSentToday(titleKeyword) {
  return withRetry(async () => {
    const db = getDbSync();
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const results = await db.select().from(pushMessages).where(and(
      sql`${pushMessages.title} LIKE ${"%" + titleKeyword + "%"}`,
      sql`${pushMessages.createdAt} >= ${today}`
    ));
    return results.length > 0;
  });
}
async function getAllCommunityQuestions() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(communityQuestions).orderBy(desc(communityQuestions.datum));
  });
}
async function createCommunityQuestion(data) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.insert(communityQuestions).values({
      frage: data.frage,
      von: data.von,
      vonEmail: data.vonEmail || null
    });
    return Number(result[0].insertId);
  });
}
async function answerCommunityQuestion(id, antwort) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(communityQuestions).set({
      antwort,
      antwortDatum: /* @__PURE__ */ new Date()
    }).where(eq(communityQuestions.id, id));
  });
}
async function deleteCommunityQuestion(id) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.delete(communityQuestions).where(eq(communityQuestions.id, id));
  });
}
async function addAcademyWaitlist(email) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.insert(academyWaitlist).values({ email: email.toLowerCase() });
  });
}
async function getAcademyWaitlist() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(academyWaitlist).orderBy(desc(academyWaitlist.createdAt));
  });
}
async function addRaunaechteWaitlist(email) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.insert(raunaechteWaitlist).values({ email: email.toLowerCase() });
  });
}
async function getRaunaechteWaitlist() {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(raunaechteWaitlist).orderBy(desc(raunaechteWaitlist.createdAt));
  });
}
async function createRaunaechteCode(code, year) {
  return withRetry(async () => {
    const db = getDbSync();
    const result = await db.insert(raunaechteCode).values({ code, year });
    return result[0].insertId;
  });
}
async function createRaunaechteCodesBatch(codes, year) {
  return withRetry(async () => {
    const db = getDbSync();
    const values = codes.map((code) => ({ code, year }));
    await db.insert(raunaechteCode).values(values);
    return codes.length;
  });
}
async function validateRaunaechteCode(code, deviceId) {
  return withRetry(async () => {
    const db = getDbSync();
    const results = await db.select().from(raunaechteCode).where(eq(raunaechteCode.code, code));
    if (results.length === 0) return { valid: false, error: "Code nicht gefunden" };
    const entry = results[0];
    if (!entry.isActive) return { valid: false, error: "Code ist deaktiviert" };
    if (entry.deviceId && entry.deviceId !== deviceId) {
      return { valid: false, error: "Code ist bereits auf einem anderen Ger\xE4t aktiviert" };
    }
    if (!entry.deviceId) {
      await db.update(raunaechteCode).set({ deviceId, activatedAt: /* @__PURE__ */ new Date() }).where(and(eq(raunaechteCode.id, entry.id), eq(raunaechteCode.isActive, 1), sql`${raunaechteCode.deviceId} IS NULL`));
    }
    const confirmed = await getActiveRaunaechteAccess(code, deviceId);
    return confirmed ? { valid: true, year: confirmed.year } : { valid: false, error: "Code ist bereits vergeben oder nicht mehr g\xFCltig." };
  });
}
async function getAllRaunaechteCodesForYear(year) {
  return withRetry(async () => {
    const db = getDbSync();
    return db.select().from(raunaechteCode).where(eq(raunaechteCode.year, year)).orderBy(desc(raunaechteCode.createdAt));
  });
}
async function deactivateRaunaechteCode(id) {
  return withRetry(async () => {
    const db = getDbSync();
    await db.update(raunaechteCode).set({ isActive: 0 }).where(eq(raunaechteCode.id, id));
  });
}
async function getRaunaechteCodeStats(year) {
  return withRetry(async () => {
    const db = getDbSync();
    const all = await db.select().from(raunaechteCode).where(eq(raunaechteCode.year, year));
    const total = all.length;
    const activated = all.filter((c) => c.deviceId !== null).length;
    const available = all.filter((c) => c.deviceId === null && c.isActive === 1).length;
    const deactivated = all.filter((c) => c.isActive === 0).length;
    return { total, activated, available, deactivated };
  });
}
async function getAllWebPushSubscriptions() {
  const conn = await getDb();
  return conn.select().from(webPushSubscriptions).where(eq(webPushSubscriptions.isActive, 1));
}
async function saveWebPushSubscription(endpoint, subscription) {
  const conn = await getDb();
  await conn.insert(webPushSubscriptions).values({ endpoint, subscription }).onDuplicateKeyUpdate({ set: { subscription, isActive: 1 } });
}
async function deactivateWebPushSubscription(id) {
  const conn = await getDb();
  await conn.update(webPushSubscriptions).set({ isActive: 0 }).where(eq(webPushSubscriptions.id, id));
}
async function getWebPushSubscriptionCount() {
  const conn = await getDb();
  const result = await conn.select({ count: sql`COUNT(*)` }).from(webPushSubscriptions).where(eq(webPushSubscriptions.isActive, 1));
  return result[0]?.count ?? 0;
}
async function ensureJournalAccessTable() {
  await getPool().query(`CREATE TABLE IF NOT EXISTS raunaechte_journal_access (
    codeId INT PRIMARY KEY, browserHash VARCHAR(64) NOT NULL, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
}
async function getActiveRaunaechteAccess(code, deviceId) {
  return withRetry(async () => {
    const [rows] = await getPool().execute("SELECT id, year FROM raunaechte_codes WHERE code = ? AND deviceId = ? AND isActive = 1", [code, deviceId]);
    return rows[0] ? { id: Number(rows[0].id), year: Number(rows[0].year) } : null;
  });
}
async function bindRaunaechteJournal(codeId, browserId) {
  const { createHash: createHash2 } = await import("node:crypto");
  const hash = createHash2("sha256").update(browserId).digest("hex");
  await ensureJournalAccessTable();
  await getPool().execute("INSERT IGNORE INTO raunaechte_journal_access (codeId,browserHash) SELECT id, ? FROM raunaechte_codes WHERE id = ? AND isActive = 1", [hash, codeId]);
  return getActiveRaunaechteJournal(codeId, browserId);
}
async function bindRaunaechteJournalByCode(code, browserId) {
  const [rows] = await getPool().execute("SELECT id FROM raunaechte_codes WHERE code = ? AND isActive = 1", [code]);
  if (!rows[0]) return null;
  return bindRaunaechteJournal(rows[0].id, browserId);
}
async function getActiveRaunaechteJournal(codeId, browserId) {
  const { createHash: createHash2 } = await import("node:crypto");
  const hash = createHash2("sha256").update(browserId).digest("hex");
  await ensureJournalAccessTable();
  const [rows] = await getPool().execute("SELECT c.id,c.year FROM raunaechte_codes c JOIN raunaechte_journal_access j ON j.codeId = c.id WHERE c.id = ? AND c.isActive = 1 AND j.browserHash = ?", [codeId, hash]);
  return rows[0] ? { id: Number(rows[0].id), year: Number(rows[0].year) } : null;
}
var _db, _pool;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_schema();
    init_schema();
    init_schema();
    _db = null;
    _pool = null;
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

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  storageGet: () => storageGet,
  storageGetUploadUrl: () => storageGetUploadUrl,
  storagePut: () => storagePut,
  storagePutFromUrl: () => storagePutFromUrl
});
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
async function buildDownloadUrl(baseUrl, relKey, apiKey) {
  const downloadApiUrl = new URL("v1/storage/downloadUrl", ensureTrailingSlash(baseUrl));
  downloadApiUrl.searchParams.set("path", normalizeKey(relKey));
  const response = await fetch(downloadApiUrl, {
    method: "GET",
    headers: buildAuthHeaders(apiKey)
  });
  return (await response.json()).url;
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
  const key2 = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key2);
  const formData = toFormData(data, contentType, key2.split("/").pop() ?? key2);
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
  return { key: key2, url };
}
async function storageGet(relKey) {
  const { baseUrl, apiKey } = getStorageConfig();
  const key2 = normalizeKey(relKey);
  return {
    key: key2,
    url: await buildDownloadUrl(baseUrl, key2, apiKey)
  };
}
async function storageGetUploadUrl(relKey, contentType = "application/octet-stream") {
  const { baseUrl, apiKey } = getStorageConfig();
  const key2 = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key2);
  return {
    key: key2,
    uploadUrl: uploadUrl.toString(),
    headers: {
      ...buildAuthHeaders(apiKey)
    }
  };
}
async function storagePutFromUrl(relKey, sourceUrl, contentType = "application/octet-stream") {
  const response = await fetch(sourceUrl);
  if (!response.ok) throw new Error(`Failed to fetch source: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  return storagePut(relKey, buffer, contentType);
}
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_env();
  }
});

// server/web-push.ts
var web_push_exports = {};
__export(web_push_exports, {
  VAPID_PUBLIC_KEY: () => VAPID_PUBLIC_KEY,
  sendWebPush: () => sendWebPush,
  sendWebPushToAll: () => sendWebPushToAll
});
import webpush from "web-push";
async function sendWebPush(subscription, payload2) {
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys
      },
      JSON.stringify(payload2)
    );
    return true;
  } catch (error) {
    if (error.statusCode === 410 || error.statusCode === 404) {
      console.log("[WebPush] Subscription ung\xFCltig, wird entfernt:", subscription.endpoint.slice(0, 50));
      return false;
    }
    console.error("[WebPush] Fehler beim Senden:", error.message);
    return false;
  }
}
async function sendWebPushToAll(payload2) {
  const subscriptions = await getAllWebPushSubscriptions();
  let sent = 0;
  let failed = 0;
  for (const sub of subscriptions) {
    try {
      const subscription = JSON.parse(sub.subscription);
      const success = await sendWebPush(subscription, payload2);
      if (success) {
        sent++;
      } else {
        failed++;
        await deactivateWebPushSubscription(sub.id);
      }
    } catch (e) {
      failed++;
    }
  }
  return { sent, failed };
}
var VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY;
var init_web_push = __esm({
  "server/web-push.ts"() {
    "use strict";
    init_db();
    VAPID_PUBLIC_KEY = "BE8kb2r3dwQ4qM0scx3L8JjuBc69D3iH88WKSAQxWz3NsMTUQSypeIl-xyZQW5B3_GWdy11ImHrUcMkPE0Tg6Mw";
    VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "rfzsuBI4eHdhDyMrKEPcp-xm-vif4w5D5QeGBP6Cx0Q";
    webpush.setVapidDetails(
      "mailto:hallo@seelenplanerin.de",
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    );
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
    const payload2 = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(EXCHANGE_TOKEN_PATH, payload2);
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
  async signSession(payload2, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload2.openId,
      appId: payload2.appId,
      name: payload2.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload: payload2 } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload2;
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
    const payload2 = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload2
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
function getQueryParam(req, key2) {
  const value = req.query[key2];
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
async function notifyOwner(payload2) {
  const { title, content } = validatePayload(payload2);
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
import { TRPCError as TRPCError3 } from "@trpc/server";

// server/rauhnaechte-admin-auth.ts
import { createHmac, scryptSync, timingSafeEqual, randomBytes } from "node:crypto";
function verifyAdminPassword(password) {
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
function issueRauhAdminToken() {
  const body = Buffer.from(JSON.stringify({ scope: "rauh-admin", exp: Date.now() + 8 * 60 * 6e4, nonce: randomBytes(24).toString("hex") })).toString("base64url");
  return body + "." + createHmac("sha256", key()).update(body).digest("base64url");
}
function verifyRauhAdminToken(token, now = Date.now()) {
  try {
    const [body, sig, extra] = token.split(".");
    if (!body || !sig || extra) return false;
    const expected = createHmac("sha256", key()).update(body).digest(), actual = Buffer.from(sig, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false;
    const payload2 = JSON.parse(Buffer.from(body, "base64url").toString());
    return payload2.scope === "rauh-admin" && typeof payload2.exp === "number" && payload2.exp > now;
  } catch {
    return false;
  }
}
var attempts = /* @__PURE__ */ new Map();
function registerRauhAdminAuth(app) {
  app.post("/api/rauhnaechte/admin/login", (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    const now = Date.now(), ip = req.ip || "unknown";
    for (const [k, v] of attempts) if (v.expires <= now) attempts.delete(k);
    const entry = attempts.get(ip) || { count: 0, expires: now + 15 * 6e4 };
    if (entry.count >= 10) {
      res.status(429).json({ error: "Zu viele Anmeldeversuche. Bitte warte 15 Minuten." });
      return;
    }
    entry.count++;
    attempts.set(ip, entry);
    if (!process.env.RAUHNAECHTE_ADMIN_PASSWORD) {
      res.status(503).json({ error: "Dein sicheres Adminpasswort muss zuerst eingerichtet werden." });
      return;
    }
    if (!verifyAdminPassword(req.body?.password)) {
      res.status(401).json({ error: "Admin-Anmeldung fehlgeschlagen. Bitte pr\xFCfe dein Passwort." });
      return;
    }
    attempts.delete(ip);
    res.json({ token: issueRauhAdminToken(), expiresIn: 8 * 60 * 60 });
  });
}

// server/email.ts
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
async function sendAcademyWaitlistEmail(params) {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();
    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">
        Du bist auf der Warteliste! \u{1F393}
      </h2>
      <p style="margin:0 0 16px;color:#5C3317;line-height:1.7;">
        Vielen Dank f\xFCr dein Interesse an der <strong>Seelen Academy</strong>!
        Du wirst benachrichtigt, sobald die Anmeldung startet.
      </p>
      <p style="margin:0;color:#A08070;font-size:13px;">
        Alles Liebe, Die Seelenplanerin \u2728
      </p>
    `;
    await transporter.sendMail({
      from: `"Die Seelenplanerin" <${config.user}>`,
      to: params.toEmail,
      subject: "\u{1F393} Du bist auf der Warteliste \u2013 Seelen Academy",
      html: emailTemplate(content)
    });
    return { success: true };
  } catch (err) {
    console.error("[Email] Academy-Warteliste Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}
async function sendAcademyNotificationToOwner(params) {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();
    const ownerEmail = "laramwille@gmail.com";
    const now = (/* @__PURE__ */ new Date()).toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">
        Neue Anmeldung f\xFCr die Seelen Academy! \u{1F393}
      </h2>
      <p style="margin:0 0 16px;color:#5C3317;line-height:1.7;">
        Jemand hat sich auf die <strong>Warteliste der Seelen Academy</strong> eingetragen:
      </p>
      <table style="margin:0 0 16px;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 16px;background:#F5EDE8;color:#5C3317;font-weight:bold;border-radius:8px 0 0 0;">E-Mail</td>
          <td style="padding:8px 16px;background:#FDF8F4;color:#5C3317;border-radius:0 8px 0 0;">${params.subscriberEmail}</td>
        </tr>
        <tr>
          <td style="padding:8px 16px;background:#F5EDE8;color:#5C3317;font-weight:bold;border-radius:0 0 0 8px;">Datum</td>
          <td style="padding:8px 16px;background:#FDF8F4;color:#5C3317;border-radius:0 0 8px 0;">${now}</td>
        </tr>
      </table>
      <p style="margin:0;color:#A08070;font-size:13px;">
        Diese Nachricht wurde automatisch von deiner Seelenplanerin App gesendet.
      </p>
    `;
    await transporter.sendMail({
      from: `"Die Seelenplanerin App" <${config.user}>`,
      to: ownerEmail,
      subject: `\u{1F393} Neue Academy-Anmeldung: ${params.subscriberEmail}`,
      html: emailTemplate(content)
    });
    console.log(`[Email] Academy-Benachrichtigung an ${ownerEmail} gesendet f\xFCr ${params.subscriberEmail}`);
    return { success: true };
  } catch (err) {
    console.error("[Email] Academy-Benachrichtigung Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}
async function verifySmtpConnection() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message || "SMTP-Verbindung fehlgeschlagen" };
  }
}

// server/routers.ts
init_storage();
init_db();
var rauhAdminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const token = ctx.req.headers.authorization?.replace(/^Bearer /, "") || "";
  if (ctx.user?.role !== "admin" && !verifyRauhAdminToken(token)) {
    throw new TRPCError3({ code: "UNAUTHORIZED", message: "Serverseitige Admin-Anmeldung erforderlich." });
  }
  return next();
});
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
      try {
        await sendWelcomeEmail({
          toEmail: input.email,
          toName: input.name,
          tempPassword: input.password
        });
      } catch (emailErr) {
        console.error("[Community] Willkommens-E-Mail konnte nicht gesendet werden:", emailErr);
      }
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
    // Getrennte Statistik für Admin: native Geräte, Web-Abos und Mitgliederzuordnung
    stats: publicProcedure.query(async () => {
      return getPushRegistrationStats();
    }),
    // Push-Nachricht an alle senden (Admin)
    sendToAll: publicProcedure.input(z2.object({
      title: z2.string().min(1),
      body: z2.string().min(1),
      data: z2.string().optional()
      // JSON-String
    })).mutation(async ({ input }) => {
      const tokens = await getAllActivePushTokens();
      let webPushSent = 0;
      let webPushFailed = 0;
      try {
        const { sendWebPushToAll: sendWebPushToAll2 } = await Promise.resolve().then(() => (init_web_push(), web_push_exports));
        const webResult = await sendWebPushToAll2({
          title: input.title,
          body: input.body,
          data: input.data ? JSON.parse(input.data) : { url: "/" }
        });
        webPushSent = webResult.sent;
        webPushFailed = webResult.failed;
      } catch (e) {
        console.error("[Push] Web-Push Fehler:", e);
      }
      if (tokens.length === 0 && webPushSent === 0) {
        return { success: false, sent: 0, failed: 0, error: "Keine registrierten Ger\xE4te vorhanden." };
      }
      if (tokens.length === 0) {
        return { success: true, sent: webPushSent, failed: webPushFailed, total: webPushSent + webPushFailed };
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
      await updatePushMessage(messageId, { sentSuccess: sentSuccess + webPushSent, sentFailed: sentFailed + webPushFailed });
      return { success: true, sent: sentSuccess + webPushSent, failed: sentFailed + webPushFailed, total: tokens.length + webPushSent + webPushFailed };
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
          await sendAcademyWaitlistEmail({ toEmail: email });
        } catch (e) {
          console.error("Academy email failed:", e);
        }
        try {
          await sendAcademyNotificationToOwner({ subscriberEmail: email });
        } catch (e) {
          console.error("Academy owner notification failed:", e);
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
  communityQA: router({
    // Alle Fragen laden
    list: publicProcedure.query(async () => {
      return getAllCommunityQuestions();
    }),
    // Neue Frage stellen (sendet Push an Admin)
    ask: publicProcedure.input(z2.object({
      frage: z2.string().min(1),
      von: z2.string().min(1),
      vonEmail: z2.string().optional()
    })).mutation(async ({ input }) => {
      const id = await createCommunityQuestion(input);
      try {
        const tokens = await getAllActivePushTokens();
        if (tokens.length > 0) {
          const adminMessage = {
            to: tokens.map((t2) => t2.token),
            sound: "default",
            title: "\u{1F319} Neue Frage in der Community",
            body: `${input.von}: ${input.frage.substring(0, 80)}${input.frage.length > 80 ? "..." : ""}`,
            data: { type: "community_question", questionId: id }
          };
          await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify([adminMessage])
          });
        }
      } catch (e) {
        console.error("[Push] Fehler beim Senden der Community-Frage-Benachrichtigung:", e);
      }
      return { success: true, id };
    }),
    // Frage beantworten (Admin)
    answer: publicProcedure.input(z2.object({
      id: z2.number(),
      antwort: z2.string().min(1)
    })).mutation(async ({ input }) => {
      await answerCommunityQuestion(input.id, input.antwort);
      return { success: true };
    }),
    // Frage löschen (Admin)
    delete: publicProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      await deleteCommunityQuestion(input.id);
      return { success: true };
    })
  }),
  // ── Raunächte ──
  raunaechte: router({
    // Code validieren (App → Server)
    validateCode: publicProcedure.input(z2.object({ code: z2.string().min(1), deviceId: z2.string().min(1) })).mutation(async ({ input }) => {
      return validateRaunaechteCode(input.code.toUpperCase().trim(), input.deviceId);
    }),
    // Codes generieren (Admin)
    generateCodes: rauhAdminProcedure.input(z2.object({ count: z2.number().min(1).max(100), year: z2.number() })).mutation(async ({ input }) => {
      const codes = [];
      for (let i = 0; i < input.count; i++) {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let code = "RN-";
        for (let j = 0; j < 4; j++) code += chars[Math.floor(Math.random() * chars.length)];
        code += "-";
        for (let j = 0; j < 4; j++) code += chars[Math.floor(Math.random() * chars.length)];
        codes.push(code);
      }
      await createRaunaechteCodesBatch(codes, input.year);
      return { success: true, codes, count: codes.length };
    }),
    // Alle Codes für ein Jahr (Admin)
    listCodes: rauhAdminProcedure.input(z2.object({ year: z2.number() })).query(async ({ input }) => {
      const codes = await getAllRaunaechteCodesForYear(input.year);
      return codes.map((code) => ({ id: code.id, code: code.code, year: code.year, isActive: code.isActive, activatedAt: code.activatedAt, createdAt: code.createdAt }));
    }),
    // Code deaktivieren (Admin)
    deactivateCode: rauhAdminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      await deactivateRaunaechteCode(input.id);
      return { success: true };
    }),
    // Statistiken (Admin)
    stats: rauhAdminProcedure.input(z2.object({ year: z2.number() })).query(async ({ input }) => {
      return getRaunaechteCodeStats(input.year);
    })
  }),
  // ── Rauhnächte Warteliste ──
  raunaechteWaitlist: router({
    list: rauhAdminProcedure.query(async () => {
      return getRaunaechteWaitlist();
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
init_storage();
import multer2 from "multer";

// server/db-migrate.ts
import mysql2 from "mysql2/promise";
var MAX_RETRIES = 5;
var RETRY_DELAY_MS = 3e3;
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function connectWithRetry(dbUrl, attempt = 1) {
  try {
    const conn = await mysql2.createConnection({
      uri: dbUrl,
      ssl: { rejectUnauthorized: true },
      connectTimeout: 3e4
    });
    await conn.query("SELECT 1");
    console.log(`[db-migrate] Connected to MySQL database (attempt ${attempt})`);
    return conn;
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
  console.log("[db-migrate] Starting MySQL migrations with retry logic...");
  const conn = await connectWithRetry(dbUrl);
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        openId VARCHAR(64) NOT NULL UNIQUE,
        name TEXT,
        email VARCHAR(320),
        loginMethod VARCHAR(64),
        role ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS meditations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        emoji VARCHAR(10) DEFAULT '\u{1F9D8}',
        audioUrl TEXT NOT NULL,
        isPremium INT DEFAULT 1 NOT NULL,
        isActive INT DEFAULT 1 NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS community_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(320) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        mustChangePassword INT DEFAULT 0 NOT NULL,
        isActive INT DEFAULT 1 NOT NULL,
        emailConsent INT DEFAULT 0 NOT NULL,
        emailConsentDate TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS affiliate_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(320) NOT NULL UNIQUE,
        code VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        isActive INT DEFAULT 1 NOT NULL,
        totalClicks INT DEFAULT 0 NOT NULL,
        totalSales INT DEFAULT 0 NOT NULL,
        totalEarnings INT DEFAULT 0 NOT NULL,
        totalPaid INT DEFAULT 0 NOT NULL,
        password VARCHAR(255),
        paypalEmail VARCHAR(320),
        iban VARCHAR(50),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS affiliate_clicks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        affiliateCode VARCHAR(20) NOT NULL,
        ipHash VARCHAR(64),
        userAgent TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS affiliate_sales (
        id INT AUTO_INCREMENT PRIMARY KEY,
        affiliateCode VARCHAR(20) NOT NULL,
        productName VARCHAR(255) NOT NULL,
        saleAmount INT NOT NULL,
        commissionRate INT DEFAULT 20 NOT NULL,
        commissionAmount INT NOT NULL,
        customerEmail VARCHAR(320),
        customerName VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending' NOT NULL,
        notes TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS affiliate_payouts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        affiliateCode VARCHAR(20) NOT NULL,
        amount INT NOT NULL,
        method VARCHAR(50) DEFAULT 'paypal' NOT NULL,
        reference VARCHAR(255),
        notes TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS academy_waitlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS push_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        token VARCHAR(255) NOT NULL UNIQUE,
        platform VARCHAR(20),
        communityEmail VARCHAR(320),
        isActive INT DEFAULT 1 NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS push_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        data TEXT,
        sentTo INT DEFAULT 0 NOT NULL,
        sentSuccess INT DEFAULT 0 NOT NULL,
        sentFailed INT DEFAULT 0 NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS seelenjournal_clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(320) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        readingDate TIMESTAMP NULL,
        internalNote TEXT,
        isActive INT DEFAULT 1 NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS seelenjournal_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clientId INT NOT NULL,
        title VARCHAR(500) NOT NULL,
        content TEXT,
        category VARCHAR(100),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        isPublished INT DEFAULT 0 NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS seelenjournal_attachments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        entryId INT NOT NULL,
        filename VARCHAR(500) NOT NULL,
        url TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS raunaechte_waitlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(320) NOT NULL UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS raunaechte_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(20) NOT NULL UNIQUE,
        year INT NOT NULL,
        isActive INT DEFAULT 1 NOT NULL,
        activatedAt TIMESTAMP NULL,
        deviceId VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS seelenjournal_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clientId INT NOT NULL,
        content TEXT NOT NULL,
        fromAdmin INT DEFAULT 0 NOT NULL,
        isRead INT DEFAULT 0 NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("[db-migrate] All MySQL tables created/verified successfully");
  } catch (err) {
    console.error("[db-migrate] Migration error:", err.message || err);
    throw err;
  } finally {
    await conn.end();
  }
}

// server/seelenjournal-routes.ts
init_storage();
import { Router } from "express";
import { createHash } from "crypto";
import multer from "multer";

// server/seelenjournal-db.ts
init_schema();
import { eq as eq2, desc as desc2, and as and2, sql as sql2 } from "drizzle-orm";
import { drizzle as drizzle2 } from "drizzle-orm/mysql2";
import mysql3 from "mysql2/promise";
var _pool2 = null;
var _db2 = null;
var _lastError = null;
function getPool2() {
  if (_pool2) return _pool2;
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL nicht gesetzt");
  _pool2 = mysql3.createPool({
    uri: dbUrl,
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 10,
    connectTimeout: 15e3,
    ssl: { rejectUnauthorized: true },
    enableKeepAlive: true,
    keepAliveInitialDelay: 1e4
  });
  _pool2.on("error", (err) => {
    const errMsg = String(err?.message || err);
    console.error("[SJ-DB] Pool error:", errMsg);
    _lastError = errMsg;
    if (errMsg.includes("ECONNRESET") || errMsg.includes("PROTOCOL_CONNECTION_LOST") || errMsg.includes("ETIMEDOUT")) {
      console.log("[SJ-DB] Resetting pool due to connection error...");
      _pool2 = null;
      _db2 = null;
    }
  });
  return _pool2;
}
function getDb2() {
  if (!_db2) {
    _db2 = drizzle2(getPool2());
  }
  return _db2;
}
function resetPool() {
  if (_pool2) {
    try {
      _pool2.end();
    } catch (e) {
    }
  }
  _pool2 = null;
  _db2 = null;
  console.log("[SJ-DB] Pool reset");
}
async function withRetry2(fn, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const msg = err.message || "";
      const isConnectionError = msg.includes("ECONNRESET") || msg.includes("PROTOCOL_CONNECTION_LOST") || msg.includes("ETIMEDOUT") || msg.includes("Connection lost") || msg.includes("ECONNREFUSED") || msg.includes("Failed query") || msg.includes("Can't add new command");
      if (isConnectionError && attempt < retries) {
        console.log(`[SJ-DB] Connection error on attempt ${attempt}, resetting and retrying...`);
        resetPool();
        await new Promise((r) => setTimeout(r, 1e3));
        continue;
      }
      throw err;
    }
  }
  throw new Error("withRetry: should not reach here");
}
async function getAllJournalClients() {
  return withRetry2(async () => {
    const db = getDb2();
    return db.select().from(seelenjournalClients).orderBy(desc2(seelenjournalClients.createdAt));
  });
}
async function getJournalClientByEmail(email) {
  return withRetry2(async () => {
    const db = getDb2();
    const result = await db.select().from(seelenjournalClients).where(eq2(seelenjournalClients.email, email.toLowerCase())).limit(1);
    return result.length > 0 ? result[0] : void 0;
  });
}
async function getJournalClientById(id) {
  return withRetry2(async () => {
    const db = getDb2();
    const result = await db.select().from(seelenjournalClients).where(eq2(seelenjournalClients.id, id)).limit(1);
    return result.length > 0 ? result[0] : void 0;
  });
}
async function createJournalClient(data) {
  return withRetry2(async () => {
    console.log(`[SJ-DB] createJournalClient: ${data.email}`);
    const db = getDb2();
    const result = await db.insert(seelenjournalClients).values({
      email: data.email.toLowerCase(),
      password: data.password,
      name: data.name,
      readingDate: data.readingDate || null,
      internalNote: data.internalNote || null
    });
    const id = Number(result[0].insertId);
    console.log(`[SJ-DB] createJournalClient success: id=${id}`);
    return id;
  });
}
async function updateJournalClient(id, data) {
  return withRetry2(async () => {
    const db = getDb2();
    await db.update(seelenjournalClients).set(data).where(eq2(seelenjournalClients.id, id));
  });
}
async function deleteJournalClient(id) {
  return withRetry2(async () => {
    const db = getDb2();
    const entries = await db.select({ id: seelenjournalEntries.id }).from(seelenjournalEntries).where(eq2(seelenjournalEntries.clientId, id));
    for (const entry of entries) {
      await db.delete(seelenjournalAttachments).where(eq2(seelenjournalAttachments.entryId, entry.id));
    }
    await db.delete(seelenjournalEntries).where(eq2(seelenjournalEntries.clientId, id));
    await db.delete(seelenjournalMessages).where(eq2(seelenjournalMessages.clientId, id));
    await db.delete(seelenjournalClients).where(eq2(seelenjournalClients.id, id));
  });
}
async function getClientEntries(clientId, publishedOnly = false) {
  return withRetry2(async () => {
    const db = getDb2();
    if (publishedOnly) {
      return db.select().from(seelenjournalEntries).where(and2(eq2(seelenjournalEntries.clientId, clientId), eq2(seelenjournalEntries.isPublished, 1))).orderBy(desc2(seelenjournalEntries.date));
    }
    return db.select().from(seelenjournalEntries).where(eq2(seelenjournalEntries.clientId, clientId)).orderBy(desc2(seelenjournalEntries.date));
  });
}
async function getEntryById(entryId) {
  return withRetry2(async () => {
    const db = getDb2();
    const result = await db.select().from(seelenjournalEntries).where(eq2(seelenjournalEntries.id, entryId)).limit(1);
    return result.length > 0 ? result[0] : void 0;
  });
}
async function createEntry(data) {
  return withRetry2(async () => {
    const db = getDb2();
    const result = await db.insert(seelenjournalEntries).values({
      clientId: data.clientId,
      title: data.title,
      content: data.content || null,
      category: data.category || null,
      date: data.date || /* @__PURE__ */ new Date(),
      isPublished: data.isPublished ?? 0
    });
    return Number(result[0].insertId);
  });
}
async function updateEntry(entryId, data) {
  return withRetry2(async () => {
    const db = getDb2();
    await db.update(seelenjournalEntries).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(seelenjournalEntries.id, entryId));
  });
}
async function deleteEntry(entryId) {
  return withRetry2(async () => {
    const db = getDb2();
    await db.delete(seelenjournalAttachments).where(eq2(seelenjournalAttachments.entryId, entryId));
    await db.delete(seelenjournalEntries).where(eq2(seelenjournalEntries.id, entryId));
  });
}
async function getEntryAttachments(entryId) {
  return withRetry2(async () => {
    const db = getDb2();
    return db.select().from(seelenjournalAttachments).where(eq2(seelenjournalAttachments.entryId, entryId)).orderBy(desc2(seelenjournalAttachments.createdAt));
  });
}
async function createAttachment(data) {
  return withRetry2(async () => {
    const db = getDb2();
    const result = await db.insert(seelenjournalAttachments).values(data);
    return Number(result[0].insertId);
  });
}
async function getAttachmentById(id) {
  return withRetry2(async () => {
    const db = getDb2();
    const rows = await db.select().from(seelenjournalAttachments).where(eq2(seelenjournalAttachments.id, id)).limit(1);
    return rows[0] || null;
  });
}
async function deleteAttachment(id) {
  return withRetry2(async () => {
    const db = getDb2();
    await db.delete(seelenjournalAttachments).where(eq2(seelenjournalAttachments.id, id));
  });
}
async function getClientMessages(clientId) {
  return withRetry2(async () => {
    const db = getDb2();
    return db.select().from(seelenjournalMessages).where(eq2(seelenjournalMessages.clientId, clientId)).orderBy(seelenjournalMessages.createdAt);
  });
}
async function createMessage(data) {
  return withRetry2(async () => {
    const db = getDb2();
    const result = await db.insert(seelenjournalMessages).values({
      clientId: data.clientId,
      content: data.content,
      fromAdmin: data.fromAdmin
    });
    return Number(result[0].insertId);
  });
}
async function markMessagesAsRead(clientId, fromAdmin) {
  return withRetry2(async () => {
    const db = getDb2();
    await db.update(seelenjournalMessages).set({ isRead: 1 }).where(and2(
      eq2(seelenjournalMessages.clientId, clientId),
      eq2(seelenjournalMessages.fromAdmin, fromAdmin),
      eq2(seelenjournalMessages.isRead, 0)
    ));
  });
}
async function getUnreadMessageCount(clientId, fromAdmin) {
  return withRetry2(async () => {
    const db = getDb2();
    const result = await db.select({ count: sql2`count(*)` }).from(seelenjournalMessages).where(and2(
      eq2(seelenjournalMessages.clientId, clientId),
      eq2(seelenjournalMessages.fromAdmin, fromAdmin),
      eq2(seelenjournalMessages.isRead, 0)
    ));
    return Number(result[0]?.count || 0);
  });
}
async function getClientsWithUnreadMessages() {
  return withRetry2(async () => {
    const db = getDb2();
    const result = await db.select({
      clientId: seelenjournalMessages.clientId,
      count: sql2`count(*)`
    }).from(seelenjournalMessages).where(and2(
      eq2(seelenjournalMessages.fromAdmin, 0),
      eq2(seelenjournalMessages.isRead, 0)
    )).groupBy(seelenjournalMessages.clientId);
    return result;
  });
}

// server/seelenjournal-routes.ts
init_db();
async function uploadFile(fileKey, buffer, mimetype) {
  try {
    const { url } = await storagePut(fileKey, buffer, mimetype);
    console.log(`[Seelenjournal] S3 Upload erfolgreich: ${fileKey} \u2192 ${url}`);
    return url;
  } catch (err) {
    console.error(`[Seelenjournal] S3 Upload Fehler:`, err.message);
    throw new Error(`Datei-Upload fehlgeschlagen: ${err.message}`);
  }
}
var router2 = Router();
var SJ_SECRET = process.env.SEELENJOURNAL_JWT_SECRET || "seelenjournal-default-secret-change-me";
var SJ_ADMIN_EMAIL = process.env.SEELENJOURNAL_ADMIN_EMAIL || "lara@die-seelenplanerin.de";
var SJ_ADMIN_PASSWORD = process.env.SEELENJOURNAL_ADMIN_PASSWORD || "SeelenAdmin2026!";
function createToken(payload2, expiresInHours = 720) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const now = Math.floor(Date.now() / 1e3);
  const body = Buffer.from(JSON.stringify({ ...payload2, iat: now, exp: now + expiresInHours * 3600 })).toString("base64url");
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
    const payload2 = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload2.exp && payload2.exp < Math.floor(Date.now() / 1e3)) return null;
    return payload2;
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
  const payload2 = verifyToken(auth.slice(7));
  if (!payload2 || payload2.role !== "client") {
    res.status(401).json({ error: "Ung\xFCltiges Token" });
    return;
  }
  req.sjClientId = payload2.clientId;
  next();
}
function authAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Nicht autorisiert" });
    return;
  }
  const payload2 = verifyToken(auth.slice(7));
  if (!payload2 || payload2.role !== "admin") {
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
    try {
      const client = await getJournalClientById(req.sjClientId);
      const clientName = client?.name || "Eine Klientin";
      const preview = content.trim().length > 80 ? content.trim().substring(0, 80) + "\u2026" : content.trim();
      const tokens = await getAllActivePushTokens();
      if (tokens.length > 0) {
        const pushMessages2 = tokens.map((t2) => ({
          to: t2.token,
          sound: "default",
          title: `\u{1F48C} Neue Nachricht von ${clientName}`,
          body: preview,
          data: { type: "seelenjournal_message", clientId: req.sjClientId }
        }));
        for (let i = 0; i < pushMessages2.length; i += 100) {
          const chunk = pushMessages2.slice(i, i + 100);
          fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Accept-encoding": "gzip, deflate",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(chunk)
          }).catch((e) => console.error("[Seelenjournal] Push-Fehler:", e));
        }
        console.log(`[Seelenjournal] Push-Benachrichtigung gesendet: Neue Nachricht von ${clientName} an ${tokens.length} Ger\xE4te`);
      }
    } catch (pushErr) {
      console.error("[Seelenjournal] Push-Benachrichtigung Fehler:", pushErr);
    }
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
    if (!title?.trim()) {
      res.status(400).json({ error: "Titel erforderlich" });
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

// server/daily-push.ts
init_db();

// server/portaltage.ts
init_db();
var PORTALTAGE_2026 = /* @__PURE__ */ new Set([
  // Januar
  "2026-01-17",
  "2026-01-21",
  "2026-01-28",
  "2026-01-29",
  // Februar
  "2026-02-05",
  "2026-02-11",
  "2026-02-16",
  "2026-02-19",
  "2026-02-24",
  // März
  "2026-03-04",
  "2026-03-07",
  "2026-03-12",
  "2026-03-15",
  "2026-03-25",
  "2026-03-26",
  "2026-03-27",
  "2026-03-28",
  "2026-03-29",
  "2026-03-30",
  "2026-03-31",
  // April
  "2026-04-01",
  "2026-04-02",
  "2026-04-03",
  // Mai
  "2026-05-04",
  "2026-05-05",
  "2026-05-06",
  "2026-05-07",
  "2026-05-08",
  "2026-05-09",
  "2026-05-10",
  "2026-05-11",
  "2026-05-12",
  "2026-05-13",
  "2026-05-23",
  "2026-05-26",
  "2026-05-31",
  // Juni
  "2026-06-03",
  "2026-06-11",
  "2026-06-16",
  "2026-06-19",
  "2026-06-24",
  "2026-06-30",
  // Juli
  "2026-07-07",
  "2026-07-08",
  "2026-07-15",
  "2026-07-19",
  // August
  "2026-08-05",
  "2026-08-07",
  "2026-08-26",
  "2026-08-27",
  // September
  "2026-09-15",
  "2026-09-17",
  // Oktober
  "2026-10-04",
  "2026-10-08",
  "2026-10-15",
  "2026-10-16",
  "2026-10-23",
  "2026-10-29",
  // November
  "2026-11-03",
  "2026-11-06",
  "2026-11-11",
  "2026-11-19",
  "2026-11-22",
  "2026-11-27",
  "2026-11-30",
  // Dezember
  "2026-12-10",
  "2026-12-11",
  "2026-12-12",
  "2026-12-13",
  "2026-12-14",
  "2026-12-15",
  "2026-12-16",
  "2026-12-17",
  "2026-12-18",
  "2026-12-19"
]);
var PORTALTAG_TIPPS = [
  "Die Schleier sind heute d\xFCnn. Nimm dir einen Moment der Stille und h\xF6re nach innen.",
  "Perfekter Tag f\xFCr Journaling: Was zeigt sich gerade? Was darf gehen?",
  "Heute ist die Energie intensiv. Sei sanft mit dir und trinke viel Wasser.",
  "Nutze die hohe Schwingung f\xFCr eine kurze Meditation oder ein R\xE4ucherritual.",
  "Deine Intuition ist heute besonders stark. Vertraue deinen Eingebungen.",
  "Lass heute bewusst los, was dich belastet. Die Energie unterst\xFCtzt Transformation.",
  "Guter Tag f\xFCr bewusste Neuausrichtung. Was m\xF6chtest du in dein Leben einladen?",
  "Die kosmische Energie \xF6ffnet T\xFCren. Achte auf Zeichen und Synchronizit\xE4ten.",
  "Heute darfst du langsamer sein. Dein K\xF6rper verarbeitet die hohen Schwingungen.",
  "Ideal f\xFCr Innenschau: Welche alten Muster d\xFCrfen sich heute l\xF6sen?",
  "Verbinde dich mit der Natur. Ein Spaziergang kann heute Wunder wirken.",
  "Deine Tr\xE4ume k\xF6nnten heute besonders lebendig sein. Halte sie fest.",
  "Heute ist ein kraftvoller Tag f\xFCr Manifestation. Setze klare Intentionen.",
  "Die Energie l\xE4dt zur Selbstreflexion ein. Was brauchst du wirklich?",
  "Erlaube dir heute Ruhe. Nicht jeder Portaltag muss aktiv gestaltet werden.",
  "Dein Energiefeld ist heute besonders empf\xE4nglich. Sch\xFCtze deine Grenzen liebevoll.",
  "Nutze die Portalenergie f\xFCr ein kleines Ritual: Kerze anz\xFCnden, Intention setzen, loslassen.",
  "Heute flie\xDFt die Energie zwischen den Welten. Verbinde dich mit deiner Seele.",
  "Achte auf deine Gedanken \u2013 sie manifestieren heute schneller als sonst.",
  "G\xF6nne dir eine Auszeit vom Alltag. Dein Inneres sortiert sich neu.",
  "Die Schwingung ist hoch. Atme tief und lass die Energie durch dich flie\xDFen.",
  "Heute ist ein guter Tag, um alte Wunden zu heilen. Sei liebevoll mit dir.",
  "Verbringe Zeit in Stille. Die Antworten kommen von innen.",
  "Dein Herz \xF6ffnet sich heute leichter. Lass Liebe flie\xDFen \u2013 zu dir und anderen.",
  "Die Portalenergie unterst\xFCtzt Klarheit. Was ist dir wirklich wichtig?",
  "Heute darfst du dich von altem Ballast befreien. Leichtigkeit wartet auf dich.",
  "Verbinde dich mit deinem h\xF6heren Selbst. Es hat eine Botschaft f\xFCr dich.",
  "Die Energie ist transformativ. Vertraue dem Prozess, auch wenn er sich intensiv anf\xFChlt.",
  "Nimm dir heute bewusst Zeit f\xFCr dich. Du bist es wert.",
  "Die Tore sind offen. Empfange, was das Universum f\xFCr dich bereith\xE4lt."
];
function isPortaltag() {
  const now = /* @__PURE__ */ new Date();
  const berlinDate = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
  const year = berlinDate.getFullYear();
  const month = String(berlinDate.getMonth() + 1).padStart(2, "0");
  const day = String(berlinDate.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;
  return PORTALTAGE_2026.has(dateStr);
}
function getPortaltagTipp() {
  const now = /* @__PURE__ */ new Date();
  const berlinDate = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
  const dayOfYear = Math.floor((berlinDate.getTime() - new Date(berlinDate.getFullYear(), 0, 0).getTime()) / 864e5);
  return PORTALTAG_TIPPS[dayOfYear % PORTALTAG_TIPPS.length];
}
async function sendPortaltagPush() {
  if (!isPortaltag()) {
    return;
  }
  console.log("[portaltage] Heute ist ein Portaltag! Sende Push...");
  try {
    const tokens = await getAllActivePushTokens();
    if (!tokens || tokens.length === 0) {
      console.log("[portaltage] Keine Push-Tokens registriert.");
      return;
    }
    const tipp = getPortaltagTipp();
    const title = "\u{1F300} Heute ist ein Portaltag";
    const body = tipp;
    console.log(`[portaltage] Tipp: "${tipp.substring(0, 50)}..." \u2192 ${tokens.length} Ger\xE4te`);
    const { sendWebPushToAll: sendWebPushToAll2 } = await Promise.resolve().then(() => (init_web_push(), web_push_exports));
    sendWebPushToAll2({ title, body, data: { type: "portaltag" } }).then((r) => console.log(`[portaltage] Web-Push: ${r.sent} gesendet, ${r.failed} fehlgeschlagen`)).catch((e) => console.error("[portaltage] Web-Push Fehler:", e));
    const messageId = await createPushMessage({
      title,
      body,
      data: JSON.stringify({ type: "portaltag" })
    });
    const tokenStrings = tokens.map((t2) => t2.token);
    const chunks = [];
    for (let i = 0; i < tokenStrings.length; i += 100) {
      chunks.push(tokenStrings.slice(i, i + 100));
    }
    let sentSuccess = 0;
    let sentFailed = 0;
    for (const chunk of chunks) {
      try {
        const messages = chunk.map((token) => ({
          to: token,
          sound: "default",
          title,
          body,
          data: { type: "portaltag" }
        }));
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(messages)
        });
        if (response.ok) {
          const result = await response.json();
          const data = result.data || [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].status === "ok") {
              sentSuccess++;
            } else {
              sentFailed++;
              if (data[i].details?.error === "DeviceNotRegistered") {
                await deactivatePushToken(chunk[i]);
              }
            }
          }
        } else {
          sentFailed += chunk.length;
        }
      } catch (err) {
        sentFailed += chunk.length;
        console.error("[portaltage] Chunk-Fehler:", err);
      }
    }
    await updatePushMessage(messageId, { sentSuccess, sentFailed });
    console.log(`[portaltage] Fertig: ${sentSuccess} erfolgreich, ${sentFailed} fehlgeschlagen`);
  } catch (err) {
    console.error("[portaltage] Kritischer Fehler:", err);
  }
}

// server/daily-push.ts
init_web_push();

// server/moon-rituals.ts
init_db();
init_web_push();
var VOLLMOND_RITUALE_2026 = [
  {
    date: "2026-06-30",
    zodiac: "Steinbock",
    title: "Vollmond im Steinbock \u2651\u{1F315}",
    body: `Hey du \u{1F315}

Heute steht der Vollmond im Steinbock \u2013 das Zeichen der Disziplin, Struktur und inneren St\xE4rke.

Vergiss nicht: Lege deine Kristalle & Heilsteine heute Nacht ins Mondlicht, damit sie sich aufladen k\xF6nnen. \u2728

Du brauchst:
Kerze, Stift, Papier, einen Stein (symbolisch f\xFCr den Steinbock)

1. Ankommen
Kerze anz\xFCnden. Nimm den Stein in die Hand.
3x tief atmen. Sprich: \u201EIch bin stark. Ich bin best\xE4ndig. Ich vertraue meinem Weg."

2. Ernte betrachten
Schreib auf: \u201EWas habe ich durch meine Ausdauer erreicht?"
Mindestens 3 Dinge. Auch kleine Erfolge z\xE4hlen.

3. Loslassen was blockiert
Schreib auf: \u201EWelche Pflicht oder Last darf ich jetzt ablegen?"
Lies laut vor. Lege das Papier unter den Stein.
Sprich: \u201EIch muss nicht alles tragen. Ich darf leicht sein."

4. Neue Struktur
Schreib auf: \u201EWelche eine Gewohnheit st\xE4rkt mich im n\xE4chsten Zyklus?"
Falte das Papier. Lege es ans Fenster im Mondlicht.

Der Steinbock-Mond erinnert dich: Du bist st\xE4rker als du denkst. \u{1F3D4}\uFE0F\u{1F315}
Lara \u{1F90D}`
  },
  {
    date: "2026-07-29",
    zodiac: "Wassermann",
    title: "Vollmond im Wassermann \u2652\u{1F315}",
    body: `Hey du \u{1F315}

Heute steht der Vollmond im Wassermann \u2013 das Zeichen der Freiheit, Originalit\xE4t und Gemeinschaft.

Vergiss nicht: Lege deine Kristalle & Heilsteine heute Nacht ins Mondlicht, damit sie sich aufladen k\xF6nnen. \u2728

Du brauchst:
Kerze, Stift, Papier, ein Glas Wasser

1. Ankommen
Kerze anz\xFCnden. 3x tief atmen.
Sprich: \u201EIch erlaube mir, anders zu sein. Meine Einzigartigkeit ist mein Geschenk."

2. Freiheits-Check
Schreib auf: \u201EWo passe ich mich an, obwohl es sich falsch anf\xFChlt?"
Sei ehrlich. Wo verstellst du dich?

3. Befreiung
Schreib auf ein separates Blatt alles, was du losl\xE4sst.
Rei\xDFe es in kleine St\xFCcke. Lege sie in das Glas Wasser.
Sprich: \u201EIch l\xF6se mich von dem, was nicht zu mir geh\xF6rt."

4. Vision f\xFCr die Gemeinschaft
Schreib auf: \u201EWie m\xF6chte ich die Welt um mich herum bereichern?"
Eine Idee reicht. Der Wassermann-Mond st\xE4rkt deine Vision.

Sei wild. Sei frei. Sei du. \u{1F30A}\u{1F315}
Lara \u{1F90D}`
  },
  {
    date: "2026-08-28",
    zodiac: "Fische",
    title: "Mondfinsternis in den Fischen \u2653\u{1F315}",
    body: `Hey du \u{1F315}

Heute ist nicht nur Vollmond \u2013 es ist eine Mondfinsternis in den Fischen. Ein Portal f\xFCr tiefe Transformation.

Vergiss nicht: Lege deine Kristalle & Heilsteine heute Nacht ins Mondlicht, damit sie sich aufladen k\xF6nnen. \u2728

Du brauchst:
Kerze, Stift, Papier, \xE4therisches \xD6l (Lavendel oder Rose)

1. Ankommen
Kerze anz\xFCnden. Einen Tropfen \xD6l auf die Handgelenke.
Augen schlie\xDFen. 7 tiefe Atemz\xFCge.
Sprich: \u201EIch \xF6ffne mich f\xFCr das, was sich zeigen will."

2. Intuitions-Reise
Stell dir vor, du stehst am Ufer eines stillen Sees.
Der Mond spiegelt sich im Wasser. Du tauchst ein.
Was siehst du unter der Oberfl\xE4che? Schreib es auf.

3. Loslassen ins Wasser
Schreib auf: \u201EWas darf zur\xFCck ins Meer flie\xDFen?"
Alte Wunden, Illusionen, \xC4ngste.
Sprich: \u201EIch lasse los. Das Wasser tr\xE4gt es fort."

4. Segen empfangen
Lege beide H\xE4nde auf dein Herz.
Sprich: \u201EIch bin gehalten. Ich bin geliebt. Ich bin verbunden mit allem."

Die Fische-Finsternis heilt, was bereit ist zu heilen. \u{1F30A}\u{1F315}
Lara \u{1F90D}`
  },
  {
    date: "2026-09-26",
    zodiac: "Widder",
    title: "Vollmond im Widder \u2648\u{1F315}",
    body: `Hey du \u{1F315}

Heute steht der Vollmond im Widder \u2013 das Zeichen des Mutes, der Leidenschaft und des Neuanfangs.

Vergiss nicht: Lege deine Kristalle & Heilsteine heute Nacht ins Mondlicht, damit sie sich aufladen k\xF6nnen. \u2728

Du brauchst:
Kerze (rot wenn m\xF6glich), Stift, Papier

1. Ankommen
Kerze anz\xFCnden. Steh auf. Stampfe 3x mit dem Fu\xDF auf den Boden.
Sprich laut: \u201EIch bin hier. Ich bin lebendig. Ich bin mutig."

2. Mut-Frage
Schreib auf: \u201EWovor habe ich Angst \u2013 und was w\xFCrde ich tun, wenn ich keine h\xE4tte?"
Schreib mindestens 3 mutige Antworten.

3. Feuer-Ritual
W\xE4hle EINE mutige Sache, die du im n\xE4chsten Monat umsetzt.
Schreib sie gro\xDF auf. Halte das Papier ans Kerzenlicht (nicht verbrennen!).
Sprich: \u201EIch z\xFCnde mein inneres Feuer an. Ich handle JETZT."

4. Krafttier
Schlie\xDFe die Augen. Welches Tier erscheint vor dir?
Das ist dein Begleiter f\xFCr den n\xE4chsten Zyklus. Schreib es auf.

Der Widder-Mond gibt dir Feuer. Nutze es. \u{1F525}\u{1F315}
Lara \u{1F90D}`
  },
  {
    date: "2026-10-26",
    zodiac: "Stier",
    title: "Vollmond im Stier \u2649\u{1F315}",
    body: `Hey du \u{1F315}

Heute steht der Vollmond im Stier \u2013 das Zeichen der Sinnlichkeit, Erdung und des Genusses.

Vergiss nicht: Lege deine Kristalle & Heilsteine heute Nacht ins Mondlicht, damit sie sich aufladen k\xF6nnen. \u2728

Du brauchst:
Kerze, etwas Schokolade oder Obst, Bodylotion, Notizbuch

1. Ankommen
Kerze anz\xFCnden. Nimm die Schokolade/Obst.
Iss ganz langsam. Schmecke jeden Bissen bewusst.
Der Stier lehrt uns: Genuss ist heilig.

2. K\xF6rper-Dankbarkeit
Creme deine H\xE4nde und Arme ein. Langsam. Liebevoll.
Sprich: \u201EMein K\xF6rper ist mein Zuhause. Ich ehre ihn."

3. F\xFClle-Inventur
Schreib auf: \u201EWas besitze ich bereits, das mich gl\xFCcklich macht?"
Materiell und immateriell. Mindestens 5 Dinge.

4. Erdung
Stell dich barfu\xDF hin (auf den Boden oder Teppich).
Sprich: \u201EIch bin geerdet. Ich bin sicher. Ich habe genug."
Atme 5x tief in den Bauch.

Der Stier-Mond erinnert dich: Du darfst genie\xDFen. \u{1F33F}\u{1F315}
Lara \u{1F90D}`
  },
  {
    date: "2026-11-24",
    zodiac: "Zwillinge",
    title: "Vollmond in den Zwillingen \u264A\u{1F315}",
    body: `Hey du \u{1F315}

Heute steht der Vollmond in den Zwillingen \u2013 das Zeichen der Kommunikation, Neugier und Vielfalt.

Vergiss nicht: Lege deine Kristalle & Heilsteine heute Nacht ins Mondlicht, damit sie sich aufladen k\xF6nnen. \u2728

Du brauchst:
Kerze, Stift, zwei Bl\xE4tter Papier

1. Ankommen
Kerze anz\xFCnden. 3x tief atmen.
Sprich: \u201EIch h\xF6re zu \u2013 mir selbst und der Welt um mich."

2. Dialog mit dir selbst
Nimm zwei Bl\xE4tter. Auf das eine schreibst du als dein \u201EKopf" (Verstand).
Auf das andere als dein \u201EHerz" (Gef\xFChl).
Frage: \u201EWas brauche ich gerade wirklich?"
Lass beide Seiten antworten.

3. Aussprechen
Lies beide Antworten laut vor.
Wo stimmen sie \xFCberein? Wo widersprechen sie sich?
Sprich: \u201EIch ehre beide Stimmen in mir."

4. Botschaft senden
Schreib einer Person, an die du heute denkst, eine kurze Nachricht.
Nur 1-2 S\xE4tze. Von Herzen. Der Zwillinge-Mond st\xE4rkt Verbindung.

Worte haben Kraft. Nutze sie weise. \u{1F4AC}\u{1F315}
Lara \u{1F90D}`
  },
  {
    date: "2026-12-24",
    zodiac: "Krebs",
    title: "Vollmond im Krebs \u264B\u{1F315}",
    body: `Hey du \u{1F315}

Heute \u2013 an Heiligabend \u2013 steht der Vollmond im Krebs. Das Zeichen der Geborgenheit, Familie und tiefen Gef\xFChle.

Vergiss nicht: Lege deine Kristalle & Heilsteine heute Nacht ins Mondlicht, damit sie sich aufladen k\xF6nnen. \u2728

Du brauchst:
Kerze, Stift, Papier, eine Tasse Tee oder Kakao

1. Ankommen
Kerze anz\xFCnden. Tee/Kakao einschenken. H\xE4nde um die Tasse.
3x tief atmen. Sprich: \u201EIch bin geborgen. Ich bin geliebt."

2. Herz \xF6ffnen
Schreib auf: \u201EWem bin ich dieses Jahr dankbar?"
Mindestens 5 Menschen. Sp\xFCre die Liebe bei jedem Namen.

3. Loslassen
Schreib auf: \u201EWelchen Schmerz aus diesem Jahr darf ich jetzt loslassen?"
Falte das Papier. Lege es unter die Kerze.
Sprich: \u201EIch vergebe. Ich heile. Ich bin frei."

4. Wunsch f\xFCrs neue Jahr
Schreib auf: \u201EWas w\xFCnsche ich mir f\xFCr 2027?"
Einen Herzenswunsch. Lege ihn ans Fenster im Mondlicht.

Der Krebs-Mond h\xFCllt dich heute in Liebe. Frohe Weihnachten. \u{1F384}\u{1F315}
Lara \u{1F90D}`
  }
];
var NEUMOND_RITUALE_2026 = [
  {
    date: "2026-06-15",
    zodiac: "Zwillinge",
    title: "Neumond in den Zwillingen \u264A\u{1F311}",
    body: `Hey du \u{1F311}

Heute ist Neumond in den Zwillingen \u2013 Zeit f\xFCr neue Gedanken, Gespr\xE4che und Perspektiven.

Du brauchst:
Kerze, Stift, Notizbuch

1. Ankommen
Kerze anz\xFCnden. 3x tief atmen.
Sprich: \u201EIch \xF6ffne meinen Geist f\xFCr neue M\xF6glichkeiten."

2. Gedanken-Inventur
Schreib auf: \u201EWelcher Gedanke h\xE4lt mich gerade fest?"
Und dann: \u201EWie k\xF6nnte ich ihn anders denken?"
Der Zwillinge-Neumond schenkt dir eine neue Perspektive.

3. Intention setzen
Schreib auf: \u201EIn diesem Zyklus m\xF6chte ich lernen / entdecken / aussprechen..."
Etwas Neues. Etwas Mutiges.

4. Versiegeln
Sprich: \u201EMeine Worte erschaffen meine Realit\xE4t. Ich w\xE4hle sie bewusst."
Puste die Kerze aus.

Neue Gedanken, neues Leben. \u{1F4AB}\u{1F311}
Lara \u{1F90D}`
  },
  {
    date: "2026-07-14",
    zodiac: "Krebs",
    title: "Neumond im Krebs \u264B\u{1F311}",
    body: `Hey du \u{1F311}

Heute ist Neumond im Krebs \u2013 Zeit f\xFCr Geborgenheit, Selbstf\xFCrsorge und emotionale Heilung.

Du brauchst:
Kerze, Stift, Papier, eine Decke oder Kissen

1. Ankommen
Wickle dich in die Decke. Kerze anz\xFCnden.
3x tief atmen. Sprich: \u201EIch bin sicher. Ich darf f\xFChlen."

2. Emotionaler Check-in
Schreib auf: \u201EWie f\xFChle ich mich wirklich gerade?"
Nicht wie du dich f\xFChlen \u201Esolltest". Wie du dich WIRKLICH f\xFChlst.
Alles ist erlaubt.

3. Selbstf\xFCrsorge-Intention
Schreib auf: \u201EIn diesem Zyklus sorge ich f\xFCr mich, indem ich..."
3 konkrete Dinge. Klein und machbar.
z.B. \u201EIch gehe jeden Abend 10 Minuten spazieren."

4. Innere Umarmung
Lege beide Arme um dich selbst. Halte dich.
Sprich: \u201EIch bin f\xFCr mich da. Immer."

Der Krebs-Neumond n\xE4hrt deine Seele. \u{1FAC2}\u{1F311}
Lara \u{1F90D}`
  },
  {
    date: "2026-08-12",
    zodiac: "L\xF6we",
    title: "Sonnenfinsternis im L\xF6wen \u264C\u{1F311}",
    body: `Hey du \u{1F311}

Heute ist eine Sonnenfinsternis im L\xF6wen \u2013 ein kraftvolles Portal f\xFCr Selbstausdruck und Herz\xF6ffnung.

Du brauchst:
Kerze (gold oder gelb wenn m\xF6glich), Stift, Papier, Spiegel

1. Ankommen
Kerze anz\xFCnden. Setze dich vor den Spiegel.
Schau dir in die Augen. L\xE4chle dich an.
Sprich: \u201EIch sehe dich. Du bist wundersch\xF6n."

2. L\xF6wen-Kraft
Schreib auf: \u201EWas macht mich einzigartig? Was ist mein Licht?"
Mindestens 5 Dinge. Sei nicht bescheiden. Der L\xF6we strahlt.

3. Herzens-Intention
Schreib auf: \u201EIn diesem Zyklus zeige ich mich der Welt, indem ich..."
Etwas, das Mut erfordert. Etwas, das dein Herz zum Leuchten bringt.

4. Kr\xF6nung
Steh auf. Stell dir vor, du setzt dir eine goldene Krone auf.
Sprich: \u201EIch bin die K\xF6nigin meines Lebens. Ich strahle."

Die L\xF6wen-Finsternis entfacht dein inneres Feuer. \u{1F981}\u{1F311}
Lara \u{1F90D}`
  },
  {
    date: "2026-09-11",
    zodiac: "Jungfrau",
    title: "Neumond in der Jungfrau \u264D\u{1F311}",
    body: `Hey du \u{1F311}

Heute ist Neumond in der Jungfrau \u2013 Zeit f\xFCr Ordnung, Heilung und liebevolle Routinen.

Du brauchst:
Kerze, Stift, Notizbuch, R\xE4ucherwerk (optional)

1. Ankommen
Kerze anz\xFCnden. Optional r\xE4uchern.
3x tief atmen. Sprich: \u201EIch bringe Ordnung in mein Leben \u2013 mit Liebe."

2. Lebens-Inventur
Schreib auf: \u201EWas in meinem Leben braucht gerade Aufmerksamkeit?"
K\xF6rper, Wohnung, Beziehungen, Arbeit \u2013 wo ruft es?

3. Heilungs-Intention
Schreib auf: \u201EIn diesem Zyklus heile ich... indem ich..."
Eine konkrete Sache. Ein kleiner Schritt zur Besserung.
z.B. \u201EIch heile meine Ersch\xF6pfung, indem ich um 22 Uhr ins Bett gehe."

4. Dankbarkeit f\xFCr deinen K\xF6rper
Lege deine H\xE4nde auf deinen Bauch.
Sprich: \u201EDanke, K\xF6rper, f\xFCr alles was du t\xE4glich f\xFCr mich tust."

Die Jungfrau-Energie ordnet mit Liebe. \u{1F33F}\u{1F311}
Lara \u{1F90D}`
  },
  {
    date: "2026-10-10",
    zodiac: "Waage",
    title: "Neumond in der Waage \u264E\u{1F311}",
    body: `Hey du \u{1F311}

Heute ist Neumond in der Waage \u2013 Zeit f\xFCr Balance, Harmonie und liebevolle Beziehungen.

Du brauchst:
Kerze, Stift, Papier, eine Blume oder etwas Sch\xF6nes

1. Ankommen
Kerze anz\xFCnden. Lege die Blume vor dich.
3x tief atmen. Sprich: \u201EIch lade Harmonie in mein Leben ein."

2. Beziehungs-Check
Schreib auf: \u201EIn welcher Beziehung w\xFCnsche ich mir mehr Balance?"
Das kann eine Beziehung zu einem Menschen sein \u2013 oder zu dir selbst.

3. Harmonie-Intention
Schreib auf: \u201EIn diesem Zyklus bringe ich Balance, indem ich..."
z.B. \u201EIch sage \xF6fter was ich brauche." oder \u201EIch nehme mir Zeit f\xFCr Sch\xF6nheit."

4. Sch\xF6nheits-Ritual
Tu dir etwas Sch\xF6nes. Creme, Musik, ein Bad, Blumen kaufen.
Sprich: \u201EIch verdiene Sch\xF6nheit und Harmonie in meinem Leben."

Die Waage schenkt dir Gleichgewicht. \u2696\uFE0F\u{1F311}
Lara \u{1F90D}`
  },
  {
    date: "2026-11-09",
    zodiac: "Skorpion",
    title: "Neumond im Skorpion \u264F\u{1F311}",
    body: `Hey du \u{1F311}

Heute ist Neumond im Skorpion \u2013 die tiefste, transformativste Energie des Jahres.

Du brauchst:
Kerze (schwarz oder dunkelrot wenn m\xF6glich), Stift, Papier, feuerfeste Schale

1. Ankommen
Kerze anz\xFCnden. Augen schlie\xDFen. 5 tiefe Atemz\xFCge.
Sprich: \u201EIch bin bereit f\xFCr die Wahrheit. Ich bin bereit f\xFCr Transformation."

2. Schatten-Arbeit
Schreib auf: \u201EWas verberge ich vor mir selbst?"
Sei radikal ehrlich. Der Skorpion fordert Tiefe.
Niemand liest das au\xDFer du.

3. Transformation
Verbrenne das Papier in der Schale.
Sprich: \u201EAus der Asche entsteht Neues. Ich transformiere."

4. Phoenix-Intention
Neues Blatt. Schreib: \u201EIch erhebe mich als..."
Wer willst du nach dieser Transformation sein?
Falte es. Lege es unter dein Kopfkissen.

Der Skorpion-Neumond ist deine Wiedergeburt. \u{1F982}\u{1F311}
Lara \u{1F90D}`
  },
  {
    date: "2026-12-09",
    zodiac: "Sch\xFCtze",
    title: "Neumond im Sch\xFCtzen \u2650\u{1F311}",
    body: `Hey du \u{1F311}

Heute ist Neumond im Sch\xFCtzen \u2013 Zeit f\xFCr Abenteuer, Weisheit und gro\xDFe Visionen.

Du brauchst:
Kerze, Stift, Papier

1. Ankommen
Kerze anz\xFCnden. 3x tief atmen.
Sprich: \u201EIch \xF6ffne mich f\xFCr die Weite des Lebens."

2. Abenteuerlust
Schreib auf: \u201EWas w\xFCrde ich tun, wenn alles m\xF6glich w\xE4re?"
Reisen, lernen, wagen \u2013 der Sch\xFCtze kennt keine Grenzen.
Tr\xE4ume gro\xDF. Mindestens 5 Dinge.

3. Weisheits-Frage
Schreib auf: \u201EWas ist die wichtigste Lektion, die ich dieses Jahr gelernt habe?"
Und: \u201EWelche Weisheit nehme ich mit ins neue Jahr?"

4. Pfeil abschie\xDFen
Stell dir vor, du bist der Sch\xFCtze mit Pfeil und Bogen.
Dein Pfeil ist deine gr\xF6\xDFte Intention f\xFCr 2027.
Sprich: \u201EIch ziele hoch. Ich lasse los. Ich vertraue."
Puste die Kerze aus.

Der Sch\xFCtze-Neumond zeigt dir den Weg. \u{1F3F9}\u{1F311}
Lara \u{1F90D}`
  }
];
async function sendMoonRitualPush() {
  const now = /* @__PURE__ */ new Date();
  const berlinTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
  const todayStr = `${berlinTime.getFullYear()}-${String(berlinTime.getMonth() + 1).padStart(2, "0")}-${String(berlinTime.getDate()).padStart(2, "0")}`;
  const vollmondRitual = VOLLMOND_RITUALE_2026.find((r) => r.date === todayStr);
  const neumondRitual = NEUMOND_RITUALE_2026.find((r) => r.date === todayStr);
  const ritual = vollmondRitual || neumondRitual;
  if (!ritual) {
    return;
  }
  const type = vollmondRitual ? "vollmond" : "neumond";
  console.log(`[moon-ritual] Heute ist ${type === "vollmond" ? "Vollmond" : "Neumond"} im ${ritual.zodiac}! Sende Ritual...`);
  try {
    const keyword = vollmondRitual ? "Vollmond" : "Neumond";
    const alreadySent = await checkIfPushSentToday(keyword);
    if (alreadySent) {
      console.log(`[moon-ritual] ${keyword}-Ritual wurde heute bereits gesendet. \xDCberspringe.`);
      return;
    }
    const tokens = await getAllActivePushTokens();
    if (!tokens || tokens.length === 0) {
      console.log("[moon-ritual] Keine registrierten Push-Tokens gefunden. \xDCberspringe.");
      return;
    }
    const pushHint = type === "vollmond" ? `Heute ist Vollmond im ${ritual.zodiac} \u{1F315} \u2013 Dein Ritual wartet in der App auf dich. Schau unter Rituale nach!` : `Heute ist Neumond im ${ritual.zodiac} \u{1F311} \u2013 Dein Ritual wartet in der App auf dich. Schau unter Rituale nach!`;
    sendWebPushToAll({ title: ritual.title, body: pushHint, data: { type: `moon-${type}`, zodiac: ritual.zodiac } }).then((r) => console.log(`[moon-ritual] Web-Push: ${r.sent} gesendet, ${r.failed} fehlgeschlagen`)).catch((e) => console.error("[moon-ritual] Web-Push Fehler:", e));
    const messageId = await createPushMessage({
      title: ritual.title,
      body: ritual.body,
      data: JSON.stringify({ type: `moon-${type}`, zodiac: ritual.zodiac })
    });
    const tokenStrings = tokens.map((t2) => t2.token);
    const chunks = [];
    for (let i = 0; i < tokenStrings.length; i += 100) {
      chunks.push(tokenStrings.slice(i, i + 100));
    }
    let sentSuccess = 0;
    let sentFailed = 0;
    for (const chunk of chunks) {
      try {
        const messages = chunk.map((token) => ({
          to: token,
          sound: "default",
          title: ritual.title,
          body: pushHint,
          data: { type: `moon-${type}`, zodiac: ritual.zodiac }
        }));
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(messages)
        });
        if (response.ok) {
          const result = await response.json();
          const data = result.data || [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].status === "ok") {
              sentSuccess++;
            } else {
              sentFailed++;
              if (data[i].details?.error === "DeviceNotRegistered") {
                await deactivatePushToken(chunk[i]);
                console.log(`[moon-ritual] Token deaktiviert: ${chunk[i].substring(0, 20)}...`);
              }
            }
          }
        } else {
          sentFailed += chunk.length;
          console.error(`[moon-ritual] Expo Push API Fehler: ${response.status}`);
        }
      } catch (err) {
        sentFailed += chunk.length;
        console.error("[moon-ritual] Chunk-Fehler:", err);
      }
    }
    await updatePushMessage(messageId, { sentSuccess, sentFailed });
    console.log(`[moon-ritual] Fertig: ${sentSuccess} erfolgreich, ${sentFailed} fehlgeschlagen`);
  } catch (err) {
    console.error("[moon-ritual] Kritischer Fehler:", err);
  }
}

// lib/raunaechte-program.ts
var RAUHNAECHTE_PROGRAM = {
  title: "Rauhn\xE4chte mit Sperrn\xE4chten",
  startDay: 8,
  totalDays: 30,
  contentDays: 25,
  totalContents: 75,
  dateLabel: "8. Dezember bis 6. Januar",
  registrationUrl: "https://dieseelenplanerin.de/rauhnaechte",
  /** Eigenständiges Journal; speichert nur im Browser der Teilnehmerin. */
  journalUrl: "https://seelenplanerin.github.io/rauhnaechte-journal/"
};
var RAUHNAECHTE_CONTENT_CALENDAR_DAYS = [
  ...Array.from({ length: 12 }, (_, i) => i + 1),
  ...Array.from({ length: 13 }, (_, i) => i + 17)
];
function getContentDayNumber(calendarDay) {
  const index = RAUHNAECHTE_CONTENT_CALENDAR_DAYS.indexOf(calendarDay);
  return index < 0 ? null : index + 1;
}
function getProgramDate(year, day) {
  return new Date(year, 11, RAUHNAECHTE_PROGRAM.startDay + day - 1);
}
function getProgramDay(year, now = /* @__PURE__ */ new Date()) {
  const calendarDay = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const start = Date.UTC(year, 11, RAUHNAECHTE_PROGRAM.startDay);
  const end = Date.UTC(year + 1, 0, 7);
  if (calendarDay < start) return 0;
  if (calendarDay >= end) return RAUHNAECHTE_PROGRAM.totalDays + 1;
  return Math.floor((calendarDay - start) / 864e5) + 1;
}
function getProgramYear(now = /* @__PURE__ */ new Date()) {
  return now.getMonth() >= 9 ? now.getFullYear() : now.getFullYear() - 1;
}
function formatProgramISODate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// lib/raunaechte-data.ts
var PORTALTAGE_2026_DEC = [10, 11, 14, 23, 24, 25];
var PORTALTAGE_2027_JAN = [1, 2, 5, 6];
function isPortaltag2(date) {
  const d = /* @__PURE__ */ new Date(`${date}T12:00:00`);
  const month = d.getMonth();
  const day = d.getDate();
  if (month === 11) return PORTALTAGE_2026_DEC.includes(day);
  if (month === 0) return PORTALTAGE_2027_JAN.includes(day);
  return false;
}
var RUNEN = [
  { name: "Fehu", symbol: "\u16A0", bedeutung: "F\xFClle, Reichtum, neue Anf\xE4nge", affirmation: "Ich bin offen f\xFCr die F\xFClle des Lebens." },
  { name: "Uruz", symbol: "\u16A2", bedeutung: "Urkraft, Gesundheit, Vitalit\xE4t", affirmation: "Meine innere Kraft tr\xE4gt mich durch alles." },
  { name: "Thurisaz", symbol: "\u16A6", bedeutung: "Schutz, Grenzen, Durchbruch", affirmation: "Ich setze klare Grenzen und sch\xFCtze meine Energie." },
  { name: "Ansuz", symbol: "\u16A8", bedeutung: "Weisheit, Kommunikation, g\xF6ttliche Botschaft", affirmation: "Ich h\xF6re auf die Stimme meiner Seele." },
  { name: "Raidho", symbol: "\u16B1", bedeutung: "Reise, Rhythmus, Lebensweg", affirmation: "Ich vertraue meinem Weg." },
  { name: "Kenaz", symbol: "\u16B2", bedeutung: "Erleuchtung, Kreativit\xE4t, inneres Feuer", affirmation: "Mein inneres Licht leuchtet hell." },
  { name: "Gebo", symbol: "\u16B7", bedeutung: "Geschenk, Partnerschaft, Gleichgewicht", affirmation: "Ich gebe und empfange in Harmonie." },
  { name: "Wunjo", symbol: "\u16B9", bedeutung: "Freude, Harmonie, Erf\xFCllung", affirmation: "Ich erlaube mir, gl\xFCcklich zu sein." },
  { name: "Hagalaz", symbol: "\u16BA", bedeutung: "Transformation, Loslassen, Neubeginn", affirmation: "Ich lasse los, was mir nicht mehr dient." },
  { name: "Nauthiz", symbol: "\u16BE", bedeutung: "Notwendigkeit, Ausdauer, innere St\xE4rke", affirmation: "Aus jeder Herausforderung wachse ich." },
  { name: "Isa", symbol: "\u16C1", bedeutung: "Stille, Klarheit, Innenschau", affirmation: "In der Stille finde ich meine Antworten." },
  { name: "Jera", symbol: "\u16C3", bedeutung: "Ernte, Zyklen, Geduld", affirmation: "Alles hat seine Zeit \u2013 ich vertraue dem Prozess." },
  { name: "Eihwaz", symbol: "\u16C7", bedeutung: "Ausdauer, Verbindung, Lebensbaum", affirmation: "Ich bin tief verwurzelt und wachse zum Licht." },
  { name: "Perthro", symbol: "\u16C8", bedeutung: "Schicksal, Mysterium, Intuition", affirmation: "Ich vertraue dem Geheimnis meines Lebens." },
  { name: "Algiz", symbol: "\u16C9", bedeutung: "Schutz, h\xF6heres Selbst, Verbindung", affirmation: "Ich bin gesch\xFCtzt und gef\xFChrt." },
  { name: "Sowilo", symbol: "\u16CB", bedeutung: "Sonne, Lebenskraft, Erfolg", affirmation: "Ich strahle von innen heraus." },
  { name: "Tiwaz", symbol: "\u16CF", bedeutung: "Mut, Gerechtigkeit, Wahrheit", affirmation: "Ich stehe f\xFCr meine Wahrheit ein." },
  { name: "Berkana", symbol: "\u16D2", bedeutung: "Wachstum, Geburt, F\xFCrsorge", affirmation: "Ich n\xE4hre das Neue in meinem Leben." },
  { name: "Ehwaz", symbol: "\u16D6", bedeutung: "Partnerschaft, Vertrauen, Fortschritt", affirmation: "Gemeinsam sind wir st\xE4rker." },
  { name: "Mannaz", symbol: "\u16D7", bedeutung: "Menschlichkeit, Selbsterkenntnis, Gemeinschaft", affirmation: "Ich erkenne mich selbst in meiner vollen Sch\xF6nheit." },
  { name: "Laguz", symbol: "\u16DA", bedeutung: "Wasser, Intuition, Fluss", affirmation: "Ich flie\xDFe mit dem Leben." },
  { name: "Ingwaz", symbol: "\u16DC", bedeutung: "Fruchtbarkeit, Potenzial, Vollendung", affirmation: "In mir liegt unendliches Potenzial." },
  { name: "Dagaz", symbol: "\u16DE", bedeutung: "Durchbruch, Erwachen, neuer Tag", affirmation: "Jeder neue Tag ist ein Geschenk." },
  { name: "Othala", symbol: "\u16DF", bedeutung: "Heimat, Erbe, Zugeh\xF6rigkeit", affirmation: "Ich bin zu Hause in mir selbst." },
  // 4 Extra für Tage 25-28 (Wiederholung der wichtigsten)
  { name: "Fehu", symbol: "\u16A0", bedeutung: "F\xFClle, Reichtum, neue Anf\xE4nge", affirmation: "Das neue Jahr bringt mir F\xFClle." },
  { name: "Wunjo", symbol: "\u16B9", bedeutung: "Freude, Harmonie, Erf\xFCllung", affirmation: "Ich trage Freude in das neue Jahr." },
  { name: "Sowilo", symbol: "\u16CB", bedeutung: "Sonne, Lebenskraft, Erfolg", affirmation: "Mein Licht erstrahlt im neuen Jahr." },
  { name: "Dagaz", symbol: "\u16DE", bedeutung: "Durchbruch, Erwachen, neuer Tag", affirmation: "Ein neues Kapitel beginnt \u2013 voller M\xF6glichkeiten." }
];
var THEMEN = [
  { theme: "Sperrn\xE4chte: R\xFCckblick & Ankommen", emoji: "\u{1F56F}\uFE0F" },
  { theme: "Sperrn\xE4chte: Loslassen & Raum schaffen", emoji: "\u{1F342}" },
  { theme: "Ankunft & Einkehr", emoji: "\u{1F56F}\uFE0F" },
  { theme: "Stille & Innenschau", emoji: "\u{1F92B}" },
  { theme: "Loslassen", emoji: "\u{1F342}" },
  { theme: "Dankbarkeit", emoji: "\u{1F64F}" },
  { theme: "Ahnen & Wurzeln", emoji: "\u{1F333}" },
  { theme: "Tr\xE4ume & Visionen", emoji: "\u2728" },
  { theme: "Reinigung", emoji: "\u{1F4A8}" },
  { theme: "Selbstliebe", emoji: "\u{1F497}" },
  { theme: "Intuition", emoji: "\u{1F52E}" },
  { theme: "Vergebung", emoji: "\u{1F54A}\uFE0F" },
  { theme: "Inneres Kind", emoji: "\u{1F9F8}" },
  { theme: "Transformation", emoji: "\u{1F98B}" },
  { theme: "Wintersonnenwende", emoji: "\u2600\uFE0F" },
  { theme: "Wiedergeburt des Lichts", emoji: "\u{1F31F}" },
  { theme: "Heilung", emoji: "\u{1F49A}" },
  { theme: "F\xFClle & Manifestation", emoji: "\u{1F319}" },
  { theme: "Verbindung", emoji: "\u{1F91D}" },
  { theme: "Weibliche Kraft", emoji: "\u{1F33A}" },
  { theme: "Mut & St\xE4rke", emoji: "\u{1F525}" },
  { theme: "Kreativit\xE4t", emoji: "\u{1F3A8}" },
  { theme: "Freiheit", emoji: "\u{1F985}" },
  { theme: "Vertrauen", emoji: "\u{1F30A}" },
  { theme: "Klarheit", emoji: "\u{1F48E}" },
  { theme: "Schutz", emoji: "\u{1F6E1}\uFE0F" },
  { theme: "Neuanfang", emoji: "\u{1F331}" },
  { theme: "Lebensfreude", emoji: "\u{1F308}" },
  { theme: "Seelenplan", emoji: "\u{1F4DC}" },
  { theme: "Integration & Abschluss", emoji: "\u{1F300}" }
];
function generateRaunaechteContent(year) {
  const days = [];
  for (const dayNum of RAUHNAECHTE_CONTENT_CALENDAR_DAYS) {
    const i = dayNum - 1;
    const contentDay = getContentDayNumber(dayNum);
    const date = getProgramDate(year, dayNum);
    const dateStr = formatProgramISODate(date);
    const portaltag = isPortaltag2(dateStr);
    const thema = contentDay === 25 ? THEMEN[29] : THEMEN[i];
    const rune = i < 2 ? RUNEN[i === 0 ? 11 : 8] : RUNEN[i - 2];
    days.push({
      day: dayNum,
      contentDay,
      date: dateStr,
      theme: thema.theme,
      themeEmoji: thema.emoji,
      isPortaltag: portaltag,
      impuls: {
        title: `Inhaltstag ${contentDay}: ${thema.theme}`,
        text: `Heute widmen wir uns dem Thema "${thema.theme}". Nimm dir einen Moment der Stille und sp\xFCre in dich hinein. Was bedeutet ${thema.theme.toLowerCase()} f\xFCr dich in diesem Moment deines Lebens? Lass die Antwort aus deinem Herzen kommen, nicht aus deinem Kopf.`
      },
      meditation: {
        title: `Meditation: ${thema.theme}`,
        audioUrl: "",
        // Wird über Admin befüllt
        duration: 15
      },
      ritual: {
        title: `Ritual: ${thema.theme}`,
        steps: [
          "Z\xFCnde eine Kerze an und schaffe dir einen ruhigen Raum.",
          `R\xE4uchere mit Salbei oder Palo Santo, um den Raum zu reinigen.`,
          `Setze deine Intention f\xFCr heute: "${thema.theme}".`,
          `Halte den Edelstein des Tages in deiner Hand und atme tief.`,
          "Schlie\xDFe das Ritual mit drei tiefen Atemz\xFCgen ab."
        ],
        materials: ["Kerze", "R\xE4ucherwerk", "Edelstein des Tages", "Ruhiger Raum"]
      },
      journal: {
        question: getJournalQuestion(contentDay === 25 ? 30 : dayNum, thema.theme)
      },
      klang: {
        title: `Klangwelt: ${thema.theme}`,
        audioUrl: "",
        // Wird über Admin befüllt
        duration: 10
      },
      rune: {
        name: rune.name,
        symbol: rune.symbol,
        bedeutung: rune.bedeutung,
        affirmation: rune.affirmation
      },
      affirmation: {
        text: rune.affirmation
      },
      ...portaltag ? {
        portaltag: {
          title: `Portaltag-Energie: ${thema.theme}`,
          text: `Heute ist ein Portaltag \u2013 die Schleier zwischen den Welten sind besonders d\xFCnn. Die Energie von "${thema.theme}" ist heute verst\xE4rkt sp\xFCrbar. Nutze diese besondere Kraft f\xFCr deine innere Arbeit.`,
          energie: "Die kosmische Energie ist heute besonders hoch. Trinke viel Wasser, g\xF6nne dir Ruhe und sei achtsam mit deiner Energie."
        }
      } : {}
    });
  }
  return days;
}
function getJournalQuestion(day, theme) {
  if (day === 1) return "Blicke auf dein Jahr zur\xFCck: Was hat dich gepr\xE4gt, was m\xF6chtest du w\xFCrdigen und was darf gehen?";
  if (day === 2) return "Welche Gedanken, Erwartungen oder Gewohnheiten m\xF6chtest du in den Sperrn\xE4chten loslassen? Wof\xFCr schaffst du Raum?";
  const questions = {
    1: "Was m\xF6chtest du in dieser besonderen Zeit loslassen? Schreibe alles auf, was du nicht mit ins neue Jahr nehmen willst.",
    2: "Wann hast du zuletzt echte Stille erlebt? Was hast du dabei gef\xFChlt?",
    3: "Was h\xE4ltst du fest, obwohl es dir nicht mehr dient? Warum f\xE4llt das Loslassen so schwer?",
    4: "Wof\xFCr bist du in diesem Jahr zutiefst dankbar? Nenne mindestens 10 Dinge.",
    5: "Welche Werte und St\xE4rken hast du von deinen Ahnen geerbt? Was m\xF6chtest du weitergeben?",
    6: "Wenn alles m\xF6glich w\xE4re \u2013 wie s\xE4he dein Leben in einem Jahr aus? Tr\xE4ume gro\xDF.",
    7: "Was in deinem Leben braucht gerade eine energetische Reinigung? Beziehungen, R\xE4ume, Gedanken?",
    8: "Wie sprichst du mit dir selbst? Schreibe dir einen liebevollen Brief.",
    9: "Wann hast du zuletzt deiner Intuition vertraut? Was ist passiert?",
    10: "Wem oder was m\xF6chtest du vergeben? Auch dir selbst?",
    11: "Was h\xE4tte dein inneres Kind gerade am meisten gebraucht? Kannst du es dir heute geben?",
    12: "Welche Transformation durchlebst du gerade? Was stirbt, damit Neues entstehen kann?",
    13: "Was bedeutet die R\xFCckkehr des Lichts f\xFCr dich pers\xF6nlich?",
    14: "Welches Licht m\xF6chtest du im neuen Jahr in die Welt bringen?",
    15: "Wo in deinem K\xF6rper oder deiner Seele brauchst du gerade Heilung?",
    16: "Was m\xF6chtest du im neuen Jahr manifestieren? Sei so konkret wie m\xF6glich.",
    17: "Zu wem f\xFChlst du eine tiefe Seelenverbindung? Warum?",
    18: "Was bedeutet weibliche Kraft f\xFCr dich? Wie lebst du sie?",
    19: "Wovor hast du Angst? Und was w\xFCrdest du tun, wenn du keine Angst h\xE4ttest?",
    20: "Wie m\xF6chtest du deine Kreativit\xE4t im neuen Jahr ausdr\xFCcken?",
    21: "Was bedeutet Freiheit f\xFCr dich? Wo f\xFChlst du dich unfrei?",
    22: "Worauf vertraust du blind? Wo f\xE4llt dir Vertrauen schwer?",
    23: "Was ist dir in diesem Moment glasklar? Welche Entscheidung wartet auf dich?",
    24: "Wovor m\xF6chtest du dich im neuen Jahr sch\xFCtzen? Was sind deine Grenzen?",
    25: "Was beginnt gerade neu in deinem Leben? Welchen Samen pflanzt du?",
    26: "Was bringt dir pure Lebensfreude? Wie kannst du mehr davon in dein Leben bringen?",
    27: "Was ist dein Seelenplan f\xFCr das kommende Jahr? Was ruft dich?",
    28: "Blicke auf deine Zeit mit Sperrn\xE4chten und Rauhn\xE4chten zur\xFCck. Was hast du \xFCber dich gelernt? Was nimmst du mit?"
  };
  return questions[day - 2] || `Was bedeutet "${theme}" f\xFCr dich in diesem Moment?`;
}
function getRaunaechteDay(year, day) {
  const content = generateRaunaechteContent(year);
  return content.find((d) => d.day === day) || null;
}

// server/daily-push.ts
var IMPULSE = [
  "Du bist genug. Genau so wie du bist, in diesem Moment.",
  "Vertraue dem Prozess. Alles entfaltet sich im richtigen Tempo.",
  "Deine Intuition ist dein st\xE4rkster Kompass. H\xF6re auf sie.",
  "Heute darfst du sanft mit dir sein. Du musst nichts beweisen.",
  "Jeder Atemzug ist ein Neuanfang. Atme tief und beginne.",
  "Du tr\xE4gst Licht in dir. Lass es leuchten.",
  "Was du aussendest, kehrt zu dir zur\xFCck. W\xE4hle Liebe.",
  "Deine Wurzeln geben dir Halt. Deine Fl\xFCgel geben dir Freiheit.",
  "Heute ist ein guter Tag, um dankbar zu sein.",
  "Du bist auf dem richtigen Weg. Vertraue dir selbst.",
  "Deine Seele wei\xDF den Weg. H\xF6re ihr zu.",
  "Grenzen setzen ist ein Akt der Selbstliebe.",
  "Wachstum geschieht oft im Stillen. Sei geduldig mit dir.",
  "Du verdienst alles Gute, das das Leben zu bieten hat.",
  "Lass los was dich schwer macht. Du darfst leicht sein.",
  "Deine Energie ist kostbar. Sch\xFCtze sie liebevoll.",
  "Heute darfst du f\xFChlen was du f\xFChlst. Alles ist erlaubt.",
  "Du bist verbunden mit allem was ist. Du bist nie allein.",
  "Deine Geschichte ist wertvoll. Teile sie wenn du bereit bist.",
  "Jeder Tag tr\xE4gt ein Geschenk in sich. \xD6ffne die Augen daf\xFCr.",
  "Du bist st\xE4rker als du denkst und sch\xF6ner als du glaubst.",
  "Vertrauen ist die h\xF6chste Form des Mutes.",
  "Dein Herz kennt die Antworten. Frage es.",
  "Heute darfst du einfach sein. Ohne Leistung, ohne Druck.",
  "Du bist ein Wunder des Lebens. Vergiss das nie.",
  "Was du liebst, liebt dich zur\xFCck.",
  "Deine Seele hat einen Plan. Vertraue ihm.",
  "Heute ist ein guter Tag, um dir selbst zu vergeben.",
  "Du bist im Fluss des Lebens. Lass dich tragen.",
  "Deine Pr\xE4senz ist ein Geschenk an die Welt."
];
function getTagesimpuls() {
  const now = /* @__PURE__ */ new Date();
  const day = now.getDay() + now.getDate();
  return IMPULSE[day % IMPULSE.length];
}
async function sendDailyImpulsPush() {
  console.log("[daily-push] Starte t\xE4gliche Tagesimpuls-Push...");
  try {
    const alreadySentToday = await checkIfPushSentToday("Tagesimpuls");
    if (alreadySentToday) {
      console.log("[daily-push] Tagesimpuls wurde heute bereits gesendet. \xDCberspringe.");
      return;
    }
    const tokens = await getAllActivePushTokens();
    if (!tokens || tokens.length === 0) {
      console.log("[daily-push] Keine registrierten Push-Tokens gefunden. \xDCberspringe.");
      return;
    }
    const impuls = getTagesimpuls();
    console.log(`[daily-push] Tagesimpuls: "${impuls.substring(0, 50)}..." \u2192 ${tokens.length} Ger\xE4te`);
    sendWebPushToAll({ title: "\u2728 Dein Tagesimpuls", body: impuls, data: { type: "tagesimpuls" } }).then((r) => console.log(`[daily-push] Web-Push: ${r.sent} gesendet, ${r.failed} fehlgeschlagen`)).catch((e) => console.error("[daily-push] Web-Push Fehler:", e));
    const messageId = await createPushMessage({
      title: "\u2728 Dein Tagesimpuls",
      body: impuls,
      data: JSON.stringify({ type: "tagesimpuls" })
    });
    const tokenStrings = tokens.map((t2) => t2.token);
    const chunks = [];
    for (let i = 0; i < tokenStrings.length; i += 100) {
      chunks.push(tokenStrings.slice(i, i + 100));
    }
    let sentSuccess = 0;
    let sentFailed = 0;
    for (const chunk of chunks) {
      try {
        const messages = chunk.map((token) => ({
          to: token,
          sound: "default",
          title: "\u2728 Dein Tagesimpuls",
          body: impuls,
          data: { type: "tagesimpuls" }
        }));
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(messages)
        });
        if (response.ok) {
          const result = await response.json();
          const data = result.data || [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].status === "ok") {
              sentSuccess++;
            } else {
              sentFailed++;
              if (data[i].details?.error === "DeviceNotRegistered") {
                await deactivatePushToken(chunk[i]);
                console.log(`[daily-push] Token deaktiviert (nicht registriert): ${chunk[i].substring(0, 20)}...`);
              }
            }
          }
        } else {
          sentFailed += chunk.length;
          console.error(`[daily-push] Expo Push API Fehler: ${response.status}`);
        }
      } catch (err) {
        sentFailed += chunk.length;
        console.error("[daily-push] Chunk-Fehler:", err);
      }
    }
    await updatePushMessage(messageId, { sentSuccess, sentFailed });
    console.log(`[daily-push] Fertig: ${sentSuccess} erfolgreich, ${sentFailed} fehlgeschlagen`);
  } catch (err) {
    console.error("[daily-push] Kritischer Fehler:", err);
  }
}
async function sendRaunaechteAbendPush() {
  const now = /* @__PURE__ */ new Date();
  const berlinTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
  const programYear = getProgramYear(berlinTime);
  const raunaechteTag = getProgramDay(programYear, berlinTime);
  if (raunaechteTag < 1 || raunaechteTag > RAUHNAECHTE_PROGRAM.totalDays) return;
  const content = getRaunaechteDay(programYear, raunaechteTag);
  if (!content) return;
  console.log("[raunaechte-push] Sende Raun\xE4chte-Abend-Push...");
  try {
    const tokens = await getAllActivePushTokens();
    if (!tokens || tokens.length === 0) return;
    const thema = content.theme;
    const title = `\u{1F56F}\uFE0F Inhaltstag ${content.contentDay}: ${thema}`;
    const body = "Rauhn\xE4chte mit Sperrn\xE4chten: Nimm dir heute Zeit zum Innehalten. Deine Begleitung findest du in deiner Telegram-Gruppe; alle Infos in der App.";
    sendWebPushToAll({ title, body, data: { type: "raunaechte", day: raunaechteTag } }).then((r) => console.log(`[raunaechte-push] Web-Push: ${r.sent} gesendet, ${r.failed} fehlgeschlagen`)).catch((e) => console.error("[raunaechte-push] Web-Push Fehler:", e));
    const messageId = await createPushMessage({
      title,
      body,
      data: JSON.stringify({ type: "raunaechte", day: raunaechteTag })
    });
    const tokenStrings = tokens.map((t2) => t2.token);
    const messages = tokenStrings.map((token) => ({
      to: token,
      sound: "default",
      title,
      body,
      data: { type: "raunaechte", day: raunaechteTag }
    }));
    let sentSuccess = 0;
    let sentFailed = 0;
    for (let i = 0; i < messages.length; i += 100) {
      const chunk = messages.slice(i, i + 100);
      try {
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(chunk)
        });
        if (response.ok) {
          const result = await response.json();
          sentSuccess += (result.data || []).filter((d) => d.status === "ok").length;
          sentFailed += (result.data || []).filter((d) => d.status !== "ok").length;
        } else {
          sentFailed += chunk.length;
        }
      } catch {
        sentFailed += chunk.length;
      }
    }
    await updatePushMessage(messageId, { sentSuccess, sentFailed });
    console.log(`[raunaechte-push] Fertig: ${sentSuccess} erfolgreich, ${sentFailed} fehlgeschlagen`);
  } catch (err) {
    console.error("[raunaechte-push] Fehler:", err);
  }
}
function startDailyPushCron() {
  let lastImpulsDate = "";
  let lastPortaltagDate = "";
  let lastRaunaechteDate = "";
  setInterval(() => {
    const now = /* @__PURE__ */ new Date();
    const berlinTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
    const hour = berlinTime.getHours();
    const minute = berlinTime.getMinutes();
    const dateStr = berlinTime.toISOString().split("T")[0];
    if (hour === 7 && minute === 0 && lastImpulsDate !== dateStr) {
      lastImpulsDate = dateStr;
      sendDailyImpulsPush().catch((err) => {
        console.error("[daily-push] Fehler beim Senden:", err);
      });
    }
    if (hour === 19 && minute === 0 && lastPortaltagDate !== dateStr) {
      lastPortaltagDate = dateStr;
      sendPortaltagPush().catch((err) => {
        console.error("[portaltage] Fehler beim Senden:", err);
      });
      sendMoonRitualPush().catch((err) => {
        console.error("[moon-ritual] Fehler beim Senden:", err);
      });
    }
    if (hour === 18 && minute === 0 && lastRaunaechteDate !== dateStr) {
      lastRaunaechteDate = dateStr;
      sendRaunaechteAbendPush().catch((err) => {
        console.error("[raunaechte-push] Fehler beim Senden:", err);
      });
    }
  }, 6e4);
  console.log("[daily-push] Cron-Job gestartet: Tagesimpuls 7:00 + Portaltage/Mond-Rituale 19:00 + Raun\xE4chte 18:00 (Europe/Berlin)");
}

// server/rauhnaechte-access.ts
import { createHmac as createHmac3, randomBytes as randomBytes3, timingSafeEqual as timingSafeEqual2 } from "node:crypto";
init_db();

// server/journal-template.ts
import { createDecipheriv, createHmac as createHmac2 } from "node:crypto";
var payload = { "iv": "l4qdVhQVfHj8SemQ", "tag": "isW82N47olkDriB7NEHJmA==", "data": "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" };
function getJournalTemplate() {
  const key2 = process.env.RAUHNAECHTE_JOURNAL_CONTENT_KEY ? Buffer.from(process.env.RAUHNAECHTE_JOURNAL_CONTENT_KEY, "hex") : createHmac2("sha256", process.env.JWT_SECRET || "").update("journal-content-encryption-v1").digest();
  const decipher = createDecipheriv("aes-256-gcm", key2, Buffer.from(payload.iv, "base64"));
  decipher.setAuthTag(Buffer.from(payload.tag, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(payload.data, "base64")), decipher.final()]).toString("utf8");
}

// server/rauhnaechte-access.ts
function berlinNow(now = /* @__PURE__ */ new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).format(now).split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2], 12);
}
function signingKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) throw new Error("Zugangsdienst ist nicht eingerichtet.");
  return createHmac3("sha256", secret).update("rauhnaechte-journal-v1").digest("hex");
}
function signJournalToken(claims) {
  const body = Buffer.from(JSON.stringify({ ...claims, nonce: randomBytes3(16).toString("hex") })).toString("base64url");
  return `${body}.${createHmac3("sha256", signingKey()).update(body).digest("base64url")}`;
}
function verifyJournalToken(token, scope, now = Date.now()) {
  try {
    const [body, signature, extra] = token.split(".");
    if (!body || !signature || extra) return null;
    const actual = Buffer.from(signature, "base64url"), expected = createHmac3("sha256", signingKey()).update(body).digest();
    if (actual.length !== expected.length || !timingSafeEqual2(actual, expected)) return null;
    const data = JSON.parse(Buffer.from(body, "base64url").toString());
    if (data.scope !== scope || !Number.isInteger(data.codeId) || !Number.isInteger(data.year) || data.exp <= now || !data.nonce) return null;
    return data;
  } catch {
    return null;
  }
}
function validIdentity(value) {
  return typeof value === "string" && value.length >= 8 && value.length <= 255;
}
function validCode(value) {
  return typeof value === "string" && /^RN-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(value.toUpperCase().trim());
}
async function requireAppAccess(req) {
  const { code, deviceId } = req.body || {};
  if (!validCode(code) || !validIdentity(deviceId)) return null;
  const row = await getActiveRaunaechteAccess(code.toUpperCase().trim(), deviceId);
  if (!row || row.year !== getProgramYear(berlinNow())) return null;
  return row;
}
var attempts2 = /* @__PURE__ */ new Map();
var usedHandoffs = /* @__PURE__ */ new Map();
function rateAllowed(ip) {
  const now = Date.now();
  for (const [key2, value] of attempts2) if (value.expires <= now) attempts2.delete(key2);
  const entry = attempts2.get(ip) || { count: 0, expires: now + 15 * 6e4 };
  entry.count++;
  attempts2.set(ip, entry);
  return entry.count <= 30;
}
function tokenFor(codeId, year, browserId) {
  return signJournalToken({ codeId, year, browserId, scope: "journal", exp: Date.now() + 12 * 60 * 6e4 });
}
function registerRauhnaechteAccessRoutes(app) {
  app.use("/api/rauhnaechte", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store, private");
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  });
  app.post("/api/rauhnaechte/access/check", async (req, res) => {
    try {
      const row = await requireAppAccess(req);
      if (!row) {
        res.status(403).json({ valid: false, error: "Bitte l\xF6se zuerst deinen von Lara vergebenen Zugangscode ein." });
        return;
      }
      res.json({ valid: true, year: row.year, currentDay: getProgramDay(row.year, berlinNow()) });
    } catch {
      res.status(503).json({ valid: false, error: "Zugang konnte nicht gepr\xFCft werden. Bitte erneut versuchen." });
    }
  });
  app.post("/api/rauhnaechte/day", async (req, res) => {
    try {
      const row = await requireAppAccess(req);
      if (!row || req.body.year !== row.year) {
        res.status(403).json({ error: "Zugangscode erforderlich." });
        return;
      }
      const day = req.body.day;
      if (!Number.isInteger(day) || getContentDayNumber(day) === null) {
        res.status(404).json({ error: "Heute gibt es keinen neuen Inhaltstag." });
        return;
      }
      if (day > getProgramDay(row.year, berlinNow())) {
        res.status(403).json({ error: "Dieser Inhaltstag ist noch gesperrt. Freischaltung erst am jeweiligen Datum." });
        return;
      }
      res.json({ content: getRaunaechteDay(row.year, day) });
    } catch {
      res.status(503).json({ error: "Inhalte konnten nicht geladen werden. Bitte erneut versuchen." });
    }
  });
  app.post("/api/rauhnaechte/journal/ticket", async (req, res) => {
    try {
      const row = await requireAppAccess(req);
      if (!row) {
        res.status(403).json({ error: "Journal erst nach Code-Freischaltung verf\xFCgbar." });
        return;
      }
      res.json({ ticket: signJournalToken({ codeId: row.id, year: row.year, scope: "handoff", exp: Date.now() + 12e4 }) });
    } catch {
      res.status(503).json({ error: "Journal-Zugang konnte nicht vorbereitet werden." });
    }
  });
  app.post("/api/rauhnaechte/journal/session", async (req, res) => {
    if (!rateAllowed(req.ip || "unknown")) {
      res.status(429).json({ error: "Zu viele Versuche. Bitte warte 15 Minuten." });
      return;
    }
    try {
      const { browserId, ticket, code } = req.body || {};
      if (!validIdentity(browserId)) {
        res.status(400).json({ error: "Browser-Zuordnung fehlt." });
        return;
      }
      let row;
      if (typeof ticket === "string") {
        const claims = verifyJournalToken(ticket, "handoff");
        for (const [key2, expires] of usedHandoffs) if (expires <= Date.now()) usedHandoffs.delete(key2);
        if (!claims || usedHandoffs.has(claims.nonce)) {
          res.status(403).json({ error: "Journal-\xDCbergabe abgelaufen. Bitte erneut aus der App \xF6ffnen." });
          return;
        }
        row = await bindRaunaechteJournal(claims.codeId, browserId);
        if (row) usedHandoffs.set(claims.nonce, claims.exp);
      } else if (validCode(code)) {
        row = await bindRaunaechteJournalByCode(code.toUpperCase().trim(), browserId);
      }
      if (!row || row.year !== getProgramYear(berlinNow())) {
        res.status(403).json({ error: "Ung\xFCltiger, deaktivierter oder bereits in einem anderen Browser verwendeter Code. Den Zugangscode erh\xE4ltst du nach der Buchung von Lara." });
        return;
      }
      res.json({ token: tokenFor(row.id, row.year, browserId), year: row.year });
    } catch {
      res.status(503).json({ error: "Zugang konnte nicht gepr\xFCft werden. Es wird nichts freigeschaltet." });
    }
  });
  app.post("/api/rauhnaechte/journal/document", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace(/^Bearer /, "") || "";
      const claims = verifyJournalToken(token, "journal");
      if (!claims || !claims.browserId || claims.browserId !== req.body?.browserId) {
        res.status(403).json({ error: "Bitte gib deinen Zugangscode ein." });
        return;
      }
      const row = await getActiveRaunaechteJournal(claims.codeId, claims.browserId);
      if (!row || row.year !== claims.year || row.year !== getProgramYear(berlinNow())) {
        res.status(403).json({ error: "Zugang nicht mehr g\xFCltig. Bitte wende dich an Lara." });
        return;
      }
      const currentDay = getProgramDay(row.year, berlinNow());
      const state = JSON.stringify({ year: row.year, currentDay, today: new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(/* @__PURE__ */ new Date()) }).replace(/</g, "\\u003c");
      const html = restrictJournalDays(getJournalTemplate(), currentDay).replace("/* SERVER_ACCESS_STATE */", `window.__RAUH_ACCESS__=${state};`);
      res.type("html").send(html);
    } catch {
      res.status(503).json({ error: "Journal konnte nicht sicher geladen werden." });
    }
  });
}
function restrictJournalDays(template, currentDay) {
  let html = template;
  for (const [name, firstDay] of [["SPERR", 1], ["RAUH", 17]]) {
    const pattern = new RegExp(`const ${name} = (\\[[\\s\\S]*?\\n\\]);`);
    html = html.replace(pattern, (_whole, array) => {
      const entries = JSON.parse(array.replace(/,\s*\]/g, "]"));
      const filtered = entries.map((entry, index) => firstDay + index <= currentDay ? entry : ["Noch gesperrt", "Freischaltung am jeweiligen Datum.", []]);
      return `const ${name} = ${JSON.stringify(filtered)};`;
    });
  }
  return html;
}

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
  app.set("trust proxy", 1);
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
  registerRauhnaechteAccessRoutes(app);
  registerRauhAdminAuth(app);
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });
  app.get("/healthz", (_req, res) => {
    res.json({ ok: true, mode: "render-direct-api" });
  });
  app.get("/api/readiness", async (_req, res) => {
    try {
      const { getPushRegistrationStats: getPushRegistrationStats2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      await getPushRegistrationStats2();
      res.json({ ok: true, database: "connected", mode: "render-direct-api" });
    } catch {
      res.status(503).json({ ok: false, database: "unavailable" });
    }
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
  app.post("/api/get-upload-url", express.json(), async (req, res) => {
    try {
      const { fileName, mimeType } = req.body;
      if (!fileName) {
        res.status(400).json({ success: false, error: "fileName fehlt" });
        return;
      }
      const randomSuffix = Math.random().toString(36).slice(2, 8);
      const safeName = (fileName || "audio.mp3").replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileKey = `audio/${safeName}-${randomSuffix}`;
      const result = await storageGetUploadUrl(fileKey, mimeType || "audio/mpeg");
      res.json({ success: true, ...result });
    } catch (err) {
      console.error("Get upload URL error:", err);
      res.status(500).json({ success: false, error: err.message || "Fehler beim Erstellen der Upload-URL" });
    }
  });
  app.post("/api/confirm-upload", express.json(), async (req, res) => {
    try {
      const { key: key2 } = req.body;
      if (!key2) {
        res.status(400).json({ success: false, error: "key fehlt" });
        return;
      }
      const { storageGet: storageGet2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
      const result = await storageGet2(key2);
      res.json({ success: true, url: result.url, key: result.key });
    } catch (err) {
      console.error("Confirm upload error:", err);
      res.status(500).json({ success: false, error: err.message || "Fehler" });
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
      const { getDb: getDb3 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const db = await getDb3();
      if (db) {
        res.json({ success: true, message: "DB-Verbindung zur\xFCckgesetzt und neu verbunden" });
      } else {
        res.json({ success: false, message: "DB-Verbindung zur\xFCckgesetzt, aber Neuverbindung fehlgeschlagen" });
      }
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.get("/api/db-diagnose", async (_req, res) => {
    const results = { timestamp: (/* @__PURE__ */ new Date()).toISOString() };
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      res.json({ success: false, error: "DATABASE_URL nicht gesetzt" });
      return;
    }
    results.db_url_masked = dbUrl.replace(/:[^:@]+@/, ":***@").substring(0, 80);
    results.is_render_internal = !!(dbUrl.includes(".render.com") || dbUrl.match(/dpg-[a-z0-9]+-a/));
    const pgModule = await import("postgres");
    const postgres = pgModule.default;
    for (const sslMode of [false, "require", { rejectUnauthorized: false }]) {
      const label = sslMode === false ? "no-ssl" : sslMode === "require" ? "ssl-require" : "ssl-no-verify";
      try {
        const testSql = postgres(dbUrl, { ssl: sslMode, max: 1, connect_timeout: 5, idle_timeout: 3 });
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT 8s")), 8e3));
        const query = testSql`SELECT 1 as test, now() as server_time, current_database() as db_name`.then(async (r2) => {
          await testSql.end({ timeout: 3 });
          return r2;
        });
        const r = await Promise.race([query, timeout]);
        results[label] = { ok: true, time: r[0]?.server_time, db: r[0]?.db_name };
        try {
          const testSql2 = postgres(dbUrl, { ssl: sslMode, max: 1, connect_timeout: 5 });
          const timeout2 = new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), 5e3));
          const tables = await Promise.race([
            testSql2`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'seelenjournal%'`.then(async (r2) => {
              await testSql2.end({ timeout: 3 });
              return r2;
            }),
            timeout2
          ]);
          results.sj_tables = tables.map((t2) => t2.table_name);
        } catch (e) {
          results.sj_tables_error = e.message;
        }
        try {
          const testSql3 = postgres(dbUrl, { ssl: sslMode, max: 1, connect_timeout: 5 });
          const timeout3 = new Promise((_, reject) => setTimeout(() => reject(new Error("SELECT TIMEOUT 8s")), 8e3));
          const rows = await Promise.race([
            testSql3`SELECT id, email, name FROM seelenjournal_clients LIMIT 5`.then(async (r2) => {
              await testSql3.end({ timeout: 3 });
              return r2;
            }),
            timeout3
          ]);
          results.sj_clients_select = { ok: true, count: rows.length, rows: rows.map((r2) => ({ id: r2.id, email: r2.email, name: r2.name })) };
        } catch (e) {
          results.sj_clients_select = { ok: false, error: e.message };
        }
        try {
          const testSql4 = postgres(dbUrl, { ssl: sslMode, max: 1, connect_timeout: 5 });
          const timeout4 = new Promise((_, reject) => setTimeout(() => reject(new Error("INSERT TIMEOUT 8s")), 8e3));
          const insertResult = await Promise.race([
            testSql4.begin(async (tx) => {
              const r2 = await tx`INSERT INTO seelenjournal_clients (email, password, name, "isActive", "createdAt") VALUES ('__test__@test.com', 'test', 'Test', 1, now()) RETURNING id`;
              throw { __rollback: true, id: r2[0]?.id };
            }).catch((e) => {
              if (e.__rollback) return { rolled_back: true, would_have_id: e.id };
              throw e;
            }).then(async (r2) => {
              await testSql4.end({ timeout: 3 });
              return r2;
            }),
            timeout4
          ]);
          results.sj_clients_insert = { ok: true, ...insertResult };
        } catch (e) {
          results.sj_clients_insert = { ok: false, error: e.message };
        }
        try {
          const testSql5 = postgres(dbUrl, { ssl: sslMode, max: 1, connect_timeout: 5 });
          const timeout5 = new Promise((_, reject) => setTimeout(() => reject(new Error("LOCKS TIMEOUT 5s")), 5e3));
          const locks = await Promise.race([
            testSql5`
              SELECT l.pid, l.locktype, l.mode, l.granted, a.state, a.query, c.relname
              FROM pg_locks l
              JOIN pg_stat_activity a ON l.pid = a.pid
              LEFT JOIN pg_class c ON l.relation = c.oid
              WHERE c.relname LIKE 'seelenjournal%'
              LIMIT 20
            `.then(async (r2) => {
              await testSql5.end({ timeout: 3 });
              return r2;
            }),
            timeout5
          ]);
          results.sj_locks = locks.map((l) => ({ pid: l.pid, type: l.locktype, mode: l.mode, granted: l.granted, state: l.state, table: l.relname, query: l.query?.substring(0, 100) }));
        } catch (e) {
          results.sj_locks_error = e.message;
        }
        try {
          const testSql6 = postgres(dbUrl, { ssl: sslMode, max: 1, connect_timeout: 5 });
          const timeout6 = new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), 5e3));
          const conns = await Promise.race([
            testSql6`SELECT pid, state, query, wait_event_type, wait_event, now() - query_start as duration FROM pg_stat_activity WHERE datname = current_database() ORDER BY query_start`.then(async (r2) => {
              await testSql6.end({ timeout: 3 });
              return r2;
            }),
            timeout6
          ]);
          results.all_connections = conns.map((c) => ({ pid: c.pid, state: c.state, query: c.query?.substring(0, 100), wait: c.wait_event_type ? `${c.wait_event_type}:${c.wait_event}` : null, duration: String(c.duration) }));
        } catch (e) {
          results.all_connections_error = e.message;
        }
        break;
      } catch (e) {
        results[label] = { ok: false, error: e.message };
      }
    }
    results.success = true;
    res.json(results);
  });
  app.get("/api/db-kill-stuck", async (_req, res) => {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      res.json({ success: false, error: "DATABASE_URL nicht gesetzt" });
      return;
    }
    const pgModule = await import("postgres");
    const postgres = pgModule.default;
    for (const sslMode of [false, "require", { rejectUnauthorized: false }]) {
      try {
        const sql3 = postgres(dbUrl, { ssl: sslMode, max: 1, connect_timeout: 5 });
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT 8s")), 8e3));
        const doWork = async () => {
          const stuck = await sql3`
            SELECT pid, state, query FROM pg_stat_activity 
            WHERE pid != pg_backend_pid() AND (state != 'idle' OR state = 'idle in transaction')
          `;
          const killed = [];
          for (const q of stuck) {
            try {
              await sql3`SELECT pg_terminate_backend(${q.pid})`;
              killed.push(q.pid);
            } catch (e) {
            }
          }
          await sql3.end({ timeout: 3 });
          return { killed, stuck_count: stuck.length };
        };
        const result = await Promise.race([doWork(), timeout]);
        const { resetDb: resetDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
        resetDb2();
        res.json({ success: true, ssl_mode: String(sslMode), ...result, message: `${result.killed.length} Verbindungen beendet` });
        return;
      } catch (e) {
        continue;
      }
    }
    res.status(500).json({ success: false, error: "Keine DB-Verbindung m\xF6glich (alle SSL-Modi fehlgeschlagen)" });
  });
  app.use("/api/seelenjournal", seelenjournal_routes_default);
  app.post("/api/web-push/subscribe", express.json(), async (req, res) => {
    try {
      const { subscription } = req.body;
      if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ success: false, error: "Keine Subscription angegeben" });
      }
      const { saveWebPushSubscription: saveWebPushSubscription2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      await saveWebPushSubscription2(subscription.endpoint, JSON.stringify(subscription));
      res.json({ success: true });
    } catch (error) {
      console.error("[WebPush] Subscribe-Fehler:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app.post("/api/web-push/send", express.json(), async (req, res) => {
    try {
      const { title, body, url } = req.body;
      if (!title || !body) {
        return res.status(400).json({ success: false, error: "Titel und Text erforderlich" });
      }
      const { sendWebPushToAll: sendWebPushToAll2 } = await Promise.resolve().then(() => (init_web_push(), web_push_exports));
      const result = await sendWebPushToAll2({ title, body, url: url || "https://www.app.dieseelenplanerin.de" });
      res.json({ success: true, ...result });
    } catch (error) {
      console.error("[WebPush] Send-Fehler:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app.post("/api/raunaechte-waitlist", express.json(), async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ success: false, error: "Ung\xFCltige E-Mail" });
      }
      const { addRaunaechteWaitlist: addRaunaechteWaitlist2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      await addRaunaechteWaitlist2(email.toLowerCase().trim());
      try {
        const smtpHost = process.env.SMTP_HOST;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const smtpPort = process.env.SMTP_PORT || "587";
        const smtpFromName = process.env.SMTP_FROM_NAME || "Die Seelenplanerin";
        if (smtpHost && smtpUser && smtpPass) {
          const nodemailer2 = await import("nodemailer");
          const transporter = nodemailer2.default.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort),
            secure: parseInt(smtpPort) === 465,
            auth: { user: smtpUser, pass: smtpPass }
          });
          await transporter.sendMail({
            from: `"${smtpFromName}" <${smtpUser}>`,
            to: "laramwille@gmail.com",
            subject: "\u2728 Neue Rauhn\xE4chte-Warteliste Anmeldung",
            html: `<div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #FFF8F0; border-radius: 12px;">
              <h2 style="color: #8B6F47; margin-bottom: 16px;">Neue Warteliste-Anmeldung \u2728</h2>
              <p style="color: #5C4A32; font-size: 16px;">Jemand hat sich f\xFCr die <strong>Rauhn\xE4chte-Begleitung</strong> auf die Warteliste eingetragen:</p>
              <div style="background: white; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #C4956A;">
                <p style="color: #5C4A32; font-size: 18px; margin: 0;"><strong>${email.toLowerCase().trim()}</strong></p>
              </div>
              <p style="color: #8B6F47; font-size: 14px;">Liebe Gr\xFC\xDFe, deine App \u{1F319}</p>
            </div>`
          });
          console.log(`[Waitlist] Benachrichtigung gesendet f\xFCr: ${email}`);
        }
      } catch (mailErr) {
        console.error("[Waitlist] E-Mail-Benachrichtigung fehlgeschlagen:", mailErr.message);
      }
      res.json({ success: true });
    } catch (error) {
      if (error.message?.includes("Duplicate")) {
        return res.json({ success: true, message: "Bereits eingetragen" });
      }
      console.error("[Waitlist] Fehler:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app.get("/api/web-push/count", async (_req, res) => {
    try {
      const { getWebPushSubscriptionCount: getWebPushSubscriptionCount2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const count = await getWebPushSubscriptionCount2();
      res.json({ success: true, count });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
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
      const reqPath = req.path.replace(/\/$/, "");
      const htmlFile = path.join(webDistPath, reqPath.endsWith(".html") ? reqPath : reqPath + ".html");
      if (fs.existsSync(htmlFile)) {
        res.sendFile(htmlFile);
        return;
      }
      const segments = reqPath.split("/").filter(Boolean);
      if (segments.length >= 2) {
        const parentDir = path.join(webDistPath, ...segments.slice(0, -1));
        if (fs.existsSync(parentDir)) {
          try {
            const files = fs.readdirSync(parentDir);
            const dynamicFile = files.find((f) => f.startsWith("[") && f.endsWith("].html"));
            if (dynamicFile) {
              res.sendFile(path.join(parentDir, dynamicFile));
              return;
            }
          } catch (e) {
          }
        }
      }
      res.sendFile(path.join(webDistPath, "index.html"));
    });
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  app.post("/api/send-daily-impuls", async (_req, res) => {
    try {
      await sendDailyImpulsPush();
      res.json({ success: true, message: "Tagesimpuls-Push gesendet" });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.post("/api/send-portaltag-push", async (_req, res) => {
    try {
      const heute = isPortaltag();
      if (!heute) {
        res.json({ success: true, message: "Heute ist kein Portaltag. Push wird trotzdem zum Testen gesendet.", isPortaltag: false });
      }
      await sendPortaltagPush();
      res.json({ success: true, message: "Portaltag-Push gesendet", isPortaltag: heute });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.get("/api/portaltage-status", (_req, res) => {
    const heute = isPortaltag();
    res.json({ success: true, isPortaltagHeute: heute });
  });
  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
    if (process.env.ENABLE_DAILY_PUSH_CRON !== "false") {
      startDailyPushCron();
    } else {
      console.log("[daily-push] Cron in diesem Prozess deaktiviert (keine doppelten Sendungen).");
    }
  });
}
startServer().catch(console.error);
