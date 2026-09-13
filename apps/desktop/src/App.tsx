/**
 * CoreDesk application root.
 *
 * Composes the store, the overlay host, the shell, startup transition, and route table.
 * Routes follow the IA page of the design file; the guest surface is deliberately a
 * separate tree from the owner workspace, and guests never inherit owner navigation.
 */

import { useCallback, useEffect, useState, type ReactNode } from 'react';

import { useRoute, navigate, type RouteInfo } from './app/router';
import { GuestShell, NotFound, Shell, OWNER_ROOTS, type Crumb } from './app/Shell';
import { useStore } from './state/store';
import { OverlayProvider, useOverlay } from './ui/overlay';
import { authService } from './app/authService';
import {
  loadStoredWorkspaceContext,
  resolveSafeWorkspaceRoute,
} from './app/workspaceContext';
import { StartupOverlay } from './components/StartupOverlay';

import { HomeScreen } from './screens/HomeScreen';
import { FirstRunScreen } from './screens/FirstRunScreen';
import { TasksScreen } from './screens/TasksScreen';
import { ClientsScreen } from './screens/ClientsScreen';
import { ClientDetailScreen } from './screens/ClientDetailScreen';
import { ProjectsScreen } from './screens/ProjectsScreen';
import { ProjectWorkspaceScreen } from './screens/ProjectWorkspaceScreen';
import { DocumentsScreen } from './screens/DocumentsScreen';
import { DocumentWorkspaceScreen } from './screens/DocumentWorkspaceScreen';
import { OwnerGuestPreviewWorkspace } from './screens/OwnerGuestPreviewWorkspace';
import { ActivityScreen } from './screens/ActivityScreen';
import { ArchiveScreen } from './screens/ArchiveScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { CreateProjectScreen } from './screens/CreateProjectScreen';
import { ShareSetupScreen } from './screens/ShareSetupScreen';
import { AuthScreen } from './screens/AuthScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { LegalScreen } from './screens/LegalScreen';
import { GuestInviteScreen } from './screens/guest/GuestInviteScreen';
import { GuestSharedScreen } from './screens/guest/GuestSharedScreen';
import { GuestReviewScreen } from './screens/guest/GuestReviewScreen';
import { GuestDeliveryScreen } from './screens/guest/GuestDeliveryScreen';
import { GuestNoticeScreen } from './screens/guest/GuestNoticeScreen';

import { TaskPanel } from './components/TaskPanel';
import { SearchPalette } from './components/SearchPalette';
import { ModalHost } from './components/ModalHost';

interface ScreenResult {
  active: string | null;
  crumbs: Crumb[] | null;
  element: ReactNode;
  /** Screens that manage their own full-height layout (document workspace). */
  flush?: boolean;
  guest?: boolean;
  /** Public entry surfaces that own the whole viewport — no shell chrome. */
  bare?: boolean;
}

function resolve(route: RouteInfo): ScreenResult {
  const { segments, params, query } = route;
  const root = segments[0] ?? 'home';

  switch (root) {
    case 'home':
      return { active: 'home', crumbs: [{ label: 'Home' }], element: <HomeScreen /> };

    case 'first-run':
      return { active: 'home', crumbs: [{ label: 'Home' }], element: <FirstRunScreen /> };

    case 'tasks':
      return { active: 'tasks', crumbs: [{ label: 'Tasks' }], element: <TasksScreen /> };

    case 'clients':
      return params.client
        ? {
            active: 'clients',
            crumbs: [{ label: 'Clients', href: '#/clients' }, { label: '' }],
            element: <ClientDetailScreen clientId={params.client} />,
          }
        : { active: 'clients', crumbs: [{ label: 'Clients' }], element: <ClientsScreen /> };

    case 'projects':
      return params.project
        ? {
            active: 'projects',
            crumbs: [{ label: 'Projects', href: '#/projects' }, { label: '' }],
            element: <ProjectWorkspaceScreen projectId={params.project} tab={query.get('tab')} />,
          }
        : { active: 'projects', crumbs: [{ label: 'Projects' }], element: <ProjectsScreen /> };

    case 'documents':
      if (params.document) {
        if (query.get('view') === 'guest-preview') {
          return {
            active: 'documents',
            crumbs: [{ label: 'Documents', href: '#/documents' }, { label: '' }, { label: 'Guest Preview' }],
            element: (
              <OwnerGuestPreviewWorkspace
                documentId={params.document}
                reviewId={query.get('review') ?? undefined}
              />
            ),
            flush: true,
          };
        }
        return {
          active: 'documents',
          crumbs: [{ label: 'Documents', href: '#/documents' }, { label: '' }],
          element: <DocumentWorkspaceScreen documentId={params.document} view={query.get('view')} />,
          flush: true,
        };
      }
      return { active: 'documents', crumbs: [{ label: 'Documents' }], element: <DocumentsScreen /> };

    case 'preview': {
      const reviewId = query.get('id') || query.get('review') || params.previewId;
      return {
        active: 'documents',
        crumbs: [{ label: 'Documents', href: '#/documents' }, { label: 'Guest Preview' }],
        element: <OwnerGuestPreviewWorkspace reviewId={reviewId ?? undefined} />,
        flush: true,
      };
    }

    case 'activity':
      return { active: 'activity', crumbs: [{ label: 'Activity' }], element: <ActivityScreen /> };

    case 'archive':
      return { active: 'archive', crumbs: [{ label: 'Archive' }], element: <ArchiveScreen /> };

    case 'settings':
      return {
        active: 'settings',
        crumbs: [{ label: 'Settings' }],
        element: <SettingsScreen section={params.section ?? 'account'} />,
      };

    case 'new-project':
      return {
        active: 'projects',
        crumbs: [{ label: 'Projects', href: '#/projects' }, { label: 'New project' }],
        element: <CreateProjectScreen preselectedClientId={query.get('client') ?? undefined} />,
      };

    case 'share':
      return {
        active: 'documents',
        crumbs: [{ label: 'Documents', href: '#/documents' }, { label: 'Review & share setup' }],
        element: <ShareSetupScreen documentId={query.get('document') ?? undefined} />,
      };

    case 'auth':
    case 'signin':
      return {
        active: null,
        crumbs: null,
        element: (
          <AuthScreen
            state={query.get('state')}
            token={query.get('token') || query.get('session')}
            initialMode="signin"
          />
        ),
        bare: true,
      };

    case 'signup':
      return {
        active: null,
        crumbs: null,
        element: <AuthScreen initialMode="signup" />,
        bare: true,
      };

    case 'onboarding':
      return { active: null, crumbs: null, element: <OnboardingScreen />, guest: true };

    case 'terms':
      return { active: null, crumbs: null, element: <LegalScreen kind="terms" />, guest: true };

    case 'privacy':
      return { active: null, crumbs: null, element: <LegalScreen kind="privacy" />, guest: true };

    case 'guest': {
      const which = params.guest ?? 'invite';
      const reviewId = query.get('id') ?? query.get('review') ?? undefined;
      const element =
        which === 'invite' ? <GuestInviteScreen />
        : which === 'shared' ? <GuestSharedScreen />
        : which === 'review' ? <GuestReviewScreen reviewId={reviewId} />
        : which === 'delivery' ? <GuestDeliveryScreen />
        : <GuestNoticeScreen kind={which} />;
      return { active: null, crumbs: null, element, guest: true };
    }

    default:
      return {
        active: OWNER_ROOTS.has(root) ? root : null,
        crumbs: [{ label: 'Not found' }],
        element: <NotFound kind="page" onHome={() => { window.location.hash = '#/home'; }} />,
      };
  }
}

