// @ts-ignore
import initSqlJs from 'sql.js';
import fs from 'node:fs';
import path from 'node:path';
import type {
  BillingSubscription,
  BillingPayment,
  WebhookEvent,
  SubscriptionStatus,
  PaymentStatus,
  BillingPlanId,
} from '../../../../packages/contracts/src/billing.js';

export class BillingStore {
  private db: any = null;
  private dbPath: string | null = null;
  private isInitialized = false;

  constructor(dbPath?: string) {
    this.dbPath = dbPath || null;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized && this.db) {
      return;
    }

    const SQL = await initSqlJs();

    if (this.dbPath && fs.existsSync(this.dbPath)) {
      const fileBuffer = fs.readFileSync(this.dbPath);
      this.db = new SQL.Database(fileBuffer);
    } else {
      this.db = new SQL.Database();
    }

    this.initTables();
    this.isInitialized = true;
  }

  private initTables(): void {
    if (!this.db) throw new Error('Database not initialized');

    this.db.exec(`
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

      CREATE INDEX IF NOT EXISTS idx_billing_subs_workspace ON billing_subscriptions(workspace_id);
      CREATE INDEX IF NOT EXISTS idx_billing_subs_provider_id ON billing_subscriptions(provider_subscription_id);
      CREATE INDEX IF NOT EXISTS idx_webhook_events_provider_id ON webhook_events(provider_event_id);
    `);
  }

  private persist(): void {
    if (this.dbPath && this.db) {
      const data = this.db.export();
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.dbPath, Buffer.from(data));
    }
  }

  public async getSubscriptionByWorkspace(workspaceId: string): Promise<BillingSubscription | null> {
    await this.initialize();
    if (!this.db) return null;

    const stmt = this.db.prepare(
      'SELECT * FROM billing_subscriptions WHERE workspace_id = :workspaceId ORDER BY updated_at DESC LIMIT 1'
    );
    stmt.bind({ ':workspaceId': workspaceId });

    if (stmt.step()) {
      const row = stmt.getAsObject() as any;
      stmt.free();
      return this.mapSubscriptionRow(row);
    }
    stmt.free();
    return null;
  }

  public async getSubscriptionByProviderId(providerSubscriptionId: string): Promise<BillingSubscription | null> {
    await this.initialize();
    if (!this.db) return null;

    const stmt = this.db.prepare(
      'SELECT * FROM billing_subscriptions WHERE provider_subscription_id = :providerId LIMIT 1'
    );
    stmt.bind({ ':providerId': providerSubscriptionId });

    if (stmt.step()) {
      const row = stmt.getAsObject() as any;
      stmt.free();
      return this.mapSubscriptionRow(row);
    }
    stmt.free();
    return null;
  }

  public async saveSubscription(sub: BillingSubscription): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    this.db.run(
      `INSERT INTO billing_subscriptions (
        id, workspace_id, user_id, provider, provider_subscription_id,
        provider_plan_id, plan, status, current_period_start, current_period_end,
        cancel_at_period_end, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(provider_subscription_id) DO UPDATE SET
        plan = excluded.plan,
        status = excluded.status,
        provider_plan_id = excluded.provider_plan_id,
        current_period_start = excluded.current_period_start,
        current_period_end = excluded.current_period_end,
        cancel_at_period_end = excluded.cancel_at_period_end,
        updated_at = excluded.updated_at`,
      [
        sub.id,
        sub.workspaceId,
        sub.userId,
        sub.provider,
        sub.providerSubscriptionId,
        sub.providerPlanId,
        sub.plan,
        sub.status,
        sub.currentPeriodStart || null,
        sub.currentPeriodEnd || null,
        sub.cancelAtPeriodEnd ? 1 : 0,
        sub.createdAt,
        sub.updatedAt,
      ]
    );

    this.persist();
  }

  public async getPaymentByProviderId(providerPaymentId: string): Promise<BillingPayment | null> {
    await this.initialize();
    if (!this.db) return null;

    const stmt = this.db.prepare(
      'SELECT * FROM billing_payments WHERE provider_payment_id = :paymentId LIMIT 1'
    );
    stmt.bind({ ':paymentId': providerPaymentId });

    if (stmt.step()) {
      const row = stmt.getAsObject() as any;
      stmt.free();
      return this.mapPaymentRow(row);
    }
    stmt.free();
    return null;
  }

  public async savePayment(payment: BillingPayment): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    this.db.run(
      `INSERT INTO billing_payments (
        id, workspace_id, provider, provider_payment_id, provider_subscription_id,
        amount, currency, status, created_at, paid_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(provider_payment_id) DO UPDATE SET
        status = excluded.status,
        paid_at = excluded.paid_at`,
      [
        payment.id,
        payment.workspaceId,
        payment.provider,
        payment.providerPaymentId,
        payment.providerSubscriptionId || null,
        payment.amount,
        payment.currency,
        payment.status,
        payment.createdAt,
        payment.paidAt || null,
      ]
    );

    this.persist();
  }

  public async getWebhookEvent(providerEventId: string): Promise<WebhookEvent | null> {
    await this.initialize();
    if (!this.db) return null;

    const stmt = this.db.prepare(
      'SELECT * FROM webhook_events WHERE provider_event_id = :providerEventId LIMIT 1'
    );
    stmt.bind({ ':providerEventId': providerEventId });

    if (stmt.step()) {
      const row = stmt.getAsObject() as any;
      stmt.free();
      return this.mapWebhookEventRow(row);
    }
    stmt.free();
    return null;
  }

  public async recordWebhookEvent(event: WebhookEvent): Promise<boolean> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      this.db.run(
        `INSERT INTO webhook_events (
          id, provider, provider_event_id, event_type, received_at,
          processed_at, status, failure_reason
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.id,
          event.provider,
          event.providerEventId,
          event.eventType,
          event.receivedAt,
          event.processedAt || null,
          event.status,
          event.failureReason || null,
        ]
      );
      this.persist();
      return true;
    } catch (err: any) {
      if (err?.message?.includes('UNIQUE')) {
        return false;
      }
      throw err;
    }
  }

  public async markWebhookEventProcessed(
    providerEventId: string,
    status: 'processed' | 'failed' | 'ignored',
    failureReason?: string | null
  ): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    this.db.run(
      `UPDATE webhook_events SET
        status = ?,
        processed_at = ?,
        failure_reason = ?
      WHERE provider_event_id = ?`,
      [
        status,
        new Date().toISOString(),
        failureReason || null,
        providerEventId,
      ]
    );

    this.persist();
  }

  public async clearAll(): Promise<void> {
    await this.initialize();
    if (!this.db) return;
    this.db.run('DELETE FROM billing_subscriptions');
    this.db.run('DELETE FROM billing_payments');
    this.db.run('DELETE FROM webhook_events');
    this.persist();
  }

  private mapSubscriptionRow(row: any): BillingSubscription {
    return {
      id: row.id,
      workspaceId: row.workspace_id,
      userId: row.user_id,
      provider: 'paypal',
      providerSubscriptionId: row.provider_subscription_id,
      providerPlanId: row.provider_plan_id,
      plan: row.plan as BillingPlanId,
      status: row.status as SubscriptionStatus,
      currentPeriodStart: row.current_period_start || null,
      currentPeriodEnd: row.current_period_end || null,
      cancelAtPeriodEnd: Boolean(row.cancel_at_period_end),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapPaymentRow(row: any): BillingPayment {
    return {
      id: row.id,
      workspaceId: row.workspace_id,
      provider: 'paypal',
      providerPaymentId: row.provider_payment_id,
      providerSubscriptionId: row.provider_subscription_id || null,
      amount: Number(row.amount),
      currency: row.currency,
      status: row.status as PaymentStatus,
      createdAt: row.created_at,
      paidAt: row.paid_at || null,
    };
  }

  private mapWebhookEventRow(row: any): WebhookEvent {
    return {
      id: row.id,
      provider: 'paypal',
      providerEventId: row.provider_event_id,
      eventType: row.event_type,
      receivedAt: row.received_at,
      processedAt: row.processed_at || null,
      status: row.status as any,
      failureReason: row.failure_reason || null,
    };
  }
}

const defaultDbPath = process.env.BILLING_DB_PATH || path.resolve(process.cwd(), 'database', 'data', 'billing.sqlite');
export const defaultBillingStore = new BillingStore(defaultDbPath);
