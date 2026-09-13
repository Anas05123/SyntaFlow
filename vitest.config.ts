import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    include: [
      "packages/**/*.test.ts",
      "packages/**/*.spec.ts",
      "tests/**/*.test.ts",
      "tests/**/*.spec.ts",
      "src/**/*.test.ts",
      "src/**/*.spec.ts",
    ],
  },
});
