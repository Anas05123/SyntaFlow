export interface ChangelogRelease {
  version: string;
  date: string;
  badge: string;
  summary: string;
  highlights: string[];
}

export const CHANGELOG_RELEASES: ChangelogRelease[] = [
  {
    version: 'v0.1.0-preview',
    date: 'September 2026',
    badge: 'LATEST DESKTOP RELEASE',
    summary: 'Public preview release of Syntaflow Desktop: frameless Electron architecture, verified 7-stage client lifecycle, and local-first persistence.',
    highlights: [
      'Frameless Electron BrowserWindow with multi-monitor safe geometry and reload protection',
      'Operator Cockpit (Home) with urgent attention blockers, active project resume banner, and client pulse runway',
      'Clients Workspace with master-detail split view and Apple-style Onboarding Drawer',
      'Blueprint Scoping Studio for Brand Identity, Web Experience, and Strategic Retainers',
      'Responsive Tasks Workspace with dual [ Board ] and [ List ] views and decoupled 3D status',
      'Document Studio featuring unified 3-column continuous paper canvas and DocVersion immutability',
      'Review Transmission Studio with SLA chips and 3 presentation templates (Editorial, Modern, Enterprise)',
      'Delivery Gate Enforcement guaranteeing 100% deliverable sign-off before project handover',
      'Secure local scrypt authentication and Electron safeStorage session encryption',
    ],
  },
  {
    version: 'v0.0.9-alpha',
    date: 'August 2026',
    badge: 'INTERNAL ALPHA',
    summary: 'Initial core consolidation of the client lifecycle engine and headless verification suite.',
    highlights: [
      'Consolidated React 19 and Vite 8 architecture with zero type errors',
      'Playwright headless verification suite validating 35/35 application routes and interaction lifecycles',
      'Universal search palette (⌘K) indexing clients, projects, tasks, and document versions',
      'Appearance customization engine supporting dark graphite canonical theme and accent selection',
    ],
  },
];
