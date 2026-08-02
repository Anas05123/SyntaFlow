export interface MigrationDefinition {
  id: string;
  description: string;
  apply(): Promise<void>;
}

export interface MigrationRecord {
  id: string;
  appliedAt: string;
}

export interface MigrationStore {
  listApplied(): Promise<MigrationRecord[]>;
  recordApplied(id: string): Promise<void>;
  runInTransaction<T>(operation: () => Promise<T>): Promise<T>;
  createBackupHook?(): Promise<void>;
}

export class InMemoryMigrationStore implements MigrationStore {
  readonly applied = new Map<string, MigrationRecord>();

  listApplied(): Promise<MigrationRecord[]> {
    return Promise.resolve([...this.applied.values()]);
  }

  recordApplied(id: string): Promise<void> {
    this.applied.set(id, { id, appliedAt: new Date().toISOString() });
    return Promise.resolve();
  }

  async runInTransaction<T>(operation: () => Promise<T>): Promise<T> {
    return operation();
  }
}

export class MigrationRunner {
  constructor(
    private readonly migrations: MigrationDefinition[],
    private readonly store: MigrationStore = new InMemoryMigrationStore(),
  ) {}

  async status(): Promise<{ applied: MigrationRecord[]; pending: MigrationDefinition[] }> {
    const applied = await this.store.listApplied();
    const appliedIds = new Set(applied.map((record) => record.id));
    return {
      applied,
      pending: this.migrations.filter((migration) => !appliedIds.has(migration.id)),
    };
  }

  async applyPending(): Promise<{ applied: string[] }> {
    const status = await this.status();
    const applied: string[] = [];

    await this.store.createBackupHook?.();
    await this.store.runInTransaction(async () => {
      for (const migration of status.pending) {
        await migration.apply();
        await this.store.recordApplied(migration.id);
        applied.push(migration.id);
      }
    });

    return { applied };
  }

  healthCheck(): "healthy" {
    return "healthy";
  }
}

export const foundationMigrations: MigrationDefinition[] = [
  {
    id: "0001_foundation_metadata",
    description: "Foundation migration placeholder for future SQLite metadata tracking.",
    async apply(): Promise<void> {
      return Promise.resolve();
    },
  },
];
