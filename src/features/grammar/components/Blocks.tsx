import { Lightbulb } from 'lucide-react';
import type { LanguageCode } from '@/data/languages';
import type { Block } from '../types';
import { Rich } from './Rich';

/** De uitleg van een grammatica-onderwerp. */
export function Blocks({ blocks, lang }: { blocks: Block[]; lang: LanguageCode }) {
  return (
    <div className="flex max-w-[72ch] flex-col gap-4">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'text':
            return <p key={i} className="leading-relaxed"><Rich text={b.text} /></p>;
          case 'tip':
            return (
              <p key={i} className="flex gap-3 rounded-2xl bg-marker/35 p-4 leading-relaxed">
                <Lightbulb size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span><span className="sr-only">Tip: </span><Rich text={b.text} /></span>
              </p>
            );
          case 'examples':
            return (
              <ul key={i} className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
                {b.items.map(([fl, nl], j) => (
                  <li key={j}>
                    <span lang={lang} className="block font-semibold">{fl}</span>
                    <span className="block text-sm text-ink-soft">{nl}</span>
                  </li>
                ))}
              </ul>
            );
          case 'table':
            return (
              <div key={i} className="overflow-x-auto rounded-2xl border border-line bg-surface">
                <table className="w-full text-left text-[15px]">
                  {b.caption && <caption className="px-4 pt-3 text-left font-bold">{b.caption}</caption>}
                  <thead>
                    <tr className="border-b border-line">
                      {b.head.map((h, j) => <th key={j} scope="col" className="px-4 py-2.5 font-semibold text-ink-soft">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j} className="border-b border-line last:border-0 even:bg-surface-2/50">
                        {r.map((c, k) =>
                          k === 0 ? (
                            <th key={k} scope="row" className="px-4 py-2 font-semibold"><Rich text={c} /></th>
                          ) : (
                            <td key={k} lang={lang} className="px-4 py-2"><Rich text={c} /></td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}
