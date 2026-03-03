import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

function readFile(filePath: string): string {
  return fs.readFileSync(path.join(ROOT, filePath), "utf-8");
}

describe("Affiliate-Verbesserungen: Wunschcode", () => {
  const affiliateScreen = readFile("app/affiliate.tsx");
  const routers = readFile("server/routers.ts");

  it("Affiliate-Screen hat Wunschcode-Eingabefeld", () => {
    expect(affiliateScreen).toContain("wunschCode");
    expect(affiliateScreen).toContain("Wunschcode");
  });

  it("Server-Route akzeptiert wunschCode-Parameter", () => {
    expect(routers).toContain("wunschCode: z.string().min(2).optional()");
  });

  it("Server prüft ob Wunschcode schon vergeben ist", () => {
    expect(routers).toContain("code_taken");
  });

  it("Wunschcode wird in Großbuchstaben umgewandelt", () => {
    expect(routers).toContain("toUpperCase()");
  });

  it("Affiliate-Screen zeigt Fehlermeldung bei vergebenem Code", () => {
    expect(affiliateScreen).toContain("code_taken");
    expect(affiliateScreen).toContain("vergeben");
  });
});

describe("Affiliate-Verbesserungen: Admin-Benachrichtigung bei neuer Anmeldung", () => {
  const email = readFile("server/email.ts");
  const routers = readFile("server/routers.ts");

  it("sendAffiliateAdminNotification Funktion existiert", () => {
    expect(email).toContain("export async function sendAffiliateAdminNotification");
  });

  it("Admin-E-Mail enthält Affiliate-Name, E-Mail und Code", () => {
    expect(email).toContain("params.affiliateName");
    expect(email).toContain("params.affiliateEmail");
    expect(email).toContain("params.affiliateCode");
  });

  it("Admin-E-Mail wird an Admin gesendet (config.user)", () => {
    expect(email).toContain("to: config.user, // An Admin");
  });

  it("Admin-E-Mail enthält Hinweis auf Tentary-Code-Anlage", () => {
    expect(email).toContain("Tentary");
    expect(email).toContain("Gutscheincode");
  });

  it("Server-Route ruft Admin-Benachrichtigung auf", () => {
    expect(routers).toContain("sendAffiliateAdminNotification");
  });
});

describe("Affiliate-Verbesserungen: Affiliate aktivieren/deaktivieren", () => {
  const admin = readFile("app/admin.tsx");
  const routers = readFile("server/routers.ts");

  it("toggleActive-Route existiert im Server", () => {
    expect(routers).toContain("toggleActive: publicProcedure");
    expect(routers).toContain("isActive: z.number()");
  });

  it("Admin-Screen hat Toggle-Button für Aktiv/Inaktiv", () => {
    expect(admin).toContain("affiliate.toggleActive");
    expect(admin).toContain("Aktiv");
    expect(admin).toContain("Inaktiv");
  });

  it("Inaktive Affiliates werden visuell abgeblendet", () => {
    expect(admin).toContain("opacity: a.isActive ? 1 : 0.5");
  });
});

describe("Affiliate-Verbesserungen: Verkaufsstatus ändern", () => {
  const admin = readFile("app/admin.tsx");

  it("Admin hat klickbare Status-Buttons statt nur Anzeige", () => {
    expect(admin).toContain("affiliate.updateSaleStatus");
  });

  it("Drei Status-Optionen: pending, confirmed, paid", () => {
    expect(admin).toContain('"pending", "confirmed", "paid"');
  });

  it("Status wird lokal nach Klick aktualisiert", () => {
    expect(admin).toContain("setAffSales(prev => prev.map(s2 => s2.id === sale.id");
  });
});

describe("Affiliate-Verbesserungen: Auszahlungs-E-Mail", () => {
  const email = readFile("server/email.ts");
  const routers = readFile("server/routers.ts");

  it("sendAffiliatePayoutEmail Funktion existiert", () => {
    expect(email).toContain("export async function sendAffiliatePayoutEmail");
  });

  it("Auszahlungs-E-Mail enthält Betrag", () => {
    expect(email).toContain("params.amount");
    expect(email).toContain("PayPal");
  });

  it("Auszahlungs-E-Mail wird im createPayout-Endpunkt aufgerufen", () => {
    expect(routers).toContain("sendAffiliatePayoutEmail");
  });

  it("Auszahlungs-E-Mail hat schönes Design", () => {
    expect(email).toContain("Deine Provision wurde ausgezahlt");
    expect(email).toContain("PayPal");
  });
});

describe("Affiliate-Verbesserungen: Willkommens-E-Mail aktualisiert", () => {
  const email = readFile("server/email.ts");

  it("Willkommens-E-Mail betont Code statt Link", () => {
    expect(email).toContain("Empfehlungscode");
    expect(email).toContain("Gutscheinfeld");
  });

  it("Schritte erklären Code-Weitergabe statt Link-Weitergabe", () => {
    expect(email).toContain("Teile deinen Code");
    expect(email).toContain("gibt deinen Code bei der Bestellung ein");
  });
});

describe("Affiliate-Verbesserungen: Admin Produktliste mit Ritual-Sets", () => {
  const admin = readFile("app/admin.tsx");

  it("Ritual-Sets sind in der Produktliste im Admin", () => {
    expect(admin).toContain("Vollmond Ritual-Set");
    expect(admin).toContain("Neumond Ritual-Set");
    expect(admin).toContain("Imbolc Ritual-Set");
    expect(admin).toContain("Yule Ritual-Set");
  });

  it("Ritual-Sets haben den korrekten Preis von 29.90", () => {
    const matches = admin.match(/Ritual-Set.*?29\.90/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBeGreaterThanOrEqual(10);
  });
});

describe("Affiliate-Verbesserungen: Auszahlung mit Affiliate-Auswahl", () => {
  const admin = readFile("app/admin.tsx");

  it("Auszahlung hat Affiliate-Auswahl-Buttons statt nur Textfeld", () => {
    expect(admin).toContain("payoutCode === a.code && s.katBtnActive");
  });
});

describe("Affiliate-Verbesserungen: Imports korrekt", () => {
  const routers = readFile("server/routers.ts");

  it("Alle neuen E-Mail-Funktionen sind importiert", () => {
    expect(routers).toContain("sendAffiliateAdminNotification");
    expect(routers).toContain("sendAffiliatePayoutEmail");
  });
});
