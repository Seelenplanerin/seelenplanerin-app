/**
 * Auto-migration: Creates all required tables on startup if they don't exist.
 * Uses raw SQL so it works without drizzle-kit in production.
 */
import postgres from "postgres";

export async function runMigrations(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log("[db-migrate] No DATABASE_URL, skipping migrations");
    return;
  }

  const sql = postgres(dbUrl, { ssl: "require", max: 1 });

  try {
    // Create role enum if not exists
    await sql`
      DO $$ BEGIN
        CREATE TYPE role AS ENUM ('user', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // users table
    await sql`
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

    // meditations table
    await sql`
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

    // community_users table
    await sql`
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

    // affiliate_codes table
    await sql`
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

    // affiliate_clicks table
    await sql`
      CREATE TABLE IF NOT EXISTS affiliate_clicks (
        id SERIAL PRIMARY KEY,
        "affiliateCode" VARCHAR(20) NOT NULL,
        "ipHash" VARCHAR(64),
        "userAgent" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    // affiliate_sales table
    await sql`
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

    // affiliate_payouts table
    await sql`
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

    // academy_waitlist table
    await sql`
      CREATE TABLE IF NOT EXISTS academy_waitlist (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log("[db-migrate] All tables created/verified (incl. affiliate + academy)");
  } finally {
    await sql.end();
  }
}
