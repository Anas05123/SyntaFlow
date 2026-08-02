import { describe, expect, it } from "vitest";
import { JobService } from "./job-service";

describe("JobService", () => {
  it("supports the successful job lifecycle", async () => {
    const service = new JobService();
    const created = await service.createJob({ type: "test" });
    const running = await service.startJob(created.id);
    const progressed = await service.updateProgress(created.id, 40);
    const completed = await service.completeJob(created.id);

    expect(running.state).toBe("running");
    expect(progressed.progress).toBe(40);
    expect(completed.state).toBe("completed");
    expect(completed.progress).toBe(100);
  });

  it("supports cancellation before completion", async () => {
    const service = new JobService();
    const created = await service.createJob({ type: "test" });
    const cancelled = await service.cancelJob(created.id);

    expect(cancelled.state).toBe("cancelled");
  });

  it("rejects invalid transitions", async () => {
    const service = new JobService();
    const created = await service.createJob({ type: "test" });

    await expect(service.completeJob(created.id)).rejects.toThrow("Cannot transition");
  });
});
