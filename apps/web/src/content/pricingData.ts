export interface PricingTier {
  id: 'solo' | 'studio' | 'enclave';
  name: string;
  badge?: string;
  tagline: string;
  priceMonthly?: number;
  priceAnnualMonthly?: number;
  pricePerpetual: number;
  renewalPerpetual?: number;
  previewNotice?: string;
  description: string;
  highlighted?: boolean;
  ctaText: string;
  ctaHref: string;
  features: string[];
}

export interface FeatureComparisonGroup {
  category: string;
  items: {
    name: string;
    description?: string;
    solo: boolean | string;
    studio: boolean | string;
    enclave: boolean | string;
  }[];
}

export interface PricingFAQ {
  question: string;
  answer: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'solo',
    name: 'Solo Practitioner',
    tagline: 'Local Sovereignty Core',
    pricePerpetual: 89,
    previewNotice: '100% Free during Public Preview (v0.1)',
    description: 'For independent consultants, freelance engineers, and solo designers who want absolute control over client records without recurring SaaS fees.',
    highlighted: false,
    ctaText: 'Download Free Preview',
    ctaHref: '/download',
    features: [
      'Full desktop client for Windows (Mac & Linux coming)',
      'Unlimited client dossiers, scoping blueprints & milestones',
      'Document Studio with continuous paper canvas',
      'Immutable DocVersion snapshots & diff comparison',
      'Delivery Gate enforcement & sign-off receipts',
      '100% offline, local SQLite engine (zero telemetry)',
      '1 year of included software updates & patches',
      'Keep your version forever with zero expiration',
    ],
  },
  {
    id: 'studio',
    name: 'Studio Team',
    badge: 'Most Popular for Agencies',
    tagline: 'Connected Operations',
    priceMonthly: 24,
    priceAnnualMonthly: 19,
    pricePerpetual: 199,
    renewalPerpetual: 79,
    description: 'For boutique agencies and multi-operator delivery studios who need external client review portals and unified project accounting.',
    highlighted: true,
    ctaText: 'Start 14-Day Studio Trial',
    ctaHref: '/contact?tier=studio',
    features: [
      'Everything in Solo Practitioner, plus:',
      'Web Guest Review Portal (clients approve in browser)',
      'Unlimited free client guest reviewers (zero seat tax)',
      'Cryptographic client approval audit trail & signatures',
      'Centralized retainer billing & contract graph',
      'Priority desktop engine patches & early access',
      'Multi-seat local-sync mesh for team handoffs',
      'Exportable client handover dossiers (ZIP/PDF)',
    ],
  },
  {
    id: 'enclave',
    name: 'Studio Enclave',
    badge: 'Buy Once, Own Forever',
    tagline: 'Self-Hosted Sovereignty',
    pricePerpetual: 499,
    description: 'Inspired by 37signals ONCE: A complete, self-hosted deployment package for studios requiring 100% on-premises data isolation and zero external dependencies.',
    highlighted: false,
    ctaText: 'Inquire for Enclave Package',
    ctaHref: '/contact?tier=enclave',
    features: [
      'Complete self-hosted guest review server code',
      'Unlimited studio team seats (no per-user charges)',
      'Custom domain & white-label (review.yourstudio.com)',
      'Direct PostgreSQL & SQLite database engine access',
      'Zero external SaaS reliance forever',
      'Includes 1 year of core engine upgrades',
      'Docker container & systemd deployment playbooks',
      'Full source code access for internal audits',
    ],
  },
];

export const FEATURE_COMPARISON: FeatureComparisonGroup[] = [
  {
    category: 'Core Operations & Blueprints',
    items: [
      { name: 'Client CRM Dossiers', solo: 'Unlimited', studio: 'Unlimited', enclave: 'Unlimited' },
      { name: 'Commercial Scoping Blueprints (Fixed, Retainer, Hourly)', solo: true, studio: true, enclave: true },
      { name: 'Milestone Task Board & List Views', solo: true, studio: true, enclave: true },
      { name: 'Decoupled 3D Status (Lifecycle, Attention, Access)', solo: true, studio: true, enclave: true },
      { name: 'Team Retainer Accounting & Capacity Graph', solo: false, studio: true, enclave: true },
    ],
  },
  {
    category: 'Document Studio & Review Gates',
    items: [
      { name: 'Document Studio (Proposals, Specs, Agreements)', solo: true, studio: true, enclave: true },
      { name: 'Immutable DocVersion Snapshots (SHA-256 sealed)', solo: true, studio: true, enclave: true },
      { name: 'Visual Diff Inspector (Draft vs Version)', solo: true, studio: true, enclave: true },
      { name: 'Delivery Gate Enforcement (Blocks premature delivery)', solo: true, studio: true, enclave: true },
      { name: 'Tamper-Evident Client Acceptance Receipts', solo: true, studio: true, enclave: true },
    ],
  },
  {
    category: 'Client Access & Review Portals',
    items: [
      { name: 'Native System Email Handoff (mailto/draft)', solo: true, studio: true, enclave: true },
      { name: 'Tokenized Web Guest Review Portal', solo: 'Manual Export', studio: 'Included (Hosted)', enclave: 'Self-Hosted' },
      { name: 'Client Reviewers Seat Charge', solo: '$0 (Always Free)', studio: '$0 (Always Free)', enclave: '$0 (Always Free)' },
      { name: 'Custom Domain White-Labeling', solo: false, studio: 'Studio Subdomain', enclave: 'Full Custom Domain' },
    ],
  },
  {
    category: 'Data Sovereignty & Architecture',
    items: [
      { name: 'Storage Architecture', solo: 'Local SQLite', studio: 'Local SQLite + Mesh', enclave: 'Self-Hosted DB' },
      { name: 'Cloud Telemetry & Background Tracking', solo: 'Zero Outbound', studio: 'Zero Outbound', enclave: 'Zero Outbound' },
      { name: 'Full Offline Operation', solo: true, studio: true, enclave: true },
      { name: 'Data Portability (Full JSON/SQL Export)', solo: true, studio: true, enclave: true },
      { name: 'AI Integration Policy', solo: 'Local Ollama / BYOK', studio: 'Local Ollama / BYOK', enclave: 'Local / Self-Hosted' },
    ],
  },
];

export const PRICING_FAQS: PricingFAQ[] = [
  {
    question: 'What happens if I don\'t renew my update pass after the first year?',
    answer: 'You keep using your existing version forever. Your local SQLite files remain on your disk. We will never lock your files, disable your desktop app, or hold your client records hostage. You only renew if you want subsequent feature updates.',
  },
  {
    question: 'Do my clients need to pay or create accounts to review documents?',
    answer: 'Never. Clients view and approve proposals and deliverables through tokenized web guest review links (or cryptographic PDF packages). They do not install software, do not create accounts, and never pay a cent.',
  },
  {
    question: 'Why isn\'t Syntaflow a multi-tenant cloud SaaS?',
    answer: 'Because client contracts, billing rates, and unreleased deliverables are sensitive business assets. Keeping them in local encrypted storage eliminates cloud security leaks and gives you sub-10ms desktop performance without subscription extortion.',
  },
  {
    question: 'Do you charge an AI token markup or force an AI subscription?',
    answer: 'No. Our AI layer is architected around local-first inference using Ollama on your computer. If you choose cloud models, you bring your own API keys (BYOK). We never act as an expensive token tollbooth.',
  },
  {
    question: 'What is your refund policy?',
    answer: 'We offer an unconditional 30-day money-back guarantee on all commercial licenses. If Syntaflow doesn\'t streamline your client engagements, email us and we\'ll issue a full refund immediately.',
  },
];
