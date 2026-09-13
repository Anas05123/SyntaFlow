/**
 * CoreDesk desktop runtime.
 *
 * CoreDesk is an Electron application, so the renderer must be reviewed inside
 * a real BrowserWindow — window constraints, native font rasterisation, device
 * scale factor, keyboard handling and the paint before first frame are all
 * things a browser tab either hides or gets wrong.
 *
 * Modes:
 *   dev    — load the Vite dev server (CD_DEV_URL), for hot inspection
 *   built  — load dist/index.html from disk, the shipped artifact
 */

const { app, BrowserWindow, shell, screen, ipcMain, Menu, nativeImage } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');

const { WindowStateManager, DEFAULT_BOUNDS } = require('./window-state.cjs');
const { AuthService } = require('./auth/auth-service.cjs');

app.setName('CoreDesk');
if (process.platform === 'win32') {
  app.setAppUserModelId('com.coredesk.app');
}
try {
  app.setPath('userData', path.join(app.getPath('appData'), 'CoreDesk'));
} catch (_e) {}

/** Resolve the canonical CoreDesk application icon (ICO on Windows, high-res PNG fallback) */
const APP_ICON_PATH = (() => {
  const icoCandidate = path.join(__dirname, 'icon.ico');
  const pngCandidate = path.join(__dirname, 'icon.png');
  if (process.platform === 'win32' && fs.existsSync(icoCandidate)) {
    return icoCandidate;
  }
  if (fs.existsSync(pngCandidate)) {
    return pngCandidate;
  }
  const publicCandidate = path.join(__dirname, '..', 'public', 'coredesk-icon.png');
  if (fs.existsSync(publicCandidate)) {
    return publicCandidate;
  }
  return path.join(__dirname, '..', 'src', 'assets', 'coredesk-mark.png');
})();

/* ---- Desktop window contract -------------------------------------------- */

const DEFAULT_WINDOW = { width: DEFAULT_BOUNDS.width, height: DEFAULT_BOUNDS.height };

/* The CoreDesk canvas. Setting it on the window prevents the white flash a
 * default Electron window paints before the renderer's first frame. */
const CANVAS = '#0B0D0F';

const mode = (process.env.CD_ELECTRON_MODE || '').trim() === 'dev' ? 'dev' : 'built';
const devUrl = process.env.CD_DEV_URL || 'http://localhost:5173';
const outDir = process.env.CD_OUT || path.join(__dirname, '..', '.shots', 'electron');
const width = Number(process.env.CD_WIDTH || DEFAULT_WINDOW.width);
const height = Number(process.env.CD_HEIGHT || DEFAULT_WINDOW.height);

const isSurvey = (process.env.CD_SURVEY || '').trim() === '1' || process.argv.includes('--survey');
const interactive = isSurvey ? false : ((process.env.CD_INTERACTIVE || '1').trim() !== '0');
const startRoute = (process.env.CD_ROUTE || '#/home').trim();

