import { describe, it, expect } from "vitest";

const API_BASE = "http://127.0.0.1:3000";

describe("Seelenjournal API", () => {
  let testKlientinId: number | null = null;

  it("should list klientinnen (initially may be empty)", async () => {
    const res = await fetch(`${API_BASE}/api/trpc/seelenjournal.listKlientinnen`);
    expect(res.ok).toBe(true);
    const json = await res.json();
    const data = json?.result?.data?.json || json?.result?.data;
    expect(Array.isArray(data)).toBe(true);
  });

  it("should create a new klientin", async () => {
    const res = await fetch(`${API_BASE}/api/trpc/seelenjournal.createKlientin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { name: "Test Klientin", email: "testvitest@example.com", notizen: "Vitest" } }),
    });
    expect(res.ok).toBe(true);
    const json = await res.json();
    const result = json?.result?.data?.json || json?.result?.data;
    expect(result.success).toBe(true);
    expect(typeof result.id).toBe("number");
    testKlientinId = result.id;
  });

  it("should not create duplicate klientin", async () => {
    const res = await fetch(`${API_BASE}/api/trpc/seelenjournal.createKlientin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { name: "Test Klientin 2", email: "testvitest@example.com" } }),
    });
    expect(res.ok).toBe(true);
    const json = await res.json();
    const result = json?.result?.data?.json || json?.result?.data;
    expect(result.success).toBe(false);
    expect(result.error).toBe("exists");
  });

  it("should list pdfs for klientin (initially empty)", async () => {
    expect(testKlientinId).not.toBeNull();
    const res = await fetch(`${API_BASE}/api/trpc/seelenjournal.listPdfs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { klientinId: testKlientinId! } }),
    });
    expect(res.ok).toBe(true);
    const json = await res.json();
    const data = json?.result?.data?.json || json?.result?.data;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  it("should delete the test klientin", async () => {
    expect(testKlientinId).not.toBeNull();
    const res = await fetch(`${API_BASE}/api/trpc/seelenjournal.deleteKlientin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { id: testKlientinId! } }),
    });
    expect(res.ok).toBe(true);
    const json = await res.json();
    const result = json?.result?.data?.json || json?.result?.data;
    expect(result.success).toBe(true);
  });
});

describe("Community Auth - Password Reset Flow", () => {
  const testEmail = "pw-reset-test@example.com";
  const testName = "PW Reset Test";
  const originalPw = "original123";
  const tempPw = "temp456";
  const newPw = "newpassword789";

  it("should create a test user", async () => {
    const res = await fetch(`${API_BASE}/api/trpc/communityUsers.create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { email: testEmail, password: originalPw, name: testName, mustChangePassword: 0 } }),
    });
    expect(res.ok).toBe(true);
    const json = await res.json();
    const result = json?.result?.data?.json || json?.result?.data;
    expect(result.success).toBe(true);
  });

  it("should login with original password", async () => {
    const res = await fetch(`${API_BASE}/api/trpc/communityUsers.login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { email: testEmail, password: originalPw } }),
    });
    const json = await res.json();
    const result = json?.result?.data?.json || json?.result?.data;
    expect(result.success).toBe(true);
    expect(result.user.mustChangePassword).toBe(false);
  });

  it("should simulate password reset (update to temp pw with mustChangePassword)", async () => {
    const res = await fetch(`${API_BASE}/api/trpc/communityUsers.update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { email: testEmail, password: tempPw, mustChangePassword: 1 } }),
    });
    const json = await res.json();
    const result = json?.result?.data?.json || json?.result?.data;
    expect(result.success).toBe(true);
  });

  it("should login with temp password and see mustChangePassword=true", async () => {
    const res = await fetch(`${API_BASE}/api/trpc/communityUsers.login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { email: testEmail, password: tempPw } }),
    });
    const json = await res.json();
    const result = json?.result?.data?.json || json?.result?.data;
    expect(result.success).toBe(true);
    expect(result.user.mustChangePassword).toBe(true);
  });

  it("should NOT login with old password after reset", async () => {
    const res = await fetch(`${API_BASE}/api/trpc/communityUsers.login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { email: testEmail, password: originalPw } }),
    });
    const json = await res.json();
    const result = json?.result?.data?.json || json?.result?.data;
    expect(result.success).toBe(false);
    expect(result.error).toBe("wrong_password");
  });

  it("should change password to new password", async () => {
    const res = await fetch(`${API_BASE}/api/trpc/communityUsers.update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { email: testEmail, password: newPw, mustChangePassword: 0 } }),
    });
    const json = await res.json();
    const result = json?.result?.data?.json || json?.result?.data;
    expect(result.success).toBe(true);
  });

  it("should login with new password and mustChangePassword=false", async () => {
    const res = await fetch(`${API_BASE}/api/trpc/communityUsers.login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { email: testEmail, password: newPw } }),
    });
    const json = await res.json();
    const result = json?.result?.data?.json || json?.result?.data;
    expect(result.success).toBe(true);
    expect(result.user.mustChangePassword).toBe(false);
  });

  it("should clean up test user", async () => {
    const res = await fetch(`${API_BASE}/api/trpc/communityUsers.delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { email: testEmail } }),
    });
    const json = await res.json();
    const result = json?.result?.data?.json || json?.result?.data;
    expect(result.success).toBe(true);
  });
});
