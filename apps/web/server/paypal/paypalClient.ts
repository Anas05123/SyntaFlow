import crypto from 'node:crypto';

export interface PayPalClientConfig {
  env?: 'sandbox' | 'live';
  apiBase?: string;
  clientId?: string;
  clientSecret?: string;
  webhookId?: string;
  productId?: string;
  planId?: string;
}

export interface WebhookVerificationParams {
  authAlgo: string;
  certUrl: string;
  transmissionId: string;
  transmissionSig: string;
  transmissionTime: string;
  webhookId?: string;
  webhookEvent: any;
}

export interface PayPalProductData {
  name: string;
  description: string;
  type: 'SERVICE' | 'PHYSICAL' | 'DIGITAL';
  category: string;
}

export interface PayPalPlanData {
  productId: string;
  name: string;
  description: string;
  price: string;
  currency?: string;
}

export class PayPalClient {
  private env: 'sandbox' | 'live';
  private apiBase: string;
  private clientId: string;
  private clientSecret: string;
  private webhookId: string;
  private cachedToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(config?: PayPalClientConfig) {
    this.env = (config?.env || process.env.PAYPAL_ENV || 'sandbox') === 'live' ? 'live' : 'sandbox';
    this.apiBase = (
      config?.apiBase ||
      process.env.PAYPAL_API_BASE ||
      (this.env === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com')
    ).replace(/\/+$/, '');
    this.clientId = config?.clientId || process.env.PAYPAL_CLIENT_ID || '';
    this.clientSecret = config?.clientSecret || process.env.PAYPAL_CLIENT_SECRET || '';
    this.webhookId = config?.webhookId || process.env.PAYPAL_WEBHOOK_ID || '';
  }

  public getEnv(): 'sandbox' | 'live' {
    return this.env;
  }

  public getClientId(): string {
    return this.clientId;
  }

  public getWebhookId(): string {
    return this.webhookId;
  }

  public isConfigured(): boolean {
    return Boolean(this.clientId && this.clientSecret);
  }

  /**
   * Obtain OAuth 2.0 Access Token using Client Credentials grant.
   * Caches token in memory until expiration.
   */
  public async getAccessToken(): Promise<string> {
    if (this.cachedToken && Date.now() < this.tokenExpiresAt - 60000) {
      return this.cachedToken;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new Error('[PayPalClient] Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET in environment.');
    }

    const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const response = await fetch(`${this.apiBase}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: 'grant_type=client_credentials',
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const status = response.status;
      const errorText = await response.text();
      let sanitizedMessage = 'Failed to obtain PayPal OAuth access token.';
      try {
        const errorJson: any = JSON.parse(errorText);
        sanitizedMessage = errorJson.error_description || errorJson.message || sanitizedMessage;
      } catch (_e) {
        // use default sanitized message
      }
      throw new Error(`[PayPalClient] OAuth Error (${status}): ${sanitizedMessage}`);
    }

    const data: any = await response.json();
    this.cachedToken = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
    return this.cachedToken!;
  }

  /**
   * Create a catalog product (one-time setup).
   */
  public async createProduct(product: PayPalProductData): Promise<{ id: string; name: string }> {
    const token = await this.getAccessToken();
    const requestId = crypto.randomUUID();

    const response = await fetch(`${this.apiBase}/v1/catalogs/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'PayPal-Request-Id': requestId,
      },
      body: JSON.stringify({
        name: product.name,
        description: product.description,
        type: product.type,
        category: product.category,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorJson: any = await response.json().catch(() => ({}));
      throw new Error(`[PayPalClient] Create Product failed (${response.status}): ${errorJson?.message || 'Unknown error'}`);
    }

    const data: any = await response.json();
    return { id: data.id, name: data.name };
  }

  /**
   * Create a recurring monthly billing plan.
   */
  public async createPlan(plan: PayPalPlanData): Promise<{ id: string; name: string; status: string }> {
    const token = await this.getAccessToken();
    const requestId = crypto.randomUUID();

    const response = await fetch(`${this.apiBase}/v1/billing/plans`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'PayPal-Request-Id': requestId,
      },
      body: JSON.stringify({
        product_id: plan.productId,
        name: plan.name,
        description: plan.description,
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
                value: plan.price,
                currency_code: plan.currency || 'USD',
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
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorJson: any = await response.json().catch(() => ({}));
      throw new Error(`[PayPalClient] Create Plan failed (${response.status}): ${errorJson?.message || 'Unknown error'}`);
    }

    const data: any = await response.json();
    return { id: data.id, name: data.name, status: data.status };
  }

  /**
   * Fetch subscription by ID from PayPal.
   */
  public async getSubscription(subscriptionId: string): Promise<any> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.apiBase}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorJson: any = await response.json().catch(() => ({}));
      throw new Error(`[PayPalClient] Get Subscription failed (${response.status}): ${errorJson?.message || 'Unknown error'}`);
    }

    return await response.json();
  }

  /**
   * Cancel an active subscription on PayPal.
   */
  public async cancelSubscription(subscriptionId: string, reason: string): Promise<void> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.apiBase}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ reason: reason || 'Customer requested cancellation' }),
      signal: AbortSignal.timeout(10000),
    });

    // 204 No Content is the expected successful response for cancellation
    if (!response.ok && response.status !== 204) {
      const errorJson: any = await response.json().catch(() => ({}));
      throw new Error(`[PayPalClient] Cancel Subscription failed (${response.status}): ${errorJson?.message || 'Unknown error'}`);
    }
  }

  /**
   * Verify PayPal Webhook Signature using official PayPal endpoint:
   * POST /v1/notifications/verify-webhook-signature
   *
   * Fails closed: returns false on error, invalid signature, or missing headers.
   */
  public async verifyWebhookSignature(params: WebhookVerificationParams): Promise<boolean> {
    const effectiveWebhookId = params.webhookId || this.webhookId;

    if (!effectiveWebhookId) {
      console.error('[PayPalClient] Cannot verify webhook signature: PAYPAL_WEBHOOK_ID not configured.');
      return false;
    }

    if (
      !params.authAlgo ||
      !params.certUrl ||
      !params.transmissionId ||
      !params.transmissionSig ||
      !params.transmissionTime ||
      !params.webhookEvent
    ) {
      console.warn('[PayPalClient] Webhook verification failed: Missing required PayPal transmission headers.');
      return false;
    }

    try {
      const token = await this.getAccessToken();

      const response = await fetch(`${this.apiBase}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          auth_algo: params.authAlgo,
          cert_url: params.certUrl,
          transmission_id: params.transmissionId,
          transmission_sig: params.transmissionSig,
          transmission_time: params.transmissionTime,
          webhook_id: effectiveWebhookId,
          webhook_event: params.webhookEvent,
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.warn(`[PayPalClient] Webhook verification endpoint returned status: ${response.status}`);
        return false;
      }

      const data: any = await response.json();
      return data.verification_status === 'SUCCESS';
    } catch (err: any) {
      console.error('[PayPalClient] Error during webhook signature verification:', err.message || err);
      return false;
    }
  }
}

export const defaultPayPalClient = new PayPalClient();
