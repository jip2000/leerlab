import { describe, expect, it } from 'vitest';
import { ed, enEngine as en, ing, thirdPerson } from '@/features/verbs/en';
import { checkAnswer } from '@/lib/check';
import { defaultSettings } from '@/lib/settings';

const b = (inf: string, t: string, i: number) => en.bare(inf, t, i);

describe('Engels: spellingsregels', () => {
  it('he/she/it -s', () => {
    expect(['work', 'go', 'do', 'watch', 'wash', 'fix', 'study', 'play', 'have', 'try', 'miss'].map(thirdPerson)).toEqual([
      'works', 'goes', 'does', 'watches', 'washes', 'fixes', 'studies', 'plays', 'has', 'tries', 'misses',
    ]);
  });
  it('-ing', () => {
    expect(['make', 'lie', 'see', 'stop', 'run', 'swim', 'begin', 'visit', 'open', 'play', 'travel', 'be', 'read', 'try'].map(ing)).toEqual([
      'making', 'lying', 'seeing', 'stopping', 'running', 'swimming', 'beginning', 'visiting', 'opening', 'playing', 'travelling', 'being', 'reading', 'trying',
    ]);
  });
  it('-ed', () => {
    expect(['work', 'live', 'study', 'play', 'stop', 'plan', 'prefer', 'visit', 'cry', 'want'].map(ed)).toEqual([
      'worked', 'lived', 'studied', 'played', 'stopped', 'planned', 'preferred', 'visited', 'cried', 'wanted',
    ]);
  });
});

describe('Engels: onregelmatige werkwoorden (3 rijtjes)', () => {
  const rijtjes: [string, string, string][] = [
    ['go', 'went', 'gone'], ['see', 'saw', 'seen'], ['take', 'took', 'taken'], ['write', 'wrote', 'written'], ['eat', 'ate', 'eaten'],
    ['drink', 'drank', 'drunk'], ['begin', 'began', 'begun'], ['swim', 'swam', 'swum'], ['buy', 'bought', 'bought'], ['think', 'thought', 'thought'],
    ['bring', 'brought', 'brought'], ['teach', 'taught', 'taught'], ['catch', 'caught', 'caught'], ['fly', 'flew', 'flown'], ['know', 'knew', 'known'],
    ['break', 'broke', 'broken'], ['choose', 'chose', 'chosen'], ['forget', 'forgot', 'forgotten'], ['speak', 'spoke', 'spoken'], ['drive', 'drove', 'driven'],
    ['come', 'came', 'come'], ['become', 'became', 'become'], ['run', 'ran', 'run'], ['put', 'put', 'put'], ['read', 'read', 'read'], ['do', 'did', 'done'],
  ];
  for (const [inf, past, pp] of rijtjes) {
    it(`${inf} – ${past} – ${pp}`, () => {
      expect(b(inf, 'past-simple', 0)).toBe(past);
      expect(b(inf, 'present-perfect', 0)).toBe(`have ${pp}`);
      expect(b(inf, 'present-perfect', 2)).toBe(`has ${pp}`);
    });
  }
});

describe('Engels: tijden', () => {
  it('be', () => {
    expect([0, 1, 2, 3, 4, 5].map((i) => b('be', 'present-simple', i))).toEqual(['am', 'are', 'is', 'are', 'are', 'are']);
    expect([0, 1, 2, 3, 4, 5].map((i) => b('be', 'past-simple', i))).toEqual(['was', 'were', 'was', 'were', 'were', 'were']);
  });
  it('alle tijden voor "work" en "go"', () => {
    expect(en.conjugate('work', 'present-simple')).toEqual(['I work', 'you work', 'he/she/it works', 'we work', 'you work', 'they work']);
    expect(b('work', 'present-continuous', 0)).toBe('am working');
    expect(b('work', 'past-continuous', 3)).toBe('were working');
    expect(b('go', 'present-perfect-continuous', 2)).toBe('has been going');
    expect(b('go', 'past-perfect', 4)).toBe('had gone');
    expect(b('go', 'future-will', 5)).toBe('will go');
    expect(b('go', 'going-to', 2)).toBe('is going to go');
    expect(b('go', 'future-perfect', 0)).toBe('will have gone');
  });
  it('samentrekkingen en he/she/it tellen als goed', () => {
    const r = { ...defaultSettings.nakijkregels, allowTypos: false };
    const ok = (g: string, inf: string, t: string, i: number) => checkAnswer(g, en.answer(inf, t, i), r).result;
    expect(ok("I'm working", 'work', 'present-continuous', 0)).toBe('goed');
    expect(ok("she's gone", 'go', 'present-perfect', 2)).toBe('goed');
    expect(ok("they'll go", 'go', 'future-will', 5)).toBe('goed');
    expect(ok('it works', 'work', 'present-simple', 2)).toBe('goed');
    expect(ok('he work', 'work', 'present-simple', 2)).toBe('fout');
    expect(ok('learnt', 'learn', 'past-simple', 0)).toBe('goed');
    expect(ok('we were', 'be', 'past-simple', 3)).toBe('goed');
  });
  it('elk werkwoord heeft alle vormen', () => {
    for (const v of en.verbs) for (const t of en.tenses) for (const f of en.conjugate(v.inf, t.id)) expect(f).not.toMatch(/undefined|\s{2}/);
  });
});
