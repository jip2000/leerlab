import { useRef } from 'react';
import type { Crop } from '../image';

type Handle = 'nw' | 'ne' | 'sw' | 'se' | 'move';

/**
 * Bijsnijden: sleep de hoeken (of het hele vak) over de foto.
 * Werkt met muis en vinger (pointer events).
 */
export function CropEditor({ src, crop, onChange }: { src: string; crop: Crop; onChange: (c: Crop) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ handle: Handle; startX: number; startY: number; start: Crop } | null>(null);

  const onDown = (handle: Handle) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { handle, startX: e.clientX, startY: e.clientY, start: crop };
  };

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const rect = box.current?.getBoundingClientRect();
    if (!d || !rect) return;
    const dx = (e.clientX - d.startX) / rect.width;
    const dy = (e.clientY - d.startY) / rect.height;
    const s = d.start;
    const min = 0.08;
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
    let { x, y, w, h } = s;
    if (d.handle === 'move') {
      x = clamp(s.x + dx, 0, 1 - s.w);
      y = clamp(s.y + dy, 0, 1 - s.h);
    } else {
      if (d.handle.includes('w')) {
        x = clamp(s.x + dx, 0, s.x + s.w - min);
        w = s.x + s.w - x;
      }
      if (d.handle.includes('e')) w = clamp(s.w + dx, min, 1 - s.x);
      if (d.handle.includes('n')) {
        y = clamp(s.y + dy, 0, s.y + s.h - min);
        h = s.y + s.h - y;
      }
      if (d.handle.includes('s')) h = clamp(s.h + dy, min, 1 - s.y);
    }
    onChange({ x, y, w, h });
  };

  const handle = (h: Exclude<Handle, 'move'>, label: string) => (
    <button
      type="button"
      aria-label={label}
      onPointerDown={onDown(h)}
      className="absolute h-11 w-11 touch-none"
      style={{
        left: h.includes('w') ? -22 : undefined,
        right: h.includes('e') ? -22 : undefined,
        top: h.includes('n') ? -22 : undefined,
        bottom: h.includes('s') ? -22 : undefined,
      }}
    >
      <span className="absolute inset-3 rounded-full border-[3px] border-white bg-primary shadow" />
    </button>
  );

  return (
    <div ref={box} className="relative mx-auto w-fit max-w-full touch-none select-none" onPointerMove={onMove} onPointerUp={() => (drag.current = null)}>
      <img src={src} alt="Je foto" className="block max-h-[60vh] max-w-full rounded-xl" draggable={false} />
      {/* Donker buiten het vak */}
      <div
        className="absolute rounded-sm border-2 border-white shadow-[0_0_0_9999px_rgb(0_0_0/0.45)]"
        style={{ left: `${crop.x * 100}%`, top: `${crop.y * 100}%`, width: `${crop.w * 100}%`, height: `${crop.h * 100}%` }}
      >
        <div className="absolute inset-0 cursor-move" onPointerDown={onDown('move')} aria-hidden="true" />
        {handle('nw', 'Hoek linksboven')}
        {handle('ne', 'Hoek rechtsboven')}
        {handle('sw', 'Hoek linksonder')}
        {handle('se', 'Hoek rechtsonder')}
      </div>
    </div>
  );
}
