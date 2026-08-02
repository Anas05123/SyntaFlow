/// <reference types="vite/client" />

import type { AtlasPreloadApi } from "@atlas/contracts";

declare global {
  interface Window {
    atlas: AtlasPreloadApi;
  }
}
