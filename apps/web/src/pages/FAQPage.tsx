import React, { useState } from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { Accordion } from '../components/ui/Accordion';
import { FAQ_DATA } from '../content/faqData';
import { CTASection } from '../components/marketing/CTASection';

const CATEGORIES = ['All', 'General', 'Product', 'Security', 'Privacy', 'Data', 'Pricing', 'Account'] as const;

export const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered = activeCategory === 'All'
    ? FAQ_DATA
    : FAQ_DATA.filter((item) => item.category === activeCategory);

  const accordionItems = filtered.map((item, idx) => ({
    id: `faq-${idx}`,
    title: item.question,
    content: item.answer,
    category: item.category,
  }));

  return (
    <>
      <SEOHead
        title="Frequently Asked Questions — Syntaflow"
        description="Factual, verifiable answers regarding Syntaflow desktop architecture, privacy, local-first storage, delivery gates, and pricing."
      />

      <PageHero
        eyebrow="Resources"
        title="Frequently Asked Questions"
        description="Clear, honest answers about what Syntaflow is today, how it protects client records, and where the product is headed."
      />

      <section className="sf-section">
        <Container size="narrow">
          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: 'var(--space-4)',
              marginBottom: 'var(--space-8)',
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  backgroundColor: activeCategory === cat ? 'var(--color-cobalt)' : 'var(--color-surface)',
                  color: activeCategory === cat ? '#ffffff' : 'var(--color-text-secondary)',
                  border: activeCategory === cat ? '1px solid var(--color-cobalt)' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--duration-fast)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion FAQ Items */}
          <Accordion items={accordionItems} allowMultiple />
        </Container>
      </section>

      <CTASection />
    </>
  );
};
