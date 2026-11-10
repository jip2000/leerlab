import { useLocation, useOutlet } from 'react-router';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { checkQuietBadges, getProfile, reconcileStreak } from '@/features/progress/repo';
import { updateAppBadge } from '@/lib/appBadge';
import { celebrate } from '@/lib/confetti';
import { toast } from '@/lib/toast';
import { trackPage } from '@/lib/analytics';
import { useSync } from '@/features/account/useSync';
import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TabBar } from './TabBar';
import { TopBar } from './TopBar';
import { useApplyTheme } from '@/lib/theme';
import { useTypingAttribute } from '@/lib/typing';
import { navItems } from './nav';
import { Toaster } from '@/components/ui/Toaster';
import { TutorChat } from '@/features/tutor/TutorChat';

/** Het "frame" om elke pagina: zijbalk, bovenbalk, tabbalk en een zachte overgang. */
export function AppShell() {
  useApplyTheme();
  useTypingAttribute();
  useSync();
  const location = useLocation();
  const outlet = useOutlet();
  const reduce = useReducedMotion();

  // Bij het openen: gemiste dag bevriezen (als dat kan) en de streak op het app-icoon zetten.
  useEffect(() => {
    void (async () => {
      const frozen = await reconcileStreak();
      if (frozen > 0) toast(`🧊 Je bevriezer heeft je streak gered!`);
      void updateAppBadge((await getProfile()).streak.count);
    })();
  }, []);

  // Badges die je zonder oefenen haalt, zoals "Eerste lijst".
  const listCount = useLiveQuery(() => db.lists.count(), []);
  useEffect(() => {
    if (!listCount) return;
    void checkQuietBadges().then((badges) => {
      if (badges.length === 0) return;
      const [b] = badges;
      toast(badges.length === 1 ? `${b!.emoji} Nieuwe badge: ${b!.title}` : `🎉 ${badges.length} nieuwe badges! Bekijk ze bij Statistieken.`);
      celebrate();
    });
  }, [listCount]);

  // Paginatitel bijwerken en naar boven scrollen bij wisselen van pagina.
  useEffect(() => {
    const item = navItems.find((i) => (i.path === '/' ? location.pathname === '/' : location.pathname.startsWith(i.path)));
    document.title = item && item.path !== '/' ? `${item.label} – Woordwerk` : 'Woordwerk';
    window.scrollTo(0, 0);
    trackPage(location.pathname);
  }, [location.pathname]);

  return (
    <MotionConfig reducedMotion="user">
    <div className="flex min-h-dvh">
      <a
        href="#inhoud"
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Naar inhoud
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main
          id="inhoud"
          className="mx-auto w-full max-w-5xl flex-1 px-4 pt-5 pb-[calc(env(safe-area-inset-bottom)+96px)] sm:px-6 lg:px-8 lg:pt-2 lg:pb-12"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <TabBar />
      <TutorChat />
      <Toaster />
    </div>
    </MotionConfig>
  );
}
