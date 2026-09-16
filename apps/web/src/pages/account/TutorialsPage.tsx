import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Link } from '../../components/ui/Link';

export const TutorialsPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Operator Tutorials — Syntaflow Account"
        description="Step-by-step interactive visual guides for mastering connected client workflows in Syntaflow."
        path="/account/tutorials"
        indexable={false}
      />

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#ffffff', margin: '0 0 0.5rem 0' }}>
          Operator Tutorials
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
          Practical, step-by-step guides to help you configure client scoping, document drafting, and delivery gates.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>
        {/* Highlight Feature Card (Modeled after reference image) */}
        <div
          style={{
            padding: '2rem',
            borderRadius: '16px',
            backgroundColor: 'rgba(17, 20, 26, 0.95)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#00f2fe',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Start Here // Guide 01
            </span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
            Setting Up Your First Client Engagement
          </h2>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: '700px' }}>
            Learn how to initialize a client record, attach commercial billing terms, design your blueprint scoping milestones, and prevent deliverable handover until prerequisite gates pass.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34d399' }} />
              5 min read
            </span>
            <span>·</span>
            <span>Desktop Workspace Required</span>
          </div>

          <Link
            href="/docs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: 'var(--cobalt)',
              color: '#ffffff',
              fontSize: '13.5px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <span>Read Setup Guide</span>
            <span>→</span>
          </Link>
        </div>

        {/* Secondary Guides Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {/* Guide 2 */}
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '14px',
              backgroundColor: 'rgba(17, 20, 26, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Guide 02 // Drafting
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>
              Typographic Paper Canvas
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              How to compose proposals and scope deliverables with strict version immutability and AI drafting assistance.
            </p>
            <Link href="/docs" style={{ fontSize: '13px', color: '#00f2fe', textDecoration: 'none', fontWeight: 500 }}>
              Read Tutorial →
            </Link>
          </div>

          {/* Guide 3 */}
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '14px',
              backgroundColor: 'rgba(17, 20, 26, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Guide 03 // Approvals
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>
              Enforcing Delivery Gates
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Lock milestone deliverables until the client approves the exact immutable review version snapshot.
            </p>
            <Link href="/docs" style={{ fontSize: '13px', color: '#00f2fe', textDecoration: 'none', fontWeight: 500 }}>
              Read Tutorial →
            </Link>
          </div>

          {/* Guide 4 */}
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '14px',
              backgroundColor: 'rgba(17, 20, 26, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Guide 04 // Security
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>
              Local Vault & Integrations
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              How Windows DPAPI protects your Gmail, Calendar, and GitHub tokens with zero cloud credential leaks.
            </p>
            <Link href="/docs" style={{ fontSize: '13px', color: '#00f2fe', textDecoration: 'none', fontWeight: 500 }}>
              Read Tutorial →
            </Link>
          </div>
        </div>

        {/* Footer Support Banner */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>
              Looking for full technical specifications?
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Explore data schemas, SQLite migration standards, and IPC bridge contracts.
            </div>
          </div>
          <Link
            href="/docs"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Explore Full Documentation ↗
          </Link>
        </div>
      </div>
    </div>
  );
};
