import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = process.cwd();

function readSource(relativePath: string): string {
  return readFileSync(path.join(repositoryRoot, relativePath), "utf8");
}

function rendererSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return rendererSourceFiles(entryPath);
    return /\.[jt]sx?$/.test(entry.name) ? [entryPath] : [];
  });
}

describe("Electron security regression guards", () => {
  it("keeps hardened BrowserWindow and app-level protections enabled", () => {
    const mainSource = readSource("apps/desktop/src/main/index.ts");
    const windowSecuritySource = readSource("apps/desktop/src/main/security/window-security.ts");
    const secureIpcSource = readSource("apps/desktop/src/main/ipc/secure-ipc.ts");

    expect(mainSource).toMatch(/nodeIntegration:\s*false/);
    expect(mainSource).toMatch(/contextIsolation:\s*true/);
    expect(mainSource).toMatch(/sandbox:\s*true/);
    expect(mainSource).toContain("setPermissionRequestHandler");
    expect(mainSource).toContain("setWindowOpenHandler");
    expect(windowSecuritySource).toContain('webContents.on("will-navigate"');
    expect(windowSecuritySource).toContain('webContents.on("will-frame-navigate"');
    expect(windowSecuritySource).toContain("Content-Security-Policy");
    expect(secureIpcSource).toContain("validateIpcSender");
  });

  it("keeps privileged modules and APIs out of the renderer", () => {
    const rendererRoot = path.join(repositoryRoot, "apps/desktop/src/renderer");
    const source = rendererSourceFiles(rendererRoot)
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");

    expect(source).not.toMatch(
      /from\s+["'](?:electron|node:|fs(?:[\/"'])|path["']|os["']|sql\.js)/,
    );
    expect(source).not.toMatch(/\b(?:ipcRenderer|webFrame|remote)\b/);
    expect(source).not.toMatch(/\b(?:require|process)\s*[.(]/);
  });
});
