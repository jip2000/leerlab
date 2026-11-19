import { describe, expect, it } from 'vitest';
import { checkAnswer } from '@/lib/check';
import { defaultSettings } from '@/lib/settings';
import { sentenceTemplates, templateExercise, templateTenses } from '@/features/grammar/templates';
import { buildMix, practiceTopics, tenseUse, verbExercise, WERKWOORDEN } from '@/features/grammar/mix';
import { analysePhotoText } from '@/features/grammar/photo';
import { explanationTopicIds } from '@/features/grammar/tenseLinks';
import { candidates } from '@/features/verbs/trainer';
import { verbEngines } from '@/features/verbs/registry';

const all = (ids: string[]) => () => new Set(ids);

describe('zinnen-sjablonen: een onderwerp in elke tijd', () => {
  it('elk Duits sjabloon werkt in elke tijd (behalve de gebiedende wijs)', () => {
    for (const [topic, list] of Object.entries(sentenceTemplates.de!))
      for (const t of list)
        for (const tense of templateTenses('de')) {
          const ex = templateExercise('de', t, tense);
          expect(ex, `${topic} ${t.verb} ${tense}`).toBeDefined();
          expect(ex!.type === 'gap' && ex!.sentence.split('___').length).toBe(2);
        }
  });

  it('het werkwoord staat op de goede plek', () => {
    const t = sentenceTemplates.de!.voorzetsels!.find((x) => x.verb === 'legen')!;
    const zin = (tense: string) => { const e = templateExercise('de', t, tense)!; return e.type === 'gap' ? e.sentence : ''; };
    expect(zin('praesens')).toBe('Ich lege das Buch auf ___ Tisch.');
    expect(zin('perfekt')).toBe('Ich habe das Buch auf ___ Tisch gelegt.');
    expect(zin('praeteritum')).toBe('Ich legte das Buch auf ___ Tisch.');
    expect(zin('futur1')).toBe('Ich werde das Buch auf ___ Tisch legen.');
    const r = sentenceTemplates.de!['reflexive-verben']!.find((x) => x.verb === 'freuen')!;
    const e = templateExercise('de', r, 'perfekt')!;
    expect(e.type === 'gap' && e.sentence).toBe('Ich habe ___ auf die Ferien gefreut.');
    const g = sentenceTemplates.de!.voorzetsels!.find((x) => x.verb === 'gehen' && x.answer === 'ins')!;
    const e2 = templateExercise('de', g, 'perfekt')!;
    expect(e2.type === 'gap' && e2.sentence).toBe('Ich bin heute ___ Kino gegangen.');
    expect(e2.type === 'gap' && e2.hint).toContain('Perfekt');
  });
});

describe('gemixte ronde', () => {
  const base = { lang: 'de' as const, verbs: verbEngines.de!.verbs.map((v) => v.inf), persons: [0, 1, 2, 3, 4, 5], mode: 'zin' as const, level: 2 as const, cases: new Set(['nom', 'gen', 'dat', 'akk']), parts: all(['akk', 'dat', 'wissel', 'samen', 'bepaald', 'onbepaald', 'zwak', 'gemengd', 'sterk']) };

  it('wisselvoorzetsels in het Perfekt: alleen die, en in het Perfekt', () => {
    const mix = buildMix({ ...base, topics: ['voorzetsels'], tenses: ['perfekt'], count: 6, parts: all(['wissel']) });
    expect(mix).toHaveLength(6);
    for (const m of mix) {
      expect(m.ex.part).toBe('wissel');
      expect(m.ex.type === 'gap' && m.ex.hint).toContain('Perfekt');
    }
  });

  it('werkwoorden en onderwerpen om en om, tot het gekozen aantal', () => {
    const mix = buildMix({ ...base, topics: [WERKWOORDEN, 'reflexive-verben', 'passiv'], tenses: ['praesens', 'perfekt'], count: 9 });
    expect(mix).toHaveLength(9);
    expect(new Set(mix.map((m) => m.topic))).toEqual(new Set([WERKWOORDEN, 'reflexive-verben', 'passiv']));
    expect(mix.filter((m) => m.q)).toHaveLength(3); // werkwoordvragen tellen voor je voortgang per tijd
  });

  it('naamvallen uit = die zinnen weg', () => {
    const mix = buildMix({ ...base, topics: ['naamvallen'], tenses: ['praesens'], count: 30, cases: new Set(['akk']) });
    expect(mix.length).toBeGreaterThan(0);
    for (const m of mix) expect(m.ex.cases ?? ['akk']).toContain('akk');
  });

  it('elke oefenvorm wordt een gewone oefening', () => {
    const pool = candidates(verbEngines.fr!, ['aller', 'être', 'parler'], ['present', 'passe-compose'], [0, 1, 2, 3, 4, 5]);
    const q = { verb: 'aller', tense: 'passe-compose', person: 3 };
    const rij = verbExercise('fr', q, 'rijtje', 2, pool);
    expect(rij.type).toBe('table');
    const zin = verbExercise('fr', q, 'zin', 2, pool);
    expect(zin.type === 'gap' && zin.sentence).toContain('___');
    expect(zin.type === 'gap' && checkAnswer('sommes allés', zin.answer, defaultSettings.nakijkregels).result).toBe('goed');
    const her = verbExercise('fr', q, 'omgekeerd', 2, pool);
    expect(her.type).toBe('choice');
    if (her.type === 'choice') {
      expect(her.options[her.answer]).toBe('aller · passé composé · nous');
      expect(new Set(her.options).size).toBe(her.options.length);
    }
  });

  it('bovenaan te kiezen: werkwoorden vervoegen + onderwerpen, zonder de uitleg van tijden', () => {
    const ids = practiceTopics('de').map((t) => t.id);
    expect(ids[0]).toBe(WERKWOORDEN);
    expect(ids).toContain('voorzetsels');
    expect(ids).toContain('trennbare-verben');
    for (const id of explanationTopicIds('de')) expect(ids).not.toContain(id);
    expect(tenseUse('de', 'voorzetsels')).toBe('sjablonen');
    expect(tenseUse('de', 'modalverben')).toBe('werkwoordgroep');
    expect(tenseUse('de', 'woordvolgorde')).toBe('geen');
  });
});

