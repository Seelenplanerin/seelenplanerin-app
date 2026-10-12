import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseCodeCount, requestRaunaechteAdmin, requireCodeRows, requireWaitlistRows, requireGeneratedCodes } from "../lib/raunaechte-admin-api";
vi.mock("../lib/_core/auth", () => ({ getSessionToken: vi.fn().mockResolvedValue("owner-session-test") }));

afterEach(() => vi.unstubAllGlobals());
describe("Rauhnächte Admin Sicherheit", () => {
  it("akzeptiert nur ganze Anzahlen von 1 bis 100 ohne heimlichen Fallback", () => {
    expect(parseCodeCount("1")).toBe(1); expect(parseCodeCount("100")).toBe(100);
    for (const v of ["", "0", "101", "2abc", "1.5", "-1"]) expect(() => parseCodeCount(v)).toThrow();
  });
  it("behandelt Cloudflare-403 nicht als leere Liste", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>DNS error</html>", { status: 403 })));
    await expect(requestRaunaechteAdmin("https://example.test", "raunaechte.listCodes")).rejects.toThrow("Eigentümer-Konto");
  });
  it("behandelt einen tRPC-Fehler auch bei HTTP 200 nicht als Erfolg", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { json: { message: "Speichern fehlgeschlagen" } } }))));
    await expect(requestRaunaechteAdmin("", "raunaechte.generateCodes", { count: 1, year: 2026 }, true)).rejects.toThrow("Speichern fehlgeschlagen");
  });
  it("sendet exakt eine Mutation und liest deren gespeicherte Codes", async () => {
    const mock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ result: { data: { json: { success: true, codes: ["RN-ABCD-2345"], count: 1 } } } })));
    vi.stubGlobal("fetch", mock);
    const result = await requestRaunaechteAdmin("", "raunaechte.generateCodes", { count: 1, year: 2026 }, true);
    expect(requireGeneratedCodes(result, 1)).toEqual(["RN-ABCD-2345"]);
    expect(mock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(mock.mock.calls[0][1].body)).toEqual({ json: { count: 1, year: 2026 } });
    expect(mock.mock.calls[0][1].headers.Authorization).toBe("Bearer owner-session-test");
    expect(mock.mock.calls[0][1].credentials).toBe("include");
  });
  it("erlaubt leere Listen nur als tatsächlich gültige Serverantwort", () => {
    expect(requireCodeRows([])).toEqual([]); expect(requireWaitlistRows([])).toEqual([]);
    for (const v of [undefined, null, {}, { error: true }]) {
      expect(() => requireCodeRows(v)).toThrow(); expect(() => requireWaitlistRows(v)).toThrow();
    }
  });
  it("fordert eine vollständige Bestätigung aller gewünschten Codes", () => {
    expect(() => requireGeneratedCodes({ success: false, codes: [] }, 1)).toThrow();
    expect(() => requireGeneratedCodes({ success: true, codes: ["RN-ABCD-2345"], count: 1 }, 2)).toThrow();
  });
  it("zeigt ohne geladene Daten Striche und blockiert die Generierung", () => {
    const source=readFileSync(resolve(process.cwd(), "components/raunaechte-admin.tsx"), "utf8");
    expect(source).toContain('codes === null ? "—"');
    expect(source).toContain('disabled={!ready || generating || loading}');
    expect(source).toContain('entries.length === 0 && !error && !loading');
    expect(source).toContain("requireGeneratedCodes(result, amount)");
    expect(source).toContain("Die Warteliste ist nicht gelöscht.");
  });
});
