import path from "node:path";
import { AtlasApplicationError } from "../../shared/kernel/application-error";

export type AppEnvironment = "development" | "test" | "production";

export interface AppDataPaths {
  root: string;
  database: string;
  projects: string;
  assets: string;
  backups: string;
  logs: string;
  cache: string;
  temporary: string;
}

const directoryNames = {
  database: "database",
  projects: "projects",
  assets: "assets",
  backups: "backups",
  logs: "logs",
  cache: "cache",
  temporary: "temporary",
} as const;

export function resolveAppDataPaths(input: {
  basePath: string;
  environment: AppEnvironment;
}): AppDataPaths {
  const root = path.resolve(input.basePath, `ai-agency-os-${input.environment}`);
  const repositoryRoot = findRepositoryRoot(process.cwd());

  if (repositoryRoot && isPathInside(root, repositoryRoot)) {
    throw new AtlasApplicationError({
      code: "APP_DATA_INSIDE_REPOSITORY",
      message: "Application data cannot be stored inside the source repository.",
      category: "security",
      retryable: false,
    });
  }

  return {
    root,
    database: resolveChildPath(root, directoryNames.database),
    projects: resolveChildPath(root, directoryNames.projects),
    assets: resolveChildPath(root, directoryNames.assets),
    backups: resolveChildPath(root, directoryNames.backups),
    logs: resolveChildPath(root, directoryNames.logs),
    cache: resolveChildPath(root, directoryNames.cache),
    temporary: resolveChildPath(root, directoryNames.temporary),
  };
}

export function resolveChildPath(root: string, child: string): string {
  if (child.includes("..") || path.isAbsolute(child)) {
    throw new AtlasApplicationError({
      code: "APP_DATA_PATH_TRAVERSAL",
      message: "Application data path traversal was rejected.",
      category: "security",
      retryable: false,
    });
  }

  const resolvedRoot = path.resolve(root);
  const resolvedChild = path.resolve(resolvedRoot, child);

  if (!isPathInside(resolvedChild, resolvedRoot)) {
    throw new AtlasApplicationError({
      code: "APP_DATA_PATH_OUTSIDE_ROOT",
      message: "Application data path escaped the approved root.",
      category: "security",
      retryable: false,
    });
  }

  return resolvedChild;
}

function isPathInside(candidate: string, root: string): boolean {
  const relative = path.relative(path.resolve(root), path.resolve(candidate));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function findRepositoryRoot(startPath: string): string | null {
  const normalized = path.resolve(startPath);
  const parts = normalized.split(path.sep);

  for (let index = parts.length; index > 0; index -= 1) {
    const candidate = parts.slice(0, index).join(path.sep);
    if (candidate.endsWith("project-atlas")) {
      return candidate;
    }
  }

  return null;
}
