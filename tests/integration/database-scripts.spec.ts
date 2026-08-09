import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

let temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories) {
    rmSync(directory, { recursive: true, force: true });
  }
  temporaryDirectories = [];
});

describe("database CLI scripts", () => {
  it("runs status, migrate and backup against isolated development data", () => {
    const dataRoot = mkdtempSync(path.join(os.tmpdir(), "atlas-db-scripts-"));
    temporaryDirectories.push(dataRoot);

    const initialStatus = runScript("status.mjs", dataRoot);
    expect(initialStatus.status).toBe("healthy");
    expect(initialStatus.productSchema).toBe("not-created");

    const migration = runScript("migrate.mjs", dataRoot);
    expect(migration.status).toBe("ok");
    expect(migration.applied).toEqual(["0001_foundation_metadata"]);
    expect(migration.productSchema).toBe("not-created");

    const backup = runScript("backup.mjs", dataRoot);
    expect(backup.status).toBe("ok");
    expect(backup.backupPath).toContain("atlas-manual-backup");
  });
});

function runScript(scriptName: string, dataRoot: string): Record<string, unknown> {
  const output = execFileSync("node", [path.join("scripts", "database", scriptName)], {
    cwd: process.cwd(),
    env: { ...process.env, PROJECT_ATLAS_DATA_PATH: dataRoot },
    encoding: "utf8",
  });

  return JSON.parse(output) as Record<string, unknown>;
}
