import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/out/**",
      "**/release/**",
      ".vite",
      "**/.vite/**",
      "**/coverage/**",
      "**/node_modules/**",
      "apps/desktop/forge.config.js",
      "apps/desktop/vite.*.config.js",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
  {
    files: ["apps/desktop/src/renderer/**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  {
    files: [
      "apps/desktop/src/main/**/*.ts",
      "apps/desktop/src/preload/**/*.ts",
      "scripts/**/*.mjs",
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["**/*.config.{js,ts}", "eslint.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["tests/**/*.ts", "**/*.test.ts", "**/*.spec.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },
);
