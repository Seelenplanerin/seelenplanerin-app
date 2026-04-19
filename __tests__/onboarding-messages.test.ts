import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const appDir = path.resolve(__dirname, "..");

describe("Onboarding Screen", () => {
  const onboardingPath = path.join(appDir, "app/onboarding.tsx");

  it("onboarding.tsx file exists", () => {
    expect(fs.existsSync(onboardingPath)).toBe(true);
  });

  it("contains DSGVO consent checkbox", () => {
    const content = fs.readFileSync(onboardingPath, "utf-8");
    expect(content).toContain("DSGVO");
    expect(content).toContain("Datenschutz");
    expect(content).toContain("dsgvoAccepted");
  });

  it("contains push notification permission request", () => {
    const content = fs.readFileSync(onboardingPath, "utf-8");
    expect(content).toContain("pushAccepted");
    expect(content).toContain("requestNotificationPermissions");
    expect(content).toContain("Benachrichtigungen");
  });

  it("stores onboarding completion in AsyncStorage", () => {
    const content = fs.readFileSync(onboardingPath, "utf-8");
    expect(content).toContain("seelenplanerin_onboarding_done");
    expect(content).toContain("AsyncStorage");
  });

  it("disables continue button when DSGVO not accepted", () => {
    const content = fs.readFileSync(onboardingPath, "utf-8");
    expect(content).toContain("!dsgvoAccepted");
    expect(content).toContain("continueBtnDisabled");
  });

  it("links to Datenschutzerklärung on dieseelenplanerin.de", () => {
    const content = fs.readFileSync(onboardingPath, "utf-8");
    expect(content).toContain("dieseelenplanerin.de/datenschutz");
  });

  it("navigates to tabs after completion", () => {
    const content = fs.readFileSync(onboardingPath, "utf-8");
    expect(content).toContain('router.replace("/(tabs)")');
  });
});

describe("Root Layout - Onboarding Integration", () => {
  const layoutPath = path.join(appDir, "app/_layout.tsx");

  it("_layout.tsx includes onboarding check", () => {
    const content = fs.readFileSync(layoutPath, "utf-8");
    expect(content).toContain("seelenplanerin_onboarding_done");
    expect(content).toContain("onboardingDone");
  });

  it("_layout.tsx registers onboarding screen in Stack", () => {
    const content = fs.readFileSync(layoutPath, "utf-8");
    expect(content).toContain('name="onboarding"');
  });

  it("_layout.tsx sets initialRouteName based on onboarding state", () => {
    const content = fs.readFileSync(layoutPath, "utf-8");
    expect(content).toContain("initialRouteName");
    expect(content).toContain('onboardingDone === false ? "onboarding" : "(tabs)"');
  });
});

describe("Message Screen - Keyboard Fixes", () => {
  const messagesPath = path.join(appDir, "app/seelenjournal-messages.tsx");

  it("seelenjournal-messages.tsx exists", () => {
    expect(fs.existsSync(messagesPath)).toBe(true);
  });

  it("uses KeyboardAvoidingView with correct behavior", () => {
    const content = fs.readFileSync(messagesPath, "utf-8");
    expect(content).toContain("KeyboardAvoidingView");
    expect(content).toContain('behavior={Platform.OS === "ios" ? "padding" : "height"}');
  });

  it("imports Keyboard for dismiss functionality", () => {
    const content = fs.readFileSync(messagesPath, "utf-8");
    expect(content).toContain("Keyboard");
    expect(content).toContain("Keyboard.dismiss");
  });

  it("has keyboardDismissMode on FlatList", () => {
    const content = fs.readFileSync(messagesPath, "utf-8");
    expect(content).toContain('keyboardDismissMode="interactive"');
  });

  it("has returnKeyType send on TextInput", () => {
    const content = fs.readFileSync(messagesPath, "utf-8");
    expect(content).toContain('returnKeyType="send"');
    expect(content).toContain("onSubmitEditing={handleSend}");
  });

  it("has proper bottom padding for inputBar on iOS", () => {
    const content = fs.readFileSync(messagesPath, "utf-8");
    expect(content).toContain('paddingBottom: Platform.OS === "ios" ? 24 : 10');
  });
});

describe("Admin Message Screen - Keyboard Fixes", () => {
  const adminPath = path.join(appDir, "app/seelenjournal-admin.tsx");

  it("seelenjournal-admin.tsx exists", () => {
    expect(fs.existsSync(adminPath)).toBe(true);
  });

  it("uses KeyboardAvoidingView with correct behavior for messages", () => {
    const content = fs.readFileSync(adminPath, "utf-8");
    expect(content).toContain("KeyboardAvoidingView");
    expect(content).toContain('behavior={Platform.OS === "ios" ? "padding" : "height"}');
  });

  it("imports Keyboard for dismiss functionality", () => {
    const content = fs.readFileSync(adminPath, "utf-8");
    expect(content).toContain("Keyboard");
    expect(content).toContain("TouchableWithoutFeedback");
  });

  it("has keyboardDismissMode on FlatList", () => {
    const content = fs.readFileSync(adminPath, "utf-8");
    expect(content).toContain('keyboardDismissMode="interactive"');
  });

  it("has returnKeyType send on message input", () => {
    const content = fs.readFileSync(adminPath, "utf-8");
    expect(content).toContain('returnKeyType="send"');
    expect(content).toContain("onSubmitEditing={sendMessage}");
  });

  it("has proper bottom padding for inputBar on iOS", () => {
    const content = fs.readFileSync(adminPath, "utf-8");
    expect(content).toContain('paddingBottom: Platform.OS === "ios" ? 24 : 10');
  });
});
