/**
 * TALEN
 *
 * Hier staan alle talen van Woordwerk. Een nieuwe taal toevoegen?
 * Voeg een nieuw blok toe aan de lijst `languages` hieronder (en later een databestand
 * in src/data/grammar/<code>/ en src/data/verbs/<code>/).
 */

export type LanguageCode =
  | 'nl' | 'en' | 'fr' | 'de' | 'es' | 'pt' | 'it' | 'la' | 'grc' | 'sv'
  | 'da' | 'no' | 'pl' | 'cs' | 'fi' | 'el' | 'ru' | 'tr' | 'fy';

export interface GrammarTopic {
  /** Unieke id binnen de taal, bijv. "passe-compose". Wordt ook de bestandsnaam. */
  id: string;
  /** Titel in het Nederlands. */
  title: string;
}

export interface Language {
  code: LanguageCode;
  /** Naam in het Nederlands. */
  name: string;
  /** Naam in de taal zelf. */
  nativeName: string;
  /** Vlag-emoji; leeg als er geen passende vlag is (Latijn, Oudgrieks, Fries). */
  flag: string;
  /** Kleur van het vak (hex), gebruikt voor mappen en labels. */
  color: string;
  /** Tekens voor de knoppenbalk tijdens het typen. */
  specialChars: string[];
  /** Taal voor voorlezen (Web Speech API), bijv. "fr-FR". Leeg = geen stem. */
  speechLang: string;
  /** Taalpakket voor tekstherkenning (Tesseract.js). */
  ocrCode: string;
  /** Van rechts naar links schrijven (voor later, bijv. Arabisch). */
  rtl: boolean;
  /** Prioriteit voor grammatica-inhoud: 1 = eerst, 3 = later. */
  grammarPriority: 1 | 2 | 3;
  /** Grammatica-onderwerpen (inhoud komt in fase 6). */
  grammarTopics: GrammarTopic[];
}

const t = (id: string, title: string): GrammarTopic => ({ id, title });

const greekLower = 'α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ σ ς τ υ φ χ ψ ω'.split(' ');
const cyrillicLower = 'а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я'.split(' ');

/** Basis-onderwerpen voor talen die (nog) niet uitgebreid zijn. */
const basisOnderwerpen = [
  t('lidwoorden-geslacht', 'Lidwoorden en geslacht'),
  t('telwoorden', 'Telwoorden'),
  t('werkwoorden-presens', 'De 20 belangrijkste werkwoorden (tegenwoordige tijd)'),
];

