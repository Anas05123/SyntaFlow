import { useEffect, useMemo, useState } from "react";
import type { HealthResponse, JobsResponse, SafeSettings } from "@atlas/contracts";
import { navItems, pageTitles, type PageId } from "./shell-navigation";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; health: HealthResponse; settings: SafeSettings; jobs: JobsResponse }
  | { status: "failed"; message: string };

const productPages = new Set<PageId>([
  "campaigns",
  "businesses",
  "clients",
  "projects",
  "deployments",
  "atlas-ai",
  "analytics",
]);

export function App(): React.ReactElement {
  const [activePage, setActivePage] = useState<PageId>("command-center");
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let isMounted = true;

    Promise.all([window.atlas.app.health(), window.atlas.settings.read(), window.atlas.jobs.list()])
      .then(([health, settings, jobs]) => {
        if (isMounted) {
          setState({ status: "ready", health, settings, jobs });
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          const message = error instanceof Error ? error.message : "Unknown startup error.";
          setState({ status: "failed", message });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const themeMode = state.status === "ready" ? state.settings.themeMode : "system";
  const resolvedTheme = useResolvedTheme(themeMode);

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  const pageTitle = pageTitles[activePage];

  return (
    <main className="desktop-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand-block">
          <span className="brand-mark" aria-hidden="true">
            A
          </span>
          <div>
            <p className="brand-name">Project Atlas</p>
            <p className="brand-subtitle">Technical Preview</p>
          </div>
        </div>
        <nav className="nav-list">
          {navItems.map((item) => (
            <button
              className={item.id === activePage ? "nav-item active" : "nav-item"}
              key={item.id}
              onClick={() => setActivePage(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="workspace">
        <header className="top-bar">
          <div>
            <p className="eyebrow">Foundation Shell</p>
            <h1>{pageTitle}</h1>
          </div>
          <div className="top-actions">
            <div className="search-placeholder" aria-label="Global search placeholder">
              Search coming soon
            </div>
            <button
              className="status-pill"
              onClick={() => setActivePage("background-jobs")}
              type="button"
            >
              Jobs {state.status === "ready" ? state.jobs.jobs.length : "..."}
            </button>
            {state.status === "ready" ? (
              <ThemeToggle settings={state.settings} setState={setState} />
            ) : null}
            <SystemBadge state={state} />
          </div>
        </header>

        <section className="content-area" aria-live="polite">
          {state.status === "loading" ? <LoadingState /> : null}
          {state.status === "failed" ? <ErrorState message={state.message} /> : null}
          {state.status === "ready" ? (
            <ReadyPage
              activePage={activePage}
              health={state.health}
              jobs={state.jobs}
              settings={state.settings}
              setActivePage={setActivePage}
              setState={setState}
            />
          ) : null}
        </section>
      </section>
    </main>
  );
}

function ReadyPage(props: {
  activePage: PageId;
  health: HealthResponse;
  jobs: JobsResponse;
  settings: SafeSettings;
  setActivePage: (page: PageId) => void;
  setState: React.Dispatch<React.SetStateAction<LoadState>>;
}): React.ReactElement {
  if (props.activePage === "command-center") {
    return <CommandCenter {...props} />;
  }

  if (props.activePage === "settings") {
    return <SettingsScreen settings={props.settings} setState={props.setState} />;
  }

  if (props.activePage === "system-health") {
    return <SystemHealth health={props.health} />;
  }

  if (props.activePage === "background-jobs") {
    return <BackgroundJobs jobs={props.jobs} />;
  }

  if (productPages.has(props.activePage)) {
    return <ComingSoon title={pageTitles[props.activePage]} />;
  }

  return <ErrorState message="This foundation screen is not available yet." />;
}

function CommandCenter(props: {
  health: HealthResponse;
  jobs: JobsResponse;
  settings: SafeSettings;
  setActivePage: (page: PageId) => void;
}): React.ReactElement {
  const healthyCount = Object.values(props.health.services).filter(
    (status) => status === "healthy",
  ).length;
  const serviceCount = Object.keys(props.health.services).length;

  return (
    <div className="page-grid">
      <section className="panel wide-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Preview version {props.health.version}</p>
            <h2>Application foundation is online</h2>
          </div>
          <span className="success-badge">{props.health.status.toUpperCase()}</span>
        </div>
        <p className="muted-text">
          Desktop runtime, safe preload bridge, persistent settings, database foundation and job
          service are available for the technical preview.
        </p>
      </section>
      <StatusCard label="Application" value={props.health.appName} status="healthy" />
      <StatusCard
        label="Database"
        value={props.health.services.database}
        status={props.health.services.database}
      />
      <StatusCard
        label="Settings"
        value={props.settings.themeMode}
        status={props.health.services.settings}
      />
      <StatusCard
        label="Jobs"
        value={`${props.jobs.jobs.length} active records`}
        status={props.health.services.jobs}
      />
      <StatusCard
        label="Migrations"
        value={props.health.services.migrations}
        status={props.health.services.migrations}
      />
      <section className="panel">
        <h2>System Snapshot</h2>
        <p className="metric">
          {healthyCount}/{serviceCount}
        </p>
        <p className="muted-text">Foundation services reporting healthy.</p>
        <button
          className="primary-action"
          onClick={() => props.setActivePage("system-health")}
          type="button"
        >
          View System Health
        </button>
      </section>
      <section className="panel">
        <h2>Background Jobs</h2>
        {props.jobs.jobs.length === 0 ? (
          <p className="muted-text">No background jobs have been started in this preview.</p>
        ) : (
          <p className="muted-text">{props.jobs.jobs.length} job records are available.</p>
        )}
        <button
          className="primary-action"
          onClick={() => props.setActivePage("background-jobs")}
          type="button"
        >
          Open Monitor
        </button>
      </section>
    </div>
  );
}

function SettingsScreen(props: {
  settings: SafeSettings;
  setState: React.Dispatch<React.SetStateAction<LoadState>>;
}): React.ReactElement {
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "failed">("idle");
  const [ollamaUrl, setOllamaUrl] = useState(props.settings.ollamaBaseUrl);

  useEffect(() => {
    setOllamaUrl(props.settings.ollamaBaseUrl);
  }, [props.settings.ollamaBaseUrl]);

  const updateSetting = async (patch: Partial<SafeSettings>): Promise<void> => {
    setSaveState("saving");
    try {
      const settings = await window.atlas.settings.update(patch);
      props.setState((current) =>
        current.status === "ready" ? { ...current, settings } : current,
      );
      setSaveState("saved");
    } catch {
      setSaveState("failed");
    }
  };

  return (
    <div className="settings-layout">
      <section className="panel wide-panel">
        <h2>Persistent Settings</h2>
        <p className="muted-text">
          These values are read from and saved through the Task 003 settings service.
        </p>
        <div className="form-grid">
          <label>
            Theme
            <select
              onChange={(event) =>
                void updateSetting({
                  themeMode: event.currentTarget.value as SafeSettings["themeMode"],
                })
              }
              value={props.settings.themeMode}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label>
            Log level
            <select
              onChange={(event) =>
                void updateSetting({
                  logLevel: event.currentTarget.value as SafeSettings["logLevel"],
                })
              }
              value={props.settings.logLevel}
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="error">Error</option>
              <option value="security">Security</option>
            </select>
          </label>
          <label>
            AI privacy
            <select
              onChange={(event) =>
                void updateSetting({
                  defaultAIPrivacyMode: event.currentTarget
                    .value as SafeSettings["defaultAIPrivacyMode"],
                })
              }
              value={props.settings.defaultAIPrivacyMode}
            >
              <option value="local-only">Local only</option>
              <option value="external-approved">External approved</option>
            </select>
          </label>
          <label>
            Ollama base URL
            <input
              onBlur={() => void updateSetting({ ollamaBaseUrl: ollamaUrl })}
              type="url"
              value={ollamaUrl}
              onChange={(event) => {
                setOllamaUrl(event.currentTarget.value);
                setSaveState("idle");
              }}
            />
          </label>
        </div>
        <p className="muted-text">Ollama runtime integration is not configured in Task 004.</p>
        <p className={`save-state ${saveState}`}>{saveStateLabel(saveState)}</p>
      </section>
    </div>
  );
}

function SystemHealth({ health }: { health: HealthResponse }): React.ReactElement {
  return (
    <section className="panel wide-panel">
      <h2>System Health</h2>
      <div className="service-list">
        {Object.entries(health.services).map(([name, status]) => (
          <div className="service-row" key={name}>
            <span>{humanize(name)}</span>
            <span className={`health-dot ${status}`}>{status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function BackgroundJobs({ jobs }: { jobs: JobsResponse }): React.ReactElement {
  return (
    <section className="panel wide-panel">
      <h2>Background Jobs</h2>
      {jobs.jobs.length === 0 ? (
        <EmptyState
          title="No background jobs"
          body="Job monitoring is ready for future foundation work."
        />
      ) : (
        <div className="job-list">
          {jobs.jobs.map((job) => (
            <div className="job-row" key={job.id}>
              <div>
                <strong>{job.type}</strong>
                <p>{job.state}</p>
              </div>
              <progress max="100" value={job.progress} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ComingSoon({ title }: { title: string }): React.ReactElement {
  return (
    <section className="panel wide-panel">
      <EmptyState
        title={`${title} is reserved for a later task`}
        body="This technical preview only exposes the approved foundation shell and system screens."
      />
    </section>
  );
}

function StatusCard(props: {
  label: string;
  value: string;
  status: HealthResponse["services"][keyof HealthResponse["services"]];
}): React.ReactElement {
  return (
    <section className="panel status-card">
      <span className={`health-dot ${props.status}`}>{props.status}</span>
      <p>{props.label}</p>
      <strong>{props.value}</strong>
    </section>
  );
}

function ThemeToggle(props: {
  settings: SafeSettings;
  setState: React.Dispatch<React.SetStateAction<LoadState>>;
}): React.ReactElement {
  const nextMode = props.settings.themeMode === "dark" ? "light" : "dark";

  const toggleTheme = async (): Promise<void> => {
    const settings = await window.atlas.settings.update({ themeMode: nextMode });
    props.setState((current) => (current.status === "ready" ? { ...current, settings } : current));
  };

  return (
    <button
      className="icon-action"
      onClick={() => void toggleTheme()}
      title="Toggle theme"
      type="button"
    >
      {props.settings.themeMode === "dark" ? "Light" : "Dark"}
    </button>
  );
}

function SystemBadge({ state }: { state: LoadState }): React.ReactElement {
  if (state.status === "loading") {
    return <span className="system-badge loading">Starting</span>;
  }

  if (state.status === "failed") {
    return <span className="system-badge failed">Error</span>;
  }

  const isHealthy = Object.values(state.health.services).every((status) => status === "healthy");
  return (
    <span className={isHealthy ? "system-badge ready" : "system-badge degraded"}>
      {isHealthy ? "Healthy" : "Degraded"}
    </span>
  );
}

function LoadingState(): React.ReactElement {
  return (
    <section className="panel wide-panel">
      <h2>Starting Project Atlas</h2>
      <p className="muted-text">Checking the secure bridge, database, settings and jobs service.</p>
    </section>
  );
}

function ErrorState({ message }: { message: string }): React.ReactElement {
  return (
    <section className="panel error-panel">
      <h2>Startup check failed</h2>
      <p>{message}</p>
    </section>
  );
}

function EmptyState({ title, body }: { title: string; body: string }): React.ReactElement {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

function useResolvedTheme(themeMode: SafeSettings["themeMode"]): "light" | "dark" {
  const [prefersDark, setPrefersDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event: MediaQueryListEvent): void => setPrefersDark(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return useMemo(() => {
    if (themeMode === "system") {
      return prefersDark ? "dark" : "light";
    }

    return themeMode;
  }, [prefersDark, themeMode]);
}

function humanize(value: string): string {
  return value
    .replace(/[A-Z]/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase());
}

function saveStateLabel(saveState: "idle" | "saving" | "saved" | "failed"): string {
  if (saveState === "saving") {
    return "Saving...";
  }

  if (saveState === "saved") {
    return "Settings saved.";
  }

  if (saveState === "failed") {
    return "Settings could not be saved.";
  }

  return "Settings are ready.";
}
