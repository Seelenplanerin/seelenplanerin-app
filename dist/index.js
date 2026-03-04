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
var roleEnum, users, meditations, communityUsers, affiliateCodes, affiliateClicks, affiliateSales, affiliatePayouts;
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
  getAllAffiliatePayouts: () => getAllAffiliatePayouts,
  getAllAffiliateSales: () => getAllAffiliateSales,
  getAllAffiliates: () => getAllAffiliates,
  getAllCommunityUsers: () => getAllCommunityUsers,
  getAllMeditations: () => getAllMeditations,
  getCommunityUserByEmail: () => getCommunityUserByEmail,
  getDb: () => getDb,
  getUserByOpenId: () => getUserByOpenId,
  recordAffiliateClick: () => recordAffiliateClick,
  updateAffiliate: () => updateAffiliate,
  updateAffiliateSaleStatus: () => updateAffiliateSaleStatus,
  updateCommunityUser: () => updateCommunityUser,
  updateMeditation: () => updateMeditation,
  upsertUser: () => upsertUser
});
import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
async function getDb() {
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
async function addAcademyWaitlist(email) {
  const db = await getDb();
  if (!db) throw new Error("No database connection");
  const client = postgres(process.env.DATABASE_URL, { ssl: "require" });
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
  const client = postgres(process.env.DATABASE_URL, { ssl: "require" });
  try {
    const rows = await client`SELECT id, email, "createdAt" FROM academy_waitlist ORDER BY "createdAt" DESC`;
    return rows;
  } finally {
    await client.end();
  }
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
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
              <tr><td style="padding:6px 0;font-weight:600;">Gew\xE4hlter Code:</td><td style="text-align:right;font-weight:700;font-size:18px;color:#C9A96E;letter-spacing:2px;">${params.affiliateCode}</td></tr>
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
      const users2 = await getAllCommunityUsers();
      const recipients = users2.map((u) => ({ email: u.email, name: u.name }));
      if (recipients.length === 0) {
        return { success: false, sent: 0, failed: 0, errors: ["Keine Mitglieder vorhanden."] };
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
    })
  }),
  // ── Affiliate-System ──
  affiliate: router({
    // Affiliate-Code für einen Nutzer erstellen oder abrufen
    getOrCreate: publicProcedure.input(z2.object({ email: z2.string().email(), name: z2.string().min(1), wunschCode: z2.string().min(2).optional() })).mutation(async ({ input }) => {
      let affiliate = await getAffiliateByEmail(input.email);
      if (affiliate) return { success: true, affiliate };
      let code;
      if (input.wunschCode) {
        code = input.wunschCode.toUpperCase().replace(/[^A-Z\u00C4\u00D6\u00DC0-9]/g, "").slice(0, 20);
        const existing = await getAffiliateByCode(code);
        if (existing) return { success: false, error: "code_taken" };
      } else {
        code = await generateAffiliateCode();
        let attempts = 0;
        while (await getAffiliateByCode(code) && attempts < 10) {
          code = await generateAffiliateCode();
          attempts++;
        }
      }
      const id = await createAffiliate({ email: input.email, name: input.name, code });
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
import multer from "multer";

// server/db-migrate.ts
import postgres2 from "postgres";
async function runMigrations() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log("[db-migrate] No DATABASE_URL, skipping migrations");
    return;
  }
  const sql2 = postgres2(dbUrl, { ssl: "require", max: 1 });
  try {
    await sql2`
      DO $$ BEGIN
        CREATE TYPE role AS ENUM ('user', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    await sql2`
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
    await sql2`
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
    await sql2`
      CREATE TABLE IF NOT EXISTS community_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(320) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        "mustChangePassword" INTEGER DEFAULT 0 NOT NULL,
        "isActive" INTEGER DEFAULT 1 NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql2`
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
        "paypalEmail" VARCHAR(320),
        iban VARCHAR(50),
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql2`
      CREATE TABLE IF NOT EXISTS affiliate_clicks (
        id SERIAL PRIMARY KEY,
        "affiliateCode" VARCHAR(20) NOT NULL,
        "ipHash" VARCHAR(64),
        "userAgent" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    await sql2`
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
    await sql2`
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
    await sql2`
      CREATE TABLE IF NOT EXISTS academy_waitlist (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log("[db-migrate] All tables created/verified (incl. affiliate + academy)");
  } finally {
    await sql2.end();
  }
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
  return cwdDist;
}
async function startServer() {
  try {
    await runMigrations();
    console.log("[db] Migrations completed");
  } catch (err) {
    console.error("[db] Migration failed:", err);
  }
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
    app.use("/api/app", express.static(webDistPath));
    app.get("/api/app", (_req, res) => {
      res.sendFile(path.join(webDistPath, "index.html"));
    });
    app.get("/api/app/*", (req, res) => {
      const reqPath = req.path;
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
  const upload = multer({ limits: { fileSize: 200 * 1024 * 1024 } });
  app.post("/api/upload-audio", upload.single("file"), async (req, res) => {
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
      const { createHash } = await import("crypto");
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
      const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);
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
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
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
