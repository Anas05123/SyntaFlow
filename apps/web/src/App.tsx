import React from 'react';
import './styles/global.css';
import { usePath } from './utils/router';
import { SiteHeader } from './components/navigation/SiteHeader';
import { SiteFooter } from './components/navigation/SiteFooter';

export const App: React.FC = () => {
  const [currentPath] = usePath();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--canvas)' }}>
      <SiteHeader currentPath={currentPath} />
      <main style={{ flex: 1 }}>
        <div className="container" style={{ padding: 'var(--space-48) var(--space-24)' }}>
          <h1 className="heading-1">Foundation Active</h1>
          <p className="body-large" style={{ marginTop: 'var(--space-16)' }}>
            Current Path: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>{currentPath}</code>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};
