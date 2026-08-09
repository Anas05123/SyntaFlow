import os from "node:os";
import { mkdtempSync, rmSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createRuntimeServices, getStartupHealth } from "./startup-health";

describe("startup health aggregation", () => {
  it("reports safe service statuses without private paths", async () => {
    const basePath = mkdtempSync(path.join(os.tmpdir(), "atlas-startup-"));
    const services = await createRuntimeServices(basePath);
    const health = getStartupHealth(services);

    expect(health.status).toBe("ok");
    expect(health.services).toEqual({
      appDataPath: "healthy",
      settings: "healthy",
      logger: "healthy",
      jobs: "healthy",
      migrations: "healthy",
      database: "healthy",
    });
    expect(JSON.stringify(health)).not.toContain(basePath);
    services.database.close();
    rmSync(basePath, { recursive: true, force: true });
  });
});
