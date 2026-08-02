import { describe, expect, it } from "vitest";
import { healthResponseSchema } from "./index";

describe("healthResponseSchema", () => {
  it("accepts a valid health response", () => {
    const services = {
      appDataPath: "healthy",
      settings: "healthy",
      logger: "healthy",
      jobs: "healthy",
      migrations: "healthy",
    } as const;

    expect(
      healthResponseSchema.parse({
        status: "ok",
        appName: "AI Agency OS",
        version: "0.1.0",
        services,
      }),
    ).toEqual({
      status: "ok",
      appName: "AI Agency OS",
      version: "0.1.0",
      services,
    });
  });
});
