/**
 * Tekstherkenning met Tesseract.js. Draait helemaal in je browser; de taalpakketten
 * worden de eerste keer gedownload (daarna bewaart de browser ze).
 *
 * Later kan hier een "slimme modus" bij (bijv. een AI-model via een eigen server).
 * Daarvoor hoeft alleen een andere functie met dezelfde vorm (OcrEngine) gemaakt te worden.
 */
import type { LanguageCode } from '@/data/languages';
import { getLanguage } from '@/data/languages';
import type { OcrWord } from './pairs';

export type OcrEngine = (image: HTMLCanvasElement, langs: LanguageCode[], onProgress: (p: number, status: string) => void) => Promise<OcrWord[]>;

const statusNl: Record<string, string> = {
  'loading tesseract core': 'Tekstherkenning laden',
  'initializing tesseract': 'Tekstherkenning starten',
  'loading language traineddata': 'Taalpakket downloaden',
  'initializing api': 'Bijna klaar met laden',
  'recognizing text': 'Tekst herkennen',
};

export const tesseractEngine: OcrEngine = async (image, langs, onProgress) => {
  const { createWorker } = await import('tesseract.js'); // pas laden als je het nodig hebt
  const codes = [...new Set(langs.map((l) => getLanguage(l).ocrCode))].join('+');
  const worker = await createWorker(codes, 1, {
    logger: (m: { status: string; progress: number }) => onProgress(m.progress, statusNl[m.status] ?? 'Bezig'),
  });
  try {
    const { data } = await worker.recognize(image, {}, { blocks: true });
    const words: OcrWord[] = [];
    for (const b of data.blocks ?? [])
      for (const p of b.paragraphs)
        for (const l of p.lines)
          for (const w of l.words) words.push({ text: w.text, conf: w.confidence, ...w.bbox });
    return words;
  } finally {
    await worker.terminate();
  }
};

/** In browsertests kan een nep-herkenning worden ingesteld via window.__woordwerkOcr. */
export function getOcrEngine(): OcrEngine {
  const mock = (window as unknown as { __woordwerkOcr?: OcrEngine }).__woordwerkOcr;
  return mock ?? tesseractEngine;
}
