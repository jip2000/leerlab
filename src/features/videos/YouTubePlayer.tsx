import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { embedUrl } from './youtube';

export interface PlayerHandle {
  seek: (seconds: number) => void;
}

/**
 * YouTube-video in de site (via youtube-nocookie.com).
 * Met de IFrame-API kunnen we naar een tijd springen en de huidige tijd uitlezen.
 */
export const YouTubePlayer = forwardRef<PlayerHandle, { id: string; title: string; onTime?: (s: number) => void }>(function YouTubePlayer({ id, title, onTime }, ref) {
  const frame = useRef<HTMLIFrameElement>(null);
  const send = (msg: object) => frame.current?.contentWindow?.postMessage(JSON.stringify(msg), '*');

  useImperativeHandle(ref, () => ({
    seek: (s) => {
      send({ event: 'command', func: 'seekTo', args: [s, true] });
      send({ event: 'command', func: 'playVideo', args: [] });
    },
  }));

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (!/youtube/.test(e.origin) || typeof e.data !== 'string') return;
      try {
        const d = JSON.parse(e.data) as { event?: string; info?: { currentTime?: number } };
        if (d.event === 'infoDelivery' && typeof d.info?.currentTime === 'number') onTime?.(d.info.currentTime);
      } catch {
        /* geen YouTube-bericht */
      }
    };
    window.addEventListener('message', onMsg);
    const t = setInterval(() => send({ event: 'listening', id: 'woordwerk' }), 1000);
    return () => {
      window.removeEventListener('message', onMsg);
      clearInterval(t);
    };
  }, [onTime]);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-[var(--radius-card)] bg-black">
      <iframe
        ref={frame}
        src={embedUrl(id)}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
});
