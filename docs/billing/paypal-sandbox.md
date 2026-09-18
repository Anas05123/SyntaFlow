# Syntaflow — PayPal Sandbox Billing Architecture & Operations Guide
## Phase: Pro Monthly ($19 USD / month) Test Plan

> **Environment:** PayPal Sandbox ONLY (`https://api-m.sandbox.paypal.com`)  
> **Status:** IMPLEMENTED & TEST VERIFIED  
> **Plan:** Syntaflow Pro Recurring Monthly Subscription  
> **Authoritative State:** Server-side verified webhook events & PayPal API reconciliation  

---

## 1. System Architecture

Syntaflow implements an authoritative, decoupled billing architecture where the browser is **never trusted** to determine payment success or active plan access. Access to Syntaflow Pro is granted only upon verified server-side PayPal events or direct API reconciliation.

```
┌───────────────────────────┐
│ Client Browser            │
│ (Pricing / Account Plan)  │
└─────────────┬─────────────┘
              │ 1. User selects Pro & approves popup
              ▼
┌───────────────────────────┐
│ PayPal JS SDK             │
│ (onApprove returns subID) │
└─────────────┬─────────────┘
              │ 2. POST /api/billing/paypal/subscription
              ▼
┌───────────────────────────┐       GET /v1/billing/subscriptions/{id}
│ Syntaflow API Backend     ├─────────────────────────────────────────┐
│ (Node / Express / Vite)   │                                         │
└─────────────┬─────────────┘                                         ▼
              │ 3. Records PENDING or ACTIVE           ┌────────────────────────────┐
              ▼    subscription in SQLite DB           │ PayPal Sandbox REST API    │
┌───────────────────────────┐                          │ (api-m.sandbox.paypal.com) │
│ BillingStore (SQLite)     │                          └──────────────┬─────────────┘
│ - billing_subscriptions   │                                         │
│ - billing_payments        │ 4. Asynchronous Webhook Event arrives    │
│ - webhook_events          │    POST /api/webhooks/paypal            │
└─────────────▲─────────────┘ ◄───────────────────────────────────────┘
              │ 5. Signature verified via /v1/notifications/verify-webhook-signature
              │ 6. Idempotency verified via providerEventId
              │ 7. Authoritative status transition (e.g. ACTIVE -> Pro unlocked)
```

---

## 2. Environment Variables

Configure the following variables in your root `.env` file for Sandbox testing:

```bash
# PayPal Sandbox Environment Configuration
PAYPAL_ENV=sandbox
PAYPAL_CLIENT_ID=your_sandbox_client_id_here
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret_here
PAYPAL_WEBHOOK_ID=your_sandbox_webhook_id_here
PAYPAL_PRODUCT_ID=your_created_product_id_here
PAYPAL_PRO_MONTHLY_PLAN_ID=your_created_plan_id_here
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
```

### Security Boundary
- `PAYPAL_CLIENT_SECRET` and `PAYPAL_WEBHOOK_ID` are strictly server-side.
- Only `PAYPAL_CLIENT_ID` and `PAYPAL_PRO_MONTHLY_PLAN_ID` are exposed via the public `/api/billing/config` endpoint.

---

## 3. Product & Billing Plan Setup

### One-Time Development Setup Script
To automatically create the catalog Product and recurring Monthly Plan on PayPal Sandbox:

```bash
npm run billing:paypal:setup
```

The script will:
1. Verify that `PAYPAL_ENV=sandbox`.
2. Connect to the PayPal Sandbox OAuth endpoint and obtain an access token.
3. Check for `PAYPAL_PRODUCT_ID`. If missing, creates the catalog product:
   - **Name:** `Syntaflow`
   - **Description:** `Client engagement workspace software`
   - **Type:** `SERVICE`
   - **Category:** `SOFTWARE`
4. Check for `PAYPAL_PRO_MONTHLY_PLAN_ID`. If missing, creates the billing plan:
   - **Name:** `Syntaflow Pro Monthly`
   - **Frequency:** `1 MONTH` (Regular tenure, infinite cycles)
   - **Fixed Price:** `$19.00 USD`
   - **Payment Failure Threshold:** `3`
5. Output the generated IDs to be placed into `.env`.

---

## 4. Webhook Setup & Event Handling

