import { describe, expect, it } from 'vitest';
import { esEngine as es } from '@/features/verbs/es';
import { checkAnswer } from '@/lib/check';
import { defaultSettings } from '@/lib/settings';

const forms = (inf: string, t: string) => [0, 1, 2, 3, 4, 5].map((i) => es.bare(inf, t, i)).join(',');

// presente | indefinido | subjuntivo (los geschreven)
const tabel: [string, string, string, string][] = [
  ['hablar', 'hablo,hablas,habla,hablamos,habláis,hablan', 'hablé,hablaste,habló,hablamos,hablasteis,hablaron', 'hable,hables,hable,hablemos,habléis,hablen'],
  ['comer', 'como,comes,come,comemos,coméis,comen', 'comí,comiste,comió,comimos,comisteis,comieron', 'coma,comas,coma,comamos,comáis,coman'],
  ['vivir', 'vivo,vives,vive,vivimos,vivís,viven', 'viví,viviste,vivió,vivimos,vivisteis,vivieron', 'viva,vivas,viva,vivamos,viváis,vivan'],
  ['ser', 'soy,eres,es,somos,sois,son', 'fui,fuiste,fue,fuimos,fuisteis,fueron', 'sea,seas,sea,seamos,seáis,sean'],
  ['estar', 'estoy,estás,está,estamos,estáis,están', 'estuve,estuviste,estuvo,estuvimos,estuvisteis,estuvieron', 'esté,estés,esté,estemos,estéis,estén'],
  ['ir', 'voy,vas,va,vamos,vais,van', 'fui,fuiste,fue,fuimos,fuisteis,fueron', 'vaya,vayas,vaya,vayamos,vayáis,vayan'],
  ['tener', 'tengo,tienes,tiene,tenemos,tenéis,tienen', 'tuve,tuviste,tuvo,tuvimos,tuvisteis,tuvieron', 'tenga,tengas,tenga,tengamos,tengáis,tengan'],
  ['hacer', 'hago,haces,hace,hacemos,hacéis,hacen', 'hice,hiciste,hizo,hicimos,hicisteis,hicieron', 'haga,hagas,haga,hagamos,hagáis,hagan'],
  ['decir', 'digo,dices,dice,decimos,decís,dicen', 'dije,dijiste,dijo,dijimos,dijisteis,dijeron', 'diga,digas,diga,digamos,digáis,digan'],
  ['poder', 'puedo,puedes,puede,podemos,podéis,pueden', 'pude,pudiste,pudo,pudimos,pudisteis,pudieron', 'pueda,puedas,pueda,podamos,podáis,puedan'],
  ['querer', 'quiero,quieres,quiere,queremos,queréis,quieren', 'quise,quisiste,quiso,quisimos,quisisteis,quisieron', 'quiera,quieras,quiera,queramos,queráis,quieran'],
  ['saber', 'sé,sabes,sabe,sabemos,sabéis,saben', 'supe,supiste,supo,supimos,supisteis,supieron', 'sepa,sepas,sepa,sepamos,sepáis,sepan'],
  ['poner', 'pongo,pones,pone,ponemos,ponéis,ponen', 'puse,pusiste,puso,pusimos,pusisteis,pusieron', 'ponga,pongas,ponga,pongamos,pongáis,pongan'],
  ['venir', 'vengo,vienes,viene,venimos,venís,vienen', 'vine,viniste,vino,vinimos,vinisteis,vinieron', 'venga,vengas,venga,vengamos,vengáis,vengan'],
  ['dar', 'doy,das,da,damos,dais,dan', 'di,diste,dio,dimos,disteis,dieron', 'dé,des,dé,demos,deis,den'],
  ['ver', 'veo,ves,ve,vemos,veis,ven', 'vi,viste,vio,vimos,visteis,vieron', 'vea,veas,vea,veamos,veáis,vean'],
  ['salir', 'salgo,sales,sale,salimos,salís,salen', 'salí,saliste,salió,salimos,salisteis,salieron', 'salga,salgas,salga,salgamos,salgáis,salgan'],
  ['oír', 'oigo,oyes,oye,oímos,oís,oyen', 'oí,oíste,oyó,oímos,oísteis,oyeron', 'oiga,oigas,oiga,oigamos,oigáis,oigan'],
  ['pensar', 'pienso,piensas,piensa,pensamos,pensáis,piensan', 'pensé,pensaste,pensó,pensamos,pensasteis,pensaron', 'piense,pienses,piense,pensemos,penséis,piensen'],
  ['volver', 'vuelvo,vuelves,vuelve,volvemos,volvéis,vuelven', 'volví,volviste,volvió,volvimos,volvisteis,volvieron', 'vuelva,vuelvas,vuelva,volvamos,volváis,vuelvan'],
  ['dormir', 'duermo,duermes,duerme,dormimos,dormís,duermen', 'dormí,dormiste,durmió,dormimos,dormisteis,durmieron', 'duerma,duermas,duerma,durmamos,durmáis,duerman'],
  ['pedir', 'pido,pides,pide,pedimos,pedís,piden', 'pedí,pediste,pidió,pedimos,pedisteis,pidieron', 'pida,pidas,pida,pidamos,pidáis,pidan'],
  ['jugar', 'juego,juegas,juega,jugamos,jugáis,juegan', 'jugué,jugaste,jugó,jugamos,jugasteis,jugaron', 'juegue,juegues,juegue,juguemos,juguéis,jueguen'],
  ['empezar', 'empiezo,empiezas,empieza,empezamos,empezáis,empiezan', 'empecé,empezaste,empezó,empezamos,empezasteis,empezaron', 'empiece,empieces,empiece,empecemos,empecéis,empiecen'],
  ['buscar', 'busco,buscas,busca,buscamos,buscáis,buscan', 'busqué,buscaste,buscó,buscamos,buscasteis,buscaron', 'busque,busques,busque,busquemos,busquéis,busquen'],
  ['conocer', 'conozco,conoces,conoce,conocemos,conocéis,conocen', 'conocí,conociste,conoció,conocimos,conocisteis,conocieron', 'conozca,conozcas,conozca,conozcamos,conozcáis,conozcan'],
  ['sentir', 'siento,sientes,siente,sentimos,sentís,sienten', 'sentí,sentiste,sintió,sentimos,sentisteis,sintieron', 'sienta,sientas,sienta,sintamos,sintáis,sientan'],
  ['seguir', 'sigo,sigues,sigue,seguimos,seguís,siguen', 'seguí,seguiste,siguió,seguimos,seguisteis,siguieron', 'siga,sigas,siga,sigamos,sigáis,sigan'],
];

