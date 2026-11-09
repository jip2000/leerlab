/**
 * FRANSE GRAMMATICA: uitleg en oefeningen (zelf geschreven).
 * Onderwerp toevoegen? Zet de id ook in src/data/languages.ts (grammarTopics).
 */
import { tenseTopic } from '@/features/grammar/tenseTopic';
import type { TopicContent } from '@/features/grammar/types';

const t = (id: string, tenses: string[], models: string[], blocks: TopicContent['blocks'], verbs?: (inf: string, tags: string[]) => boolean) =>
  tenseTopic({ id, lang: 'fr', tenses, models, blocks, verbs });

export const frGrammar: TopicContent[] = [
  t('present', ['present'], ['parler', 'finir', 'vendre'], [
    { type: 'text', text: 'De **présent** gebruik je voor wat nu gebeurt, voor gewoontes en voor feiten.' },
    { type: 'text', text: 'Regelmatige werkwoorden: **-er**: -e, -es, -e, -ons, -ez, -ent. **-ir** (zoals finir): -is, -is, -it, -issons, -issez, -issent. **-re**: -s, -s, -, -ons, -ez, -ent.' },
    { type: 'tip', text: 'Let op de spelling: nous mangeons (e na g), nous commençons (ç). Veel belangrijke werkwoorden zijn onregelmatig: être, avoir, aller, faire. Oefen die ook in de werkwoordtrainer.' },
  ]),
  t('passe-compose', ['passe-compose'], ['parler', 'aller', 'faire'], [
    { type: 'text', text: 'De **passé composé** gebruik je voor een afgeronde handeling in het verleden: Hier, j’ai mangé une pizza.' },
    { type: 'text', text: 'Vorm: **avoir** of **être** (présent) + **voltooid deelwoord**. -er → -é (parlé), -ir → -i (fini), -re → -u (vendu). Onregelmatig: fait, dit, pris, mis, vu, eu, été, lu, écrit, bu, venu, né, mort.' },
    { type: 'text', text: 'Met **être**: werkwoorden van beweging of verandering (aller, venir, arriver, partir, entrer, sortir, monter, descendre, rester, tomber, naître, mourir, devenir, revenir, rentrer) en alle wederkerende werkwoorden (je me suis levé). Dan krijgt het deelwoord de uitgang van het onderwerp: elle est allée, ils sont partis, elles sont venues.' },
    { type: 'examples', items: [['Nous avons regardé un film.', 'We hebben een film gekeken.'], ['Elle est arrivée à huit heures.', 'Zij is om acht uur aangekomen.']] },
  ]),
  t('imparfait', ['imparfait'], ['parler', 'finir', 'être'], [
    { type: 'text', text: 'De **imparfait** gebruik je voor een beschrijving of situatie in het verleden, voor gewoontes (vroeger deed ik altijd…) en voor iets dat bezig was toen er iets anders gebeurde.' },
    { type: 'text', text: 'Vorm: neem **nous** van de présent, haal -ons weg en zet er **-ais, -ais, -ait, -ions, -iez, -aient** achter. nous finissons → je finissais. Enige uitzondering: **être** → j’étais.' },
    { type: 'examples', items: [['Quand j’étais petit, je jouais au foot.', 'Toen ik klein was, voetbalde ik.'], ['Il pleuvait quand je suis sorti.', 'Het regende toen ik naar buiten ging.']] },
    { type: 'tip', text: 'Imparfait = de achtergrond (wat was er aan de hand?). Passé composé = de gebeurtenis (wat gebeurde er toen?).' },
  ]),
  t('plus-que-parfait', ['plus-que-parfait'], ['parler', 'partir'], [
    { type: 'text', text: 'De **plus-que-parfait** gebruik je voor iets dat gebeurde vóór een ander moment in het verleden: Quand je suis arrivé, il était déjà parti.' },
    { type: 'text', text: 'Vorm: **avoir** of **être** in de imparfait + voltooid deelwoord. Dezelfde regels voor être en de overeenkomst als bij de passé composé.' },
  ]),
  t('futur-simple', ['futur-simple'], ['parler', 'finir', 'être'], [
    { type: 'text', text: 'De **futur simple** gebruik je voor de toekomst: Demain, il fera beau.' },
    { type: 'text', text: 'Vorm: de **infinitief** (bij -re zonder de e) + **-ai, -as, -a, -ons, -ez, -ont**. parler → je parlerai, vendre → je vendrai.' },
    { type: 'table', caption: 'Onregelmatige stammen', head: ['werkwoord', 'stam'], rows: [['être', 'ser-'], ['avoir', 'aur-'], ['aller', 'ir-'], ['faire', 'fer-'], ['pouvoir', 'pourr-'], ['vouloir', 'voudr-'], ['savoir', 'saur-'], ['devoir', 'devr-'], ['venir', 'viendr-'], ['voir', 'verr-'], ['envoyer', 'enverr-']] },
  ]),
  t('futur-proche', ['futur-proche'], ['parler', 'aller'], [
    { type: 'text', text: 'De **futur proche** is de nabije toekomst: wat je gaat doen. Vorm: **aller** (présent) + **infinitief**: Je vais manger. Ce soir, nous allons regarder un film.' },
  ]),
  t('passe-recent', ['passe-recent'], ['parler', 'arriver'], [
    { type: 'text', text: 'De **passé récent** zegt dat iets net gebeurd is. Vorm: **venir** (présent) + **de** + **infinitief**: Je viens de manger (ik heb net gegeten). Voor een klinker wordt de: d’ → Elle vient d’arriver.' },
  ]),
  t('conditionnel', ['conditionnel', 'conditionnel-passe'], ['parler', 'être'], [
    { type: 'text', text: 'De **conditionnel présent** betekent “zou(den) …”. Je gebruikt hem voor wensen, beleefde vragen (Je voudrais un café) en in si-zinnen (Si j’avais le temps, je viendrais).' },
    { type: 'text', text: 'Vorm: de **stam van de futur** + de uitgangen van de **imparfait**: -ais, -ais, -ait, -ions, -iez, -aient. je serais, j’aurais, j’irais.' },
    { type: 'text', text: 'De **conditionnel passé** betekent “zou hebben / zou zijn …”: avoir of être in de conditionnel + voltooid deelwoord: J’aurais aimé venir.' },
  ]),
  t('subjonctif', ['subjonctif'], ['parler', 'finir', 'être'], [
    { type: 'text', text: 'De **subjonctif** gebruik je na uitdrukkingen van wil, wens, gevoel, twijfel en noodzaak, meestal met **que**: il faut que, je veux que, je suis content que, bien que, pour que, avant que.' },
    { type: 'text', text: 'Vorm: neem **ils** van de présent, haal -ent weg en zet er **-e, -es, -e, -ions, -iez, -ent** achter: ils finissent → que je finisse. Nous en vous zijn meestal gelijk aan de imparfait.' },
    { type: 'tip', text: 'Onregelmatig: être (que je sois), avoir (que j’aie), aller (que j’aille), faire (que je fasse), pouvoir (que je puisse), savoir (que je sache), vouloir (que je veuille).' },
  ]),
  t('imperatif', ['imperatif'], ['parler', 'finir', 'aller'], [
    { type: 'text', text: 'Met de **impératif** geef je een bevel of advies. Er zijn drie vormen (tu, nous, vous), zonder onderwerp: Parle ! Parlons ! Parlez !' },
    { type: 'text', text: 'Bij **-er**-werkwoorden (en aller) valt bij tu de **-s** weg: tu parles → Parle ! tu vas → Va !' },
    { type: 'tip', text: 'Onregelmatig: être (sois, soyons, soyez), avoir (aie, ayons, ayez), savoir (sache, sachons, sachez).' },
  ]),
  {
    id: 'passe-simple',
    blocks: [
      { type: 'text', text: 'De **passé simple** kom je tegen in boeken en verhalen; je hoeft hem alleen te herkennen. Hij betekent hetzelfde als de passé composé.' },
      { type: 'table', head: ['', '-er (parler)', '-ir/-re (finir)'], rows: [['je', 'parlai', 'finis'], ['tu', 'parlas', 'finis'], ['il/elle', 'parla', 'finit'], ['nous', 'parlâmes', 'finîmes'], ['vous', 'parlâtes', 'finîtes'], ['ils/elles', 'parlèrent', 'finirent']] },
      { type: 'table', caption: 'Belangrijke onregelmatige vormen (il)', head: ['werkwoord', 'passé simple'], rows: [['être', 'il fut'], ['avoir', 'il eut'], ['faire', 'il fit'], ['venir', 'il vint'], ['voir', 'il vit'], ['prendre', 'il prit'], ['dire', 'il dit'], ['pouvoir', 'il put']] },
    ],
    exercises: [
      { type: 'choice', question: 'il fut', options: ['être', 'faire', 'falloir', 'avoir'], answer: 0 },
      { type: 'choice', question: 'ils allèrent', options: ['aller', 'aimer', 'être', 'avoir'], answer: 0 },
      { type: 'choice', question: 'elle fit', options: ['finir', 'faire', 'être', 'fuir'], answer: 1 },
      { type: 'choice', question: 'nous eûmes', options: ['être', 'avoir', 'aller', 'devoir'], answer: 1 },
      { type: 'choice', question: 'il vint', options: ['voir', 'vivre', 'venir', 'vendre'], answer: 2 },
      { type: 'choice', question: 'ils prirent', options: ['prendre', 'prier', 'partir', 'pouvoir'], answer: 0 },
      { type: 'choice', question: 'je parlai', options: ['passé simple van parler', 'présent van parler', 'futur van parler', 'imparfait van parler'], answer: 0 },
      { type: 'choice', question: 'elles finirent', options: ['futur', 'passé simple', 'conditionnel', 'subjonctif'], answer: 1 },
    ],
  },
  {
    id: 'gerondif',
    blocks: [
      { type: 'text', text: 'Met de **gérondif** zeg je dat twee dingen tegelijk gebeuren, of hoe iets gebeurt: Il chante en travaillant (hij zingt terwijl hij werkt). C’est en pratiquant qu’on apprend.' },
      { type: 'text', text: 'Vorm: **en** + stam van **nous** (présent) + **-ant**: nous faisons → en faisant, nous finissons → en finissant.' },
      { type: 'tip', text: 'Uitzonderingen: être → en étant, avoir → en ayant, savoir → en sachant.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Il lit ___ le petit-déjeuner.', answer: 'en mangeant / mangeant', hint: 'manger' },
      { type: 'gap', sentence: 'Elle apprend ___ des fautes.', answer: 'en faisant / faisant', hint: 'faire' },
      { type: 'gap', sentence: 'Nous écoutons de la musique ___.', answer: 'en travaillant / travaillant', hint: 'travailler' },
      { type: 'gap', sentence: 'Il a trouvé la solution ___.', answer: 'en réfléchissant / réfléchissant', hint: 'réfléchir' },
      { type: 'gap', sentence: '___ prudent, tu n’auras pas d’accident.', answer: 'En étant / étant', hint: 'être' },
      { type: 'gap', sentence: 'Elle sourit ___ son cadeau.', answer: 'en ouvrant / ouvrant', hint: 'ouvrir' },
      { type: 'gap', sentence: '___ la vérité, il s’est senti mieux.', answer: 'En sachant / sachant', hint: 'savoir' },
      { type: 'gap', sentence: 'Ils sont tombés ___ l’escalier.', answer: 'en descendant / descendant', hint: 'descendre' },
    ],
  },
  {
    id: 'lidwoorden',
    blocks: [
      { type: 'table', head: ['', 'mannelijk', 'vrouwelijk', 'voor klinker/h', 'meervoud'], rows: [['bepaald (de/het)', 'le', 'la', 'l’', 'les'], ['onbepaald (een)', 'un', 'une', 'un/une', 'des'], ['delend (wat, een beetje)', 'du', 'de la', 'de l’', 'des']] },
      { type: 'text', text: 'Het **delend lidwoord** (partitif) gebruik je voor een onbepaalde hoeveelheid: Je mange **du** pain, je bois **de l’**eau. In het Nederlands zeg je dan vaak niets.' },
      { type: 'text', text: 'Na een **ontkenning** wordt un, une, des, du, de la: **de** (of d’): Je n’ai pas **de** voiture. Il n’y a pas **d’**eau. Uitzondering: na être blijft het lidwoord: Ce n’est pas un chat.' },
      { type: 'text', text: 'Na hoeveelheden komt ook **de**: beaucoup de, un peu de, un kilo de, une bouteille de.' },
      { type: 'tip', text: 'Samentrekkingen: à + le = **au**, à + les = **aux**, de + le = **du**, de + les = **des**. Je vais au cinéma. Le livre du professeur.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Le matin, je mange ___ pain.', answer: 'du', explain: 'Een onbepaalde hoeveelheid brood (le pain): du.' },
      { type: 'gap', sentence: 'Elle boit ___ eau.', answer: "de l'", explain: "L'eau begint met een klinker: de l'." },
      { type: 'gap', sentence: 'Il n’y a pas ___ lait.', answer: 'de', explain: 'Na een ontkenning wordt het delend lidwoord: de.' },
      { type: 'gap', sentence: 'Nous allons ___ cinéma.', answer: 'au', explain: 'à + le = au.' },
      { type: 'gap', sentence: 'Je parle ___ enfants.', answer: 'aux', explain: 'à + les = aux.' },
      { type: 'gap', sentence: 'Il a beaucoup ___ amis.', answer: "d'", explain: 'Na beaucoup komt de, vóór een klinker d’.' },
      { type: 'gap', sentence: 'C’est la voiture ___ professeur.', answer: 'du', explain: 'de + le = du.' },
      { type: 'choice', question: 'Je n’ai pas ___ voiture.', options: ['une', 'de', 'la', 'des'], answer: 1, explain: 'Na een ontkenning: de.' },
      { type: 'fix', sentence: 'Je ne mange pas du fromage.', answer: 'Je ne mange pas de fromage.', explain: 'Na ne … pas wordt du: de.' },
    ],
  },
  {
    id: 'adjectifs',
    blocks: [
      { type: 'text', text: 'Een bijvoeglijk naamwoord past zich aan het zelfstandig naamwoord aan: **vrouwelijk** krijgt meestal een **-e**, **meervoud** een **-s**. un petit garçon, une petite fille, des petits garçons, des petites filles.' },
      { type: 'table', caption: 'Vrouwelijke vormen', head: ['mannelijk', 'vrouwelijk', 'voorbeeld'], rows: [['-e', '-e', 'rouge → rouge'], ['-er', '-ère', 'cher → chère'], ['-eux', '-euse', 'heureux → heureuse'], ['-if', '-ive', 'sportif → sportive'], ['-el / -en / -on', '-elle / -enne / -onne', 'naturel → naturelle, italien → italienne, bon → bonne'], ['onregelmatig', '', 'blanc → blanche, long → longue, frais → fraîche']] },
      { type: 'text', text: 'Meervoud: -eux blijft gelijk (heureux), **-al → -aux** (normal → normaux).' },
      { type: 'text', text: 'Meestal staat het bijvoeglijk naamwoord **achter** het zelfstandig naamwoord: une voiture rouge. Een paar korte, veelgebruikte staan **ervoor**: beau, joli, jeune, vieux, nouveau, bon, mauvais, grand, petit, gros.' },
      { type: 'tip', text: 'beau, nouveau, vieux worden bel, nouvel, vieil vóór een mannelijk woord met klinker of h: un bel homme, un nouvel ami, un vieil arbre. Vrouwelijk: belle, nouvelle, vieille.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'une fille ___', answer: 'heureuse', hint: 'heureux' },
      { type: 'gap', sentence: 'des livres ___', answer: 'intéressants', hint: 'intéressant' },
      { type: 'gap', sentence: 'une ___ maison', answer: 'belle', hint: 'beau' },
      { type: 'gap', sentence: 'un ___ arbre', answer: 'bel', hint: 'beau', explain: 'Mannelijk woord met klinker: bel.' },
      { type: 'gap', sentence: 'des problèmes ___', answer: 'normaux', hint: 'normal', explain: '-al wordt in het meervoud -aux.' },
      { type: 'gap', sentence: 'une robe ___', answer: 'blanche', hint: 'blanc' },
      { type: 'gap', sentence: 'une ___ voiture', answer: 'nouvelle', hint: 'nouveau' },
      { type: 'gap', sentence: 'une fille ___', answer: 'sportive', hint: 'sportif' },
      { type: 'order', words: ['une', 'petite', 'maison', 'blanche'], nl: 'een klein wit huis', explain: 'petit staat vóór, blanc achter het zelfstandig naamwoord.' },
    ],
  },
  {
    id: 'pronoms-personnels',
    blocks: [
      { type: 'table', head: ['onderwerp', 'lijdend vw. (COD)', 'meewerkend vw. (COI)', 'beklemtoond'], rows: [['je', 'me', 'me', 'moi'], ['tu', 'te', 'te', 'toi'], ['il / elle', 'le / la', 'lui', 'lui / elle'], ['nous', 'nous', 'nous', 'nous'], ['vous', 'vous', 'vous', 'vous'], ['ils / elles', 'les', 'leur', 'eux / elles']] },
      { type: 'text', text: '**COD** vervangt een lijdend voorwerp zonder voorzetsel: Je vois Marie → Je **la** vois. **COI** vervangt **à + persoon**: Je parle à Paul → Je **lui** parle.' },
      { type: 'text', text: '**y** vervangt **à + ding of plaats**: Je vais à Paris → J’**y** vais. **en** vervangt **de + ding** of een hoeveelheid: Je mange du pain → J’**en** mange. J’ai trois frères → J’**en** ai trois.' },
      { type: 'text', text: 'Plaats: vóór de persoonsvorm (Je le vois), in de passé composé vóór avoir/être (Je l’ai vu), en bij een infinitief vóór de infinitief (Je vais le faire).' },
      { type: 'tip', text: 'Volgorde bij twee: me/te/nous/vous → le/la/les → lui/leur → y → en. Il me le donne. Je le lui donne.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Tu vois Paul ? Oui, je ___ vois.', answer: 'le' },
      { type: 'gap', sentence: 'Tu parles à ta mère ? Oui, je ___ parle.', answer: 'lui', explain: 'parler à + persoon → COI: lui.' },
      { type: 'gap', sentence: 'Vous allez à Lyon ? Oui, nous ___ allons.', answer: 'y', explain: 'à + plaats → y.' },
      { type: 'gap', sentence: 'Tu as des frères ? Oui, j’___ ai deux.', answer: 'en', explain: 'Een hoeveelheid → en.' },
      { type: 'gap', sentence: 'Tu téléphones à tes parents ? Oui, je ___ téléphone.', answer: 'leur', explain: 'à + personen (meervoud) → leur.' },
      { type: 'gap', sentence: 'Elle aime les chats ? Oui, elle ___ aime.', answer: 'les' },
      { type: 'gap', sentence: 'Tu manges de la soupe ? Oui, j’___ mange.', answer: 'en' },
      { type: 'order', words: ['Je', 'vais', 'le', 'faire'], nl: 'Ik ga het doen.', explain: 'Bij een infinitief staat het voornaamwoord vóór de infinitief.' },
      { type: 'fix', sentence: 'Je parle lui.', answer: 'Je lui parle.', explain: 'Het voornaamwoord staat vóór de persoonsvorm.' },
    ],
  },
  {
    id: 'possessifs-demonstratifs',
    blocks: [
      { type: 'table', caption: 'Bezittelijke voornaamwoorden', head: ['', 'mannelijk', 'vrouwelijk', 'meervoud'], rows: [['mijn', 'mon', 'ma', 'mes'], ['jouw', 'ton', 'ta', 'tes'], ['zijn/haar', 'son', 'sa', 'ses'], ['ons/onze', 'notre', 'notre', 'nos'], ['jullie', 'votre', 'votre', 'vos'], ['hun', 'leur', 'leur', 'leurs']] },
      { type: 'text', text: 'Het bezittelijk voornaamwoord hangt af van het **bezit**, niet van de bezitter: Paul aime **sa** mère (mère is vrouwelijk). Vóór een vrouwelijk woord met klinker gebruik je mon/ton/son: **mon** amie, **son** école.' },
      { type: 'table', caption: 'Aanwijzende voornaamwoorden (deze/die)', head: ['mannelijk', 'mann. + klinker/h', 'vrouwelijk', 'meervoud'], rows: [['ce', 'cet', 'cette', 'ces']] },
      { type: 'tip', text: 'Met -ci en -là maak je verschil tussen dichtbij en ver weg: ce livre-ci (dit boek), ce livre-là (dat boek).' },
    ],
    exercises: [
      { type: 'gap', sentence: '___ frère (mijn)', answer: 'mon' },
      { type: 'gap', sentence: '___ sœur (zijn)', answer: 'sa' },
      { type: 'gap', sentence: '___ amie (mijn)', answer: 'mon', explain: 'Vrouwelijk woord met klinker: mon.' },
      { type: 'gap', sentence: '___ parents (onze)', answer: 'nos' },
      { type: 'gap', sentence: '___ maison (hun)', answer: 'leur' },
      { type: 'gap', sentence: '___ homme (deze)', answer: 'cet', explain: 'Mannelijk woord met h: cet.' },
      { type: 'gap', sentence: '___ école (deze)', answer: 'cette' },
      { type: 'gap', sentence: '___ garçons (deze)', answer: 'ces' },
      { type: 'choice', question: 'Paul aime ___ mère.', options: ['son', 'sa', 'ses', 'leur'], answer: 1, explain: 'Het gaat om mère (vrouwelijk), dus sa — ook al is Paul een jongen.' },
    ],
  },
  {
    id: 'pronoms-relatifs',
    blocks: [
      { type: 'table', head: ['woord', 'wanneer', 'voorbeeld'], rows: [['qui', 'onderwerp', 'Le garçon **qui** parle est mon frère.'], ['que / qu’', 'lijdend voorwerp', 'Le livre **que** je lis est super.'], ['dont', 'vervangt de + …', 'Le film **dont** je parle est français. (parler de)'], ['où', 'plaats of tijd', 'La ville **où** j’habite. Le jour **où** il est né.'], ['lequel / laquelle / lesquels / lesquelles', 'na een voorzetsel (dingen)', 'La table sur **laquelle** il y a un vase.']] },
      { type: 'tip', text: 'Truc: staat er direct een werkwoord achter? Dan meestal qui. Staat er eerst een onderwerp (je, il, Marie)? Dan meestal que.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Le garçon ___ parle est mon frère.', answer: 'qui' },
      { type: 'gap', sentence: 'Le livre ___ je lis est super.', answer: 'que' },
      { type: 'gap', sentence: 'La ville ___ j’habite est belle.', answer: 'où' },
      { type: 'gap', sentence: 'Le film ___ je parle est français.', answer: 'dont', explain: 'parler de → dont.' },
      { type: 'gap', sentence: 'C’est l’ami ___ j’ai rencontré hier.', answer: 'que' },
      { type: 'gap', sentence: 'Le jour ___ il est né, il neigeait.', answer: 'où' },
      { type: 'gap', sentence: 'La table sur ___ il y a un vase est ancienne.', answer: 'laquelle' },
      { type: 'gap', sentence: 'L’homme ___ habite ici est médecin.', answer: 'qui' },
      { type: 'choice', question: 'Voilà la fille ___ j’ai vue.', options: ['qui', 'que', 'dont', 'où'], answer: 1 },
    ],
  },
  {
    id: 'negation',
    blocks: [
      { type: 'table', head: ['Frans', 'Nederlands'], rows: [['ne … pas', 'niet'], ['ne … jamais', 'nooit'], ['ne … plus', 'niet meer'], ['ne … rien', 'niets'], ['ne … personne', 'niemand'], ['ne … pas encore', 'nog niet']] },
      { type: 'text', text: '**ne** staat vóór de persoonsvorm, **pas/jamais/…** erachter: Je **ne** mange **pas**. Vóór een klinker wordt ne: n’ → Je **n’**aime pas.' },
      { type: 'text', text: 'In de passé composé staan de twee delen om **avoir/être**: Je **n’**ai **pas** mangé. Maar **personne** komt achter het deelwoord: Je n’ai vu **personne**.' },
      { type: 'tip', text: 'Bij een infinitief staan ne pas samen ervóór: Il préfère ne pas venir.' },
    ],
    exercises: [
      { type: 'translate', nl: 'Hij rookt nooit.', answer: 'Il ne fume jamais.' },
      { type: 'translate', nl: 'Ik heb niets gezien.', answer: "Je n'ai rien vu." },
      { type: 'translate', nl: 'Wij wonen niet meer in Parijs.', answer: 'Nous n’habitons plus à Paris.' },
      { type: 'gap', sentence: 'Je ne vois ___. (niemand)', answer: 'personne' },
      { type: 'gap', sentence: 'Elle ___ aime pas le café.', answer: "n'" },
      { type: 'order', words: ['Je', "n'ai", 'pas', 'mangé'], nl: 'Ik heb niet gegeten.' },
      { type: 'fix', sentence: "Je n'ai vu rien.", answer: "Je n'ai rien vu.", explain: 'rien staat vóór het voltooid deelwoord (alleen personne staat erachter).' },
      { type: 'fix', sentence: 'Il mange pas de viande.', answer: 'Il ne mange pas de viande.', explain: 'In geschreven Frans mag ne niet ontbreken.' },
    ],
  },
  {
    id: 'questions',
    blocks: [
      { type: 'text', text: 'Er zijn drie manieren om een vraag te stellen: 1) met **intonatie**: Tu viens ? 2) met **est-ce que**: Est-ce que tu viens ? 3) met **inversie** (onderwerp en werkwoord omdraaien, met streepje): Viens-tu ?' },
      { type: 'text', text: 'Bij inversie met il, elle of on en een werkwoord dat op een klinker eindigt, komt er **-t-** tussen: Parle-**t**-il français ? Va-**t**-elle venir ?' },
      { type: 'table', caption: 'Vraagwoorden', head: ['Frans', 'Nederlands'], rows: [['qui', 'wie'], ['que / qu’est-ce que', 'wat'], ['où', 'waar(heen)'], ['quand', 'wanneer'], ['comment', 'hoe'], ['pourquoi', 'waarom'], ['combien (de)', 'hoeveel'], ['quel / quelle / quels / quelles', 'welk(e)']] },
    ],
    exercises: [
      { type: 'choice', question: 'Welke vraag is goed?', options: ['Parle-t-il français ?', 'Parle-il français ?', 'Parle il-t français ?', 'Il-parle français ?'], answer: 0, explain: 'Werkwoord eindigt op een klinker + il → -t-.' },
      { type: 'translate', nl: 'Waar woon je?', answer: 'Où habites-tu ? / Où est-ce que tu habites ? / Tu habites où ?' },
      { type: 'translate', nl: 'Hoe heet je?', answer: "Comment tu t'appelles ? / Comment t'appelles-tu ? / Comment est-ce que tu t'appelles ? / Tu t'appelles comment ?" },
      { type: 'choice', question: '___ heure est-il ?', options: ['Quel', 'Quelle', 'Quels', 'Qu’est-ce que'], answer: 1, explain: 'heure is vrouwelijk: quelle.' },
      { type: 'gap', sentence: '___ est-ce que tu fais ce soir ? (wat)', answer: "Qu'" },
      { type: 'gap', sentence: '___ coûte ce livre ? (hoeveel)', answer: 'Combien' },
      { type: 'gap', sentence: '___ es-tu en retard ? (waarom)', answer: 'Pourquoi' },
      { type: 'order', words: ['Est-ce', 'que', 'tu', 'viens', 'demain', '?'], nl: 'Kom je morgen?' },
    ],
  },
  {
    id: 'si-zinnen',
    blocks: [
      { type: 'table', head: ['', 'si-deel', 'hoofdzin', 'voorbeeld'], rows: [['1. echt mogelijk', 'présent', 'futur (of présent/impératif)', 'Si tu viens, je serai content.'], ['2. denkbeeldig nu', 'imparfait', 'conditionnel présent', 'Si j’avais de l’argent, j’achèterais une voiture.'], ['3. verleden (te laat)', 'plus-que-parfait', 'conditionnel passé', 'Si j’avais su, je serais venu.']] },
      { type: 'tip', text: 'Na **si** komt nooit een futur of conditionnel! Si + il → s’il. Si + elle blijft si elle.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Si j’___ le temps, je viendrais.', answer: 'avais', hint: 'avoir' },
      { type: 'gap', sentence: 'S’il pleut, nous ___ à la maison.', answer: 'resterons', hint: 'rester' },
      { type: 'gap', sentence: 'Si tu avais travaillé, tu ___.', answer: 'aurais réussi', hint: 'réussir' },
      { type: 'gap', sentence: 'Si nous ___, nous serions riches.', answer: 'gagnions', hint: 'gagner' },
      { type: 'gap', sentence: 'Si elle vient, je lui ___.', answer: 'parlerai', hint: 'parler' },
      { type: 'gap', sentence: 'Si j’étais riche, j’___ le tour du monde.', answer: 'ferais', hint: 'faire' },
      { type: 'fix', sentence: "Si j'aurais de l'argent, je voyagerais.", answer: "Si j'avais de l'argent, je voyagerais.", explain: 'Na si nooit de conditionnel: imparfait.' },
      { type: 'choice', question: 'Si tu ___ plus tôt, tu aurais vu le film.', options: ['étais arrivé', 'arrivais', 'arriverais', 'serais arrivé'], answer: 0, explain: 'Type 3: si + plus-que-parfait.' },
    ],
  },
  {
    id: 'nombres-heure-date',
    blocks: [
      { type: 'table', head: ['getal', 'Frans'], rows: [['21', 'vingt et un'], ['22', 'vingt-deux'], ['70', 'soixante-dix'], ['71', 'soixante et onze'], ['75', 'soixante-quinze'], ['80', 'quatre-vingts'], ['81', 'quatre-vingt-un'], ['90', 'quatre-vingt-dix'], ['99', 'quatre-vingt-dix-neuf'], ['100', 'cent'], ['200', 'deux cents']] },
      { type: 'text', text: '70 = 60 + 10, 80 = 4 × 20, 90 = 4 × 20 + 10. **et** staat alleen bij 21, 31, 41, 51, 61 en 71.' },
      { type: 'table', caption: 'Hoe laat is het?', head: ['tijd', 'Frans'], rows: [['3:00', 'Il est trois heures.'], ['3:15', 'Il est trois heures et quart.'], ['3:30', 'Il est trois heures et demie.'], ['3:45', 'Il est quatre heures moins le quart.'], ['3:50', 'Il est quatre heures moins dix.'], ['12:00', 'Il est midi. / Il est minuit.']] },
      { type: 'text', text: 'Datum: **le** + getal + maand: le 14 juillet. De eerste: **le premier** mai.' },
    ],
    exercises: [
      { type: 'gap', sentence: '70 = ___', answer: 'soixante-dix' },
      { type: 'gap', sentence: '80 = ___', answer: 'quatre-vingts' },
      { type: 'gap', sentence: '95 = ___', answer: 'quatre-vingt-quinze' },
      { type: 'gap', sentence: '71 = ___', answer: 'soixante et onze' },
      { type: 'gap', sentence: '81 = ___', answer: 'quatre-vingt-un' },
      { type: 'translate', nl: 'Het is kwart over drie.', answer: 'Il est trois heures et quart.' },
      { type: 'translate', nl: 'Het is kwart voor vijf.', answer: 'Il est cinq heures moins le quart.' },
      { type: 'gap', sentence: '1 mei = le ___ mai', answer: 'premier' },
    ],
  },
];
