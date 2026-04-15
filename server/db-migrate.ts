/**
 * Auto-migration: Creates all required tables on startup if they don't exist.
 * Uses raw SQL so it works without drizzle-kit in production.
 * Includes retry logic for TLS/connection issues.
 */
import postgres from "postgres";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getSslConfig(dbUrl: string): any {
  // Render internal DBs (dpg-xxx-a) don't need SSL
  if (dbUrl.includes('.render.com') || dbUrl.match(/dpg-[a-z0-9]+-a/)) {
    console.log('[db-migrate] Render-internal DB detected, SSL disabled');
    return false;
  }
  return 'require';
}

async function connectWithRetry(dbUrl: string, attempt = 1): Promise<ReturnType<typeof postgres>> {
  try {
    const sslConfig = getSslConfig(dbUrl);
    const sql = postgres(dbUrl, { ssl: sslConfig, max: 1, connect_timeout: 30 });
    // Test the connection
    await sql`SELECT 1`;
    console.log(`[db-migrate] Connected to database (attempt ${attempt})`);
    return sql;
  } catch (err: any) {
    console.error(`[db-migrate] Connection attempt ${attempt}/${MAX_RETRIES} failed:`, err.message || err);
    if (attempt >= MAX_RETRIES) {
      throw new Error(`[db-migrate] Failed to connect after ${MAX_RETRIES} attempts: ${err.message}`);
    }
    console.log(`[db-migrate] Retrying in ${RETRY_DELAY_MS}ms...`);
    await sleep(RETRY_DELAY_MS);
    return connectWithRetry(dbUrl, attempt + 1);
  }
}

export async function runMigrations(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log("[db-migrate] No DATABASE_URL, skipping migrations");
    return;
  }

  console.log("[db-migrate] Starting migrations with retry logic...");
  const sql = await connectWithRetry(dbUrl);

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
        "emailConsent" INTEGER DEFAULT 0 NOT NULL,
        "emailConsentDate" TIMESTAMP,
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
        password VARCHAR(255),
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

    // push_tokens table
    await sql`
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

    // push_messages table
    await sql`
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

    // ── Seelenjournal-Tabellen ──

    // seelenjournal_clients
    await sql`
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

    // seelenjournal_entries
    await sql`
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

    // seelenjournal_attachments
    await sql`
      CREATE TABLE IF NOT EXISTS seelenjournal_attachments (
        id SERIAL PRIMARY KEY,
        "entryId" INTEGER NOT NULL,
        filename VARCHAR(500) NOT NULL,
        url TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    // seelenjournal_messages
    await sql`
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
  } catch (err: any) {
    console.error("[db-migrate] Migration error:", err.message || err);
    throw err;
  } finally {
    await sql.end();
  }
}
