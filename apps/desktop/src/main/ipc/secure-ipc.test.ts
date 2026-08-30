import { z } from "zod";
import { describe, expect, it } from "vitest";
import { MemoryLogSink, StructuredLogger } from "../../core/logging/structured-logger";
import { AtlasApplicationError } from "../../shared/kernel/application-error";
import { registerSecureIpc } from "./secure-ipc";

interface FakeIpcEvent {
  sender: { id: number; getURL: () => string };
  senderFrame: { url: string } | null;
}

type IpcCallback = (event: FakeIpcEvent, input: unknown) => Promise<unknown>;

function createFakeIpc(): {
  ipc: never;
  invoke: (input: unknown, senderUrl?: string) => Promise<unknown>;
} {
  let callback: IpcCallback | null = null;

  return {
    ipc: {
      handle: (_channel: string, registeredCallback: IpcCallback) => {
        callback = registeredCallback;
      },
    } as never,
    invoke: (input: unknown, senderUrl = "file:///project-atlas/index.html") => {
      if (!callback) {
        throw new Error("IPC callback was not registered.");
      }

      return callback(
        {
          sender: { id: 1, getURL: () => senderUrl },
          senderFrame: { url: senderUrl },
        },
        input,
      );
    },
  };
}

describe("registerSecureIpc", () => {
  it("validates input and output", async () => {
    const fakeIpc = createFakeIpc();
    const logger = new StructuredLogger();

    registerSecureIpc(
      fakeIpc.ipc,
      {
        channel: "test:echo",
        permission: "test.read",
        inputSchema: z.object({ name: z.string() }),
        outputSchema: z.object({ greeting: z.string() }),
        handler: (input) => ({ greeting: `hello ${input.name}` }),
      },
      logger,
    );

    await expect(fakeIpc.invoke({ name: "Atlas" })).resolves.toEqual({
      greeting: "hello Atlas",
    });
  });

  it("returns safe errors and logs failed requests", async () => {
    const fakeIpc = createFakeIpc();
    const sink = new MemoryLogSink();
    const logger = new StructuredLogger(sink);

    registerSecureIpc(
      fakeIpc.ipc,
      {
        channel: "test:fail",
        permission: "test.read",
        inputSchema: z.void(),
        outputSchema: z.object({ ok: z.literal(true) }),
        handler: () => {
          throw new AtlasApplicationError({
            code: "NO_PERMISSION",
            message: "Permission denied.",
            category: "permission",
            retryable: false,
          });
        },
      },
      logger,
    );

    await expect(fakeIpc.invoke(undefined)).resolves.toEqual({
      error: {
        code: "NO_PERMISSION",
        message: "Permission denied.",
        category: "permission",
        retryable: false,
      },
    });
    expect(sink.events[0]?.level).toBe("security");
  });

  it("rejects invalid senders before calling the handler", async () => {
    const fakeIpc = createFakeIpc();
    const logger = new StructuredLogger();
    let handlerCalled = false;

    registerSecureIpc(
      fakeIpc.ipc,
      {
        channel: "test:sender",
        permission: "test.read",
        inputSchema: z.void(),
        outputSchema: z.object({ ok: z.literal(true) }),
        validateSender: () => false,
        handler: () => {
          handlerCalled = true;
          return { ok: true };
        },
      },
      logger,
    );

    await expect(fakeIpc.invoke(undefined)).resolves.toEqual({
      error: {
        code: "ATLAS_SYSTEM_ERROR",
        message: "The operation failed safely.",
        category: "system",
        retryable: false,
      },
    });
    expect(handlerCalled).toBe(false);
  });

  it("rejects untrusted senders by default", async () => {
    const fakeIpc = createFakeIpc();
    const logger = new StructuredLogger();
    let handlerCalled = false;

    registerSecureIpc(
      fakeIpc.ipc,
      {
        channel: "test:sender-default",
        permission: "test.read",
        inputSchema: z.void(),
        outputSchema: z.object({ ok: z.literal(true) }),
        handler: () => {
          handlerCalled = true;
          return { ok: true };
        },
      },
      logger,
    );

    await expect(fakeIpc.invoke(undefined, "https://example.com/")).resolves.toMatchObject({
      error: { code: "ATLAS_SYSTEM_ERROR" },
    });
    expect(handlerCalled).toBe(false);
  });
});