describe('Spaanse vervoegingen', () => {
  for (const [inf, pres, pret, subj] of tabel) {
    it(inf, () => {
      expect(forms(inf, 'presente')).toBe(pres);
      expect(forms(inf, 'indefinido')).toBe(pret);
      expect(forms(inf, 'subjuntivo')).toBe(subj);
    });
  }

  it('imperfecto (ook ser, ir, ver)', () => {
    expect(forms('hablar', 'imperfecto')).toBe('hablaba,hablabas,hablaba,hablábamos,hablabais,hablaban');
    expect(forms('vivir', 'imperfecto')).toBe('vivía,vivías,vivía,vivíamos,vivíais,vivían');
    expect(forms('ser', 'imperfecto')).toBe('era,eras,era,éramos,erais,eran');
    expect(forms('ir', 'imperfecto')).toBe('iba,ibas,iba,íbamos,ibais,iban');
    expect(forms('ver', 'imperfecto')).toBe('veía,veías,veía,veíamos,veíais,veían');
  });

  it('futuro en condicional (ook onregelmatige stammen)', () => {
    expect(forms('hablar', 'futuro')).toBe('hablaré,hablarás,hablará,hablaremos,hablaréis,hablarán');
    expect(forms('tener', 'futuro')).toBe('tendré,tendrás,tendrá,tendremos,tendréis,tendrán');
    expect(es.bare('hacer', 'futuro', 0)).toBe('haré');
    expect(es.bare('decir', 'condicional', 0)).toBe('diría');
    expect(es.bare('salir', 'condicional', 3)).toBe('saldríamos');
    expect(es.bare('poder', 'futuro', 5)).toBe('podrán');
    expect(es.bare('oír', 'futuro', 0)).toBe('oiré');
  });

  it('perfecto met onregelmatige deelwoorden', () => {
    expect(es.bare('hablar', 'perfecto', 0)).toBe('he hablado');
    expect(es.bare('hacer', 'perfecto', 2)).toBe('ha hecho');
    expect(es.bare('decir', 'perfecto', 3)).toBe('hemos dicho');
    expect(es.bare('escribir', 'perfecto', 0)).toBe('he escrito');
    expect(es.bare('volver', 'perfecto', 0)).toBe('he vuelto');
    expect(es.bare('ver', 'pluscuamperfecto', 0)).toBe('había visto');
    expect(es.bare('poner', 'perfecto', 5)).toBe('han puesto');
    expect(es.bare('abrir', 'perfecto', 0)).toBe('he abierto');
    expect(es.bare('leer', 'perfecto', 0)).toBe('he leído');
  });

  it('gerundio', () => {
    expect(es.bare('hablar', 'presente-continuo', 0)).toBe('estoy hablando');
    expect(es.bare('dormir', 'presente-continuo', 2)).toBe('está durmiendo');
    expect(es.bare('pedir', 'presente-continuo', 0)).toBe('estoy pidiendo');
    expect(es.bare('leer', 'presente-continuo', 0)).toBe('estoy leyendo');
    expect(es.bare('decir', 'presente-continuo', 0)).toBe('estoy diciendo');
  });

  it('subjuntivo imperfecto (-ra en -se)', () => {
    expect(forms('hablar', 'subjuntivo-imperfecto')).toBe('hablara,hablaras,hablara,habláramos,hablarais,hablaran');
    expect(forms('tener', 'subjuntivo-imperfecto')).toBe('tuviera,tuvieras,tuviera,tuviéramos,tuvierais,tuvieran');
    expect(es.bare('ser', 'subjuntivo-imperfecto', 3)).toBe('fuéramos');
    expect(checkAnswer('hablase', es.answer('hablar', 'subjuntivo-imperfecto', 0), defaultSettings.nakijkregels).result).toBe('goed');
  });

  it('imperativo', () => {
    expect(forms('hablar', 'imperativo')).toBe(',habla,hable,hablemos,hablad,hablen');
    expect(forms('tener', 'imperativo')).toBe(',ten,tenga,tengamos,tened,tengan');
    expect(es.bare('hacer', 'imperativo', 1)).toBe('haz');
    expect(es.bare('decir', 'imperativo', 1)).toBe('di');
    expect(es.bare('ir', 'imperativo', 1)).toBe('ve');
    expect(es.bare('ir', 'imperativo', 4)).toBe('id');
    expect(es.bare('ser', 'imperativo', 1)).toBe('sé');
    expect(es.bare('poner', 'imperativo', 1)).toBe('pon');
    expect(es.bare('salir', 'imperativo', 1)).toBe('sal');
    expect(es.bare('venir', 'imperativo', 1)).toBe('ven');
    expect(es.bare('pensar', 'imperativo', 1)).toBe('piensa');
  });

  it('met of zonder voornaamwoord', () => {
    const r = { ...defaultSettings.nakijkregels, allowTypos: false };
    expect(checkAnswer('hablo', es.answer('hablar', 'presente', 0), r).result).toBe('goed');
    expect(checkAnswer('yo hablo', es.answer('hablar', 'presente', 0), r).result).toBe('goed');
    expect(checkAnswer('usted habla', es.answer('hablar', 'presente', 2), r).result).toBe('goed');
    expect(checkAnswer('nosotras hablamos', es.answer('hablar', 'presente', 3), r).result).toBe('goed');
    expect(checkAnswer('hablamos', es.answer('hablar', 'presente', 2), r).result).toBe('fout');
  });

  it('elk werkwoord heeft alle vormen', () => {
    for (const v of es.verbs)
      for (const t of es.tenses) {
        const f = es.conjugate(v.inf, t.id);
        for (const p of t.persons ?? [0, 1, 2, 3, 4, 5]) {
          if (t.id === 'imperativo' && (v.inf === 'haber' || v.inf === 'poder')) continue;
          expect(f[p], `${v.inf} ${t.id} ${p}`).toMatch(/\S/);
          expect(f[p]).not.toMatch(/undefined|\s{2}/);
        }
      }
  });
});
