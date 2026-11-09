import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeftRight, ClipboardPaste, Copy, Download, Layers, Merge, MoreHorizontal, Pencil, Share2, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { BackLink } from '@/components/ui/BackLink';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { getLanguage } from '@/data/languages';
import { useList, useLists, useWords } from '@/features/lists/hooks';
import { deleteList, duplicateList, mergeInto, restoreList, reverseList } from '@/features/lists/repo';
import { bookKey, yearLevelLabel } from '@/features/lists/books';
import { WordTable } from '@/features/lists/components/WordTable';
import { ListPhotos } from '@/features/lists/components/ListPhotos';
import { MasteryBar } from '@/features/lists/components/MasteryBar';
import { TopicVideos } from '@/features/videos/TopicVideos';
import { toCsv } from '@/lib/csv';
import { encodeSharedList } from '@/lib/share';
import { toast } from '@/lib/toast';
import { NotFoundPage } from '../NotFoundPage';

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const fileName = (title: string) => title.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').toLowerCase() || 'lijst';

export function ListDetailPage() {
  const { id } = useParams();
  const list = useList(id);
  const words = useWords(id);
  const allLists = useLists();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [merging, setMerging] = useState<string[] | null>(null);
  const [shareLink, setShareLink] = useState('');

  if (list === undefined || !words) {
    // useLiveQuery geeft eerst undefined; daarna de lijst of (als hij niet bestaat) ook undefined.
    return allLists && !allLists.some((l) => l.id === id) ? <NotFoundPage /> : null;
  }

  const back = list.book?.title
    ? { to: `/lijsten/boek/${encodeURIComponent(bookKey(list.book))}`, label: list.book.title }
    : list.folderId
      ? { to: `/lijsten/map/${list.folderId}`, label: 'Map' }
      : { to: '/lijsten', label: 'Mijn lijsten' };

  const subtitle = [
    `${getLanguage(list.langLeft).name} – ${getLanguage(list.langRight).name}`,
    list.book?.title,
    list.book && yearLevelLabel(list.book),
    list.book?.chapter && `hoofdstuk ${list.book.chapter}`,
    `${words.length} ${words.length === 1 ? 'woord' : 'woorden'}`,
  ]
    .filter(Boolean)
    .join(', ');

  const share = async () => {
    const code = await encodeSharedList({
      v: 1,
      title: list.title,
      langLeft: list.langLeft,
      langRight: list.langRight,
      book: list.book,
      words: words.map((w) => {
        const extra = [w.article ?? '', w.extraForms ?? '', w.example ?? '', w.note ?? ''];
        while (extra.length && !extra[extra.length - 1]) extra.pop();
        return [w.left, w.right, ...extra];
      }),
    });
    const url = `${location.origin}${location.pathname}#/delen?d=${code}`;
    setShareLink(url);
    try {
      if (navigator.share) await navigator.share({ title: list.title, text: `Woordenlijst: ${list.title}`, url });
      else {
        await navigator.clipboard.writeText(url);
        toast('Link gekopieerd. Stuur hem naar je klasgenoten.');
      }
    } catch {
      /* gebruiker annuleerde het delen; de link staat hieronder */
    }
  };

  const actions: { label: string; icon: typeof Copy; run: () => void | Promise<void>; danger?: boolean }[] = [
    { label: 'Woorden plakken', icon: ClipboardPaste, run: () => navigate(`/lijsten/importeren?lijst=${list.id}`) },
    {
      label: 'Dupliceren',
      icon: Copy,
      run: async () => {
        const newId = await duplicateList(list.id);
        toast('Kopie gemaakt');
        navigate(`/lijsten/${newId}`);
      },
    },
    {
      label: 'Links en rechts omdraaien',
      icon: ArrowLeftRight,
      run: async () => {
        await reverseList(list.id);
        toast('Lijst omgedraaid');
      },
    },
    { label: 'Samenvoegen met…', icon: Merge, run: () => setMerging([]) },
    { label: 'Exporteren als CSV', icon: Download, run: () => download(`${fileName(list.title)}.csv`, toCsv(words), 'text/csv;charset=utf-8') },
    { label: 'Delen met een link', icon: Share2, run: share },
    {
      label: 'Verwijderen',
      icon: Trash2,
      danger: true,
      run: async () => {
        const snapshot = await deleteList(list.id);
        navigate(back.to === `/lijsten/${list.id}` ? '/lijsten' : back.to);
        if (snapshot) toast(`"${list.title}" verwijderd`, { label: 'Ongedaan maken', run: () => void restoreList(snapshot) });
      },
    },
  ];

  const others = (allLists ?? []).filter((l) => l.id !== list.id);

  return (
    <>
      <BackLink to={back.to}>{back.label}</BackLink>
      <PageHeader title={list.title} intro={subtitle} />

      <div className="mb-5 flex flex-wrap gap-2">
        <ButtonLink to={`/oefenen?lijsten=${list.id}`}>
          <Layers size={18} aria-hidden="true" /> Oefenen
        </ButtonLink>
        <ButtonLink to={`/lijsten/${list.id}/bewerken`} variant="secondary">
          <Pencil size={18} aria-hidden="true" /> Bewerken
        </ButtonLink>
        <div className="relative">
          <Button variant="secondary" aria-label="Meer acties" aria-expanded={menu} aria-haspopup="menu" onClick={() => setMenu((m) => !m)} icon={<MoreHorizontal size={18} aria-hidden="true" />}>
            Meer
          </Button>
          {menu && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setMenu(false)} aria-hidden="true" />
              <ul role="menu" className="absolute left-0 z-30 mt-2 w-64 rounded-2xl border border-line bg-surface p-1.5 shadow-soft">
                {actions.map(({ label, icon: Icon, run, danger }) => (
                  <li key={label} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      className={`flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left font-semibold hover:bg-surface-2 ${danger ? 'text-danger' : ''}`}
                      onClick={() => {
                        setMenu(false);
                        void run();
                      }}
                    >
                      <Icon size={18} aria-hidden="true" /> {label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {words.length > 0 && (
        <div className="mb-5 max-w-md">
          <MasteryBar listId={list.id} total={words.length} showText />
        </div>
      )}

      {list.tags.length > 0 && (
        <ul className="mb-4 flex flex-wrap gap-1.5" aria-label="Tags">
          {list.tags.map((t) => (
            <li key={t} className="rounded-full bg-surface-2 px-3 py-1 text-sm font-semibold text-ink-soft">
              {t}
            </li>
          ))}
        </ul>
      )}

      {shareLink && (
        <div className="mb-5 rounded-[var(--radius-card)] border border-line bg-surface p-4">
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="deellink">
            Deellink. Wie deze link opent, kan de lijst opslaan in Woordwerk.
          </label>
          <input id="deellink" readOnly value={shareLink} onFocus={(e) => e.currentTarget.select()} className="h-11 w-full rounded-xl border border-line bg-bg px-3 text-sm" />
        </div>
      )}

      {merging && (
        <div className="mb-5 rounded-[var(--radius-card)] border border-line bg-surface p-4">
          <h2 className="mb-1 font-bold">Samenvoegen</h2>
          <p className="mb-3 text-sm text-ink-soft">De woorden van de gekozen lijsten komen erbij in deze lijst. De andere lijsten blijven bestaan.</p>
          {others.length === 0 ? (
            <p className="text-ink-soft">Je hebt nog geen andere lijsten.</p>
          ) : (
            <ul className="mb-3 max-h-64 overflow-y-auto">
              {others.map((l) => (
                <li key={l.id}>
                  <label className="flex min-h-11 items-center gap-3 rounded-xl px-2 hover:bg-surface-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-[var(--primary)]"
                      checked={merging.includes(l.id)}
                      onChange={(e) => setMerging(e.target.checked ? [...merging, l.id] : merging.filter((x) => x !== l.id))}
                    />
                    {l.title}
                  </label>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <Button
              disabled={merging.length === 0}
              onClick={async () => {
                const n = await mergeInto(list.id, merging);
                setMerging(null);
                toast(`${n} ${n === 1 ? 'woord' : 'woorden'} toegevoegd`);
              }}
            >
              Samenvoegen
            </Button>
            <Button variant="ghost" onClick={() => setMerging(null)}>
              Annuleren
            </Button>
          </div>
        </div>
      )}

      {words.length === 0 ? (
        <p className="text-ink-soft">Deze lijst is leeg. Kies Bewerken om woorden toe te voegen.</p>
      ) : (
        <WordTable words={words} langLeft={list.langLeft} langRight={list.langRight} />
      )}
      <ListPhotos ids={list.photoIds} />
      <TopicVideos link={{ kind: 'list', id: list.id }} />
    </>
  );
}
