import { createHashRouter } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/pages/HomePage';
import { ListsPage } from '@/pages/ListsPage';
import { PracticePage } from '@/pages/PracticePage';
import { GrammarPage } from '@/pages/GrammarPage';
import { VerbsPage } from '@/pages/VerbsPage';
import { ScanPage } from '@/pages/ScanPage';
import { VideosPage } from '@/pages/VideosPage';
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
      { path: 'oefenen', element: <PracticePage /> },
      { path: 'grammatica', element: <GrammarPage /> },
      { path: 'grammatica/:taal', element: <GrammarPage /> },
      { path: 'werkwoorden', element: <VerbsPage /> },
      { path: 'scannen', element: <ScanPage /> },
      { path: 'videos', element: <VideosPage /> },
      { path: 'planner', element: <PlannerPage /> },
      { path: 'statistieken', element: <StatsPage /> },
      { path: 'instellingen', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
