import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";

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
const databasePath = path.join(dataRoot, "database", "atlas.sqlite");
const backupDirectory = path.join(dataRoot, "backups");

mkdirSync(backupDirectory, { recursive: true });

if (!existsSync(databasePath)) {
  console.log(
    JSON.stringify(
      {
        status: "skipped",
        reason: "Database file does not exist yet.",
        databasePath,
        productSchema: "not-created",
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const timestamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
const backupPath = path.join(backupDirectory, `atlas-manual-backup-${timestamp}.sqlite`);

if (existsSync(backupPath)) {
  throw new Error("Refusing to overwrite an existing database backup.");
}

copyFileSync(databasePath, backupPath);

console.log(
  JSON.stringify(
    {
      status: "ok",
      databasePath,
      backupPath,
      productSchema: "not-created",
    },
    null,
    2,
  ),
);
