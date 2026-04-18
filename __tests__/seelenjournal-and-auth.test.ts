import { describe, it, expect } from "vitest";

const API_BASE = "http://127.0.0.1:3000";

// Seelenjournal API uses Express routes (/api/seelenjournal/...) with JWT auth
describe("Seelenjournal API", () => {
  it("should have admin clients endpoint (requires auth)", async () => {
    const res = await fetch(`${API_BASE}/api/seelenjournal/admin/clients`);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Nicht autorisiert");
  });

  it("should have admin login endpoint", async () => {
    const res = await fetch(`${API_BASE}/api/seelenjournal/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: "wrong" }),
    });
    expect([401, 200]).toContain(res.status);
  });

  it("should have client login endpoint", async () => {
    const res = await fetch(`${API_BASE}/api/seelenjournal/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "nonexistent@test.com", password: "test" }),
    });
    expect([401, 200]).toContain(res.status);
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
