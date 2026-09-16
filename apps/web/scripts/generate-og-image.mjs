import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.resolve(__dirname, '../public/brand/LogoIcon_WBG.png');
const logoBase64 = fs.readFileSync(logoPath).toString('base64');
const logoDataUri = `data:image/png;base64,${logoBase64}`;

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      background: #0b0d0f;
      color: #f1f5f9;
      font-family: 'Inter', sans-serif;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 64px 72px;
    }
    .ambient-glow {
      position: absolute;
      top: -100px;
      right: -100px;
      width: 700px;
      height: 700px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, rgba(59, 130, 246, 0.12) 40%, transparent 70%);
      pointer-events: none;
      filter: blur(40px);
    }
    .ambient-glow-bottom {
      position: absolute;
      bottom: -150px;
      left: 100px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%);
      pointer-events: none;
      filter: blur(50px);
    }
    .grid-lines {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
      background-size: 48px 48px;
      pointer-events: none;
    }
    .brand-header {
      display: flex;
      align-items: center;
      gap: 16px;
      z-index: 10;
    }
    .brand-header img {
      width: 48px;
      height: 48px;
      object-fit: contain;
    }
    .brand-name {
      font-family: 'Sora', sans-serif;
      font-weight: 700;
      font-size: 28px;
      letter-spacing: -0.03em;
      color: #ffffff;
    }
    .pill {
      margin-left: 16px;
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 9999px;
      background: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.3);
      font-size: 11px;
      font-weight: 600;
      color: #22d3ee;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .content {
      z-index: 10;
      max-width: 820px;
      margin-top: 10px;
    }
    h1 {
      font-family: 'Sora', sans-serif;
      font-size: 52px;
      font-weight: 800;
      line-height: 1.12;
      letter-spacing: -0.035em;
      color: #ffffff;
      margin-bottom: 20px;
    }
    h1 span {
      background: linear-gradient(135deg, #38bdf8 0%, #22d3ee 50%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      font-size: 21px;
      line-height: 1.5;
      color: #94a3b8;
      font-weight: 400;
      max-width: 760px;
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 24px;
      z-index: 10;
    }
    .badges {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #cbd5e1;
      font-weight: 500;
    }
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #06b6d4;
    }
    .domain {
      font-family: 'Sora', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: #38bdf8;
      letter-spacing: -0.01em;
    }
    .watermark-logo {
      position: absolute;
      right: 40px;
      top: 90px;
      width: 380px;
      height: 380px;
      opacity: 0.85;
      filter: drop-shadow(0 20px 40px rgba(6, 182, 212, 0.3));
      z-index: 5;
    }
  </style>
</head>
<body>
  <div class="ambient-glow"></div>
  <div class="ambient-glow-bottom"></div>
  <div class="grid-lines"></div>

  <img src="${logoDataUri}" class="watermark-logo" alt="" />

  <div class="brand-header">
    <img src="${logoDataUri}" alt="Syntaflow" />
    <span class="brand-name">Syntaflow</span>
    <span class="pill">Connected Workspace // Local-First</span>
  </div>

  <div class="content">
    <h1>From Context to Action.<br><span>Connected Client Work.</span></h1>
    <p>A continuous desktop operating environment for client operations, scoping blueprints, dual-density tasks, typographic documents, reviews, and delivery gates.</p>
  </div>

  <div class="footer">
    <div class="badges">
      <div class="badge"><span class="badge-dot"></span> Local-First SQLite</div>
      <div class="badge"><span class="badge-dot"></span> Zero Cloud AI Training</div>
      <div class="badge"><span class="badge-dot"></span> Windows 64-Bit Desktop</div>
    </div>
    <div class="domain">syntaflow.tech</div>
  </div>
</body>
</html>
`;

async function generate() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });

  await page.setContent(html, { waitUntil: 'networkidle' });
  // Wait for Google Fonts to load
  await page.evaluate(() => document.fonts.ready);

  const outputPath = path.resolve(__dirname, '../public/brand/og-image.png');
  await page.screenshot({ path: outputPath, type: 'png' });
  await browser.close();
  console.log(`Generated og-image.png at ${outputPath}`);
}

generate().catch(console.error);
