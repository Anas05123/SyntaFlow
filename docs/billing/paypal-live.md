# Syntaflow — Official PayPal Live Billing Operations Guide
## Phase: Production Live Pro Monthly ($19.00 USD / month) Plan

> **Environment:** PayPal Live Production (`https://api-m.paypal.com`)  
> **Status:** PROVISIONED & ACTIVE  
> **Plan:** Syntaflow Pro Monthly Recurring Subscription  
> **Authoritative State:** Authoritative PayPal REST API reconciliation and signed Webhooks  

---

## 1. Production Credentials & Catalog Identifiers

| Identifier | Production Value | Description |
|---|---|---|
| **Environment** | `live` | Official PayPal Live production mode |
| **API Base URL** | `https://api-m.paypal.com` | Official production REST API gateway |
| **Client ID** | `BAAdqlMCv4NifJpZIMSmXwU8_1Z3Ej7c5q008XKyiZUsHcDNfhpX_Pcs2iOazOdUFYV_L5l2Y8I4-RpMm4` | Public client identifier for PayPal JS SDK |
| **Catalog Product ID** | `PROD-8TS1582288395512A` | Catalog product name: **Syntaflow** |
| **Pro Monthly Plan ID** | `P-7HS94694VP511840CNKWJ7TY` | Status: **ACTIVE**, Price: **$19.00 USD / month** |
| **Webhook ID** | `0H631750E0884945M` | Subscribed to all 10 billing & payment events |
| **Webhook URL** | `https://syntaflow.tech/api/webhooks/paypal` | Encrypted TLS listener |

---

## 2. Customer Payment Capabilities

With Live PayPal configured:
1. **Existing PayPal Accounts:** Any customer can log in using their primary PayPal email and password without being prompted to register.
2. **Saved Payment Methods:** Customers can pay directly using their stored PayPal balance, linked checking account, or credit/debit cards.
3. **Credit & Debit Cards:** Guest checkout and card vaulting for recurring monthly renewals are handled through PayPal PCI-DSS compliant infrastructure.
4. **Instant Continuity:** On edge deployments, successful client approvals store active session continuity while server reconciliation verifies provider state.
