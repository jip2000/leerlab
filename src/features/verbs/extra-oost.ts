/**
 * Werkwoorden POOLS, TSJECHISCH, RUSSISCH, FINS, GRIEKS (modern) en TURKS, als tabellen.
 * Telkens de tegenwoordige en de verleden tijd van de belangrijkste werkwoorden.
 * Bij de verleden tijd van Pools, Tsjechisch en Russisch: de mannelijke vorm.
 */
import { tableEngine, type Six, type TableVerb } from './table';

const onr = (v: TableVerb): TableVerb => ({ ...v, tags: ['onregelmatig'] });
const reg = (v: TableVerb): TableVerb => ({ ...v, tags: ['regelmatig'] });
const presets = [
  { id: 'onr', label: 'Onregelmatig', filter: (v: { tags: string[] }) => v.tags.includes('onregelmatig') },
  { id: 'reg', label: 'Regelmatig', filter: (v: { tags: string[] }) => v.tags.includes('regelmatig') },
];
const six = (s: string) => s.split(',').map((x) => x.trim()) as Six;

/* ───────────────────────── POOLS ───────────────────────── */

/** Verleden tijd (mannelijk): byłem, byłeś, był, byliśmy, byliście, byli. */
const plPast = (sg: string, pl: string, sg3 = sg): Six => [`${sg}em`, `${sg}eś`, sg3, `${pl}iśmy`, `${pl}iście`, `${pl}i`];
const pl = (inf: string, nlw: string, pres: string, past: Six, r = false): TableVerb =>
  (r ? reg : onr)({ inf, nl: nlw, forms: { teraz: six(pres), przeszly: past } });

export const plEngine = tableEngine({
  lang: 'pl',
  persons: ['ja', 'ty', 'on/ona', 'my', 'wy', 'oni/one'],
  tenses: [
    { id: 'teraz', label: 'czas teraźniejszy' },
    { id: 'przeszly', label: 'czas przeszły (m.)' },
  ],
  presets,
  verbs: [
    pl('być', 'zijn', 'jestem, jesteś, jest, jesteśmy, jesteście, są', plPast('był', 'byl')),
    pl('mieć', 'hebben', 'mam, masz, ma, mamy, macie, mają', plPast('miał', 'miel')),
    pl('iść', 'gaan', 'idę, idziesz, idzie, idziemy, idziecie, idą', plPast('szedł', 'szl')),
    pl('jeść', 'eten', 'jem, jesz, je, jemy, jecie, jedzą', plPast('jadł', 'jedl')),
    pl('chcieć', 'willen', 'chcę, chcesz, chce, chcemy, chcecie, chcą', plPast('chciał', 'chciel')),
    pl('móc', 'kunnen', 'mogę, możesz, może, możemy, możecie, mogą', plPast('mogł', 'mogl', 'mógł')),
    pl('wiedzieć', 'weten', 'wiem, wiesz, wie, wiemy, wiecie, wiedzą', plPast('wiedział', 'wiedziel')),
    pl('pisać', 'schrijven', 'piszę, piszesz, pisze, piszemy, piszecie, piszą', plPast('pisał', 'pisal')),
    pl('pić', 'drinken', 'piję, pijesz, pije, pijemy, pijecie, piją', plPast('pił', 'pil')),
    pl('robić', 'doen, maken', 'robię, robisz, robi, robimy, robicie, robią', plPast('robił', 'robil'), true),
    pl('mówić', 'spreken', 'mówię, mówisz, mówi, mówimy, mówicie, mówią', plPast('mówił', 'mówil'), true),
    pl('czytać', 'lezen', 'czytam, czytasz, czyta, czytamy, czytacie, czytają', plPast('czytał', 'czytal'), true),
    pl('mieszkać', 'wonen', 'mieszkam, mieszkasz, mieszka, mieszkamy, mieszkacie, mieszkają', plPast('mieszkał', 'mieszkal'), true),
    pl('pracować', 'werken', 'pracuję, pracujesz, pracuje, pracujemy, pracujecie, pracują', plPast('pracował', 'pracowal'), true),
  ],
});

