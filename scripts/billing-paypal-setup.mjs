#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Load .env if present
const rootEnvPath = path.resolve(process.cwd(), '.env');
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

const isForce = process.argv.includes('--force');
const env = (process.env.PAYPAL_ENV || 'sandbox').trim().toLowerCase();

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SYNTAFLOW PAYPAL SANDBOX SETUP');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (env !== 'sandbox') {
  console.error('❌ Error: This setup script is strictly restricted to PAYPAL_ENV=sandbox.');
  console.error(`Current PAYPAL_ENV is set to: "${env}". Refusing to run on non-sandbox environment.`);
  process.exit(1);
}

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.log('⚠️  PayPal Sandbox Credentials Missing in .env\n');
  console.log('To set up PayPal Sandbox Subscriptions:');
  console.log('1. Log into your PayPal Developer Dashboard:');
  console.log('   https://developer.paypal.com/dashboard/applications/sandbox');
  console.log('2. Create or select a Sandbox REST App (e.g. "Syntaflow Sandbox App").');
  console.log('3. Copy your Client ID and Secret.');
  console.log('4. Add them to your root .env file:');
  console.log('   PAYPAL_ENV=sandbox');
  console.log('   PAYPAL_CLIENT_ID=<your-sandbox-client-id>');
  console.log('   PAYPAL_CLIENT_SECRET=<your-sandbox-client-secret>');
  console.log('   PAYPAL_API_BASE=https://api-m.sandbox.paypal.com');
  console.log('5. Re-run this setup script:');
  console.log('   npm run billing:paypal:setup\n');
  process.exit(0);
}

const apiBase = (process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com').replace(/\/+$/, '');

async function run() {
  console.log('1. Connecting to PayPal Sandbox OAuth endpoint...');
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const tokenRes = await fetch(`${apiBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: 'grant_type=client_credentials',
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    console.error(`❌ Authentication failed (${tokenRes.status}):`, errText);
    process.exit(1);
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  console.log('   ✓ OAuth 2.0 Access Token acquired.\n');

  // 2. Check or Create Product
  let productId = process.env.PAYPAL_PRODUCT_ID;
  if (productId && !isForce) {
    console.log(`2. Using existing PAYPAL_PRODUCT_ID: ${productId}`);
  } else {
    console.log('2. Creating Syntaflow Catalog Product on PayPal Sandbox...');
    const productRes = await fetch(`${apiBase}/v1/catalogs/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'PayPal-Request-Id': `prod_${Date.now()}`,
      },
      body: JSON.stringify({
        name: 'Syntaflow',
        description: 'Client engagement workspace software',
        type: 'SERVICE',
        category: 'SOFTWARE',
      }),
    });

    if (!productRes.ok) {
      const err = await productRes.text();
      console.error(`❌ Failed to create product (${productRes.status}):`, err);
      process.exit(1);
    }

    const prodData = await productRes.json();
    productId = prodData.id;
    console.log(`   ✓ Created Product ID: ${productId}\n`);
  }

  // 3. Check or Create Plan
  let planId = process.env.PAYPAL_PRO_MONTHLY_PLAN_ID;
  if (planId && !isForce) {
    console.log(`3. Using existing PAYPAL_PRO_MONTHLY_PLAN_ID: ${planId}`);
  } else {
    console.log('3. Creating "Syntaflow Pro Monthly" ($19/mo) Billing Plan on PayPal Sandbox...');
    const planRes = await fetch(`${apiBase}/v1/billing/plans`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'PayPal-Request-Id': `plan_${Date.now()}`,
      },
      body: JSON.stringify({
        product_id: productId,
        name: 'Syntaflow Pro Monthly',
        description: 'Syntaflow Pro Monthly Subscription ($19/mo)',
        status: 'ACTIVE',
        billing_cycles: [
          {
            frequency: {
              interval_unit: 'MONTH',
              interval_count: 1,
            },
            tenure_type: 'REGULAR',
            sequence: 1,
            total_cycles: 0,
            pricing_scheme: {
              fixed_price: {
                value: '19.00',
                currency_code: 'USD',
              },
            },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee_failure_action: 'CONTINUE',
          payment_failure_threshold: 3,
        },
      }),
    });

    if (!planRes.ok) {
      const err = await planRes.text();
      console.error(`❌ Failed to create plan (${planRes.status}):`, err);
      process.exit(1);
    }

    const planData = await planRes.json();
    planId = planData.id;
    console.log(`   ✓ Created Plan ID: ${planId}\n`);
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('CONFIGURATION READY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Please add or verify the following entries in your .env:');
  console.log(`
PAYPAL_ENV=sandbox
PAYPAL_CLIENT_ID=${clientId}
PAYPAL_CLIENT_SECRET=${clientSecret}
PAYPAL_PRODUCT_ID=${productId}
PAYPAL_PRO_MONTHLY_PLAN_ID=${planId}
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
  `.trim());
  console.log('\n(Secrets were not written into any repository source files)');
}

run().catch((err) => {
  console.error('Unexpected setup error:', err);
  process.exit(1);
});
