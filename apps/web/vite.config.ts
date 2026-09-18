import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

function billingApiPlugin(): Plugin {
  return {
    name: 'billing-api-middleware',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            const apiModule = './server/apiRouter.ts';
            const { handleApiRequest } = await import(/* @vite-ignore */ apiModule);
            const handled = await handleApiRequest(req, res);
            if (!handled) next();
          } catch (err) {
            console.error('[Vite API Middleware Error]', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal API error' }));
          }
        } else {
          next();
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), ...(command === 'serve' ? [billingApiPlugin()] : [])],
  base: '/',
  server: {
    port: 5174,
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: true,
  },
}));
