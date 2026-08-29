const { defineConfig } = require("vite");
const { builtinModules } = require("node:module");

const external = [
  "electron",
  ...builtinModules,
  ...builtinModules.map((moduleName) => `node:${moduleName}`),
];

module.exports = defineConfig({
  build: {
    outDir: ".vite/preload",
    rollupOptions: {
      external,
      input: "src/preload/index.ts",
      output: {
        chunkFileNames: "[name].js",
        entryFileNames: "index.js",
        format: "cjs",
        inlineDynamicImports: true,
      },
    },
    sourcemap: true,
  },
});