export const languages: Language[] = [
  {
    code: 'nl', name: 'Nederlands', nativeName: 'Nederlands', flag: '🇳🇱', color: '#C2561A',
    specialChars: ['é', 'ë', 'ï', 'ö', 'ü'],
    speechLang: 'nl-NL', ocrCode: 'nld', rtl: false, grammarPriority: 2,
    grammarTopics: [
      t('werkwoordspelling', 'Werkwoordspelling (d/t/dt)'),
      t('verleden-tijd', "Verleden tijd en 't kofschip"),
      t('voltooid-deelwoord', 'Voltooid deelwoord'),
      t('zinsontleding', 'Zinsontleding'),
      t('woordsoorten', 'Woordsoorten'),
    ],
  },
  {
    code: 'en', name: 'Engels', nativeName: 'English', flag: '🇬🇧', color: '#5B5BD6',
    specialChars: [],
    speechLang: 'en-GB', ocrCode: 'eng', rtl: false, grammarPriority: 1,
    grammarTopics: [
      t('present-simple-continuous', 'Present simple en continuous'),
      t('past-simple-continuous', 'Past simple en continuous'),
      t('present-perfect', 'Present perfect (simple en continuous)'),
      t('past-perfect', 'Past perfect'),
      t('future', 'Future: will, going to, present continuous'),
      t('future-perfect', 'Future perfect'),
      t('irregular-verbs', 'Onregelmatige werkwoorden'),
      t('conditionals', 'Conditionals (0, 1, 2, 3)'),
      t('passive', 'Passive voice'),
      t('reported-speech', 'Reported speech'),
      t('modals', 'Modale werkwoorden'),
      t('adjectives-adverbs', 'Bijvoeglijke naamwoorden en bijwoorden'),
      t('comparison', 'Trappen van vergelijking'),
      t('quantifiers', 'Some/any, much/many, a few/a little'),
      t('relative-pronouns', 'Betrekkelijke voornaamwoorden'),
      t('gerund-infinitive', 'Gerund of to-infinitive'),
    ],
  },
  {
    code: 'fr', name: 'Frans', nativeName: 'Français', flag: '🇫🇷', color: '#2F6FDB',
    specialChars: ['é', 'è', 'ê', 'ë', 'à', 'â', 'ç', 'ù', 'û', 'ü', 'î', 'ï', 'ô', 'œ', 'æ', '«', '»'],
    speechLang: 'fr-FR', ocrCode: 'fra', rtl: false, grammarPriority: 1,
    grammarTopics: [
      t('present', 'Présent'),
      t('passe-compose', 'Passé composé (avoir/être, accord)'),
      t('imparfait', 'Imparfait'),
      t('plus-que-parfait', 'Plus-que-parfait'),
      t('futur-simple', 'Futur simple'),
      t('futur-proche', 'Futur proche'),
      t('passe-recent', 'Passé récent'),
      t('conditionnel', 'Conditionnel présent en passé'),
      t('subjonctif', 'Subjonctif présent'),
      t('imperatif', 'Impératif'),
      t('passe-simple', 'Passé simple (herkennen)'),
      t('gerondif', 'Gérondif'),
      t('lidwoorden', 'Lidwoorden (ook partitif)'),
      t('adjectifs', 'Bijvoeglijke naamwoorden'),
      t('pronoms-personnels', 'Persoonlijke voornaamwoorden, y en en'),
      t('possessifs-demonstratifs', 'Bezittelijke en aanwijzende voornaamwoorden'),
      t('pronoms-relatifs', 'Betrekkelijke voornaamwoorden'),
      t('negation', 'Ontkenning'),
      t('questions', 'Vragen stellen'),
      t('si-zinnen', 'Si-zinnen'),
      t('nombres-heure-date', 'Telwoorden, klok en datum'),
    ],
  },
  {
    code: 'de', name: 'Duits', nativeName: 'Deutsch', flag: '🇩🇪', color: '#D33F3F',
    specialChars: ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'],
    speechLang: 'de-DE', ocrCode: 'deu', rtl: false, grammarPriority: 1,
    grammarTopics: [
      t('naamvallen', 'Naamvallen'),
      t('voorzetsels', 'Voorzetsels en wisselvoorzetsels'),
      t('adjektivdeklination', 'Verbuiging bijvoeglijk naamwoord'),
      t('praesens', 'Präsens'),
      t('perfekt', 'Perfekt (haben/sein)'),
      t('praeteritum', 'Präteritum'),
      t('plusquamperfekt', 'Plusquamperfekt'),
      t('futur-1', 'Futur I'),
      t('konjunktiv-2', 'Konjunktiv II'),
      t('imperativ', 'Imperativ'),
      t('passiv', 'Passiv'),
      t('trennbare-verben', 'Scheidbare werkwoorden'),
      t('modalverben', 'Modale werkwoorden'),
      t('reflexive-verben', 'Wederkerende werkwoorden'),
      t('woordvolgorde', 'Woordvolgorde'),
      t('personalpronomen', 'Persoonlijke voornaamwoorden'),
      t('zahlen-uhrzeit-datum', 'Telwoorden, klok en datum'),
    ],
  },
  {
    code: 'es', name: 'Spaans', nativeName: 'Español', flag: '🇪🇸', color: '#AD5C08',
    specialChars: ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'],
    speechLang: 'es-ES', ocrCode: 'spa', rtl: false, grammarPriority: 1,
    grammarTopics: [
      t('ser-estar-hay', 'Ser, estar en hay'),
      t('presente', 'Presente'),
      t('preterito-perfecto', 'Pretérito perfecto'),
      t('indefinido', 'Pretérito indefinido'),
      t('imperfecto', 'Imperfecto'),
      t('pluscuamperfecto', 'Pluscuamperfecto'),
      t('futuro', 'Futuro'),
      t('condicional', 'Condicional'),
      t('subjuntivo', 'Subjuntivo presente en imperfecto'),
      t('imperativo', 'Imperativo'),
      t('gerundio', 'Gerundio (estar + -ando/-iendo)'),
      t('klinkerwisseling', 'Klinkerwisselende werkwoorden'),
      t('gustar', 'De gustar-constructie'),
      t('lidwoorden-geslacht', 'Lidwoorden, geslacht en meervoud'),
      t('pronombres', 'Voornaamwoorden (le → se)'),
      t('por-para', 'Por of para'),
    ],
  },
  {
    code: 'pt', name: 'Portugees', nativeName: 'Português', flag: '🇵🇹', color: '#13786C',
    specialChars: ['á', 'à', 'â', 'ã', 'é', 'ê', 'í', 'ó', 'ô', 'õ', 'ú', 'ç'],
    speechLang: 'pt-PT', ocrCode: 'por', rtl: false, grammarPriority: 2,
    grammarTopics: [
      t('ser-estar', 'Ser en estar'),
      t('tijden', 'Tijden'),
      t('conjuntivo', 'Conjuntivo'),
      t('infinitivo-pessoal', 'Persoonlijke infinitief'),
      t('pronomes', 'Voornaamwoorden en hun plaats'),
    ],
  },
  {
    code: 'it', name: 'Italiaans', nativeName: 'Italiano', flag: '🇮🇹', color: '#237A3D',
    specialChars: ['à', 'è', 'é', 'ì', 'ò', 'ù'],
    speechLang: 'it-IT', ocrCode: 'ita', rtl: false, grammarPriority: 2,
    grammarTopics: [
      t('essere-avere', 'Essere en avere'),
      t('tijden', 'Tijden'),
      t('congiuntivo', 'Congiuntivo'),
      t('imperativo', 'Imperativo'),
      t('articoli', 'Lidwoorden'),
      t('preposizioni-articolate', 'Voorzetsels met lidwoord'),
    ],
  },
  {
    code: 'la', name: 'Latijn', nativeName: 'Latina', flag: '', color: '#9A6B2F',
    specialChars: ['ā', 'ē', 'ī', 'ō', 'ū'],
    speechLang: 'it-IT', ocrCode: 'lat', rtl: false, grammarPriority: 2,
    grammarTopics: [
      t('declinaties', 'Declinaties 1 t/m 5'),
      t('adjectieven', 'Adjectieven'),
      t('pronomina', 'Voornaamwoorden'),
      t('conjugaties', 'Conjugaties 1 t/m 4 en gemengd'),
      t('onregelmatig', 'Esse, posse, ire, ferre, velle'),
      t('tijden-wijzen', 'Tijden, wijzen en genus'),
      t('participia-infinitivi', 'Participia en infinitivi'),
      t('determineren', 'Determineren'),
      t('stamtijden', 'Stamtijden'),
    ],
  },
  {
    code: 'grc', name: 'Oudgrieks', nativeName: 'Ἑλληνική', flag: '', color: '#7A4FB5',
    specialChars: [...greekLower, 'ά', 'ὰ', 'ᾶ', 'ἀ', 'ἁ', 'ᾳ', 'ῃ', 'ῳ'],
    speechLang: '', ocrCode: 'grc', rtl: false, grammarPriority: 3,
    grammarTopics: [
      t('alfabet-accenten', 'Alfabet en accenten'),
      t('lidwoord', 'Lidwoord'),
      t('declinaties', 'Declinaties'),
      t('werkwoorden', 'Praesens, imperfectum en aoristus'),
    ],
  },
  {
    code: 'sv', name: 'Zweeds', nativeName: 'Svenska', flag: '🇸🇪', color: '#2A7AB8',
    specialChars: ['å', 'ä', 'ö'],
    speechLang: 'sv-SE', ocrCode: 'swe', rtl: false, grammarPriority: 3, grammarTopics: basisOnderwerpen,
  },
  {
    code: 'da', name: 'Deens', nativeName: 'Dansk', flag: '🇩🇰', color: '#C8324A',
    specialChars: ['æ', 'ø', 'å'],
    speechLang: 'da-DK', ocrCode: 'dan', rtl: false, grammarPriority: 3, grammarTopics: basisOnderwerpen,
  },
  {
    code: 'no', name: 'Noors', nativeName: 'Norsk', flag: '🇳🇴', color: '#B5403A',
    specialChars: ['æ', 'ø', 'å'],
    speechLang: 'nb-NO', ocrCode: 'nor', rtl: false, grammarPriority: 3, grammarTopics: basisOnderwerpen,
  },
  {
    code: 'pl', name: 'Pools', nativeName: 'Polski', flag: '🇵🇱', color: '#C23A6B',
    specialChars: ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'],
    speechLang: 'pl-PL', ocrCode: 'pol', rtl: false, grammarPriority: 3, grammarTopics: basisOnderwerpen,
  },
  {
    code: 'cs', name: 'Tsjechisch', nativeName: 'Čeština', flag: '🇨🇿', color: '#3A5FB5',
    specialChars: ['á', 'č', 'ď', 'é', 'ě', 'í', 'ň', 'ó', 'ř', 'š', 'ť', 'ú', 'ů', 'ý', 'ž'],
    speechLang: 'cs-CZ', ocrCode: 'ces', rtl: false, grammarPriority: 3, grammarTopics: basisOnderwerpen,
  },
  {
    code: 'fi', name: 'Fins', nativeName: 'Suomi', flag: '🇫🇮', color: '#2B6CA8',
    specialChars: ['ä', 'ö'],
    speechLang: 'fi-FI', ocrCode: 'fin', rtl: false, grammarPriority: 3, grammarTopics: basisOnderwerpen,
  },
  {
    code: 'el', name: 'Grieks', nativeName: 'Ελληνικά', flag: '🇬🇷', color: '#1F6FAE',
    specialChars: [...greekLower, 'ά', 'έ', 'ή', 'ί', 'ό', 'ύ', 'ώ', 'ϊ', 'ϋ'],
    speechLang: 'el-GR', ocrCode: 'ell', rtl: false, grammarPriority: 3, grammarTopics: basisOnderwerpen,
  },
  {
    code: 'ru', name: 'Russisch', nativeName: 'Русский', flag: '🇷🇺', color: '#5A6C8F',
    specialChars: cyrillicLower,
    speechLang: 'ru-RU', ocrCode: 'rus', rtl: false, grammarPriority: 3, grammarTopics: basisOnderwerpen,
  },
  {
    code: 'tr', name: 'Turks', nativeName: 'Türkçe', flag: '🇹🇷', color: '#D0453A',
    specialChars: ['ç', 'ğ', 'ı', 'İ', 'ö', 'ş', 'ü'],
    speechLang: 'tr-TR', ocrCode: 'tur', rtl: false, grammarPriority: 3, grammarTopics: basisOnderwerpen,
  },
  {
    code: 'fy', name: 'Fries', nativeName: 'Frysk', flag: '', color: '#2C66BE',
    specialChars: ['â', 'ê', 'ô', 'û', 'ú'],
    speechLang: '', ocrCode: 'fry', rtl: false, grammarPriority: 3, grammarTopics: basisOnderwerpen,
  },
];

const byCode = new Map(languages.map((l) => [l.code, l]));

export function getLanguage(code: LanguageCode): Language {
  const lang = byCode.get(code);
  if (!lang) throw new Error(`Onbekende taal: ${code}`);
  return lang;
}

/** Korte afkorting voor het taalbadge, bijv. "FR" of "GRC". */
export function languageTag(code: LanguageCode): string {
  return code.toUpperCase();
}
