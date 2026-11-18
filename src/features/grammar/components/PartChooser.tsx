import { useSettings } from '@/lib/settings';
import type { TopicContent } from '../types';
import { partKey, selectedParts } from '../parts';
import { ChoiceChips } from './CaseChooser';

/** Kies welke onderdelen van een onderwerp je wilt, bijv. alleen de wisselvoorzetsels. */
export function PartChooser({ lang, topic, className }: { lang: string; topic: TopicContent; className?: string }) {
  const saved = useSettings((s) => s.onderdelen);
  const update = useSettings((s) => s.update);
  if (!topic.parts?.length) return null;
  const key = partKey(lang, topic.id);
  return (
    <ChoiceChips
      className={className}
      title="Wat wil je leren?"
      intro="Klik uit wat je niet nodig hebt."
      label="Onderdelen"
      items={topic.parts}
      on={selectedParts(topic, saved[key])}
      onChange={(ids) => update({ onderdelen: { ...saved, [key]: ids } })}
    />
  );
}