/** Single-instance lock: focus existing instance when another is started */
let mainWindow = null;
if (interactive && !isSurvey) {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
    process.exit(0);
  }
  app.on('second-instance', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

/** `#/auth|a01-ready,#/auth?state=loading|a01-loading` */
const targets = (process.env.CD_ROUTES || '#/auth|electron')
  .split(',')
  .map((entry) => entry.trim())
  .filter(Boolean)
  .map((entry) => {
    const [route, shot] = entry.split('|');
    return { route, shot: shot || 'electron' };
  });

function report(payload) {
  process.stdout.write(`CD_ELECTRON_REPORT ${JSON.stringify(payload)}\n`);
}

/** Everything the desktop runtime should be able to assert about a screen. */
const PROBE = `(() => {
  const h1 = document.querySelector('h1, .auth-headline');
  const cs = h1 ? getComputedStyle(h1) : null;
  const lh = cs ? parseFloat(cs.lineHeight) : 0;
  const rect = h1 ? h1.getBoundingClientRect() : null;
  const mark = document.querySelector('.brand-mark img');
  const markWrap = document.querySelector('.brand-mark');
  const markBox = mark ? mark.getBoundingClientRect() : null;
  const markWrapBox = markWrap ? markWrap.getBoundingClientRect() : null;
  const bridge = window.coreDeskDesktop;
  return {
    inner: [window.innerWidth, window.innerHeight],
    dpr: window.devicePixelRatio,
    title: document.title,
    url: location.hash,
    bodyText: document.body.innerText.length,
    fontsReady: document.fonts.status,
    interLoaded: [...document.fonts].some(f => f.family.includes('Inter') && f.status === 'loaded'),
    headlineLines: rect && lh ? Math.round(rect.height / lh) : 0,
    headlineFont: cs ? cs.fontSize : null,
    headlineFamily: cs ? cs.fontFamily.split(',')[0] : null,
    stations: document.querySelectorAll('.cd-scene-mark').length,
    sceneMarks: document.querySelectorAll('.cd-scene-mark').length,
    sweeps: document.querySelectorAll('.cd-scene-light').length,
    actionCount: document.querySelectorAll('.cd-action').length,
    insideAppFrame: !!document.querySelector('.cd-app, .shell, .guest'),
    markLoaded: (() => {
      const marks = [...document.querySelectorAll('img')].filter((i) =>
        /coredesk-mark[^/]*\\.png/.test(i.getAttribute('src') || '')
      );
      if (!marks.length) return null;
      return marks.every((i) => i.complete && i.naturalWidth > 0);
    })(),
    markCount: [...document.querySelectorAll('img')].filter((i) =>
      /coredesk-mark[^/]*\\.png/.test(i.getAttribute('src') || '')
    ).length,
    scrollW: document.documentElement.scrollWidth,
    scrollH: document.documentElement.scrollHeight,
    controlsCount: document.querySelectorAll('.cd-control').length,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    canvasBg: getComputedStyle(document.documentElement).getPropertyValue('--canvas').trim(),
    hasNodeRequire: typeof window.require !== 'undefined',
    bridgeRuntime: bridge ? bridge.runtime : null,
    markComplete: mark ? mark.complete : null,
    markNatural: mark ? [mark.naturalWidth, mark.naturalHeight] : null,
    markBox: markBox ? [Math.round(markBox.width), Math.round(markBox.height)] : null,
    markWrapBox: markWrapBox
      ? [Math.round(markWrapBox.x), Math.round(markWrapBox.width), Math.round(markWrapBox.height)]
      : null,
    markSrc: mark ? mark.getAttribute('src') : null,
    focusables: [...document.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter(el => el.offsetParent !== null)
      .map(el => (el.className && typeof el.className === 'string' ? el.className.split(' ')[0] : el.tagName.toLowerCase())),
    leaked: (document.body.innerText.match(/undefined|NaN|\\[object Object\\]/g) || []).slice(0, 4),
  };
})()`;

// Initialize persistent window state manager & auth service
const windowStateManager = new WindowStateManager(app.getPath('userData'), {
  width,
  height,
  minWidth: 960,
  minHeight: 640,
});
const authService = AuthService.createDefault(app.getPath('userData'));

function createWindow() {
  const displays = screen ? screen.getAllDisplays() : [];
  const primaryDisplay = screen ? screen.getPrimaryDisplay() : null;
  const safeBounds = windowStateManager.getSafeBounds(displays, primaryDisplay);

  const win = new BrowserWindow({
    x: safeBounds.x,
    y: safeBounds.y,
    width: safeBounds.width,
    height: safeBounds.height,
    minWidth: 960,
    minHeight: 640,
    show: false, // Hidden until ready-to-show to prevent white flash / layout jumps
    backgroundColor: CANVAS,
    title: 'CoreDesk',
    icon: APP_ICON_PATH,
    frame: false, // Frameless custom desktop chrome
    autoHideMenuBar: true,
    resizable: true,
    roundedCorners: true,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      zoomFactor: 1,
    },
  });

  if (APP_ICON_PATH && fs.existsSync(APP_ICON_PATH)) {
    try {
      const nImg = nativeImage.createFromPath(APP_ICON_PATH);
      if (!nImg.isEmpty()) {
        win.setIcon(nImg);
      } else {
        win.setIcon(APP_ICON_PATH);
      }
    } catch (_e) {
      try {
        win.setIcon(APP_ICON_PATH);
      } catch (_e2) {}
    }
  }

  win.setMenuBarVisibility(false);
  try {
    Menu.setApplicationMenu(null);
  } catch (_e) {}

  // Multi-monitor & geometry persistence binding
  windowStateManager.manage(win);

  /* External links belong in the user's browser, never in an app window. */
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) void shell.openExternal(url);
    return { action: 'deny' };
  });

  /* Report maximize state so the renderer can draw the right control glyph. */
  const sendState = () => {
    if (win.isDestroyed()) return;
    win.webContents.send('coredesk:window-state', {
      maximized: win.isMaximized(),
      focused: win.isFocused(),
    });
  };
  win.on('maximize', sendState);
  win.on('unmaximize', sendState);
  win.on('focus', sendState);
  win.on('blur', sendState);

  /* Reload Protection: Disable production user-triggered reload (F5, Ctrl+R, Ctrl+Shift+R, Cmd+R).
     In development (mode === 'dev'), intentional reload is preserved.
     Standard shortcuts (Ctrl+C, Ctrl+V, Ctrl+Z, Ctrl+K) remain unaffected. */
  win.webContents.on('before-input-event', (event, input) => {
    if (mode !== 'dev' && input.type === 'keyDown') {
      const isF5 = input.key === 'F5';
      const isR = input.key.toLowerCase() === 'r';
      const isCtrlOrCmd = input.control || input.meta;
      if (isF5 || (isCtrlOrCmd && isR)) {
        event.preventDefault();
      }
    }
  });

  return { win, safeBounds };
}

