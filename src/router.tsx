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
import { GrammarPage } from '@/pages/GrammarPage';
import { GrammarTopicPage } from '@/pages/GrammarTopicPage';
import { VerbsPage } from '@/pages/VerbsPage';
import { VerbSessionPage } from '@/pages/VerbSessionPage';
import { ScanPage } from '@/pages/ScanPage';
import { VideosPage } from '@/pages/VideosPage';
import { VideoPage } from '@/pages/VideoPage';
import { PlannerPage } from '@/pages/PlannerPage';
import { StatsPage } from '@/pages/StatsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

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
      { path: 'grammatica', element: <GrammarPage /> },
      { path: 'grammatica/:taal', element: <GrammarPage /> },
      { path: 'grammatica/:taal/:onderwerp', element: <GrammarTopicPage /> },
      { path: 'werkwoorden', element: <VerbsPage /> },
      { path: 'werkwoorden/oefenen', element: <VerbSessionPage /> },
      { path: 'scannen', element: <ScanPage /> },
      { path: 'videos', element: <VideosPage /> },
      { path: 'videos/:id', element: <VideoPage /> },
      { path: 'planner', element: <PlannerPage /> },
      { path: 'statistieken', element: <StatsPage /> },
      { path: 'instellingen', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
