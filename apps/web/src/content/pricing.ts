export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period?: string;
  status: 'available' | 'coming-soon';
  badge?: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlighted?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'preview',
    name: 'Desktop Preview',
    tagline: 'Complete client operating environment for early adopters.',
    price: '$0',
    period: 'during preview',
    status: 'available',
    badge: 'FREE PREVIEW',
    description: 'Full-featured local-first desktop workspace with unconstrained client and project management.',
    features: [
      'Full desktop workspace for Windows 10/11 x64',
      'Unlimited client accounts & commercial terms',
      'Blueprint scoping studio & dual-density task boards',
      'Document Studio with typographic paper canvas',
      'Immutable review packages & delivery sign-offs',
      'Core integrations (Gmail, Google Calendar, Google Drive)',
      'Local-first SQLite storage with zero cloud telemetry',
      'Direct local AI model support (Ollama / offline)',
    ],
    ctaLabel: 'Join Preview — Free',
    ctaHref: '/download',
    highlighted: true,
  },
  {
    id: 'pro',
    name: 'Syntaflow Pro',
    tagline: 'Advanced automation, continuous context & studio sync.',
    price: 'Pricing TBD',
    period: 'announced before GA',
    status: 'coming-soon',
    badge: 'PLANNED',
    description: 'Designed for high-throughput solo consultants and independent studio directors.',
    features: [
      'Everything in Desktop Preview',
      'Perpetual license or optional cloud sync tier',
      'Multi-device encrypted database synchronization',
      'AI TaskRouter with contextual workspace synthesis',
      'Custom blueprint creation & portfolio showcase themes',
      'Extended integrations (Figma, Notion, Slack, Linear)',
      'Priority vulnerability disclosures & release channel',
    ],
    ctaLabel: 'Get Notified at Launch',
    ctaHref: '/contact?topic=pricing-pro',
  },
  {
    id: 'team',
    name: 'Syntaflow Studio / Team',
    tagline: 'Collaborative delivery gates and multi-seat authorities.',
    price: 'Pricing TBD',
    period: 'announced before GA',
    status: 'coming-soon',
    badge: 'PLANNED',
    description: 'Built for boutique agencies and advisory practices with shared client delivery standards.',
    features: [
      'Everything in Syntaflow Pro',
      'Multi-seat workspace licenses & pooled storage',
      'Role-based approval authorities & delivery gates',
      'Centralized client review portals with audit trails',
      'Custom organizational domains & SSO readiness',
      'Dedicated integration engineering support',
    ],
    ctaLabel: 'Inquire About Studio Pilot',
    ctaHref: '/contact?topic=pricing-studio',
  },
];

export interface PricingFAQ {
  question: string;
  answer: string;
}

export const PRICING_FAQS: PricingFAQ[] = [
  {
    question: 'Is Syntaflow currently free?',
    answer:
      'Yes. During the Desktop Preview period, Syntaflow is completely free to download and use with full access to all workspace domains, client management, task boards, document studios, and core integrations.',
  },
  {
    question: 'What happens to my data after the preview ends?',
    answer:
      'Your data stays on your machine. Syntaflow is architected local-first with a physical SQLite database. You retain 100% ownership of your records, and your local workspace will remain fully functional and exportable to standard JSON formats regardless of future commercial tiers.',
  },
  {
    question: 'Will integrations cost extra?',
    answer:
      'Core integrations (including Google Workspace, Gmail, Calendar, and Drive) connect directly through standard OAuth or official MCP protocols. Syntaflow does not charge per-call integration tolls for direct connections.',
  },
  {
    question: 'Does Syntaflow include cloud AI model costs?',
    answer:
      'Syntaflow is designed to connect to your own preferred intelligence providers — including local offline models via Ollama or your own API keys. We do not markup LLM tokens or force proprietary subscription bundles.',
  },
  {
    question: 'Are team accounts available today?',
    answer:
      'Not yet. The preview build is currently tailored for solo practitioners, boutique directors, and single-operator studios. Multi-seat team workspaces and shared review portals are in active engineering.',
  },
];
