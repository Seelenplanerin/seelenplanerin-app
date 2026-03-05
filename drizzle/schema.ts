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
