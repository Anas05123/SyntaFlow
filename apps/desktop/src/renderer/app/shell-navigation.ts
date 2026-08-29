export type PageId =
  | "command-center"
  | "campaigns"
  | "businesses"
  | "clients"
  | "projects"
  | "deployments"
  | "atlas-ai"
  | "analytics"
  | "system-health"
  | "background-jobs"
  | "settings";

export const navItems: Array<{ id: PageId; label: string }> = [
  { id: "command-center", label: "Command Center" },
  { id: "campaigns", label: "Campaigns" },
  { id: "businesses", label: "Businesses" },
  { id: "clients", label: "Clients" },
  { id: "projects", label: "Projects" },
  { id: "deployments", label: "Deployments" },
  { id: "atlas-ai", label: "Atlas AI" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" },
];

export const pageTitles: Record<PageId, string> = {
  "command-center": "Command Center",
  campaigns: "Campaigns",
  businesses: "Businesses",
  clients: "Clients",
  projects: "Projects",
  deployments: "Deployments",
  "atlas-ai": "Atlas AI",
  analytics: "Analytics",
  "system-health": "System Health",
  "background-jobs": "Background Jobs",
  settings: "Settings",
};
