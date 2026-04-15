import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Meditationen-Tabelle: Speichert hochgeladene Meditationen (sichtbar für alle Community-Mitglieder)
export const meditations = pgTable("meditations", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  emoji: varchar("emoji", { length: 10 }).default("🧘‍♀️"),
  audioUrl: text("audioUrl").notNull(),
  isPremium: integer("isPremium").default(1).notNull(),
  isActive: integer("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Meditation = typeof meditations.$inferSelect;
export type InsertMeditation = typeof meditations.$inferInsert;

// Community-Nutzer-Tabelle: Speichert registrierte Community-Mitglieder
export const communityUsers = pgTable("community_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  mustChangePassword: integer("mustChangePassword").default(0).notNull(),
  isActive: integer("isActive").default(1).notNull(),
  emailConsent: integer("emailConsent").default(0).notNull(),
  emailConsentDate: timestamp("emailConsentDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CommunityUser = typeof communityUsers.$inferSelect;
export type InsertCommunityUser = typeof communityUsers.$inferInsert;

// ── Affiliate-System ──

// Affiliate-Codes: Jeder Nutzer bekommt einen einzigartigen Empfehlungscode
export const affiliateCodes = pgTable("affiliate_codes", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(), // Community-User E-Mail
  code: varchar("code", { length: 20 }).notNull().unique(),    // z.B. "SP-7X3K9"
  name: varchar("name", { length: 255 }).notNull(),            // Name des Affiliates
  isActive: integer("isActive").default(1).notNull(),
  totalClicks: integer("totalClicks").default(0).notNull(),
  totalSales: integer("totalSales").default(0).notNull(),
  totalEarnings: integer("totalEarnings").default(0).notNull(), // in Cent
  totalPaid: integer("totalPaid").default(0).notNull(),         // in Cent
  password: varchar("password", { length: 255 }),               // Passwort für Dashboard-Login
  paypalEmail: varchar("paypalEmail", { length: 320 }),         // für Auszahlung
  iban: varchar("iban", { length: 50 }),                        // alternativ IBAN
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AffiliateCode = typeof affiliateCodes.$inferSelect;
export type InsertAffiliateCode = typeof affiliateCodes.$inferInsert;

// Affiliate-Klicks: Jeder Klick auf einen Empfehlungslink
export const affiliateClicks = pgTable("affiliate_clicks", {
  id: serial("id").primaryKey(),
  affiliateCode: varchar("affiliateCode", { length: 20 }).notNull(),
  ipHash: varchar("ipHash", { length: 64 }),  // gehashte IP für Unique-Tracking
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AffiliateClick = typeof affiliateClicks.$inferSelect;

// Affiliate-Verkäufe: Jeder Verkauf, der über einen Empfehlungslink kam
export const affiliateSales = pgTable("affiliate_sales", {
  id: serial("id").primaryKey(),
  affiliateCode: varchar("affiliateCode", { length: 20 }).notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  saleAmount: integer("saleAmount").notNull(),         // Verkaufsbetrag in Cent
  commissionRate: integer("commissionRate").default(20).notNull(), // Prozent
  commissionAmount: integer("commissionAmount").notNull(), // Provision in Cent
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerName: varchar("customerName", { length: 255 }),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, confirmed, paid
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AffiliateSale = typeof affiliateSales.$inferSelect;
export type InsertAffiliateSale = typeof affiliateSales.$inferInsert;

// Affiliate-Auszahlungen: Auszahlungshistorie
export const affiliatePayouts = pgTable("affiliate_payouts", {
  id: serial("id").primaryKey(),
  affiliateCode: varchar("affiliateCode", { length: 20 }).notNull(),
  amount: integer("amount").notNull(),  // Betrag in Cent
  method: varchar("method", { length: 50 }).default("paypal").notNull(), // paypal, bank
  reference: varchar("reference", { length: 255 }), // Überweisungsreferenz
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AffiliatePayout = typeof affiliatePayouts.$inferSelect;
export type InsertAffiliatePayout = typeof affiliatePayouts.$inferInsert;

// ── Push-Benachrichtigungen ──

// Push-Tokens: Speichert Expo Push Tokens der App-Nutzerinnen
export const pushTokens = pgTable("push_tokens", {
  id: serial("id").primaryKey(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  platform: varchar("platform", { length: 20 }), // ios, android, web
  communityEmail: varchar("communityEmail", { length: 320 }), // optional: verknüpftes Community-Mitglied
  isActive: integer("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type PushToken = typeof pushTokens.$inferSelect;
export type InsertPushToken = typeof pushTokens.$inferInsert;

// Push-Nachrichten-Historie: Alle gesendeten Push-Nachrichten
export const pushMessages = pgTable("push_messages", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  data: text("data"), // JSON-String mit zusätzlichen Daten
  sentTo: integer("sentTo").default(0).notNull(), // Anzahl Empfänger
  sentSuccess: integer("sentSuccess").default(0).notNull(),
  sentFailed: integer("sentFailed").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PushMessage = typeof pushMessages.$inferSelect;
export type InsertPushMessage = typeof pushMessages.$inferInsert;

// ── Seelenjournal ──

// Seelenjournal-Klientinnen: Separate Nutzer für das private Seelenjournal
export const seelenjournalClients = pgTable("seelenjournal_clients", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  readingDate: timestamp("readingDate"),
  internalNote: text("internalNote"),
  isActive: integer("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SeelenjournalClient = typeof seelenjournalClients.$inferSelect;
export type InsertSeelenjournalClient = typeof seelenjournalClients.$inferInsert;

// Seelenjournal-Einträge: Journaleinträge pro Klientin
export const seelenjournalEntries = pgTable("seelenjournal_entries", {
  id: serial("id").primaryKey(),
  clientId: integer("clientId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content"),
  category: varchar("category", { length: 100 }),
  date: timestamp("date").defaultNow().notNull(),
  isPublished: integer("isPublished").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type SeelenjournalEntry = typeof seelenjournalEntries.$inferSelect;
export type InsertSeelenjournalEntry = typeof seelenjournalEntries.$inferInsert;

// Seelenjournal-Anhänge: PDFs und Bilder zu Einträgen
export const seelenjournalAttachments = pgTable("seelenjournal_attachments", {
  id: serial("id").primaryKey(),
  entryId: integer("entryId").notNull(),
  filename: varchar("filename", { length: 500 }).notNull(),
  url: text("url").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // "pdf" | "image"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SeelenjournalAttachment = typeof seelenjournalAttachments.$inferSelect;
export type InsertSeelenjournalAttachment = typeof seelenjournalAttachments.$inferInsert;

// Seelenjournal-Nachrichten: Chat zwischen Lara und Klientin
export const seelenjournalMessages = pgTable("seelenjournal_messages", {
  id: serial("id").primaryKey(),
  clientId: integer("clientId").notNull(),
  content: text("content").notNull(),
  fromAdmin: integer("fromAdmin").default(0).notNull(), // 1 = Lara, 0 = Klientin
  isRead: integer("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SeelenjournalMessage = typeof seelenjournalMessages.$inferSelect;
export type InsertSeelenjournalMessage = typeof seelenjournalMessages.$inferInsert;
