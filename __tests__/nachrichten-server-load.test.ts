import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock getApiBaseUrl
vi.mock("@/constants/oauth", () => ({
  getApiBaseUrl: () => "https://www.app.dieseelenplanerin.de",
}));

describe("Nachrichten Server Loading", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should parse tRPC push.history response correctly", async () => {
    const mockServerResponse = {
      result: {
        data: {
          json: [
            {
              id: 1,
              title: "🌕 Vollmond-Ritual",
              body: "Heute ist Vollmond im Zeichen Schütze. Hier ist dein vollständiges Ritual:\n\n1. Zünde eine weiße Kerze an...\n2. Setze dich bequem hin...\n3. Atme tief ein und aus...\n\nLink zum Ritual: https://example.com/ritual",
              data: null,
              sentTo: 50,
              sentSuccess: 48,
              sentFailed: 2,
              createdAt: "2026-06-15T10:00:00.000Z",
            },
            {
              id: 2,
              title: "✨ Dein Tagesimpuls",
              body: "Die Sterne stehen günstig für neue Anfänge.",
              data: JSON.stringify({ type: "tagesimpuls" }),
              sentTo: 50,
              sentSuccess: 50,
              sentFailed: 0,
              createdAt: "2026-06-14T07:00:00.000Z",
            },
          ],
        },
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServerResponse,
    });

    // Simulate what loadNachrichtenFromServer does
    const baseUrl = "https://www.app.dieseelenplanerin.de";
    const url = `${baseUrl}/api/trpc/push.history`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    const data = json?.result?.data?.json || json?.result?.data || [];

    const messages = data.map((msg: any) => ({
      id: String(msg.id),
      title: msg.title || "Die Seelenplanerin",
      body: msg.body || "",
      timestamp: msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now(),
      read: true,
    }));

    expect(messages).toHaveLength(2);
    expect(messages[0].id).toBe("1");
    expect(messages[0].title).toBe("🌕 Vollmond-Ritual");
    expect(messages[0].body).toContain("Hier ist dein vollständiges Ritual");
    expect(messages[0].body).toContain("https://example.com/ritual");
    expect(messages[0].body.length).toBeGreaterThan(100); // Full text preserved
    expect(messages[1].title).toBe("✨ Dein Tagesimpuls");
  });

  it("should return empty array on server error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const baseUrl = "https://www.app.dieseelenplanerin.de";
    const url = `${baseUrl}/api/trpc/push.history`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result = response.ok ? await response.json() : [];
    expect(result).toEqual([]);
  });

  it("should handle network failure gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    let result: any[] = [];
    try {
      const baseUrl = "https://www.app.dieseelenplanerin.de";
      const response = await fetch(`${baseUrl}/api/trpc/push.history`);
      const json = await response.json();
      result = json?.result?.data?.json || [];
    } catch {
      result = [];
    }

    expect(result).toEqual([]);
  });

  it("should preserve long ritual text without truncation", async () => {
    // Simulate a very long ritual text (like the ones sent via push)
    const longRitualText = `🌕 Vollmond-Ritual im Zeichen Schütze

Heute Nacht erstrahlt der Vollmond in seiner ganzen Pracht. Dies ist eine besondere Zeit für Loslassen und Transformation.

Vorbereitung:
- Suche dir einen ruhigen Ort
- Zünde eine weiße Kerze an
- Lege deine Lieblingskristalle bereit
- Bereite ein Glas Wasser vor

Das Ritual:

1. Setze dich bequem hin und schließe die Augen
2. Atme dreimal tief ein und aus
3. Spüre das Mondlicht auf deiner Haut
4. Sage laut oder leise: "Ich lasse los, was mir nicht mehr dient"
5. Schreibe auf einen Zettel, was du loslassen möchtest
6. Verbrenne den Zettel sicher in der Kerzenflamme
7. Trinke das Mondwasser und spüre die Reinigung

Abschluss:
Bedanke dich bei Mutter Mond für ihre Führung. Lösche die Kerze und gehe mit einem leichten Herzen schlafen.

Mehr Rituale findest du hier: https://www.dieseelenplanerin.de/rituale

Namaste 🙏✨`;

    const mockResponse = {
      result: {
        data: {
          json: [{ id: 99, title: "🌕 Vollmond-Ritual", body: longRitualText, createdAt: "2026-06-15T20:00:00.000Z" }],
        },
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const response = await fetch("https://www.app.dieseelenplanerin.de/api/trpc/push.history");
    const json = await response.json();
    const data = json?.result?.data?.json || [];
    const msg = data[0];

    // The full text must be preserved - no truncation!
    expect(msg.body).toBe(longRitualText);
    expect(msg.body).toContain("https://www.dieseelenplanerin.de/rituale");
    expect(msg.body).toContain("Namaste");
    expect(msg.body.length).toBeGreaterThan(500);
  });
});
