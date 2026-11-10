import { createHashRouter } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/pages/HomePage';
import { ListsPage } from '@/pages/lists/ListsPage';
import { BookPage } from '@/pages/lists/BookPage';
import { FolderPage } from '@/pages/lists/FolderPage';
import { ListDetailPage } from '@/pages/lists/ListDetailPage';
import { ListEditorPage } from '@/pages/lists/ListEditorPage';
import { ImportPage } from '@/pages/lists/ImportPage';
import { SharedListPage } from '@/pages/lists/SharedListPage';
import { StarterListPage } from '@/pages/lists/StarterListPage';
import { PracticePage } from '@/pages/PracticePage';
import { SessionPage } from '@/pages/SessionPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { gated } from '@/features/account/PlusGate';

/**
 * Hash-router (#/lijsten): werkt op gratis hosting zoals GitHub Pages,
 * zonder dat de server iets hoeft te weten van onze pagina's.
 */
export const router = createHashRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'lijsten', element: <ListsPage /> },
      { path: 'lijsten/nieuw', element: <ListEditorPage key="nieuw" /> },
      { path: 'lijsten/importeren', element: <ImportPage /> },
      { path: 'lijsten/boek/:key', element: <BookPage /> },
      { path: 'lijsten/map/:id', element: <FolderPage /> },
      { path: 'lijsten/start/:id', element: <StarterListPage /> },
      { path: 'lijsten/:id', element: <ListDetailPage /> },
      { path: 'lijsten/:id/bewerken', element: <ListEditorPage /> },
      { path: 'delen', element: <SharedListPage /> },
      { path: 'oefenen', element: <PracticePage /> },
      { path: 'oefenen/:id', element: <SessionPage /> },
      { path: 'grammatica', lazy: () => import('@/pages/GrammarPage').then((m) => ({ Component: m.GrammarPage })) },
      { path: 'grammatica/:taal', lazy: () => import('@/pages/GrammarPage').then((m) => ({ Component: m.GrammarPage })) },
      { path: 'grammatica/:taal/:onderwerp', lazy: () => import('@/pages/GrammarTopicPage').then((m) => ({ Component: m.GrammarTopicPage })) },
      { path: 'werkwoorden', lazy: () => import('@/pages/VerbsPage').then((m) => ({ Component: () => gated('werkwoorden', <m.VerbsPage />) })) },
      { path: 'werkwoorden/oefenen', lazy: () => import('@/pages/VerbSessionPage').then((m) => ({ Component: () => gated('werkwoorden', <m.VerbSessionPage />) })) },
      { path: 'scannen', lazy: () => import('@/pages/ScanPage').then((m) => ({ Component: () => gated('scannen', <m.ScanPage />) })) },
      { path: 'videos', lazy: () => import('@/pages/VideosPage').then((m) => ({ Component: m.VideosPage })) },
      { path: 'videos/:id', lazy: () => import('@/pages/VideoPage').then((m) => ({ Component: m.VideoPage })) },
      { path: 'planner', lazy: () => import('@/pages/PlannerPage').then((m) => ({ Component: () => gated('planner', <m.PlannerPage />) })) },
      { path: 'statistieken', lazy: () => import('@/pages/StatsPage').then((m) => ({ Component: m.StatsPage })) },
      { path: 'instellingen', element: <SettingsPage /> },
      { path: 'account', lazy: () => import('@/pages/AccountPage').then((m) => ({ Component: m.AccountPage })) },
      { path: 'plus', lazy: () => import('@/pages/PlusPage').then((m) => ({ Component: m.PlusPage })) },
      { path: 'privacy', lazy: () => import('@/pages/PrivacyPage').then((m) => ({ Component: m.PrivacyPage })) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
