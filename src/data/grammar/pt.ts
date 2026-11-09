/** PORTUGESE GRAMMATICA (Europees Portugees; zelf geschreven). */
import type { TopicContent } from '@/features/grammar/types';

const P = ['eu', 'tu', 'ele/ela/você', 'nós', 'eles/elas/vocês'];
const rij = (forms: string[]) => P.map((p, i) => ({ label: p, answer: forms[i]! }));

export const ptGrammar: TopicContent[] = [
  {
    id: 'ser-estar',
    blocks: [
      { type: 'text', text: '**ser**: wie of wat iets is, afkomst, beroep, karakter, tijd. **estar**: tijdelijke toestand, gevoel, plaats van iets, en estar a + infinitief (bezig zijn).' },
      { type: 'table', head: ['', 'ser', 'estar'], rows: P.map((p, i) => [p, ['sou', 'és', 'é', 'somos', 'são'][i]!, ['estou', 'estás', 'está', 'estamos', 'estão'][i]!]) },
      { type: 'tip', text: 'In Portugal zeg je voor “ik ben aan het werken”: Estou a trabalhar. In Brazilië: Estou trabalhando.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Eu ___ holandês.', answer: 'sou' },
      { type: 'gap', sentence: 'Hoje ___ muito cansada. (eu)', answer: 'estou' },
      { type: 'gap', sentence: 'Lisboa ___ a capital de Portugal.', answer: 'é' },
      { type: 'gap', sentence: 'Onde ___ o livro?', answer: 'está' },
      { type: 'gap', sentence: 'Nós ___ estudantes.', answer: 'somos' },
      { type: 'gap', sentence: 'Eles ___ a jantar.', answer: 'estão' },
    ],
  },
  {
    id: 'tijden',
    blocks: [
      { type: 'table', caption: 'Presente', head: ['', 'falar', 'comer', 'partir'], rows: P.map((p, i) => [p, ['falo', 'falas', 'fala', 'falamos', 'falam'][i]!, ['como', 'comes', 'come', 'comemos', 'comem'][i]!, ['parto', 'partes', 'parte', 'partimos', 'partem'][i]!]) },
      { type: 'table', caption: 'Pretérito perfeito (afgeronde handeling)', head: ['', 'falar', 'comer', 'partir'], rows: P.map((p, i) => [p, ['falei', 'falaste', 'falou', 'falámos', 'falaram'][i]!, ['comi', 'comeste', 'comeu', 'comemos', 'comeram'][i]!, ['parti', 'partiste', 'partiu', 'partimos', 'partiram'][i]!]) },
      { type: 'text', text: '**Imperfeito** (beschrijving, gewoonte): falava, comia, partia. **Futuro**: falarei. **Condicional**: falaria. In Brazilië schrijf je falamos (zonder accent) in de pretérito perfeito.' },
    ],
    exercises: [
      { type: 'table', title: 'falar, presente', rows: rij(['falo', 'falas', 'fala', 'falamos', 'falam']) },
      { type: 'table', title: 'comer, pretérito perfeito', rows: rij(['comi', 'comeste', 'comeu', 'comemos', 'comeram']) },
      { type: 'gap', sentence: 'Ontem eu ___ com a Ana. (falar)', answer: 'falei' },
      { type: 'gap', sentence: 'Eles ___ amanhã. (partir, presente)', answer: 'partem' },
      { type: 'gap', sentence: 'Quando era pequeno, ___ muito. (comer, imperfeito, eu)', answer: 'comia' },
      { type: 'gap', sentence: 'Ela ___ às oito. (partir, perfeito)', answer: 'partiu' },
    ],
  },
  {
    id: 'conjuntivo',
    blocks: [
      { type: 'text', text: 'De **conjuntivo** gebruik je na **que** bij wens, wil, gevoel of twijfel: Quero que fales. Espero que venhas. É importante que estudemos.' },
      { type: 'table', caption: 'Conjuntivo presente', head: ['', 'falar', 'comer', 'partir'], rows: P.map((p, i) => [p, ['fale', 'fales', 'fale', 'falemos', 'falem'][i]!, ['coma', 'comas', 'coma', 'comamos', 'comam'][i]!, ['parta', 'partas', 'parta', 'partamos', 'partam'][i]!]) },
      { type: 'tip', text: 'Onregelmatig: ser → seja, estar → esteja, ter → tenha, ir → vá, fazer → faça.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Quero que tu ___ comigo. (falar)', answer: 'fales' },
      { type: 'gap', sentence: 'Espero que ele ___ bem. (estar)', answer: 'esteja' },
      { type: 'gap', sentence: 'É importante que nós ___. (comer)', answer: 'comamos' },
      { type: 'gap', sentence: 'Talvez ela ___ amanhã. (partir)', answer: 'parta' },
      { type: 'gap', sentence: 'Quero que vocês ___ felizes. (ser)', answer: 'sejam' },
    ],
  },
  {
    id: 'infinitivo-pessoal',
    blocks: [
      { type: 'text', text: 'Portugees heeft een bijzondere **persoonlijke infinitief**: een infinitief met een eigen uitgang, als die een eigen onderwerp heeft. Vaak na een voorzetsel of na “é importante…”.' },
      { type: 'table', head: ['', 'falar'], rows: P.map((p, i) => [p, ['falar', 'falares', 'falar', 'falarmos', 'falarem'][i]!]) },
      { type: 'examples', items: [['É importante estudarmos.', 'Het is belangrijk dat wij studeren.'], ['Antes de saíres, fecha a porta.', 'Doe de deur dicht voordat je weggaat.']] },
    ],
    exercises: [
      { type: 'gap', sentence: 'É importante ___ muito. (estudar, nós)', answer: 'estudarmos' },
      { type: 'gap', sentence: 'Antes de ___, telefona-me. (sair, tu)', answer: 'saíres' },
      { type: 'gap', sentence: 'Para eles ___ a tempo, têm de sair já. (chegar)', answer: 'chegarem' },
      { type: 'gap', sentence: 'Depois de ___, vamos ao cinema. (jantar, nós)', answer: 'jantarmos' },
      { type: 'gap', sentence: 'É melhor ___ cedo. (partir, vocês)', answer: 'partirem' },
    ],
  },
  {
    id: 'pronomes',
    blocks: [
      { type: 'table', head: ['', 'lijdend voorwerp', 'meewerkend voorwerp'], rows: [['eu', 'me', 'me'], ['tu', 'te', 'te'], ['ele/ela/você', 'o / a', 'lhe'], ['nós', 'nos', 'nos'], ['eles/elas/vocês', 'os / as', 'lhes']] },
      { type: 'text', text: 'In Portugal staat het voornaamwoord in een gewone bevestigende zin **achter** het werkwoord, met een streepje: **Vejo-o.** (Ik zie hem.) Na **não**, vraagwoorden en woorden als já, também, que staat het **ervoor**: **Não o vejo.** Quem te disse?' },
      { type: 'tip', text: 'In Brazilië staat het voornaamwoord meestal vóór het werkwoord: Eu o vejo / Eu te amo.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Conheço o João. → Conheço-___.', answer: 'o' },
      { type: 'gap', sentence: 'Não conheço a Maria. → Não ___ conheço.', answer: 'a' },
      { type: 'gap', sentence: 'Dou o livro ao Pedro. → Dou-___ o livro.', answer: 'lhe' },
      { type: 'gap', sentence: 'Vejo os meus amigos. → Vejo-___.', answer: 'os' },
      { type: 'choice', question: 'Welke zin is goed (Portugal)?', options: ['Não o vejo.', 'Não vejo-o.', 'O não vejo.'], answer: 0 },
    ],
  },
];
