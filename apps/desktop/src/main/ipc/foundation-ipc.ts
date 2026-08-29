import { ipcMain } from "electron";
import { z } from "zod";
import {
  jobsResponseSchema,
  settingsSchema,
  settingsUpdateSchema,
  type SafeSettings,
} from "@atlas/contracts";
import type { RuntimeServices } from "../../core/application-lifecycle/startup-health";
import { registerSecureIpc } from "./secure-ipc";

export function registerFoundationIpc(services: RuntimeServices): void {
  registerSecureIpc(
    ipcMain,
    {
      channel: "settings:read",
      permission: "settings.read",
      inputSchema: z.void(),
      outputSchema: settingsSchema,
      handler: () => services.settings.read(),
      audit: () => {
        services.logger.debug({
          module: "settings",
          operation: "read",
          message: "Settings requested.",
        });
      },
    },
    services.logger,
  );

  registerSecureIpc(
    ipcMain,
    {
      channel: "settings:update",
      permission: "settings.write",
      inputSchema: settingsUpdateSchema,
      outputSchema: settingsSchema,
      handler: (patch: Partial<SafeSettings>) => services.settings.update(patch),
      audit: () => {
        services.logger.debug({
          module: "settings",
          operation: "update",
          message: "Safe settings update requested.",
        });
      },
    },
    services.logger,
  );

  registerSecureIpc(
    ipcMain,
    {
      channel: "jobs:list",
      permission: "jobs.read",
      inputSchema: z.void(),
      outputSchema: jobsResponseSchema,
      handler: () => ({ jobs: services.jobs.listJobs() }),
      audit: () => {
        services.logger.debug({
          module: "jobs",
          operation: "list",
          message: "Job list requested.",
        });
      },
    },
    services.logger,
  );
}
