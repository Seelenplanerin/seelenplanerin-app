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
var users, meditations, communityUsers, affiliateCodes, affiliateClicks, affiliateSales, affiliatePayouts, pushTokens, pushMessages, seelenjournalClients, seelenjournalEntries, seelenjournalAttachments, seelenjournalMessages, academyWaitlist;
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
    academyWaitlist = mysqlTable("academy_waitlist", {
      id: int("id").autoincrement().primaryKey(),
      email: varchar("email", { length: 320 }).notNull().unique(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  addAcademyWaitlist: () => addAcademyWaitlist,
  createCommunityUser: () => createCommunityUser,
  createMeditation: () => createMeditation,
  createPushMessage: () => createPushMessage,
  deactivatePushToken: () => deactivatePushToken,
  deleteCommunityUser: () => deleteCommunityUser,
  deleteMeditation: () => deleteMeditation,
  getAcademyWaitlist: () => getAcademyWaitlist,
  getActiveMeditations: () => getActiveMeditations,
  getAllActivePushTokens: () => getAllActivePushTokens,
  getAllCommunityUsers: () => getAllCommunityUsers,
  getAllMeditations: () => getAllMeditations,
  getCommunityUserByEmail: () => getCommunityUserByEmail,
  getCommunityUsersWithEmailConsent: () => getCommunityUsersWithEmailConsent,
  getDb: () => getDb,
  getPushMessageHistory: () => getPushMessageHistory,
  getPushTokenCount: () => getPushTokenCount,
  getSslConfig: () => getSslConfig,
  getUserByOpenId: () => getUserByOpenId,
  registerPushToken: () => registerPushToken,
  resetDb: () => resetDb,
  setCommunityEmailConsent: () => setCommunityEmailConsent,
  updateCommunityUser: () => updateCommunityUser,
  updateCommunityUserEmailConsent: () => updateCommunityUserEmailConsent,
  updateMeditation: () => updateMeditation,
  updatePushMessage: () => updatePushMessage,
  upsertUser: () => upsertUser
});
import { eq, desc, sql } from "drizzle-orm";
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
    const existing = await db.select().from(pushTokens).where(eq(pushTokens.token, data.token)).limit(1);
    if (existing.length > 0) {
      await db.update(pushTokens).set({ isActive: 1, platform: data.platform || null }).where(eq(pushTokens.token, data.token));
    } else {
      await db.insert(pushTokens).values({ token: data.token, platform: data.platform || null, isActive: 1 });
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
var _db, _pool;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_schema();
    _db = null;
    _pool = null;
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
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/_core/sdk.ts
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
    const ownerEmail = "hallo@seelenplanerin.de";
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

// server/storage.ts
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
  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });
}
startServer().catch(console.error);
