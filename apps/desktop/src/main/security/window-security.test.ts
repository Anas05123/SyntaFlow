import { describe, expect, it } from "vitest";
import {
  applyWindowSecurity,
  contentSecurityPolicy,
  isTrustedDevelopmentRendererUrl,
  isTrustedRendererUrl,
} from "./window-security";

type HeadersListener = (
  details: { responseHeaders?: Record<string, string[]> },
  callback: (response: { responseHeaders: Record<string, string[]> }) => void,
) => void;

type NavigationListener = (event: { preventDefault: () => void }, url: string) => void;

function createFakeWindow(): {
  window: never;
  getHeadersListener: () => HeadersListener;
  getNavigationListener: () => NavigationListener;
} {
  let headersListener: HeadersListener | undefined;
  let navigationListener: NavigationListener | undefined;

  return {
    window: {
      webContents: {
        session: {
          webRequest: {
            onHeadersReceived: (listener: HeadersListener) => {
              headersListener = listener;
            },
          },
        },
        on: (event: string, listener: NavigationListener) => {
          if (event === "will-navigate") {
            navigationListener = listener;
          }
        },
      },
    } as never,
    getHeadersListener: () => {
      if (!headersListener) throw new Error("Header listener was not registered.");
      return headersListener;
    },
    getNavigationListener: () => {
      if (!navigationListener) throw new Error("Navigation listener was not registered.");
      return navigationListener;
    },
  };
}

describe("window security", () => {
  it("accepts only local renderer URLs", () => {
    expect(isTrustedRendererUrl("file:///app/index.html")).toBe(true);
    expect(isTrustedDevelopmentRendererUrl("http://localhost:5173/")).toBe(true);
    expect(isTrustedDevelopmentRendererUrl("http://127.0.0.1:5173/")).toBe(true);
    expect(isTrustedDevelopmentRendererUrl("http://localhost:5173@evil.example/")).toBe(false);
    expect(isTrustedRendererUrl("https://example.com/")).toBe(false);
  });

  it("sets the restrictive CSP response header", () => {
    const fake = createFakeWindow();
    applyWindowSecurity(fake.window);
    let responseHeaders: Record<string, string[]> | undefined;

    fake.getHeadersListener()({ responseHeaders: { Existing: ["value"] } }, (response) => {
      responseHeaders = response.responseHeaders;
    });

    expect(responseHeaders?.["Content-Security-Policy"]).toEqual([contentSecurityPolicy]);
    expect(contentSecurityPolicy).toContain("object-src 'none'");
    expect(contentSecurityPolicy).toContain("frame-src 'none'");
  });

  it("blocks navigation away from the local development server", () => {
    const fake = createFakeWindow();
    applyWindowSecurity(fake.window);
    let prevented = false;

    fake.getNavigationListener()(
      {
        preventDefault: () => {
          prevented = true;
        },
      },
      "https://example.com/",
    );

    expect(prevented).toBe(true);
  });
});
