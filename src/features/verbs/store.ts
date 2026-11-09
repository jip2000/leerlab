import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LanguageCode } from '@/data/languages';
import type { VerbMode, VerbQuestion } from './trainer';

interface Choice {
  verbs: string[];
  tenses: string[];
  persons: number[];
}

interface VerbStore {
  lang: LanguageCode;
  mode: VerbMode;
  count: number;
  /** Laatste keuze per taal. */
  choices: Partial<Record<LanguageCode, Choice>>;
  /** De lopende oefening (niet bewaard bij herladen). */
  questions: VerbQuestion[];
  set: (patch: Partial<Omit<VerbStore, 'set' | 'setChoice'>>) => void;
  setChoice: (lang: LanguageCode, c: Partial<Choice>) => void;
}

export const useVerbStore = create<VerbStore>()(
  persist(
    (set, get) => ({
      lang: 'fr',
      mode: 'los',
      count: 15,
      choices: {},
      questions: [],
      set: (patch) => set(patch),
      setChoice: (lang, c) => {
        const cur = get().choices[lang] ?? { verbs: [], tenses: [], persons: [0, 1, 2, 3, 4, 5] };
        set({ choices: { ...get().choices, [lang]: { ...cur, ...c } } });
      },
    }),
    { name: 'woordwerk-werkwoorden', partialize: (s) => ({ lang: s.lang, mode: s.mode, count: s.count, choices: s.choices }) },
  ),
);
