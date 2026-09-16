import { describe, expect, it } from "vitest";
import {
  healthResponseSchema,
  jobsResponseSchema,
  settingsSchema,
  settingsUpdateSchema,
} from "./index";

describe("healthResponseSchema", () => {
  it("accepts a valid health response", () => {
    const services = {
      appDataPath: "healthy",
      settings: "healthy",
      logger: "healthy",
      jobs: "healthy",
      migrations: "healthy",
      database: "healthy",
    } as const;

    expect(
      healthResponseSchema.parse({
        status: "ok",
        appName: "CoreDesk",
        version: "0.1.0",
        services,
      }),
    ).toEqual({
      status: "ok",
      appName: "CoreDesk",
      version: "0.1.0",
      services,
    });
  });
});

describe("settingsSchema", () => {
  it("accepts safe persistent settings", () => {
    expect(
      settingsSchema.parse({
        themeMode: "dark",
        logLevel: "info",
        ollamaBaseUrl: "http://127.0.0.1:11434",
        ollamaModel: "",
        defaultAIPrivacyMode: "local-only",
        appDataPathDisplay: "Default application data location",
      }),
    ).toMatchObject({ themeMode: "dark" });
  });

  it("does not fill absent keys in partial settings updates", () => {
    expect(settingsUpdateSchema.parse({ themeMode: "dark" })).toEqual({ themeMode: "dark" });
  });

  it("rejects unknown update keys", () => {
    expect(() => settingsUpdateSchema.parse({ apiKey: "secret" })).toThrow();
  });
});

describe("jobsResponseSchema", () => {
  it("accepts an empty background job monitor response", () => {
    expect(jobsResponseSchema.parse({ jobs: [] })).toEqual({ jobs: [] });
  });
});

describe("auth and entitlements", () => {
  it("validates UserProfile schema", async () => {
    const { userProfileSchema } = await import("./auth");
    const user = userProfileSchema.parse({
      userId: "usr_12345",
      name: "Anas Ayari",
      email: "anas@syntaflow.tech",
    });
    expect(user.name).toBe("Anas Ayari");
    expect(user.email).toBe("anas@syntaflow.tech");
  });

  it("evaluates preview entitlements correctly", async () => {
    const { PREVIEW_PLAN, checkEntitlement } = await import("./auth");
    expect(checkEntitlement(PREVIEW_PLAN, "desktop.download")).toBe(true);
    expect(checkEntitlement(PREVIEW_PLAN, "integration.gmail")).toBe(true);
    expect(checkEntitlement(PREVIEW_PLAN, "ai.local")).toBe(true);
    expect(checkEntitlement(PREVIEW_PLAN, "ai.cloud")).toBe(false);
    expect(checkEntitlement(PREVIEW_PLAN, "team.members")).toBe(false);
  });
});

