/**
 * Syntaflow Unified Pricing & Plan Configuration
 * Canonical single source of truth for public pricing (syntaflow.tech/pricing)
 * and authenticated account plans (app.syntaflow.tech/plan).
 */

export interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  priceLabel: string;
  periodLabel: string;
  description: string;
  featured?: boolean;
  status: 'active' | 'planned' | 'coming_soon';
  ctaLabel: string;
  ctaAction: 'download' | 'signup' | 'upgrade' | 'notify';
  features: string[];
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'preview',
    name: 'Desktop Preview',
    badge: 'FREE PREVIEW',
    priceLabel: '$0',
    periodLabel: 'during preview',
    description: 'Complete local-first client operating environment for independent practitioners and early adopters.',
    featured: true,
    status: 'active',
    ctaLabel: 'Get Syntaflow Preview',
    ctaAction: 'signup',
    features: [
      'Full desktop workspace for Windows 10/11 x64',
      'Local-first SQLite storage — 100% on your device',
      'Unlimited client accounts & commercial terms',
      'Blueprint Scoping Studio & Dual-Density Task Boards',
      'Typographic Paper Canvas Document Studio',
      'Immutable review packages & delivery sign-offs',
      'Core integrations (Gmail, Google Drive, Calendar, GitHub)',
      'Local-first AI TaskRouter with contextual drafting',
      'Encrypted Windows DPAPI OAuth vault',
    ],
  },
  {
    id: 'pro',
    name: 'Syntaflow Pro',
    badge: 'POPULAR',
    priceLabel: '$19',
    periodLabel: 'month (recurring)',
    description: 'For independent professionals managing client work.',
    featured: false,
    status: 'active',
    ctaLabel: 'Upgrade with PayPal',
    ctaAction: 'upgrade',
    features: [
      'Everything in Desktop Preview',
      'Syntaflow Pro monthly subscription license',
      'Local-first SQLite data sovereignty',
      'Verified server-side PayPal payment reconciliation',
      'Active entitlement state & license badge',
      'Seamless account subscription management & cancellation',
    ],
  },
  {
    id: 'team',
    name: 'Syntaflow Studio / Team',
    badge: 'PLANNED',
    priceLabel: 'TBD',
    periodLabel: 'announced before GA',
    description: 'Collaborative delivery gates, multi-seat workspace authorities, and centralized client review portals.',
    featured: false,
    status: 'planned',
    ctaLabel: 'Notify Me',
    ctaAction: 'notify',
    features: [
      'Everything in Syntaflow Pro',
      'Multi-seat workspace licenses & pooled storage',
      'Role-based approval authorities & delivery gates',
      'Centralized client review portals with audit trails',
      'Custom organizational domains & SSO',
      'Dedicated migration & onboarding support',
      'SLA guarantee for sync infrastructure',
    ],
  },
];

export const PRICING_FAQ = [
  {
    question: 'Is the Desktop Preview truly free?',
    answer:
      'Yes. Syntaflow Desktop Preview is completely free with no credit card required and no hidden time limits during the preview period. All local-first features are fully unlocked.',
  },
  {
    question: 'Where is my client data stored?',
    answer:
      'Syntaflow is local-first. Your projects, client terms, documents, and notes are stored directly on your physical computer in an encrypted SQLite database. You maintain complete sovereignty over your data.',
  },
  {
    question: 'Will there be a subscription or perpetual license?',
    answer:
      'We believe in fair, transparent pricing. When GA launches, Syntaflow will offer a straightforward choice between a perpetual license for local-first desktop work and an optional cloud subscription for multi-device sync and team collaboration.',
  },
  {
    question: 'How do cloud integrations work with local storage?',
    answer:
      'OAuth credentials for Gmail, Google Calendar, Google Drive, GitHub, and other tools are encrypted in your operating system vault (Windows DPAPI). API calls retrieve only the specific context you request without sending your database to third-party clouds.',
  },
];
