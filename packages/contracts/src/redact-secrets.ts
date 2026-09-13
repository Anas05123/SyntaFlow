const secretPattern =
  /\b(token|api_key|apiKey|password|secret|access_token|authorization|deployment_credential)\s*[:=]\s*([^\s,;}]+)/gi;

export function redactSecrets(message: string): string {
  return message.replace(secretPattern, (_match, key: string) => `${key}=[REDACTED]`);
}

export function redactMetadata(value: unknown): unknown {
  if (typeof value === "string") {
    return redactSecrets(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactMetadata(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        if (/token|api.?key|password|secret|credential|authorization/i.test(key)) {
          return [key, "[REDACTED]"];
        }

        return [key, redactMetadata(item)];
      }),
    );
  }

  return value;
}
