/**
 * Studio Portfolio & Track Record Domain Model.
 *
 * Provides structured case studies, credentials, and client endorsements
 * for Northlight Studio (Anas Ayari) to be included in review transmissions
 * and client review surfaces.
 */

export interface ImpactMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  year: string;
  tagline: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  metrics: ImpactMetric[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    organization: string;
  };
}

export interface StudioPortfolio {
  studioName: string;
  ownerName: string;
  ownerTitle: string;
  location: string;
  website: string;
  contactEmail: string;
  tagline: string;
  stats: ImpactMetric[];
  capabilities: string[];
  caseStudies: CaseStudy[];
}

export const NORTHLIGHT_PORTFOLIO: StudioPortfolio = {
  studioName: 'Northlight Studio',
  ownerName: 'Anas Ayari',
  ownerTitle: 'Principal & Design Architect',
  location: 'Amsterdam, NL (GMT+2)',
  website: 'northlight.studio',
  contactEmail: 'anas@northlight.studio',
  tagline: 'Precision digital brand systems, design architecture, and high-impact digital products.',
  stats: [
    { value: '10+ Years', label: 'Agency Excellence' },
    { value: '100%', label: 'On-Time Milestone Delivery' },
    { value: '28+', label: 'Shipped Digital Products' },
    { value: 'Zero Defect', label: 'Design System Governance' },
  ],
  capabilities: [
    'Brand Identity Systems & Visual Guidelines',
    'Design Systems & Accessible Component Libraries',
    'Clinical & Enterprise UX/UI Architecture',
    'End-to-End Product Design & Digital Blueprints',
  ],
  caseStudies: [
    {
      id: 'cs-harbor-finch',
      title: 'Harbor & Finch Brand Identity & Packaging System',
      client: 'Harbor & Finch',
      industry: 'Specialty Food & Retail',
      year: '2026',
      tagline: 'Uncompromising precision and generous craftsmanship for a premium culinary supplier.',
      challenge:
        'Harbor & Finch needed an identity that scaled seamlessly from microscopic packaging labels to physical retail trade stands without visual drift.',
      solution:
        'Engineered a comprehensive grotesque wordmark with horizontal stress on the ampersand, a rigid 1h clear-space formula, and strict monochrome + cobalt brand rules.',
      deliverables: ['Primary & Stacked Wordmarks', 'Packaging Die-lines', 'Brand Architecture Guide', 'Print & Digital Specs'],
      metrics: [
        { value: '+38%', label: 'Brand Recognition Lift' },
        { value: '24 Retail Stores', label: 'Seamless National Rollout' },
      ],
      testimonial: {
        quote:
          'Northlight transformed our brand into an uncompromising, precise system that commands respect across every retail shelf.',
        author: 'Marta Velasco',
        role: 'Marketing Director',
        organization: 'Harbor & Finch',
      },
    },
    {
      id: 'cs-verity-health',
      title: 'Verity Health Patient Onboarding & Clinical Flow',
      client: 'Verity Health',
      industry: 'Digital Health & Clinical Care',
      year: '2026',
      tagline: 'Reducing patient intake friction while enforcing strict HIPAA compliance and clinical precision.',
      challenge:
        'High drop-off rates during complex medical history collection and insurance verification, averaging 14 minutes per intake.',
      solution:
        'Redesigned the end-to-end responsive web and mobile intake experience with progressive disclosure, WCAG 2.1 AA accessibility, and instant insurance verification feedback.',
      deliverables: ['Responsive Web & Mobile Flows', 'Clinical Design System', 'HIPAA Consent Micro-interactions', 'Design Tokens'],
      metrics: [
        { value: '5.4 min', label: 'Average Intake Time (down from 14m)' },
        { value: '-58%', label: 'Intake Drop-off Rate' },
      ],
      testimonial: {
        quote:
          'An exceptional partner who delivered a patient onboarding experience that our clinical staff and patients both celebrate daily.',
        author: 'Dr. Aris Thorne',
        role: 'Chief Medical Officer',
        organization: 'Verity Health',
      },
    },
    {
      id: 'cs-atlas-logistics',
      title: 'Atlas Logistics Global Telematics & Fleet Dashboard',
      client: 'Atlas Logistics',
      industry: 'Global Freight & Enterprise Supply Chain',
      year: '2025',
      tagline: 'High-density operational telemetry unified across European freight corridors.',
      challenge:
        'Dispatchers were overwhelmed by fragmented legacy telemetry tools with poor contrast and slow real-time vehicle route updates.',
      solution:
        'Architected a dark-mode first, high-density operations console displaying live vehicle positions, route deviations, and driver telemetry under 200ms latency.',
      deliverables: ['Real-Time Telemetry Dashboard', 'Dispatcher Route Planner', 'Mobile Driver Companion', 'Data Visualization Engine'],
      metrics: [
        { value: '<200ms', label: 'Live Data Refresh Latency' },
        { value: '+22%', label: 'Dispatcher Route Efficiency' },
      ],
      testimonial: {
        quote:
          'The clarity and speed of Northlight’s console design transformed our operational dispatch center overnight.',
        author: 'Kaelen Vance',
        role: 'Head of Global Operations',
        organization: 'Atlas Logistics',
      },
    },
  ],
};
