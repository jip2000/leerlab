/** ENGELSE GRAMMATICA: uitleg en oefeningen (zelf geschreven). */
import { tenseTopic } from '@/features/grammar/tenseTopic';
import type { TopicContent } from '@/features/grammar/types';

const t = (id: string, tenses: string[], models: string[], blocks: TopicContent['blocks'], verbs?: (inf: string, tags: string[]) => boolean) =>
  tenseTopic({ id, lang: 'en', tenses, models, blocks, verbs });

export const enGrammar: TopicContent[] = [
  t('present-simple-continuous', ['present-simple', 'present-continuous'], ['work', 'go'], [
    { type: 'text', text: '**Present simple**: gewoontes, feiten, vaste dingen. Signaalwoorden: always, usually, often, never, every day. Bij he/she/it: **-s** (she works).' },
    { type: 'text', text: '**Present continuous**: iets dat nú bezig is of tijdelijk is. Vorm: am/is/are + werkwoord**-ing**. Signaalwoorden: now, at the moment, look!, this week.' },
    { type: 'examples', items: [['She plays tennis every Saturday.', 'Ze tennist elke zaterdag.'], ['She is playing tennis right now.', 'Ze is nu aan het tennissen.']] },
  ]),
  t('past-simple-continuous', ['past-simple', 'past-continuous'], ['work', 'go'], [
    { type: 'text', text: '**Past simple**: afgeronde handeling op een bepaald moment in het verleden (yesterday, last week, in 2020, ago). Regelmatig: **-ed**. Onregelmatig: tweede rijtje (went, saw).' },
    { type: 'text', text: '**Past continuous**: was/were + -ing. Voor iets dat bezig was toen er iets anders gebeurde: I was watching TV when the phone rang.' },
  ]),
  t('present-perfect', ['present-perfect', 'present-perfect-continuous'], ['work', 'go'], [
    { type: 'text', text: '**Present perfect**: have/has + voltooid deelwoord. Voor iets in het verleden dat nu nog belangrijk is, of zonder precies tijdstip. Signaalwoorden: ever, never, already, yet, just, since, for.' },
    { type: 'text', text: '**Present perfect continuous**: have/has been + -ing. Voor iets dat al een tijd bezig is en nog doorgaat: I have been waiting for two hours.' },
    { type: 'tip', text: 'Noem je een precies tijdstip in het verleden (yesterday, last year)? Dan past simple, geen present perfect.' },
  ]),
  t('past-perfect', ['past-perfect'], ['work', 'go'], [
    { type: 'text', text: '**Past perfect**: had + voltooid deelwoord. Voor iets dat gebeurde vóór een ander moment in het verleden: When we arrived, the film had already started.' },
  ]),
  t('future', ['future-will', 'going-to', 'present-continuous'], ['go'], [
    { type: 'text', text: '**will** + werkwoord: voorspelling, spontane beslissing, belofte: I think it will rain. I’ll help you!' },
    { type: 'text', text: '**be going to** + werkwoord: plan of iets dat je al ziet aankomen: I’m going to visit my aunt. Look at those clouds, it’s going to rain.' },
    { type: 'text', text: '**present continuous**: vaste afspraak: I’m meeting Tom tomorrow.' },
  ]),
  t('future-perfect', ['future-perfect'], ['work', 'go'], [
    { type: 'text', text: '**Future perfect**: will have + voltooid deelwoord. Iets dat op een moment in de toekomst al klaar is: By tomorrow, I will have finished my homework.' },
  ]),
  t('irregular-verbs', ['past-simple', 'present-perfect'], ['go', 'see', 'write'], [
    { type: 'text', text: '**Onregelmatige werkwoorden** hebben een eigen vorm in de past simple (2e rijtje) en het voltooid deelwoord (3e rijtje): go – went – gone, see – saw – seen, write – wrote – written.' },
    { type: 'tip', text: 'Leer ze in groepjes die op elkaar lijken: buy – bought – bought, bring – brought – brought, think – thought – thought.' },
  ], (_inf, tags) => tags.includes('onregelmatig')),
  {
    id: 'conditionals',
    blocks: [
      { type: 'table', head: ['type', 'if-deel', 'hoofdzin', 'voorbeeld'], rows: [['0 (altijd waar)', 'present', 'present', 'If you heat ice, it melts.'], ['1 (goed mogelijk)', 'present', 'will + ww.', 'If it rains, I will stay home.'], ['2 (denkbeeldig)', 'past', 'would + ww.', 'If I had money, I would buy a car.'], ['3 (verleden, te laat)', 'past perfect', 'would have + v.d.', 'If I had studied, I would have passed.']] },
      { type: 'tip', text: 'Na **if** nooit will of would! Bij type 2 mag je ook zeggen: If I **were** you, …' },
    ],
    exercises: [
      { type: 'gap', sentence: 'If it rains, I ___ at home. (stay)', answer: "will stay / 'll stay" },
      { type: 'gap', sentence: 'If I ___ rich, I would travel the world. (be)', answer: 'were / was' },
      { type: 'gap', sentence: 'If you heat water to 100 degrees, it ___. (boil)', answer: 'boils' },
      { type: 'gap', sentence: 'If she had studied, she ___ the test. (pass)', answer: 'would have passed' },
      { type: 'gap', sentence: 'If I ___ the answer, I would tell you. (know)', answer: 'knew' },
      { type: 'gap', sentence: 'If we ___ now, we will catch the bus. (leave)', answer: 'leave' },
      { type: 'fix', sentence: 'If I will see him, I will tell him.', answer: 'If I see him, I will tell him.', explain: 'Na if geen will.' },
      { type: 'choice', question: 'If I had known, I ___ you.', options: ['would help', 'would have helped', 'will help', 'helped'], answer: 1, explain: 'Type 3: would have + voltooid deelwoord.' },
    ],
  },
  {
    id: 'passive',
    blocks: [
      { type: 'text', text: 'De **passive** maak je met **be** (in de juiste tijd) + **voltooid deelwoord**. Door wie? **by**.' },
      { type: 'table', head: ['tijd', 'voorbeeld'], rows: [['present simple', 'The room is cleaned every day.'], ['past simple', 'The house was built in 1900.'], ['present perfect', 'The window has been broken.'], ['future', 'The results will be published tomorrow.'], ['met modal', 'This must be done today.']] },
    ],
    exercises: [
      { type: 'gap', sentence: 'English ___ all over the world. (speak, present)', answer: 'is spoken' },
      { type: 'gap', sentence: 'The Mona Lisa ___ by Leonardo da Vinci. (paint, past)', answer: 'was painted' },
      { type: 'gap', sentence: 'The letters ___ yesterday. (send, past)', answer: 'were sent' },
      { type: 'gap', sentence: 'My bike ___. (steal, present perfect)', answer: 'has been stolen' },
      { type: 'gap', sentence: 'The new school ___ next year. (open, future)', answer: 'will be opened' },
      { type: 'translate', nl: 'Het huis werd in 1950 gebouwd.', answer: 'The house was built in 1950.' },
      { type: 'fix', sentence: 'The cake was eat by the dog.', answer: 'The cake was eaten by the dog.', explain: 'Passive: was + voltooid deelwoord (eaten).' },
    ],
  },
  {
    id: 'reported-speech',
    blocks: [
      { type: 'text', text: 'Met **reported speech** vertel je wat iemand gezegd heeft. Na een verleden tijd (said, told) gaat de tijd meestal **één stap terug**.' },
      { type: 'table', head: ['direct', 'reported'], rows: [['present simple: “I am tired.”', 'He said (that) he was tired.'], ['present continuous: “I am working.”', 'She said she was working.'], ['past simple / present perfect', 'past perfect: He said he had seen it.'], ['will', 'would: She said she would come.'], ['can', 'could']] },
      { type: 'tip', text: '**say** (something) / **tell** (someone): He said that… / He told me that… Ook here → there, today → that day, tomorrow → the next day.' },
    ],
    exercises: [
      { type: 'gap', sentence: '“I am hungry.” → She said she ___ hungry.', answer: 'was' },
      { type: 'gap', sentence: '“I will call you.” → He said he ___ call me.', answer: 'would' },
      { type: 'gap', sentence: '“I can swim.” → Tom said he ___ swim.', answer: 'could' },
      { type: 'gap', sentence: '“I saw the film.” → She said she ___ the film.', answer: 'had seen' },
      { type: 'gap', sentence: '“We are playing.” → They said they ___ playing.', answer: 'were' },
      { type: 'choice', question: 'He ___ me that he was ill.', options: ['said', 'told', 'say', 'talked'], answer: 1, explain: 'tell + persoon (told me).' },
      { type: 'fix', sentence: 'She said me that she was tired.', answer: 'She told me that she was tired.', explain: 'said heeft geen persoon erachter: told me.' },
    ],
  },
  {
    id: 'modals',
    blocks: [
      { type: 'table', head: ['modal', 'betekenis', 'voorbeeld'], rows: [['can / could', 'kunnen, mogen; could = kon / zou kunnen', 'I can swim. Could you help me?'], ['may / might', 'mogen; misschien', 'May I come in? It might rain.'], ['must', 'moeten (van jezelf)', 'I must study harder.'], ['have to', 'moeten (van anderen, regel)', 'I have to wear a uniform.'], ['mustn’t', 'niet mogen', 'You mustn’t smoke here.'], ['don’t have to', 'niet hoeven', 'You don’t have to come.'], ['should', 'zou moeten, advies', 'You should see a doctor.']] },
      { type: 'tip', text: 'Na een modal komt het hele werkwoord zonder to, en bij he/she/it geen -s: She can swim (niet: she cans to swim).' },
    ],
    exercises: [
      { type: 'choice', question: 'You ___ smoke in the hospital. (het mag niet)', options: ["mustn't", "don't have to", 'should', 'can'], answer: 0 },
      { type: 'choice', question: 'Tomorrow is Sunday, so I ___ get up early. (het hoeft niet)', options: ["mustn't", "don't have to", "can't", 'must'], answer: 1 },
      { type: 'choice', question: 'You look ill. You ___ go to the doctor.', options: ['should', 'might', 'can', 'have'], answer: 0 },
      { type: 'gap', sentence: '___ you help me, please? (beleefd)', answer: 'Could / Can' },
      { type: 'fix', sentence: 'She cans speak French.', answer: 'She can speak French.' },
      { type: 'fix', sentence: 'You must to do your homework.', answer: 'You must do your homework.' },
      { type: 'gap', sentence: 'Take an umbrella. It ___ rain later. (misschien)', answer: 'might / may' },
    ],
  },
  {
    id: 'adjectives-adverbs',
    blocks: [
      { type: 'text', text: 'Een **bijvoeglijk naamwoord** (adjective) zegt iets over een zelfstandig naamwoord: a **quick** answer. Een **bijwoord** (adverb) zegt iets over een werkwoord: He answered **quickly**.' },
      { type: 'table', head: ['adjective', 'adverb', 'regel'], rows: [['quick', 'quickly', '+ly'], ['happy', 'happily', 'y → ily'], ['terrible', 'terribly', '-le → -ly'], ['good', 'well', 'onregelmatig'], ['fast / hard / late', 'fast / hard / late', 'blijft gelijk']] },
      { type: 'tip', text: 'Na be, look, feel, seem, smell, taste komt een adjective: You look **happy**. It tastes **good**.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'She sings ___. (beautiful)', answer: 'beautifully' },
      { type: 'gap', sentence: 'He is a ___ driver. (careful)', answer: 'careful' },
      { type: 'gap', sentence: 'He drives ___. (careful)', answer: 'carefully' },
      { type: 'gap', sentence: 'You speak English very ___. (good)', answer: 'well' },
      { type: 'gap', sentence: 'They worked ___. (hard)', answer: 'hard' },
      { type: 'gap', sentence: 'The children played ___. (happy)', answer: 'happily' },
      { type: 'gap', sentence: 'This soup tastes ___. (good)', answer: 'good' },
      { type: 'fix', sentence: 'He runs very quick.', answer: 'He runs very quickly.' },
    ],
  },
  {
    id: 'comparison',
    blocks: [
      { type: 'table', head: ['soort', 'vergrotende trap', 'overtreffende trap'], rows: [['kort (1 lettergreep)', 'old → older', 'the oldest'], ['eindigt op -y', 'happy → happier', 'the happiest'], ['medeklinker verdubbelen', 'big → bigger', 'the biggest'], ['lang', 'expensive → more expensive', 'the most expensive'], ['onregelmatig', 'good → better, bad → worse, far → further', 'the best, the worst, the furthest']] },
      { type: 'text', text: 'Vergelijken: **than** (dan): She is taller **than** me. Even: **as … as**: He is as tall as his father.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'My brother is ___ than me. (old)', answer: 'older' },
      { type: 'gap', sentence: 'This is the ___ day of the year. (hot)', answer: 'hottest' },
      { type: 'gap', sentence: 'Maths is ___ than English. (difficult)', answer: 'more difficult' },
      { type: 'gap', sentence: 'She is the ___ student in the class. (good)', answer: 'best' },
      { type: 'gap', sentence: 'Today is ___ than yesterday. (bad)', answer: 'worse' },
      { type: 'gap', sentence: 'This is the ___ film I have ever seen. (funny)', answer: 'funniest' },
      { type: 'fix', sentence: 'He is more tall than me.', answer: 'He is taller than me.' },
      { type: 'fix', sentence: 'She is taller then her sister.', answer: 'She is taller than her sister.' },
    ],
  },
  {
    id: 'quantifiers',
    blocks: [
      { type: 'table', head: ['', 'telbaar (books)', 'ontelbaar (water)'], rows: [['veel', 'many', 'much'], ['weinig', 'few', 'little'], ['een paar / een beetje', 'a few', 'a little'], ['allebei', 'a lot of / lots of', 'a lot of / lots of']] },
      { type: 'text', text: '**some** in bevestigende zinnen (en in aanbiedingen: Would you like some tea?). **any** in vragen en ontkenningen: Do you have any brothers? I don’t have any money.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'How ___ money do you have?', answer: 'much' },
      { type: 'gap', sentence: 'How ___ brothers do you have?', answer: 'many' },
      { type: 'gap', sentence: 'There aren’t ___ apples left.', answer: 'any' },
      { type: 'gap', sentence: 'I’d like ___ milk in my tea, please.', answer: 'some / a little' },
      { type: 'gap', sentence: 'I have a ___ friends in London. (een paar)', answer: 'few' },
      { type: 'gap', sentence: 'There is a ___ sugar left. (een beetje)', answer: 'little' },
      { type: 'choice', question: 'Do you have ___ questions?', options: ['some', 'any', 'much', 'a little'], answer: 1 },
      { type: 'fix', sentence: 'There are much people here.', answer: 'There are many people here.' },
    ],
  },
  {
    id: 'relative-pronouns',
    blocks: [
      { type: 'table', head: ['woord', 'voor', 'voorbeeld'], rows: [['who', 'personen', 'The girl who lives next door is nice.'], ['which', 'dingen, dieren', 'The book which I read was boring.'], ['that', 'personen en dingen (geen komma)', 'The film that we saw was great.'], ['whose', 'bezit (van wie)', 'The man whose car was stolen called the police.'], ['where', 'plaats', 'The town where I was born is small.']] },
      { type: 'tip', text: 'Is het betrekkelijk voornaamwoord het lijdend voorwerp, dan mag je het weglaten: The book (that) I read was boring.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'The woman ___ works here is my aunt.', answer: 'who / that' },
      { type: 'gap', sentence: 'The phone ___ I bought is broken.', answer: 'which / that' },
      { type: 'gap', sentence: 'That’s the boy ___ bike was stolen.', answer: 'whose' },
      { type: 'gap', sentence: 'This is the house ___ I grew up.', answer: 'where' },
      { type: 'gap', sentence: 'I have a friend ___ speaks five languages.', answer: 'who / that' },
      { type: 'choice', question: 'The dog ___ is barking is ours.', options: ['who', 'which', 'whose', 'where'], answer: 1 },
      { type: 'fix', sentence: 'The man which lives here is a doctor.', answer: 'The man who lives here is a doctor.', explain: 'Voor personen: who (of that).' },
    ],
  },
  {
    id: 'gerund-infinitive',
    blocks: [
      { type: 'text', text: 'Na sommige werkwoorden komt een **-ing**-vorm (gerund), na andere **to** + werkwoord.' },
      { type: 'table', head: ['+ -ing', '+ to …'], rows: [['enjoy, finish, mind, avoid, suggest, keep, practise', 'want, decide, hope, plan, learn, need, promise, would like'], ['na een voorzetsel: interested in reading, good at swimming', 'na een bijvoeglijk naamwoord: easy to learn']] },
      { type: 'tip', text: 'like, love, hate, start, begin: allebei mogelijk (I like swimming / I like to swim).' },
    ],
    exercises: [
      { type: 'gap', sentence: 'I enjoy ___ books. (read)', answer: 'reading' },
      { type: 'gap', sentence: 'She decided ___ a new phone. (buy)', answer: 'to buy' },
      { type: 'gap', sentence: 'Have you finished ___ your homework? (do)', answer: 'doing' },
      { type: 'gap', sentence: 'We hope ___ you soon. (see)', answer: 'to see' },
      { type: 'gap', sentence: 'He is good at ___. (draw)', answer: 'drawing' },
      { type: 'gap', sentence: 'I want ___ a doctor. (become)', answer: 'to become' },
      { type: 'gap', sentence: 'Do you mind ___ the window? (open)', answer: 'opening' },
      { type: 'fix', sentence: 'I am interested in learn Spanish.', answer: 'I am interested in learning Spanish.', explain: 'Na een voorzetsel: -ing.' },
    ],
  },
];
