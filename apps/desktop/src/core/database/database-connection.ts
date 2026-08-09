import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";
import { AtlasApplicationError } from "../../shared/kernel/application-error";

export type QueryPrimitive = string | number | Uint8Array | null;
export type QueryParameters = Record<string, QueryPrimitive> | QueryPrimitive[];

export interface DatabaseHealth {
  status: "healthy" | "unhealthy";
  databasePath: string;
  foreignKeysEnabled: boolean;
  journalMode: string;
  integrity: string;
  error?: string;
}

let sqlRuntime: Promise<SqlJsStatic> | null = null;

export class AtlasDatabaseConnection {
  readonly databasePath: string;
  private readonly SQL: SqlJsStatic;
  database: Database;

  private constructor(databasePath: string, database: Database, SQL: SqlJsStatic) {
    this.databasePath = databasePath;
    this.database = database;
    this.SQL = SQL;
  }

  static async open(databasePath: string): Promise<AtlasDatabaseConnection> {
    const resolvedPath = path.resolve(databasePath);
    if (!resolvedPath.endsWith(".sqlite")) {
      throw new AtlasApplicationError({
        code: "DATABASE_INVALID_PATH",
        message: "Database path must resolve to a SQLite file.",
        category: "validation",
        retryable: false,
      });
    }

    mkdirSync(path.dirname(resolvedPath), { recursive: true });
    const SQL = await getSqlRuntime();
    const database = existsSync(resolvedPath)
      ? new SQL.Database(readFileSync(resolvedPath))
      : new SQL.Database();
    const connection = new AtlasDatabaseConnection(resolvedPath, database, SQL);
    connection.configure();
    connection.persist();
    return connection;
  }

  close(): void {
    this.persist();
    this.database.close();
  }

  execute(sql: string): void {
    this.database.exec(sql);
    this.persist();
  }

  run(sql: string, parameters: QueryParameters = []): void {
    const statement = this.database.prepare(sql);
    try {
      bindAndRun(statement, parameters);
    } finally {
      statement.free();
    }
    this.persist();
  }

  get<T extends Record<string, unknown>>(
    sql: string,
    parameters: QueryParameters = [],
  ): T | undefined {
    const rows = this.all<T>(sql, parameters);
    return rows[0];
  }

  all<T extends Record<string, unknown>>(sql: string, parameters: QueryParameters = []): T[] {
    const statement = this.database.prepare(sql);
    try {
      bindParameters(statement, parameters);
      const rows: T[] = [];
      while (statement.step()) {
        rows.push(statement.getAsObject() as T);
      }
      return rows;
    } finally {
      statement.free();
    }
  }

  transaction<T>(operation: () => T): T {
    const before = this.database.export();
    try {
      const result = operation();
      this.persist();
      return result;
    } catch (error) {
      this.database.close();
      this.database = new this.SQL.Database(before);
      this.configure();
      this.persist();
      throw error;
    }
  }

  healthCheck(): DatabaseHealth {
    try {
      this.configure();
      const foreignKeys = this.get<{ foreign_keys: number }>("PRAGMA foreign_keys");
      const integrity = this.get<{ integrity_check: string }>("PRAGMA integrity_check");

      return {
        status:
          foreignKeys?.foreign_keys === 1 && integrity?.integrity_check === "ok"
            ? "healthy"
            : "unhealthy",
        databasePath: this.databasePath,
        foreignKeysEnabled: foreignKeys?.foreign_keys === 1,
        journalMode: "delete",
        integrity: integrity?.integrity_check ?? "unknown",
      };
    } catch (error) {
      return {
        status: "unhealthy",
        databasePath: this.databasePath,
        foreignKeysEnabled: false,
        journalMode: "unknown",
        integrity: "unknown",
        error: error instanceof Error ? error.message : "Unknown database health error",
      };
    }
  }

  private configure(): void {
    this.database.run("PRAGMA foreign_keys = ON");
  }

  private persist(): void {
    writeFileSync(this.databasePath, Buffer.from(this.database.export()));
  }
}

function getSqlRuntime(): Promise<SqlJsStatic> {
  sqlRuntime ??= initSqlJs();
  return sqlRuntime;
}

function bindAndRun(statement: import("sql.js").Statement, parameters: QueryParameters): void {
  bindParameters(statement, parameters);
  statement.step();
}

function bindParameters(statement: import("sql.js").Statement, parameters: QueryParameters): void {
  if (Array.isArray(parameters) && parameters.length === 0) {
    return;
  }

  if (!Array.isArray(parameters) && Object.keys(parameters).length === 0) {
    return;
  }

  statement.bind(parameters);
}