/* ───────────────────────── TSJECHISCH ───────────────────────── */

const csPast = (sg: string, pl: string): Six => [`${sg} jsem`, `${sg} jsi`, sg, `${pl} jsme`, `${pl} jste`, pl];
const cs = (inf: string, nlw: string, pres: string, past: Six, r = false): TableVerb =>
  (r ? reg : onr)({ inf, nl: nlw, forms: { pritomny: six(pres), minuly: past } });

export const csEngine = tableEngine({
  lang: 'cs',
  persons: ['já', 'ty', 'on/ona', 'my', 'vy', 'oni'],
  tenses: [
    { id: 'pritomny', label: 'přítomný čas' },
    { id: 'minuly', label: 'minulý čas (m.)' },
  ],
  presets,
  verbs: [
    cs('být', 'zijn', 'jsem, jsi, je, jsme, jste, jsou', csPast('byl', 'byli')),
    cs('mít', 'hebben', 'mám, máš, má, máme, máte, mají', csPast('měl', 'měli')),
    cs('jít', 'gaan', 'jdu, jdeš, jde, jdeme, jdete, jdou', csPast('šel', 'šli')),
    cs('chtít', 'willen', 'chci, chceš, chce, chceme, chcete, chtějí', csPast('chtěl', 'chtěli')),
    cs('moct', 'kunnen', 'můžu / mohu, můžeš, může, můžeme, můžete, můžou / mohou', csPast('mohl', 'mohli')),
    cs('vědět', 'weten', 'vím, víš, ví, víme, víte, vědí', csPast('věděl', 'věděli')),
    cs('jíst', 'eten', 'jím, jíš, jí, jíme, jíte, jedí', csPast('jedl', 'jedli')),
    cs('pít', 'drinken', 'piju / piji, piješ, pije, pijeme, pijete, pijou / pijí', csPast('pil', 'pili')),
    cs('číst', 'lezen', 'čtu, čteš, čte, čteme, čtete, čtou', csPast('četl', 'četli')),
    cs('psát', 'schrijven', 'píšu / píši, píšeš, píše, píšeme, píšete, píšou / píší', csPast('psal', 'psali')),
    cs('dělat', 'doen, maken', 'dělám, děláš, dělá, děláme, děláte, dělají', csPast('dělal', 'dělali'), true),
    cs('mluvit', 'spreken', 'mluvím, mluvíš, mluví, mluvíme, mluvíte, mluví', csPast('mluvil', 'mluvili'), true),
    cs('bydlet', 'wonen', 'bydlím, bydlíš, bydlí, bydlíme, bydlíte, bydlí', csPast('bydlel', 'bydleli'), true),
    cs('pracovat', 'werken', 'pracuju / pracuji, pracuješ, pracuje, pracujeme, pracujete, pracujou / pracují', csPast('pracoval', 'pracovali'), true),
  ],
  explain: (_v, tense) => (tense === 'minuly' ? 'Verleden tijd: -l-vorm + jsem/jsi/jsme/jste; bij on en oni geen hulpwerkwoord.' : undefined),
});

/* ───────────────────────── RUSSISCH ───────────────────────── */

const ruPast = (m: string, mv: string): Six => [m, m, m, mv, mv, mv];
const ru = (inf: string, nlw: string, pres: string, past: Six, r = false): TableVerb =>
  (r ? reg : onr)({ inf, nl: nlw, forms: { nastoyashchee: pres ? six(pres) : ['', '', '', '', '', ''], proshedshee: past } });

