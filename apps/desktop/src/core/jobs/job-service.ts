import { randomUUID } from "node:crypto";
import type { ApplicationError } from "@atlas/contracts";
import { AtlasApplicationError } from "../../shared/kernel/application-error";

export type JobState = "queued" | "running" | "completed" | "failed" | "cancelled";

export interface JobRecord {
  id: string;
  type: string;
  state: JobState;
  progress: number;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  updatedAt: string;
  error?: ApplicationError;
}

export interface JobPersistenceAdapter {
  save(job: JobRecord): Promise<void>;
  list(): Promise<JobRecord[]>;
}

export class FakeJobPersistenceAdapter implements JobPersistenceAdapter {
  readonly records = new Map<string, JobRecord>();

  save(job: JobRecord): Promise<void> {
    this.records.set(job.id, { ...job });
    return Promise.resolve();
  }

  list(): Promise<JobRecord[]> {
    return Promise.resolve([...this.records.values()].map((job) => ({ ...job })));
  }
}

export class JobService {
  readonly #jobs = new Map<string, JobRecord>();

  constructor(
    private readonly persistence: JobPersistenceAdapter = new FakeJobPersistenceAdapter(),
  ) {}

  async createJob(input: { type: string; maxAttempts?: number }): Promise<JobRecord> {
    const now = new Date().toISOString();
    const job: JobRecord = {
      id: randomUUID(),
      type: input.type,
      state: "queued",
      progress: 0,
      attempts: 0,
      maxAttempts: input.maxAttempts ?? 1,
      createdAt: now,
      updatedAt: now,
    };
    await this.save(job);
    return job;
  }

  getJob(id: string): JobRecord | null {
    const job = this.#jobs.get(id);
    return job ? { ...job } : null;
  }

  listJobs(): JobRecord[] {
    return [...this.#jobs.values()].map((job) => ({ ...job }));
  }

  async startJob(id: string): Promise<JobRecord> {
    const job = this.requireJob(id);
    if (job.state !== "queued") {
      throw invalidTransition(job.state, "running");
    }
    return this.save({ ...job, state: "running", attempts: job.attempts + 1 });
  }

  async updateProgress(id: string, progress: number): Promise<JobRecord> {
    const job = this.requireJob(id);
    if (job.state !== "running") {
      throw invalidTransition(job.state, "progress");
    }
    return this.save({ ...job, progress: Math.max(0, Math.min(100, progress)) });
  }

  async completeJob(id: string): Promise<JobRecord> {
    const job = this.requireJob(id);
    if (job.state !== "running") {
      throw invalidTransition(job.state, "completed");
    }
    return this.save({ ...job, state: "completed", progress: 100 });
  }

  async failJob(id: string, error: ApplicationError): Promise<JobRecord> {
    const job = this.requireJob(id);
    if (job.state !== "running") {
      throw invalidTransition(job.state, "failed");
    }
    return this.save({ ...job, state: "failed", error });
  }

  async cancelJob(id: string): Promise<JobRecord> {
    const job = this.requireJob(id);
    if (job.state === "completed" || job.state === "failed" || job.state === "cancelled") {
      throw invalidTransition(job.state, "cancelled");
    }
    return this.save({ ...job, state: "cancelled" });
  }

  healthCheck(): "healthy" {
    return "healthy";
  }

  private requireJob(id: string): JobRecord {
    const job = this.#jobs.get(id);
    if (!job) {
      throw new AtlasApplicationError({
        code: "JOB_NOT_FOUND",
        message: "The requested job does not exist.",
        category: "not-found",
        retryable: false,
      });
    }
    return job;
  }

  private async save(job: JobRecord): Promise<JobRecord> {
    const updated = { ...job, updatedAt: new Date().toISOString() };
    this.#jobs.set(updated.id, updated);
    await this.persistence.save(updated);
    return { ...updated };
  }
}

function invalidTransition(from: JobState, to: string): AtlasApplicationError {
  return new AtlasApplicationError({
    code: "JOB_INVALID_STATE_TRANSITION",
    message: `Cannot transition job from ${from} to ${to}.`,
    category: "conflict",
    retryable: false,
  });
}
