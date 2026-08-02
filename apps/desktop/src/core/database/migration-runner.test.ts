import { describe, expect, it } from "vitest";
import { InMemoryMigrationStore, MigrationRunner } from "./migration-runner";

describe("MigrationRunner", () => {
  it("reports pending migrations", async () => {
    const runner = new MigrationRunner([
      {
        id: "0001_foundation_metadata",
        description: "Foundation",
        async apply() {
          return Promise.resolve();
        },
      },
    ]);

    await expect(runner.status()).resolves.toMatchObject({
      applied: [],
      pending: [{ id: "0001_foundation_metadata" }],
    });
  });

  it("applies pending migrations through the store", async () => {
    const store = new InMemoryMigrationStore();
    const runner = new MigrationRunner(
      [
        {
          id: "0001_foundation_metadata",
          description: "Foundation",
          async apply() {
            return Promise.resolve();
          },
        },
      ],
      store,
    );

    await expect(runner.applyPending()).resolves.toEqual({
      applied: ["0001_foundation_metadata"],
    });
    await expect(runner.status()).resolves.toMatchObject({ pending: [] });
  });
});
