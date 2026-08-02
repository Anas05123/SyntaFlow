import type { BrowserWindow } from "electron";

const allowedDevelopmentOrigin = "http://localhost:";

export const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' http://127.0.0.1:* http://localhost:*",
  "object-src 'none'",
  "frame-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");

export function applyWindowSecurity(window: BrowserWindow): void {
  window.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [contentSecurityPolicy],
      },
    });
  });

  window.webContents.on("will-navigate", (event, url) => {
    const isAllowedDevNavigation = url.startsWith(allowedDevelopmentOrigin);

    if (!isAllowedDevNavigation) {
      event.preventDefault();
    }
  });
}
