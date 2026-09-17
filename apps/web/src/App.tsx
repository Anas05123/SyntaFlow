import React, { useEffect, Suspense, lazy } from 'react';
import './styles/global.css';
import { usePath } from './utils/router';
import { SiteHeader } from './components/navigation/SiteHeader';
import { SiteFooter } from './components/navigation/SiteFooter';
import { AuthProvider } from './services/auth/AuthContext';
import { HomePage } from './pages/HomePage';

/* Route-Level Code Splitting for Public Routes */
const ProductOverviewPage = lazy(() => import('./pages/product/ProductOverviewPage').then((m) => ({ default: m.ProductOverviewPage })));
const ClientManagementPage = lazy(() => import('./pages/product/ClientManagementPage').then((m) => ({ default: m.ClientManagementPage })));
const ProjectsPage = lazy(() => import('./pages/product/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const DocumentsPage = lazy(() => import('./pages/product/DocumentsPage').then((m) => ({ default: m.DocumentsPage })));
const ReviewsApprovalsPage = lazy(() => import('./pages/product/ReviewsApprovalsPage').then((m) => ({ default: m.ReviewsApprovalsPage })));
const AIWorkspacePage = lazy(() => import('./pages/product/AIWorkspacePage').then((m) => ({ default: m.AIWorkspacePage })));
const SolutionsOverviewPage = lazy(() => import('./pages/solutions/SolutionsOverviewPage').then((m) => ({ default: m.SolutionsOverviewPage })));
const FreelancersPage = lazy(() => import('./pages/solutions/FreelancersPage').then((m) => ({ default: m.FreelancersPage })));
const AgenciesPage = lazy(() => import('./pages/solutions/AgenciesPage').then((m) => ({ default: m.AgenciesPage })));
const ConsultantsPage = lazy(() => import('./pages/solutions/ConsultantsPage').then((m) => ({ default: m.ConsultantsPage })));
const StudiosPage = lazy(() => import('./pages/solutions/StudiosPage').then((m) => ({ default: m.StudiosPage })));
const SecurityPage = lazy(() => import('./pages/trust/SecurityPage').then((m) => ({ default: m.SecurityPage })));
const PrivacyPage = lazy(() => import('./pages/trust/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const DataHandlingPage = lazy(() => import('./pages/trust/DataHandlingPage').then((m) => ({ default: m.DataHandlingPage })));
const FAQPage = lazy(() => import('./pages/resources/FAQPage').then((m) => ({ default: m.FAQPage })));
const ChangelogPage = lazy(() => import('./pages/resources/ChangelogPage').then((m) => ({ default: m.ChangelogPage })));
const AboutPage = lazy(() => import('./pages/company/AboutPage').then((m) => ({ default: m.AboutPage })));
const RoadmapPage = lazy(() => import('./pages/company/RoadmapPage').then((m) => ({ default: m.RoadmapPage })));
const ContactPage = lazy(() => import('./pages/company/ContactPage').then((m) => ({ default: m.ContactPage })));
const TermsPage = lazy(() => import('./pages/legal/TermsPage').then((m) => ({ default: m.TermsPage })));

const PricingPage = lazy(() => import('./pages/PricingPage').then((m) => ({ default: m.PricingPage })));
const DownloadPage = lazy(() => import('./pages/DownloadPage').then((m) => ({ default: m.DownloadPage })));
const IntegrationsCatalogPage = lazy(() => import('./pages/IntegrationsCatalogPage').then((m) => ({ default: m.IntegrationsCatalogPage })));
const GmailIntegrationPage = lazy(() => import('./pages/integrations/GmailIntegrationPage').then((m) => ({ default: m.GmailIntegrationPage })));
const GoogleCalendarIntegrationPage = lazy(() => import('./pages/integrations/GoogleCalendarIntegrationPage').then((m) => ({ default: m.GoogleCalendarIntegrationPage })));
const GoogleDriveIntegrationPage = lazy(() => import('./pages/integrations/GoogleDriveIntegrationPage').then((m) => ({ default: m.GoogleDriveIntegrationPage })));
const GitHubIntegrationPage = lazy(() => import('./pages/integrations/GitHubIntegrationPage').then((m) => ({ default: m.GitHubIntegrationPage })));
const NotionIntegrationPage = lazy(() => import('./pages/integrations/NotionIntegrationPage').then((m) => ({ default: m.NotionIntegrationPage })));
const LinearIntegrationPage = lazy(() => import('./pages/integrations/LinearIntegrationPage').then((m) => ({ default: m.LinearIntegrationPage })));
const DocsPage = lazy(() => import('./pages/DocsPage').then((m) => ({ default: m.DocsPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

/* Dedicated Auth Pages */
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const SignUpPage = lazy(() => import('./pages/auth/SignUpPage').then((m) => ({ default: m.SignUpPage })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const DesktopAuthPage = lazy(() => import('./pages/auth/DesktopAuthPage').then((m) => ({ default: m.DesktopAuthPage })));

/* Onboarding Flow */
const OnboardingFlow = lazy(() => import('./pages/onboarding/OnboardingFlow').then((m) => ({ default: m.OnboardingFlow })));

/* Authenticated Account Application Shell & Pages */
const AccountShell = lazy(() => import('./components/account/AccountShell').then((m) => ({ default: m.AccountShell })));
const AccountHomePage = lazy(() => import('./pages/account/AccountHomePage').then((m) => ({ default: m.AccountHomePage })));
const ProfilePage = lazy(() => import('./pages/account/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const PlanPage = lazy(() => import('./pages/account/PlanPage').then((m) => ({ default: m.PlanPage })));
const SessionsPage = lazy(() => import('./pages/account/SessionsPage').then((m) => ({ default: m.SessionsPage })));
const DownloadsPage = lazy(() => import('./pages/account/DownloadsPage').then((m) => ({ default: m.DownloadsPage })));
const DesktopConnectPage = lazy(() => import('./pages/account/DesktopConnectPage').then((m) => ({ default: m.DesktopConnectPage })));
const TutorialsPage = lazy(() => import('./pages/account/TutorialsPage').then((m) => ({ default: m.TutorialsPage })));

/**
 * Route Loading Fallback (Zero CLS, lightweight indicator)
 */
const RouteLoadingFallback: React.FC = () => (
  <div
    style={{
      minHeight: '65vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#08090b',
    }}
    role="status"
    aria-label="Loading page content"
  >
    <div
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderTopColor: '#00f2fe',
        animation: 'spin 0.6s linear infinite',
      }}
    />
  </div>
);

export const App: React.FC = () => {
  const [currentPath] = usePath();

  // Scroll to top on route change & handle legacy path alias permanent redirects
  useEffect(() => {
    window.scrollTo(0, 0);
    const path = currentPath.replace(/\/+$/, '') || '/';
    if (path === '/privacy-policy' || path === '/cookies') {
      window.history.replaceState(null, '', '/privacy');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else if (path === '/terms-of-service' || path === '/acceptable-use') {
      window.history.replaceState(null, '', '/terms');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else if (path === '/docs/getting-started') {
      window.history.replaceState(null, '', '/docs');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else if (path === '/product/client-ops') {
      window.history.replaceState(null, '', '/product/client-management');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else if (path === '/product/projects-tasks') {
      window.history.replaceState(null, '', '/product/projects');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else if (path === '/product/documents-reviews') {
      window.history.replaceState(null, '', '/product/documents');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else if (path === '/product/delivery-approvals') {
      window.history.replaceState(null, '', '/product/reviews-approvals');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [currentPath]);

  const path = currentPath.replace(/\/+$/, '') || '/';
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isAppHost = hostname === 'app.syntaflow.tech';
  const isDocsHost = hostname === 'docs.syntaflow.tech';

  const isAuthPath =
    path === '/login' ||
    path === '/signup' ||
    path === '/forgot-password' ||
    path.startsWith('/auth/desktop');

  // If visiting auth pages on app.syntaflow.tech or docs.syntaflow.tech, redirect to canonical auth on syntaflow.tech
  useEffect(() => {
    if ((isAppHost || isDocsHost) && isAuthPath) {
      const search = typeof window !== 'undefined' ? window.location.search : '';
      window.location.href = `https://syntaflow.tech${path}${search}`;
    }
  }, [isAppHost, isDocsHost, isAuthPath, path]);

  // If visiting docs on syntaflow.tech, redirect to canonical docs.syntaflow.tech
  useEffect(() => {
    if (typeof window !== 'undefined' && hostname === 'syntaflow.tech' && (path === '/docs' || path.startsWith('/docs/'))) {
      const subpath = path === '/docs' ? '' : path.replace(/^\/docs/, '');
      window.location.href = `https://docs.syntaflow.tech${subpath}${window.location.search}${window.location.hash}`;
    }
  }, [hostname, path]);

  // If visiting account portal on syntaflow.tech, redirect to canonical app.syntaflow.tech
  useEffect(() => {
    if (typeof window !== 'undefined' && hostname === 'syntaflow.tech' && (path === '/account' || path.startsWith('/account/'))) {
      const subpath = path === '/account' ? '' : path.replace(/^\/account/, '');
      window.location.href = `https://app.syntaflow.tech${subpath}${window.location.search}${window.location.hash}`;
    }
  }, [hostname, path]);

  // Determine application environment
  const isAccountRoute =
    !isAuthPath &&
    (isAppHost ||
     path.startsWith('/account') ||
     path === '/onboarding');

  const isAuthRoute = isAuthPath && !isAppHost && !isDocsHost;

  // 1. DEDICATED AUTH ROUTE (Split-screen, NO marketing navbar/footer)
  if (isAuthRoute) {
    return (
      <AuthProvider>
        <Suspense fallback={<RouteLoadingFallback />}>
          {path === '/login' && <LoginPage />}
          {path === '/signup' && <SignUpPage />}
          {path === '/forgot-password' && <ForgotPasswordPage />}
          {path.startsWith('/auth/desktop') && <DesktopAuthPage />}
        </Suspense>
      </AuthProvider>
    );
  }

  // 2. ONBOARDING JOURNEY (Progress bar shell, NO marketing navbar/footer)
  if (path === '/onboarding') {
    return (
      <AuthProvider>
        <Suspense fallback={<RouteLoadingFallback />}>
          <OnboardingFlow />
        </Suspense>
      </AuthProvider>
    );
  }

  // 3. DEDICATED DOCUMENTATION PORTAL (docs.syntaflow.tech)
  if (isDocsHost) {
    return (
      <AuthProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--canvas)' }}>
          <SiteHeader currentPath="/docs" />
          <main style={{ flex: 1 }}>
            <Suspense fallback={<RouteLoadingFallback />}>
              <DocsPage />
            </Suspense>
          </main>
          <SiteFooter />
        </div>
      </AuthProvider>
    );
  }

  // 4. AUTHENTICATED ACCOUNT PORTAL (Sidebar shell, NO marketing navbar/footer)
  if (isAccountRoute) {
    const renderAccountModule = () => {
      if (path === '/account/profile' || path === '/profile') {
        return <ProfilePage />;
      }
      if (path === '/account/plan' || path === '/plan') {
        return <PlanPage />;
      }
      if (path === '/account/sessions' || path === '/sessions') {
        return <SessionsPage />;
      }
      if (path === '/account/downloads' || path === '/downloads') {
        return <DownloadsPage />;
      }
      if (path === '/account/desktop' || path === '/desktop') {
        return <DesktopConnectPage />;
      }
      if (path === '/account/tutorials' || path === '/tutorials') {
        return <TutorialsPage />;
      }
      // Default to Account Home
      return <AccountHomePage />;
    };

    const canonicalSubpath = path.startsWith('/account') ? path : `/account${path === '/' ? '' : path}`;

    return (
      <AuthProvider>
        <Suspense fallback={<RouteLoadingFallback />}>
          <AccountShell currentSubpath={canonicalSubpath}>
            {renderAccountModule()}
          </AccountShell>
        </Suspense>
      </AuthProvider>
    );
  }

  // 4. PUBLIC MARKETING WEBSITE (Header + Content + Footer)
  const renderPublicRoute = () => {
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
      case '/product/client-management':
      case '/product/client-ops':
        return <ClientManagementPage />;
      case '/product/projects':
      case '/product/projects-tasks':
        return <ProjectsPage />;
      case '/product/documents':
      case '/product/documents-reviews':
        return <DocumentsPage />;
      case '/product/reviews-approvals':
      case '/product/delivery-approvals':
        return <ReviewsApprovalsPage />;
      case '/product/ai-workspace':
        return <AIWorkspacePage />;

      /* Solutions */
      case '/solutions':
        return <SolutionsOverviewPage />;
      case '/solutions/agencies':
        return <AgenciesPage />;
      case '/solutions/freelancers':
        return <FreelancersPage />;
      case '/solutions/consultants':
        return <ConsultantsPage />;
      case '/solutions/studios':
        return <StudiosPage />;

      /* Core Navigation */
      case '/integrations':
        return <IntegrationsCatalogPage />;
      case '/integrations/gmail':
        return <GmailIntegrationPage />;
      case '/integrations/google-calendar':
        return <GoogleCalendarIntegrationPage />;
      case '/integrations/google-drive':
        return <GoogleDriveIntegrationPage />;
      case '/integrations/github':
        return <GitHubIntegrationPage />;
      case '/integrations/notion':
        return <NotionIntegrationPage />;
      case '/integrations/linear':
        return <LinearIntegrationPage />;
      case '/pricing':
        return <PricingPage />;
      case '/docs':
      case '/docs/getting-started':
        return <DocsPage />;
      case '/download':
        return <DownloadPage />;

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
        return <NotFoundPage />;
    }
  };

  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--canvas)' }}>
        <SiteHeader currentPath={currentPath} />
        <main style={{ flex: 1 }}>
          <Suspense fallback={<RouteLoadingFallback />}>
            {renderPublicRoute()}
          </Suspense>
        </main>
        <SiteFooter />
      </div>
    </AuthProvider>
  );
};
