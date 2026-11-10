import { useEffect, useRef } from 'react';
import { useAccount } from './store';
import { pushIfChanged, syncOnLogin } from './sync';
import { toast } from '@/lib/toast';

/** Synchroniseert automatisch zolang je bent ingelogd. */
export function useSync() {
  const userId = useAccount((s) => s.session?.user.id);
  const conflict = useAccount((s) => s.conflict);
  const started = useRef<string | null>(null);

  // Bij inloggen: ophalen, opsturen of laten kiezen.
  useEffect(() => {
    if (!userId || started.current === userId) return;
    started.current = userId;
    void syncOnLogin(userId)
      .then(({ result, cloudData }) => {
        if (result === 'opgehaald') toast('Je lijsten en voortgang zijn opgehaald uit je account');
        if (result === 'kiezen') {
          useAccount.getState().setConflict(cloudData!);
          toast('Kies bij Account welke gegevens je wilt houden');
        }
      })
      .catch(() => toast('Synchroniseren lukte niet. We proberen het later opnieuw.'));
  }, [userId]);

  // Daarna: elke minuut en bij het wegklikken opsturen wat veranderd is.
  useEffect(() => {
    if (!userId || conflict) return;
    const push = () => void pushIfChanged(userId).catch(() => {});
    const t = setInterval(() => document.visibilityState === 'visible' && push(), 60_000);
    const onHide = () => document.visibilityState === 'hidden' && push();
    document.addEventListener('visibilitychange', onHide);
    return () => {
      clearInterval(t);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [userId, conflict]);
}
