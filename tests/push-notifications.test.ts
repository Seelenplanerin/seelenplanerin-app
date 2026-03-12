import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock expo-notifications
vi.mock("expo-notifications", () => ({
  getPermissionsAsync: vi.fn().mockResolvedValue({ status: "granted" }),
  requestPermissionsAsync: vi.fn().mockResolvedValue({ status: "granted" }),
  getExpoPushTokenAsync: vi.fn().mockResolvedValue({ data: "ExponentPushToken[test123]" }),
  setNotificationHandler: vi.fn(),
  setNotificationChannelAsync: vi.fn(),
  NotificationBehavior: {},
}));

vi.mock("expo-constants", () => ({
  default: {
    expoConfig: {
      extra: { eas: { projectId: "test-project-id" } },
    },
  },
}));

vi.mock("react-native", () => ({
  Platform: { OS: "ios" },
}));

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn().mockResolvedValue(null),
    setItem: vi.fn().mockResolvedValue(undefined),
    removeItem: vi.fn().mockResolvedValue(undefined),
    multiGet: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock("@/constants/oauth", () => ({
  getApiBaseUrl: () => "http://127.0.0.1:3000",
}));

// Mock fetch
const mockFetch = vi.fn().mockResolvedValue({
  json: () => Promise.resolve({ result: { data: { json: { success: true } } } }),
});
vi.stubGlobal("fetch", mockFetch);

describe("Push-Benachrichtigungen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Push Token Registrierung", () => {
    it("sollte Push-Token beim Server registrieren", async () => {
      const { registerPushTokenWithServer } = await import("../lib/notifications");
      const token = await registerPushTokenWithServer();

      expect(token).toBe("ExponentPushToken[test123]");
      expect(mockFetch).toHaveBeenCalledWith(
        "http://127.0.0.1:3000/api/trpc/push.registerToken",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining("ExponentPushToken[test123]"),
        })
      );
    });

    it("sollte Community-Email mitsenden wenn vorhanden", async () => {
      const { registerPushTokenWithServer } = await import("../lib/notifications");
      await registerPushTokenWithServer("test@seelenplanerin.de");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://127.0.0.1:3000/api/trpc/push.registerToken",
        expect.objectContaining({
          body: expect.stringContaining("test@seelenplanerin.de"),
        })
      );
    });
  });

  describe("Push Server-Endpunkte", () => {
    it("sollte Push-Router im Server-Router definiert sein", async () => {
      // Verify the router file contains push routes
      const fs = await import("fs");
      const routerContent = fs.readFileSync(
        "/home/ubuntu/seelenplanerin-app/server/routers.ts",
        "utf-8"
      );
      expect(routerContent).toContain("push: router({");
      expect(routerContent).toContain("registerToken:");
      expect(routerContent).toContain("sendToAll:");
      expect(routerContent).toContain("tokenCount:");
      expect(routerContent).toContain("history:");
    });

    it("sollte Push-Token DB-Funktionen definiert haben", async () => {
      const fs = await import("fs");
      const dbContent = fs.readFileSync(
        "/home/ubuntu/seelenplanerin-app/server/db.ts",
        "utf-8"
      );
      expect(dbContent).toContain("registerPushToken");
      expect(dbContent).toContain("getAllActivePushTokens");
      expect(dbContent).toContain("deactivatePushToken");
      expect(dbContent).toContain("createPushMessage");
      expect(dbContent).toContain("getPushMessageHistory");
      expect(dbContent).toContain("getPushTokenCount");
    });

    it("sollte Push-Tabellen im Schema definiert haben", async () => {
      const fs = await import("fs");
      const schemaContent = fs.readFileSync(
        "/home/ubuntu/seelenplanerin-app/drizzle/schema.ts",
        "utf-8"
      );
      expect(schemaContent).toContain('pushTokens = pgTable("push_tokens"');
      expect(schemaContent).toContain('pushMessages = pgTable("push_messages"');
    });
  });

  describe("Admin Push-UI", () => {
    it("sollte Push-Tab im Admin-Screen vorhanden sein", async () => {
      const fs = await import("fs");
      const adminContent = fs.readFileSync(
        "/home/ubuntu/seelenplanerin-app/app/admin.tsx",
        "utf-8"
      );
      expect(adminContent).toContain('"push"');
      expect(adminContent).toContain('label: "Push"');
      expect(adminContent).toContain("Push-Benachrichtigung senden");
      expect(adminContent).toContain("push.sendToAll");
      expect(adminContent).toContain("push.tokenCount");
      expect(adminContent).toContain("push.history");
    });

    it("sollte Schnellvorlagen für Push-Nachrichten haben", async () => {
      const fs = await import("fs");
      const adminContent = fs.readFileSync(
        "/home/ubuntu/seelenplanerin-app/app/admin.tsx",
        "utf-8"
      );
      expect(adminContent).toContain("Schnellvorlagen");
      expect(adminContent).toContain("Vollmond-Ritual");
      expect(adminContent).toContain("Neumond-Intention");
      expect(adminContent).toContain("Neuer Seelenimpuls");
    });
  });

  describe("Push Token Registration beim App-Start", () => {
    it("sollte registerPushTokenWithServer in _layout.tsx aufgerufen werden", async () => {
      const fs = await import("fs");
      const layoutContent = fs.readFileSync(
        "/home/ubuntu/seelenplanerin-app/app/_layout.tsx",
        "utf-8"
      );
      expect(layoutContent).toContain("registerPushTokenWithServer");
      expect(layoutContent).toContain("import { initNotificationHandler, setupAndroidChannel, registerPushTokenWithServer }");
    });
  });
});
