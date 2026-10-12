import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Direkte Produktions-API", () => {
  const source = readFileSync(resolve(process.cwd(), "constants/oauth.ts"), "utf8");
  it("verwendet für native Apps ausschließlich die eigene Render-Domain", () => {
    expect(source).toContain('const PRODUCTION_API_URL = "https://www.app.dieseelenplanerin.de"');
    expect(source).toContain("return PRODUCTION_API_URL");
    expect(source).not.toContain("seelenapp-6tnxx849.manus.space");
  });
  it("verwendet im Render-Web die API am selben Ursprung", () => {
    expect(source).toMatch(/hostname === "www\.app\.dieseelenplanerin\.de"[^}]+return ""/);
  });
  it("baut den direkt datenbankverbundenen Server statt des defekten Proxys", () => {
    const docker = readFileSync(resolve(process.cwd(), "Dockerfile"), "utf8");
    expect(docker).toContain("esbuild server/_core/index.ts");
    expect(docker).not.toContain("esbuild server/render-proxy.ts");
  });
  it("unterscheidet Prozessgesundheit und Datenbankbereitschaft", () => {
    const server = readFileSync(resolve(process.cwd(), "server/_core/index.ts"), "utf8");
    expect(server).toContain('app.get("/api/readiness"');
    expect(server).toContain('res.status(503).json({ ok: false, database: "unavailable" })');
    expect(server).toContain('process.env.ENABLE_DAILY_PUSH_CRON !== "false"');
  });
});