/**
 * Window controls IPC channels (minimize, maximize, close)
 */
ipcMain.on('coredesk:window', (event, action) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || win.isDestroyed()) return;
  switch (action) {
    case 'minimize':
      win.minimize();
      break;
    case 'maximize':
      if (win.isMaximized()) win.unmaximize();
      else win.maximize();
      break;
    case 'close':
      win.close();
      break;
    default:
      break;
  }
});

/**
 * Authentication IPC handlers with parameter validation
 */
ipcMain.handle('coredesk:auth:get-session', async () => {
  return await authService.getSession();
});

ipcMain.handle('coredesk:auth:sign-in', async (_event, credentials) => {
  return await authService.signIn(credentials);
});

ipcMain.handle('coredesk:auth:sign-up', async (_event, payload) => {
  return await authService.signUp(payload);
});

ipcMain.handle('coredesk:auth:sign-out', async () => {
  return await authService.signOut();
});

/** Show the window and hand it to the user; nothing is captured or asserted. */
async function launchInteractive() {
  fs.appendFileSync(path.join(__dirname, 'debug.log'), `launchInteractive start. mode=${mode}, targetUrl\n`);
  const { win, safeBounds } = createWindow();
  mainWindow = win;

  win.webContents.on('console-message', (event, ...legacy) => {
    const level = event && typeof event === 'object' && 'level' in event ? event.level : legacy[0];
    const message =
      event && typeof event === 'object' && 'message' in event ? event.message : legacy[1];
    fs.appendFileSync(path.join(__dirname, 'debug.log'), `[renderer] ${message}\n`);
    if ((level === 'error' || level === 3) && !/Security Warning/i.test(String(message))) {
      console.error(`[renderer] ${message}`);
    }
  });

  win.webContents.on('did-finish-load', () => {
    fs.appendFileSync(path.join(__dirname, 'debug.log'), 'did-finish-load\n');
    process.stdout.write('CoreDesk window ready.\n');
  });

  win.webContents.on('did-fail-load', (e, code, desc, url) => {
    fs.appendFileSync(path.join(__dirname, 'debug.log'), `did-fail-load: ${code} ${desc} ${url}\n`);
  });

  /* Reveal once the renderer has prepared and painted — zero white flash */
  win.once('ready-to-show', () => {
    fs.appendFileSync(path.join(__dirname, 'debug.log'), 'ready-to-show\n');
    if (safeBounds.maximized) {
      win.maximize();
    }
    win.show();
    win.focus();
  });

  const hash = startRoute.startsWith('#') ? startRoute : `#${startRoute}`;
  const targetUrl = mode === 'dev' ? `${devUrl}/#/${hash.replace(/^#\/?/, '')}` : `${builtUrlFor()}${hash}`;
  fs.appendFileSync(path.join(__dirname, 'debug.log'), `loading targetUrl: ${targetUrl}\n`);

  await win.loadURL(targetUrl);
  fs.appendFileSync(path.join(__dirname, 'debug.log'), 'loaded URL\n');

  if (!win.isVisible()) {
    if (safeBounds.maximized) win.maximize();
    win.show();
    win.focus();
  }

  await new Promise((resolve) => win.on('closed', resolve));
  fs.appendFileSync(path.join(__dirname, 'debug.log'), 'win closed\n');
  app.quit();
}

