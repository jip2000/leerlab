import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LanguageCode } from '@/data/languages';
import type { VerbMode, VerbQuestion } from './trainer';
import type { Level } from './levels';
import type { MixItem } from '@/features/grammar/mix';

interface Choice {
  verbs: string[];
  tenses: string[];
  persons: number[];
  /** Wat je wilt oefenen: 'werkwoorden' en/of grammatica-onderwerpen (id's). */
  topics?: string[];
}

interface VerbStore {
  lang: LanguageCode;
  mode: VerbMode;
  count: number;
  /** Moeilijkheid van de zinnen bij "In een zin". */
  level: Level;
  /** Laatste keuze per taal. */
  choices: Partial<Record<LanguageCode, Choice>>;
  /** De lopende oefening (niet bewaard bij herladen). */
  questions: VerbQuestion[];
  /** Lopende gemixte ronde (werkwoorden + grammatica), niet bewaard bij herladen. */
  mix: MixItem[];
  /** Voor welke taal de gemixte ronde gemaakt is. */
  mixLang?: LanguageCode;
  set: (patch: Partial<Omit<VerbStore, 'set' | 'setChoice'>>) => void;
  setChoice: (lang: LanguageCode, c: Partial<Choice>) => void;
}

export const useVerbStore = create<VerbStore>()(
  persist(
    (set, get) => ({
      lang: 'fr',
      mode: 'los',
      count: 15,
      level: 1,
      choices: {},
      questions: [],
      mix: [],
      set: (patch) => set(patch),
      setChoice: (lang, c) => {
        const cur = get().choices[lang] ?? { verbs: [], tenses: [], persons: [0, 1, 2, 3, 4, 5] };
        set({ choices: { ...get().choices, [lang]: { ...cur, ...c } } });
      },
    }),
    {
      name: 'woordwerk-werkwoorden',
      // Versie 3: je kiest eerst zelf de tijd(en); alle werkwoorden staan standaard aan.
      version: 3,
      migrate: (old) => ({ ...(old as object), choices: {} }) as unknown as VerbStore,
      partialize: (s) => ({ lang: s.lang, mode: s.mode, count: s.count, level: s.level, choices: s.choices }),
    },
  ),
);
