export type CapabilityStatus = 'AVAILABLE NOW' | 'IN DEVELOPMENT' | 'PLANNED DIRECTION';

export interface NavItem {
  label: string;
  href: string;
  description: string;
  badge?: CapabilityStatus;
}

export const PRODUCT_NAV: NavItem[] = [
  {
    label: 'Overview',
    href: '/product',
    description: 'High-density desktop environment keeping one continuous record from first contact to delivery.',
    badge: 'AVAILABLE NOW',
  },
  {
    label: 'Client Operations',
    href: '/product/client-operations',
    description: 'Structured client rosters, commercial terms, decision-makers, and interaction history.',
    badge: 'AVAILABLE NOW',
  },
  {
    label: 'Projects & Tasks',
    href: '/product/projects-tasks',
    description: 'Blueprint scoping, milestone tracking, and task execution with decoupled 3D status.',
    badge: 'AVAILABLE NOW',
  },
  {
    label: 'Documents & Reviews',
    href: '/product/documents-reviews',
    description: 'Document studio, continuous paper canvas, immutable DocVersion snapshots, and client reviews.',
    badge: 'AVAILABLE NOW',
  },
  {
    label: 'Delivery & Approvals',
    href: '/product/delivery-approvals',
    description: 'Prerequisite delivery gates, client approval audit trails, and signed handover packages.',
    badge: 'AVAILABLE NOW',
  },
];

export const SOLUTIONS_NAV: NavItem[] = [
  {
    label: 'Freelancers',
    href: '/solutions/freelancers',
    description: 'Run $5k–$25k solo engagements without losing decisions across six disconnected SaaS tools.',
    badge: 'AVAILABLE NOW',
  },
  {
    label: 'Agencies',
    href: '/solutions/agencies',
    description: 'Manage boutique client rosters, milestone approvals, and team deliverables in one cockpit.',
    badge: 'AVAILABLE NOW',
  },
  {
    label: 'Consultants',
    href: '/solutions/consultants',
    description: 'Protect advisory retainers, document client decisions, and maintain rigorous deliverable logs.',
    badge: 'AVAILABLE NOW',
  },
  {
    label: 'Studios & Professional Services',
    href: '/solutions/studios',
    description: 'Deliver complex design, technical, and architectural client work with immutable version control.',
    badge: 'AVAILABLE NOW',
  },
];

export const SECURITY_NAV: NavItem[] = [
  {
    label: 'Security Architecture',
    href: '/security',
    description: 'Local-first privilege boundaries, scrypt authentication, and Electron sandboxing.',
    badge: 'AVAILABLE NOW',
  },
  {
    label: 'Privacy Commitment',
    href: '/privacy',
    description: 'Zero telemetry, zero remote tracking, complete physical data sovereignty on your machine.',
    badge: 'AVAILABLE NOW',
  },
  {
    label: 'Data Handling',
    href: '/data-handling',
    description: 'Local-first persistence, immutable snapshot architecture, and clean JSON/SQLite export.',
    badge: 'AVAILABLE NOW',
  },
];

export const RESOURCES_NAV: NavItem[] = [
  {
    label: 'FAQ',
    href: '/faq',
    description: 'Honest, verifiable answers about desktop architecture, privacy, data, and roadmap.',
  },
  {
    label: 'Changelog',
    href: '/changelog',
    description: 'Chronological record of verified desktop application releases and engine updates.',
  },
];

export const COMPANY_NAV: NavItem[] = [
  {
    label: 'About Syntaflow',
    href: '/about',
    description: 'Our mission to reduce the distance between intention and execution through connected context.',
  },
  {
    label: "Roadmap / What's Next",
    href: '/roadmap',
    description: 'Our technical direction: Context Engine, TaskRouter, and Developer Tools.',
    badge: 'PLANNED DIRECTION',
  },
  {
    label: 'Contact & Inquiries',
    href: '/contact',
    description: 'Direct communication for technical inquiries, client feedback, and security disclosures.',
  },
];

export const FOOTER_NAV = {
  product: [
    { label: 'Overview', href: '/product' },
    { label: 'Pricing & Economics', href: '/pricing' },
    { label: 'Client Operations', href: '/product/client-operations' },
    { label: 'Projects & Tasks', href: '/product/projects-tasks' },
    { label: 'Documents & Reviews', href: '/product/documents-reviews' },
    { label: 'Delivery & Approvals', href: '/product/delivery-approvals' },
  ],
  solutions: [
    { label: 'Freelancers', href: '/solutions/freelancers' },
    { label: 'Agencies', href: '/solutions/agencies' },
    { label: 'Consultants', href: '/solutions/consultants' },
    { label: 'Studios', href: '/solutions/studios' },
  ],
  security: [
    { label: 'Security Architecture', href: '/security' },
    { label: 'Privacy Commitment', href: '/privacy' },
    { label: 'Data Handling', href: '/data-handling' },
  ],
  company: [
    { label: 'About Syntaflow', href: '/about' },
    { label: 'Roadmap & Direction', href: '/roadmap' },
    { label: 'Contact', href: '/contact' },
  ],
  resources: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Changelog', href: '/changelog' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Acceptable Use', href: '/acceptable-use' },
  ],
};
