import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, defaultTab, className = '' }) => {
  const [activeId, setActiveId] = useState<string>(defaultTab || items[0]?.id || '');

  const activeTab = items.find((t) => t.id === activeId) || items[0];

  return (
    <div className={`sf-tabs ${className}`} style={{ width: '100%' }}>
      <div
        role="tablist"
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--color-border)',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: 'var(--space-6)',
        }}
      >
        {items.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1rem',
                fontSize: '0.9375rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                backgroundColor: isActive ? 'var(--color-surface-raised)' : 'transparent',
                borderRadius: 'var(--radius-md)',
                border: isActive ? '1px solid var(--color-border-bright)' : '1px solid transparent',
                transition: 'all var(--duration-fast) var(--ease-spring)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  style={{
                    fontSize: '0.6875rem',
                    padding: '0.125rem 0.375rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isActive ? 'var(--color-cobalt)' : 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" style={{ minHeight: '200px' }}>
        {activeTab?.content}
      </div>
    </div>
  );
};
