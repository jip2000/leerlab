import { AnimatePresence, motion } from 'motion/react';
import { useToasts } from '@/lib/toast';

export function Toaster() {
  const { toasts, dismiss } = useToasts();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+84px)] z-50 flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:pl-64"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-auto flex max-w-sm items-center gap-2 rounded-full bg-ink py-1 pr-1 pl-5 text-[15px] font-semibold text-bg shadow-soft"
          >
            <span className="flex-1 py-2.5 pr-4">{t.text}</span>
            {t.action && (
              <button
                type="button"
                className="h-10 shrink-0 rounded-full px-4 font-bold text-marker hover:bg-white/10"
                onClick={() => {
                  t.action!.run();
                  dismiss(t.id);
                }}
              >
                {t.action.label}
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