describe('foto van je grammaticaboek', () => {
  it('Frans: passé composé en de werkwoorden', () => {
    const a = analysePhotoText('fr', `Grammaire – Le passé composé avec être
      Je suis allé au cinéma. Tu es venu hier ? Nous sommes arrivés à huit heures.
      Les verbes: aller, venir, arriver, partir, rester`);
    expect(a.tenses.map((t) => t.id)).toContain('passe-compose');
    expect(a.verbs).toEqual(expect.arrayContaining(['aller', 'venir', 'arriver']));
  });

  it('Duits: wisselvoorzetsels, ook het onderdeel', () => {
    const a = analysePhotoText('de', `Wisselvoorzetsels – Wechselpräpositionen
      an, auf, hinter, in, neben, über, unter, vor, zwischen
      Wo? → Dativ: Das Buch liegt auf dem Tisch.  Wohin? → Akkusativ: Ich lege das Buch auf den Tisch.`);
    const vz = a.topics.find((t) => t.id === 'voorzetsels');
    expect(vz).toBeDefined();
    expect(vz!.parts).toContain('wissel');
  });

  it('Engels: present perfect tegenover past simple', () => {
    const a = analysePhotoText('en', 'Present perfect or past simple? I have lived here for ten years. She went to London yesterday.');
    expect(a.tenses.map((t) => t.id)).toEqual(expect.arrayContaining(['present-perfect', 'past-simple']));
    expect(a.tenses.map((t) => t.id)).not.toContain('present-perfect-continuous');
  });

  it('Spaans: rijtje van het pretérito indefinido', () => {
    const a = analysePhotoText('es', 'hablé hablaste habló hablamos hablasteis hablaron — comí comiste comió');
    expect(a.tenses.map((t) => t.id)).toContain('indefinido');
  });

  it('niets herkend bij gewone tekst', () => {
    const a = analysePhotoText('fr', 'Bonjour à tous, aujourd’hui il fait beau.');
    expect(a.tenses).toHaveLength(0);
    expect(a.topics).toHaveLength(0);
  });
});

describe('foto: geen valse onderwerpen', () => {
  it('"passé composé" is niet ook "passé simple"', () => {
    const a = analysePhotoText('fr', 'Grammaire Le passé composé avec être Je suis allé au cinéma . Tu es venu hier ? Nous sommes arrivés . aller venir arriver partir');
    expect(a.topics.map((t) => t.id)).not.toContain('passe-simple');
    expect(a.tenses.map((t) => t.id)).toContain('passe-compose');
  });
  it('"Passé simple" op de foto wordt wel herkend', () => {
    const a = analysePhotoText('fr', 'Le passé simple (à reconnaître): il parla, ils parlèrent, il fit, il fut, ils furent');
    expect(a.topics.map((t) => t.id)).toContain('passe-simple');
  });
});

describe('der-Gruppe en ein-Gruppe', () => {
  it('het onderwerp is te kiezen, met twee onderdelen, en werkt in elke tijd', () => {
    expect(practiceTopics('de').map((t) => t.id)).toContain('der-ein-gruppe');
    expect(tenseUse('de', 'der-ein-gruppe')).toBe('sjablonen');
    const mix = buildMix({
      lang: 'de', topics: ['der-ein-gruppe'], tenses: ['perfekt'], verbs: [], persons: [0, 1, 2, 3, 4, 5], mode: 'zin', level: 2, count: 5,
      cases: new Set(['nom', 'gen', 'dat', 'akk']), parts: () => new Set(['der-gruppe']),
    });
    expect(mix).toHaveLength(5);
    for (const m of mix) {
      expect(m.ex.part).toBe('der-gruppe');
      expect(m.ex.type === 'gap' && m.ex.hint).toContain('Perfekt');
    }
  });

  it('foto van een der-Gruppe-bladzijde', () => {
    const a = analysePhotoText('de', `Die der-Gruppe: dieser, jener, jeder, welcher, mancher, solcher
      Nominativ dieser diese dieses diese  Dativ diesem dieser diesem diesen  Akkusativ diesen diese dieses diese`);
    const t = a.topics.find((x) => x.id === 'der-ein-gruppe');
    expect(t).toBeDefined();
    expect(t!.parts).toEqual(['der-gruppe']);
  });

  it('foto van een ein-Gruppe-bladzijde', () => {
    const a = analysePhotoText('de', `Die ein-Gruppe: ein, kein, mein, dein, sein, ihr, unser, euer
      Nominativ mein meine mein meine  Akkusativ meinen meine mein meine`);
    const t = a.topics.find((x) => x.id === 'der-ein-gruppe');
    expect(t).toBeDefined();
    expect(t!.parts).toEqual(['ein-gruppe']);
  });
});
