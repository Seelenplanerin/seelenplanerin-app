import { describe, it, expect } from "vitest";

describe("Admin Panel - Academy Tab", () => {
  it("should have academy tab in AdminTab type definition", async () => {
    const fs = await import("fs");
    const adminCode = fs.readFileSync("app/admin.tsx", "utf-8");
    
    // Academy tab type exists
    expect(adminCode).toContain('"academy"');
    
    // Academy tab in TABS array
    expect(adminCode).toContain('key: "academy"');
    expect(adminCode).toContain('label: "Academy"');
    expect(adminCode).toContain('emoji: "🎓"');
  });

  it("should have academy waitlist UI section", async () => {
    const fs = await import("fs");
    const adminCode = fs.readFileSync("app/admin.tsx", "utf-8");
    
    // Academy tab content
    expect(adminCode).toContain('activeTab === "academy"');
    expect(adminCode).toContain("Seelen Academy – Warteliste");
    expect(adminCode).toContain("academy.listWaitlist");
    expect(adminCode).toContain("academyWaitlist");
  });

  it("should show planned courses in academy tab", async () => {
    const fs = await import("fs");
    const adminCode = fs.readFileSync("app/admin.tsx", "utf-8");
    
    expect(adminCode).toContain("Aura Reading Ausbildung");
    expect(adminCode).toContain("Theta Healing Ausbildung");
    expect(adminCode).toContain("Geplante Ausbildungen");
  });

  it("should have academy waitlist state variables", async () => {
    const fs = await import("fs");
    const adminCode = fs.readFileSync("app/admin.tsx", "utf-8");
    
    expect(adminCode).toContain("academyWaitlist");
    expect(adminCode).toContain("setAcademyWaitlist");
    expect(adminCode).toContain("academyLoading");
    expect(adminCode).toContain("setAcademyLoading");
  });
});

describe("Admin Panel - Affiliate Tracking", () => {
  it("should show affiliate name for each sale (not just code)", async () => {
    const fs = await import("fs");
    const adminCode = fs.readFileSync("app/admin.tsx", "utf-8");
    
    // Cross-reference affiliate name from affiliates list
    expect(adminCode).toContain("affiliates.find(a => a.code === sale.affiliateCode)?.name");
    expect(adminCode).toContain("Empfohlen von:");
  });

  it("should show full transparency header for sales", async () => {
    const fs = await import("fs");
    const adminCode = fs.readFileSync("app/admin.tsx", "utf-8");
    
    expect(adminCode).toContain("Alle Verkäufe – Volle Transparenz");
    expect(adminCode).toContain("Wer hat empfohlen, was wurde gekauft");
  });

  it("should show sale amount breakdown with commission", async () => {
    const fs = await import("fs");
    const adminCode = fs.readFileSync("app/admin.tsx", "utf-8");
    
    // Shows calculation: Betrag · 20% = Provision
    expect(adminCode).toContain("Betrag:");
    expect(adminCode).toContain("20% =");
  });

  it("should show date for each sale", async () => {
    const fs = await import("fs");
    const adminCode = fs.readFileSync("app/admin.tsx", "utf-8");
    
    expect(adminCode).toContain("saleDate");
    expect(adminCode).toContain('toLocaleDateString("de-DE"');
  });

  it("should have affiliate selector for creating sales", async () => {
    const fs = await import("fs");
    const adminCode = fs.readFileSync("app/admin.tsx", "utf-8");
    
    // Affiliate selector buttons
    expect(adminCode).toContain("Affiliate auswählen");
    expect(adminCode).toContain("affiliates.map(a =>");
  });

  it("should have product catalog with correct prices", async () => {
    const fs = await import("fs");
    const adminCode = fs.readFileSync("app/admin.tsx", "utf-8");
    
    // Products with prices
    expect(adminCode).toContain('name: "Schutzarmband", price: "24.00"');
    expect(adminCode).toContain('name: "Runen-Armband", price: "94.00"');
    expect(adminCode).toContain('name: "Aura Reading", price: "77.00"');
    expect(adminCode).toContain('name: "Seelenimpuls", price: "17.00"');
    expect(adminCode).toContain('name: "Deep Talk Basis", price: "111.00"');
    expect(adminCode).toContain('name: "Deep Talk Premium", price: "888.00"');
  });

  it("should have overall statistics section", async () => {
    const fs = await import("fs");
    const adminCode = fs.readFileSync("app/admin.tsx", "utf-8");
    
    expect(adminCode).toContain("Gesamt-Statistik");
    expect(adminCode).toContain("totalClicks");
    expect(adminCode).toContain("totalSales");
    expect(adminCode).toContain("totalEarnings");
  });

  it("should show affiliate email for each sale", async () => {
    const fs = await import("fs");
    const adminCode = fs.readFileSync("app/admin.tsx", "utf-8");
    
    expect(adminCode).toContain("affiliates.find(a => a.code === sale.affiliateCode)?.email");
  });
});

describe("Server - Academy Waitlist", () => {
  it("should have academy waitlist endpoints in router", async () => {
    const fs = await import("fs");
    const routerCode = fs.readFileSync("server/routers.ts", "utf-8");
    
    expect(routerCode).toContain("academy: router");
    expect(routerCode).toContain("joinWaitlist:");
    expect(routerCode).toContain("listWaitlist:");
  });

  it("should have academy waitlist DB functions", async () => {
    const fs = await import("fs");
    const dbCode = fs.readFileSync("server/db.ts", "utf-8");
    
    expect(dbCode).toContain("addAcademyWaitlist");
    expect(dbCode).toContain("getAcademyWaitlist");
    expect(dbCode).toContain("academy_waitlist");
  });

  it("should have academy waitlist table in migration", async () => {
    const fs = await import("fs");
    const migrateCode = fs.readFileSync("server/db-migrate.ts", "utf-8");
    
    expect(migrateCode).toContain("academy_waitlist");
    expect(migrateCode).toContain("CREATE TABLE IF NOT EXISTS academy_waitlist");
  });

  it("should send confirmation email on waitlist signup", async () => {
    const fs = await import("fs");
    const routerCode = fs.readFileSync("server/routers.ts", "utf-8");
    
    expect(routerCode).toContain("sendAcademyWaitlistEmail");
  });
});

describe("Home Screen - Academy Section", () => {
  it("should have Academy section on home screen", async () => {
    const fs = await import("fs");
    const homeCode = fs.readFileSync("app/(tabs)/index.tsx", "utf-8");
    
    expect(homeCode).toContain("Seelen Academy");
    expect(homeCode).toContain("academyEmail");
    expect(homeCode).toContain("academy.joinWaitlist");
    expect(homeCode).toContain("Aura Reading Ausbildung");
    expect(homeCode).toContain("Theta Healing Ausbildung");
  });
});
