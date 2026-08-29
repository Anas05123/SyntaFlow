import { describe, expect, it } from "vitest";
import { navItems, pageTitles } from "./shell-navigation";

describe("desktop shell navigation", () => {
  it("includes the approved foundation navigation entries", () => {
    expect(navItems.map((item) => item.label)).toEqual([
      "Command Center",
      "Campaigns",
      "Businesses",
      "Clients",
      "Projects",
      "Deployments",
      "Atlas AI",
      "Analytics",
      "Settings",
    ]);
  });

  it("keeps future product modules in the navigation without adding feature routes", () => {
    const futureModules = [
      "Campaigns",
      "Businesses",
      "Clients",
      "Projects",
      "Deployments",
      "Atlas AI",
      "Analytics",
    ];

    expect(navItems.filter((item) => futureModules.includes(item.label))).toHaveLength(
      futureModules.length,
    );
  });

  it("has titles for system foundation screens", () => {
    expect(pageTitles["command-center"]).toBe("Command Center");
    expect(pageTitles["system-health"]).toBe("System Health");
    expect(pageTitles["background-jobs"]).toBe("Background Jobs");
    expect(pageTitles.settings).toBe("Settings");
  });
});
