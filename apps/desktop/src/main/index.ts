import { app, BrowserWindow, shell, session } from "electron";
import started from "electron-squirrel-startup";
import os from "node:os";
import path from "node:path";
import { createRuntimeServices } from "../core/application-lifecycle/startup-health";
import { registerHealthIpc } from "./ipc/health-ipc";
import { applyWindowSecurity } from "./security/window-security";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

if (started) {
  app.quit();
}

const createMainWindow = async (): Promise<void> => {
  const preloadPath = path.join(__dirname, "../preload/index.js");

  const window = new BrowserWindow({
    width: 1200,
    height: 780,
    minWidth: 960,
    minHeight: 640,
    title: "AI Agency OS",
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
    },
  });

  applyWindowSecurity(window);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    await window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    await window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
};

void app.whenReady().then(async () => {
  const runtimeServices = createRuntimeServices(
    path.join(os.homedir(), "Documents", "Project Atlas Data"),
  );

  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });

  registerHealthIpc(runtimeServices);
  await createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createMainWindow();
    }
  });
});

app.on("web-contents-created", (_event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) {
      void shell.openExternal(url);
    }

    return { action: "deny" };
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
