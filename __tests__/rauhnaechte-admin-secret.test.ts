import { describe, expect, it } from "vitest";
import "dotenv/config";
import { verifyAdminPassword } from "../server/rauhnaechte-admin-auth";

describe("Geschütztes Rauhnächte-Adminpasswort", () => {
  it("ist mindestens zwölf Zeichen lang und nur serverseitig gültig", () => {
    const password = process.env.RAUHNAECHTE_ADMIN_PASSWORD;
    expect(typeof password).toBe("string");
    expect(password!.length).toBeGreaterThanOrEqual(12);
    expect(verifyAdminPassword(password)).toBe(true);
    expect(verifyAdminPassword("1306")).toBe(false);
    expect(verifyAdminPassword("ungueltiges-testpasswort")).toBe(false);
  });
});
