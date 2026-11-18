import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { router } from './router';
import './styles/index.css';
import { handleAuthRedirect } from './lib/supabase';
import { startAccountListener } from './features/account/store';
import { heeftEigenGegevens, nieuwAdresVoor, opOudAdres } from './features/verhuizing/verhuizing';

async function start() {
  // Oud adres zonder eigen lijsten: meteen door naar woordwerk.online.
  if (opOudAdres() && !(await heeftEigenGegevens())) {
    location.replace(nieuwAdresVoor());
    return;
  }
  // Eerst een eventuele inlog-link uit een e-mail verwerken, dan de site tonen.
  await handleAuthRedirect().catch(() => {});
  startAccountListener();
  // Gelukt met laden: de beveiliging tegen eindeloos herladen mag weer weg.
  setTimeout(() => sessionStorage.removeItem('woordwerk-herladen'), 5000);
  createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
  );
}
void start();
