import { ipcMain, type IpcMain } from "electron";
import { z } from "zod";
import { healthResponseSchema } from "@atlas/contracts";
import type { RuntimeServices } from "../../core/application-lifecycle/startup-health";
import { getStartupHealth } from "../../core/application-lifecycle/startup-health";
import { StructuredLogger } from "../../core/logging/structured-logger";
import { registerSecureIpc } from "./secure-ipc";

const channel = "app:health";

export function registerHealthIpc(services: RuntimeServices, target: IpcMain = ipcMain): void {
  registerSecureIpc(
    target,
    {
      channel,
      permission: "app.health.read",
      inputSchema: z.void(),
      outputSchema: healthResponseSchema,
      handler: () => getStartupHealth(services),
      audit: () => {
        services.logger.debug({
          module: "app",
          operation: "health",
          message: "Health check requested.",
        });
      },
    },
    services.logger,
  );
}

export function createTestHealthLogger(): StructuredLogger {
  return new StructuredLogger();
}
