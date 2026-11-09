import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';

/** Foto's van het boek die bij een lijst horen (van het scannen). */
export function ListPhotos({ ids }: { ids: string[] }) {
  const files = useLiveQuery(() => db.files.bulkGet(ids), [ids.join(',')]);
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    const u = (files ?? []).filter(Boolean).map((f) => URL.createObjectURL(f!.blob));
    setUrls(u);
    return () => u.forEach((x) => URL.revokeObjectURL(x));
  }, [files]);
  if (urls.length === 0) return null;
  return (
    <section className="mt-6">
      <h2 className="mb-2 font-bold">Foto's uit je boek</h2>
      <ul className="flex gap-2 overflow-x-auto">
        {urls.map((u, i) => (
          <li key={u} className="shrink-0">
            <a href={u} target="_blank" rel="noreferrer" className="block">
              <img src={u} alt={`Foto ${i + 1}`} className="h-40 rounded-xl border border-line object-cover" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
