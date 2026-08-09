import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { AtlasApplicationError } from "../../shared/kernel/application-error";
import type { AtlasDatabaseConnection } from "./database-connection";

export interface MigrationDefinition {
  id: string;
  description: string;
  sql: string;
}

export interface MigrationRecord {
  id: string;
  description: string;
  checksum: string;
  appVersion: string;
  appliedAt: string;
}

export interface MigrationStatus {
  applied: MigrationRecord[];
  pending: MigrationDefinition[];
  health: "healthy" | "unhealthy";
}

export interface BackupHook {
  beforeMigrate(input: { databasePath: string; backupDirectory: string }): string | null;
}

export interface MigrationRunnerOptions {
  connection: AtlasDatabaseConnection;
  migrations: MigrationDefinition[];
  backupDirectory: string;
  appVersion: string;
  backupHook?: BackupHook;
}

export class LocalCopyBackupHook implements BackupHook {
  beforeMigrate(input: { databasePath: string; backupDirectory: string }): string | null {
    if (!existsSync(input.databasePath)) {
      return null;
    }

    mkdirSync(input.backupDirectory, { recursive: true });
    const timestamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
    const backupPath = path.join(
      input.backupDirectory,
      `atlas-before-migration-${timestamp}.sqlite`,
    );

    if (existsSync(backupPath)) {
      throw new AtlasApplicationError({
        code: "DATABASE_BACKUP_EXISTS",
        message: "Database backup already exists and will not be overwritten.",
        category: "conflict",
        retryable: true,
      });
    }

    copyFileSync(input.databasePath, backupPath);
    return backupPath;
  }
}

export class MigrationRunner {
  private readonly connection: AtlasDatabaseConnection;
  private readonly migrations: MigrationDefinition[];
  private readonly backupDirectory: string;
  private readonly appVersion: string;
  private readonly backupHook: BackupHook;

  constructor(options: MigrationRunnerOptions) {
    this.connection = options.connection;
    this.migrations = [...options.migrations].sort((left, right) =>
      left.id.localeCompare(right.id),
    );
    this.backupDirectory = options.backupDirectory;
    this.appVersion = options.appVersion;
    this.backupHook = options.backupHook ?? new LocalCopyBackupHook();
  }

  status(): MigrationStatus {
    this.ensureMigrationTable();
    const applied = this.listApplied();
    const appliedIds = new Set(applied.map((record) => record.id));

    return {
      applied,
      pending: this.migrations.filter((migration) => !appliedIds.has(migration.id)),
      health: this.connection.healthCheck().status,
    };
  }

  applyPending(): { applied: string[]; backupPath: string | null } {
    this.ensureMigrationTable();
    const { pending } = this.status();
    const applied: string[] = [];

    if (pending.length === 0) {
      return { applied, backupPath: null };
    }

    const backupPath = this.backupHook.beforeMigrate({
      databasePath: this.connection.databasePath,
      backupDirectory: this.backupDirectory,
    });

    for (const migration of pending) {
      this.connection.transaction(() => {
        migration.sql
          .split("-- atlas:statement-breakpoint")
          .map((statement) => statement.trim())
          .filter(Boolean)
          .forEach((statement) => {
            this.connection.execute(statement);
          });

        this.recordApplied(migration);
      });
      applied.push(migration.id);
    }

    return { applied, backupPath };
  }

  healthCheck(): "healthy" | "unhealthy" {
    return this.connection.healthCheck().status;
  }

  private ensureMigrationTable(): void {
    this.connection.execute(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id TEXT PRIMARY KEY,
        description TEXT NOT NULL,
        checksum TEXT NOT NULL,
        app_version TEXT NOT NULL,
        applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  private listApplied(): MigrationRecord[] {
    return this.connection
      .all<{
        id: string;
        description: string;
        checksum: string;
        app_version: string;
        applied_at: string;
      }>(
        `
      SELECT id, description, checksum, app_version, applied_at
      FROM schema_migrations
      ORDER BY id ASC
    `,
      )
      .map((row) => ({
        id: row.id,
        description: row.description,
        checksum: row.checksum,
        appVersion: row.app_version,
        appliedAt: row.applied_at,
      }));
  }

  private recordApplied(migration: MigrationDefinition): void {
    this.connection.run(
      `
        INSERT INTO schema_migrations (id, description, checksum, app_version)
        VALUES (?, ?, ?, ?)
      `,
      [migration.id, migration.description, checksum(migration.sql), this.appVersion],
    );
  }
}

export const foundationMigrations: MigrationDefinition[] = [
  {
    id: "0001_foundation_metadata",
    description: "Create foundation metadata and safe settings tables.",
    sql: `
      CREATE TABLE IF NOT EXISTS foundation_metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- atlas:statement-breakpoint

      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- atlas:statement-breakpoint

      INSERT INTO foundation_metadata (key, value)
      VALUES ('foundation_schema_version', '1')
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP;
    `,
  },
];

function checksum(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
