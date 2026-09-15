import React, { useState } from 'react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  category?: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`sf-accordion ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              transition: 'border-color var(--duration-fast) var(--ease-spring)',
            }}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggle(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-6)',
                textAlign: 'left',
                backgroundColor: isOpen ? 'var(--color-surface-raised)' : 'transparent',
                border: 'none',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '1.0625rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color var(--duration-fast) var(--ease-spring)',
              }}
            >
              <span>{item.title}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform var(--duration-fast) var(--ease-spring)',
                  color: 'var(--color-text-secondary)',
                  flexShrink: 0,
                  marginLeft: '1rem',
                }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isOpen && (
              <div
                style={{
                  padding: 'var(--space-6)',
                  paddingTop: 'var(--space-2)',
                  fontSize: '0.9375rem',
                  lineHeight: '1.65',
                  color: 'var(--color-text-secondary)',
                  borderTop: '1px solid var(--color-border-subtle)',
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
