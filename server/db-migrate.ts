/**
 * Auto-migration: Creates all required tables on startup if they don't exist.
 * Uses raw SQL so it works without drizzle-kit in production.
 * MySQL/TiDB compatible.
 */
import mysql from "mysql2/promise";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function connectWithRetry(dbUrl: string, attempt = 1): Promise<mysql.Connection> {
  try {
    const conn = await mysql.createConnection({
      uri: dbUrl,
      ssl: { rejectUnauthorized: true },
      connectTimeout: 30000,
    });
    await conn.query("SELECT 1");
    console.log(`[db-migrate] Connected to MySQL database (attempt ${attempt})`);
    return conn;
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

  console.log("[db-migrate] Starting MySQL migrations with retry logic...");
  const conn = await connectWithRetry(dbUrl);

  try {
    // users table
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

    // meditations table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS meditations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        emoji VARCHAR(10) DEFAULT '🧘',
        audioUrl TEXT NOT NULL,
        isPremium INT DEFAULT 1 NOT NULL,
        isActive INT DEFAULT 1 NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);

    // community_users table
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

    // affiliate_codes table
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

    // affiliate_clicks table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS affiliate_clicks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        affiliateCode VARCHAR(20) NOT NULL,
        ipHash VARCHAR(64),
        userAgent TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);

    // affiliate_sales table
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

    // affiliate_payouts table
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

    // academy_waitlist table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS academy_waitlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);

    // push_tokens table
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

    // push_messages table
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

    // seelenjournal_clients
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

    // seelenjournal_entries
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

    // seelenjournal_attachments
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

    // seelenjournal_messages
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
  } catch (err: any) {
    console.error("[db-migrate] Migration error:", err.message || err);
    throw err;
  } finally {
    await conn.end();
  }
}
