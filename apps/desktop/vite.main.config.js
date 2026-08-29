const { defineConfig } = require("vite");
const { builtinModules } = require("node:module");

const external = [
  "electron",
  "sql.js",
  ...builtinModules,
  ...builtinModules.map((moduleName) => `node:${moduleName}`),
];

module.exports = defineConfig({
  build: {
    lib: {
      entry: "src/main/index.ts",
      fileName: () => "main.js",
      formats: ["cjs"],
    },
    outDir: ".vite/build",
    rollupOptions: {
      external,
    },
    sourcemap: true,
  },
});
