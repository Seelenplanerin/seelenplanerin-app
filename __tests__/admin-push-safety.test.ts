import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Admin-Push-Sicherheit", () => {
  const source = readFileSync(resolve(process.cwd(), "app/admin.tsx"), "utf8");

  it("zeigt bei Ladefehlern keine falschen Nullwerte", () => {
    expect(source).toContain('pushStatsStatus === "error" || pushStatsStatus === "loading" ? "—"');
    expect(source).toContain("Deine registrierten Geräte und Abos sind nicht gelöscht");
    expect(source).toContain("PUSH_STATS_CACHE_KEY");
  });

  it("blockiert den Versand, bis Empfängerzahlen sicher geladen sind", () => {
    expect(source).toContain('pushStatsStatus !== "ready" || pushStats.totalSubscriptions < 1');
    expect(source).toContain('disabled={pushSending || pushStatsStatus !== "ready"}');
    expect(source).toContain("Push-Server antwortet mit HTTP");
  });
});
