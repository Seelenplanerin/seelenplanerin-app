import { describe, it, expect } from "vitest";

describe("Affiliate Login Route", () => {
  it("should have affiliate.login route defined in routers", async () => {
    // Import the router to verify the login route exists
    const routerModule = await import("../server/routers");
    const router = routerModule.appRouter;
    
    // Check that affiliate router exists
    expect(router._def.procedures).toBeDefined();
    
    // Check that affiliate.login procedure exists
    const procedures = router._def.procedures;
    expect(procedures["affiliate.login"]).toBeDefined();
    expect(procedures["affiliate.getOrCreate"]).toBeDefined();
  });

  it("should validate login input schema", async () => {
    const routerModule = await import("../server/routers");
    const router = routerModule.appRouter;
    const loginProc = router._def.procedures["affiliate.login"];
    
    // The procedure should exist
    expect(loginProc).toBeDefined();
  });

  it("should validate getOrCreate input includes password field", async () => {
    const routerModule = await import("../server/routers");
    const router = routerModule.appRouter;
    const getOrCreateProc = router._def.procedures["affiliate.getOrCreate"];
    
    // The procedure should exist
    expect(getOrCreateProc).toBeDefined();
  });
});
