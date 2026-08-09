import { z } from "zod";
import { AtlasApplicationError } from "../../shared/kernel/application-error";
import type { AtlasDatabaseConnection } from "../database/database-connection";

export const settingsSchema = z.object({
  themeMode: z.enum(["system", "light", "dark"]).default("system"),
  logLevel: z.enum(["debug", "info", "warn", "error", "security"]).default("info"),
  ollamaBaseUrl: z.string().url().default("http://127.0.0.1:11434"),
  defaultAIPrivacyMode: z.enum(["local-only", "external-approved"]).default("local-only"),
  appDataPathDisplay: z.string().min(1).default("Default application data location"),
});

export type SafeSettings = z.infer<typeof settingsSchema>;

export const defaultSettings: SafeSettings = settingsSchema.parse({});

const forbiddenSettingKeys = new Set([
  "apiKey",
  "api_key",
  "token",
  "accessToken",
  "access_token",
  "password",
  "secret",
  "credential",
  "credentials",
  "deploymentToken",
  "deployment_token",
]);

export class SettingsService {
  readonly #connection: AtlasDatabaseConnection | undefined;
  #settings: SafeSettings;
  #lastRecovery: "none" | "defaults" | "invalid-persisted-settings" = "none";

  constructor(
    input: { initialSettings?: Partial<SafeSettings>; connection?: AtlasDatabaseConnection } = {},
  ) {
    this.#connection = input.connection;
    this.#settings = settingsSchema.parse({ ...defaultSettings, ...input.initialSettings });
  }

  static fromDatabase(connection: AtlasDatabaseConnection): SettingsService {
    const service = new SettingsService({ connection });
    service.initialize();
    return service;
  }

  initialize(): SafeSettings {
    this.ensureTable();
    const stored = this.#connection?.get<{ value: string }>(
      "SELECT value FROM app_settings WHERE key = ?",
      ["safe_settings"],
    );

    if (!stored) {
      this.persist(defaultSettings);
      this.#settings = { ...defaultSettings };
      this.#lastRecovery = "defaults";
      return this.read();
    }

    try {
      const parsed = settingsSchema.parse(JSON.parse(stored.value));
      assertNoSensitiveSettings(parsed);
      this.#settings = parsed;
      this.#lastRecovery = "none";
      return this.read();
    } catch {
      this.persist(defaultSettings);
      this.#settings = { ...defaultSettings };
      this.#lastRecovery = "invalid-persisted-settings";
      return this.read();
    }
  }

  read(): SafeSettings {
    return { ...this.#settings };
  }

  recoveryStatus(): "none" | "defaults" | "invalid-persisted-settings" {
    return this.#lastRecovery;
  }

  update(patch: Partial<SafeSettings> & Record<string, unknown>): SafeSettings {
    assertNoSensitiveSettings(patch);
    const next = settingsSchema.parse({ ...this.#settings, ...patch });
    assertNoSensitiveSettings(next);
    this.persist(next);
    this.#settings = next;
    this.#lastRecovery = "none";
    return this.read();
  }

  healthCheck(): "healthy" | "unhealthy" {
    try {
      settingsSchema.parse(this.#settings);
      return "healthy";
    } catch {
      return "unhealthy";
    }
  }

  private ensureTable(): void {
    this.#connection?.execute(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  private persist(settings: SafeSettings): void {
    if (!this.#connection) {
      return;
    }

    this.#connection.transaction(() => {
      this.#connection?.run(
        `
          INSERT INTO app_settings (key, value)
          VALUES (?, ?)
          ON CONFLICT(key) DO UPDATE SET
            value = excluded.value,
            updated_at = CURRENT_TIMESTAMP
        `,
        ["safe_settings", JSON.stringify(settingsSchema.parse(settings))],
      );
    });
  }
}

export function assertNoSensitiveSettings(value: Record<string, unknown>): void {
  const lowerKeys = Object.keys(value).map((key) => key.toLowerCase());
  const hasSecret = [...forbiddenSettingKeys].some((key) => lowerKeys.includes(key.toLowerCase()));

  if (hasSecret) {
    throw new AtlasApplicationError({
      code: "SETTINGS_SECRET_REJECTED",
      message: "Sensitive settings must use Secure Storage and cannot be saved in SQLite settings.",
      category: "security",
      retryable: false,
    });
  }
}
