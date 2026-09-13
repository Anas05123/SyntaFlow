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
