export type FakeProviderMode =
  | "success"
  | "slow-response"
  | "timeout"
  | "invalid-response"
  | "authentication-failure"
  | "rate-limit"
  | "cancelled"
  | "unavailable";

export interface FakeProviderScenario {
  mode: FakeProviderMode;
  delayMs?: number;
}

export class FakeAIProvider {
  public readonly id = "fake-ai-provider";

  public constructor(private readonly scenario: FakeProviderScenario = { mode: "success" }) {}

  public async execute(): Promise<{ status: "success"; output: string }> {
    if (this.scenario.delayMs) {
      await new Promise((resolve) => setTimeout(resolve, this.scenario.delayMs));
    }

    if (this.scenario.mode !== "success") {
      throw new Error(`Fake provider scenario failed: ${this.scenario.mode}`);
    }

    return { status: "success", output: "fake-output" };
  }
}
