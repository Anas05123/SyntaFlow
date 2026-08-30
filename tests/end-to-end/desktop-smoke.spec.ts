import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect, test, type Browser, type Page } from "@playwright/test";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(testDirectory, "../..");
const electronCli = path.join(repositoryRoot, "node_modules/electron/cli.js");
const mainEntry = path.join(repositoryRoot, "apps/desktop/.vite/build/main.js");

interface AtlasRuntime {
  browser: Browser;
  child: ChildProcessWithoutNullStreams;
  page: Page;
}

let profileDirectory: string;
let runtime: AtlasRuntime | undefined;

async function getAvailablePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Could not reserve a local debugging port."));
        return;
      }
      server.close(() => resolve(address.port));
    });
  });
}

async function launchAtlas(): Promise<AtlasRuntime> {
  const port = await getAvailablePort();
  const child = spawn(
    process.execPath,
    [electronCli, `--remote-debugging-port=${port}`, mainEntry],
    {
      cwd: repositoryRoot,
      env: {
        ...process.env,
        ATLAS_APP_DATA_PATH: profileDirectory,
      },
      stdio: "pipe",
    },
  );
  let processOutput = "";
  child.stdout.on("data", (chunk: Buffer) => {
    processOutput += chunk.toString();
  });
  child.stderr.on("data", (chunk: Buffer) => {
    processOutput += chunk.toString();
  });

  const deadline = Date.now() + 15_000;
  let lastError: unknown;
  while (Date.now() < deadline && child.exitCode === null) {
    try {
      const browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
      const page = browser.contexts()[0]?.pages()[0];
      if (page) return { browser, child, page };
      await browser.close();
    } catch (error: unknown) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  child.kill();
  throw new Error(`Atlas did not expose its desktop window. ${processOutput}`, {
    cause: lastError,
  });
}

async function stopAtlas(activeRuntime: AtlasRuntime | undefined): Promise<void> {
  if (!activeRuntime) return;
  await activeRuntime.browser.close().catch(() => undefined);
  if (activeRuntime.child.exitCode === null) {
    activeRuntime.child.kill();
  }
  await new Promise<void>((resolve) => {
    if (activeRuntime.child.exitCode !== null) {
      resolve();
      return;
    }
    activeRuntime.child.once("exit", () => resolve());
    setTimeout(resolve, 2_000);
  });
}

test.beforeEach(() => {
  profileDirectory = mkdtempSync(path.join(os.tmpdir(), "atlas-desktop-smoke-"));
});

test.afterEach(async () => {
  await stopAtlas(runtime);
  rmSync(profileDirectory, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
});

test("launches the secured desktop foundation and persists its theme", async ({}, testInfo) => {
  runtime = await launchAtlas();
  let { page } = runtime;

  await expect(page).toHaveTitle("AI Agency OS");
  await expect(
    page.getByRole("heading", { name: "Application foundation is online" }),
  ).toBeVisible();
  await expect(page.getByText("6/6")).toBeVisible();

  const rendererBoundary = await page.evaluate(() => ({
    atlasKeys: Object.keys(window.atlas).sort(),
    csp: document
      .querySelector('meta[http-equiv="Content-Security-Policy"]')
      ?.getAttribute("content"),
    nodeProcess: typeof (window as Window & { process?: unknown }).process,
    nodeRequire: typeof (window as Window & { require?: unknown }).require,
  }));
  expect(rendererBoundary).toMatchObject({
    atlasKeys: ["app", "jobs", "settings"],
    nodeProcess: "undefined",
    nodeRequire: "undefined",
  });
  expect(rendererBoundary.csp).toContain("object-src 'none'");
  expect(await page.evaluate(() => Notification.requestPermission())).toBe("denied");

  const initialPageCount = page.context().pages().length;
  await page.evaluate(() => window.open("http://127.0.0.1:9/"));
  await expect.poll(() => page.context().pages().length).toBe(initialPageCount);

  await page.getByRole("button", { name: "View System Health" }).click();
  await expect(page.getByRole("heading", { name: "System Health", level: 2 })).toBeVisible();
  await expect(page.getByText("healthy", { exact: true })).toHaveCount(6);

  await page.getByRole("button", { name: /^Jobs 0$/ }).click();
  await expect(page.getByRole("heading", { name: "No background jobs" })).toBeVisible();

  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByLabel("Theme").selectOption("dark");
  await expect(page.getByText("Settings saved.")).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe("dark");

  await stopAtlas(runtime);
  runtime = await launchAtlas();
  page = runtime.page;

  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe("dark");
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.getByLabel("Theme")).toHaveValue("dark");
  await page.getByRole("button", { name: "Command Center" }).click();
  await page.screenshot({
    path: testInfo.outputPath("task-004-command-center.png"),
    fullPage: true,
  });
});
