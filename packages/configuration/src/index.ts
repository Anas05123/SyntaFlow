export const approvedRuntimeModes = ["development", "test", "production"] as const;

export type RuntimeMode = (typeof approvedRuntimeModes)[number];
