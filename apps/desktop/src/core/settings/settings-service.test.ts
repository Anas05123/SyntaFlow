import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { AtlasApplicationError } from "../../shared/kernel/application-error";
import { AtlasDatabaseConnection } from "../database/database-connection";
import { SettingsService, defaultSettings } from "./settings-service";

let temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories) {
    rmSync(directory, { recursive: true, force: true });
  }
  temporaryDirectories = [];
});

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

  it("persists safe settings across restarts", async () => {
    const fixture = await createConnection();
    const service = SettingsService.fromDatabase(fixture.connection);

    service.update({ themeMode: "dark", logLevel: "debug" });
    fixture.connection.close();

    const restarted = await AtlasDatabaseConnection.open(fixture.databasePath);
    const restartedService = SettingsService.fromDatabase(restarted);

    expect(restartedService.read()).toMatchObject({ themeMode: "dark", logLevel: "debug" });
    restarted.close();
  });

  it("repairs invalid persisted settings by returning to defaults", async () => {
    const fixture = await createConnection();
    fixture.connection.execute(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    fixture.connection.run("INSERT INTO app_settings (key, value) VALUES (?, ?)", [
      "safe_settings",
      JSON.stringify({ themeMode: "neon" }),
    ]);

    const service = SettingsService.fromDatabase(fixture.connection);

    expect(service.read()).toEqual(defaultSettings);
    expect(service.recoveryStatus()).toBe("invalid-persisted-settings");
    fixture.connection.close();
  });

  it("rejects sensitive settings instead of storing them in SQLite", async () => {
    const fixture = await createConnection();
    const service = SettingsService.fromDatabase(fixture.connection);

    expect(() => service.update({ apiKey: "secret-value" })).toThrow(AtlasApplicationError);
    fixture.connection.close();
  });
});

async function createConnection(): Promise<{
  root: string;
  databasePath: string;
  connection: AtlasDatabaseConnection;
}> {
  const root = mkdtempSync(path.join(os.tmpdir(), "atlas-settings-"));
  temporaryDirectories.push(root);
  const databasePath = path.join(root, "database", "atlas.sqlite");
  return {
    root,
    databasePath,
    connection: await AtlasDatabaseConnection.open(databasePath),
  };
}
