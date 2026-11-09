/**
 * HULP-TUTOR
 *
 * Werkt zonder internet en zonder AI: hij zoekt het beste antwoord in de kennisbank.
 * Later kan er een echte AI bij (bijv. Claude) via een eigen kleine server: maak dan een
 * andere TutorEngine met dezelfde vorm. Zet NOOIT een API-sleutel in de website zelf.
 */
import { knowledge, type KnowledgeItem, type TutorAction } from './knowledge';

export interface TutorReply {
  text: string;
  actions: TutorAction[];
}

export interface TutorEngine {
  reply(question: string, ctx: { path: string }): Promise<TutorReply>;
}

const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

/** Zoekt de best passende antwoorden. Langere trefwoorden tellen zwaarder. */
export function scored(question: string): { k: KnowledgeItem; score: number }[] {
  const q = ` ${fold(question).replace(/[^\p{L}\p{N}]+/gu, ' ')} `;
  const scored = knowledge
    .map((k) => ({
      k,
      score: k.keywords.reduce((s, kw) => {
        const f = fold(kw);
        if (f.length < 3) return s; // losse tekens (é, ß) matchen anders met gewone woorden
        const hit = f.includes(' ') ? q.includes(` ${f} `) || q.includes(f) : new RegExp(`\\s${f}\\w{0,4}\\s`).test(q);
        return hit ? s + f.split(' ').length * 2 + f.length / 10 : s;
      }, 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored;
}

export function bestMatches(question: string, n = 1): KnowledgeItem[] {
  return scored(question).slice(0, n).map((x) => x.k);
}

const GREETINGS: [RegExp, string][] = [
  [/^\/lijsten/, 'Je bent bij je lijsten. Vraag me bijvoorbeeld hoe je woorden plakt of een lijst deelt.'],
  [/^\/oefenen/, 'Je bent bij Oefenen. Vraag me welke manier van oefenen bij jou past.'],
  [/^\/werkwoorden/, 'Je bent bij de werkwoordtrainer. Vraag me hoe de oefenvormen werken.'],
  [/^\/grammatica/, 'Je bent bij Grammatica. Lees eerst de uitleg en oefen daarna.'],
  [/^\/scannen/, 'Tip: leg je boek plat, zorg voor goed licht en snij alleen de woordjes bij.'],
  [/^\/planner/, 'Zet je toets in de planner, dan krijg je elke dag een stukje om te leren.'],
];

export function greeting(path: string): string {
  return GREETINGS.find(([re]) => re.test(path))?.[1] ?? 'Hoi! Ik ben je hulp in Woordwerk. Stel me een vraag over de site, of kies hieronder een vraag.';
}

export const localTutor: TutorEngine = {
  async reply(question) {
    const [b, s] = scored(question);
    const best = b?.k;
    // Een tweede antwoord alleen noemen als het bijna even goed past.
    const second = s && s.score >= b!.score * 0.7 ? s.k : undefined;
    if (!best) {
      return {
        text: 'Daar weet ik (nog) geen antwoord op. Ik help je met alles in Woordwerk: lijsten, oefenen, foto scannen, werkwoorden, grammatica, je streak, de planner en back-ups. Probeer het anders te vragen, of kies een vraag hieronder.',
        actions: [],
      };
    }
    const more = second ? `\n\nMisschien bedoel je ook: ${second.answer.split('. ')[0]}.` : '';
    return { text: best.answer + more, actions: best.actions ?? [] };
  },
};
