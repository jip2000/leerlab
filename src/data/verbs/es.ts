/**
 * SPAANSE WERKWOORDEN
 *
 * change = klinkerwisseling in de stam: 'ie' (pensar → pienso), 'ue' (volver → vuelvo),
 *          'i' (pedir → pido), 'u-ue' (jugar → juego). Bij -ir-werkwoorden met 'ie'/'ue'/'i'
 *          verandert e → i / o → u ook in het indefinido (3e persoon), het gerundio en
 *          bij nosotros/vosotros in de subjuntivo.
 * yo = afwijkende yo-vorm in de presente (tengo, conozco); de subjuntivo komt daarvan.
 * Volledig onregelmatige vormen staan uitgeschreven (pres, pret, impf, subj).
 */

type Six = [string, string, string, string, string, string];

export interface EsVerb {
  inf: string;
  nl: string;
  change?: 'ie' | 'ue' | 'i' | 'u-ue';
  yo?: string;
  pres?: Six;
  pret?: Six;
  impf?: Six;
  subj?: Six;
  fut?: string;
  pp?: string;
  ger?: string;
  impTu?: string;
  /** Geen gebiedende wijs (haber, poder). */
  noImp?: boolean;
}

export const esVerbs: EsVerb[] = [
  // Onregelmatig
  { inf: 'ser', nl: 'zijn', pres: ['soy', 'eres', 'es', 'somos', 'sois', 'son'], pret: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
    impf: ['era', 'eras', 'era', 'éramos', 'erais', 'eran'], subj: ['sea', 'seas', 'sea', 'seamos', 'seáis', 'sean'], impTu: 'sé', pp: 'sido', ger: 'siendo' },
  { inf: 'estar', nl: 'zijn (toestand, plaats)', pres: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'],
    pret: ['estuve', 'estuviste', 'estuvo', 'estuvimos', 'estuvisteis', 'estuvieron'], subj: ['esté', 'estés', 'esté', 'estemos', 'estéis', 'estén'], impTu: 'está' },
  { inf: 'ir', nl: 'gaan', pres: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'], pret: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
    impf: ['iba', 'ibas', 'iba', 'íbamos', 'ibais', 'iban'], subj: ['vaya', 'vayas', 'vaya', 'vayamos', 'vayáis', 'vayan'], impTu: 've', pp: 'ido', ger: 'yendo' },
  { inf: 'haber', nl: 'hebben (hulpww.)', pres: ['he', 'has', 'ha', 'hemos', 'habéis', 'han'], pret: ['hube', 'hubiste', 'hubo', 'hubimos', 'hubisteis', 'hubieron'],
    subj: ['haya', 'hayas', 'haya', 'hayamos', 'hayáis', 'hayan'], fut: 'habr', noImp: true },
  { inf: 'tener', nl: 'hebben', change: 'ie', yo: 'tengo', pret: ['tuve', 'tuviste', 'tuvo', 'tuvimos', 'tuvisteis', 'tuvieron'], fut: 'tendr', impTu: 'ten' },
  { inf: 'hacer', nl: 'doen, maken', yo: 'hago', pret: ['hice', 'hiciste', 'hizo', 'hicimos', 'hicisteis', 'hicieron'], fut: 'har', pp: 'hecho', impTu: 'haz' },
  { inf: 'decir', nl: 'zeggen', change: 'i', yo: 'digo', pret: ['dije', 'dijiste', 'dijo', 'dijimos', 'dijisteis', 'dijeron'], fut: 'dir', pp: 'dicho', ger: 'diciendo', impTu: 'di' },
  { inf: 'poder', nl: 'kunnen', change: 'ue', pret: ['pude', 'pudiste', 'pudo', 'pudimos', 'pudisteis', 'pudieron'], fut: 'podr', ger: 'pudiendo', noImp: true },
  { inf: 'querer', nl: 'willen, houden van', change: 'ie', pret: ['quise', 'quisiste', 'quiso', 'quisimos', 'quisisteis', 'quisieron'], fut: 'querr' },
  { inf: 'saber', nl: 'weten', pres: ['sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben'], pret: ['supe', 'supiste', 'supo', 'supimos', 'supisteis', 'supieron'],
    subj: ['sepa', 'sepas', 'sepa', 'sepamos', 'sepáis', 'sepan'], fut: 'sabr' },
  { inf: 'poner', nl: 'zetten, leggen', yo: 'pongo', pret: ['puse', 'pusiste', 'puso', 'pusimos', 'pusisteis', 'pusieron'], fut: 'pondr', pp: 'puesto', impTu: 'pon' },
  { inf: 'venir', nl: 'komen', change: 'ie', yo: 'vengo', pret: ['vine', 'viniste', 'vino', 'vinimos', 'vinisteis', 'vinieron'], fut: 'vendr', ger: 'viniendo', impTu: 'ven' },
  { inf: 'dar', nl: 'geven', pres: ['doy', 'das', 'da', 'damos', 'dais', 'dan'], pret: ['di', 'diste', 'dio', 'dimos', 'disteis', 'dieron'],
    subj: ['dé', 'des', 'dé', 'demos', 'deis', 'den'] },
  { inf: 'ver', nl: 'zien', pres: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'], pret: ['vi', 'viste', 'vio', 'vimos', 'visteis', 'vieron'],
    impf: ['veía', 'veías', 'veía', 'veíamos', 'veíais', 'veían'], pp: 'visto' },
  { inf: 'salir', nl: 'uitgaan, vertrekken', yo: 'salgo', fut: 'saldr', impTu: 'sal' },
  { inf: 'traer', nl: 'brengen', yo: 'traigo', pret: ['traje', 'trajiste', 'trajo', 'trajimos', 'trajisteis', 'trajeron'], ger: 'trayendo', pp: 'traído' },
  { inf: 'oír', nl: 'horen', pres: ['oigo', 'oyes', 'oye', 'oímos', 'oís', 'oyen'], pret: ['oí', 'oíste', 'oyó', 'oímos', 'oísteis', 'oyeron'], fut: 'oir', ger: 'oyendo', pp: 'oído' },
  { inf: 'conducir', nl: 'rijden', yo: 'conduzco', pret: ['conduje', 'condujiste', 'condujo', 'condujimos', 'condujisteis', 'condujeron'] },
  { inf: 'conocer', nl: 'kennen', yo: 'conozco' },
  { inf: 'leer', nl: 'lezen', pret: ['leí', 'leíste', 'leyó', 'leímos', 'leísteis', 'leyeron'], ger: 'leyendo', pp: 'leído' },
  { inf: 'creer', nl: 'geloven', pret: ['creí', 'creíste', 'creyó', 'creímos', 'creísteis', 'creyeron'], ger: 'creyendo', pp: 'creído' },
  // Klinkerwisseling
  { inf: 'pensar', nl: 'denken', change: 'ie' },
  { inf: 'cerrar', nl: 'sluiten', change: 'ie' },
  { inf: 'empezar', nl: 'beginnen', change: 'ie' },
  { inf: 'entender', nl: 'begrijpen', change: 'ie' },
  { inf: 'perder', nl: 'verliezen', change: 'ie' },
  { inf: 'preferir', nl: 'liever hebben', change: 'ie' },
  { inf: 'sentir', nl: 'voelen', change: 'ie' },
  { inf: 'volver', nl: 'terugkomen', change: 'ue', pp: 'vuelto' },
  { inf: 'contar', nl: 'vertellen, tellen', change: 'ue' },
  { inf: 'encontrar', nl: 'vinden', change: 'ue' },
  { inf: 'dormir', nl: 'slapen', change: 'ue' },
  { inf: 'morir', nl: 'sterven', change: 'ue', pp: 'muerto' },
  { inf: 'jugar', nl: 'spelen', change: 'u-ue' },
  { inf: 'pedir', nl: 'vragen, bestellen', change: 'i' },
  { inf: 'servir', nl: 'serveren', change: 'i' },
  { inf: 'repetir', nl: 'herhalen', change: 'i' },
  { inf: 'seguir', nl: 'volgen', change: 'i', yo: 'sigo' },
  { inf: 'elegir', nl: 'kiezen', change: 'i', yo: 'elijo' },
  // Regelmatig
  { inf: 'hablar', nl: 'spreken, praten' },
  { inf: 'trabajar', nl: 'werken' },
  { inf: 'estudiar', nl: 'studeren' },
  { inf: 'escuchar', nl: 'luisteren' },
  { inf: 'comprar', nl: 'kopen' },
  { inf: 'llamar', nl: 'roepen, bellen' },
  { inf: 'buscar', nl: 'zoeken' },
  { inf: 'llegar', nl: 'aankomen' },
  { inf: 'pagar', nl: 'betalen' },
  { inf: 'comer', nl: 'eten' },
  { inf: 'beber', nl: 'drinken' },
  { inf: 'aprender', nl: 'leren' },
  { inf: 'coger', nl: 'pakken', yo: 'cojo' },
  { inf: 'vivir', nl: 'wonen, leven' },
  { inf: 'escribir', nl: 'schrijven', pp: 'escrito' },
  { inf: 'abrir', nl: 'openen', pp: 'abierto' },
  { inf: 'recibir', nl: 'ontvangen' },
  { inf: 'decidir', nl: 'besluiten' },
];