/** Fills in the trailing breadcrumb label from the resolved record. */
function useCrumbs(route: RouteInfo, crumbs: Crumb[] | null): Crumb[] | null {
  const { derived } = useStore();
  if (!crumbs) return null;
  const last = crumbs[crumbs.length - 1];
  if (last.label !== '') return crumbs;

  const { client, project, document } = route.params;
  let label = 'Record';
  if (document) label = derived.documentById(document)?.title ?? 'Unknown document';
  else if (project) label = derived.projectById(project)?.name ?? 'Unknown project';
  else if (client) label = derived.clientById(client)?.name ?? 'Unknown client';

  return [...crumbs.slice(0, -1), { label }];
}

export default function App() {
  const { state } = useStore();
  const route = useRoute();
  const screen = resolve(route);
  const crumbs = useCrumbs(route, screen.crumbs);

  const [showStartup, setShowStartup] = useState(true);
  const [startupReady, setStartupReady] = useState(false);
  const [startupError, setStartupError] = useState<string | null>(null);

  const resolveStartup = useCallback(async () => {
    setStartupError(null);
    try {
      const root = route.segments[0] ?? 'home';
      // Bypass authentication check for standalone public guest & legal pages
      if (root === 'guest' || root === 'terms' || root === 'privacy') {
        setStartupReady(true);
        return;
      }

      const session = await authService.getSession();
      const currentHash = window.location.hash || '';
      const isBareLaunch = !currentHash || currentHash === '#/' || currentHash === '#' || currentHash === '#/home';
      const isAuthRoute =
        currentHash.startsWith('#/auth') ||
        currentHash.startsWith('#/signin') ||
        currentHash.startsWith('#/signup');

      if (session) {
        // Authenticated: on bare launch, restore last safe workspace context
        if (isBareLaunch) {
          const storedContext = loadStoredWorkspaceContext();
          const targetRoute = resolveSafeWorkspaceRoute(storedContext, {
            clients: state.clients,
            projects: state.projects,
            documents: state.documents,
          });
          if (targetRoute !== '#/home' || currentHash !== '#/home') {
            navigate(targetRoute);
          }
        }
      } else {
        // Unauthenticated: redirect to auth unless already on an auth screen
        if (!isAuthRoute) {
          navigate('#/auth');
        }
      }
      setStartupReady(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to initialize session';
      setStartupError(msg);
    }
  }, [route.segments, state.clients, state.projects, state.documents]);

  useEffect(() => {
    resolveStartup();
  }, [resolveStartup]);

  return (
    <>
      {showStartup && (
        <StartupOverlay
          ready={startupReady}
          error={startupError}
          onRetry={resolveStartup}
          onComplete={() => setShowStartup(false)}
        />
      )}

      <OverlayProvider
        renderPanel={(taskId) => <TaskPanel taskId={taskId} />}
        renderModal={(kind, id) => <ModalHost kind={kind} id={id} />}
        renderSearch={() => <SearchPalette />}
      >
        {screen.bare ? (
          screen.element
        ) : screen.guest ? (
          <GuestShell>{screen.element}</GuestShell>
        ) : (
          <ShellFrame activeId={screen.active} crumbs={crumbs} flush={screen.flush}>
            {screen.element}
          </ShellFrame>
        )}
      </OverlayProvider>
    </>
  );
}

/** Connects the shell's search trigger to the overlay API. */
function ShellFrame({
  activeId,
  crumbs,
  flush,
  children,
}: {
  activeId: string | null;
  crumbs: Crumb[] | null;
  flush?: boolean;
  children: ReactNode;
}) {
  const overlay = useOverlay();
  return (
    <Shell activeId={activeId} crumbs={crumbs} flush={flush} onOpenSearch={overlay.openSearch}>
      {children}
    </Shell>
  );
}
