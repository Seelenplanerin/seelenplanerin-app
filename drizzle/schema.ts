import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Meditationen-Tabelle
export const meditations = mysqlTable("meditations", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  emoji: varchar("emoji", { length: 10 }).default("🧘‍♀️"),
  audioUrl: text("audioUrl").notNull(),
  isPremium: int("isPremium").default(1).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Meditation = typeof meditations.$inferSelect;
export type InsertMeditation = typeof meditations.$inferInsert;

// Community-Nutzer-Tabelle
export const communityUsers = mysqlTable("community_users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  mustChangePassword: int("mustChangePassword").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  emailConsent: int("emailConsent").default(0).notNull(),
  emailConsentDate: timestamp("emailConsentDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CommunityUser = typeof communityUsers.$inferSelect;
export type InsertCommunityUser = typeof communityUsers.$inferInsert;

// ── Affiliate-System ──

export const affiliateCodes = mysqlTable("affiliate_codes", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AffiliateCode = typeof affiliateCodes.$inferSelect;
export type InsertAffiliateCode = typeof affiliateCodes.$inferInsert;

export const affiliateClicks = mysqlTable("affiliate_clicks", {
  id: int("id").autoincrement().primaryKey(),
  affiliateCode: varchar("affiliateCode", { length: 20 }).notNull(),
  ipHash: varchar("ipHash", { length: 64 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AffiliateClick = typeof affiliateClicks.$inferSelect;

export const affiliateSales = mysqlTable("affiliate_sales", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AffiliateSale = typeof affiliateSales.$inferSelect;
export type InsertAffiliateSale = typeof affiliateSales.$inferInsert;

export const affiliatePayouts = mysqlTable("affiliate_payouts", {
  id: int("id").autoincrement().primaryKey(),
  affiliateCode: varchar("affiliateCode", { length: 20 }).notNull(),
  amount: int("amount").notNull(),
  method: varchar("method", { length: 50 }).default("paypal").notNull(),
  reference: varchar("reference", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AffiliatePayout = typeof affiliatePayouts.$inferSelect;
export type InsertAffiliatePayout = typeof affiliatePayouts.$inferInsert;

// ── Push-Benachrichtigungen ──

export const pushTokens = mysqlTable("push_tokens", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  platform: varchar("platform", { length: 20 }),
  communityEmail: varchar("communityEmail", { length: 320 }),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
});
export type PushToken = typeof pushTokens.$inferSelect;
export type InsertPushToken = typeof pushTokens.$inferInsert;

export const pushMessages = mysqlTable("push_messages", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  data: text("data"),
  sentTo: int("sentTo").default(0).notNull(),
  sentSuccess: int("sentSuccess").default(0).notNull(),
  sentFailed: int("sentFailed").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PushMessage = typeof pushMessages.$inferSelect;
export type InsertPushMessage = typeof pushMessages.$inferInsert;

// ── Seelenjournal ──

export const seelenjournalClients = mysqlTable("seelenjournal_clients", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  readingDate: timestamp("readingDate"),
  internalNote: text("internalNote"),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SeelenjournalClient = typeof seelenjournalClients.$inferSelect;
export type InsertSeelenjournalClient = typeof seelenjournalClients.$inferInsert;

export const seelenjournalEntries = mysqlTable("seelenjournal_entries", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content"),
  category: varchar("category", { length: 100 }),
  date: timestamp("date").defaultNow().notNull(),
  isPublished: int("isPublished").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
});
export type SeelenjournalEntry = typeof seelenjournalEntries.$inferSelect;
export type InsertSeelenjournalEntry = typeof seelenjournalEntries.$inferInsert;

export const seelenjournalAttachments = mysqlTable("seelenjournal_attachments", {
  id: int("id").autoincrement().primaryKey(),
  entryId: int("entryId").notNull(),
  filename: varchar("filename", { length: 500 }).notNull(),
  url: text("url").notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SeelenjournalAttachment = typeof seelenjournalAttachments.$inferSelect;
export type InsertSeelenjournalAttachment = typeof seelenjournalAttachments.$inferInsert;

export const seelenjournalMessages = mysqlTable("seelenjournal_messages", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  content: text("content").notNull(),
  fromAdmin: int("fromAdmin").default(0).notNull(),
  isRead: int("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SeelenjournalMessage = typeof seelenjournalMessages.$inferSelect;
export type InsertSeelenjournalMessage = typeof seelenjournalMessages.$inferInsert;

// ── Academy Waitlist ──

export const academyWaitlist = mysqlTable("academy_waitlist", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AcademyWaitlist = typeof academyWaitlist.$inferSelect;
export type InsertAcademyWaitlist = typeof academyWaitlist.$inferInsert;