export const ruEngine = tableEngine({
  lang: 'ru',
  persons: ['я', 'ты', 'он/она', 'мы', 'вы', 'они'],
  tenses: [
    { id: 'nastoyashchee', label: 'настоящее время (nu)' },
    { id: 'proshedshee', label: 'прошедшее время (verleden, m.)' },
  ],
  presets,
  yo: true,
  verbs: [
    ru('быть', 'zijn', '', ruPast('был', 'были')),
    ru('идти', 'gaan (lopend)', 'иду, идёшь, идёт, идём, идёте, идут', ruPast('шёл', 'шли')),
    ru('есть', 'eten', 'ем, ешь, ест, едим, едите, едят', ruPast('ел', 'ели')),
    ru('пить', 'drinken', 'пью, пьёшь, пьёт, пьём, пьёте, пьют', ruPast('пил', 'пили')),
    ru('жить', 'wonen, leven', 'живу, живёшь, живёт, живём, живёте, живут', ruPast('жил', 'жили')),
    ru('хотеть', 'willen', 'хочу, хочешь, хочет, хотим, хотите, хотят', ruPast('хотел', 'хотели')),
    ru('мочь', 'kunnen', 'могу, можешь, может, можем, можете, могут', ruPast('мог', 'могли')),
    ru('писать', 'schrijven', 'пишу, пишешь, пишет, пишем, пишете, пишут', ruPast('писал', 'писали')),
    ru('любить', 'houden van', 'люблю, любишь, любит, любим, любите, любят', ruPast('любил', 'любили')),
    ru('говорить', 'spreken', 'говорю, говоришь, говорит, говорим, говорите, говорят', ruPast('говорил', 'говорили'), true),
    ru('делать', 'doen, maken', 'делаю, делаешь, делает, делаем, делаете, делают', ruPast('делал', 'делали'), true),
    ru('читать', 'lezen', 'читаю, читаешь, читает, читаем, читаете, читают', ruPast('читал', 'читали'), true),
    ru('знать', 'weten, kennen', 'знаю, знаешь, знает, знаем, знаете, знают', ruPast('знал', 'знали'), true),
    ru('работать', 'werken', 'работаю, работаешь, работает, работаем, работаете, работают', ruPast('работал', 'работали'), true),
  ],
  explain: (v, tense) =>
    tense === 'proshedshee' ? 'Verleden tijd: mannelijk -л, vrouwelijk -ла, meervoud -ли (voor alle personen).' : v.inf === 'быть' ? undefined : undefined,
});

/* ───────────────────────── FINS ───────────────────────── */

const fi = (inf: string, nlw: string, pres: string, past: string, r = false): TableVerb =>
  (r ? reg : onr)({ inf, nl: nlw, forms: { preesens: six(pres), imperfekti: six(past) } });

export const fiEngine = tableEngine({
  lang: 'fi',
  persons: ['minä', 'sinä', 'hän', 'me', 'te', 'he'],
  tenses: [
    { id: 'preesens', label: 'preesens (nu)' },
    { id: 'imperfekti', label: 'imperfekti (verleden)' },
  ],
  presets,
  verbs: [
    fi('olla', 'zijn', 'olen, olet, on, olemme, olette, ovat', 'olin, olit, oli, olimme, olitte, olivat'),
    fi('tehdä', 'doen, maken', 'teen, teet, tekee, teemme, teette, tekevät', 'tein, teit, teki, teimme, teitte, tekivät'),
    fi('nähdä', 'zien', 'näen, näet, näkee, näemme, näette, näkevät', 'näin, näit, näki, näimme, näitte, näkivät'),
    fi('syödä', 'eten', 'syön, syöt, syö, syömme, syötte, syövät', 'söin, söit, söi, söimme, söitte, söivät'),
    fi('juoda', 'drinken', 'juon, juot, juo, juomme, juotte, juovat', 'join, joit, joi, joimme, joitte, joivat'),
    fi('tulla', 'komen', 'tulen, tulet, tulee, tulemme, tulette, tulevat', 'tulin, tulit, tuli, tulimme, tulitte, tulivat'),
    fi('mennä', 'gaan', 'menen, menet, menee, menemme, menette, menevät', 'menin, menit, meni, menimme, menitte, menivät'),
    fi('lukea', 'lezen', 'luen, luet, lukee, luemme, luette, lukevat', 'luin, luit, luki, luimme, luitte, lukivat'),
    fi('kirjoittaa', 'schrijven', 'kirjoitan, kirjoitat, kirjoittaa, kirjoitamme, kirjoitatte, kirjoittavat', 'kirjoitin, kirjoitit, kirjoitti, kirjoitimme, kirjoititte, kirjoittivat'),
    fi('ymmärtää', 'begrijpen', 'ymmärrän, ymmärrät, ymmärtää, ymmärrämme, ymmärrätte, ymmärtävät', 'ymmärsin, ymmärsit, ymmärsi, ymmärsimme, ymmärsitte, ymmärsivät'),
    fi('haluta', 'willen', 'haluan, haluat, haluaa, haluamme, haluatte, haluavat', 'halusin, halusit, halusi, halusimme, halusitte, halusivat'),
    fi('puhua', 'spreken', 'puhun, puhut, puhuu, puhumme, puhutte, puhuvat', 'puhuin, puhuit, puhui, puhuimme, puhuitte, puhuivat', true),
    fi('asua', 'wonen', 'asun, asut, asuu, asumme, asutte, asuvat', 'asuin, asuit, asui, asuimme, asuitte, asuivat', true),
    fi('ostaa', 'kopen', 'ostan, ostat, ostaa, ostamme, ostatte, ostavat', 'ostin, ostit, osti, ostimme, ostitte, ostivat', true),
  ],
  explain: (_v, tense) =>
    tense === 'imperfekti' ? 'Imperfekti: stam + i + persoonsuitgang (-n, -t, –, -mme, -tte, -vat).' : 'Preesens: stam + -n, -t, (klinker verlengd), -mme, -tte, -vat.',
});

