import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Link } from '../../components/ui/Link';
import { Card } from '../../components/ui/Card';

const LAST_UPDATED = 'September 16, 2026';
const EFFECTIVE_DATE = 'September 16, 2026';

interface Section {
  num: number;
  title: string;
  content: string;
}

const SECTIONS: Section[] = [
  {
    "num": 1,
    "title": "Agreement to Terms",
    "content": "These Terms of Service (\"Terms\") constitute a legally binding agreement between you (whether personally or on behalf of an entity, \"you\" or \"User\") and Syntaflow (\"Syntaflow\", \"we\", \"us\", or \"our\"), governing your access to and use of the Syntaflow website located at https://syntaflow.tech (the \"Site\"), the Syntaflow desktop application (\"Desktop Application\"), and all associated documentation, services, and software interfaces (collectively, the \"Service\").\n\nBy downloading, installing, accessing, or using the Service, you signify that you have read, understood, and agree to be bound by these Terms and our Privacy Policy (https://syntaflow.tech/privacy), which is incorporated herein by reference. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS, YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICE AND MUST DISCONTINUE USE AND UNINSTALL THE APPLICATION IMMEDIATELY."
  },
  {
    "num": 2,
    "title": "Eligibility and Authority",
    "content": "The Service is intended solely for business, commercial, freelance, and professional use by individuals who have reached the legal age of majority in their jurisdiction (typically 18 years of age or older). By using the Service, you represent and warrant that:\n(a) You have the legal capacity and authority to enter into these Terms;\n(b) You are not a minor in your jurisdiction of residence;\n(c) If you are using the Service on behalf of a company, organization, agency, or other legal entity, you have full authority to bind that entity to these Terms, and your agreement to these Terms will be treated as the agreement of that entity;\n(d) You will not use the Service for any unlawful or unauthorized purpose; and\n(e) Your use of the Service will not violate any applicable local, state, national, or international law or regulation."
  },
  {
    "num": 3,
    "title": "Account Registration and Credentials",
    "content": "Certain features of the Service or desktop licensing may require creating an account or registering a workspace profile. You agree to:\n(a) Provide accurate, current, and complete information during registration;\n(b) Maintain and promptly update your information to keep it accurate, current, and complete;\n(c) Maintain the strict confidentiality and security of your account credentials, encryption keys, and session tokens;\n(d) Accept sole responsibility for all activities, actions, and deliverables generated under your credentials; and\n(e) Notify Syntaflow immediately at security@syntaflow.tech upon discovering or suspecting any unauthorized access, security breach, or loss of account credentials.\n\nSyntaflow cannot and will not be liable for any loss, damage, or unauthorized disclosure arising from your failure to safeguard your credentials or local cryptographic vault."
  },
  {
    "num": 4,
    "title": "The Service and Software Nature",
    "content": "Syntaflow is a specialized client work management system engineered primarily as a local-first desktop application. The core software operates on your local workstation, persisting client workspaces, engagement stages, deliverable versions, and operational state to a local SQLite database on your device.\n\nUnless explicitly configured with optional cloud synchronization or external third-party integrations, the Service does not continuously stream or centralize your proprietary client communications, contracts, or work records to remote servers. You understand and acknowledge that the primary performance, persistence, and storage integrity of your client records depend upon your workstation's hardware, filesystem integrity, and backup practices."
  },
  {
    "num": 5,
    "title": "Preview, Beta, and Pre-Release Software",
    "content": "Syntaflow may provide access to pre-release, preview, developer, or \"beta\" versions of the Desktop Application or specific feature modules (including experimental integration connectors marked as \"TEST\" or \"PREVIEW\"). \n\nYou acknowledge and agree that:\n(a) Preview software is provided strictly for evaluation, testing, and feedback purposes;\n(b) Preview software may contain bugs, defects, schema migrations, or unexpected behaviors and is not guaranteed to be feature-complete or error-free;\n(c) Features, APIs, and data schemas present in preview builds may be modified, deprecated, or discontinued at any time without notice;\n(d) You are solely responsible for maintaining external, verified backups of all production deliverables, contracts, and critical client records prior to testing preview versions; and\n(e) Syntaflow disclaims all liability for data corruption, downtime, or operational interruption arising from your use of preview software to the maximum extent permitted by law."
  },
  {
    "num": 6,
    "title": "Integration Services and External Authentication",
    "content": "The Service enables you to optionally connect external third-party software tools, including Google Workspace (Gmail, Google Calendar, Google Drive), GitHub, Slack, Notion, and Linear.\n\nWhen connecting an external service:\n(a) Authentication is executed using OAuth 2.0 with PKCE (Proof Key for Code Exchange). Sensitive OAuth tokens, refresh tokens, and API secrets are stored locally on your physical device using your operating system's hardware-backed cryptographic keychain (Electron safeStorage / Windows DPAPI);\n(b) Syntaflow does not transmit your integration credentials or third-party access tokens to Syntaflow servers;\n(c) You grant Syntaflow permission to interface with the third-party service solely on your behalf and strictly within the scope of permissions and API scopes you explicitly authorize;\n(d) You may revoke Syntaflow's access at any time through the in-app Integration settings or via the external provider's security portal (e.g., Google Account Security Permissions); and\n(e) Upon disconnecting an integration, all locally cached tokens and ephemeral identifiers for that service are immediately and permanently erased from your local machine."
  },
  {
    "num": 7,
    "title": "Third-Party Services and Content",
    "content": "The Service may reference, link to, or interact with third-party software, APIs, repositories, websites, and services. Syntaflow does not own, control, operate, or endorse any third-party services.\n\nYour use of third-party services is governed exclusively by the applicable terms and privacy policies of those third parties (e.g., Google Terms of Service, GitHub Terms of Service, Slack Terms of Service). Syntaflow is not responsible or liable for:\n(a) The availability, accuracy, or continuous uptime of third-party APIs;\n(b) Changes to third-party API rate limits, pricing, scopes, or terms;\n(c) The acts, errors, omissions, or data handling practices of third-party providers; or\n(d) Any loss, damage, or service disruption caused by a third-party service."
  },
  {
    "num": 8,
    "title": "AI-Generated Content and Automated Output",
    "content": "Syntaflow incorporates artificial intelligence workflows and assistive task generation designed to accelerate client intake, brief structuring, proposal drafting, and deliverable review summaries.\n\nYou understand and agree that:\n(a) AI-generated text, task breakdowns, summaries, and suggestions are automated assistive drafts provided for your review and discretionary modification;\n(b) Syntaflow DOES NOT guarantee the accuracy, completeness, legal soundness, factual correctness, or quality of any AI output;\n(c) YOU ARE SOLELY RESPONSIBLE FOR INDEPENDENTLY REVIEWING, VERIFYING, EDITING, AND APPROVING ALL AI-GENERATED CONTENT BEFORE TRANSMITTING IT TO CLIENTS, COUNSEL, OR COUNTERPARTIES;\n(d) AI features in Syntaflow do not initiate destructive actions, outbound communications, or irreversible approvals without explicit human confirmation; and\n(e) Under no circumstances does Syntaflow sell your client data or use your confidential project records to train generalized machine learning or foundation models."
  },
  {
    "num": 9,
    "title": "User Responsibilities and Conduct",
    "content": "You retain sole responsibility for your conduct and all client engagements managed through the Service. You agree that you will:\n(a) Comply with all applicable laws, export controls, intellectual property laws, data protection regulations (including GDPR, CCPA, and applicable state privacy statutes), and professional ethics codes governing your practice;\n(b) Ensure you have obtained all necessary client consents, non-disclosure agreements, and rights before importing third-party data, client files, or credentials into the Service;\n(c) Maintain adequate independent backups of your local database files and critical deliverables; and\n(d) Cooperate with reasonable security requests and promptly address any discovered vulnerabilities in your workstation environment."
  },
  {
    "num": 10,
    "title": "Acceptable Use Policy and Prohibited Activities",
    "content": "You agree not to use the Service, directly or indirectly, for any prohibited purpose. Specifically, you shall NOT:\n(a) Reverse engineer, decompile, disassemble, or attempt to derive the source code of any proprietary components of the Service, except to the extent permitted by applicable open-source licenses or mandatory law;\n(b) Circumvent, disable, bypass, or tamper with any digital rights management, license key validation, or security boundary mechanisms;\n(c) Use the Service to transmit, store, or distribute malicious code, viruses, trojans, ransomware, or spyware;\n(d) Interfere with, disrupt, or place an unreasonable load on the Service's web infrastructure, networks, or connected third-party APIs;\n(e) Use the Service to engage in deceptive practices, fraudulent billing, harassment, defamation, or transmission of unauthorized unsolicited commercial communications (spam);\n(f) Impersonate any person, client, organization, or entity, or misrepresent your affiliation with Syntaflow; or\n(g) Rent, lease, sublicense, resell, or distribute the proprietary desktop software to unauthorized third parties."
  },
  {
    "num": 11,
    "title": "Intellectual Property Rights",
    "content": "Unless otherwise indicated, the Site, Desktop Application, software code, user interface designs, visual layouts, branding, trademarks, logos, domain names, and technical documentation are the exclusive property of Syntaflow or its licensors and are protected by copyright, trademark, patent, trade secret, and unfair competition laws.\n\nThe \"Syntaflow\" name, the Syntaflow logo, and all related graphic marks are trademarks of Syntaflow. You are granted no right or license to use any Syntaflow trademarks without our prior written consent. All third-party trademarks, service marks, and company names referenced across our integrations catalog remain the property of their respective owners."
  },
  {
    "num": 12,
    "title": "User Content and Workspace Data",
    "content": "You retain 100% ownership of and all intellectual property rights in all data, text, files, contracts, client records, designs, code, and materials that you create, import, or manage within the Service (\"User Content\").\n\nSyntaflow asserts NO ownership, copyright, or intellectual property claims over your User Content. Because Syntaflow operates primarily as a local-first application, your User Content remains stored on your local hardware. To the extent you utilize our website feedback forms or transmit data during technical support inquiries, you grant Syntaflow only a limited, non-exclusive license to process such data strictly to resolve your support inquiry or deliver requested services."
  },
  {
    "num": 13,
    "title": "Software License and Restrictions",
    "content": "Subject to your ongoing compliance with these Terms, Syntaflow grants you a limited, revocable, non-exclusive, non-transferable, non-sublicensable license to download, install, and execute the Syntaflow Desktop Application on compatible devices owned or controlled by you, solely for your internal professional or commercial business purposes.\n\nOpen-source libraries and dependencies bundled within the Service are governed by their respective third-party licenses (e.g., MIT, Apache 2.0, BSD). Nothing in these Terms limits or alters your rights under such open-source licenses."
  },
  {
    "num": 14,
    "title": "Service Availability, Maintenance, and Modifications",
    "content": "Syntaflow strives to maintain high availability and reliability for our website and distribution services. However, we do not guarantee uninterrupted, continuous, or error-free operation. We reserve the right to:\n(a) Modify, update, enhance, or temporarily suspend the Site or distribution endpoints for maintenance, security patches, or feature revisions;\n(b) Modify or discontinue specific features or capabilities with reasonable prior notice where practicable; and\n(c) Discontinue support for deprecated operating system versions or legacy desktop platforms as software runtimes evolve.\n\nBecause the Desktop Application stores state locally, scheduled maintenance on our web servers will not prevent you from accessing your existing offline local database or continuing client work on your machine."
  },
  {
    "num": 15,
    "title": "Updates, Releases, and Automatic Patches",
    "content": "The Desktop Application may periodically check our official release servers (https://syntaflow.tech) for updated versions, security patches, and schema improvements. \n\nYou acknowledge that:\n(a) Updates may be downloaded and prompted for installation to maintain security and interoperability;\n(b) Critical security fixes may be applied to resolve discovered vulnerabilities; and\n(c) Certain updates may include automated schema migrations for your local SQLite database, for which the application maintains defensive snapshot backups prior to migration execution."
  },
  {
    "num": 16,
    "title": "Fees, Payments, and Subscriptions (Preview Disclosures)",
    "content": "During the current public desktop preview phase, access to core Syntaflow capabilities, including client workspace management, document version tracking, approval audits, and external integrations, is provided without subscription fees.\n\nCommercial tiers, professional studio licenses, and premium hosted capabilities may be introduced in future releases. Any future fees, payment schedules, and subscription terms will be clearly disclosed prior to implementation, and no fees will be assessed without your affirmative consent and selection of a paid tier."
  },
  {
    "num": 17,
    "title": "Cancellation and Refund Policy",
    "content": "Because preview versions of the Service are currently provided free of charge, standard consumer billing cancellation and refund mechanisms are not applicable to preview downloads.\n\nFor any future commercial licensing tiers, cancellation and refund policies will be clearly specified in the commercial agreement and subscription checkout flow, providing at least thirty (30) days notice of any pricing changes."
  },
  {
    "num": 18,
    "title": "Suspension and Termination",
    "content": "These Terms remain in full force and effect while you use the Service. You may terminate these Terms at any time by discontinuing use of the Service and uninstalling the Desktop Application from your devices.\n\nSyntaflow may suspend or terminate your right to access the Site, cloud distribution services, or account credentials immediately, without prior notice or liability, if:\n(a) You breach any provision of these Terms or the Acceptable Use Policy;\n(b) We are required to do so by applicable law, court order, or regulatory directive; or\n(c) We detect fraudulent, malicious, or abusive activity threatening the security of our infrastructure or other users.\n\nUpon termination, all licenses granted to you under these Terms terminate immediately, and you must cease all use of the proprietary software components."
  },
  {
    "num": 19,
    "title": "Disclaimers and As-Is Warranties",
    "content": "THE SERVICE, SITE, DESKTOP APPLICATION, AND ALL CONTENT ARE PROVIDED ON AN \"AS IS\" AND \"AS AVAILABLE\" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.\n\nTO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, SYNTAFLOW EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:\n(A) IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT;\n(B) WARRANTIES THAT THE SERVICE WILL BE SECURE, UNINTERRUPTED, ACCURATE, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS;\n(C) WARRANTIES REGARDING THE ACCURACY, RELIABILITY, OR SUITABILITY OF ANY AI-GENERATED DRAFT, SUMMARY, OR RECOMMENDATION; AND\n(D) WARRANTIES REGARDING THE UPTIME, DATA FIDELITY, OR CONTINUOUS AVAILABILITY OF ANY THIRD-PARTY INTEGRATION (GMAIL, GOOGLE CALENDAR, GOOGLE DRIVE, GITHUB, NOTION, OR LINEAR).\n\nYOU ASSUME TOTAL RESPONSIBILITY AND RISK FOR YOUR USE OF THE SERVICE AND YOUR SELECTION OF LOCAL BACKUP PRACTICES."
  },
  {
    "num": 20,
    "title": "Limitation of Liability",
    "content": "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SYNTAFLOW, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, CONTRACTORS, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:\n(A) LOSS OF PROFITS, REVENUE, OR COMMERCIAL OPPORTUNITY;\n(B) LOSS OF BUSINESS, CLIENT ENGAGEMENTS, REPUTATION, OR GOODWILL;\n(C) LOSS, CORRUPTION, OR TAMPERING OF WORK RECORDS, DATA, OR LOCAL HARDWARE FILES; OR\n(D) INTERRUPTIONS ARISING FROM THIRD-PARTY API REVOCATIONS OR SERVICE OUTAGES,\nEVEN IF SYNTAFLOW HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.\n\nTO THE MAXIMUM EXTENT PERMITTED BY LAW, SYNTAFLOW'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE GREATER OF: (I) THE TOTAL AMOUNT ACTUALLY PAID BY YOU TO SYNTAFLOW IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (II) ONE HUNDRED UNITED STATES DOLLARS ($100.00 USD)."
  },
  {
    "num": 21,
    "title": "Changes to Terms",
    "content": "Syntaflow reserves the right, in our sole discretion, to modify, amend, or replace these Terms at any time. When we make material changes, we will update the \"Last Updated\" date at the top of these Terms and provide prominent notice on our website or within the application release notes.\n\nYour continued use of the Service following the posting of revised Terms constitutes your irrevocable acceptance of the updated terms. If you do not agree with the modified Terms, your sole remedy is to cease using the Service and uninstall the Desktop Application."
  },
  {
    "num": 22,
    "title": "Contact Information",
    "content": "If you have questions, comments, or legal notices concerning these Terms, please contact our legal and support team:\n\nSyntaflow Legal & Governance\nPrimary Contact: contact@syntaflow.tech\nPrivacy Inquiries: privacy@syntaflow.tech\nSecurity Disclosures: security@syntaflow.tech\nSupport & Operations: support@syntaflow.tech\nOfficial Domain: https://syntaflow.tech\nPublic Repository & Issues: https://github.com/syntaflow/syntaflow"
  }
];

