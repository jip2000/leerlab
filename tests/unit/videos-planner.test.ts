import { describe, expect, it } from 'vitest';
import { embedUrl, formatTime, parseTime, startTime, youtubeId } from '@/features/videos/youtube';
import { daysBetween, makePlan } from '@/features/planner/schedule';

describe('YouTube', () => {
  it('herkent het video-id in allerlei links', () => {
    const id = 'dQw4w9WgXcQ';
    for (const url of [
      `https://www.youtube.com/watch?v=${id}`,
      `https://youtube.com/watch?feature=share&v=${id}&t=30`,
      `https://youtu.be/${id}?si=abc`,
      `https://www.youtube.com/shorts/${id}`,
      `https://www.youtube.com/embed/${id}`,
      `https://m.youtube.com/watch?v=${id}`,
      id,
    ]) expect(youtubeId(url), url).toBe(id);
    expect(youtubeId('https://vimeo.com/123')).toBeNull();
  });
  it('leest de starttijd', () => {
    expect(startTime('https://youtu.be/x?t=90')).toBe(90);
    expect(startTime('https://www.youtube.com/watch?v=x&t=1m30s')).toBe(90);
    expect(startTime('https://youtu.be/x')).toBe(0);
  });
  it('gebruikt youtube-nocookie', () => {
    expect(embedUrl('abc', 5)).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\/abc\?.*start=5/);
  });
  it('tijden', () => {
    expect(formatTime(83)).toBe('1:23');
    expect(formatTime(3725)).toBe('1:02:05');
    expect(parseTime('1:23')).toBe(83);
    expect(parseTime('1:02:05')).toBe(3725);
    expect(parseTime('45')).toBe(45);
    expect(parseTime('abc')).toBeNull();
  });
});

describe('leerschema', () => {
  it('telt dagen tot de toets', () => {
    expect(daysBetween('2026-11-09', '2026-11-13')).toBe(4);
    expect(daysBetween('2026-11-30', '2026-12-02')).toBe(2);
  });
  it('verdeelt alle woorden en herhaalt de laatste twee dagen', () => {
    const plan = makePlan('2026-11-09', '2026-11-15', [{ listId: 'a', title: 'A', words: 30 }, { listId: 'b', title: 'B', words: 10 }]);
    expect(plan).toHaveLength(6);
    expect(plan[0]!.date).toBe('2026-11-09');
    expect(plan[5]!.date).toBe('2026-11-14'); // dag vóór de toets
    const learned = plan.flatMap((d) => d.tasks).filter((t) => t.kind === 'leren').reduce((s, t) => s + (t.kind === 'leren' ? t.to - t.from : 0), 0);
    expect(learned).toBe(40);
    expect(plan[4]!.tasks[0]!.kind).toBe('herhalen');
    expect(plan[5]!.tasks[0]!.kind).toBe('herhalen');
    for (const d of plan) expect(d.minutes).toBeGreaterThan(0);
  });
  it('bij weinig tijd: leren en morgen herhalen', () => {
    const plan = makePlan('2026-11-09', '2026-11-11', [{ listId: 'a', title: 'A', words: 20 }]);
    expect(plan.map((d) => d.tasks[0]!.kind)).toEqual(['leren', 'herhalen']);
  });
  it('toets vandaag of voorbij: geen schema', () => {
    expect(makePlan('2026-11-09', '2026-11-09', [{ listId: 'a', title: 'A', words: 20 }])).toEqual([]);
  });
  it('grammatica komt erbij', () => {
    const plan = makePlan('2026-11-09', '2026-11-14', [{ listId: 'a', title: 'A', words: 10 }], ['fr:subjonctif']);
    expect(plan.filter((d) => d.tasks.some((t) => t.kind === 'grammatica')).length).toBeGreaterThanOrEqual(1);
  });
});
