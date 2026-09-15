export interface LegalDoc {
  id: 'terms' | 'privacy' | 'cookies' | 'acceptable-use';
  title: string;
  lastUpdated: string;
  isDraft: boolean;
  sections: { heading: string; content: string }[];
}

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  terms: {
    id: 'terms',
    title: 'Terms of Service',
    lastUpdated: 'September 2026',
    isDraft: true,
    sections: [
      {
        heading: '1. Draft Notice & Agreement to Terms',
        content: 'NOTICE: This document is a structural draft prepared for the Syntaflow website preview and does not constitute finalized legal counsel. By downloading or accessing Syntaflow ("the Software"), you acknowledge and agree to these provisional terms pending final legal publication prior to commercial v1.0 release.',
      },
      {
        heading: '2. Software License & Local Execution',
        content: 'Syntaflow grants you a personal, non-exclusive, non-transferable license to use the desktop application on compatible hardware. The software operates locally on your machine. You retain all right, title, and ownership in and to all data, records, documents, and client information processed by the software.',
      },
      {
        heading: '3. Intellectual Property Rights',
        content: 'All trademarks, logos, service marks, and interface designs associated with Syntaflow and syntaflow.tech are the exclusive property of Syntaflow. You may not reverse engineer, decompile, or extract proprietary brand assets without prior written consent.',
      },
      {
        heading: '4. Limitation of Liability & Warranty Disclaimer',
        content: 'The Software is provided "as is", without warranty of any kind, express or implied. In no event shall Syntaflow or its contributors be liable for any loss of data, commercial damages, or business interruption arising from the use or inability to use the Software.',
      },
    ],
  },
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    lastUpdated: 'September 2026',
    isDraft: true,
    sections: [
      {
        heading: '1. Draft Notice & Scope of Policy',
        content: 'NOTICE: This is a structural draft policy outlining Syntaflow data handling practices. Syntaflow is a local-first desktop application that does not collect, sell, or transmit user operational data to remote servers.',
      },
      {
        heading: '2. Zero Telemetry & Data Collection',
        content: 'We do not collect personal usage statistics, document contents, client names, financial records, or keystrokes. When you run the Syntaflow desktop application, all computing and state persistence occur strictly on your physical machine.',
      },
      {
        heading: '3. Website Inquiries & Contact Forms',
        content: 'If you voluntarily submit inquiries via our website contact form (e.g. for product feedback or security reporting), we store only the name, email address, and message provided for the sole purpose of responding to your inquiry. We never sell or share contact details with third-party advertising brokers.',
      },
      {
        heading: '4. Data Sovereignty & User Rights',
        content: 'Because your operational data is stored on your local machine, you have complete control over its retention and deletion. You may export your records to JSON or purge application state through the Settings Danger Zone at any time.',
      },
    ],
  },
  cookies: {
    id: 'cookies',
    title: 'Cookie Policy',
    lastUpdated: 'September 2026',
    isDraft: true,
    sections: [
      {
        heading: '1. Zero Tracking Cookies Commitment',
        content: 'NOTICE: The Syntaflow official website (syntaflow.tech) does not utilize third-party advertising cookies, behavioral tracking pixels, or fingerprinting scripts. We do not track you across other websites.',
      },
      {
        heading: '2. Essential Local State',
        content: 'The website may use browser localStorage strictly for essential interface preferences, such as remembering your active tab or theme selection. These values never leave your browser.',
      },
      {
        heading: '3. Third-Party Services',
        content: 'Fonts are served via Google Fonts with privacy-preserving preconnect headers. No advertising networks or marketing analytics scripts are loaded.',
      },
    ],
  },
  'acceptable-use': {
    id: 'acceptable-use',
    title: 'Acceptable Use Policy',
    lastUpdated: 'September 2026',
    isDraft: true,
    sections: [
      {
        heading: '1. Purpose & Standards of Conduct',
        content: 'NOTICE: This document outlines provisional acceptable use standards for Syntaflow software, services, and community channels. You agree to use the Software only for lawful professional purposes.',
      },
      {
        heading: '2. Prohibited Activities',
        content: 'You may not use Syntaflow to: (a) generate or transmit unlawful, defamatory, or fraudulent material; (b) probe or exploit potential security vulnerabilities without responsible coordinated disclosure; (c) misrepresent yourself as an authorized agent of Syntaflow.',
      },
      {
        heading: '3. Enforcement & Termination',
        content: 'Syntaflow reserves the right to terminate access to preview distributions or community channels in the event of documented violations of this policy.',
      },
    ],
  },
};