/* ───────────────────────── GRIEKS (modern) ───────────────────────── */

const el = (inf: string, nlw: string, pres: string, past: string, r = false): TableVerb =>
  (r ? reg : onr)({ inf, nl: nlw, forms: { enestotas: six(pres), aoristos: six(past) } });

export const elEngine = tableEngine({
  lang: 'el',
  persons: ['εγώ', 'εσύ', 'αυτός/αυτή', 'εμείς', 'εσείς', 'αυτοί/αυτές'],
  tenses: [
    { id: 'enestotas', label: 'ενεστώτας (nu)' },
    { id: 'aoristos', label: 'αόριστος (verleden)' },
  ],
  presets,
  verbs: [
    el('είμαι', 'zijn', 'είμαι, είσαι, είναι, είμαστε, είστε, είναι', 'ήμουν / ήμουνα, ήσουν / ήσουνα, ήταν, ήμασταν / ήμαστε, ήσασταν / ήσαστε, ήταν'),
    el('έχω', 'hebben', 'έχω, έχεις, έχει, έχουμε, έχετε, έχουν', 'είχα, είχες, είχε, είχαμε, είχατε, είχαν'),
    el('πάω', 'gaan', 'πάω, πας, πάει, πάμε, πάτε, πάνε', 'πήγα, πήγες, πήγε, πήγαμε, πήγατε, πήγαν'),
    el('τρώω', 'eten', 'τρώω, τρως, τρώει, τρώμε, τρώτε, τρώνε', 'έφαγα, έφαγες, έφαγε, φάγαμε, φάγατε, έφαγαν'),
    el('πίνω', 'drinken', 'πίνω, πίνεις, πίνει, πίνουμε, πίνετε, πίνουν', 'ήπια, ήπιες, ήπιε, ήπιαμε, ήπιατε, ήπιαν'),
    el('βλέπω', 'zien', 'βλέπω, βλέπεις, βλέπει, βλέπουμε, βλέπετε, βλέπουν', 'είδα, είδες, είδε, είδαμε, είδατε, είδαν'),
    el('θέλω', 'willen', 'θέλω, θέλεις, θέλει, θέλουμε, θέλετε, θέλουν', 'ήθελα, ήθελες, ήθελε, θέλαμε, θέλατε, ήθελαν'),
    el('ξέρω', 'weten', 'ξέρω, ξέρεις, ξέρει, ξέρουμε, ξέρετε, ξέρουν', 'ήξερα, ήξερες, ήξερε, ξέραμε, ξέρατε, ήξεραν'),
    el('κάνω', 'doen, maken', 'κάνω, κάνεις, κάνει, κάνουμε, κάνετε, κάνουν', 'έκανα, έκανες, έκανε, κάναμε, κάνατε, έκαναν'),
    el('μένω', 'wonen, blijven', 'μένω, μένεις, μένει, μένουμε, μένετε, μένουν', 'έμεινα, έμεινες, έμεινε, μείναμε, μείνατε, έμειναν'),
    el('γράφω', 'schrijven', 'γράφω, γράφεις, γράφει, γράφουμε, γράφετε, γράφουν', 'έγραψα, έγραψες, έγραψε, γράψαμε, γράψατε, έγραψαν', true),
    el('διαβάζω', 'lezen', 'διαβάζω, διαβάζεις, διαβάζει, διαβάζουμε, διαβάζετε, διαβάζουν', 'διάβασα, διάβασες, διάβασε, διαβάσαμε, διαβάσατε, διάβασαν', true),
    el('μιλάω', 'spreken', 'μιλάω / μιλώ, μιλάς, μιλάει / μιλά, μιλάμε, μιλάτε, μιλάνε / μιλούν', 'μίλησα, μίλησες, μίλησε, μιλήσαμε, μιλήσατε, μίλησαν', true),
  ],
  explain: (_v, tense) => (tense === 'aoristos' ? 'Bij drie lettergrepen of minder krijgt de αόριστος vaak een ε- of ή- vooraan (έγραψα, ήπια).' : undefined),
});

