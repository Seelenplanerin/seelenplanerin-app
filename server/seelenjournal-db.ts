/**
 * Seelenjournal – Datenbank-Funktionen
 * Verwendet MySQL (TiDB Cloud) mit mysql2 und drizzle-orm.
 */
import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
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

let _pool: mysql.Pool | null = null;
let _db: any = null;

function getPool(): mysql.Pool {
  if (!_pool) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error("DATABASE_URL nicht gesetzt");
    _pool = mysql.createPool({
      uri: dbUrl,
      waitForConnections: true,
      connectionLimit: 3,
      queueLimit: 0,
      connectTimeout: 10000,
      ssl: { rejectUnauthorized: true },
    });
  }
  return _pool;
}

function getDb() {
  if (!_db) {
    _db = drizzle(getPool());
  }
  return _db!;
}

// ── Klientinnen ──

export async function getAllJournalClients() {
  const db = getDb();
  return db.select().from(seelenjournalClients).orderBy(desc(seelenjournalClients.createdAt));
}

export async function getJournalClientByEmail(email: string) {
  const db = getDb();
  const result = await db.select().from(seelenjournalClients)
    .where(eq(seelenjournalClients.email, email.toLowerCase())).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getJournalClientById(id: number) {
  const db = getDb();
  const result = await db.select().from(seelenjournalClients)
    .where(eq(seelenjournalClients.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createJournalClient(data: {
  email: string; password: string; name: string;
  readingDate?: Date | null; internalNote?: string | null;
}) {
  console.log(`[SJ-DB] createJournalClient: ${data.email}`);
  const db = getDb();
  const result = await db.insert(seelenjournalClients).values({
    email: data.email.toLowerCase(),
    password: data.password,
    name: data.name,
    readingDate: data.readingDate || null,
    internalNote: data.internalNote || null,
  });
  const id = Number(result[0].insertId);
  console.log(`[SJ-DB] createJournalClient success: id=${id}`);
  return id;
}

export async function updateJournalClient(id: number, data: Partial<{
  name: string; password: string; readingDate: Date | null;
  internalNote: string | null; isActive: number;
}>) {
  const db = getDb();
  await db.update(seelenjournalClients).set(data).where(eq(seelenjournalClients.id, id));
}

export async function deleteJournalClient(id: number) {
  const db = getDb();
  // Lösche alle zugehörigen Daten
  const entries = await db.select({ id: seelenjournalEntries.id })
    .from(seelenjournalEntries).where(eq(seelenjournalEntries.clientId, id));
  for (const entry of entries) {
    await db.delete(seelenjournalAttachments).where(eq(seelenjournalAttachments.entryId, entry.id));
  }
  await db.delete(seelenjournalEntries).where(eq(seelenjournalEntries.clientId, id));
  await db.delete(seelenjournalMessages).where(eq(seelenjournalMessages.clientId, id));
  await db.delete(seelenjournalClients).where(eq(seelenjournalClients.id, id));
}

// ── Journaleinträge ──

export async function getClientEntries(clientId: number, publishedOnly = false) {
  const db = getDb();
  if (publishedOnly) {
    return db.select().from(seelenjournalEntries)
      .where(and(eq(seelenjournalEntries.clientId, clientId), eq(seelenjournalEntries.isPublished, 1)))
      .orderBy(desc(seelenjournalEntries.date));
  }
  return db.select().from(seelenjournalEntries)
    .where(eq(seelenjournalEntries.clientId, clientId))
    .orderBy(desc(seelenjournalEntries.date));
}

export async function getEntryById(entryId: number) {
  const db = getDb();
  const result = await db.select().from(seelenjournalEntries)
    .where(eq(seelenjournalEntries.id, entryId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createEntry(data: {
  clientId: number; title: string; content?: string | null;
  category?: string | null; date?: Date; isPublished?: number;
}) {
  const db = getDb();
  const result = await db.insert(seelenjournalEntries).values({
    clientId: data.clientId,
    title: data.title,
    content: data.content || null,
    category: data.category || null,
    date: data.date || new Date(),
    isPublished: data.isPublished ?? 0,
  });
  return Number(result[0].insertId);
}

export async function updateEntry(entryId: number, data: Partial<{
  title: string; content: string | null; category: string | null;
  date: Date; isPublished: number;
}>) {
  const db = getDb();
  await db.update(seelenjournalEntries)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(seelenjournalEntries.id, entryId));
}

export async function deleteEntry(entryId: number) {
  const db = getDb();
  await db.delete(seelenjournalAttachments).where(eq(seelenjournalAttachments.entryId, entryId));
  await db.delete(seelenjournalEntries).where(eq(seelenjournalEntries.id, entryId));
}

// ── Anhänge ──

export async function getEntryAttachments(entryId: number) {
  const db = getDb();
  return db.select().from(seelenjournalAttachments)
    .where(eq(seelenjournalAttachments.entryId, entryId))
    .orderBy(desc(seelenjournalAttachments.createdAt));
}

export async function createAttachment(data: {
  entryId: number; filename: string; url: string; type: string;
}) {
  const db = getDb();
  const result = await db.insert(seelenjournalAttachments).values(data);
  return Number(result[0].insertId);
}

export async function getAttachmentById(id: number) {
  const db = getDb();
  const rows = await db.select().from(seelenjournalAttachments)
    .where(eq(seelenjournalAttachments.id, id)).limit(1);
  return rows[0] || null;
}

export async function deleteAttachment(id: number) {
  const db = getDb();
  await db.delete(seelenjournalAttachments).where(eq(seelenjournalAttachments.id, id));
}

// ── Nachrichten ──

export async function getClientMessages(clientId: number) {
  const db = getDb();
  return db.select().from(seelenjournalMessages)
    .where(eq(seelenjournalMessages.clientId, clientId))
    .orderBy(seelenjournalMessages.createdAt);
}

export async function createMessage(data: {
  clientId: number; content: string; fromAdmin: number;
}) {
  const db = getDb();
  const result = await db.insert(seelenjournalMessages).values({
    clientId: data.clientId,
    content: data.content,
    fromAdmin: data.fromAdmin,
  });
  return Number(result[0].insertId);
}

export async function markMessagesAsRead(clientId: number, fromAdmin: number) {
  const db = getDb();
  await db.update(seelenjournalMessages)
    .set({ isRead: 1 })
    .where(and(
      eq(seelenjournalMessages.clientId, clientId),
      eq(seelenjournalMessages.fromAdmin, fromAdmin),
      eq(seelenjournalMessages.isRead, 0),
    ));
}

export async function getUnreadMessageCount(clientId: number, fromAdmin: number) {
  const db = getDb();
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(seelenjournalMessages)
    .where(and(
      eq(seelenjournalMessages.clientId, clientId),
      eq(seelenjournalMessages.fromAdmin, fromAdmin),
      eq(seelenjournalMessages.isRead, 0),
    ));
  return Number(result[0]?.count || 0);
}

// Admin: Alle Klientinnen mit ungelesenen Nachrichten
export async function getClientsWithUnreadMessages() {
  const db = getDb();
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
}
