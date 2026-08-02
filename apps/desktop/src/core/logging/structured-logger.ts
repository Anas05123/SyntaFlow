import { redactMetadata, redactSecrets } from "./redact-secrets";

export type LogLevel = "debug" | "info" | "warn" | "error" | "security";

export interface LogEvent {
  timestamp: string;
  level: LogLevel;
  module: string;
  operation: string;
  message: string;
  requestId?: string;
  jobId?: string;
  metadata?: unknown;
}

export interface LogSink {
  write(event: LogEvent): void;
}

export class MemoryLogSink implements LogSink {
  readonly events: LogEvent[] = [];

  write(event: LogEvent): void {
    this.events.push(event);
  }
}

export class StructuredLogger {
  constructor(private readonly sink: LogSink = new MemoryLogSink()) {}

  debug(input: Omit<LogEvent, "timestamp" | "level">): void {
    this.write("debug", input);
  }

  info(input: Omit<LogEvent, "timestamp" | "level">): void {
    this.write("info", input);
  }

  warn(input: Omit<LogEvent, "timestamp" | "level">): void {
    this.write("warn", input);
  }

  error(input: Omit<LogEvent, "timestamp" | "level">): void {
    this.write("error", input);
  }

  security(input: Omit<LogEvent, "timestamp" | "level">): void {
    this.write("security", input);
  }

  healthCheck(): "healthy" {
    return "healthy";
  }

  private write(level: LogLevel, input: Omit<LogEvent, "timestamp" | "level">): void {
    this.sink.write({
      timestamp: new Date().toISOString(),
      level,
      module: input.module,
      operation: input.operation,
      message: redactSecrets(input.message),
      ...(input.requestId ? { requestId: input.requestId } : {}),
      ...(input.jobId ? { jobId: input.jobId } : {}),
      ...(input.metadata === undefined ? {} : { metadata: redactMetadata(input.metadata) }),
    });
  }
}
