export interface IntegrationMeta {
  id: string;
  name: string;
  category: 'Communication' | 'Calendar' | 'Files' | 'Development' | 'Design' | 'Knowledge';
  status: 'AVAILABLE' | 'TEST' | 'COMING SOON';
  description: string;
  transports: ('api' | 'mcp')[];
  dataAccessed: string[];
  permissionsSummary: string;
  scopes?: string[];
  inAppPrivacyNote: string;
}

export const INTEGRATIONS_LIST: IntegrationMeta[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'Communication',
    status: 'AVAILABLE',
    description: 'Surface client correspondence and draft review notices directly within the project thread.',
    transports: ['api', 'mcp'],
    dataAccessed: [
      'Email message threads matching client email addresses',
      'Sender, recipient, timestamp, and subject metadata',
      'Draft creation capability for review dispatches',
    ],
    permissionsSummary: 'Read relevant client threads and create email drafts with human confirmation before sending.',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    inAppPrivacyNote:
      'Syntaflow only queries messages relevant to active client engagements. Email content is processed locally and is never used to train generalized AI models or shared with third parties.',
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    category: 'Calendar',
    status: 'AVAILABLE',
    description: 'Synchronize client milestone deadlines and review sessions with your calendar.',
    transports: ['api', 'mcp'],
    dataAccessed: [
      'Calendar schedule and free/busy availability',
      'Event titles, start/end times, and attendee lists',
      'Meeting creation capability for review milestones',
    ],
    permissionsSummary: 'Inspect scheduling availability and place client review meetings directly on your calendar.',
    scopes: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    inAppPrivacyNote:
      'Calendar data is retrieved on demand to display upcoming client deadlines. No external calendar records are permanently copied or analyzed for behavioral profiling.',
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    category: 'Files',
    status: 'AVAILABLE',
    description: 'Attach design briefs, contract drafts, and final deliverable archives from Google Drive.',
    transports: ['api', 'mcp'],
    dataAccessed: [
      'Specific files and folders opened or created through Syntaflow',
      'Folder hierarchy and file revision metadata',
    ],
    permissionsSummary: 'Access only specific files you designate or create with Syntaflow — zero broad drive snooping.',
    scopes: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.metadata.readonly',
    ],
    inAppPrivacyNote:
      'Uses narrow drive.file scoping. Syntaflow cannot see, modify, or delete your personal Drive files unless you explicitly select them.',
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Development',
    status: 'AVAILABLE',
    description: 'Link code repository milestones, issues, and pull requests to client deliverables.',
    transports: ['api', 'mcp'],
    dataAccessed: ['Repository names', 'Issue threads and status', 'Commit and PR references'],
    permissionsSummary: 'Read issue titles and link commits to project blueprints.',
    scopes: ['repo', 'read:user'],
    inAppPrivacyNote: 'Token stored in OS-encrypted vault; only queried for designated client repositories.',
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'Design',
    status: 'TEST',
    description: 'Embed live design artboards and design token references directly into client documents.',
    transports: ['mcp'],
    dataAccessed: ['Figma file components', 'Design frames', 'Token specifications'],
    permissionsSummary: 'Inspect designated design files for presentation embeds.',
    inAppPrivacyNote: 'Operates via official Figma MCP; credentials stay within your local machine.',
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'Knowledge',
    status: 'TEST',
    description: 'Synchronize client meeting notes and research documentation into document canvases.',
    transports: ['api', 'mcp'],
    dataAccessed: ['Workspace pages', 'Database tables', 'Block content'],
    permissionsSummary: 'Read pages explicitly shared with the Syntaflow integration.',
    inAppPrivacyNote: 'Limited strictly to pages you grant via the Notion OAuth selector.',
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    status: 'TEST',
    description: 'Broadcast review milestone approvals and client notifications to project channels.',
    transports: ['mcp'],
    dataAccessed: ['Channel lists', 'Message posting capabilities'],
    permissionsSummary: 'Post delivery gate updates to designated team channels.',
    inAppPrivacyNote: 'Requires user confirmation before sending external channel messages.',
  },
  {
    id: 'linear',
    name: 'Linear',
    category: 'Development',
    status: 'TEST',
    description: 'Map project blueprint milestones directly to Linear engineering issues and cycles.',
    transports: ['mcp', 'api'],
    dataAccessed: ['Team issues', 'Cycles', 'Project milestones'],
    permissionsSummary: 'Two-way synchronization between client tasks and technical tickets.',
    inAppPrivacyNote: 'Synced on demand; no customer data cached remotely.',
  },
  {
    id: 'calendly',
    name: 'Calendly',
    category: 'Calendar',
    status: 'TEST',
    description: 'Embed client booking links into onboarding slide-overs and proposals.',
    transports: ['mcp'],
    dataAccessed: ['Event types', 'Scheduling links'],
    permissionsSummary: 'Generate personalized booking invitations for clients.',
    inAppPrivacyNote: 'Direct API connection through local credentials.',
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    category: 'Communication',
    status: 'COMING SOON',
    description: 'Exchange email and Microsoft 365 calendar synchronization.',
    transports: ['api'],
    dataAccessed: ['Outlook messages', 'Calendar events'],
    permissionsSummary: 'Corporate email integration for Microsoft 365 environments.',
    inAppPrivacyNote: 'In active architectural preparation.',
  },
  {
    id: 'onedrive',
    name: 'Microsoft OneDrive',
    category: 'Files',
    status: 'COMING SOON',
    description: 'Cloud document and deliverable storage across Microsoft ecosystems.',
    transports: ['api'],
    dataAccessed: ['Designated OneDrive files'],
    permissionsSummary: 'Store and link deliverables directly to OneDrive folders.',
    inAppPrivacyNote: 'In active architectural preparation.',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'Files',
    status: 'COMING SOON',
    description: 'Asset backup and client delivery package storage on Dropbox.',
    transports: ['api'],
    dataAccessed: ['Deliverable zip packages', 'Shared folder links'],
    permissionsSummary: 'Export signed delivery archives to Dropbox.',
    inAppPrivacyNote: 'In active architectural preparation.',
  },
  {
    id: 'zoom',
    name: 'Zoom',
    category: 'Calendar',
    status: 'COMING SOON',
    description: 'Automated video conference generation for client presentation reviews.',
    transports: ['api'],
    dataAccessed: ['Meeting links', 'Audio conference credentials'],
    permissionsSummary: 'Attach instant video review links to transmission emails.',
    inAppPrivacyNote: 'In active architectural preparation.',
  },
];
