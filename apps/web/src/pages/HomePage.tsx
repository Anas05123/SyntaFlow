import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { HeroSection } from '../components/marketing/HeroSection';
import { InteractiveBentoSection } from '../components/marketing/InteractiveBentoSection';
import { ProductWorkflowSection } from '../components/marketing/ProductWorkflowSection';
import { HumanControlSection } from '../components/marketing/HumanControlSection';
import { SecuritySummarySection } from '../components/marketing/SecuritySummarySection';
import { CTASection } from '../components/marketing/CTASection';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Connected Intelligence That Moves Work Forward"
        description="Syntaflow is a desktop-first client engagement environment that keeps one continuous, connected record of every client relationship — from first contact to final delivery."
      />
      <HeroSection />
      <InteractiveBentoSection />
      <ProductWorkflowSection />
      <HumanControlSection />
      <SecuritySummarySection />
      <CTASection />
    </>
  );
};
