import { useFileUrl } from '@/lib/fileUrl';
import { cn } from '@/lib/cn';

/** Plaatje bij een woord (of niets als er geen is). */
export function WordImage({ id, className, alt = '' }: { id?: string; className?: string; alt?: string }) {
  const url = useFileUrl(id);
  if (!url) return null;
  return <img src={url} alt={alt} className={cn('rounded-xl object-cover', className)} />;
}
