import React from 'react';
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

export const App: React.FC = () => {
  const [currentPath] = usePath();

  const renderRoute = () => {
    switch (currentPath) {
      case '/':
      case '':
        return <HomePage />;

      /* Product Routes */
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

      /* Solutions Routes */
      case '/solutions/freelancers':
        return <FreelancersPage />;
      case '/solutions/agencies':
        return <AgenciesPage />;
      case '/solutions/consultants':
        return <ConsultantsPage />;
      case '/solutions/studios':
        return <StudiosPage />;

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