/* ───────────────────────── TURKS ───────────────────────── */
// Turks is heel regelmatig: de vormen worden hier uit de stam gemaakt (klinkerharmonie).

const trNu = (stem: string): Six => [`${stem}um`, `${stem}sun`, stem, `${stem}uz`, `${stem}sunuz`, `${stem}lar`];
function trVerleden(base: string): Six {
  const x = base.at(-1)!; // ı, i, u of ü
  return [`${base}m`, `${base}n`, base, `${base}k`, `${base}n${x}z`, `${base}${'iü'.includes(x) ? 'ler' : 'lar'}`];
}
const tr = (inf: string, nlw: string, nu: string, verleden: string): TableVerb =>
  reg({ inf, nl: nlw, forms: { simdiki: trNu(nu), gecmis: trVerleden(verleden) } });

export const trEngine = tableEngine({
  lang: 'tr',
  persons: ['ben', 'sen', 'o', 'biz', 'siz', 'onlar'],
  tenses: [
    { id: 'simdiki', label: 'şimdiki zaman (-iyor, nu)' },
    { id: 'gecmis', label: 'geçmiş zaman (-di, verleden)' },
  ],
  verbs: [
    tr('gelmek', 'komen', 'geliyor', 'geldi'),
    tr('gitmek', 'gaan', 'gidiyor', 'gitti'),
    tr('yapmak', 'doen, maken', 'yapıyor', 'yaptı'),
    tr('yemek', 'eten', 'yiyor', 'yedi'),
    tr('içmek', 'drinken', 'içiyor', 'içti'),
    tr('okumak', 'lezen', 'okuyor', 'okudu'),
    tr('yazmak', 'schrijven', 'yazıyor', 'yazdı'),
    tr('konuşmak', 'spreken', 'konuşuyor', 'konuştu'),
    tr('görmek', 'zien', 'görüyor', 'gördü'),
    tr('bilmek', 'weten', 'biliyor', 'bildi'),
    tr('almak', 'nemen, kopen', 'alıyor', 'aldı'),
    tr('sevmek', 'houden van', 'seviyor', 'sevdi'),
    tr('çalışmak', 'werken', 'çalışıyor', 'çalıştı'),
    tr('oturmak', 'zitten, wonen', 'oturuyor', 'oturdu'),
  ],
  explain: (_v, tense) =>
    tense === 'gecmis' ? 'Verleden tijd: stam + -dı/-di/-du/-dü (na p, ç, t, k, s, ş, h, f: -tı/-ti/-tu/-tü) + persoon.' : 'Nu: stam + -(ı/i/u/ü)yor + -um, -sun, –, -uz, -sunuz, -lar.',
});
