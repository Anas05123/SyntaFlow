import type { AiTask } from "../domain/contracts";
import { AiEngineFault } from "../domain/engine-error";

export type AiProviderCapability = "structured-output";

export interface PromptReference {
  readonly id: string;
  readonly version: string;
}

export interface TaskRoute {
  readonly id: string;
  readonly task: AiTask;
  readonly capability: AiProviderCapability;
  readonly prompt: PromptReference;
}

const structuredOutputRoute: TaskRoute = Object.freeze({
  id: "structured-output.v1",
  task: "structured-output",
  capability: "structured-output",
  prompt: Object.freeze({
    id: "coredesk.foundation.structured-output",
    version: "1.0.0",
  }),
});

const coredeskAssistantRoute: TaskRoute = Object.freeze({
  id: "coredesk-assistant.v1",
  task: "coredesk-assistant",
  capability: "structured-output",
  prompt: Object.freeze({ id: "coredesk.ai.assistant", version: "1.0.0" }),
});

export class TaskRouter {
  route(task: string): TaskRoute {
    if (task === coredeskAssistantRoute.task) return coredeskAssistantRoute;
    if (task === structuredOutputRoute.task) {
      return structuredOutputRoute;
    }

    throw new AiEngineFault({
      code: "AI_TASK_UNSUPPORTED",
      message: "The requested AI task is not supported.",
      category: "validation",
      retryable: false,
    });
  }
}
