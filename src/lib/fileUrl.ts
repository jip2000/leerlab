import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, newId } from '@/db/db';

/** Geeft een tijdelijke link naar een opgeslagen bestand (bijv. een plaatje bij een woord). */
export function useFileUrl(id: string | undefined): string | undefined {
  const file = useLiveQuery(() => (id ? db.files.get(id) : undefined), [id]);
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (!file) return setUrl(undefined);
    const u = URL.createObjectURL(file.blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return url;
}

/** Verkleint een plaatje (max. 600 px) en bewaart het. Geeft het id terug. */
export async function saveImage(file: Blob, maxSide = 600): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * scale);
    c.height = Math.round(img.height * scale);
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Plaatje opslaan lukte niet'))), 'image/jpeg', 0.85));
    const id = newId();
    await db.files.add({ id, blob, name: 'woord.jpg', createdAt: Date.now() });
    return id;
  } finally {
    URL.revokeObjectURL(url);
  }
}