### Webhook Endpoint
- **URL:** `POST https://syntaflow.tech/api/webhooks/paypal` (or local tunnel URL for development).
- **Supported Events:**
  - `BILLING.SUBSCRIPTION.CREATED`: Recorded as pending; does **not** grant Pro.
  - `BILLING.SUBSCRIPTION.ACTIVATED`: Grants Pro access; updates billing period dates.
  - `BILLING.SUBSCRIPTION.UPDATED`: Updates billing period dates and renewal schedule.
  - `BILLING.SUBSCRIPTION.CANCELLED`: Sets status to `cancelled`; access terminates at period end.
  - `BILLING.SUBSCRIPTION.SUSPENDED`: Sets status to `suspended`.
  - `BILLING.SUBSCRIPTION.EXPIRED`: Sets status to `expired`.
  - `BILLING.SUBSCRIPTION.PAYMENT.FAILED`: Sets status to `past_due`. Client data is **never** deleted.
  - `PAYMENT.SALE.COMPLETED`: Records ledger entry in `billing_payments`.
  - `PAYMENT.SALE.REFUNDED`: Marks payment `refunded`; triggers subscription reconciliation.
  - `PAYMENT.SALE.REVERSED`: Marks payment `reversed`; triggers subscription reconciliation.

### Webhook Signature Verification
Incoming webhooks are verified server-side using PayPal's official endpoint:
`POST https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature`
Headers verified:
- `paypal-auth-algo`
- `paypal-cert-url`
- `paypal-transmission-id`
- `paypal-transmission-sig`
- `paypal-transmission-time`
- Configured `PAYPAL_WEBHOOK_ID`

If signature verification fails or headers are missing, the endpoint responds with HTTP 400 and rejects the payload.

### Idempotency
Every event is recorded in the `webhook_events` table by `provider_event_id` (enforced by a UNIQUE SQLite constraint). Duplicate transmissions from PayPal retries are safely acknowledged with HTTP 200 without duplicate execution.

---

## 5. Local Webhook Development

Since PayPal requires an externally reachable HTTPS URL to deliver webhooks, use one of the following methods:

### Option A: Local Tunnel
Using an approved tunnel (e.g. Cloudflare Tunnel or local proxy):
```bash
cloudflared tunnel --url http://localhost:5174
```
Register the resulting tunnel URL in the PayPal Sandbox Developer Dashboard under your App's Webhooks:
`https://<your-subdomain>.trycloudflare.com/api/webhooks/paypal`

### Option B: Automated Integration Test Suite
The repository includes a comprehensive webhook simulation and signature verification test suite:
```bash
npm test tests/integration/paypal-webhooks.spec.ts
```

---

## 6. Subscription Cancellation Flow

Users can cancel their active subscription at any time from `/account/plan`:
1. User clicks **Cancel Subscription**.
2. Frontend sends `POST /api/billing/subscription/cancel` with authorization headers.
3. Backend retrieves the user's workspace subscription from SQLite (does **not** trust client input).
4. Backend calls `POST /v1/billing/subscriptions/{id}/cancel` on PayPal Sandbox.
5. Subscription status transitions to `cancelled` and `cancelAtPeriodEnd` is set to `true`.
6. Subsequent PayPal webhook `BILLING.SUBSCRIPTION.CANCELLED` confirms provider state.

---

## 7. Troubleshooting

| Symptom | Cause | Solution |
|---|---|---|
| `Invalid PayPal webhook signature` | Mismatched `PAYPAL_WEBHOOK_ID` or tampered payload. | Ensure `PAYPAL_WEBHOOK_ID` in `.env` matches the registered Sandbox webhook ID in the developer dashboard. |
| `Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET` | Environment variables unpopulated. | Populate credentials from PayPal Sandbox Dashboard into `.env`. |
| `Plan ID mismatch` | User approved a plan other than the configured Pro Monthly plan. | Verify `PAYPAL_PRO_MONTHLY_PLAN_ID` in `.env`. |
| Pro access not granted after checkout | Authoritative activation pending. | Check user account status at `/account/plan` or click **Refresh Status**. |

---

## 8. Switching to Live PayPal Later (Future Phase)

When transitioning to production live payments:
1. Update `PAYPAL_ENV=live`.
2. Update `PAYPAL_API_BASE=https://api-m.paypal.com`.
3. Create the production Product and Plan using live developer credentials.
4. Register the live production webhook URL (`https://syntaflow.tech/api/webhooks/paypal`).
5. Update `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_PRODUCT_ID`, `PAYPAL_PRO_MONTHLY_PLAN_ID`, and `PAYPAL_WEBHOOK_ID` in production secrets.
6. Verify live checkout with a real credit card / PayPal account.
