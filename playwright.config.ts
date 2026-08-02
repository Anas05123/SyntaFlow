import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/end-to-end",
  timeout: 30_000,
  reporter: "list",
  use: {
    trace: "on-first-retry",
  },
});
