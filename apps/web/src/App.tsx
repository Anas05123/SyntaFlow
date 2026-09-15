import React from 'react';
import { usePath } from './router/Router';
import { SiteHeader } from './components/navigation/SiteHeader';
import { SiteFooter } from './components/navigation/SiteFooter';
import { HomePage } from './pages/HomePage';

export const App: React.FC = () => {
  const path = usePath();

  const renderContent = () => {
    switch (path) {
      case '/':
      case '':
        return <HomePage />;
      default:
        // Placeholder until Phase 4-6 pages are mounted
        return <HomePage />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader />
      <main id="content" style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <SiteFooter />
    </div>
  );
};
