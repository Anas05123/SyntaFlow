import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { Container } from '../components/ui/Container';
import { HeroSection } from '../components/marketing/HeroSection';
import { DeliveryGateSimulator } from '../components/marketing/DeliveryGateSimulator';
import { LocalEnclaveInspector } from '../components/marketing/LocalEnclaveInspector';
import { InteractiveBentoSection } from '../components/marketing/InteractiveBentoSection';
import { EngagementCostCalculator } from '../components/pricing/EngagementCostCalculator';
import { HumanControlSection } from '../components/marketing/HumanControlSection';
import { CTASection } from '../components/marketing/CTASection';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Syntaflow — The Client Operations Desktop Environment"
        description="A local-first desktop application for freelancers, consultants, and agencies. Keep client agreements, active scopes, immutable document versions, and delivery approvals in one continuous local record."
      />

      {/* 1. Direct, Human Hero with Interactive Cockpit Simulator */}
      <HeroSection />

      {/* 2. Interactive Delivery Gate & Scope Drift Simulator */}
      <section style={{ paddingBottom: 'var(--space-20)' }}>
        <Container>
          <DeliveryGateSimulator />
        </Container>
      </section>

      {/* 3. The 4 Operational Invariants (Continuous Thread, Immutability, Sovereignty, Gates) */}
      <InteractiveBentoSection />

      {/* 4. Interactive Tool Consolidation & Economic Calculator */}
      <section style={{ paddingBottom: 'var(--space-20)' }}>
        <Container>
          <EngagementCostCalculator />
        </Container>
      </section>

      {/* 5. Machine Sovereignty & Zero-Telemetry Packet Inspector */}
      <section style={{ paddingBottom: 'var(--space-20)' }}>
        <Container>
          <LocalEnclaveInspector />
        </Container>
      </section>

      {/* 6. Human Control & Agency Principles */}
      <HumanControlSection />

      {/* 7. Bottom Conversion Band */}
      <CTASection />
    </>
  );
};
