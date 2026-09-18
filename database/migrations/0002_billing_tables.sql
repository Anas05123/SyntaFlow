CREATE TABLE IF NOT EXISTS billing_subscriptions (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'paypal',
  provider_subscription_id TEXT UNIQUE NOT NULL,
  provider_plan_id TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'pro',
  status TEXT NOT NULL,
  current_period_start TEXT,
  current_period_end TEXT,
  cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- atlas:statement-breakpoint

CREATE TABLE IF NOT EXISTS billing_payments (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'paypal',
  provider_payment_id TEXT UNIQUE NOT NULL,
  provider_subscription_id TEXT,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at TEXT
);

-- atlas:statement-breakpoint

CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'paypal',
  provider_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  failure_reason TEXT
);

-- atlas:statement-breakpoint

CREATE INDEX IF NOT EXISTS idx_billing_subs_workspace ON billing_subscriptions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_billing_subs_provider_id ON billing_subscriptions(provider_subscription_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider_id ON webhook_events(provider_event_id);
