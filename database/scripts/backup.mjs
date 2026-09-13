import { copyFileSync, existsSync, mkdirSync } from "node:fs";
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
const backupPath = path.join(backupDirectory, `coredesk-manual-backup-${timestamp}.sqlite`);

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
