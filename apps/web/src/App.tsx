import React from 'react';
import './styles/global.css';
import { usePath } from './utils/router';
import { SiteHeader } from './components/navigation/SiteHeader';
import { SiteFooter } from './components/navigation/SiteFooter';
import { HomePage } from './pages/HomePage';

export const App: React.FC = () => {
  const [currentPath] = usePath();

  const renderRoute = () => {
    switch (currentPath) {
      case '/':
      case '':
      default:
        return <HomePage />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--canvas)' }}>
      <SiteHeader currentPath={currentPath} />
      <main style={{ flex: 1 }}>
        {renderRoute()}
      </main>
      <SiteFooter />
    </div>
  );
};
