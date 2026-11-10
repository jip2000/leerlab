import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { router } from './router';
import './styles/index.css';
import { handleAuthRedirect } from './lib/supabase';
import { startAccountListener } from './features/account/store';

// Eerst een eventuele inlog-link uit een e-mail verwerken, dan de site tonen.
void handleAuthRedirect().finally(() => {
  startAccountListener();
  createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
  );
});
