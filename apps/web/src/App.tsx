import React from 'react';
import { usePath } from './router/Router';
import { SiteHeader } from './components/navigation/SiteHeader';
import { SiteFooter } from './components/navigation/SiteFooter';
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

      default:
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
