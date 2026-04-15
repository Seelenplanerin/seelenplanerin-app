/**
 * Seelenjournal – Express REST API Routen
 * Separates JWT-System, unabhängig von Community-Login
 */
import { Router, Request, Response, NextFunction } from "express";
import { createHash, randomBytes } from "crypto";
import { v2 as cloudinary } from "cloudinary";


// Cloudinary konfigurieren
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

async function uploadFile(fileKey: string, buffer: Buffer, mimetype: string): Promise<string> {
  // Upload zu Cloudinary
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary nicht konfiguriert. Bitte CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY und CLOUDINARY_API_SECRET setzen.");
  }

  return new Promise((resolve, reject) => {
    const resourceType = mimetype.startsWith("image/") ? "image" as const : "raw" as const;
    // public_id OHNE Dateiendung - die Download-Proxy-Route setzt den Content-Type korrekt
    const baseName = fileKey.replace(/\.[^.]+$/, "").replace(/[\/\s]/g, "_");
    const publicId = baseName;
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "seelenjournal",
        public_id: publicId,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          console.error("[Seelenjournal] Cloudinary Upload Fehler:", error.message);
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Kein Ergebnis von Cloudinary"));
        }
      }
    );
    uploadStream.end(buffer);
  });
}
import multer from "multer";
import * as sjDb from "./seelenjournal-db";
import { sendSeelenjournalMessageNotification, sendSeelenjournalEntryNotification } from "./email";

const router = Router();

// ── JWT-Hilfsfunktionen (einfaches HMAC-basiertes Token) ──

const SJ_SECRET = process.env.SEELENJOURNAL_JWT_SECRET || "seelenjournal-default-secret-change-me";
const SJ_ADMIN_EMAIL = process.env.SEELENJOURNAL_ADMIN_EMAIL || "lara@die-seelenplanerin.de";
const SJ_ADMIN_PASSWORD = process.env.SEELENJOURNAL_ADMIN_PASSWORD || "SeelenAdmin2026!";