export const TermsPage: React.FC = () => {
  return (
    <div style={{ paddingBottom: 'var(--space-64)' }}>
      <SEOHead path="/terms" />

      {/* Header */}
      <section className="section" style={{ paddingTop: 'var(--space-48)', paddingBottom: 'var(--space-24)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-12)' }}>
            <Link href="/" style={{ fontSize: '12.5px', color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/</span>
            <span style={{ fontSize: '12.5px', color: 'var(--cyan)', fontWeight: 500 }}>Legal</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/</span>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Terms</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '100px', backgroundColor: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.25)', marginBottom: 'var(--space-16)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              LEGAL TERMS // CLIENT WORKSPACE SOFTWARE
            </span>
          </div>

          <h1 className="heading-1" style={{ fontSize: 'clamp(32px, 5vw, 44px)', color: 'var(--text)', marginBottom: 'var(--space-16)', letterSpacing: '-0.02em' }}>
            Syntaflow Terms of Service
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <span>Effective Date: {EFFECTIVE_DATE}</span>
            <span>•</span>
            <span>Last Updated: {LAST_UPDATED}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section" style={{ paddingTop: 'var(--space-36)' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          {/* Executive Summary Card */}
          <Card variant="raised" style={{ padding: 'var(--space-28)', marginBottom: 'var(--space-36)', backgroundColor: 'var(--surface-raised)', borderLeft: '4px solid var(--cobalt)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px', letterSpacing: '-0.01em' }}>
              Summary of Key Terms
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <div>
                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '2px' }}>Local-First Architecture</strong>
                Syntaflow operates locally on your workstation. You own 100% of your workspace records and files.
              </div>
              <div>
                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '2px' }}>Preview Software</strong>
                The desktop software is currently provided as a pre-release preview without warranty or licensing fees.
              </div>
              <div>
                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '2px' }}>OAuth Tokens Protected</strong>
                Integration credentials stay on your device encrypted via your OS hardware keychain (safeStorage / DPAPI).
              </div>
              <div>
                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '2px' }}>AI Human Confirmation</strong>
                Automated drafts never send communications or finalize approvals without explicit human verification.
              </div>
            </div>
          </Card>

          {/* Table of Contents */}
          <div style={{ marginBottom: 'var(--space-48)', padding: 'var(--space-24)', backgroundColor: 'var(--surface-sunken)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
              Contents
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px 24px', fontSize: '13.5px' }}>
              {SECTIONS.map((s) => (
                <a
                  key={s.num}
                  href={`#section-${s.num}`}
                  style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cyan)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)', marginRight: '6px' }}>{s.num}.</span>
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-40)' }}>
            {SECTIONS.map((section) => (
              <div
                key={section.num}
                id={`section-${section.num}`}
                style={{
                  paddingBottom: 'var(--space-32)',
                  borderBottom: '1px solid var(--border)',
                  scrollMarginTop: '100px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', fontWeight: 600 }}>
                    SECTION {section.num.toString().padStart(2, '0')}
                  </span>
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px', letterSpacing: '-0.01em' }}>
                  {section.num}. {section.title}
                </h2>
                <div style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Cross Links */}
          <div style={{ marginTop: 'var(--space-48)', padding: 'var(--space-24)', backgroundColor: 'var(--surface-raised)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>Related Legal & Security Documentation</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Review our complete privacy policy and architectural security documentation.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/privacy" style={{ fontSize: '13px', color: 'var(--cyan)', fontWeight: 500, textDecoration: 'none' }}>Privacy Policy &rarr;</Link>
              <Link href="/security" style={{ fontSize: '13px', color: 'var(--cyan)', fontWeight: 500, textDecoration: 'none' }}>Security & Architecture &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
