import { useEffect, useState } from "react";
import type { HealthResponse } from "@atlas/contracts";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; health: HealthResponse }
  | { status: "failed"; message: string };

export function App(): React.ReactElement {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let isMounted = true;

    window.atlas.app
      .health()
      .then((health) => {
        if (isMounted) {
          setState({ status: "ready", health });
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

  return (
    <main className="app-shell">
      <section className="foundation-panel" aria-labelledby="app-title">
        <p className="eyebrow">Project Atlas</p>
        <h1 id="app-title">AI Agency OS</h1>
        <p className="summary">
          Runtime foundation is active. Product modules begin after foundation services review.
        </p>
        <div className="status-row" role="status">
          {state.status === "loading" ? "Checking secure preload bridge..." : null}
          {state.status === "ready"
            ? `Secure bridge online: ${state.health.status}. Services: ${Object.values(
                state.health.services,
              ).join(", ")}`
            : null}
          {state.status === "failed" ? `Startup check failed: ${state.message}` : null}
        </div>
      </section>
    </main>
  );
}
