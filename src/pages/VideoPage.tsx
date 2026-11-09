import { useCallback, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { BackLink } from '@/components/ui/BackLink';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { db } from '@/db/db';
import { YouTubePlayer, type PlayerHandle } from '@/features/videos/YouTubePlayer';
import { formatTime, parseTime, youtubeId } from '@/features/videos/youtube';
import { toast } from '@/lib/toast';
import { NotFoundPage } from './NotFoundPage';

export function VideoPage() {
  const { id } = useParams();
  const video = useLiveQuery(() => db.videos.get(id ?? ''), [id], null);
  const player = useRef<PlayerHandle>(null);
  const [now, setNow] = useState(0);
  const [time, setTime] = useState('');
  const [text, setText] = useState('');
  const navigate = useNavigate();
  const onTime = useCallback((s: number) => setNow(s), []);

  if (video === null) return null;
  if (!video) return <NotFoundPage />;
  const vid = youtubeId(video.url);
  const notes = [...video.notes].sort((a, b) => a.seconds - b.seconds);

  const addNote = async () => {
    const seconds = time.trim() ? parseTime(time) : Math.floor(now);
    if (seconds === null || !text.trim()) return toast('Vul een tijd (bijv. 1:23) en een aantekening in.');
    await db.videos.update(video.id, { notes: [...video.notes, { seconds, text: text.trim() }] });
    setText('');
    setTime('');
  };

  return (
    <>
      <BackLink to="/videos">Video's</BackLink>
      <PageHeader title={video.title} intro={[video.subject, video.chapter && `hoofdstuk ${video.chapter}`].filter(Boolean).join(', ') || undefined} />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-3">
          {vid && <YouTubePlayer ref={player} id={vid} title={video.title} onTime={onTime} />}
          <div className="rounded-[var(--radius-card)] border border-line bg-surface px-4">
            <Switch label="Bekeken" checked={video.watched} onChange={(watched) => void db.videos.update(video.id, { watched })} />
          </div>
        </div>
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">Aantekeningen</h2>
          {notes.length === 0 && <p className="text-sm text-ink-soft">Schrijf op wat belangrijk is. Klik later op de tijd om daar verder te kijken.</p>}
          <ul className="flex flex-col gap-2">
            {notes.map((n, i) => (
              <li key={i} className="flex items-start gap-2 rounded-2xl border border-line bg-surface p-2">
                <button type="button" onClick={() => player.current?.seek(n.seconds)} className="h-9 shrink-0 rounded-lg bg-primary-soft px-2.5 font-bold text-primary-ink tabular-nums" aria-label={`Spring naar ${formatTime(n.seconds)}`}>
                  {formatTime(n.seconds)}
                </button>
                <span className="flex-1 py-1.5">{n.text}</span>
                <Button variant="ghost" size="icon" aria-label="Aantekening verwijderen" onClick={() => void db.videos.update(video.id, { notes: video.notes.filter((x) => x !== n) })}>
                  <Trash2 size={16} />
                </Button>
              </li>
            ))}
          </ul>
          <form className="flex flex-col gap-2 rounded-2xl bg-surface-2 p-3" onSubmit={(e) => { e.preventDefault(); void addNote(); }}>
            <div className="flex gap-2">
              <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder={formatTime(now)} aria-label="Tijd" className="w-24 text-center" />
              <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Aantekening" aria-label="Aantekening" />
            </div>
            <p className="text-xs text-ink-soft">Laat de tijd leeg om de huidige tijd van de video te gebruiken.</p>
            <Button type="submit">Toevoegen</Button>
          </form>
          <Button
            variant="ghost"
            className="text-danger"
            icon={<Trash2 size={18} aria-hidden="true" />}
            onClick={async () => {
              await db.videos.delete(video.id);
              toast('Video verwijderd');
              navigate('/videos');
            }}
          >
            Video verwijderen
          </Button>
        </section>
      </div>
    </>
  );
}
