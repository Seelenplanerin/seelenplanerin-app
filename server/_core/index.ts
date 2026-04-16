import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import multer from "multer";
import { storagePut } from "../storage";
import { runMigrations } from "../db-migrate";
import seelenjournalRoutes from "../seelenjournal-routes";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

// Resolve the web dist path correctly in both dev and production:
// web-dist/ contains the Expo web export (static HTML/CSS/JS)
// dist/ contains the server bundle (index.js from esbuild)
// This separation prevents esbuild from interfering with the web build.
function getWebDistPath(): string {
  // Primary: web-dist folder (separated from server dist)
  const cwdWebDist = path.join(process.cwd(), "web-dist");
  if (fs.existsSync(cwdWebDist)) return cwdWebDist;
  // Fallback: dist folder (contains both server bundle + web export in Docker)
  const cwdDist = path.join(process.cwd(), "dist");
  if (fs.existsSync(path.join(cwdDist, "index.html"))) return cwdDist;
  // Last resort: check relative to __dirname
  const dirDist = path.join(__dirname, "..", "web-dist");
  if (fs.existsSync(dirDist)) return dirDist;
  return cwdDist;
}

async function startServer() {
  // Auto-migrate database on startup (non-blocking with background retry)
  (async () => {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await runMigrations();
        console.log("[db] Migrations completed successfully");
        return;
      } catch (err: any) {
        console.error(`[db] Migration attempt ${attempt}/3 failed:`, err.message || err);
        if (attempt < 3) {
          console.log(`[db] Retrying migration in 10 seconds...`);
          await new Promise(r => setTimeout(r, 10000));
        } else {
          console.error("[db] All migration attempts failed. Use /api/run-migrations to retry manually.");
        }
      }
    }
  })();

  const app = express();
  const server = createServer(app);

  // Enable CORS for all routes - reflect the request origin to support credentials
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests
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

  // Redirect /api/ to /api/app/ so the published domain root works
  app.get("/api", (_req, res) => {
    res.redirect("/api/app/");
  });
  app.get("/api/", (_req, res) => {
    res.redirect("/api/app/");
  });

  const webDistPath = getWebDistPath();
  console.log(`[api] Web dist path: ${webDistPath} (exists: ${fs.existsSync(webDistPath)})`);

  // Serve the web app under /api/app/* so the published domain (which only proxies /api/*) can serve the full app
  if (fs.existsSync(webDistPath)) {
    // CRITICAL: Also serve static assets under /api/_expo and /api/assets
    // because the Expo-generated HTML uses absolute paths like /_expo/... and /assets/...
    // and the published domain only proxies /api/* requests
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

    // Serve static assets under /api/app/_expo, /api/app/assets etc.
    app.use("/api/app", express.static(webDistPath));
    // Root /api/app serves index.html
    app.get("/api/app", (_req, res) => {
      res.sendFile(path.join(webDistPath, "index.html"));
    });
    // Catch-all: serve index.html for all /api/app/* routes (SPA routing)
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

  // Audio-Proxy-Route: Streamt externe Audio-Dateien mit CORS-Headern
  // Lösung für iOS Safari CORS-Problem bei externen Audio-URLs
  app.get("/api/audio-proxy", async (req, res) => {
    const url = req.query.url as string;
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

  // Multipart-Upload-Route für große Dateien (bis 200 MB)
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
    } catch (err: any) {
      console.error("Upload error:", err);
      res.status(500).json({ success: false, error: err.message || "Upload fehlgeschlagen" });
    }
  });

  // Affiliate Referral-Link: /ref/:code -> trackt Klick und leitet weiter
  app.get("/ref/:code", async (req, res) => {
    const code = (req.params.code || "").toUpperCase();
    try {
      // Klick tracken via DB
      const { createHash } = await import("crypto");
      const ip = req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "";
      const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);
      const ua = req.headers["user-agent"] || "";
      
      // Import db functions
      const dbMod = await import("../db");
      const affiliate = await dbMod.getAffiliateByCode(code);
      if (affiliate) {
        await dbMod.recordAffiliateClick(code, ipHash, ua);
      }
    } catch (e) {
      console.error("[Affiliate] Click tracking error:", e);
    }
    // Weiterleitung zur Hauptseite mit ref-Parameter (für Cookie-Tracking im Frontend)
    res.redirect(`/?ref=${code}`);
  });

  // API-Endpunkt: Affiliate-Code validieren (für Frontend-Cookie)
  app.get("/api/affiliate/validate/:code", async (req, res) => {
    const code = (req.params.code || "").toUpperCase();
    try {
      const dbMod = await import("../db");
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

  // Manueller Migrations-Endpunkt (für den Fall dass die Auto-Migration beim Start fehlschlägt)
  app.get("/api/run-migrations", async (_req, res) => {
    try {
      console.log("[api] Manual migration triggered via /api/run-migrations");
      await runMigrations();
      res.json({ success: true, message: "Migrations completed successfully" });
    } catch (err: any) {
      console.error("[api] Manual migration failed:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // E-Mail-Test-Endpunkt (zum Debuggen der SMTP-Konfiguration)
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
      
      // Versuche eine Test-E-Mail zu senden
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: parseInt(smtpPort) === 465,
        auth: { user: smtpUser, pass: process.env.SMTP_PASS },
      });
      
      // Nur Verbindung testen, keine E-Mail senden
      await transporter.verify();
      console.log(`[test-email] SMTP-Verbindung erfolgreich!`);
      
      res.json({
        success: true,
        message: "SMTP-Verbindung erfolgreich",
        config: { host: smtpHost, user: smtpUser, pass: smtpPass, port: smtpPort, fromName: smtpFromName }
      });
    } catch (err: any) {
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

  // DB-Reset-Endpunkt: Setzt die Datenbankverbindung zurück (bei hängenden Queries)
  app.get("/api/db-reset", async (_req, res) => {
    try {
      console.log("[api] DB connection reset triggered");
      const { resetDb } = await import("../db");
      resetDb();
      // Teste die neue Verbindung
      const { getDb } = await import("../db");
      const db = await getDb();
      if (db) {
        res.json({ success: true, message: "DB-Verbindung zurückgesetzt und neu verbunden" });
      } else {
        res.json({ success: false, message: "DB-Verbindung zurückgesetzt, aber Neuverbindung fehlgeschlagen" });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // DB-Diagnose: Testet DB-Verbindung mit verschiedenen SSL-Modi
  app.get("/api/db-diagnose", async (_req, res) => {
    const results: any = { timestamp: new Date().toISOString() };
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) { res.json({ success: false, error: "DATABASE_URL nicht gesetzt" }); return; }
    
    // Mask the URL for logging
    results.db_url_masked = dbUrl.replace(/:[^:@]+@/, ':***@').substring(0, 80);
    results.is_render_internal = !!(dbUrl.includes('.render.com') || dbUrl.match(/dpg-[a-z0-9]+-a/));
    
    const pgModule = await import("postgres");
    const postgres = pgModule.default;
    
    // Try both SSL modes with aggressive timeout
    for (const sslMode of [false, 'require', { rejectUnauthorized: false }] as any[]) {
      const label = sslMode === false ? 'no-ssl' : (sslMode === 'require' ? 'ssl-require' : 'ssl-no-verify');
      try {
        const testSql = postgres(dbUrl, { ssl: sslMode, max: 1, connect_timeout: 5, idle_timeout: 3 });
        const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT 8s')), 8000));
        const query = testSql`SELECT 1 as test, now() as server_time, current_database() as db_name`.then(async (r: any) => {
          await testSql.end({ timeout: 3 });
          return r;
        });
        const r = await Promise.race([query, timeout]) as any;
        results[label] = { ok: true, time: r[0]?.server_time, db: r[0]?.db_name };
        // If this mode works, also check tables
        try {
          const testSql2 = postgres(dbUrl, { ssl: sslMode, max: 1, connect_timeout: 5 });
          const timeout2 = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 5000));
          const tables = await Promise.race([
            testSql2`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'seelenjournal%'`.then(async (r: any) => { await testSql2.end({ timeout: 3 }); return r; }),
            timeout2
          ]) as any;
          results.sj_tables = tables.map((t: any) => t.table_name);
        } catch (e: any) {
          results.sj_tables_error = e.message;
        }
        break; // Found working mode
      } catch (e: any) {
        results[label] = { ok: false, error: e.message };
      }
    }
    
    results.success = true;
    res.json(results);
  });

  // Kill stuck DB transactions - tries multiple SSL modes
  app.get("/api/db-kill-stuck", async (_req, res) => {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) { res.json({ success: false, error: "DATABASE_URL nicht gesetzt" }); return; }
    
    const pgModule = await import("postgres");
    const postgres = pgModule.default;
    
    // Try each SSL mode until one works
    for (const sslMode of [false, 'require', { rejectUnauthorized: false }] as any[]) {
      try {
        const sql = postgres(dbUrl, { ssl: sslMode, max: 1, connect_timeout: 5 });
        const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT 8s')), 8000));
        
        const doWork = async () => {
          // Kill all non-idle and idle-in-transaction connections
          const stuck = await sql`
            SELECT pid, state, query FROM pg_stat_activity 
            WHERE pid != pg_backend_pid() AND (state != 'idle' OR state = 'idle in transaction')
          `;
          const killed: number[] = [];
          for (const q of stuck) {
            try { await sql`SELECT pg_terminate_backend(${q.pid})`; killed.push(q.pid); } catch (e) {}
          }
          await sql.end({ timeout: 3 });
          return { killed, stuck_count: stuck.length };
        };
        
        const result = await Promise.race([doWork(), timeout]) as any;
        const { resetDb } = await import("../db");
        resetDb();
        res.json({ success: true, ssl_mode: String(sslMode), ...result, message: `${result.killed.length} Verbindungen beendet` });
        return;
      } catch (e: any) {
        continue; // Try next SSL mode
      }
    }
    res.status(500).json({ success: false, error: "Keine DB-Verbindung m\u00f6glich (alle SSL-Modi fehlgeschlagen)" });
  });

  // Seelenjournal REST API (separates JWT-System)
  app.use("/api/seelenjournal", seelenjournalRoutes);

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // Serve public assets (PWA manifest, icons, apple-touch-icon)
  const publicPath = path.join(__dirname, "..", "..", "public");
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
  }

  // Serve static web build (Expo export) - root level routes
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
