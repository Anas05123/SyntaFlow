import type { BrowserWindow } from "electron";

const developmentHostnames = new Set(["localhost", "127.0.0.1"]);

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

export function isTrustedDevelopmentRendererUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "http:" && developmentHostnames.has(url.hostname) && url.port.length > 0
    );
  } catch {
    return false;
  }
}

export function isTrustedRendererUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "file:" || isTrustedDevelopmentRendererUrl(value);
  } catch {
    return false;
  }
}

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
    if (!isTrustedDevelopmentRendererUrl(url)) {
      event.preventDefault();
    }
  });

  window.webContents.on("will-frame-navigate", (event) => {
    if (!isTrustedDevelopmentRendererUrl(event.url)) {
      event.preventDefault();
    }
  });
}
