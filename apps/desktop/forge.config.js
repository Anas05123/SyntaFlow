const { MakerZIP } = require("../../node_modules/@electron-forge/maker-zip");
const { MakerDeb } = require("../../node_modules/@electron-forge/maker-deb");
const { MakerRpm } = require("../../node_modules/@electron-forge/maker-rpm");
const { VitePlugin } = require("../../node_modules/@electron-forge/plugin-vite");

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [new MakerZIP({}, ["win32", "darwin"]), new MakerRpm({}), new MakerDeb({})],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: "src/main/index.ts",
          config: "vite.main.config.js",
          target: "main",
        },
        {
          entry: "src/preload/index.ts",
          config: "vite.preload.config.js",
          target: "preload",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.js",
        },
      ],
    }),
  ],
};
