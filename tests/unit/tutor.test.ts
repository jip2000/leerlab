import { describe, expect, it } from 'vitest';
import { bestMatches, greeting, localTutor } from '@/features/tutor/engine';
import { knowledge } from '@/features/tutor/knowledge';

const top = (q: string) => bestMatches(q)[0]?.id;

describe('hulp-tutor', () => {
  it('vindt het juiste antwoord bij gewone vragen', () => {
    expect(top('Hoe maak ik een nieuwe lijst?')).toBe('lijst-maken');
    expect(top('hoe kan ik een foto van mijn boek maken')).toBe('foto');
    expect(top('Wat is een streak??')).toBe('streak');
    expect(top('ik ben een dag vergeten te oefenen')).toBe('bevriezer');
    expect(top('hoe plan ik mijn toets')).toBe('planner');
    expect(top('waarom wordt ecole fout gerekend, het accent')).toBe('nakijken');
    expect(top('hoe zet ik dit op mijn nieuwe telefoon')).toBe('backup');
    expect(top('hoe maak ik een account')).toBe('account');
    expect(top('wat kost plus')).toBe('plus');
    expect(top('hoe vervoeg ik werkwoorden')).toBe('werkwoorden');
    expect(top('Kan ik een lijst naar een klasgenoot sturen?')).toBe('delen');
    expect(top('hoe leer ik woordjes het snelst')).toBe('tips');
  });
  it('geeft een vriendelijk antwoord als hij het niet weet', async () => {
    const r = await localTutor.reply('wat is de hoofdstad van Peru', { path: '/' });
    expect(r.text).toMatch(/geen antwoord/);
  });
  it('geeft knoppen om ergens naartoe te gaan', async () => {
    const r = await localTutor.reply('foto scannen', { path: '/' });
    expect(r.actions[0]).toEqual({ label: 'Foto scannen', to: '/scannen' });
  });
  it('begroet passend bij de pagina', () => {
    expect(greeting('/werkwoorden')).toMatch(/werkwoordtrainer/);
    expect(greeting('/')).toMatch(/Hoi/);
  });
  it('kennisbank: unieke ids en alleen bestaande pagina’s', () => {
    expect(new Set(knowledge.map((k) => k.id)).size).toBe(knowledge.length);
    const pages = ['/', '/lijsten', '/lijsten/nieuw', '/lijsten/importeren', '/oefenen', '/werkwoorden', '/grammatica', '/scannen', '/videos', '/planner', '/statistieken', '/instellingen', '/account', '/plus', '/privacy'];
    for (const k of knowledge) for (const a of k.actions ?? []) expect(pages, k.id).toContain(a.to);
  });
});

describe('hulp-tutor: geen rare extra suggesties', () => {
  it('"Wat is een streak?" noemt niet de tekenbalk', async () => {
    const r = await localTutor.reply('Wat is een streak?', { path: '/' });
    expect(r.text).not.toMatch(/speciale tekens/);
  });
  it('vindt de tekenbalk wel bij een vraag over umlauts', () => {
    expect(bestMatches('hoe typ ik een umlaut')[0]?.id).toBe('tekens');
  });
});
