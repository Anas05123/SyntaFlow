import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // CoreDesk is an Electron application: the production renderer is loaded from
  // disk over file://, not served from a web root. Absolute "/assets/..." paths
  // resolve to the filesystem root there and the window comes up blank, so every
  // emitted URL must be relative. This keeps `vite preview` working unchanged.
  base: './',

  server: {
    watch: {
      /*
       * Editors and tooling write atomically: they create a staging file such as
       * `.auth.css.<pid>.<uuid>.tmpdir/auth.css.tmp` beside the real file, then
       * rename it into place. On Windows those staging handles are still locked
       * when a watcher reaches them, and `fs.watch` then emits EBUSY as an
       * unhandled error — which kills the dev server outright and takes any
       * running Electron window down with it.
       *
       * These paths are never imported, so nothing is lost by ignoring them.
       * The leading-dot and tmpdir patterns cover the atomic-write convention;
       * `electron/`, `.shots/` and `dist/` are build and harness output.
       */
      ignored: [
        '**/.*.tmpdir/**',
        '**/*.tmp',
        '**/.*.tmp',
        '**/electron/**',
        '**/.shots/**',
        '**/dist/**',
      ],
    },
  },
})
