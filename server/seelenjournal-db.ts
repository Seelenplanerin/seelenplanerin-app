/**
 * Seelenjournal – Datenbank-Funktionen
 * Verwendet EIGENE frische Verbindungen statt des shared Pools,
 * um Table-Lock-Probleme auf Render Free Tier zu vermeiden.
 */
import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  seelenjournalClients,
  seelenjournalEntries,
  seelenjournalAttachments,
  seelenjournalMessages,
  InsertSeelenjournalClient,
  InsertSeelenjournalEntry,
  InsertSeelenjournalAttachment,
  InsertSeelenjournalMessage,
} from "../drizzle/schema";

// Cache the working SSL mode so we don't have to test every time
let _workingSslMode: any = undefined;

/**
 * Create a fresh, short-lived DB connection for each operation.
 * Tries multiple SSL modes (no-ssl, ssl-require, ssl-no-verify) to find one that works.
 * Each connection is closed after the operation completes.
 */
async function withDb<T>(fn: (db: ReturnType<typeof drizzle>, rawSql: ReturnType<typeof postgres>) => Promise<T>): Promise<T> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL nicht gesetzt");
  
  const sslModes = _workingSslMode !== undefined 
    ? [_workingSslMode] 
    : [false, 'require', { rejectUnauthorized: false }];
  
  let lastError: any = null;
  for (const sslMode of sslModes) {
    const client = postgres(dbUrl, {
      ssl: sslMode,
      max: 1,
      connect_timeout: 8,
      idle_timeout: 5,
      max_lifetime: 30,
      connection: {
        statement_timeout: '15000',
        lock_timeout: '10000',
      },
    });
    
    const db = drizzle(client);
    try {
      // Wrap the operation with a timeout
      const timeout = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('DB operation timeout (20s)')), 20000)
      );
      const result = await Promise.race([fn(db, client), timeout]);
      // Cache the working SSL mode
      if (_workingSslMode === undefined) {
        _workingSslMode = sslMode;
        console.log(`[SJ-DB] Working SSL mode found: ${JSON.stringify(sslMode)}`);
      }
      return result;
    } catch (e: any) {
      lastError = e;
      console.warn(`[SJ-DB] SSL mode ${JSON.stringify(sslMode)} failed: ${e.message}`);
      // If cached mode fails, reset cache to try all modes next time
      if (_workingSslMode !== undefined) {
        _workingSslMode = undefined;
      }
    } finally {
      try { await client.end({ timeout: 3 }); } catch (e) { /* ignore */ }
    }
  }
  throw lastError || new Error("Alle DB-Verbindungsversuche fehlgeschlagen");
}

// ── Klientinnen ──

export async function getAllJournalClients() {
  return withDb(async (db) => {
    return db.select().from(seelenjournalClients).orderBy(desc(seelenjournalClients.createdAt));
  });
}

export async function getJournalClientByEmail(email: string) {
  return withDb(async (db) => {
    const result = await db.select().from(seelenjournalClients)
      .where(eq(seelenjournalClients.email, email.toLowerCase())).limit(1);
    return result.length > 0 ? result[0] : undefined;
  });
}

