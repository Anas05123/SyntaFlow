import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveAppDataPaths, resolveChildPath } from "./app-data-paths";

describe("resolveAppDataPaths", () => {
  it("resolves approved data directories outside the repository", () => {
    const paths = resolveAppDataPaths({
      basePath: os.tmpdir(),
      environment: "test",
    });

    expect(paths.root).toContain("ai-agency-os-test");
    expect(paths.database).toBe(path.join(paths.root, "database"));
    expect(paths.logs).toBe(path.join(paths.root, "logs"));
  });

  it("rejects path traversal child segments", () => {
    expect(() => resolveChildPath(os.tmpdir(), "../outside")).toThrow("path traversal");
  });
});
