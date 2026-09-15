export interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Product' | 'Security' | 'Privacy' | 'Data' | 'Pricing' | 'Account';
}

export const FAQ_DATA: FAQItem[] = [
  // General
  {
    category: 'General',
    question: 'What is Syntaflow?',
    answer: 'Syntaflow is an intelligent, desktop-first operating environment for professional client work. It maintains one continuous, living record of every client relationship — from initial request, scoping blueprint, and contract agreement, through task execution and draft document review, to final approved handover.',
  },
  {
    category: 'General',
    question: 'What operating systems are supported?',
    answer: 'Syntaflow is currently built and verified for Windows 10 and Windows 11 (64-bit). macOS and Linux desktop distributions are planned for subsequent release phases.',
  },
  {
    category: 'General',
    question: 'Is Syntaflow a cloud SaaS or a desktop application?',
    answer: 'Syntaflow is currently a local-first desktop application. Your client records, document drafts, and financial numbers are stored directly on your physical hardware, giving you 100% offline access and complete privacy without reliance on third-party cloud infrastructure.',
  },

  // Product
  {
    category: 'Product',
    question: 'How does Syntaflow differ from standard project management tools?',
    answer: 'Traditional tools track tasks as disconnected checkboxes without the surrounding commercial terms, contracts, or review decisions that explain why the task exists. Syntaflow keeps one living canonical record: commercial terms, scoping blueprints, task boards, immutable document snapshots, and client approvals all live in one continuous workspace.',
  },
  {
    category: 'Product',
    question: 'What does "Document Version Immutability" mean?',
    answer: 'In Syntaflow, once a document version (such as a proposal or deliverable) is submitted to a client for review, it is permanently locked as a DocVersion snapshot. It cannot be altered in-place. Further edits occur exclusively on incremented working drafts (e.g., v1.1). This guarantees that client reviews and approvals bind to the exact snapshot reviewed.',
  },
  {
    category: 'Product',
    question: 'How are delivery gates enforced?',
    answer: 'A project or delivery package cannot be marked delivered until every required prerequisite deliverable has been approved by the client. This architectural constraint prevents premature handover and eliminates disputes over unapproved scope.',
  },
  {
    category: 'Product',
    question: 'How does client email communication work?',
    answer: 'Syntaflow provides a dedicated Client Communication UX to compose updates, review notes, and transmission letters. To send emails, Syntaflow connects directly with your system default mail client (Outlook, Apple Mail, Thunderbird) via standard OS handoff. Syntaflow never asks for your email passwords or accesses your inbox.',
  },

  // Security
  {
    category: 'Security',
    question: 'How is the desktop application secured?',
    answer: 'The desktop application is built with strict Electron sandboxing (contextIsolation: true, nodeIntegration: false, sandbox: true). The UI renderer has zero direct access to the operating system or filesystem. All data access traverses a typed, schema-validated IPC bridge.',
  },
  {
    category: 'Security',
    question: 'Do you hold SOC 2, ISO 27001, or HIPAA certifications?',
    answer: 'Not today. Syntaflow is a local-first desktop tool without a public multi-tenant cloud backend. We do not make false or premature certification claims. Security is engineered into our architecture through process sandboxing, local scrypt hashing, and OS-level credential encryption.',
  },

  // Privacy
  {
    category: 'Privacy',
    question: 'Do you collect telemetry or track my usage?',
    answer: 'Zero telemetry. We do not track keystrokes, client records, document contents, financial terms, or clickstream events. The desktop application operates completely offline without sending background analytics to our servers.',
  },
  {
    category: 'Privacy',
    question: 'Does Syntaflow use my client data to train AI models?',
    answer: 'Never. Your data stays on your machine. Furthermore, the current v0.1 release does not make automated external AI calls. Our planned AI Engine is architected around local-first inference (Ollama running locally on your hardware) so your data remains strictly private.',
  },

  // Data
  {
    category: 'Data',
    question: 'Where is my data stored on my computer?',
    answer: 'Data is stored locally in your operating system user application data directory. State management currently runs through an encrypted local store, with migration to an embedded SQLite database scheduled in an upcoming phase.',
  },
  {
    category: 'Data',
    question: 'Can I export my data if I decide to leave?',
    answer: 'Yes. You can export complete client records, project blueprints, task boards, and document histories into structured JSON files at any time. We believe in complete data portability and zero vendor lock-in.',
  },

  // Pricing
  {
    category: 'Pricing',
    question: 'What is the pricing model for Syntaflow?',
    answer: 'Syntaflow Desktop is currently free to download and use during our public preview phase. Transparent, standalone commercial license pricing will be announced prior to the v1.0 milestone. We will never introduce surprise price hikes or lock your existing local files behind a paywall.',
  },

  // Account
  {
    category: 'Account',
    question: 'Do I need to create an online account to use Syntaflow?',
    answer: 'No online account is required today. You create a secure local account directly within the desktop application. Your password is encrypted with scrypt key derivation and stored safely on your machine using Windows safeStorage.',
  },
];
