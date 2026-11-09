import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeftRight, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { BackLink } from '@/components/ui/BackLink';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Field, Select } from '@/components/ui/Field';
import { LanguageSelect } from '@/components/ui/LanguageSelect';
import { CharBar } from '@/components/ui/CharBar';
import { getLanguage, type LanguageCode } from '@/data/languages';
import { db } from '@/db/db';
import { useFolders } from '@/features/lists/hooks';
import { createList, getWords, saveList, type WordInput } from '@/features/lists/repo';
import { bookSuggestions, levels, years } from '@/features/lists/books';
import { insertAtCursor } from '@/lib/insert';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/cn';

interface Row extends WordInput {
  key: number;
  open: boolean;
}

let rowKey = 1;
const emptyRow = (): Row => ({ key: rowKey++, left: '', right: '', open: false });
const isLang = (v: string | null): v is LanguageCode => !!v && (() => { try { getLanguage(v as LanguageCode); return true; } catch { return false; } })();

export function ListEditorPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const folders = useFolders();
  const usedBooks = useLiveQuery(async () => [...new Set((await db.lists.toArray()).map((l) => l.book?.title).filter(Boolean))] as string[], []);

  const [loaded, setLoaded] = useState(!id);
  const [title, setTitle] = useState('');
  const [langLeft, setLangLeft] = useState<LanguageCode>(isLang(params.get('taal')) ? (params.get('taal') as LanguageCode) : 'fr');
  const [langRight, setLangRight] = useState<LanguageCode>('nl');
  const [bookTitle, setBookTitle] = useState(params.get('boek') ?? '');
  const [year, setYear] = useState(params.get('jaar') ?? '');
  const [level, setLevel] = useState(params.get('niveau') ?? '');
  const [chapter, setChapter] = useState('');
  const [folderId, setFolderId] = useState(params.get('map') ?? '');
  const [tags, setTags] = useState('');
  const [rows, setRows] = useState<Row[]>(() => [emptyRow(), emptyRow(), emptyRow()]);
  const [error, setError] = useState('');
  const [active, setActive] = useState<{ el: HTMLInputElement | HTMLTextAreaElement; lang: LanguageCode } | null>(null);
  const inputs = useRef(new Map<string, HTMLInputElement>());
  const focusNext = useRef<string | null>(null);

  // Bestaande lijst laden bij bewerken.
  useEffect(() => {
    if (!id) return;
    (async () => {
      const list = await db.lists.get(id);
      if (!list) return navigate('/lijsten', { replace: true });
      const words = await getWords(id);
      setTitle(list.title);
      setLangLeft(list.langLeft);
      setLangRight(list.langRight);
      setBookTitle(list.book?.title ?? '');
      setYear(list.book?.year ? String(list.book.year) : '');
      setLevel(list.book?.level ?? '');
      setChapter(list.book?.chapter ?? '');
      setFolderId(list.folderId ?? '');
      setTags(list.tags.join(', '));
      setRows([...words.map((w) => ({ ...w, key: rowKey++, open: false })), emptyRow()]);
      setLoaded(true);
    })();
  }, [id, navigate]);

  // Na het toevoegen van een rij: focus op het nieuwe veld.
  useEffect(() => {
    if (focusNext.current) {
      inputs.current.get(focusNext.current)?.focus();
      focusNext.current = null;
    }
  });

  const suggestions = useMemo(() => {
    const foreign = langLeft === 'nl' ? langRight : langLeft;
    return [...new Set([...(bookSuggestions[foreign] ?? []), ...(usedBooks ?? [])])];
  }, [langLeft, langRight, usedBooks]);

  const update = (key: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const onEnter = (index: number) => {
    if (index === rows.length - 1) {
      const r = emptyRow();
      setRows((rs) => [...rs, r]);
      focusNext.current = `${r.key}-left`;
    } else {
      focusNext.current = `${rows[index + 1]!.key}-left`;
      inputs.current.get(focusNext.current)?.focus();
      focusNext.current = null;
    }
  };

  const track = (lang: LanguageCode) => ({
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => setActive({ el: e.currentTarget, lang }),
  });

  const save = async () => {
    const filled = rows.filter((r) => r.left.trim() || r.right.trim());
    const half = filled.find((r) => !r.left.trim() || !r.right.trim());
    if (!title.trim()) return setError('Geef de lijst een titel.');
    if (filled.length === 0) return setError('Vul minstens één woord met vertaling in.');
    if (half) return setError(`Bij "${half.left || half.right}" mist de andere kant.`);
    setError('');
    const meta = {
      title: title.trim(),
      langLeft,
      langRight,
      folderId: folderId || undefined,
      book: bookTitle.trim()
        ? { title: bookTitle.trim(), year: year ? Number(year) : undefined, level: level || undefined, chapter: chapter.trim() || undefined }
        : undefined,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    const words = filled.map(({ key: _k, open: _o, ...w }) => w);
    if (id) {
      await saveList(id, meta, words);
      toast('Wijzigingen opgeslagen');
      navigate(`/lijsten/${id}`);
    } else {
      const newId = await createList(meta, words);
      toast('Lijst opgeslagen');
      navigate(`/lijsten/${newId}`, { replace: true });
    }
  };

  if (!loaded) return null;
  const filledCount = rows.filter((r) => r.left.trim() && r.right.trim()).length;

  return (
    <>
      <BackLink to={id ? `/lijsten/${id}` : '/lijsten'}>{id ? 'Terug naar de lijst' : 'Mijn lijsten'}</BackLink>
      <PageHeader title={id ? 'Lijst bewerken' : 'Nieuwe lijst'} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
        className="flex flex-col gap-6"
      >
        <section className="grid gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:grid-cols-2">
          <Field label="Titel" className="sm:col-span-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Bijvoorbeeld: Unité 3, woorden A" {...track('nl')} />
          </Field>
          <div className="flex items-end gap-2 sm:col-span-2">
            <Field label="Taal links" className="flex-1">
              <LanguageSelect value={langLeft} onChange={setLangLeft} />
            </Field>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Talen omwisselen"
              onClick={() => {
                setLangLeft(langRight);
                setLangRight(langLeft);
              }}
            >
              <ArrowLeftRight size={18} />
            </Button>
            <Field label="Taal rechts" className="flex-1">
              <LanguageSelect value={langRight} onChange={setLangRight} />
            </Field>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:grid-cols-4">
          <h2 className="col-span-2 font-bold sm:col-span-4">Boek en hoofdstuk</h2>
          <Field label="Boek" className="col-span-2 sm:col-span-4" hint="Zo vind je de lijst terug onder Mijn boeken.">
            <Input list="boek-suggesties" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} placeholder="Naam van je lesmethode" {...track('nl')} />
            <datalist id="boek-suggesties">
              {suggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </Field>
          <Field label="Leerjaar">
            <Select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">–</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Niveau">
            <Select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">–</option>
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Hoofdstuk">
            <Input value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="Bijvoorbeeld: 3" {...track('nl')} />
          </Field>
          <Field label="Map">
            <Select value={folderId} onChange={(e) => setFolderId(e.target.value)}>
              <option value="">Geen map</option>
              {folders?.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tags" className="col-span-2" hint="Scheid met komma's.">
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="toets week 12" {...track('nl')} />
          </Field>
        </section>

        <section>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-bold">Woorden</h2>
            <span className="text-sm text-ink-soft">{filledCount} ingevuld</span>
          </div>
          <p className="mb-3 text-sm text-ink-soft">
            Tab gaat naar het volgende vak, Enter maakt een nieuwe rij. Meerdere goede antwoorden scheid je met ; of /. Wat tussen haakjes
            staat, mag je bij het overhoren weglaten.
          </p>
          <div className="mb-1 hidden grid-cols-[1fr_1fr_88px] gap-2 px-1 text-sm font-semibold text-ink-soft sm:grid">
            <span>{getLanguage(langLeft).name}</span>
            <span>{getLanguage(langRight).name}</span>
          </div>
          <ol className="flex flex-col gap-2">
            {rows.map((r, i) => (
              <li key={r.key} className="rounded-2xl border border-line bg-surface p-2">
                <div className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_1fr_88px]">
                  <Input
                    ref={(el) => {
                      if (el) inputs.current.set(`${r.key}-left`, el);
                      else inputs.current.delete(`${r.key}-left`);
                    }}
                    aria-label={`Woord ${i + 1}, ${getLanguage(langLeft).name}`}
                    lang={langLeft}
                    value={r.left}
                    onChange={(e) => update(r.key, { left: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        inputs.current.get(`${r.key}-right`)?.focus();
                      }
                    }}
                    {...track(langLeft)}
                  />
                  <div className="row-span-2 flex flex-col gap-1 sm:row-span-1 sm:col-start-3 sm:flex-row">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={r.open ? 'Minder velden' : 'Meer velden: lidwoord, voorbeeldzin…'}
                      aria-expanded={r.open}
                      onClick={() => update(r.key, { open: !r.open })}
                    >
                      <ChevronDown size={18} className={cn('transition-transform', r.open && 'rotate-180')} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Rij ${i + 1} verwijderen`}
                      onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((x) => x.key !== r.key) : [emptyRow()]))}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                  <Input
                    ref={(el) => {
                      if (el) inputs.current.set(`${r.key}-right`, el);
                      else inputs.current.delete(`${r.key}-right`);
                    }}
                    aria-label={`Woord ${i + 1}, ${getLanguage(langRight).name}`}
                    lang={langRight}
                    value={r.right}
                    onChange={(e) => update(r.key, { right: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        onEnter(i);
                      }
                    }}
                    className="sm:col-start-2 sm:row-start-1"
                    {...track(langRight)}
                  />
                </div>
                {r.open && (
                  <div className="mt-2 grid gap-2 border-t border-line pt-3 sm:grid-cols-2">
                    <Field label="Lidwoord of geslacht (bij links)">
                      <Input value={r.article ?? ''} onChange={(e) => update(r.key, { article: e.target.value })} placeholder="la, der, de…" {...track(langLeft)} />
                    </Field>
                    <Field label="Meervoud of extra vormen">
                      <Input value={r.extraForms ?? ''} onChange={(e) => update(r.key, { extraForms: e.target.value })} placeholder="rosa, rosae, f." {...track(langLeft)} />
                    </Field>
                    <Field label="Voorbeeldzin">
                      <Input value={r.example ?? ''} onChange={(e) => update(r.key, { example: e.target.value })} {...track(langLeft)} />
                    </Field>
                    <Field label="Notitie of ezelsbruggetje">
                      <Input value={r.note ?? ''} onChange={(e) => update(r.key, { note: e.target.value })} {...track('nl')} />
                    </Field>
                  </div>
                )}
              </li>
            ))}
          </ol>
          <Button
            variant="secondary"
            className="mt-3"
            icon={<Plus size={18} aria-hidden="true" />}
            onClick={() => {
              const r = emptyRow();
              setRows((rs) => [...rs, r]);
              focusNext.current = `${r.key}-left`;
            }}
          >
            Rij toevoegen
          </Button>
        </section>

        <div className="above-tabbar sticky z-10 -mx-4 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {active && document.contains(active.el) && (
            <CharBar lang={active.lang} onPick={(c) => insertAtCursor(active.el, c)} className="mb-2" />
          )}
          {error && (
            <p role="alert" className="mb-2 font-semibold text-danger">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <Button type="submit" size="lg">
              {id ? 'Wijzigingen opslaan' : 'Lijst opslaan'}
            </Button>
            <Button variant="ghost" size="lg" onClick={() => navigate(-1)}>
              Annuleren
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
