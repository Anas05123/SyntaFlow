import { createHash } from "node:crypto";
import initSqlJs from "sql.js";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const repoRoot = process.cwd();
const dataRoot =
  process.env.PROJECT_ATLAS_DATA_PATH ??
  (process.env.CI === "true"
    ? path.join(os.tmpdir(), "project-atlas-ci-data", "ai-agency-os-development")
    : path.join(
        os.homedir(),
        "Documents",
        "Project Atlas Development Data",
        "ai-agency-os-development",
      ));
const databaseDirectory = path.join(dataRoot, "database");
const backupDirectory = path.join(dataRoot, "backups");
const databasePath = path.join(databaseDirectory, "atlas.sqlite");
const migrationPath = path.join(repoRoot, "migrations", "0001_foundation_metadata.sql");
const migration = {
  id: "0001_foundation_metadata",
  description: "Create foundation metadata and safe settings tables.",
  sql: readFileSync(migrationPath, "utf8"),
};

mkdirSync(databaseDirectory, { recursive: true });
mkdirSync(backupDirectory, { recursive: true });

const databaseExisted = existsSync(databasePath);
let backupPath = null;
if (databaseExisted) {
  const timestamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
  backupPath = path.join(backupDirectory, `atlas-before-migration-${timestamp}.sqlite`);
  if (existsSync(backupPath)) {
    throw new Error("Refusing to overwrite an existing migration backup.");
  }
  copyFileSync(databasePath, backupPath);
}

const SQL = await initSqlJs();
const database = databaseExisted
  ? new SQL.Database(readFileSync(databasePath))
  : new SQL.Database();
database.exec("PRAGMA foreign_keys = ON");
database.exec(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    checksum TEXT NOT NULL,
    app_version TEXT NOT NULL,
    applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const alreadyApplied = database.exec(
  `SELECT id FROM schema_migrations WHERE id = '${migration.id.replaceAll("'", "''")}'`,
)[0];
const applied = [];

if (!alreadyApplied) {
  database.exec("BEGIN IMMEDIATE");
  try {
    migration.sql
      .split("-- atlas:statement-breakpoint")
      .map((statement) => statement.trim())
      .filter(Boolean)
      .forEach((statement) => database.exec(statement));
    database.run(
      "INSERT INTO schema_migrations (id, description, checksum, app_version) VALUES (?, ?, ?, ?)",
      [migration.id, migration.description, checksum(migration.sql), "0.1.0"],
    );
    database.exec("COMMIT");
    applied.push(migration.id);
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

const migrationRows = database.exec(
  "SELECT id, description, applied_at FROM schema_migrations ORDER BY id ASC",
)[0];
const appliedMigrations = migrationRows
  ? migrationRows.values.map((row) =>
      Object.fromEntries(migrationRows.columns.map((column, index) => [column, row[index]])),
    )
  : [];
writeFileSync(databasePath, Buffer.from(database.export()));
database.close();

console.log(
  JSON.stringify(
    {
      status: "ok",
      databasePath,
      backupPath,
      applied,
      appliedMigrations,
      productSchema: "not-created",
    },
    null,
    2,
  ),
);

function checksum(value) {
  return createHash("sha256").update(value).digest("hex");
}
