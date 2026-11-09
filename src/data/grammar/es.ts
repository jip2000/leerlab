/** SPAANSE GRAMMATICA: uitleg en oefeningen (zelf geschreven). */
import { tenseTopic } from '@/features/grammar/tenseTopic';
import type { TopicContent } from '@/features/grammar/types';

const t = (id: string, tenses: string[], models: string[], blocks: TopicContent['blocks'], verbs?: (inf: string, tags: string[]) => boolean) =>
  tenseTopic({ id, lang: 'es', tenses, models, blocks, verbs });

export const esGrammar: TopicContent[] = [
  {
    id: 'ser-estar-hay',
    blocks: [
      { type: 'text', text: 'Spaans heeft twee werkwoorden voor “zijn”: **ser** en **estar**. En voor “er is / er zijn” gebruik je **hay**.' },
      { type: 'table', head: ['ser', 'estar'], rows: [['wie of wat iets is: Soy Ana. Es profesora.', 'waar iets is: Madrid está en España.'], ['afkomst: Somos de Holanda.', 'tijdelijke toestand: Estoy cansado.'], ['karakter, uiterlijk: Es simpático.', 'gevoel: Está contenta.'], ['tijd, datum: Son las tres.', 'estar + gerundio: Estoy comiendo.'], ['materiaal: La mesa es de madera.', '']] },
      { type: 'text', text: '**hay** (er is / er zijn) gebruik je voor iets onbepaalds: **Hay** un perro en el jardín. **Hay** muchos libros. Voor iets bepaalds gebruik je estar: El perro **está** en el jardín.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Yo ___ de Holanda.', answer: 'soy' },
      { type: 'gap', sentence: 'Hoy ___ muy cansada.', answer: 'estoy' },
      { type: 'gap', sentence: 'Madrid ___ en España.', answer: 'está' },
      { type: 'gap', sentence: 'Mi hermano ___ alto y simpático.', answer: 'es' },
      { type: 'gap', sentence: '___ un gato en la cocina.', answer: 'Hay' },
      { type: 'gap', sentence: '___ las cinco de la tarde.', answer: 'Son' },
      { type: 'gap', sentence: 'Nosotros ___ estudiando.', answer: 'estamos' },
      { type: 'gap', sentence: 'El libro ___ en la mesa.', answer: 'está', explain: 'Bepaald ding (el libro) + plaats → estar, geen hay.' },
      { type: 'choice', question: '¿Dónde ___ el baño?', options: ['es', 'está', 'hay', 'son'], answer: 1 },
    ],
  },
  t('presente', ['presente'], ['hablar', 'comer', 'vivir'], [
    { type: 'text', text: 'De **presente**: nu, gewoontes, feiten. Uitgangen: **-ar**: -o, -as, -a, -amos, -áis, -an. **-er**: -o, -es, -e, -emos, -éis, -en. **-ir**: -o, -es, -e, -imos, -ís, -en.' },
    { type: 'tip', text: 'Het onderwerp (yo, tú…) laat je meestal weg: de uitgang laat al zien wie het doet. Hablo español = ik spreek Spaans.' },
  ]),
  t('klinkerwisseling', ['presente'], ['pensar', 'volver', 'pedir'], [
    { type: 'text', text: 'Bij veel werkwoorden verandert de klinker van de stam in de presente: **e → ie** (pensar → pienso), **o → ue** (volver → vuelvo), **e → i** (pedir → pido), **u → ue** (jugar → juego).' },
    { type: 'text', text: 'Dat gebeurt bij **yo, tú, él/ella/usted en ellos** (de “laarsvormen”), maar **niet** bij nosotros en vosotros: pensamos, pensáis.' },
  ], (_inf, tags) => tags.includes('stam')),
  t('preterito-perfecto', ['perfecto'], ['hablar', 'comer', 'hacer'], [
    { type: 'text', text: 'De **pretérito perfecto**: iets dat vandaag, deze week of “ooit” gebeurd is. Vorm: **haber** (he, has, ha, hemos, habéis, han) + voltooid deelwoord: -ar → **-ado**, -er/-ir → **-ido**.' },
    { type: 'tip', text: 'Onregelmatige deelwoorden: hecho (hacer), dicho (decir), visto (ver), escrito (escribir), puesto (poner), vuelto (volver), abierto (abrir), muerto (morir).' },
  ]),
  t('indefinido', ['indefinido'], ['hablar', 'comer', 'ser'], [
    { type: 'text', text: 'De **pretérito indefinido**: een afgeronde handeling op een bepaald moment in het verleden (ayer, el año pasado, en 2020).' },
    { type: 'text', text: '**-ar**: -é, -aste, -ó, -amos, -asteis, -aron. **-er/-ir**: -í, -iste, -ió, -imos, -isteis, -ieron.' },
    { type: 'tip', text: 'Let op: buscar → busqué, llegar → llegué, empezar → empecé. Onregelmatig: ser/ir (fui), tener (tuve), hacer (hice), estar (estuve), decir (dije).' },
  ]),
  t('imperfecto', ['imperfecto'], ['hablar', 'vivir', 'ser'], [
    { type: 'text', text: 'Het **imperfecto**: beschrijving en gewoontes in het verleden, of iets dat bezig was. **-ar**: -aba, -abas, -aba, -ábamos, -abais, -aban. **-er/-ir**: -ía, -ías, -ía, -íamos, -íais, -ían.' },
    { type: 'tip', text: 'Maar drie onregelmatige: ser (era), ir (iba), ver (veía).' },
  ]),
  t('pluscuamperfecto', ['pluscuamperfecto'], ['hablar', 'comer'], [
    { type: 'text', text: 'Het **pluscuamperfecto**: iets dat vóór een ander moment in het verleden gebeurde. Vorm: **había, habías, había, habíamos, habíais, habían** + voltooid deelwoord.' },
  ]),
  t('futuro', ['futuro'], ['hablar', 'tener'], [
    { type: 'text', text: 'Het **futuro**: hele infinitief + **-é, -ás, -á, -emos, -éis, -án**: hablaré. Onregelmatige stammen: tendr- (tener), har- (hacer), dir- (decir), podr- (poder), querr- (querer), sabr- (saber), pondr- (poner), vendr- (venir), saldr- (salir).' },
    { type: 'tip', text: 'Vaak gebruik je ook **ir a + infinitief**: Voy a estudiar (ik ga studeren).' },
  ]),
  t('condicional', ['condicional'], ['hablar', 'tener'], [
    { type: 'text', text: 'Het **condicional** betekent “zou(den)”: Me gustaría ir. Vorm: dezelfde stam als het futuro + **-ía, -ías, -ía, -íamos, -íais, -ían**.' },
  ]),
  t('subjuntivo', ['subjuntivo', 'subjuntivo-imperfecto'], ['hablar', 'comer', 'tener'], [
    { type: 'text', text: 'De **subjuntivo** gebruik je na wens, wil, gevoel en twijfel met **que**: Quiero que vengas. Espero que tengas suerte. Ook na para que, cuando (toekomst) en ojalá.' },
    { type: 'text', text: '**Presente**: stam van de yo-vorm + “omgekeerde” uitgang: -ar → **-e** (hable), -er/-ir → **-a** (coma, tenga). **Imperfecto**: ellos van het indefinido zonder -ron + **-ra** (hablara, tuviera).' },
  ]),
  t('imperativo', ['imperativo'], ['hablar', 'comer', 'tener'], [
    { type: 'text', text: 'De **imperativo** (bevelende wijs). **tú**: zoals él in de presente (¡Habla!). **vosotros**: infinitief met -d (¡Hablad!). **usted/ustedes/nosotros**: subjuntivo (¡Hable!).' },
    { type: 'tip', text: 'Korte onregelmatige tú-vormen: di, haz, ve, pon, sal, sé, ten, ven.' },
  ]),
  t('gerundio', ['presente-continuo'], ['hablar', 'comer', 'dormir'], [
    { type: 'text', text: '**estar + gerundio**: iets dat nú bezig is: Estoy comiendo. Gerundio: -ar → **-ando**, -er/-ir → **-iendo**.' },
    { type: 'tip', text: 'Bijzonder: leer → leyendo, ir → yendo, dormir → durmiendo, pedir → pidiendo, decir → diciendo.' },
  ]),
  {
    id: 'gustar',
    blocks: [
      { type: 'text', text: 'Met **gustar** zeg je wat je leuk vindt. Letterlijk: “het bevalt mij”. Dus het ding dat je leuk vindt is het onderwerp: **Me gusta** el chocolate (ev). **Me gustan** los perros (mv).' },
      { type: 'table', head: ['(nadruk)', 'voornaamwoord', 'voorbeeld'], rows: [['a mí', 'me', 'Me gusta bailar.'], ['a ti', 'te', '¿Te gusta el fútbol?'], ['a él / ella / usted', 'le', 'Le gustan los gatos.'], ['a nosotros', 'nos', 'Nos gusta la música.'], ['a vosotros', 'os', '¿Os gusta Madrid?'], ['a ellos / ellas / ustedes', 'les', 'Les gustan las películas.']] },
      { type: 'tip', text: 'Na gustar + werkwoord altijd enkelvoud: Me gusta leer y escribir. Zo werken ook encantar en interesar.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Me ___ el chocolate.', answer: 'gusta' },
      { type: 'gap', sentence: 'Me ___ los perros.', answer: 'gustan' },
      { type: 'gap', sentence: 'A mi hermano ___ gusta el fútbol.', answer: 'le' },
      { type: 'gap', sentence: '¿A ti ___ gusta bailar?', answer: 'te' },
      { type: 'gap', sentence: 'A nosotros ___ gustan las vacaciones.', answer: 'nos' },
      { type: 'gap', sentence: 'A mis padres ___ gusta viajar.', answer: 'les' },
      { type: 'translate', nl: 'Ik vind katten leuk.', answer: 'Me gustan los gatos.' },
      { type: 'fix', sentence: 'Yo gusto el helado.', answer: 'Me gusta el helado.' },
    ],
  },
  {
    id: 'lidwoorden-geslacht',
    blocks: [
      { type: 'table', head: ['', 'mannelijk', 'vrouwelijk', 'mann. mv', 'vrouw. mv'], rows: [['bepaald', 'el', 'la', 'los', 'las'], ['onbepaald', 'un', 'una', 'unos', 'unas']] },
      { type: 'text', text: 'Woorden op **-o** zijn meestal mannelijk, op **-a** meestal vrouwelijk. Uitzonderingen: **el** día, **el** mapa, **el** problema, **la** mano, **la** foto. Woorden op -ción en -dad zijn vrouwelijk.' },
      { type: 'text', text: 'Meervoud: klinker + **s** (casa → casas), medeklinker + **es** (ciudad → ciudades). Bijvoeglijk naamwoord past zich aan: los chicos altos, las chicas altas.' },
      { type: 'tip', text: 'a + el = **al** (Voy al cine). de + el = **del** (la casa del profesor).' },
    ],
    exercises: [
      { type: 'gap', sentence: '___ casa (de)', answer: 'la' },
      { type: 'gap', sentence: '___ problema (het)', answer: 'el' },
      { type: 'gap', sentence: '___ ciudades (de)', answer: 'las' },
      { type: 'gap', sentence: '___ día (een)', answer: 'un' },
      { type: 'gap', sentence: 'Voy ___ cine.', answer: 'al' },
      { type: 'gap', sentence: 'las chicas ___ (alto)', answer: 'altas' },
      { type: 'gap', sentence: 'el profesor → los ___', answer: 'profesores', explain: 'Medeklinker + es.' },
      { type: 'choice', question: '___ mano', options: ['el', 'la', 'los', 'un'], answer: 1, explain: 'mano is een uitzondering: la mano.' },
    ],
  },
  {
    id: 'pronombres',
    blocks: [
      { type: 'table', head: ['', 'lijdend voorwerp', 'meewerkend voorwerp'], rows: [['yo', 'me', 'me'], ['tú', 'te', 'te'], ['él/ella/usted', 'lo / la', 'le'], ['nosotros', 'nos', 'nos'], ['vosotros', 'os', 'os'], ['ellos/ellas/ustedes', 'los / las', 'les']] },
      { type: 'text', text: 'Het voornaamwoord staat **vóór de persoonsvorm**: Lo veo. Bij een infinitief, gerundio of bevestigende imperativo mag/moet het er **aan vast**: Quiero verlo. Estoy comiéndolo. ¡Dámelo!' },
      { type: 'tip', text: 'Twee voornaamwoorden: eerst meewerkend, dan lijdend. **le/les** wordt dan **se**: Le doy el libro → **Se lo** doy.' },
    ],
    exercises: [
      { type: 'gap', sentence: '¿Ves a Juan? Sí, ___ veo.', answer: 'lo' },
      { type: 'gap', sentence: '¿Compras la revista? Sí, ___ compro.', answer: 'la' },
      { type: 'gap', sentence: 'Escribo a mi abuela. → ___ escribo.', answer: 'Le' },
      { type: 'gap', sentence: 'Doy el libro a María. → ___ lo doy.', answer: 'Se', explain: 'le + lo → se lo.' },
      { type: 'gap', sentence: '¿Tienes las llaves? Sí, ___ tengo.', answer: 'las' },
      { type: 'gap', sentence: 'Quiero comprar___. (het, el coche)', answer: 'lo' },
      { type: 'fix', sentence: 'Le lo doy.', answer: 'Se lo doy.' },
      { type: 'order', words: ['Se', 'lo', 'doy', 'mañana'], nl: 'Ik geef het hem morgen.' },
    ],
  },
  {
    id: 'por-para',
    blocks: [
      { type: 'table', head: ['para', 'por'], rows: [['doel: Estudio para aprender.', 'oorzaak: Gracias por tu ayuda.'], ['bestemming: Salgo para Madrid.', 'door, via: Paseo por el parque.'], ['voor wie: Es para ti.', 'ruil, prijs: Lo compré por diez euros.'], ['deadline: para el lunes', 'tijdsduur / dagdeel: por la mañana'], ['mening: Para mí, es fácil.', 'door wie (passief): escrito por Cervantes']] },
      { type: 'tip', text: 'Ezelsbruggetje: **para** kijkt vooruit (doel, bestemming), **por** kijkt terug (oorzaak, reden).' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Este regalo es ___ ti.', answer: 'para' },
      { type: 'gap', sentence: 'Gracias ___ la comida.', answer: 'por' },
      { type: 'gap', sentence: 'Estudio ___ ser médico.', answer: 'para' },
      { type: 'gap', sentence: 'Caminamos ___ la playa.', answer: 'por' },
      { type: 'gap', sentence: 'Lo compré ___ cinco euros.', answer: 'por' },
      { type: 'gap', sentence: 'Necesito el trabajo ___ el viernes.', answer: 'para' },
      { type: 'gap', sentence: 'Trabajo ___ la mañana.', answer: 'por' },
      { type: 'gap', sentence: '___ mí, el español es fácil.', answer: 'Para' },
    ],
  },
];
