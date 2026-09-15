import React from 'react';
import { usePath } from './router/routerContext';
import { SiteHeader } from './components/navigation/SiteHeader';
import { SiteFooter } from './components/navigation/SiteFooter';
import { AtmosphericBackground } from './components/ui/AtmosphericBackground';
import { HomePage } from './pages/HomePage';
import { ProductOverviewPage } from './pages/ProductOverviewPage';
import { ProductClientOpsPage } from './pages/ProductClientOpsPage';
import { ProductProjectsTasksPage } from './pages/ProductProjectsTasksPage';
import { ProductDocumentsReviewsPage } from './pages/ProductDocumentsReviewsPage';
import { ProductDeliveryApprovalsPage } from './pages/ProductDeliveryApprovalsPage';
import { SolutionsOverviewPage } from './pages/SolutionsOverviewPage';
import { SolutionsFreelancersPage } from './pages/SolutionsFreelancersPage';
import { SolutionsAgenciesPage } from './pages/SolutionsAgenciesPage';
import { SolutionsConsultantsPage } from './pages/SolutionsConsultantsPage';
import { SolutionsStudiosPage } from './pages/SolutionsStudiosPage';
import { SecurityPage } from './pages/SecurityPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { DataHandlingPage } from './pages/DataHandlingPage';
import { FAQPage } from './pages/FAQPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { AboutPage } from './pages/AboutPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { DownloadPage } from './pages/DownloadPage';

export const App: React.FC = () => {
  const path = usePath();

  const renderContent = () => {
    switch (path) {
      case '/':
      case '':
        return <HomePage />;

      // Product routes
      case '/product':
        return <ProductOverviewPage />;
      case '/product/client-operations':
        return <ProductClientOpsPage />;
      case '/product/projects-tasks':
        return <ProductProjectsTasksPage />;
      case '/product/documents-reviews':
        return <ProductDocumentsReviewsPage />;
      case '/product/delivery-approvals':
        return <ProductDeliveryApprovalsPage />;

      // Solutions routes
      case '/solutions':
        return <SolutionsOverviewPage />;
      case '/solutions/freelancers':
        return <SolutionsFreelancersPage />;
      case '/solutions/agencies':
        return <SolutionsAgenciesPage />;
      case '/solutions/consultants':
        return <SolutionsConsultantsPage />;
      case '/solutions/studios':
        return <SolutionsStudiosPage />;

      // Security & Trust routes
      case '/security':
        return <SecurityPage />;
      case '/privacy':
        return <PrivacyPage />;
      case '/data-handling':
        return <DataHandlingPage />;

      // Resources routes
      case '/faq':
        return <FAQPage />;
      case '/changelog':
        return <ChangelogPage />;

      // Company routes
      case '/about':
        return <AboutPage />;
      case '/roadmap':
        return <RoadmapPage />;
      case '/contact':
        return <ContactPage />;

      // Legal routes
      case '/terms':
        return <LegalPage docId="terms" />;
      case '/legal/privacy':
      case '/privacy-policy':
        return <LegalPage docId="privacy" />;
      case '/cookies':
        return <LegalPage docId="cookies" />;
      case '/acceptable-use':
        return <LegalPage docId="acceptable-use" />;

      // Distribution
      case '/download':
        return <DownloadPage />;

      default:
        return <HomePage />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <AtmosphericBackground />
      <SiteHeader />
      <main id="content" style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {renderContent()}
      </main>
      <SiteFooter />
    </div>
  );
};