export async function getJournalClientById(id: number) {
  return withDb(async (db) => {
    const result = await db.select().from(seelenjournalClients)
      .where(eq(seelenjournalClients.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  });
}

export async function createJournalClient(data: {
  email: string; password: string; name: string;
  readingDate?: Date | null; internalNote?: string | null;
}) {
  console.log(`[SJ-DB] createJournalClient: ${data.email}`);
  return withDb(async (db) => {
    const result = await db.insert(seelenjournalClients).values({
      email: data.email.toLowerCase(),
      password: data.password,
      name: data.name,
      readingDate: data.readingDate || null,
      internalNote: data.internalNote || null,
    }).returning({ id: seelenjournalClients.id });
    console.log(`[SJ-DB] createJournalClient success: id=${result[0].id}`);
    return result[0].id;
  });
}

export async function updateJournalClient(id: number, data: Partial<{
  name: string; password: string; readingDate: Date | null;
  internalNote: string | null; isActive: number;
}>) {
  return withDb(async (db) => {
    await db.update(seelenjournalClients).set(data).where(eq(seelenjournalClients.id, id));
  });
}

export async function deleteJournalClient(id: number) {
  return withDb(async (db) => {
    // Lösche alle zugehörigen Daten
    const entries = await db.select({ id: seelenjournalEntries.id })
      .from(seelenjournalEntries).where(eq(seelenjournalEntries.clientId, id));
    for (const entry of entries) {
      await db.delete(seelenjournalAttachments).where(eq(seelenjournalAttachments.entryId, entry.id));
    }
    await db.delete(seelenjournalEntries).where(eq(seelenjournalEntries.clientId, id));
    await db.delete(seelenjournalMessages).where(eq(seelenjournalMessages.clientId, id));
    await db.delete(seelenjournalClients).where(eq(seelenjournalClients.id, id));
  });
}

// ── Journaleinträge ──

export async function getClientEntries(clientId: number, publishedOnly = false) {
  return withDb(async (db) => {
    if (publishedOnly) {
      return db.select().from(seelenjournalEntries)
        .where(and(eq(seelenjournalEntries.clientId, clientId), eq(seelenjournalEntries.isPublished, 1)))
        .orderBy(desc(seelenjournalEntries.date));
    }
    return db.select().from(seelenjournalEntries)
      .where(eq(seelenjournalEntries.clientId, clientId))
      .orderBy(desc(seelenjournalEntries.date));
  });
}

export async function getEntryById(entryId: number) {
  return withDb(async (db) => {
    const result = await db.select().from(seelenjournalEntries)
      .where(eq(seelenjournalEntries.id, entryId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  });
}

export async function createEntry(data: {
  clientId: number; title: string; content?: string | null;
  category?: string | null; date?: Date; isPublished?: number;
}) {
  return withDb(async (db) => {
    const result = await db.insert(seelenjournalEntries).values({
      clientId: data.clientId,
      title: data.title,
      content: data.content || null,
      category: data.category || null,
      date: data.date || new Date(),
      isPublished: data.isPublished ?? 0,
    }).returning({ id: seelenjournalEntries.id });
    return result[0].id;
  });
}

export async function updateEntry(entryId: number, data: Partial<{
  title: string; content: string | null; category: string | null;
  date: Date; isPublished: number;
}>) {
  return withDb(async (db) => {
    await db.update(seelenjournalEntries)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(seelenjournalEntries.id, entryId));
  });
}

export async function deleteEntry(entryId: number) {
  return withDb(async (db) => {
    await db.delete(seelenjournalAttachments).where(eq(seelenjournalAttachments.entryId, entryId));
    await db.delete(seelenjournalEntries).where(eq(seelenjournalEntries.id, entryId));
  });
}

// ── Anhänge ──

export async function getEntryAttachments(entryId: number) {
  return withDb(async (db) => {
    return db.select().from(seelenjournalAttachments)
      .where(eq(seelenjournalAttachments.entryId, entryId))
      .orderBy(desc(seelenjournalAttachments.createdAt));
  });
}

export async function createAttachment(data: {
  entryId: number; filename: string; url: string; type: string;
}) {
  return withDb(async (db) => {
    const result = await db.insert(seelenjournalAttachments).values(data)
      .returning({ id: seelenjournalAttachments.id });
    return result[0].id;
  });
}

export async function getAttachmentById(id: number) {
  return withDb(async (db) => {
    const rows = await db.select().from(seelenjournalAttachments)
      .where(eq(seelenjournalAttachments.id, id)).limit(1);
    return rows[0] || null;
  });
}

export async function deleteAttachment(id: number) {
  return withDb(async (db) => {
    await db.delete(seelenjournalAttachments).where(eq(seelenjournalAttachments.id, id));
  });
}

// ── Nachrichten ──

export async function getClientMessages(clientId: number) {
  return withDb(async (db) => {
    return db.select().from(seelenjournalMessages)
      .where(eq(seelenjournalMessages.clientId, clientId))
      .orderBy(seelenjournalMessages.createdAt);
  });
}

export async function createMessage(data: {
  clientId: number; content: string; fromAdmin: number;
}) {
  return withDb(async (db) => {
    const result = await db.insert(seelenjournalMessages).values({
      clientId: data.clientId,
      content: data.content,
      fromAdmin: data.fromAdmin,
    }).returning({ id: seelenjournalMessages.id });
    return result[0].id;
  });
}

export async function markMessagesAsRead(clientId: number, fromAdmin: number) {
  return withDb(async (db) => {
    await db.update(seelenjournalMessages)
      .set({ isRead: 1 })
      .where(and(
        eq(seelenjournalMessages.clientId, clientId),
        eq(seelenjournalMessages.fromAdmin, fromAdmin),
        eq(seelenjournalMessages.isRead, 0),
      ));
  });
}

export async function getUnreadMessageCount(clientId: number, fromAdmin: number) {
  return withDb(async (db) => {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(seelenjournalMessages)
      .where(and(
        eq(seelenjournalMessages.clientId, clientId),
        eq(seelenjournalMessages.fromAdmin, fromAdmin),
        eq(seelenjournalMessages.isRead, 0),
      ));
    return Number(result[0]?.count || 0);
  });
}

// Admin: Alle Klientinnen mit ungelesenen Nachrichten
export async function getClientsWithUnreadMessages() {
  return withDb(async (db) => {
    const result = await db.select({
      clientId: seelenjournalMessages.clientId,
      count: sql<number>`count(*)`,
    }).from(seelenjournalMessages)
      .where(and(
        eq(seelenjournalMessages.fromAdmin, 0),
        eq(seelenjournalMessages.isRead, 0),
      ))
      .groupBy(seelenjournalMessages.clientId);
    return result;
  });
}
