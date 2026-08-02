import { describe, expect, it } from "vitest";
import { SettingsService, defaultSettings } from "./settings-service";

describe("SettingsService", () => {
  it("returns safe defaults", () => {
    const service = new SettingsService();

    expect(service.read()).toEqual(defaultSettings);
    expect(service.read().defaultAIPrivacyMode).toBe("local-only");
  });

  it("validates settings updates", () => {
    const service = new SettingsService();

    expect(() => service.update({ themeMode: "invalid" as "light" })).toThrow();
  });
});
