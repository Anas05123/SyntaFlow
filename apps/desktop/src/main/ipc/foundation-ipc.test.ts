import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { IpcMain, IpcMainInvokeEvent } from "electron";
import { afterEach, describe, expect, it } from "vitest";
import { createRuntimeServices } from "../../core/application-lifecycle/startup-health";
import { registerFoundationIpc } from "./foundation-ipc";
import { registerHealthIpc } from "./health-ipc";

type IpcHandler = (event: IpcMainInvokeEvent, input: unknown) => Promise<unknown>;

class FakeIpcMain {
  readonly handlers = new Map<string, IpcHandler>();

  handle(channel: string, handler: IpcHandler): void {
    this.handlers.set(channel, handler);
  }

  async invoke(channel: string, input?: unknown): Promise<unknown> {
    const handler = this.handlers.get(channel);
    if (!handler) throw new Error(`No handler registered for ${channel}.`);
    const senderUrl = "file:///project-atlas/index.html";
    return handler(
      {
        sender: { id: 1, getURL: () => senderUrl },
        senderFrame: { url: senderUrl },
      } as unknown as IpcMainInvokeEvent,
      input,
    );
  }
}

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories) {
    rmSync(directory, { recursive: true, force: true });
  }
  temporaryDirectories.length = 0;
});

describe("foundation IPC", () => {
  it("wires health, persistent settings, and jobs to the runtime services", async () => {
    const basePath = mkdtempSync(path.join(os.tmpdir(), "atlas-foundation-ipc-"));
    temporaryDirectories.push(basePath);
    const services = await createRuntimeServices(basePath);
    const fakeIpc = new FakeIpcMain();

    registerHealthIpc(services, fakeIpc as unknown as IpcMain);
    registerFoundationIpc(services, fakeIpc as unknown as IpcMain);

    await expect(fakeIpc.invoke("app:health")).resolves.toMatchObject({
      status: "ok",
      services: { database: "healthy", settings: "healthy", jobs: "healthy" },
    });
    await expect(fakeIpc.invoke("settings:update", { themeMode: "dark" })).resolves.toMatchObject({
      themeMode: "dark",
    });

    const job = await services.jobs.createJob({ type: "audit-smoke" });
    await expect(fakeIpc.invoke("jobs:list")).resolves.toMatchObject({
      jobs: [{ id: job.id, type: "audit-smoke", state: "queued" }],
    });

    services.database.close();
    const restartedServices = await createRuntimeServices(basePath);
    expect(restartedServices.settings.read().themeMode).toBe("dark");
    restartedServices.database.close();
  });
});
