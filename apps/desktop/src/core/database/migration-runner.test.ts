import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { AtlasDatabaseConnection } from "./database-connection";
import { MigrationRunner, type BackupHook, foundationMigrations } from "./migration-runner";

let temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories) {
    rmSync(directory, { recursive: true, force: true });
  }
  temporaryDirectories = [];
});

describe("MigrationRunner", () => {
  it("reports pending migrations before migration", async () => {
    const fixture = await createFixture();
    const runner = createRunner(fixture.connection, fixture.backups);

    expect(runner.status()).toMatchObject({
      applied: [],
      pending: [{ id: "0001_foundation_metadata" }],
      health: "healthy",
    });

    fixture.connection.close();
  });

  it("applies foundation migrations transactionally and idempotently", async () => {
    const fixture = await createFixture();
    const runner = createRunner(fixture.connection, fixture.backups);

    expect(runner.applyPending().applied).toEqual(["0001_foundation_metadata"]);
    expect(runner.applyPending().applied).toEqual([]);
    expect(runner.status()).toMatchObject({ pending: [] });
    expect(listUserTables(fixture.connection)).toEqual([
      "app_settings",
      "foundation_metadata",
      "schema_migrations",
    ]);

    fixture.connection.close();
  });

  it("keeps failed migrations out of metadata and rolls back tables", async () => {
    const fixture = await createFixture();
    const runner = new MigrationRunner({
      connection: fixture.connection,
      migrations: [
        {
          id: "0001_bad",
          description: "Bad migration",
          sql: "CREATE TABLE should_not_exist (id TEXT PRIMARY KEY); -- atlas:statement-breakpoint SELECT * FROM missing_table;",
        },
      ],
      backupDirectory: fixture.backups,
      appVersion: "0.1.0",
    });

    expect(() => runner.applyPending()).toThrow();
    expect(runner.status().applied).toEqual([]);
    expect(listUserTables(fixture.connection)).toEqual(["schema_migrations"]);

    fixture.connection.close();
  });

  it("invokes the backup hook before existing database migrations", async () => {
    const fixture = await createFixture();
    let invoked = 0;
    const backupHook: BackupHook = {
      beforeMigrate() {
        invoked += 1;
        return null;
      },
    };
    const runner = createRunner(fixture.connection, fixture.backups, backupHook);

    runner.applyPending();

    expect(invoked).toBe(1);
    fixture.connection.close();
  });

  it("reports database health with foreign keys enabled", async () => {
    const fixture = await createFixture();

    expect(fixture.connection.healthCheck()).toMatchObject({
      status: "healthy",
      foreignKeysEnabled: true,
      integrity: "ok",
    });

    fixture.connection.close();
  });
});

async function createFixture(): Promise<{
  root: string;
  backups: string;
  connection: AtlasDatabaseConnection;
}> {
  const root = mkdtempSync(path.join(os.tmpdir(), "atlas-db-"));
  temporaryDirectories.push(root);
  return {
    root,
    backups: path.join(root, "backups"),
    connection: await AtlasDatabaseConnection.open(path.join(root, "database", "atlas.sqlite")),
  };
}

function createRunner(
  connection: AtlasDatabaseConnection,
  backupDirectory: string,
  backupHook?: BackupHook,
): MigrationRunner {
  return new MigrationRunner({
    connection,
    migrations: foundationMigrations,
    backupDirectory,
    appVersion: "0.1.0",
    ...(backupHook ? { backupHook } : {}),
  });
}

function listUserTables(connection: AtlasDatabaseConnection): string[] {
  return connection
    .all<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name ASC",
    )
    .map((row) => row.name);
}
