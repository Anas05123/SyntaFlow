export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface RouteMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  indexable: boolean;
  ogType?: 'website' | 'article';
  ogImage?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export const SITE_CONFIG = {
  siteName: 'Syntaflow',
  canonicalHost: 'https://syntaflow.tech',
  defaultOgImage: 'https://syntaflow.tech/brand/og-image.png',
  defaultTitle: 'Syntaflow — Connected Workspace for Client Work',
  defaultDescription:
    'Manage clients, projects, documents, reviews, approvals and connected tools in one workspace. Syntaflow keeps your client work and AI context connected.',
  titleTemplate: (title: string): string => {
    if (title.includes('Syntaflow')) return title;
    return `${title} | Syntaflow`;
  },
  organization: {
    name: 'Syntaflow',
    url: 'https://syntaflow.tech',
    logo: 'https://syntaflow.tech/brand/syntaflow-mark.png',
    sameAs: ['https://github.com/Anas05123/SyntaFlow'],
  },
  softwareApplication: {
    name: 'Syntaflow',
    operatingSystem: 'Windows 10, Windows 11',
    applicationCategory: 'BusinessApplication',
    offers: {
      price: '0',
      priceCurrency: 'USD',
    },
    url: 'https://syntaflow.tech',
    downloadUrl: 'https://syntaflow.tech/download',
  },
};

