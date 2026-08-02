import { describe, expect, it } from "vitest";
import { redactSecrets } from "./redact-secrets";
import { MemoryLogSink, StructuredLogger } from "./structured-logger";

describe("StructuredLogger", () => {
  it("redacts secrets from messages and metadata", () => {
    const sink = new MemoryLogSink();
    const logger = new StructuredLogger(sink);

    logger.info({
      module: "test",
      operation: "redaction",
      message: "token=abc123",
      metadata: { apiKey: "secret-value", nested: { password: "hidden" } },
    });

    expect(sink.events[0]?.message).toBe("token=[REDACTED]");
    expect(sink.events[0]?.metadata).toEqual({
      apiKey: "[REDACTED]",
      nested: { password: "[REDACTED]" },
    });
  });

  it("redacts colon separated secret strings", () => {
    expect(redactSecrets("authorization: bearer-token")).toBe("authorization=[REDACTED]");
  });
});
