import React, { useEffect } from 'react';
import './styles/global.css';
import { usePath } from './utils/router';
import { SiteHeader } from './components/navigation/SiteHeader';
import { SiteFooter } from './components/navigation/SiteFooter';
import { HomePage } from './pages/HomePage';
import { ProductOverviewPage } from './pages/product/ProductOverviewPage';
import { ClientOpsPage } from './pages/product/ClientOpsPage';
import { ProjectsTasksPage } from './pages/product/ProjectsTasksPage';
import { DocumentsReviewsPage } from './pages/product/DocumentsReviewsPage';
import { DeliveryApprovalsPage } from './pages/product/DeliveryApprovalsPage';
import { FreelancersPage } from './pages/solutions/FreelancersPage';
import { AgenciesPage } from './pages/solutions/AgenciesPage';
import { ConsultantsPage } from './pages/solutions/ConsultantsPage';
import { StudiosPage } from './pages/solutions/StudiosPage';
import { SecurityPage } from './pages/trust/SecurityPage';
import { PrivacyPage } from './pages/trust/PrivacyPage';
import { DataHandlingPage } from './pages/trust/DataHandlingPage';
import { FAQPage } from './pages/resources/FAQPage';
import { ChangelogPage } from './pages/resources/ChangelogPage';
import { AboutPage } from './pages/company/AboutPage';
import { RoadmapPage } from './pages/company/RoadmapPage';
import { ContactPage } from './pages/company/ContactPage';
import { TermsPage } from './pages/legal/TermsPage';

/* New Core Pages */
import { PricingPage } from './pages/PricingPage';
import { DownloadPage } from './pages/DownloadPage';
import { IntegrationsCatalogPage } from './pages/IntegrationsCatalogPage';
import { DocsPage } from './pages/DocsPage';
import { LoginPage } from './pages/auth/LoginPage';
import { DesktopAuthPage } from './pages/auth/DesktopAuthPage';
import { AccountPage } from './pages/AccountPage';

export const App: React.FC = () => {
  const [currentPath] = usePath();

  // Scroll to top on route change & handle legacy path alias redirects
  useEffect(() => {
    window.scrollTo(0, 0);
    const path = currentPath.replace(/\/+$/, '') || '/';
    if (path === '/privacy-policy' || path === '/cookies') {
      window.location.hash = '#/privacy';
    } else if (path === '/terms-of-service' || path === '/acceptable-use') {
      window.location.hash = '#/terms';
    }
  }, [currentPath]);

  const renderRoute = () => {
    // Normalization
    const path = currentPath.replace(/\/+$/, '') || '/';

    // Canonical legal routes (including legacy alias mapping)
    if (path === '/privacy-policy' || path === '/cookies' || path === '/privacy') {
      return <PrivacyPage />;
    }
    if (path === '/terms-of-service' || path === '/acceptable-use' || path === '/terms') {
      return <TermsPage />;
    }

    switch (path) {
      case '/':
        return <HomePage />;

      /* Product */
      case '/product':
        return <ProductOverviewPage />;
      case '/product/client-ops':
        return <ClientOpsPage />;
      case '/product/projects-tasks':
        return <ProjectsTasksPage />;
      case '/product/documents-reviews':
        return <DocumentsReviewsPage />;
      case '/product/delivery-approvals':
        return <DeliveryApprovalsPage />;

      /* Solutions */
      case '/solutions/freelancers':
        return <FreelancersPage />;
      case '/solutions/agencies':
        return <AgenciesPage />;
      case '/solutions/consultants':
        return <ConsultantsPage />;
      case '/solutions/studios':
        return <StudiosPage />;

      /* Core Navigation (Section 5) */
      case '/integrations':
        return <IntegrationsCatalogPage />;
      case '/pricing':
        return <PricingPage />;
      case '/docs':
      case '/docs/getting-started':
        return <DocsPage />;
      case '/download':
        return <DownloadPage />;
      case '/login':
        return <LoginPage />;
      case '/auth/desktop':
        return <DesktopAuthPage />;
      case '/account':
        return <AccountPage />;

      /* Trust & Security */
      case '/security':
        return <SecurityPage />;
      case '/privacy':
        return <PrivacyPage />;
      case '/data-handling':
        return <DataHandlingPage />;

      /* Resources */
      case '/faq':
        return <FAQPage />;
      case '/changelog':
        return <ChangelogPage />;

      /* Company */
      case '/about':
        return <AboutPage />;
      case '/roadmap':
        return <RoadmapPage />;
      case '/contact':
        return <ContactPage />;

      /* Legal */
      case '/terms':
        return <TermsPage />;

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
