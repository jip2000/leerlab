/**
 * STARTLIJSTEN
 *
 * Eigen woordenlijsten per thema (zelf geschreven, niet uit een lesmethode),
 * voor talen die je meestal niet op school krijgt.
 * Links staat de vreemde taal, rechts het Nederlands.
 * Meerdere goede antwoorden scheid je met ";".
 *
 * Een woord: [woord, vertaling] of [woord, vertaling, lidwoord/geslacht].
 */
import type { LanguageCode } from '@/data/languages';

export type StarterWord = [word: string, translation: string, article?: string];

export interface StarterList {
  id: string;
  lang: LanguageCode;
  theme: string;
  words: StarterWord[];
}

const themes = {
  begroeten: 'Begroeten en beleefd zijn',
  getallen: 'Getallen 1 tot en met 10',
  eten: 'Eten en drinken',
} as const;

type ThemeId = keyof typeof themes;

const getallenNl = ['een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien'];
const getallen = (words: string[]): StarterWord[] => words.map((w, i) => [w, getallenNl[i]!]);

const data: Partial<Record<LanguageCode, Record<ThemeId, StarterWord[]>>> = {
  it: {
    begroeten: [
      ['ciao', 'hoi; doei'],
      ['buongiorno', 'goedemorgen; goedendag'],
      ['buonasera', 'goedenavond'],
      ['arrivederci', 'tot ziens'],
      ['per favore', 'alsjeblieft'],
      ['grazie', 'dank je; bedankt'],
      ['prego', 'graag gedaan'],
      ['scusa', 'sorry'],
      ['sì', 'ja'],
      ['no', 'nee'],
      ['Come stai?', 'Hoe gaat het met je?'],
    ],
    getallen: getallen(['uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci']),
    eten: [
      ['pane', 'het brood', 'il'],
      ['acqua', 'het water', "l'"],
      ['latte', 'de melk', 'il'],
      ['formaggio', 'de kaas', 'il'],
      ['mela', 'de appel', 'la'],
      ['caffè', 'de koffie', 'il'],
      ['carne', 'het vlees', 'la'],
      ['pesce', 'de vis', 'il'],
      ['uovo', 'het ei', "l'"],
      ['riso', 'de rijst', 'il'],
    ],
  },
  pt: {
    begroeten: [
      ['olá', 'hallo; hoi'],
      ['bom dia', 'goedemorgen'],
      ['boa tarde', 'goedemiddag'],
      ['boa noite', 'goedenavond; goedenacht'],
      ['adeus', 'tot ziens; dag'],
      ['por favor', 'alsjeblieft'],
      ['obrigado; obrigada', 'dank je; bedankt'],
      ['de nada', 'graag gedaan'],
      ['desculpe', 'sorry; pardon'],
      ['sim', 'ja'],
      ['não', 'nee'],
      ['Como estás?', 'Hoe gaat het met je?'],
    ],
    getallen: getallen(['um; uma', 'dois; duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez']),
    eten: [
      ['pão', 'het brood', 'o'],
      ['água', 'het water', 'a'],
      ['leite', 'de melk', 'o'],
      ['queijo', 'de kaas', 'o'],
      ['maçã', 'de appel', 'a'],
      ['café', 'de koffie', 'o'],
      ['carne', 'het vlees', 'a'],
      ['peixe', 'de vis', 'o'],
      ['ovo', 'het ei', 'o'],
      ['arroz', 'de rijst', 'o'],
    ],
  },
  sv: {
    begroeten: [
      ['hej', 'hoi; hallo'],
      ['god morgon', 'goedemorgen'],
      ['god kväll', 'goedenavond'],
      ['hej då', 'doei; dag'],
      ['tack', 'dank je; bedankt'],
      ['varsågod', 'alsjeblieft; graag gedaan'],
      ['ursäkta', 'sorry; pardon'],
      ['ja', 'ja'],
      ['nej', 'nee'],
      ['Hur mår du?', 'Hoe gaat het met je?'],
    ],
    getallen: getallen(['ett', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio', 'tio']),
    eten: [
      ['bröd', 'het brood', 'ett'],
      ['vatten', 'het water', 'ett'],
      ['mjölk', 'de melk', 'en'],
      ['ost', 'de kaas', 'en'],
      ['äpple', 'de appel', 'ett'],
      ['kött', 'het vlees', 'ett'],
      ['fisk', 'de vis', 'en'],
      ['ägg', 'het ei', 'ett'],
      ['potatis', 'de aardappel', 'en'],
    ],
  },
  da: {
    begroeten: [
      ['hej', 'hoi; hallo'],
      ['godmorgen', 'goedemorgen'],
      ['godaften', 'goedenavond'],
      ['farvel', 'tot ziens; dag'],
      ['tak', 'dank je; bedankt'],
      ['undskyld', 'sorry; pardon'],
      ['ja', 'ja'],
      ['nej', 'nee'],
      ['Hvordan har du det?', 'Hoe gaat het met je?'],
    ],
    getallen: getallen(['en', 'to', 'tre', 'fire', 'fem', 'seks', 'syv', 'otte', 'ni', 'ti']),
    eten: [
      ['brød', 'het brood', 'et'],
      ['vand', 'het water', 'et'],
      ['mælk', 'de melk', 'en'],
      ['ost', 'de kaas', 'en'],
      ['æble', 'de appel', 'et'],
      ['kød', 'het vlees', 'et'],
      ['fisk', 'de vis', 'en'],
      ['æg', 'het ei', 'et'],
      ['kartoffel', 'de aardappel', 'en'],
    ],
  },
  no: {
    begroeten: [
      ['hei', 'hoi; hallo'],
      ['god morgen', 'goedemorgen'],
      ['god kveld', 'goedenavond'],
      ['ha det', 'doei; dag'],
      ['takk', 'dank je; bedankt'],
      ['vær så god', 'alsjeblieft'],
      ['unnskyld', 'sorry; pardon'],
      ['ja', 'ja'],
      ['nei', 'nee'],
      ['Hvordan har du det?', 'Hoe gaat het met je?'],
    ],
    getallen: getallen(['en', 'to', 'tre', 'fire', 'fem', 'seks', 'sju; syv', 'åtte', 'ni', 'ti']),
    eten: [
      ['brød', 'het brood', 'et'],
      ['vann', 'het water', 'et'],
      ['ost', 'de kaas', 'en'],
      ['eple', 'de appel', 'et'],
      ['kjøtt', 'het vlees', 'et'],
      ['fisk', 'de vis', 'en'],
      ['egg', 'het ei', 'et'],
      ['potet', 'de aardappel', 'en'],
    ],
  },
  pl: {
    begroeten: [
      ['cześć', 'hoi; doei'],
      ['dzień dobry', 'goedendag; goedemorgen'],
      ['dobry wieczór', 'goedenavond'],
      ['do widzenia', 'tot ziens'],
      ['proszę', 'alsjeblieft'],
      ['dziękuję', 'dank je; bedankt'],
      ['przepraszam', 'sorry; pardon'],
      ['tak', 'ja'],
      ['nie', 'nee'],
      ['Jak się masz?', 'Hoe gaat het met je?'],
    ],
    getallen: getallen(['jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć', 'dziesięć']),
    eten: [
      ['chleb', 'het brood'],
      ['woda', 'het water'],
      ['mleko', 'de melk'],
      ['ser', 'de kaas'],
      ['jabłko', 'de appel'],
      ['kawa', 'de koffie'],
      ['mięso', 'het vlees'],
      ['ryba', 'de vis'],
      ['jajko', 'het ei'],
      ['ziemniak', 'de aardappel'],
    ],
  },
  cs: {
    begroeten: [
      ['ahoj', 'hoi; doei'],
      ['dobrý den', 'goedendag'],
      ['dobrý večer', 'goedenavond'],
      ['na shledanou', 'tot ziens'],
      ['prosím', 'alsjeblieft'],
      ['děkuji', 'dank je; bedankt'],
      ['promiňte', 'sorry; pardon'],
      ['ano', 'ja'],
      ['ne', 'nee'],
      ['Jak se máš?', 'Hoe gaat het met je?'],
    ],
    getallen: getallen(['jeden; jedna', 'dva', 'tři', 'čtyři', 'pět', 'šest', 'sedm', 'osm', 'devět', 'deset']),
    eten: [
      ['chléb', 'het brood'],
      ['voda', 'het water'],
      ['mléko', 'de melk'],
      ['sýr', 'de kaas'],
      ['jablko', 'de appel'],
      ['káva', 'de koffie'],
      ['maso', 'het vlees'],
      ['ryba', 'de vis'],
      ['vejce', 'het ei'],
      ['brambora', 'de aardappel'],
    ],
  },
  fi: {
    begroeten: [
      ['hei; moi', 'hoi; hallo'],
      ['hyvää huomenta', 'goedemorgen'],
      ['hyvää iltaa', 'goedenavond'],
      ['näkemiin', 'tot ziens'],
      ['kiitos', 'dank je; bedankt'],
      ['ole hyvä', 'alsjeblieft'],
      ['anteeksi', 'sorry; pardon'],
      ['kyllä', 'ja'],
      ['ei', 'nee'],
      ['Mitä kuuluu?', 'Hoe gaat het?'],
    ],
    getallen: getallen(['yksi', 'kaksi', 'kolme', 'neljä', 'viisi', 'kuusi', 'seitsemän', 'kahdeksan', 'yhdeksän', 'kymmenen']),
    eten: [
      ['leipä', 'het brood'],
      ['vesi', 'het water'],
      ['maito', 'de melk'],
      ['juusto', 'de kaas'],
      ['omena', 'de appel'],
      ['kahvi', 'de koffie'],
      ['liha', 'het vlees'],
      ['kala', 'de vis'],
      ['muna', 'het ei'],
      ['peruna', 'de aardappel'],
    ],
  },
  el: {
    begroeten: [
      ['γεια σου', 'hoi; doei'],
      ['καλημέρα', 'goedemorgen'],
      ['καλησπέρα', 'goedenavond'],
      ['αντίο', 'tot ziens'],
      ['παρακαλώ', 'alsjeblieft'],
      ['ευχαριστώ', 'dank je; bedankt'],
      ['συγγνώμη', 'sorry; pardon'],
      ['ναι', 'ja'],
      ['όχι', 'nee'],
      ['Τι κάνεις;', 'Hoe gaat het met je?'],
    ],
    getallen: getallen(['ένα', 'δύο', 'τρία', 'τέσσερα', 'πέντε', 'έξι', 'επτά; εφτά', 'οκτώ; οχτώ', 'εννέα; εννιά', 'δέκα']),
    eten: [
      ['ψωμί', 'het brood', 'το'],
      ['νερό', 'het water', 'το'],
      ['γάλα', 'de melk', 'το'],
      ['τυρί', 'de kaas', 'το'],
      ['μήλο', 'de appel', 'το'],
      ['καφές', 'de koffie', 'ο'],
      ['κρέας', 'het vlees', 'το'],
      ['ψάρι', 'de vis', 'το'],
      ['αυγό', 'het ei', 'το'],
      ['πατάτα', 'de aardappel', 'η'],
    ],
  },
  ru: {
    begroeten: [
      ['привет', 'hoi'],
      ['здравствуйте', 'goedendag'],
      ['доброе утро', 'goedemorgen'],
      ['добрый вечер', 'goedenavond'],
      ['до свидания', 'tot ziens'],
      ['пока', 'doei'],
      ['пожалуйста', 'alsjeblieft; graag gedaan'],
      ['спасибо', 'dank je; bedankt'],
      ['извините', 'sorry; pardon'],
      ['да', 'ja'],
      ['нет', 'nee'],
      ['Как дела?', 'Hoe gaat het?'],
    ],
    getallen: getallen(['один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 'десять']),
    eten: [
      ['хлеб', 'het brood'],
      ['вода', 'het water'],
      ['молоко', 'de melk'],
      ['сыр', 'de kaas'],
      ['яблоко', 'de appel'],
      ['кофе', 'de koffie'],
      ['мясо', 'het vlees'],
      ['рыба', 'de vis'],
      ['яйцо', 'het ei'],
      ['картошка', 'de aardappel'],
    ],
  },
  tr: {
    begroeten: [
      ['merhaba', 'hallo; hoi'],
      ['günaydın', 'goedemorgen'],
      ['iyi akşamlar', 'goedenavond'],
      ['hoşça kal', 'doei; dag'],
      ['lütfen', 'alsjeblieft'],
      ['teşekkür ederim', 'dank je; bedankt'],
      ['özür dilerim', 'sorry'],
      ['evet', 'ja'],
      ['hayır', 'nee'],
      ['Nasılsın?', 'Hoe gaat het met je?'],
    ],
    getallen: getallen(['bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on']),
    eten: [
      ['ekmek', 'het brood'],
      ['su', 'het water'],
      ['süt', 'de melk'],
      ['peynir', 'de kaas'],
      ['elma', 'de appel'],
      ['kahve', 'de koffie'],
      ['et', 'het vlees'],
      ['balık', 'de vis'],
      ['yumurta', 'het ei'],
      ['patates', 'de aardappel'],
    ],
  },
};

export const starterLists: StarterList[] = Object.entries(data).flatMap(([lang, byTheme]) =>
  (Object.keys(themes) as ThemeId[]).map((theme) => ({
    id: `start-${lang}-${theme}`,
    lang: lang as LanguageCode,
    theme: themes[theme],
    words: byTheme[theme],
  })),
);

export function getStarterList(id: string): StarterList | undefined {
  return starterLists.find((s) => s.id === id);
}

/** Lidwoord + woord, bijv. "il pane", "l'acqua", "ett bröd". */
export function withArticle(word: string, article?: string): string {
  if (!article) return word;
  return article.endsWith("'") ? `${article}${word}` : `${article} ${word}`;
}
