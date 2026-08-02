import type { IpcMain, IpcMainInvokeEvent } from "electron";
import type { z } from "zod";
import { StructuredLogger } from "../../core/logging/structured-logger";
import { toSafeApplicationError } from "../../shared/kernel/application-error";

export interface SecureIpcContext {
  senderId: number;
  channel: string;
}

export interface SecureIpcDefinition<TInput, TOutput> {
  channel: string;
  permission: string;
  inputSchema: z.ZodType<TInput>;
  outputSchema: z.ZodType<TOutput>;
  handler(input: TInput, context: SecureIpcContext): Promise<TOutput> | TOutput;
  validateSender?: (event: IpcMainInvokeEvent) => boolean;
  audit?: (context: SecureIpcContext, input: TInput) => void;
}

export function registerSecureIpc<TInput, TOutput>(
  ipcMain: IpcMain,
  definition: SecureIpcDefinition<TInput, TOutput>,
  logger: StructuredLogger,
): void {
  ipcMain.handle(definition.channel, async (event: IpcMainInvokeEvent, rawInput: unknown) => {
    const context: SecureIpcContext = {
      senderId: event.sender.id,
      channel: definition.channel,
    };

    try {
      if (definition.validateSender && !definition.validateSender(event)) {
        throw new Error("IPC sender validation failed.");
      }

      const input = definition.inputSchema.parse(rawInput);
      definition.audit?.(context, input);
      const output = await definition.handler(input, context);
      return definition.outputSchema.parse(output);
    } catch (error: unknown) {
      const safeError = toSafeApplicationError(error);
      logger.security({
        module: "ipc",
        operation: definition.channel,
        message: `IPC request failed safely: ${safeError.code}`,
        metadata: { channel: definition.channel, permission: definition.permission },
      });
      return { error: safeError };
    }
  });
}
