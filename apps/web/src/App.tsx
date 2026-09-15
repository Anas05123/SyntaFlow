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
import { SecurityPage } from './pages/trust/SecurityPage';
import { PrivacyPage } from './pages/trust/PrivacyPage';
import { DataHandlingPage } from './pages/trust/DataHandlingPage';
import { FAQPage } from './pages/resources/FAQPage';
import { ChangelogPage } from './pages/resources/ChangelogPage';
import { AboutPage } from './pages/company/AboutPage';
import { RoadmapPage } from './pages/company/RoadmapPage';
import { ContactPage } from './pages/company/ContactPage';
import { TermsPage } from './pages/legal/TermsPage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { CookiePolicyPage } from './pages/legal/CookiePolicyPage';
import { AcceptableUsePage } from './pages/legal/AcceptableUsePage';

export const App: React.FC = () => {
  const [currentPath] = usePath();

  const renderRoute = () => {
    switch (currentPath) {
      case '/':
      case '':
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
      case '/privacy-policy':
        return <PrivacyPolicyPage />;
      case '/cookies':
        return <CookiePolicyPage />;
      case '/acceptable-use':
        return <AcceptableUsePage />;

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
