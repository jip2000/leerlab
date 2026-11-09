import { Link } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { CircleCheck, SquarePlay } from 'lucide-react';
import { db } from '@/db/db';
import { youtubeId } from './youtube';

/** Video's die aan een lijst of grammatica-onderwerp gekoppeld zijn. */
export function TopicVideos({ link }: { link: { kind: 'list' | 'grammar'; id: string } }) {
  const videos = useLiveQuery(() => db.videos.filter((v) => v.linkedTo.some((l) => l.kind === link.kind && l.id === link.id)).toArray(), [link.kind, link.id]);
  if (!videos?.length) return null;
  return (
    <section className="mt-8">
      <h2 className="mb-2 flex items-center gap-2 font-bold"><SquarePlay size={18} aria-hidden="true" /> Uitlegvideo's</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {videos.map((v) => (
          <li key={v.id}>
            <Link to={`/videos/${v.id}`} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-2 hover:border-primary">
              <img src={`https://i.ytimg.com/vi/${youtubeId(v.url)}/mqdefault.jpg`} alt="" className="h-14 w-24 rounded-lg object-cover" loading="lazy" />
              <span className="min-w-0 flex-1 truncate font-semibold">{v.title}</span>
              {v.watched && <CircleCheck size={18} className="text-primary-ink" aria-label="bekeken" />}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
