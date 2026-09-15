export interface NavItem {
  label: string;
  href: string;
  description?: string;
  tag?: 'AVAILABLE NOW' | 'IN DEVELOPMENT' | 'PLANNED';
}

export interface NavGroup {
  label: string;
  href?: string;
  items?: NavItem[];
}

export const PRIMARY_NAV: NavGroup[] = [
  {
    label: 'Product',
    href: '/product',
    items: [
      {
        label: 'Overview',
        href: '/product',
        description: 'The unified operating environment for client engagements.',
        tag: 'AVAILABLE NOW',
      },
      {
        label: 'Client Operations',
        href: '/product/client-ops',
        description: 'Relationship tracking, commercial terms, and onboarding studio.',
        tag: 'AVAILABLE NOW',
      },
      {
        label: 'Projects & Tasks',
        href: '/product/projects-tasks',
        description: 'Multi-blueprint scoping and responsive dual-density boards.',
        tag: 'AVAILABLE NOW',
      },
      {
        label: 'Documents & Reviews',
        href: '/product/documents-reviews',
        description: 'Typographic paper studio with immutable versioning.',
        tag: 'AVAILABLE NOW',
      },
      {
        label: 'Delivery & Approvals',
        href: '/product/delivery-approvals',
        description: 'Delivery gate enforcement and audit-proof sign-offs.',
        tag: 'AVAILABLE NOW',
      },
    ],
  },
  {
    label: 'Solutions',
    href: '/solutions/freelancers',
    items: [
      {
        label: 'Freelancers & Solos',
        href: '/solutions/freelancers',
        description: 'Single-operator workflows without tool fragmentation.',
        tag: 'AVAILABLE NOW',
      },
      {
        label: 'Agencies',
        href: '/solutions/agencies',
        description: 'Stakeholder sign-offs, SLA turnarounds, and client transparency.',
        tag: 'AVAILABLE NOW',
      },
      {
        label: 'Consultants',
        href: '/solutions/consultants',
        description: 'Retainer management, advisory notes, and executive deliverables.',
        tag: 'AVAILABLE NOW',
      },
      {
        label: 'Studios & Production',
        href: '/solutions/studios',
        description: 'Deliverable handovers, portfolio showcases, and version proof.',
        tag: 'AVAILABLE NOW',
      },
    ],
  },
  {
    label: 'Security',
    href: '/security',
  },
  {
    label: 'Resources',
    href: '/faq',
    items: [
      {
        label: 'FAQ',
        href: '/faq',
        description: 'Direct, honest answers across architecture, data, and access.',
      },
      {
        label: 'Changelog',
        href: '/changelog',
        description: 'Detailed release logs tracing desktop engine milestones.',
      },
    ],
  },
  {
    label: 'Company',
    href: '/about',
    items: [
      {
        label: 'About Syntaflow',
        href: '/about',
        description: 'Our origin, purpose, and commitment to human agency.',
      },
      {
        label: 'Roadmap (What’s Next)',
        href: '/roadmap',
        description: 'Planned direction for AI TaskRouter, cloud portals, and APIs.',
        tag: 'PLANNED',
      },
      {
        label: 'Contact',
        href: '/contact',
        description: 'Direct inquiries, support requests, and feedback.',
      },
    ],
  },
];

export const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', href: '/product' },
      { label: 'Client Operations', href: '/product/client-ops' },
      { label: 'Projects & Tasks', href: '/product/projects-tasks' },
      { label: 'Documents & Reviews', href: '/product/documents-reviews' },
      { label: 'Delivery & Approvals', href: '/product/delivery-approvals' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Security Overview', href: '/security' },
      { label: 'Privacy & Data', href: '/privacy' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Acceptable Use', href: '/acceptable-use' },
    ],
  },
];