function builtUrlFor() {
  return pathToFileURL(path.join(__dirname, '..', 'dist', 'index.html')).href;
}

if (!interactive) {
  app.disableHardwareAcceleration();
}

let surveying = true;

/** Any throw inside the survey must still produce a report, or the harness is blind. */
async function run() {
  fs.mkdirSync(outDir, { recursive: true });

  const builtIndex = path.join(__dirname, '..', 'dist', 'index.html');
  if (mode === 'built' && !fs.existsSync(builtIndex)) {
    report({ ok: false, error: `no build at ${builtIndex} — run npm run build first` });
    app.exit(1);
    return;
  }
  const builtUrl = pathToFileURL(builtIndex).href;

  const results = [];

  for (const target of targets) {
    const { win } = createWindow();
    const failures = [];
    win.webContents.on('did-fail-load', (_e, code, desc, url) => {
      failures.push(`${url} -> ${code} ${desc}`);
    });
    win.webContents.on('console-message', (event, ...legacy) => {
      const level = event && typeof event === 'object' && 'level' in event ? event.level : legacy[0];
      const message =
        event && typeof event === 'object' && 'message' in event ? event.message : legacy[1];
      const isError = level === 'error' || level === 3 || level === 2;
      if (isError && !/Security Warning/i.test(String(message))) {
        console.error(`[renderer] ${message}`);
      }
    });

    let loadError = null;
    try {
      await win.loadURL(mode === 'dev' ? `${devUrl}/${target.route}` : `${builtUrl}${target.route}`);
    } catch (err) {
      loadError = err && err.message;
    }

    if (!loadError && failures.length) loadError = failures.join('; ');

    // Settle time for fonts & render
    await new Promise((r) => setTimeout(r, 2200));

    let observed = null;
    if (!loadError) {
      try {
        observed = await win.webContents.executeJavaScript(PROBE);
      } catch (err) {
        loadError = `probe threw: ${err && err.message}`;
      }
    }

    if (observed) {
      try {
        const image = await win.webContents.capturePage();
        fs.writeFileSync(path.join(outDir, `${target.shot}.png`), image.toPNG());
      } catch (err) {
        failures.push(`capture failed: ${err && err.message}`);
      }
    }

    results.push({ ...target, failures, loadError, observed });
    if (!win.isDestroyed()) win.destroy();
  }

  const displays = screen.getAllDisplays();
  const primary = screen.getPrimaryDisplay();

  surveying = false;

  fs.writeFileSync(path.join(outDir, 'last-report.json'), JSON.stringify(results, null, 2));

  report({
    ok: results.every((r) => r.failures.length === 0 && !r.loadError),
    mode,
    results,
    outDir,
    icon: APP_ICON_PATH,
    window: { requested: [width, height] },
    display: {
      count: displays.length,
      scaleFactor: primary.scaleFactor,
      workArea: [primary.workAreaSize.width, primary.workAreaSize.height],
    },
    versions: {
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node,
    },
  });

  app.quit();
}

app.whenReady().then(() => {
  if (interactive) {
    surveying = false;
    return launchInteractive().catch((err) => {
      console.error(`Interactive launch failed: ${err && err.stack ? err.stack : err}`);
      app.exit(1);
    });
  }
  return run().catch((err) => {
    surveying = false;
    report({
      ok: false,
      fatal: `${err && err.stack ? err.stack : err}`,
      results: [],
      outDir,
      display: { count: 0, scaleFactor: 0, workArea: [0, 0] },
      versions: {
        electron: process.versions.electron,
        chrome: process.versions.chrome,
        node: process.versions.node,
      },
    });
    app.exit(1);
  });
});

app.on('window-all-closed', () => {
  if (!surveying && process.platform !== 'darwin') app.quit();
});
