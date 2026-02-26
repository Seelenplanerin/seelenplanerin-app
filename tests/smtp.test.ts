import { describe, expect, it } from "vitest";
import { verifySmtpConnection } from "../server/email";

describe("SMTP E-Mail-Verbindung", () => {
  it("sollte sich erfolgreich mit dem SMTP-Server verbinden", async () => {
    const result = await verifySmtpConnection();
    console.log("SMTP Verify Result:", result);
    expect(result.success).toBe(true);
  }, 15000);
});
