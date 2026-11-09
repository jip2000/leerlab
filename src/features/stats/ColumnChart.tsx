import { useEffect, useRef, useState } from 'react';
import { niceMax, type Point } from './data';

/**
 * Kolomgrafiek met één reeks (geen legenda nodig: de titel zegt wat het is).
 * Dunne kolommen (max 24px) met afgeronde bovenkant, haarlijn-raster,
 * tooltip bij aanwijzen of focus, en een tabel als alternatief.
 */
export function ColumnChart({ data, unit, label }: { data: Point[]; unit: string; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    if (!box.current) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(260, e!.contentRect.width)));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  const H = 180;
  const left = 32;
  const bottom = 24;
  const top = 18;
  const max = niceMax(Math.max(...data.map((d) => d.value)));
  const plotW = width - left - 4;
  const slot = plotW / data.length;
  const bw = Math.min(24, slot * 0.6);
  const y = (v: number) => top + (H - top - bottom) * (1 - v / max);
  const every = Math.ceil(data.length / Math.floor(plotW / 56));
  const last = data.length - 1;

  return (
    <div ref={box} className="relative">
      <svg width={width} height={H} role="img" aria-label={`${label}: ${data.map((d) => `${d.label} ${d.value} ${unit}`).join(', ')}`}>
        {[0, max / 2, max].map((t) => (
          <g key={t}>
            <line x1={left} x2={width} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth={1} />
            <text x={left - 6} y={y(t) + 4} textAnchor="end" fontSize={11} fill="var(--ink-soft)">{t}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = left + slot * i + (slot - bw) / 2;
          const h = Math.max(0, H - bottom - y(d.value));
          const r = Math.min(4, h);
          return (
            <g key={d.key} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
              {/* Groter raakvlak dan de kolom zelf */}
              <rect x={left + slot * i} y={top} width={slot} height={H - top - bottom} fill="transparent" />
              {h > 0 && (
                <path
                  d={`M${x},${H - bottom} V${H - bottom - h + r} Q${x},${H - bottom - h} ${x + r},${H - bottom - h} H${x + bw - r} Q${x + bw},${H - bottom - h} ${x + bw},${H - bottom - h + r} V${H - bottom} Z`}
                  fill="var(--chart-1)"
                  opacity={hover === null || hover === i ? 1 : 0.55}
                />
              )}
              <rect
                x={left + slot * i}
                y={top}
                width={slot}
                height={H - top - bottom}
                fill="transparent"
                tabIndex={0}
                role="graphics-symbol"
                aria-label={`${d.label}: ${d.value} ${unit}`}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="outline-none focus-visible:stroke-[var(--primary)] focus-visible:stroke-2"
              />
              {i % every === (last % every) && (
                <text x={left + slot * i + slot / 2} y={H - 6} textAnchor="middle" fontSize={11} fill="var(--ink-soft)">{d.label}</text>
              )}
              {i === last && d.value > 0 && hover === null && (
                <text x={x + bw / 2} y={H - bottom - h - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--ink)">{d.value}</text>
              )}
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-sm whitespace-nowrap text-bg shadow-soft"
          style={{ left: left + slot * hover + slot / 2, top: Math.max(0, y(data[hover]!.value) - 44) }}
        >
          <strong>{data[hover]!.value} {unit}</strong> <span className="opacity-80">{data[hover]!.label}</span>
        </div>
      )}
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer font-semibold text-ink-soft">Als tabel</summary>
        <table className="mt-2 w-full max-w-sm">
          <tbody>
            {data.map((d) => (
              <tr key={d.key} className="border-b border-line">
                <td className="py-1">{d.label}</td>
                <td className="py-1 text-right tabular-nums">{d.value} {unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
