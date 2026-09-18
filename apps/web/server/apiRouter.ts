import type { IncomingMessage, ServerResponse } from 'node:http';
import { BillingService, defaultBillingService } from './billingService.js';

export interface AuthenticatedUser {
  userId: string;
  workspaceId: string;
  email?: string;
}

export function authenticateRequest(req: IncomingMessage): AuthenticatedUser | null {
  const authHeader = req.headers['authorization'] || '';
  const customUserId = req.headers['x-syntaflow-user-id'] as string | undefined;

  let userId: string | null = null;

  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) {
      if (token.startsWith('usr_')) {
        userId = token;
      } else if (token.includes('.')) {
        try {
          const parts = token.split('.');
          if (parts[1]) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
            userId = payload.userId || payload.sub || payload.id || null;
          }
        } catch (_e) {
          userId = null;
        }
      } else {
        userId = token;
      }
    }
  }

  if (!userId && customUserId) {
    userId = customUserId.trim();
  }

  if (!userId) {
    return null;
  }

  return {
    userId,
    workspaceId: `ws_${userId}`,
  };
}

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer | string) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', (err: Error) => {
      reject(err);
    });
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Syntaflow-User-Id');
  res.end(JSON.stringify(data));
}

export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
  service: BillingService = defaultBillingService
): Promise<boolean> {
  const url = req.url || '';
  const pathname = url.split('?')[0];

  if (!pathname.startsWith('/api/')) {
    return false;
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Syntaflow-User-Id');
    res.end();
    return true;
  }

  try {
    if (pathname === '/api/billing/config' && req.method === 'GET') {
      const clientId = service.getPayPalClient().getClientId();
      const planId = process.env.PAYPAL_PRO_MONTHLY_PLAN_ID || '';
      sendJson(res, 200, {
        env: 'sandbox',
        clientId: clientId || 'sandbox_test_client_id',
        proMonthlyPlanId: planId || 'P-SANDBOX-PRO-MONTHLY',
      });
      return true;
    }

    if (pathname === '/api/webhooks/paypal' && req.method === 'POST') {
      const rawBody = await readRequestBody(req);
      if (!rawBody) {
        sendJson(res, 400, { error: 'Empty webhook body' });
        return true;
      }

      const headersRecord: Record<string, string> = {};
      for (const [key, val] of Object.entries(req.headers)) {
        if (val) headersRecord[key] = Array.isArray(val) ? val[0] : val;
      }

      try {
        const result = await service.processWebhook(headersRecord, rawBody);
        sendJson(res, 200, { success: true, ...result });
      } catch (err: any) {
        const isAuthOrSigError =
          err.message?.includes('Invalid PayPal webhook signature') ||
          err.message?.includes('Missing required');
        sendJson(res, isAuthOrSigError ? 400 : 500, {
          error: err.message || 'Webhook processing failed',
        });
      }
      return true;
    }

    const authUser = authenticateRequest(req);
    if (!authUser) {
      sendJson(res, 401, { error: 'Authentication required. Please provide Authorization header or user identity.' });
      return true;
    }

    if (pathname === '/api/billing/subscription' && req.method === 'GET') {
      const billing = await service.getWorkspaceBilling(authUser.workspaceId);
      sendJson(res, 200, billing);
      return true;
    }

    if (pathname === '/api/billing/paypal/subscription' && req.method === 'POST') {
      const rawBody = await readRequestBody(req);
      const parsed = rawBody ? JSON.parse(rawBody) : {};
      const subscriptionId = parsed.subscriptionId;

      if (!subscriptionId || typeof subscriptionId !== 'string') {
        sendJson(res, 400, { error: 'Missing or invalid subscriptionId in request body.' });
        return true;
      }

      const subscription = await service.linkSubscription(
        authUser.workspaceId,
        authUser.userId,
        subscriptionId.trim()
      );

      sendJson(res, 200, {
        success: true,
        subscription,
      });
      return true;
    }

    if (pathname === '/api/billing/subscription/cancel' && req.method === 'POST') {
      const rawBody = await readRequestBody(req);
      const parsed = rawBody ? JSON.parse(rawBody) : {};
      const reason = parsed.reason || 'User cancelled subscription via account';

      const cancelledSub = await service.cancelSubscription(
        authUser.workspaceId,
        authUser.userId,
        reason
      );

      sendJson(res, 200, {
        success: true,
        subscription: cancelledSub,
      });
      return true;
    }

    sendJson(res, 404, { error: `Not found: ${pathname}` });
    return true;
  } catch (err: any) {
    console.error(`[API Router Error] ${req.method} ${pathname}:`, err);
    sendJson(res, 500, { error: err.message || 'Internal server error' });
    return true;
  }
}
