import { describe, it, expect } from "vitest";

describe("Affiliate Login Route", () => {
  it("should have affiliate.login route defined in routers", async () => {
    const routerModule = await import("../server/routers");
    const router = routerModule.appRouter;
    expect(router._def.procedures).toBeDefined();
    expect(router._def.procedures["affiliate.login"]).toBeDefined();
    expect(router._def.procedures["affiliate.getOrCreate"]).toBeDefined();
  });

  it("should have affiliate.resetPassword route defined", async () => {
    const routerModule = await import("../server/routers");
    const router = routerModule.appRouter;
    expect(router._def.procedures["affiliate.resetPassword"]).toBeDefined();
  });

  it("should have affiliate.changePassword route defined", async () => {
    const routerModule = await import("../server/routers");
    const router = routerModule.appRouter;
    expect(router._def.procedures["affiliate.changePassword"]).toBeDefined();
  });

  it("should have all admin affiliate routes defined", async () => {
    const routerModule = await import("../server/routers");
    const router = routerModule.appRouter;
    const procedures = router._def.procedures;
    expect(procedures["affiliate.list"]).toBeDefined();
    expect(procedures["affiliate.listAllSales"]).toBeDefined();
    expect(procedures["affiliate.createSale"]).toBeDefined();
    expect(procedures["affiliate.createPayout"]).toBeDefined();
    expect(procedures["affiliate.toggleActive"]).toBeDefined();
    expect(procedures["affiliate.updateSaleStatus"]).toBeDefined();
    expect(procedures["affiliate.updatePaymentInfo"]).toBeDefined();
  });
});
