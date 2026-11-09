import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { CircleCheck, Plus, SquarePlay } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Field, Select } from '@/components/ui/Field';
import { db, newId } from '@/db/db';
import { languages } from '@/data/languages';
import { grammar } from '@/data/grammar';
import { useLists } from '@/features/lists/hooks';
import { youtubeId } from '@/features/videos/youtube';
import { toast } from '@/lib/toast';

const SUBJECTS = ['Wiskunde', 'Natuurkunde', 'Scheikunde', 'Biologie', 'Geschiedenis', 'Aardrijkskunde', 'Economie', ...languages.map((l) => l.name)];

export function VideosPage() {
  const videos = useLiveQuery(() => db.videos.toArray(), []);
  const lists = useLists();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ url: '', title: '', subject: '', chapter: '', link: '' });
  const [error, setError] = useState('');

  const groups = useMemo(() => {
    const m = new Map<string, typeof videos>();
    for (const v of videos ?? []) m.set(v.subject || 'Overig', [...(m.get(v.subject || 'Overig') ?? []), v]);
    return [...m.entries()].sort(([a], [b]) => a.localeCompare(b, 'nl'));
  }, [videos]);

  const topics = Object.entries(grammar).flatMap(([lang, ts]) =>
    ts!.map((t) => ({ id: `${lang}:${t.id}`, label: `${languages.find((l) => l.code === lang)!.name}: ${languages.find((l) => l.code === lang)!.grammarTopics.find((x) => x.id === t.id)?.title}` })),
  );

  const save = async () => {
    const id = youtubeId(form.url);
    if (!id) return setError('Dit lijkt geen YouTube-link. Plak de link van de video (bijvoorbeeld https://youtu.be/…).');
    if (!form.title.trim()) return setError('Geef de video een titel.');
    const [kind, ...rest] = form.link.split('|');
    await db.videos.add({
      id: newId(),
      url: form.url.trim(),
      title: form.title.trim(),
      subject: form.subject.trim(),
      chapter: form.chapter.trim() || undefined,
      notes: [],
      watched: false,
      linkedTo: form.link ? [{ kind: kind as 'list' | 'grammar', id: rest.join('|') }] : [],
    });
    setForm({ url: '', title: '', subject: form.subject, chapter: '', link: '' });
    setAdding(false);
    setError('');
    toast('Video toegevoegd');
  };

  if (!videos || !lists) return null;

  return (
    <>
      <PageHeader
        title="Video's"
        intro="Uitlegvideo's per vak en hoofdstuk, met je eigen aantekeningen."
        actions={!adding && <Button icon={<Plus size={18} aria-hidden="true" />} onClick={() => setAdding(true)}>Video toevoegen</Button>}
      />

      {adding && (
        <form className="mb-6 grid gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); void save(); }}>
          <Field label="YouTube-link" className="sm:col-span-2">
            <Input autoFocus value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" inputMode="url" />
          </Field>
          <Field label="Titel" className="sm:col-span-2">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Bijvoorbeeld: Uitleg subjonctif" />
          </Field>
          <Field label="Vak">
            <Input list="vakken" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Frans, Wiskunde…" />
            <datalist id="vakken">{SUBJECTS.map((s) => <option key={s} value={s} />)}</datalist>
          </Field>
          <Field label="Hoofdstuk">
            <Input value={form.chapter} onChange={(e) => setForm({ ...form, chapter: e.target.value })} placeholder="Bijvoorbeeld: 3" />
          </Field>
          <Field label="Koppelen aan (zichtbaar bij de lijst of het onderwerp)" className="sm:col-span-2">
            <Select value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })}>
              <option value="">Niets</option>
              <optgroup label="Woordenlijsten">{lists.map((l) => <option key={l.id} value={`list|${l.id}`}>{l.title}</option>)}</optgroup>
              <optgroup label="Grammatica">{topics.map((t) => <option key={t.id} value={`grammar|${t.id}`}>{t.label}</option>)}</optgroup>
            </Select>
          </Field>
          {error && <p role="alert" className="font-semibold text-danger sm:col-span-2">{error}</p>}
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit">Toevoegen</Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>Annuleren</Button>
          </div>
        </form>
      )}

      {videos.length === 0 && !adding ? (
        <EmptyState
          icon={<SquarePlay size={24} />}
          title="Nog geen video's"
          text="Plak de link van een YouTube-video, bijvoorbeeld een uitleg over een wiskundehoofdstuk of de subjonctif. De video speelt in Woordwerk, naast je aantekeningen."
          action={<Button onClick={() => setAdding(true)}>Video toevoegen</Button>}
        />
      ) : (
        groups.map(([subject, vs]) => (
          <section key={subject} className="mb-7">
            <h2 className="mb-3 text-xl font-extrabold">{subject}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {vs!.sort((a, b) => (a.chapter ?? '').localeCompare(b.chapter ?? '', 'nl', { numeric: true })).map((v) => (
                <li key={v.id}>
                  <Link to={`/videos/${v.id}`} className="block overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface hover:border-primary">
                    <img src={`https://i.ytimg.com/vi/${youtubeId(v.url)}/mqdefault.jpg`} alt="" className="aspect-video w-full object-cover" loading="lazy" />
                    <span className="flex items-start gap-2 p-3">
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold">{v.title}</span>
                        <span className="block text-sm text-ink-soft">{[v.chapter && `Hoofdstuk ${v.chapter}`, `${v.notes.length} aantekeningen`].filter(Boolean).join(', ')}</span>
                      </span>
                      {v.watched && <CircleCheck size={20} className="shrink-0 text-primary-ink" aria-label="bekeken" />}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </>
  );
}
