import type { HealthResponse } from "@atlas/contracts";
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
  appDataBasePath: string;
}

export function createRuntimeServices(appDataBasePath: string): RuntimeServices {
  return {
    settings: new SettingsService(),
    logger: new StructuredLogger(),
    jobs: new JobService(),
    migrations: new MigrationRunner([]),
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
      settings: safeStatus(() => services.settings.healthCheck()),
      logger: safeStatus(() => services.logger.healthCheck()),
      jobs: safeStatus(() => services.jobs.healthCheck()),
      migrations: safeStatus(() => services.migrations.healthCheck()),
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
