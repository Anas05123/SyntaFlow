export interface RoadmapItem {
  stage: 'CURRENT FOUNDATION' | 'NEXT PHASE' | 'FUTURE HORIZON';
  title: string;
  tagline: string;
  status: 'AVAILABLE NOW' | 'IN DEVELOPMENT' | 'PLANNED DIRECTION';
  narrative: string;
  deliverables: string[];
}

export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    stage: 'CURRENT FOUNDATION',
    title: 'The Local-First Desktop Operating Environment',
    tagline: 'Grounded operational reality',
    status: 'AVAILABLE NOW',
    narrative: 'A high-density desktop application for Windows 10 and 11 that keeps one continuous record of every client engagement from first contact through final delivery. Operates 100% offline with zero telemetry and physical machine data isolation.',
    deliverables: [
      'Frameless Electron runtime with multi-monitor window geometry memory',
      'Operator Cockpit, Clients split-view, and Onboarding Studio drawer',
      'Blueprint Scoping Studio with fixed, retainer, and hourly commercial models',
      'Dual Board/List Tasks workspace with decoupled status, attention, and priority',
      'Document Studio with continuous paper canvas and immutable DocVersion snapshots',
      '5-step Review Transmission Studio with SLA chips and 3 presentation templates',
      'Delivery gate enforcement and client approval audit trails',
    ],
  },
  {
    stage: 'NEXT PHASE',
    title: 'SQLite Database Migration & Web Client Portal',
    tagline: 'Engine durability and seamless external review',
    status: 'IN DEVELOPMENT',
    narrative: 'Transitioning the current browser-based local storage to an embedded native SQLite database engine for instant search and massive historical archives. Introducing a read-only browser-based guest review portal allowing clients to approve deliverables without installing software.',
    deliverables: [
      'SQLite native migration utilizing verified schema migrations in database/migrations/',
      'Automated local database backup, snapshot compaction, and binary export',
      'Web-based guest review portal allowing clients to view and approve deliverables via tokenized web links',
      'macOS desktop distribution with native Apple Silicon and Intel code signatures',
    ],
  },
  {
    stage: 'FUTURE HORIZON',
    title: 'Syntaflow AI Engine, Autonomous Agents & Developer APIs',
    tagline: 'Connected intelligence across context and execution',
    status: 'PLANNED DIRECTION',
    narrative: 'Software fragmented work. AI made intelligence available. But AI without context still starts from zero. The next generation of Syntaflow connects deep engagement context with local AI intelligence — allowing TaskRouter to assist in drafting proposals, summarizing feedback, and checking delivery gates, all while keeping people in control.',
    deliverables: [
      'Local-first AI TaskRouter routing execution requests to local Ollama LLM instances (localhost:11434)',
      'PromptRegistry enforcing prompt isolation; models only receive explicitly bound context',
      'Autonomous client workflows: auto-detecting feedback changes and preparing draft revision briefs',
      'Public Developer APIs, typed webhooks, and SDKs for custom studio integrations',
      'Syntaflow Voice: natural language workspace navigation and query interface',
    ],
  },
];
