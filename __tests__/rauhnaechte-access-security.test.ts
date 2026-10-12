import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import type { Server } from "node:http";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import "dotenv/config";
import { registerRauhnaechteAccessRoutes, signJournalToken, verifyJournalToken, berlinNow, restrictJournalDays } from "../server/rauhnaechte-access";
import { registerRauhAdminAuth, issueRauhAdminToken, verifyRauhAdminToken } from "../server/rauhnaechte-admin-auth";
import { getJournalTemplate } from "../server/journal-template";
import * as db from "../server/db";
vi.mock("../server/db", () => ({ getActiveRaunaechteAccess: vi.fn(), bindRaunaechteJournal: vi.fn(), bindRaunaechteJournalByCode: vi.fn(), getActiveRaunaechteJournal: vi.fn() }));
const code="RN-ABCD-2345", deviceId="test-device-secure", browserId="test-browser-secure";
let server: Server, base: string;
const post = (path: string, body: object, token?: string) => fetch(base+path,{method:"POST",headers:{"Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify(body)});
beforeAll(async () => {
 const app=express();app.use(express.json());registerRauhnaechteAccessRoutes(app);registerRauhAdminAuth(app);
 server=app.listen(0);await new Promise<void>(resolve=>server.once("listening",resolve));
 const address=server.address();base=`http://127.0.0.1:${typeof address==='object'&&address?.port}`;
});
afterAll(()=>new Promise<void>(resolve=>server.close(()=>resolve())));
beforeEach(()=>{vi.clearAllMocks();vi.mocked(db.getActiveRaunaechteAccess).mockResolvedValue({id:7,year:2026});});
afterEach(()=>vi.useRealTimers());
describe("Echter Rauhnächte-Zugang",()=>{
 it("weist leere und erfundene Zugänge ohne Inhaltsauslieferung ab",async()=>{
  const a=await post('/api/rauhnaechte/day',{day:1,year:2026});expect(a.status).toBe(403);
  vi.mocked(db.getActiveRaunaechteAccess).mockResolvedValue(null);
  const b=await post('/api/rauhnaechte/access/check',{code,deviceId});expect(b.status).toBe(403);
 });
 it("sperrt Inhalte vor dem 8. Dezember selbst bei gültigem Code",async()=>{
  vi.useFakeTimers({toFake:['Date']});vi.setSystemTime(new Date('2026-10-12T20:00:00Z'));
  const r=await post('/api/rauhnaechte/day',{code,deviceId,year:2026,day:1});expect(r.status).toBe(403);expect((await r.json()).error).toContain('noch gesperrt');
 });
 it("öffnet nur den aktuellen Inhaltstag nach Berliner Datum",async()=>{
  vi.useFakeTimers({toFake:['Date']});vi.setSystemTime(new Date('2026-12-07T23:01:00Z'));
  expect(berlinNow().getDate()).toBe(8);
  const r=await post('/api/rauhnaechte/day',{code,deviceId,year:2026,day:1});expect(r.status).toBe(200);expect((await r.json()).content.day).toBe(1);
  expect((await post('/api/rauhnaechte/day',{code,deviceId,year:2026,day:2})).status).toBe(403);
 });
 it("liefert keine Inhalte für Pause oder falsches Jahr",async()=>{
  expect((await post('/api/rauhnaechte/day',{code,deviceId,year:2026,day:13})).status).toBe(404);
  expect((await post('/api/rauhnaechte/day',{code,deviceId,year:2025,day:1})).status).toBe(403);
 });
 it("gibt das Journal niemals ohne bestätigte Sitzung und Browserbindung aus",async()=>{
  expect((await post('/api/rauhnaechte/journal/document',{browserId})).status).toBe(403);
  const token=signJournalToken({codeId:7,year:2026,browserId,scope:'journal',exp:Date.now()+60000});
  expect((await post('/api/rauhnaechte/journal/document',{browserId:'fremder-browser'},token)).status).toBe(403);
  vi.mocked(db.getActiveRaunaechteJournal).mockResolvedValue(null);
  expect((await post('/api/rauhnaechte/journal/document',{browserId},token)).status).toBe(403);
 });
 it("lädt nach bestätigtem Code das Journal ohne vorzeitig verfügbare Tagesimpulse",async()=>{
  vi.useFakeTimers({toFake:['Date']});vi.setSystemTime(new Date('2026-10-12T20:00:00Z'));
  vi.mocked(db.bindRaunaechteJournalByCode).mockResolvedValue({id:7,year:2026});
  vi.mocked(db.getActiveRaunaechteJournal).mockResolvedValue({id:7,year:2026});
  const s=await post('/api/rauhnaechte/journal/session',{code,browserId});expect(s.status).toBe(200);
  const {token}=await s.json();const doc=await post('/api/rauhnaechte/journal/document',{browserId},token);expect(doc.status).toBe(200);
  const html=await doc.text();expect(html).toContain('window.__RAUH_ACCESS__');expect(html).not.toContain('Welche Vorsätze haben');expect(html).not.toContain('Was soll im neuen Jahr dein festes Fundament');expect(doc.headers.get('cache-control')).toContain('no-store');
 });
 it("prüft Ablauf, Manipulation und Geltungsbereich der Tokens",()=>{
  const token=signJournalToken({codeId:7,year:2026,scope:'handoff',exp:Date.now()+60000});
  expect(verifyJournalToken(token,'handoff')).not.toBeNull();expect(verifyJournalToken(token,'journal')).toBeNull();expect(verifyJournalToken(token+'x','handoff')).toBeNull();expect(verifyJournalToken(token,'handoff',Date.now()+120000)).toBeNull();
  expect(verifyRauhAdminToken(token)).toBe(false);
 });
 it("akzeptiert ein Übergabeticket nur einmal",async()=>{
  vi.mocked(db.bindRaunaechteJournal).mockResolvedValue({id:7,year:2026});
  const ticket=signJournalToken({codeId:7,year:2026,scope:'handoff',exp:Date.now()+60000});
  expect((await post('/api/rauhnaechte/journal/session',{ticket,browserId})).status).toBe(200);
  expect((await post('/api/rauhnaechte/journal/session',{ticket,browserId})).status).toBe(403);
 });
 it("filtert exakt die bereits freigeschalteten Journalimpulse",()=>{
  const template=getJournalTemplate();
  expect(restrictJournalDays(template,0)).not.toContain('Welche Vorsätze haben');
  expect(restrictJournalDays(template,1)).toContain('Welche Vorsätze haben');
  expect(restrictJournalDays(template,16)).not.toContain('Was soll im neuen Jahr dein festes Fundament');
  expect(restrictJournalDays(template,17)).toContain('Was soll im neuen Jahr dein festes Fundament');
 });
 it("erfordert für Codeverwaltung eine echte serverseitige Admin-Anmeldung",async()=>{
  expect((await post('/api/rauhnaechte/admin/login',{password:'1306'})).status).toBe(401);
  const response=await post('/api/rauhnaechte/admin/login',{password:process.env.RAUHNAECHTE_ADMIN_PASSWORD});expect(response.status).toBe(200);
  const {token}=await response.json();expect(verifyRauhAdminToken(token)).toBe(true);expect(verifyRauhAdminToken(token,Date.now()+9*3600000)).toBe(false);
  expect(verifyJournalToken(token,'journal')).toBeNull();expect(verifyRauhAdminToken(issueRauhAdminToken())).toBe(true);
 });
 it("liefert keine privaten Tagesdaten im App-Client und schützt alle Codeverfahren",()=>{
  const read=(p:string)=>readFileSync(resolve(process.cwd(),p),'utf8');
  const tag=read('app/raunaechte-tag.tsx');expect(tag).toContain('loadRauhnaechteDay(yearNum, dayNum)');expect(tag).not.toContain('getRaunaechteDay(');
  const overview=read('app/(tabs)/raunaechte.tsx');expect(overview).toContain('checkRauhnaechteAccess(year)');expect(overview).not.toContain('getAllRaunaechteContent');
  const router=read('server/routers.ts');for(const name of ['generateCodes','listCodes','stats','deactivateCode'])expect(router).toContain(`${name}: rauhAdminProcedure`);
 });
});