function createToken(payload: Record<string, any>, expiresInHours = 168): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const body = Buffer.from(JSON.stringify({ ...payload, iat: now, exp: now + expiresInHours * 3600 })).toString("base64url");
  const signature = createHash("sha256").update(`${header}.${body}.${SJ_SECRET}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = createHash("sha256").update(`${header}.${body}.${SJ_SECRET}`).digest("base64url");
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// ── Middleware ──

function authClient(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) { res.status(401).json({ error: "Nicht autorisiert" }); return; }
  const payload = verifyToken(auth.slice(7));
  if (!payload || payload.role !== "client") { res.status(401).json({ error: "Ungültiges Token" }); return; }
  (req as any).sjClientId = payload.clientId;
  next();
}

function authAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) { res.status(401).json({ error: "Nicht autorisiert" }); return; }
  const payload = verifyToken(auth.slice(7));
  if (!payload || payload.role !== "admin") { res.status(401).json({ error: "Kein Admin-Zugang" }); return; }
  next();
}

// File upload (max 10 MB)
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

// ══════════════════════════════════════════════════════════════
// KLIENTINNEN-ROUTEN
// ══════════════════════════════════════════════════════════════

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ error: "E-Mail und Passwort erforderlich" }); return; }
    const client = await sjDb.getJournalClientByEmail(email);
    if (!client) { res.status(401).json({ error: "Kein Zugang gefunden. Bitte wende dich an die Seelenplanerin." }); return; }
    if (Number(client.isActive) !== 1) { res.status(401).json({ error: "Zugang deaktiviert." }); return; }
    if (client.password !== password) { res.status(401).json({ error: "Falsches Passwort." }); return; }
    const token = createToken({ role: "client", clientId: client.id, email: client.email });
    res.json({ success: true, token, client: { id: client.id, name: client.name, email: client.email } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Profil
router.get("/me", authClient, async (req: Request, res: Response) => {
  try {
    const client = await sjDb.getJournalClientById((req as any).sjClientId);
    if (!client) { res.status(404).json({ error: "Nicht gefunden" }); return; }
    res.json({ id: client.id, name: client.name, email: client.email, readingDate: client.readingDate });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Eigene Einträge (nur veröffentlichte)
router.get("/entries", authClient, async (req: Request, res: Response) => {
  try {
    const entries = await sjDb.getClientEntries((req as any).sjClientId, true);
    // Für jeden Eintrag die Anhänge laden
    const entriesWithAttachments = await Promise.all(entries.map(async (entry) => {
      const attachments = await sjDb.getEntryAttachments(entry.id);
      return { ...entry, attachments };
    }));
    res.json(entriesWithAttachments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Einzelner Eintrag
router.get("/entries/:id", authClient, async (req: Request, res: Response) => {
  try {
    const entry = await sjDb.getEntryById(parseInt(req.params.id));
    if (!entry || entry.clientId !== (req as any).sjClientId || entry.isPublished !== 1) {
      res.status(404).json({ error: "Eintrag nicht gefunden" }); return;
    }
    const attachments = await sjDb.getEntryAttachments(entry.id);
    res.json({ ...entry, attachments });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Nachrichten lesen
router.get("/messages", authClient, async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).sjClientId;
    const messages = await sjDb.getClientMessages(clientId);
    // Nachrichten von Admin als gelesen markieren
    await sjDb.markMessagesAsRead(clientId, 1);
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Nachricht senden (Klientin → Lara)
router.post("/messages", authClient, async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) { res.status(400).json({ error: "Nachricht darf nicht leer sein" }); return; }
    const id = await sjDb.createMessage({
      clientId: (req as any).sjClientId,
      content: content.trim(),
      fromAdmin: 0,
    });
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Ungelesene Nachrichten zählen
router.get("/unread-count", authClient, async (req: Request, res: Response) => {
  try {
    const count = await sjDb.getUnreadMessageCount((req as any).sjClientId, 1);
    res.json({ count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════
// ADMIN-ROUTEN
// ══════════════════════════════════════════════════════════════

// Admin-Login
router.post("/admin/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (email === SJ_ADMIN_EMAIL && password === SJ_ADMIN_PASSWORD) {
      const token = createToken({ role: "admin", email });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: "Ungültige Admin-Zugangsdaten" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Alle Klientinnen
router.get("/admin/clients", authAdmin, async (_req: Request, res: Response) => {
  try {
    const clients = await sjDb.getAllJournalClients();
    const unreadMap = await sjDb.getClientsWithUnreadMessages();
    const clientsWithUnread = clients.map(c => ({
      ...c,
      unreadMessages: Number(unreadMap.find((u: any) => u.clientId === c.id)?.count || 0),
    }));
    res.json(clientsWithUnread);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Klientin anlegen
router.post("/admin/clients", authAdmin, async (req: Request, res: Response) => {
  try {
    const { email, password, name, readingDate, internalNote } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: "E-Mail, Passwort und Name sind erforderlich" }); return;
    }
    const existing = await sjDb.getJournalClientByEmail(email);
    if (existing) { res.status(400).json({ error: "E-Mail bereits vorhanden" }); return; }
    const id = await sjDb.createJournalClient({
      email, password, name,
      readingDate: readingDate ? new Date(readingDate) : null,
      internalNote: internalNote || null,
    });
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Klientin bearbeiten
router.put("/admin/clients/:id", authAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, password, readingDate, internalNote, isActive } = req.body;
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (password !== undefined) updateData.password = password;
    if (readingDate !== undefined) updateData.readingDate = readingDate ? new Date(readingDate) : null;
    if (internalNote !== undefined) updateData.internalNote = internalNote;
    if (isActive !== undefined) updateData.isActive = isActive;
    await sjDb.updateJournalClient(id, updateData);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Klientin löschen
router.delete("/admin/clients/:id", authAdmin, async (req: Request, res: Response) => {
  try {
    await sjDb.deleteJournalClient(parseInt(req.params.id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Einträge einer Klientin (Admin sieht alle, auch Entwürfe)
router.get("/admin/clients/:id/entries", authAdmin, async (req: Request, res: Response) => {
  try {
    const entries = await sjDb.getClientEntries(parseInt(req.params.id), false);
    const entriesWithAttachments = await Promise.all(entries.map(async (entry) => {
      const attachments = await sjDb.getEntryAttachments(entry.id);
      return { ...entry, attachments };
    }));
    res.json(entriesWithAttachments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Eintrag erstellen
router.post("/admin/clients/:id/entries", authAdmin, async (req: Request, res: Response) => {
  try {
    const clientId = parseInt(req.params.id);
    const { title, content, category, date, isPublished } = req.body;
    if (!title) { res.status(400).json({ error: "Titel ist erforderlich" }); return; }
    const id = await sjDb.createEntry({
      clientId, title, content: content || null,
      category: category || null,
      date: date ? new Date(date) : new Date(),
      isPublished: isPublished ?? 0,
    });

    // E-Mail-Benachrichtigung an Klientin senden wenn veröffentlicht
    if (Number(isPublished) === 1) {
      const client = await sjDb.getJournalClientById(clientId);
      if (client?.email) {
        sendSeelenjournalEntryNotification({
          toEmail: client.email,
          toName: client.name,
          entryTitle: title,
          entryCategory: category || undefined,
        }).catch(err => console.error("[Seelenjournal] Eintrag-E-Mail Fehler:", err));
      }
    }

    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Eintrag bearbeiten
router.put("/admin/entries/:entryId", authAdmin, async (req: Request, res: Response) => {
  try {
    const entryId = parseInt(req.params.entryId);
    const { title, content, category, date, isPublished } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (date !== undefined) updateData.date = new Date(date);
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    
    console.log(`[Seelenjournal] PUT /admin/entries/${entryId} - updateData:`, JSON.stringify(updateData));
    await sjDb.updateEntry(entryId, updateData);

    // E-Mail-Benachrichtigung wenn Eintrag veröffentlicht wird
    if (Number(isPublished) === 1) {
      console.log(`[Seelenjournal] Eintrag ${entryId} wird veröffentlicht - E-Mail wird gesendet...`);
      const entry = await sjDb.getEntryById(entryId);
      if (entry) {
        const client = await sjDb.getJournalClientById(entry.clientId);
        console.log(`[Seelenjournal] Client gefunden: ${client?.name} (${client?.email})`);
        if (client?.email) {
          try {
            const emailResult = await sendSeelenjournalEntryNotification({
              toEmail: client.email,
              toName: client.name,
              entryTitle: entry.title,
              entryCategory: entry.category || undefined,
            });
            console.log(`[Seelenjournal] E-Mail-Ergebnis:`, JSON.stringify(emailResult));
          } catch (emailErr) {
            console.error("[Seelenjournal] Eintrag-E-Mail Fehler:", emailErr);
          }
        } else {
          console.log(`[Seelenjournal] Keine E-Mail-Adresse für Client ${entry.clientId}`);
        }
      } else {
        console.log(`[Seelenjournal] Eintrag ${entryId} nicht in DB gefunden nach Update`);
      }
    }

    console.log(`[Seelenjournal] PUT /admin/entries/${entryId} - Erfolg`);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Eintrag löschen
router.delete("/admin/entries/:entryId", authAdmin, async (req: Request, res: Response) => {
  try {
    await sjDb.deleteEntry(parseInt(req.params.entryId));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Dateien hochladen (PDF oder Bild) – unterstützt Einzel- und Multi-Upload (max 20 Dateien)
router.post("/admin/upload", authAdmin, upload.array("file", 20), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    const entryId = parseInt(req.body.entryId);
    if (!files || files.length === 0 || !entryId) {
      res.status(400).json({ error: "Mindestens eine Datei und entryId erforderlich" }); return;
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    const results: any[] = [];
    const errors: string[] = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`${file.originalname}: Typ nicht erlaubt (${file.mimetype})`);
        continue;
      }
      try {
        const randomSuffix = Math.random().toString(36).slice(2, 8);
        const safeName = (file.originalname || "file").replace(/[^a-zA-Z0-9._-]/g, "_");
        // Endung ans Ende setzen damit Cloudinary den korrekten Content-Type liefert
        const extMatch = safeName.match(/\.[^.]+$/);
        const ext = extMatch ? extMatch[0] : "";
        const nameWithoutExt = ext ? safeName.slice(0, -ext.length) : safeName;
        const fileKey = `seelenjournal/${entryId}/${nameWithoutExt}-${randomSuffix}${ext}`;
        const fileUrl = await uploadFile(fileKey, file.buffer, file.mimetype);

        const type = file.mimetype === "application/pdf" ? "pdf" : "image";
        const attachmentId = await sjDb.createAttachment({
          entryId, filename: file.originalname || safeName, url: fileUrl, type,
        });
        results.push({ id: attachmentId, url: fileUrl, type, filename: file.originalname });
      } catch (fileErr: any) {
        errors.push(`${file.originalname}: ${fileErr.message}`);
      }
    }

    res.json({ success: true, uploaded: results.length, total: files.length, files: results, errors });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Download-Proxy: Cloudinary-Dateien mit korrektem Content-Type ausliefern
router.get("/download/:id", async (req: Request, res: Response) => {
  try {
    const attachment = await sjDb.getAttachmentById(parseInt(req.params.id));
    if (!attachment) { res.status(404).json({ error: "Anhang nicht gefunden" }); return; }

    // Content-Type basierend auf Dateityp setzen
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      image: "image/jpeg",
    };
    const contentType = mimeTypes[attachment.type] || "application/octet-stream";
    
    // Datei von Cloudinary holen
    const response = await fetch(attachment.url);
    if (!response.ok) { res.status(502).json({ error: "Datei konnte nicht geladen werden" }); return; }

    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `inline; filename="${attachment.filename}"`);
    res.setHeader("Content-Length", buffer.length.toString());
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Anhang löschen
router.delete("/admin/attachments/:id", authAdmin, async (req: Request, res: Response) => {
  try {
    await sjDb.deleteAttachment(parseInt(req.params.id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Nachrichten einer Klientin (Admin)
router.get("/admin/clients/:id/messages", authAdmin, async (req: Request, res: Response) => {
  try {
    const clientId = parseInt(req.params.id);
    const messages = await sjDb.getClientMessages(clientId);
    // Nachrichten von Klientin als gelesen markieren
    await sjDb.markMessagesAsRead(clientId, 0);
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Nachricht senden (Admin → Klientin)
router.post("/admin/clients/:id/messages", authAdmin, async (req: Request, res: Response) => {
  try {
    const clientId = parseInt(req.params.id);
    const { content } = req.body;
    if (!content?.trim()) { res.status(400).json({ error: "Nachricht darf nicht leer sein" }); return; }
    const id = await sjDb.createMessage({
      clientId, content: content.trim(), fromAdmin: 1,
    });

    // E-Mail-Benachrichtigung an Klientin senden (async, nicht blockierend)
    const client = await sjDb.getJournalClientById(clientId);
    if (client?.email) {
      sendSeelenjournalMessageNotification({
        toEmail: client.email,
        toName: client.name,
        messagePreview: content.trim(),
      }).catch(err => console.error("[Seelenjournal] E-Mail-Benachrichtigung Fehler:", err));
    }

    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Dateien werden jetzt über Cloudinary ausgeliefert (permanente URLs)

export default router;
