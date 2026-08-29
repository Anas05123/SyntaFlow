const { defineConfig } = require("vite");

module.exports = defineConfig({
  base: "./",
  build: {
    outDir: ".vite/renderer/main_window",
    sourcemap: true,
  },
});
