import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load environment variables if available in .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnvPath = path.resolve(__dirname, '../../../.env');
if (fs.existsSync(rootEnvPath)) {
  const envContent = fs.readFileSync(rootEnvPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

const PORT = Number(process.env.PORT || 3001);
const DIST_DIR = path.resolve(__dirname, '../dist');

async function startServer() {
  // Dynamically import the compiled or runtime apiRouter
  const { handleApiRequest } = await import('../src/server/apiRouter.js').catch(async () => {
    // Fallback for ts-node / runtime bundling
    return await import('../src/server/apiRouter.ts');
  });

  const server = http.createServer(async (req, res) => {
    // 1. Check if handled by API Router
    const handled = await handleApiRequest(req, res);
    if (handled) return;

    // 2. Static file serving from dist/
    const safeUrl = (req.url || '/').split('?')[0];
    let filePath = path.join(DIST_DIR, safeUrl === '/' ? 'index.html' : safeUrl);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
      };
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // SPA fallback to index.html
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream(indexPath).pipe(res);
      return;
    }

    res.statusCode = 404;
    res.end('Not Found');
  });

  server.listen(PORT, () => {
    console.log(`[Syntaflow Server] Listening on http://localhost:${PORT}`);
    console.log(`[Syntaflow Server] PayPal Environment: ${process.env.PAYPAL_ENV || 'sandbox'}`);
  });
}

startServer().catch((err) => {
  console.error('[Syntaflow Server] Failed to start:', err);
  process.exit(1);
});
