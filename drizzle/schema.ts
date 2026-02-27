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
