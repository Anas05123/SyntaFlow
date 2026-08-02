import os from "node:os";
import { describe, expect, it } from "vitest";
import { createRuntimeServices, getStartupHealth } from "./startup-health";

describe("startup health aggregation", () => {
  it("reports safe service statuses without private paths", () => {
    const services = createRuntimeServices(os.tmpdir());
    const health = getStartupHealth(services);

    expect(health.status).toBe("ok");
    expect(health.services).toEqual({
      appDataPath: "healthy",
      settings: "healthy",
      logger: "healthy",
      jobs: "healthy",
      migrations: "healthy",
    });
    expect(JSON.stringify(health)).not.toContain(os.tmpdir());
  });
});
