import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { AiEngineRequest, AiEngineResult } from "../../packages/ai-engine/src";

const repositoryRoot = process.cwd();

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(entryPath);
    return /\.[jt]sx?$/.test(entry.name) ? [entryPath] : [];
  });
}

function readSources(directory: string, includeTests = true): string {
  return sourceFiles(directory)
    .filter((file) => includeTests || !/\.(?:test|spec)\.ts$/.test(file))
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
}

describe("AI Engine architecture boundary", () => {
  it("keeps the renderer and preload detached from engine and provider implementations", () => {
    const rendererSource = readSources(path.join(repositoryRoot, "apps/desktop/src/renderer"));
    const preloadSource = readSources(path.join(repositoryRoot, "apps/desktop/src/preload"));
    const desktopSource = readSources(path.join(repositoryRoot, "apps/desktop/src"));
    const presentationSource = rendererSource + "\n" + preloadSource;

    expect(presentationSource).not.toMatch(
      /from\s+["'][^"']*(?:@atlas\/ai-engine|providers[\\/]ai|fake-ai-provider|provider-adapter)/,
    );
    expect(presentationSource).not.toMatch(/@atlas\/ai-engine\/ollama/);
    expect(presentationSource).not.toMatch(/\b(?:fetch|WebSocket)\s*\([^)]*11434/);
    expect(desktopSource).not.toMatch(/["'`]\/?api\/(?:generate|tags)\b/);
  });

  it("keeps the provider-independent engine core detached from providers and runtimes", () => {
    const engineRoot = path.join(repositoryRoot, "packages/ai-engine/src");
    const coreDirectories = ["application", "context", "domain", "prompts", "validation"];
    const coreSource = coreDirectories
      .map((directory) => readSources(path.join(engineRoot, directory), false))
      .concat(
        ["ai-provider.ts", "provider-adapter.ts", "provider-fault.ts"].map((file) =>
          readFileSync(path.join(engineRoot, "providers", file), "utf8"),
        ),
      )
      .join("\n");
    const productionSource = readSources(engineRoot, false);

    expect(coreSource).not.toMatch(/\b(?:Ollama|OpenAI|Anthropic|Gemini)\b/);
    expect(coreSource).not.toMatch(/\b(?:fetch|WebSocket)\s*\(/);
    expect(productionSource).not.toMatch(
      /from\s+["'](?:electron|react|node:|fs(?:[\\/"'])|path["']|os["'])/,
    );
    expect(productionSource).not.toMatch(/:\s*any\b|<any>|as\s+any\b/);
  });

  it("exports only feature-facing contracts from the production entry point", () => {
    const publicApi = readFileSync(
      path.join(repositoryRoot, "packages/ai-engine/src/index.ts"),
      "utf8",
    );

    expect(publicApi).not.toMatch(
      /(?:Ollama|FakeAiProvider|ProviderAdapter|PromptRegistry|ContextBuilder|OutputValidator)/,
    );
  });

  it("locks request and response envelopes to provider-independent fields", () => {
    type UnexpectedRequestKeys = Exclude<
      keyof AiEngineRequest,
      "task" | "input" | "context" | "options"
    >;
    type UnexpectedResultKeys = Exclude<
      keyof AiEngineResult,
      "status" | "content" | "metadata" | "error"
    >;
    const requestContractIsExact: [UnexpectedRequestKeys] extends [never] ? true : false = true;
    const resultContractIsExact: [UnexpectedResultKeys] extends [never] ? true : false = true;

    expect(requestContractIsExact).toBe(true);
    expect(resultContractIsExact).toBe(true);
  });
});
