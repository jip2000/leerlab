/**
 * DUITSE WERKWOORDEN
 *
 * Zwak (regelmatig): alleen infinitief + vertaling. Let op: prefix = scheidbaar voorvoegsel.
 * Sterk / gemengd: du- en er-vorm in het Präsens (als de klinker verandert), stam van het Präteritum,
 *   voltooid deelwoord (Partizip II), gebiedende wijs voor du (als die afwijkt).
 *   mixed = gemengd: Präteritum met zwakke uitgangen (brachte, dachte).
 * aux 'sein' = Perfekt met sein.
 * k2 = eigen Konjunktiv II-stam (wäre, hätte, käme); anders würde + infinitief.
 */

export interface DeVerb {
  inf: string;
  nl: string;
  aux?: 'sein';
  prefix?: string;
  du?: string;
  er?: string;
  praet?: string;
  mixed?: boolean;
  pp?: string;
  impDu?: string;
  k2?: string;
  /** Konjunktiv II alleen met de eigen vorm (geen würde-variant). */
  k2Only?: boolean;
  /** Volledig onregelmatig Präsens. */
  pres?: [string, string, string, string, string, string];
  /** Geen gebiedende wijs. */
  noImp?: boolean;
  modal?: boolean;
}

export const deVerbs: DeVerb[] = [
  // Onregelmatig
  { inf: 'sein', nl: 'zijn', aux: 'sein', pres: ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'], praet: 'war', pp: 'gewesen', k2: 'wär', k2Only: true },
  { inf: 'haben', nl: 'hebben', pres: ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'], praet: 'hatte', mixed: true, pp: 'gehabt', k2: 'hätt', k2Only: true },
  { inf: 'werden', nl: 'worden', aux: 'sein', pres: ['werde', 'wirst', 'wird', 'werden', 'werdet', 'werden'], praet: 'wurde', mixed: true, pp: 'geworden', k2: 'würd', k2Only: true },
  { inf: 'wissen', nl: 'weten', pres: ['weiß', 'weißt', 'weiß', 'wissen', 'wisst', 'wissen'], praet: 'wusste', mixed: true, pp: 'gewusst', k2: 'wüsst' },
  { inf: 'tun', nl: 'doen', pres: ['tue', 'tust', 'tut', 'tun', 'tut', 'tun'], praet: 'tat', pp: 'getan', impDu: 'tu' },
  // Modaal
  { inf: 'können', nl: 'kunnen', modal: true, pres: ['kann', 'kannst', 'kann', 'können', 'könnt', 'können'], praet: 'konnte', mixed: true, pp: 'gekonnt', k2: 'könnt', k2Only: true, noImp: true },
  { inf: 'müssen', nl: 'moeten', modal: true, pres: ['muss', 'musst', 'muss', 'müssen', 'müsst', 'müssen'], praet: 'musste', mixed: true, pp: 'gemusst', k2: 'müsst', k2Only: true, noImp: true },
  { inf: 'dürfen', nl: 'mogen', modal: true, pres: ['darf', 'darfst', 'darf', 'dürfen', 'dürft', 'dürfen'], praet: 'durfte', mixed: true, pp: 'gedurft', k2: 'dürft', k2Only: true, noImp: true },
  { inf: 'sollen', nl: 'moeten, zullen', modal: true, pres: ['soll', 'sollst', 'soll', 'sollen', 'sollt', 'sollen'], praet: 'sollte', mixed: true, pp: 'gesollt', k2: 'sollt', k2Only: true, noImp: true },
  { inf: 'wollen', nl: 'willen', modal: true, pres: ['will', 'willst', 'will', 'wollen', 'wollt', 'wollen'], praet: 'wollte', mixed: true, pp: 'gewollt', k2: 'wollt', k2Only: true, noImp: true },
  { inf: 'mögen', nl: 'graag hebben, lusten', modal: true, pres: ['mag', 'magst', 'mag', 'mögen', 'mögt', 'mögen'], praet: 'mochte', mixed: true, pp: 'gemocht', k2: 'möcht', k2Only: true, noImp: true },
  // Gemengd
  { inf: 'bringen', nl: 'brengen', praet: 'brachte', mixed: true, pp: 'gebracht' },
  { inf: 'denken', nl: 'denken', praet: 'dachte', mixed: true, pp: 'gedacht' },
  { inf: 'kennen', nl: 'kennen', praet: 'kannte', mixed: true, pp: 'gekannt' },
  { inf: 'rennen', nl: 'rennen', aux: 'sein', praet: 'rannte', mixed: true, pp: 'gerannt' },
  // Sterk
  { inf: 'fahren', nl: 'rijden, gaan (met vervoer)', aux: 'sein', du: 'fährst', er: 'fährt', praet: 'fuhr', pp: 'gefahren' },
  { inf: 'schlafen', nl: 'slapen', du: 'schläfst', er: 'schläft', praet: 'schlief', pp: 'geschlafen' },
  { inf: 'laufen', nl: 'lopen', aux: 'sein', du: 'läufst', er: 'läuft', praet: 'lief', pp: 'gelaufen' },
  { inf: 'tragen', nl: 'dragen', du: 'trägst', er: 'trägt', praet: 'trug', pp: 'getragen' },
  { inf: 'fallen', nl: 'vallen', aux: 'sein', du: 'fällst', er: 'fällt', praet: 'fiel', pp: 'gefallen' },
  { inf: 'halten', nl: 'houden', du: 'hältst', er: 'hält', praet: 'hielt', pp: 'gehalten' },
  { inf: 'lassen', nl: 'laten', du: 'lässt', er: 'lässt', praet: 'ließ', pp: 'gelassen' },
  { inf: 'geben', nl: 'geven', du: 'gibst', er: 'gibt', praet: 'gab', pp: 'gegeben', impDu: 'gib' },
  { inf: 'nehmen', nl: 'nemen', du: 'nimmst', er: 'nimmt', praet: 'nahm', pp: 'genommen', impDu: 'nimm' },
  { inf: 'sprechen', nl: 'spreken', du: 'sprichst', er: 'spricht', praet: 'sprach', pp: 'gesprochen', impDu: 'sprich' },
  { inf: 'helfen', nl: 'helpen', du: 'hilfst', er: 'hilft', praet: 'half', pp: 'geholfen', impDu: 'hilf' },
  { inf: 'essen', nl: 'eten', du: 'isst', er: 'isst', praet: 'aß', pp: 'gegessen', impDu: 'iss' },
  { inf: 'treffen', nl: 'ontmoeten', du: 'triffst', er: 'trifft', praet: 'traf', pp: 'getroffen', impDu: 'triff' },
  { inf: 'sehen', nl: 'zien', du: 'siehst', er: 'sieht', praet: 'sah', pp: 'gesehen', impDu: 'sieh' },
  { inf: 'lesen', nl: 'lezen', du: 'liest', er: 'liest', praet: 'las', pp: 'gelesen', impDu: 'lies' },
  { inf: 'vergessen', nl: 'vergeten', du: 'vergisst', er: 'vergisst', praet: 'vergaß', pp: 'vergessen', impDu: 'vergiss' },
  { inf: 'sterben', nl: 'sterven', aux: 'sein', du: 'stirbst', er: 'stirbt', praet: 'starb', pp: 'gestorben', impDu: 'stirb' },
  { inf: 'gehen', nl: 'gaan, lopen', aux: 'sein', praet: 'ging', pp: 'gegangen', k2: 'ging' },
  { inf: 'kommen', nl: 'komen', aux: 'sein', praet: 'kam', pp: 'gekommen', k2: 'käm' },
  { inf: 'bleiben', nl: 'blijven', aux: 'sein', praet: 'blieb', pp: 'geblieben' },
  { inf: 'schreiben', nl: 'schrijven', praet: 'schrieb', pp: 'geschrieben' },
  { inf: 'finden', nl: 'vinden', praet: 'fand', pp: 'gefunden' },
  { inf: 'trinken', nl: 'drinken', praet: 'trank', pp: 'getrunken' },
  { inf: 'singen', nl: 'zingen', praet: 'sang', pp: 'gesungen' },
  { inf: 'schwimmen', nl: 'zwemmen', aux: 'sein', praet: 'schwamm', pp: 'geschwommen' },
  { inf: 'beginnen', nl: 'beginnen', praet: 'begann', pp: 'begonnen' },
  { inf: 'liegen', nl: 'liggen', praet: 'lag', pp: 'gelegen' },
  { inf: 'sitzen', nl: 'zitten', praet: 'saß', pp: 'gesessen' },
  { inf: 'stehen', nl: 'staan', praet: 'stand', pp: 'gestanden' },
  { inf: 'verstehen', nl: 'begrijpen', praet: 'verstand', pp: 'verstanden' },
  { inf: 'rufen', nl: 'roepen', praet: 'rief', pp: 'gerufen' },
  { inf: 'fliegen', nl: 'vliegen', aux: 'sein', praet: 'flog', pp: 'geflogen' },
  { inf: 'bitten', nl: 'vragen, verzoeken', praet: 'bat', pp: 'gebeten' },
  { inf: 'heißen', nl: 'heten', praet: 'hieß', pp: 'geheißen' },
  // Scheidbaar (sterk)
  { inf: 'aufstehen', nl: 'opstaan', prefix: 'auf', aux: 'sein', praet: 'stand', pp: 'gestanden' },
  { inf: 'anfangen', nl: 'beginnen', prefix: 'an', du: 'fängst', er: 'fängt', praet: 'fing', pp: 'gefangen' },
  { inf: 'anrufen', nl: 'opbellen', prefix: 'an', praet: 'rief', pp: 'gerufen' },
  { inf: 'fernsehen', nl: 'tv-kijken', prefix: 'fern', du: 'siehst', er: 'sieht', praet: 'sah', pp: 'gesehen', impDu: 'sieh' },
  { inf: 'mitnehmen', nl: 'meenemen', prefix: 'mit', du: 'nimmst', er: 'nimmt', praet: 'nahm', pp: 'genommen', impDu: 'nimm' },
  // Zwak
  { inf: 'machen', nl: 'maken, doen' },
  { inf: 'spielen', nl: 'spelen' },
  { inf: 'wohnen', nl: 'wonen' },
  { inf: 'lernen', nl: 'leren' },
  { inf: 'kaufen', nl: 'kopen' },
  { inf: 'fragen', nl: 'vragen' },
  { inf: 'sagen', nl: 'zeggen' },
  { inf: 'hören', nl: 'horen' },
  { inf: 'brauchen', nl: 'nodig hebben' },
  { inf: 'kochen', nl: 'koken' },
  { inf: 'arbeiten', nl: 'werken' },
  { inf: 'warten', nl: 'wachten' },
  { inf: 'antworten', nl: 'antwoorden' },
  { inf: 'öffnen', nl: 'openen' },
  { inf: 'tanzen', nl: 'dansen' },
  { inf: 'reisen', nl: 'reizen', aux: 'sein' },
  { inf: 'besuchen', nl: 'bezoeken' },
  { inf: 'erzählen', nl: 'vertellen' },
  { inf: 'studieren', nl: 'studeren' },
  { inf: 'telefonieren', nl: 'telefoneren' },
  { inf: 'einkaufen', nl: 'boodschappen doen', prefix: 'ein' },
  { inf: 'aufräumen', nl: 'opruimen', prefix: 'auf' },
];
