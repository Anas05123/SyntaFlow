import { z } from "zod";

export const settingsSchema = z.object({
  themeMode: z.enum(["system", "light", "dark"]).default("system"),
  logLevel: z.enum(["debug", "info", "warn", "error", "security"]).default("info"),
  ollamaBaseUrl: z.string().url().default("http://127.0.0.1:11434"),
  defaultAIPrivacyMode: z.enum(["local-only", "external-approved"]).default("local-only"),
  appDataPathDisplay: z.string().min(1).default("Default application data location"),
});

export type SafeSettings = z.infer<typeof settingsSchema>;

export const defaultSettings: SafeSettings = settingsSchema.parse({});

export class SettingsService {
  #settings: SafeSettings;

  constructor(initialSettings: Partial<SafeSettings> = {}) {
    this.#settings = settingsSchema.parse({ ...defaultSettings, ...initialSettings });
  }

  read(): SafeSettings {
    return { ...this.#settings };
  }

  update(patch: Partial<SafeSettings>): SafeSettings {
    this.#settings = settingsSchema.parse({ ...this.#settings, ...patch });
    return this.read();
  }

  healthCheck(): "healthy" {
    settingsSchema.parse(this.#settings);
    return "healthy";
  }
}
