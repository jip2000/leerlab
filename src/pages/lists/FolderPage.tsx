import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Button } from '@/components/ui/Button';
import { BackLink } from '@/components/ui/BackLink';
import { db } from '@/db/db';
import { useLists, useWordCounts } from '@/features/lists/hooks';
import { deleteFolder, updateFolder } from '@/features/lists/repo';
import { ListCard } from '@/features/lists/components/ListCard';
import { FolderForm } from '@/features/lists/components/FolderForm';
import { sortLists } from '@/features/lists/sort';
import { toast } from '@/lib/toast';
import { NotFoundPage } from '../NotFoundPage';

export function FolderPage() {
  const { id } = useParams();
  const folder = useLiveQuery(() => db.folders.get(id ?? ''), [id], null);
  const lists = useLists();
  const counts = useWordCounts();
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  if (folder === null || !lists || !counts) return null;
  if (!folder) return <NotFoundPage />;
  const inFolder = sortLists(lists.filter((l) => l.folderId === folder.id), 'naam');

  return (
    <>
      <BackLink to="/lijsten">Mijn lijsten</BackLink>
      {editing ? (
        <div className="mb-6">
          <FolderForm
            initial={folder}
            submitLabel="Opslaan"
            onCancel={() => setEditing(false)}
            onSubmit={async (v) => {
              await updateFolder(folder.id, v);
              setEditing(false);
            }}
          />
        </div>
      ) : (
        <PageHeader
          title={folder.name}
          actions={
            <>
              <Button variant="secondary" size="icon" aria-label="Map wijzigen" onClick={() => setEditing(true)}>
                <Pencil size={18} />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                aria-label="Map verwijderen"
                onClick={async () => {
                  await deleteFolder(folder.id);
                  toast(`Map "${folder.name}" verwijderd. De lijsten staan nu bij Overige lijsten.`);
                  navigate('/lijsten');
                }}
              >
                <Trash2 size={18} />
              </Button>
              <ButtonLink to={`/lijsten/nieuw?map=${folder.id}`}>
                <Plus size={18} aria-hidden="true" /> Lijst toevoegen
              </ButtonLink>
            </>
          }
        />
      )}
      {inFolder.length === 0 ? (
        <p className="text-ink-soft">Deze map is nog leeg. Voeg een lijst toe, of kies deze map bij het bewerken van een lijst.</p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {inFolder.map((l) => (
            <li key={l.id}>
              <ListCard list={l} count={counts.get(l.id) ?? 0} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
