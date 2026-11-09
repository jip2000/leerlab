import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { PageHeader } from '@/components/ui/PageHeader';
import { BackLink } from '@/components/ui/BackLink';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Field, Select } from '@/components/ui/Field';
import { LanguageSelect } from '@/components/ui/LanguageSelect';
import type { LanguageCode } from '@/data/languages';
import { useList, useLists } from '@/features/lists/hooks';
import { createList, getWords, saveList, type WordInput } from '@/features/lists/repo';
import { WordTable } from '@/features/lists/components/WordTable';
import { parsePasted, separatorLabels, type Separator } from '@/lib/parse';
import { parseCsv } from '@/lib/csv';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/cn';

type Tab = 'plakken' | 'csv';

export function ImportPage() {
  const [params] = useSearchParams();
  const targetId = params.get('lijst') ?? undefined;
  const target = useList(targetId);
  const lists = useLists();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>('plakken');
  const [text, setText] = useState('');
  const [sep, setSep] = useState<Separator | 'auto'>('auto');
  const [csvRows, setCsvRows] = useState<WordInput[]>([]);
  const [csvName, setCsvName] = useState('');
  const [title, setTitle] = useState('');
  const [langLeft, setLangLeft] = useState<LanguageCode>('fr');
  const [langRight, setLangRight] = useState<LanguageCode>('nl');
  const [into, setInto] = useState<string>(targetId ?? '');
  const [error, setError] = useState('');

  const parsed = useMemo(() => parsePasted(text, sep === 'auto' ? undefined : sep), [text, sep]);
  const words: WordInput[] = tab === 'plakken' ? parsed.pairs : csvRows;
  const intoList = lists?.find((l) => l.id === into);

  const submit = async () => {
    if (words.length === 0) return setError('Er zijn nog geen woorden gevonden.');
    if (into) {
      const existing = await getWords(into);
      await saveList(into, {}, [...existing, ...words]);
      toast(`${words.length} woorden toegevoegd`);
      navigate(`/lijsten/${into}`);
    } else {
      if (!title.trim()) return setError('Geef de nieuwe lijst een titel.');
      const id = await createList({ title: title.trim(), langLeft, langRight, tags: [] }, words);
      toast('Lijst opgeslagen');
      navigate(`/lijsten/${id}`);
    }
  };

  return (
    <>
      <BackLink to={targetId ? `/lijsten/${targetId}` : '/lijsten'}>{target ? target.title : 'Mijn lijsten'}</BackLink>
      <PageHeader title="Woorden importeren" intro="Plak tekst uit een document of Excel, of kies een CSV-bestand." />

      <div role="tablist" aria-label="Manier van importeren" className="mb-4 inline-flex rounded-2xl bg-surface-2 p-1">
        {(['plakken', 'csv'] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn('h-11 rounded-xl px-5 font-semibold', tab === t ? 'bg-surface text-ink shadow-soft' : 'text-ink-soft')}
          >
            {t === 'plakken' ? 'Tekst plakken' : 'CSV-bestand'}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          {tab === 'plakken' ? (
            <>
              <Field label="Plak hier je woorden, één paar per regel">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={10}
                  placeholder={'la maison = het huis\nle chien = de hond\nl\'école = de school'}
                  className="w-full rounded-[var(--radius-control)] border border-line bg-surface p-3.5 text-[15px] text-ink placeholder:text-ink-soft focus-visible:border-primary"
                />
              </Field>
              <Field label="Scheidingsteken">
                <Select value={sep} onChange={(e) => setSep(e.target.value as Separator | 'auto')}>
                  <option value="auto">
                    Automatisch{parsed.separator && sep === 'auto' ? `: ${separatorLabels[parsed.separator]}` : ''}
                  </option>
                  {(Object.keys(separatorLabels) as Separator[]).map((s) => (
                    <option key={s} value={s}>
                      {separatorLabels[s]}
                    </option>
                  ))}
                </Select>
              </Field>
            </>
          ) : (
            <Field label="CSV-bestand" hint="Kolommen: links, rechts, en eventueel lidwoord, extra vormen, voorbeeldzin, notitie.">
              <input
                type="file"
                accept=".csv,text/csv"
                className="block w-full text-sm file:mr-3 file:h-11 file:rounded-xl file:border-0 file:bg-primary file:px-4 file:font-semibold file:text-on-primary"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setCsvName(file.name);
                  setCsvRows(parseCsv(await file.text()));
                  if (!title) setTitle(file.name.replace(/\.csv$/i, ''));
                }}
              />
            </Field>
          )}

          <section className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5">
            <Field label="Opslaan in">
              <Select value={into} onChange={(e) => setInto(e.target.value)}>
                <option value="">Een nieuwe lijst</option>
                {lists?.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </Select>
            </Field>
            {!into && (
              <>
                <Field label="Titel van de nieuwe lijst">
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Bijvoorbeeld: Unité 3" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Taal links">
                    <LanguageSelect value={langLeft} onChange={setLangLeft} />
                  </Field>
                  <Field label="Taal rechts">
                    <LanguageSelect value={langRight} onChange={setLangRight} />
                  </Field>
                </div>
              </>
            )}
            {error && (
              <p role="alert" className="font-semibold text-danger">
                {error}
              </p>
            )}
            <Button size="lg" onClick={() => void submit()} disabled={words.length === 0}>
              {into ? `${words.length} woorden toevoegen aan ${intoList?.title ?? 'lijst'}` : `Lijst opslaan met ${words.length} woorden`}
            </Button>
          </section>
        </div>

        <div>
          <h2 className="mb-2 font-bold">Voorbeeld</h2>
          {words.length === 0 ? (
            <p className="text-ink-soft">{tab === 'csv' && csvName ? `Geen woorden gevonden in ${csvName}.` : 'Hier zie je wat Woordwerk herkent.'}</p>
          ) : (
            <>
              <p className="mb-2 text-sm text-ink-soft">{words.length} woordparen gevonden.</p>
              <WordTable words={words.slice(0, 100)} langLeft={intoList?.langLeft ?? langLeft} langRight={intoList?.langRight ?? langRight} />
            </>
          )}
          {tab === 'plakken' && parsed.skipped.length > 0 && (
            <div className="mt-3 rounded-2xl bg-marker/30 p-3 text-sm">
              <p className="font-semibold">Deze regels zijn overgeslagen (geen scheidingsteken gevonden):</p>
              <ul className="mt-1 list-inside list-disc">
                {parsed.skipped.slice(0, 8).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
