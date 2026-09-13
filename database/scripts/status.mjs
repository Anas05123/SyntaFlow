import initSqlJs from "sql.js";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const dataRoot =
  process.env.COREDESK_DATA_PATH ??
  process.env.PROJECT_ATLAS_DATA_PATH ??
  (process.env.CI === "true"
    ? path.join(os.tmpdir(), "coredesk-ci-data", "ai-agency-os-development")
    : path.join(
        os.homedir(),
        "Documents",
        "CoreDesk Development Data",
        "ai-agency-os-development",
      ));
const databaseDirectory = path.join(dataRoot, "database");
const databasePath =
  existsSync(path.join(databaseDirectory, "atlas.sqlite")) &&
  !existsSync(path.join(databaseDirectory, "coredesk.sqlite"))
    ? path.join(databaseDirectory, "atlas.sqlite")
    : path.join(databaseDirectory, "coredesk.sqlite");

mkdirSync(databaseDirectory, { recursive: true });

const exists = existsSync(databasePath);
const SQL = await initSqlJs();
const database = exists ? new SQL.Database(readFileSync(databasePath)) : new SQL.Database();
database.exec("PRAGMA foreign_keys = ON");
const integrity = getOne(database, "PRAGMA integrity_check")?.integrity_check ?? "unknown";
const foreignKeysEnabled = getOne(database, "PRAGMA foreign_keys")?.foreign_keys === 1;
const journalMode = "delete";
const migrationsExist =
  getOne(
    database,
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'schema_migrations'",
  ) !== undefined;
const applied = migrationsExist
  ? getAll(database, "SELECT id, description, applied_at FROM schema_migrations ORDER BY id ASC")
  : [];

writeFileSync(databasePath, Buffer.from(database.export()));
database.close();

console.log(
  JSON.stringify(
    {
      status: integrity === "ok" && foreignKeysEnabled ? "healthy" : "unhealthy",
      databasePath,
      existedBeforeStatusCheck: exists,
      foreignKeysEnabled,
      journalMode,
      integrity,
      appliedMigrations: applied,
      productSchema: "not-created",
    },
    null,
    2,
  ),
);

function getOne(database, sql) {
  return getAll(database, sql)[0];
}

function getAll(database, sql) {
  const result = database.exec(sql)[0];
  if (!result) {
    return [];
  }

  return result.values.map((row) =>
    Object.fromEntries(result.columns.map((column, index) => [column, row[index]])),
  );
}
