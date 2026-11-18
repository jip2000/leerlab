import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Camera, RotateCcw, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { BackLink } from '@/components/ui/BackLink';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { getLanguage, type LanguageCode } from '@/data/languages';
import { getTopic } from '@/data/grammar';
import { analysePhotoText, foundAnything, type PhotoAnalysis } from '@/features/grammar/photo';
import { WERKWOORDEN } from '@/features/grammar/mix';
import { partKey } from '@/features/grammar/parts';
import { fullCrop, loadImage, render } from '@/features/scan/image';
import { getOcrEngine } from '@/features/scan/ocr';
import { verbEngines } from '@/features/verbs/registry';
import { useVerbStore } from '@/features/verbs/store';
import { useSettings } from '@/lib/settings';
import { toast } from '@/lib/toast';

type Stand = 'kiezen' | 'lezen' | 'klaar';

/**
 * FOTO VAN JE GRAMMATICABOEK (#/grammatica/fr/foto)
 * Tekst herkennen (in je eigen browser), uitzoeken welke tijden, werkwoorden en onderwerpen
 * erop staan, en die op de taalpagina aanvinken. Moeilijkheid: altijd Gemiddeld (aan te passen).
 */
export function GrammarPhotoPage() {
  const { taal } = useParams();
  const lang = taal as LanguageCode;
  const info = getLanguage(lang);
  const navigate = useNavigate();
  const engine = verbEngines[lang];
  const verbStore = useVerbStore();
  const updateSettings = useSettings((s) => s.update);
  const onderdelen = useSettings((s) => s.onderdelen);
  const [stand, setStand] = useState<Stand>('kiezen');
  const [photos, setPhotos] = useState<string[]>([]);
  const [progress, setProgress] = useState<{ p: number; status: string; photo: number }>({ p: 0, status: '', photo: 0 });
  const [result, setResult] = useState<PhotoAnalysis | null>(null);

  const read = async (files: File[]) => {
    if (!files.length) return;
    setPhotos(files.map((f) => URL.createObjectURL(f)));
    setStand('lezen');
    try {
      const ocr = getOcrEngine();
      const langs: LanguageCode[] = lang === 'nl' ? ['nl'] : [lang, 'nl'];
      const parts: string[] = [];
      for (const [i, f] of files.entries()) {
        const img = await loadImage(f);
        const canvas = render(img, { rotation: 0, crop: fullCrop, enhance: true });
        const words = await ocr(canvas, langs, (p, status) => setProgress({ p, status, photo: i }));
        parts.push(words.map((w) => w.text).join(' '));
      }
      setResult(analysePhotoText(lang, parts.join('\n')));
      setStand('klaar');
    } catch (e) {
      toast(e instanceof Error ? `Lezen lukte niet: ${e.message}` : 'Lezen lukte niet.');
      setStand('kiezen');
    }
  };

  /** Alles wat we vonden aanvinken op de taalpagina, met moeilijkheid Gemiddeld. */
  const apply = () => {
    if (!result) return;
    const topics = [...(result.tenses.length ? [WERKWOORDEN] : []), ...result.topics.map((t) => t.id)];
    const tenses = result.tenses.length ? result.tenses.map((t) => t.id) : engine ? [engine.tenses[0]!.id] : [];
    const verbs = result.verbs.length >= 3 ? result.verbs : (engine?.verbs.map((v) => v.inf) ?? []);
    verbStore.setChoice(lang, { topics, tenses, verbs, persons: [0, 1, 2, 3, 4, 5] });
    verbStore.set({ mode: 'zin', level: 2 });
    const parts = { ...onderdelen };
    for (const t of result.topics) if (t.parts) parts[partKey(lang, t.id)] = t.parts;
    updateSettings({ onderdelen: parts });
    toast('Klaargezet! Kijk of het klopt en druk op Start.');
    navigate(`/grammatica/${lang}`);
  };

  const again = () => {
    setStand('kiezen');
    setResult(null);
    setPhotos([]);
  };

  return (
    <>
      <BackLink to={`/grammatica/${lang}`}>{info.name}</BackLink>
      <PageHeader title="Foto van je boek" intro={`Maak een foto van de grammatica ${info.name} die je moet leren. Woordwerk zoekt uit wat het is en zet het klaar om te oefenen.`} />

      {stand === 'kiezen' && (
        <div className="mx-auto flex max-w-xl flex-col gap-4">
          <label className="flex cursor-pointer flex-col items-center gap-3 rounded-[28px] border-2 border-dashed border-primary bg-primary-soft/40 p-8 text-center transition-colors hover:bg-primary-soft">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary text-on-primary"><Camera size={30} aria-hidden="true" /></span>
            <span className="text-lg font-extrabold">Foto maken of kiezen</span>
            <span className="text-sm text-ink-soft">Je mag ook meer bladzijden tegelijk kiezen.</span>
            <input
              type="file"
              accept="image/*"
              multiple
              aria-label="Foto's van je grammaticaboek kiezen"
              className="sr-only"
              onChange={(e) => void read([...(e.target.files ?? [])])}
            />
          </label>
          <div className="rounded-[var(--radius-card)] bg-surface-2 p-4 text-sm">
            <p className="mb-1 font-bold">Tips voor een goede foto</p>
            <ul className="list-disc pl-5 text-ink-soft">
              <li>Recht van boven, met goed licht en zonder schaduw.</li>
              <li>Alleen de bladzijde met de grammatica, zo scherp mogelijk.</li>
              <li>De foto blijft op je apparaat: hij wordt nergens naartoe gestuurd.</li>
            </ul>
          </div>
        </div>
      )}

      {stand === 'lezen' && (
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center" role="status">
          <div className="flex flex-wrap justify-center gap-2">
            {photos.map((src, i) => <img key={i} src={src} alt={`Foto ${i + 1}`} className="h-24 w-24 rounded-xl object-cover" />)}
          </div>
          <p className="font-bold">{progress.status || 'Bezig'}{photos.length > 1 ? ` (foto ${progress.photo + 1} van ${photos.length})` : ''}…</p>
          <div className="h-3 w-full overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="Voortgang" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress.p * 100)}>
            <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${Math.round(progress.p * 100)}%` }} />
          </div>
          <p className="text-sm text-ink-soft">De eerste keer duurt dit wat langer: dan wordt de tekstherkenning gedownload.</p>
        </div>
      )}

      {stand === 'klaar' && result && (
        <div className="mx-auto flex max-w-xl flex-col gap-4">
          {foundAnything(result) ? (
            <>
              <section className="rounded-[28px] border-2 border-primary bg-surface p-5 shadow-soft">
                <h2 className="mb-3 flex items-center gap-2 text-xl font-extrabold"><Sparkles size={22} aria-hidden="true" /> Dit staat op je foto</h2>
                {result.tenses.length > 0 && (
                  <>
                    <h3 className="mb-1 text-sm font-bold text-ink-soft">Tijden</h3>
                    <ul className="mb-3 flex flex-wrap gap-2">
                      {result.tenses.map((t) => <li key={t.id} lang={lang} className="rounded-full bg-primary-soft px-3 py-1 font-semibold text-primary-ink">{t.label}</li>)}
                    </ul>
                  </>
                )}
                {result.topics.length > 0 && (
                  <>
                    <h3 className="mb-1 text-sm font-bold text-ink-soft">Onderwerpen</h3>
                    <ul className="mb-3 flex flex-wrap gap-2">
                      {result.topics.map((t) => (
                        <li key={t.id} className="rounded-full bg-primary-soft px-3 py-1 font-semibold text-primary-ink">
                          {t.title}
                          {t.parts && <span className="font-normal"> ({t.parts.map((p) => getTopic(lang, t.id)?.parts?.find((x) => x.id === p)?.label).join(', ')})</span>}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {result.verbs.length > 0 && (
                  <>
                    <h3 className="mb-1 text-sm font-bold text-ink-soft">Werkwoorden</h3>
                    <p className="mb-3" lang={lang}>{result.verbs.slice(0, 12).join(', ')}{result.verbs.length > 12 ? ` en nog ${result.verbs.length - 12}` : ''}</p>
                  </>
                )}
                <p className="text-sm text-ink-soft">Moeilijkheid: <strong>Gemiddeld</strong>. Op de volgende pagina kun je alles nog aanpassen.</p>
              </section>
              <Button size="lg" className="justify-center" onClick={apply}>Zet klaar om te oefenen</Button>
            </>
          ) : (
            <section className="rounded-[28px] border border-line bg-surface p-5">
              <h2 className="mb-1 text-lg font-extrabold">Ik herken nog niets op deze foto</h2>
              <p className="text-ink-soft">Probeer een foto recht van boven, met goed licht en alleen de grammatica-bladzijde. Of kies zelf wat je wilt oefenen.</p>
              <ButtonLink to={`/grammatica/${lang}`} variant="secondary" className="mt-3">Zelf kiezen</ButtonLink>
            </section>
          )}
          <Button variant="secondary" className="justify-center" icon={<RotateCcw size={18} aria-hidden="true" />} onClick={again}>Andere foto</Button>
        </div>
      )}
    </>
  );
}
