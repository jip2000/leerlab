import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeftRight, Camera, ChevronsDown, ImagePlus, Plus, RotateCcw, RotateCw, ScanText, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Field, Select } from '@/components/ui/Field';
import { LanguageSelect } from '@/components/ui/LanguageSelect';
import { Switch } from '@/components/ui/Switch';
import type { LanguageCode } from '@/data/languages';
import { db, newId } from '@/db/db';
import { useLists } from '@/features/lists/hooks';
import { createList, getWords, saveList } from '@/features/lists/repo';
import { startSession } from '@/features/practice/repo';
import { CropEditor } from '@/features/scan/components/CropEditor';
import { cropCanvas, fullCrop, loadImage, render, rotate, toJpeg, type EditSettings } from '@/features/scan/image';
import { getOcrEngine } from '@/features/scan/ocr';
import { wordsToPairs } from '@/features/scan/pairs';
import { cn } from '@/lib/cn';
import { toast } from '@/lib/toast';

interface Photo {
  id: string;
  img: HTMLImageElement;
  settings: EditSettings;
}

interface Row {
  key: number;
  left: string;
  right: string;
  unsure: boolean;
}

type Step = 'kiezen' | 'bewerken' | 'herkennen' | 'controleren';
let k = 1;

export function ScanPage() {
  const navigate = useNavigate();
  const lists = useLists();
  const [step, setStep] = useState<Step>('kiezen');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [current, setCurrent] = useState(0);
  const [langLeft, setLangLeft] = useState<LanguageCode>('fr');
  const [langRight, setLangRight] = useState<LanguageCode>('nl');
  const [progress, setProgress] = useState({ p: 0, status: '', photo: 0 });
  const [rows, setRows] = useState<Row[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [into, setInto] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  const photo = photos[current];

  // Voorbeeld van de gedraaide foto (zonder bijsnijden) voor de bijsnij-editor.
  const rotatedUrl = useMemo(() => (photo ? rotate(photo.img, photo.settings.rotation).toDataURL('image/jpeg', 0.8) : ''), [photo?.id, photo?.settings.rotation]); // eslint-disable-line

  // Voorbeeld na verbeteren (alleen op het controlescherm).
  useEffect(() => {
    if (step === 'controleren' && photos[0]) setPreview(render(photos[0].img, photos[0].settings).toDataURL('image/jpeg', 0.8));
  }, [step, photos]);

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const added: Photo[] = [];
    for (const f of Array.from(files)) {
      try {
        added.push({ id: newId(), img: await loadImage(f), settings: { rotation: 0, crop: fullCrop, enhance: true } });
      } catch {
        toast(`${f.name} kon niet geopend worden.`);
      }
    }
    if (added.length) {
      setPhotos((p) => [...p, ...added]);
      setCurrent(photos.length);
      setStep('bewerken');
    }
  };

  const update = (patch: Partial<EditSettings>) =>
    setPhotos((ps) => ps.map((p, i) => (i === current ? { ...p, settings: { ...p.settings, ...patch } } : p)));

  const recognize = async () => {
    setStep('herkennen');
    const ocr = getOcrEngine();
    const found: Row[] = [];
    const skip: string[] = [];
    try {
      for (let i = 0; i < photos.length; i++) {
        const canvas = render(photos[i]!.img, photos[i]!.settings);
        const words = await ocr(canvas, [langLeft, langRight], (p, status) => setProgress({ p, status, photo: i }));
        const r = wordsToPairs(words);
        found.push(...r.pairs.map((p) => ({ ...p, key: k++ })));
        skip.push(...r.skipped);
      }
      setRows(found.length ? found : [{ key: k++, left: '', right: '', unsure: false }]);
      setSkipped(skip);
      setStep('controleren');
    } catch (e) {
      console.error(e);
      toast('Tekstherkenning lukte niet. Heb je internet? De eerste keer moet het taalpakket gedownload worden.');
      setStep('bewerken');
    }
  };

  const setRow = (key: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const save = async (practice: boolean) => {
    const words = rows.filter((r) => r.left.trim() && r.right.trim()).map(({ left, right }) => ({ left, right }));
    if (words.length === 0) return setError('Er zijn nog geen complete woordparen.');
    if (!into && !title.trim()) return setError('Geef de nieuwe lijst een titel.');
    // Foto's bewaren (bijgesneden, niet verbeterd), zodat je later kunt terugkijken.
    const photoIds: string[] = [];
    for (const p of photos) {
      const id = newId();
      const blob = await toJpeg(cropCanvas(rotate(p.img, p.settings.rotation), p.settings.crop));
      await db.files.add({ id, blob, name: 'foto.jpg', createdAt: Date.now() });
      photoIds.push(id);
    }
    let listId = into;
    if (into) {
      const list = await db.lists.get(into);
      await saveList(into, { photoIds: [...(list?.photoIds ?? []), ...photoIds] }, [...(await getWords(into)), ...words]);
    } else {
      listId = await createList({ title: title.trim(), langLeft, langRight, tags: ['foto'], photoIds }, words);
    }
    toast(`${words.length} flitskaartjes opgeslagen`);
    if (practice) {
      const sid = await startSession({ listIds: [listId], mode: 'flashcards', direction: 'lr', shuffle: true, onlyHard: false });
      navigate(`/oefenen/${sid}`);
    } else navigate(`/lijsten/${listId}`);
  };

  return (
    <>
      <PageHeader title="Foto scannen" intro="Maak een foto van de woordjes in je boek en maak er flitskaartjes van." />

      {step === 'kiezen' && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-5">
            <Field label="Taal links in je boek">
              <LanguageSelect value={langLeft} onChange={setLangLeft} />
            </Field>
            <Field label="Taal rechts">
              <LanguageSelect value={langRight} onChange={setLangRight} />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] bg-primary p-6 text-center font-bold text-on-primary hover:bg-primary-hover">
              <Camera size={36} aria-hidden="true" />
              Foto maken
              <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => void addFiles(e.target.files)} />
            </label>
            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border-2 border-dashed border-line bg-surface p-6 text-center font-bold hover:border-primary">
              <ImagePlus size={36} aria-hidden="true" />
              Afbeelding kiezen
              <span className="text-sm font-normal text-ink-soft">Meerdere tegelijk mag ook</span>
              <input type="file" accept="image/*" multiple className="sr-only" aria-label="Afbeeldingen kiezen" onChange={(e) => void addFiles(e.target.files)} />
            </label>
          </div>
          <div className="rounded-[var(--radius-card)] bg-surface-2 p-4 text-sm text-ink-soft">
            <p className="font-semibold text-ink">Tips voor een goede foto</p>
            <ul className="mt-1 list-inside list-disc">
              <li>Leg je boek plat en zorg voor genoeg licht, zonder schaduw van je telefoon.</li>
              <li>Houd je telefoon recht boven de bladzijde.</li>
              <li>Snij straks alleen het stuk met de woordjes bij.</li>
            </ul>
          </div>
        </div>
      )}

      {step === 'bewerken' && photo && (
        <div className="flex flex-col gap-4">
          {photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Foto's">
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  onClick={() => setCurrent(i)}
                  className={cn('h-11 shrink-0 rounded-full border px-4 font-semibold', i === current ? 'border-primary bg-primary-soft text-primary-ink' : 'border-line')}
                >
                  Foto {i + 1}
                </button>
              ))}
            </div>
          )}
          <p className="text-sm text-ink-soft">Sleep de hoeken zodat alleen de woordjes binnen het vak vallen.</p>
          <CropEditor src={rotatedUrl} crop={photo.settings.crop} onChange={(crop) => update({ crop })} />
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="icon" aria-label="Linksom draaien" onClick={() => update({ rotation: photo.settings.rotation - 90, crop: fullCrop })}>
              <RotateCcw size={18} />
            </Button>
            <Button variant="secondary" size="icon" aria-label="Rechtsom draaien" onClick={() => update({ rotation: photo.settings.rotation + 90, crop: fullCrop })}>
              <RotateCw size={18} />
            </Button>
            <label className="flex flex-1 items-center gap-3 text-sm font-semibold">
              Rechtzetten
              <input
                type="range"
                min={-15}
                max={15}
                step={0.5}
                value={(((photo.settings.rotation % 90) + 135) % 90) - 45}
                onChange={(e) => update({ rotation: Math.round(photo.settings.rotation / 90) * 90 + Number(e.target.value) })}
                className="h-11 flex-1 accent-[var(--primary)]"
              />
            </label>
          </div>
          <div className="rounded-[var(--radius-card)] border border-line bg-surface px-4">
            <Switch label="Beeld verbeteren" description="Grijs, meer contrast en scherper: dan leest de computer beter." checked={photo.settings.enhance} onChange={(enhance) => update({ enhance })} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="lg" icon={<ScanText size={20} aria-hidden="true" />} onClick={() => void recognize()}>
              Tekst herkennen
            </Button>
            <label className="inline-flex h-13 cursor-pointer items-center gap-2 rounded-[var(--radius-control)] border border-line bg-surface px-5 font-semibold hover:bg-surface-2">
              <Plus size={18} aria-hidden="true" /> Nog een foto
              <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => void addFiles(e.target.files)} />
            </label>
            <Button variant="ghost" size="lg" onClick={() => { setPhotos([]); setStep('kiezen'); }}>
              Opnieuw
            </Button>
          </div>
        </div>
      )}

      {step === 'herkennen' && (
        <div className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-8 text-center" role="status">
          <ScanText size={40} className="text-primary-ink" aria-hidden="true" />
          <p className="text-lg font-bold">
            {progress.status || 'Bezig'}
            {photos.length > 1 && ` (foto ${progress.photo + 1} van ${photos.length})`}
          </p>
          <div className="h-3 w-full max-w-sm overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="Voortgang herkennen" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress.p * 100)}>
            <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress.p * 100}%` }} />
          </div>
          <p className="text-sm text-ink-soft">De eerste keer duurt dit langer: dan wordt het taalpakket gedownload.</p>
        </div>
      )}

      {step === 'controleren' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="lg:sticky lg:top-4 lg:self-start">
            {preview && <img src={preview} alt="Je verbeterde foto" className="max-h-[50vh] w-full rounded-xl border border-line object-contain lg:max-h-[80vh]" />}
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold">Controleer de woorden</h2>
              <p className="text-sm text-ink-soft">
                {rows.length} paren gevonden. <span className="rounded bg-marker/60 px-1 text-ink">Geel</span> = de computer twijfelt, kijk die extra goed na.
              </p>
            </div>
            <Button variant="secondary" icon={<ArrowLeftRight size={18} aria-hidden="true" />} onClick={() => setRows((rs) => rs.map((r) => ({ ...r, left: r.right, right: r.left })))}>
              Alle kolommen omwisselen
            </Button>
            <ol className="flex flex-col gap-2">
              {rows.map((r, i) => (
                <li key={r.key} className={cn('rounded-2xl border p-2', r.unsure ? 'border-marker bg-marker/25' : 'border-line bg-surface')}>
                  <div className="grid grid-cols-2 gap-2">
                    <Input aria-label={`Rij ${i + 1} links`} value={r.left} onChange={(e) => setRow(r.key, { left: e.target.value, unsure: false })} />
                    <Input aria-label={`Rij ${i + 1} rechts`} value={r.right} onChange={(e) => setRow(r.key, { right: e.target.value, unsure: false })} />
                  </div>
                  <div className="mt-1 flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label={`Rij ${i + 1} omwisselen`} onClick={() => setRow(r.key, { left: r.right, right: r.left })}>
                      <ArrowLeftRight size={17} />
                    </Button>
                    {i < rows.length - 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Rij ${i + 1} samenvoegen met de volgende`}
                        onClick={() =>
                          setRows((rs) => {
                            const n = rs[i + 1]!;
                            const merged = { ...r, left: `${r.left} ${n.left}`.trim(), right: `${r.right} ${n.right}`.trim() };
                            return [...rs.slice(0, i), merged, ...rs.slice(i + 2)];
                          })
                        }
                      >
                        <ChevronsDown size={17} />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" aria-label={`Rij ${i + 1} verwijderen`} onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))}>
                      <Trash2 size={17} />
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
            <Button variant="secondary" icon={<Plus size={18} aria-hidden="true" />} onClick={() => setRows((rs) => [...rs, { key: k++, left: '', right: '', unsure: false }])}>
              Rij toevoegen
            </Button>
            {skipped.length > 0 && (
              <details className="rounded-2xl bg-surface-2 p-3 text-sm">
                <summary className="cursor-pointer font-semibold">{skipped.length} regels niet als woordpaar herkend</summary>
                <ul className="mt-2 flex flex-col gap-1">
                  {skipped.map((s, i) => (
                    <li key={i} className="flex items-center justify-between gap-2">
                      <span>{s}</span>
                      <Button variant="ghost" onClick={() => { setRows((rs) => [...rs, { key: k++, left: s, right: '', unsure: true }]); setSkipped((sk) => sk.filter((_, j) => j !== i)); }}>
                        Toevoegen
                      </Button>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <section className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-5">
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
                <Field label="Titel van de nieuwe lijst">
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Bijvoorbeeld: Unité 4, woorden" />
                </Field>
              )}
              {error && <p role="alert" className="font-semibold text-danger">{error}</p>}
              <div className="flex flex-wrap gap-2">
                <Button size="lg" onClick={() => void save(true)}>
                  Opslaan en meteen oefenen
                </Button>
                <Button size="lg" variant="secondary" onClick={() => void save(false)}>
                  Alleen opslaan
                </Button>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
