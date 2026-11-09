/**
 * BADGES. Een badge heb je voor altijd als je hem eenmaal hebt verdiend.
 * Nieuwe badge toevoegen? Zet hem in deze lijst met een `earned`-regel.
 */
export interface BadgeStats {
  lists: number;
  sessions: number;
  streak: number;
  correctTotal: number;
  xp: number;
  level: number;
  goalReachedToday: boolean;
  /** Totaal aantal goed vervoegde werkwoorden. */
  verbsCorrect?: number;
  /** Info over de sessie die net klaar is (als die er is). */
  session?: { mode: string; total: number; percentage: number; grade?: number };
}

export interface BadgeDef {
  id: string;
  emoji: string;
  title: string;
  description: string;
  earned: (s: BadgeStats) => boolean;
}

export const badgeDefs: BadgeDef[] = [
  { id: 'eerste-lijst', emoji: '📒', title: 'Eerste lijst', description: 'Je hebt je eerste woordenlijst gemaakt.', earned: (s) => s.lists >= 1 },
  { id: 'eerste-oefening', emoji: '🎯', title: 'Van start', description: 'Je hebt je eerste oefening afgemaakt.', earned: (s) => s.sessions >= 1 },
  { id: 'dagdoel', emoji: '⭐', title: 'Doel gehaald', description: 'Je hebt je dagdoel gehaald.', earned: (s) => s.goalReachedToday },
  { id: 'streak-3', emoji: '🔥', title: '3 dagen op rij', description: 'Drie dagen achter elkaar geoefend.', earned: (s) => s.streak >= 3 },
  { id: 'streak-7', emoji: '🔥', title: 'Een hele week', description: 'Zeven dagen achter elkaar geoefend.', earned: (s) => s.streak >= 7 },
  { id: 'streak-30', emoji: '🏆', title: 'Een maand lang', description: 'Dertig dagen achter elkaar geoefend.', earned: (s) => s.streak >= 30 },
  { id: 'goed-100', emoji: '💯', title: '100 goed', description: '100 vragen goed beantwoord.', earned: (s) => s.correctTotal >= 100 },
  { id: 'goed-1000', emoji: '🧠', title: '1000 goed', description: '1000 vragen goed beantwoord.', earned: (s) => s.correctTotal >= 1000 },
  { id: 'werkwoorden-100', emoji: '🔤', title: '100 werkwoorden', description: '100 werkwoordsvormen goed vervoegd.', earned: (s) => (s.verbsCorrect ?? 0) >= 100 },
  { id: 'foutloos', emoji: '✨', title: 'Foutloos', description: 'Een oefening van minstens 10 woorden helemaal goed.', earned: (s) => !!s.session && s.session.total >= 10 && s.session.percentage === 100 },
  { id: 'toets-10', emoji: '🥇', title: 'Een tien!', description: 'Een 10 gehaald in de toets-modus.', earned: (s) => s.session?.mode === 'toets' && s.session.grade === 10 },
  { id: 'level-5', emoji: '🚀', title: 'Level 5', description: 'Level 5 bereikt.', earned: (s) => s.level >= 5 },
  { id: 'level-10', emoji: '🌟', title: 'Level 10', description: 'Level 10 bereikt.', earned: (s) => s.level >= 10 },
];

export function newlyEarned(stats: BadgeStats, owned: Set<string>): BadgeDef[] {
  return badgeDefs.filter((b) => !owned.has(b.id) && b.earned(stats));
}
