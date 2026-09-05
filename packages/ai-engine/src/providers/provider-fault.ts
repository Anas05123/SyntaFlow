export type ProviderFailureKind = "unavailable" | "timeout" | "failed";

export class ProviderFault extends Error {
  constructor(readonly kind: ProviderFailureKind) {
    super("The AI provider operation failed.");
    this.name = "ProviderFault";
  }
}
