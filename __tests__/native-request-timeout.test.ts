import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loginRauhAdmin, requestRaunaechteAdmin, clearRauhAdminSession } from "../lib/raunaechte-admin-api";
import { checkRauhnaechteAccess, requestRauhnaechteAccess, loadRauhnaechteDay } from "../lib/rauhnaechte-access-api";
import { withRequestTimeout } from "../lib/request-timeout";
import { getAccess } from "../lib/raunaechte-store";
vi.mock("../lib/_core/auth", () => ({ getSessionToken: vi.fn().mockResolvedValue(null) }));
vi.mock("@/constants/oauth", () => ({ getApiBaseUrl: () => "https://own-api.test" }));
vi.mock("../lib/raunaechte-store", () => ({ getAccess: vi.fn(), getDeviceId: vi.fn().mockResolvedValue("test-device") }));
const jsonResponse = (body: object, status=200) => new Response(JSON.stringify(body), {status,headers:{"Content-Type":"application/json"}});
beforeEach(() => {
  clearRauhAdminSession();
  // Hermes/ältere iPhone-Laufzeit: AbortController existiert, aber nicht AbortSignal.timeout.
  vi.stubGlobal("AbortSignal", class NativeAbortSignalWithoutStaticTimeout {});
  vi.mocked(getAccess).mockResolvedValue({code:"RN-ABCD-2345",verified:true,year:2026,activatedAt:"2026-10-12"});
});
afterEach(() => {clearRauhAdminSession();vi.unstubAllGlobals();vi.useRealTimers();vi.clearAllMocks();});
describe("iPhone-kompatible sichere Anfragen", () => {
  it("meldet den Admin ohne AbortSignal.timeout an und sendet die bestätigte Sitzung", async () => {
    const fetchMock=vi.fn().mockResolvedValueOnce(jsonResponse({token:"signed-admin-test"})).mockResolvedValueOnce(jsonResponse({result:{data:{json:[]}}}));
    vi.stubGlobal("fetch",fetchMock);
    await loginRauhAdmin("https://own-api.test","test-passphrase");
    expect(fetchMock.mock.calls[0][1].signal).toBeDefined();
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(false);
    await requestRaunaechteAdmin("https://own-api.test","raunaechte.listCodes");
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe("Bearer signed-admin-test");
  });
  it("lehnt falsches Passwort weiterhin ab und verwendet keine alte Sitzung",async()=>{
    const f=vi.fn().mockResolvedValueOnce(jsonResponse({token:"old-test-session"})).mockResolvedValueOnce(jsonResponse({error:"Admin-Anmeldung fehlgeschlagen."},401)).mockResolvedValueOnce(jsonResponse({result:{data:{json:[]}}}));
    vi.stubGlobal("fetch",f);await loginRauhAdmin("","correct-test");
    await expect(loginRauhAdmin("","incorrect-test")).rejects.toThrow("fehlgeschlagen");
    await requestRaunaechteAdmin("","raunaechte.listCodes");expect(f.mock.calls[2][1].headers.Authorization).toBeUndefined();
  });
  it("gibt ohne bestätigten Token keinen Adminzugang",async()=>{
    vi.stubGlobal("fetch",vi.fn().mockResolvedValue(jsonResponse({token:42})));
    await expect(loginRauhAdmin("","test-password")).rejects.toThrow("nicht bestätigt");
  });
  it("beendet die Anmeldung mit verständlichem Fehler bei Zeitüberschreitung",async()=>{
    vi.useFakeTimers();
    vi.stubGlobal("fetch",vi.fn((_url,opts)=>new Promise((_resolve,reject)=>opts.signal.addEventListener("abort",()=>reject(Object.assign(new Error("aborted"),{name:"AbortError"}))))));
    const outcome=expect(loginRauhAdmin("","test-password")).rejects.toThrow("zu lange gedauert");
    await vi.advanceTimersByTimeAsync(15000);await outcome;
    expect(vi.getTimerCount()).toBe(0);
  });
  it("räumt Timer bei Erfolg und Fehler vollständig auf",async()=>{
    vi.useFakeTimers();await expect(withRequestTimeout(async()=>"ok")).resolves.toBe("ok");expect(vi.getTimerCount()).toBe(0);
    await expect(withRequestTimeout(async()=>{throw new Error("server");})).rejects.toThrow("server");expect(vi.getTimerCount()).toBe(0);
  });
  it("prüft Journal-/Appzugang ohne iPhone-unverträgliche Methoden weiterhin serverseitig",async()=>{
    const f=vi.fn().mockImplementation(async()=>jsonResponse({valid:true,year:2026,currentDay:0}));vi.stubGlobal("fetch",f);
    await expect(checkRauhnaechteAccess(2026)).resolves.toEqual({valid:true,year:2026,currentDay:0});
    expect(JSON.parse(f.mock.calls[0][1].body)).toMatchObject({code:"RN-ABCD-2345",deviceId:"test-device"});
    await expect(checkRauhnaechteAccess(2025)).rejects.toThrow("nicht für diesen Jahreskreis");
  });
  it("sperrt fehlenden Code und zukünftige Inhalte weiterhin",async()=>{
    const f=vi.fn().mockResolvedValue(jsonResponse({error:"Dieser Inhaltstag ist noch gesperrt."},403));vi.stubGlobal("fetch",f);
    await expect(loadRauhnaechteDay(2026,1)).rejects.toThrow("noch gesperrt");
    vi.mocked(getAccess).mockResolvedValue(null);
    await expect(requestRauhnaechteAccess("journal/ticket")).rejects.toThrow("Zugangscode erforderlich");expect(f).toHaveBeenCalledTimes(1);
  });
  it("verwendet in beiden betroffenen Clientmodulen keine statischen AbortSignal-Aufrufe mehr",()=>{
    for(const file of ["lib/raunaechte-admin-api.ts","lib/rauhnaechte-access-api.ts"]){
      const s=readFileSync(resolve(process.cwd(),file),"utf8");expect(s).not.toContain("AbortSignal.timeout");expect(s).toContain("withRequestTimeout");
    }
  });
});
