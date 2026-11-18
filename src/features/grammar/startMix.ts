/**
 * Een gemixte ronde maken uit wat je op de taalpagina hebt gekozen
 * (gebruikt door de Start-knop en door "Nog een ronde").
 */
import type { LanguageCode } from '@/data/languages';
import { getTopic } from '@/data/grammar';
import { useVerbStore } from '@/features/verbs/store';
import { loadStats } from '@/features/verbs/trainer';
import { useSettings } from '@/lib/settings';
import { selectedCases } from './cases';
import { partKey, selectedParts } from './parts';
import { buildMix, validTopic, type MixItem } from './mix';

export async function prepareMix(lang: LanguageCode): Promise<MixItem[]> {
  const s = useVerbStore.getState();
  const st = useSettings.getState();
  const choice = s.choices[lang] ?? { verbs: [], tenses: [], persons: [0, 1, 2, 3, 4, 5] };
  return buildMix({
    lang,
    topics: (choice.topics ?? []).filter((id) => validTopic(lang, id)),
    tenses: choice.tenses,
    verbs: choice.verbs,
    persons: choice.persons,
    mode: s.mode,
    level: s.level,
    count: s.count,
    cases: selectedCases(lang, st.naamvallen),
    parts: (id) => {
      const t = getTopic(lang, id);
      return t ? selectedParts(t, st.onderdelen[partKey(lang, id)]) : new Set<string>();
    },
    stats: await loadStats(lang),
  });
}