export const ROUTES_METADATA: Record<string, RouteMetadata> = {
  '/': {
    title: 'Syntaflow — Connected Workspace for Client Work',
    description:
      'Manage clients, projects, documents, reviews, approvals and connected tools in one workspace. Syntaflow keeps your client work and AI context connected.',
    canonicalPath: '/',
    indexable: true,
    breadcrumbs: [{ name: 'Home', item: 'https://syntaflow.tech/' }],
  },

  /* Core Product Suites */
  '/product': {
    title: 'Client Work Management Software | Syntaflow',
    description:
      'One workspace for the complete client engagement. Keep clients, projects, tasks, documents, reviews, approvals, delivery, and integrations connected.',
    canonicalPath: '/product',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Product', item: 'https://syntaflow.tech/product' },
    ],
  },
  '/product/client-management': {
    title: 'Client Management Workspace | Syntaflow',
    description:
      'Keep every client engagement connected. Manage client contacts, commercial terms, project history, documents, and delivery handovers in one workspace.',
    canonicalPath: '/product/client-management',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Product', item: 'https://syntaflow.tech/product' },
      { name: 'Client Management', item: 'https://syntaflow.tech/product/client-management' },
    ],
  },
  '/product/projects': {
    title: 'Client Project Management Software | Syntaflow',
    description:
      'Projects with the context attached. Scoping blueprints, dual-density task boards, milestone tracking, and deliverable review links in one place.',
    canonicalPath: '/product/projects',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Product', item: 'https://syntaflow.tech/product' },
      { name: 'Projects', item: 'https://syntaflow.tech/product/projects' },
    ],
  },
  '/product/documents': {
    title: 'Client Document Workflow & Version Management | Syntaflow',
    description:
      'Documents that keep their history. Distraction-free typographic paper canvas with immutable version snapshots, visual diffs, and traceable client reviews.',
    canonicalPath: '/product/documents',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Product', item: 'https://syntaflow.tech/product' },
      { name: 'Documents', item: 'https://syntaflow.tech/product/documents' },
    ],
  },
  '/product/reviews-approvals': {
    title: 'Client Review & Approval Software | Syntaflow',
    description:
      'Keep feedback attached to the exact version. Cryptographic snapshot reviews, structured client feedback, decision audit logs, and delivery gate enforcement.',
    canonicalPath: '/product/reviews-approvals',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Product', item: 'https://syntaflow.tech/product' },
      { name: 'Reviews & Approvals', item: 'https://syntaflow.tech/product/reviews-approvals' },
    ],
  },
  '/product/ai-workspace': {
    title: 'Context-Aware AI Workspace for Client Work | Syntaflow',
    description:
      'AI that starts with context. Local-first task routing, zero cloud training on client data, and strict human confirmation for all actions.',
    canonicalPath: '/product/ai-workspace',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Product', item: 'https://syntaflow.tech/product' },
      { name: 'AI Workspace', item: 'https://syntaflow.tech/product/ai-workspace' },
    ],
  },

  /* Legacy product path aliases (mapped for safe redirection) */
  '/product/client-ops': {
    title: 'Client Management Workspace | Syntaflow',
    description: 'Keep every client engagement connected.',
    canonicalPath: '/product/client-management',
    indexable: false,
  },
  '/product/projects-tasks': {
    title: 'Client Project Management Software | Syntaflow',
    description: 'Projects with the context attached.',
    canonicalPath: '/product/projects',
    indexable: false,
  },
  '/product/documents-reviews': {
    title: 'Client Document Workflow & Version Management | Syntaflow',
    description: 'Documents that keep their history.',
    canonicalPath: '/product/documents',
    indexable: false,
  },
  '/product/delivery-approvals': {
    title: 'Client Review & Approval Software | Syntaflow',
    description: 'Keep feedback attached to the exact version.',
    canonicalPath: '/product/reviews-approvals',
    indexable: false,
  },

  /* Solutions */
  '/solutions': {
    title: 'Solutions for Client-Facing Work | Syntaflow',
    description:
      'Built for client-facing work. Specialized workspaces for agencies, freelancers, consultants, and studios to manage clients and deliverables without context fragmentation.',
    canonicalPath: '/solutions',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Solutions', item: 'https://syntaflow.tech/solutions' },
    ],
  },
  '/solutions/agencies': {
    title: 'Client Management Software for Agencies | Syntaflow',
    description:
      'Run agency client work without losing the thread. Multi-client cockpits, designated decision authorities, asset reviews, and delivery gate protection.',
    canonicalPath: '/solutions/agencies',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Solutions', item: 'https://syntaflow.tech/solutions' },
      { name: 'Agencies', item: 'https://syntaflow.tech/solutions/agencies' },
    ],
  },
  '/solutions/freelancers': {
    title: 'Client Management Software for Freelancers | Syntaflow',
    description:
      'Keep your clients, work and delivery in one place. Proposals, tasks, typographic documents, client feedback, and gated delivery in a calm local desktop workspace.',
    canonicalPath: '/solutions/freelancers',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Solutions', item: 'https://syntaflow.tech/solutions' },
      { name: 'Freelancers', item: 'https://syntaflow.tech/solutions/freelancers' },
    ],
  },
  '/solutions/consultants': {
    title: 'Client Management Software for Consultants | Syntaflow',
    description:
      'Keep client context connected from meeting to delivery. Confidential local storage, advisory briefs, retainer runways, and audit-proof client sign-offs.',
    canonicalPath: '/solutions/consultants',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Solutions', item: 'https://syntaflow.tech/solutions' },
      { name: 'Consultants', item: 'https://syntaflow.tech/solutions/consultants' },
    ],
  },
  '/solutions/studios': {
    title: 'Client Management Software for Studios | Syntaflow',
    description:
      'Keep creative context and commercial agreements aligned from initial proposal to final asset handover.',
    canonicalPath: '/solutions/studios',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Solutions', item: 'https://syntaflow.tech/solutions' },
      { name: 'Studios', item: 'https://syntaflow.tech/solutions/studios' },
    ],
  },

  /* Core Pages */
  '/integrations': {
    title: 'Syntaflow Integrations — Connect Your Work Tools',
    description:
      'Connect Google Drive, Slack, GitHub, Linear, Notion, and Figma directly into your client context without tool fragmentation.',
    canonicalPath: '/integrations',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Integrations', item: 'https://syntaflow.tech/integrations' },
    ],
  },
  '/integrations/gmail': {
    title: 'Gmail Integration for Client Workflows | Syntaflow',
    description:
      'Connect Gmail to Syntaflow to find and associate emails with client projects, draft responses in context, and keep communication records alongside client work.',
    canonicalPath: '/integrations/gmail',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Integrations', item: 'https://syntaflow.tech/integrations' },
      { name: 'Gmail', item: 'https://syntaflow.tech/integrations/gmail' },
    ],
  },
  '/integrations/google-calendar': {
    title: 'Google Calendar Integration for Client Work | Syntaflow',
    description:
      'Connect Google Calendar to schedule milestones, check availability, and link client meetings directly to projects and deliverables.',
    canonicalPath: '/integrations/google-calendar',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Integrations', item: 'https://syntaflow.tech/integrations' },
      { name: 'Google Calendar', item: 'https://syntaflow.tech/integrations/google-calendar' },
    ],
  },
  '/integrations/google-drive': {
    title: 'Google Drive Integration for Client Deliverables | Syntaflow',
    description:
      'Connect Google Drive to reference deliverable files, export packages, and keep assets linked to client projects using scoped file permissions.',
    canonicalPath: '/integrations/google-drive',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Integrations', item: 'https://syntaflow.tech/integrations' },
      { name: 'Google Drive', item: 'https://syntaflow.tech/integrations/google-drive' },
    ],
  },
  '/integrations/github': {
    title: 'GitHub Integration for Client Development | Syntaflow',
    description:
      'Connect GitHub repositories, pull requests, and issues to client projects, milestones, and deliverable review workflows.',
    canonicalPath: '/integrations/github',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Integrations', item: 'https://syntaflow.tech/integrations' },
      { name: 'GitHub', item: 'https://syntaflow.tech/integrations/github' },
    ],
  },
  '/integrations/notion': {
    title: 'Notion Integration (Test Preview) | Syntaflow',
    description:
      'Connect Notion workspaces to reference project documentation, requirements, and client briefs alongside work records.',
    canonicalPath: '/integrations/notion',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Integrations', item: 'https://syntaflow.tech/integrations' },
      { name: 'Notion', item: 'https://syntaflow.tech/integrations/notion' },
    ],
  },
  '/integrations/linear': {
    title: 'Linear Integration (Test Preview) | Syntaflow',
    description:
      'Connect Linear to align internal issue tracking and sprint cycles with client-facing milestones and deliverable review gates.',
    canonicalPath: '/integrations/linear',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Integrations', item: 'https://syntaflow.tech/integrations' },
      { name: 'Linear', item: 'https://syntaflow.tech/integrations/linear' },
    ],
  },
  '/pricing': {
    title: 'Syntaflow Pricing',
    description:
      'Simple, transparent pricing for independent operators, studios, and growing client service firms. Free during desktop preview.',
    canonicalPath: '/pricing',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Pricing', item: 'https://syntaflow.tech/pricing' },
    ],
  },
  '/download': {
    title: 'Download Syntaflow Preview',
    description:
      'Download Syntaflow Desktop for Windows 64-bit. Experience local-first client operations with zero setup and SQLite canonical persistence.',
    canonicalPath: '/download',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Download', item: 'https://syntaflow.tech/download' },
    ],
  },
  '/security': {
    title: 'Security at Syntaflow',
    description:
      'Local-first architecture, SQLite canonical storage, zero cloud training on client data, and verifiable isolation.',
    canonicalPath: '/security',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Security', item: 'https://syntaflow.tech/security' },
    ],
  },
  '/data-handling': {
    title: 'Data Handling & Storage Architecture | Syntaflow',
    description:
      'Detailed technical documentation on Syntaflow local-first SQLite persistence, OS keychain credential storage, and network boundaries.',
    canonicalPath: '/data-handling',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Data Handling', item: 'https://syntaflow.tech/data-handling' },
    ],
  },
  '/docs': {
    title: 'Documentation | Syntaflow',
    description:
      'Guides, API references, architecture blueprints, and workflows for mastering Syntaflow client engagements.',
    canonicalPath: '/docs',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Documentation', item: 'https://syntaflow.tech/docs' },
    ],
  },
  '/faq': {
    title: 'Frequently Asked Questions | Syntaflow',
    description:
      'Common questions about Syntaflow architecture, local-first data model, Google Drive integration, pricing, and roadmap.',
    canonicalPath: '/faq',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'FAQ', item: 'https://syntaflow.tech/faq' },
    ],
  },
  '/about': {
    title: 'About Syntaflow',
    description:
      'Why we built Syntaflow: eliminating fragmented client work and keeping context continuous for modern service operators.',
    canonicalPath: '/about',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'About', item: 'https://syntaflow.tech/about' },
    ],
  },
  '/contact': {
    title: 'Contact Syntaflow',
    description:
      'Get in touch with the Syntaflow team for support, partnership inquiries, or enterprise deployment questions.',
    canonicalPath: '/contact',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Contact', item: 'https://syntaflow.tech/contact' },
    ],
  },
  '/changelog': {
    title: 'Changelog | Syntaflow',
    description:
      'Version history, release notes, and product improvements for Syntaflow desktop and web releases.',
    canonicalPath: '/changelog',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Changelog', item: 'https://syntaflow.tech/changelog' },
    ],
  },
  '/roadmap': {
    title: 'Roadmap | Syntaflow',
    description:
      'Upcoming features and development milestones for Syntaflow: cross-platform macOS support, sync engines, and advanced review flows.',
    canonicalPath: '/roadmap',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Roadmap', item: 'https://syntaflow.tech/roadmap' },
    ],
  },

  /* Legal Suites */
  '/privacy': {
    title: 'Privacy Policy | Syntaflow',
    description:
      'Official privacy policy for Syntaflow. Learn how client data is handled locally, Google OAuth verification, and limited use compliance.',
    canonicalPath: '/privacy',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Privacy Policy', item: 'https://syntaflow.tech/privacy' },
    ],
  },
  '/terms': {
    title: 'Terms of Service | Syntaflow',
    description:
      'Terms of service and software licensing conditions governing the use of Syntaflow desktop and web environments.',
    canonicalPath: '/terms',
    indexable: true,
    breadcrumbs: [
      { name: 'Home', item: 'https://syntaflow.tech/' },
      { name: 'Terms of Service', item: 'https://syntaflow.tech/terms' },
    ],
  },

  /* Private / Protected / Utility (NOINDEX) */
  '/login': {
    title: 'Log In | Syntaflow',
    description: 'Sign in to your Syntaflow account.',
    canonicalPath: '/login',
    indexable: false,
  },
  '/account': {
    title: 'Account Settings | Syntaflow',
    description: 'Manage your Syntaflow profile and preferences.',
    canonicalPath: '/account',
    indexable: false,
  },
  '/auth/desktop': {
    title: 'Desktop Authorization | Syntaflow',
    description: 'Authorize Syntaflow Desktop application.',
    canonicalPath: '/auth/desktop',
    indexable: false,
  },
  '/404': {
    title: 'Page Not Found | Syntaflow',
    description: 'The requested page could not be found.',
    canonicalPath: '/404',
    indexable: false,
  },
};

/** Look up metadata by normalized path */
export function getRouteMetadata(path: string): RouteMetadata {
  const normalized = path.replace(/\/+$/, '') || '/';
  if (ROUTES_METADATA[normalized]) {
    return ROUTES_METADATA[normalized];
  }
  return {
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.defaultDescription,
    canonicalPath: normalized,
    indexable: false, // Unknown routes default to noindex for safety
  };
}
