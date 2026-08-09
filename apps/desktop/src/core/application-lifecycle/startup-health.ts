import type { HealthResponse } from "@atlas/contracts";
import path from "node:path";
import { AtlasDatabaseConnection } from "../database/database-connection";
import { MigrationRunner } from "../database/migration-runner";
import { resolveAppDataPaths } from "../filesystem/app-data-paths";
import { JobService } from "../jobs/job-service";
import { StructuredLogger } from "../logging/structured-logger";
import { SettingsService } from "../settings/settings-service";

type ServiceStatus = HealthResponse["services"][keyof HealthResponse["services"]];

export interface RuntimeServices {
  settings: SettingsService;
  logger: StructuredLogger;
  jobs: JobService;
  migrations: MigrationRunner;
  database: AtlasDatabaseConnection;
  appDataBasePath: string;
}

export async function createRuntimeServices(appDataBasePath: string): Promise<RuntimeServices> {
  const paths = resolveAppDataPaths({ basePath: appDataBasePath, environment: "development" });
  const database = await AtlasDatabaseConnection.open(path.join(paths.database, "atlas.sqlite"));
  const migrations = new MigrationRunner({
    connection: database,
    migrations: [],
    backupDirectory: paths.backups,
    appVersion: "0.1.0",
  });

  return {
    settings: SettingsService.fromDatabase(database),
    logger: new StructuredLogger(),
    jobs: new JobService(),
    migrations,
    database,
    appDataBasePath,
  };
}

export function getStartupHealth(services: RuntimeServices): HealthResponse {
  return {
    status: "ok",
    appName: "AI Agency OS",
    version: "0.1.0",
    services: {
      appDataPath: safeStatus(() => {
        resolveAppDataPaths({ basePath: services.appDataBasePath, environment: "development" });
        return "healthy";
      }),
      settings: safeStatus(() => serviceHealthToStartupStatus(services.settings.healthCheck())),
      logger: safeStatus(() => services.logger.healthCheck()),
      jobs: safeStatus(() => services.jobs.healthCheck()),
      migrations: safeStatus(() => serviceHealthToStartupStatus(services.migrations.healthCheck())),
      database: safeStatus(() =>
        serviceHealthToStartupStatus(services.database.healthCheck().status),
      ),
    },
  };
}

function safeStatus(check: () => ServiceStatus): ServiceStatus {
  try {
    return check();
  } catch {
    return "unavailable";
  }
}

function serviceHealthToStartupStatus(status: "healthy" | "unhealthy"): ServiceStatus {
  return status === "healthy" ? "healthy" : "degraded";
}
