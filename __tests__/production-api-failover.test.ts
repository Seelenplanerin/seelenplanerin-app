import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Produktions-API-Failover", () => {
  const source = readFileSync(resolve(process.cwd(), "constants/oauth.ts"), "utf8");

  it("verwendet für native Apps den erreichbaren Produktionsserver", () => {
    expect(source).toContain(
      'const PRODUCTION_API_URL = "https://seelenapp-6tnxx849.manus.space"',
    );
    expect(source).toContain("return PRODUCTION_API_URL");
  });

  it("leitet die bisherige Render-Webdomain ebenfalls auf den Ersatzserver", () => {
    expect(source).toContain('hostname === "www.app.dieseelenplanerin.de"');
  });
});
