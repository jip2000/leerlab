import { describe, expect, it } from 'vitest';
import { itEngine as itE } from '@/features/verbs/it';
import { ptEngine as pt } from '@/features/verbs/pt';
import { laEngine as la } from '@/features/verbs/la';
import type { VerbEngine } from '@/features/verbs/types';
import { checkAnswer } from '@/lib/check';
import { defaultSettings } from '@/lib/settings';

const forms = (e: VerbEngine, inf: string, t: string) => [0, 1, 2, 3, 4, 5].map((i) => e.bare(inf, t, i)).join(',');
const ok = (e: VerbEngine, given: string, inf: string, t: string, i: number) =>
  checkAnswer(given, e.answer(inf, t, i), { ...defaultSettings.nakijkregels, allowTypos: false }).result;

describe('Italiaans', () => {
  const t: [string, string, string][] = [
    ['parlare', 'presente', 'parlo,parli,parla,parliamo,parlate,parlano'],
    ['credere', 'presente', 'credo,credi,crede,crediamo,credete,credono'],
    ['dormire', 'presente', 'dormo,dormi,dorme,dormiamo,dormite,dormono'],
    ['finire', 'presente', 'finisco,finisci,finisce,finiamo,finite,finiscono'],
    ['cercare', 'presente', 'cerco,cerchi,cerca,cerchiamo,cercate,cercano'],
    ['mangiare', 'presente', 'mangio,mangi,mangia,mangiamo,mangiate,mangiano'],
    ['studiare', 'presente', 'studio,studi,studia,studiamo,studiate,studiano'],
    ['essere', 'presente', 'sono,sei,è,siamo,siete,sono'],
    ['avere', 'presente', 'ho,hai,ha,abbiamo,avete,hanno'],
    ['andare', 'presente', 'vado,vai,va,andiamo,andate,vanno'],
    ['fare', 'imperfetto', 'facevo,facevi,faceva,facevamo,facevate,facevano'],
    ['essere', 'imperfetto', 'ero,eri,era,eravamo,eravate,erano'],
    ['parlare', 'futuro', 'parlerò,parlerai,parlerà,parleremo,parlerete,parleranno'],
    ['cercare', 'futuro', 'cercherò,cercherai,cercherà,cercheremo,cercherete,cercheranno'],
    ['mangiare', 'futuro', 'mangerò,mangerai,mangerà,mangeremo,mangerete,mangeranno'],
    ['venire', 'futuro', 'verrò,verrai,verrà,verremo,verrete,verranno'],
    ['essere', 'condizionale', 'sarei,saresti,sarebbe,saremmo,sareste,sarebbero'],
    ['parlare', 'congiuntivo', 'parli,parli,parli,parliamo,parliate,parlino'],
    ['credere', 'congiuntivo', 'creda,creda,creda,crediamo,crediate,credano'],
    ['finire', 'congiuntivo', 'finisca,finisca,finisca,finiamo,finiate,finiscano'],
    ['andare', 'congiuntivo', 'vada,vada,vada,andiamo,andiate,vadano'],
    ['fare', 'congiuntivo', 'faccia,faccia,faccia,facciamo,facciate,facciano'],
    ['volere', 'congiuntivo', 'voglia,voglia,voglia,vogliamo,vogliate,vogliano'],
    ['cercare', 'congiuntivo', 'cerchi,cerchi,cerchi,cerchiamo,cerchiate,cerchino'],
  ];
  for (const [inf, tense, f] of t) it(`${inf} – ${tense}`, () => expect(forms(itE, inf, tense)).toBe(f));

  it('passato prossimo met avere en essere', () => {
    expect(itE.bare('parlare', 'passato-prossimo', 0)).toBe('ho parlato');
    expect(itE.bare('fare', 'passato-prossimo', 3)).toBe('abbiamo fatto');
    expect(itE.conjugate('andare', 'passato-prossimo')[0]).toBe('io sono andato/a');
    expect(ok(itE, 'sono andata', 'andare', 'passato-prossimo', 0)).toBe('goed');
    expect(ok(itE, 'siamo andate', 'andare', 'passato-prossimo', 3)).toBe('goed');
    expect(ok(itE, 'ho andato', 'andare', 'passato-prossimo', 0)).toBe('fout');
    expect(itE.bare('essere', 'passato-prossimo', 2)).toBe('è stato');
  });
  it('imperativo', () => {
    expect(forms(itE, 'parlare', 'imperativo')).toBe(',parla,,parliamo,parlate,');
    expect(forms(itE, 'finire', 'imperativo')).toBe(',finisci,,finiamo,finite,');
    expect(itE.bare('essere', 'imperativo', 1)).toBe('sii');
    expect(itE.bare('essere', 'imperativo', 4)).toBe('siate');
  });
});

describe('Portugees', () => {
  const t: [string, string, string][] = [
    ['falar', 'presente', 'falo,falas,fala,falamos,falais,falam'],
    ['comer', 'presente', 'como,comes,come,comemos,comeis,comem'],
    ['partir', 'presente', 'parto,partes,parte,partimos,partis,partem'],
    ['falar', 'perfeito', 'falei,falaste,falou,falámos,falastes,falaram'],
    ['comer', 'perfeito', 'comi,comeste,comeu,comemos,comestes,comeram'],
    ['partir', 'perfeito', 'parti,partiste,partiu,partimos,partistes,partiram'],
    ['ficar', 'perfeito', 'fiquei,ficaste,ficou,ficámos,ficastes,ficaram'],
    ['começar', 'perfeito', 'comecei,começaste,começou,começámos,começastes,começaram'],
    ['falar', 'imperfeito', 'falava,falavas,falava,falávamos,faláveis,falavam'],
    ['ir', 'imperfeito', 'ia,ias,ia,íamos,íeis,iam'],
    ['ter', 'imperfeito', 'tinha,tinhas,tinha,tínhamos,tínheis,tinham'],
    ['falar', 'futuro', 'falarei,falarás,falará,falaremos,falareis,falarão'],
    ['fazer', 'futuro', 'farei,farás,fará,faremos,fareis,farão'],
    ['dizer', 'condicional', 'diria,dirias,diria,diríamos,diríeis,diriam'],
    ['falar', 'conjuntivo', 'fale,fales,fale,falemos,faleis,falem'],
    ['conhecer', 'conjuntivo', 'conheça,conheças,conheça,conheçamos,conheçais,conheçam'],
    ['pagar', 'conjuntivo', 'pague,pagues,pague,paguemos,pagueis,paguem'],
    ['conhecer', 'presente', 'conheço,conheces,conhece,conhecemos,conheceis,conhecem'],
    ['falar', 'infinitivo-pessoal', 'falar,falares,falar,falarmos,falardes,falarem'],
  ];
  for (const [inf, tense, f] of t) it(`${inf} – ${tense}`, () => expect(forms(pt, inf, tense)).toBe(f));
  it('mais-que-perfeito en onregelmatige deelwoorden', () => {
    expect(pt.bare('falar', 'mais-que-perfeito', 0)).toBe('tinha falado');
    expect(pt.bare('fazer', 'mais-que-perfeito', 0)).toBe('tinha feito');
    expect(pt.bare('escrever', 'mais-que-perfeito', 3)).toBe('tínhamos escrito');
  });
  it('Braziliaans "falamos" telt ook in de perfeito', () => {
    expect(ok(pt, 'falamos', 'falar', 'perfeito', 3)).toBe('goed');
    expect(ok(pt, 'você fala', 'falar', 'presente', 2)).toBe('goed');
  });
});

describe('Latijn', () => {
  const t: [string, string, string][] = [
    ['laudare', 'praesens', 'laudo,laudas,laudat,laudamus,laudatis,laudant'],
    ['monere', 'praesens', 'moneo,mones,monet,monemus,monetis,monent'],
    ['regere', 'praesens', 'rego,regis,regit,regimus,regitis,regunt'],
    ['audire', 'praesens', 'audio,audis,audit,audimus,auditis,audiunt'],
    ['capere', 'praesens', 'capio,capis,capit,capimus,capitis,capiunt'],
    ['laudare', 'imperfectum', 'laudabam,laudabas,laudabat,laudabamus,laudabatis,laudabant'],
    ['regere', 'imperfectum', 'regebam,regebas,regebat,regebamus,regebatis,regebant'],
    ['audire', 'imperfectum', 'audiebam,audiebas,audiebat,audiebamus,audiebatis,audiebant'],
    ['laudare', 'futurum', 'laudabo,laudabis,laudabit,laudabimus,laudabitis,laudabunt'],
    ['monere', 'futurum', 'monebo,monebis,monebit,monebimus,monebitis,monebunt'],
    ['regere', 'futurum', 'regam,reges,reget,regemus,regetis,regent'],
    ['audire', 'futurum', 'audiam,audies,audiet,audiemus,audietis,audient'],
    ['regere', 'perfectum', 'rexi,rexisti,rexit,reximus,rexistis,rexerunt'],
    ['laudare', 'plusquamperfectum', 'laudaveram,laudaveras,laudaverat,laudaveramus,laudaveratis,laudaverant'],
    ['monere', 'futurum-exactum', 'monuero,monueris,monuerit,monuerimus,monueritis,monuerint'],
    ['laudare', 'praesens-passief', 'laudor,laudaris,laudatur,laudamur,laudamini,laudantur'],
    ['monere', 'praesens-passief', 'moneor,moneris,monetur,monemur,monemini,monentur'],
    ['regere', 'praesens-passief', 'regor,regeris,regitur,regimur,regimini,reguntur'],
    ['audire', 'praesens-passief', 'audior,audiris,auditur,audimur,audimini,audiuntur'],
    ['capere', 'praesens-passief', 'capior,caperis,capitur,capimur,capimini,capiuntur'],
    ['laudare', 'imperfectum-passief', 'laudabar,laudabaris,laudabatur,laudabamur,laudabamini,laudabantur'],
    ['laudare', 'coniunctivus-praesens', 'laudem,laudes,laudet,laudemus,laudetis,laudent'],
    ['monere', 'coniunctivus-praesens', 'moneam,moneas,moneat,moneamus,moneatis,moneant'],
    ['regere', 'coniunctivus-praesens', 'regam,regas,regat,regamus,regatis,regant'],
    ['capere', 'coniunctivus-imperfectum', 'caperem,caperes,caperet,caperemus,caperetis,caperent'],
    ['dare', 'praesens', 'do,das,dat,damus,datis,dant'],
    ['esse', 'praesens', 'sum,es,est,sumus,estis,sunt'],
    ['posse', 'imperfectum', 'poteram,poteras,poterat,poteramus,poteratis,poterant'],
    ['ire', 'futurum', 'ibo,ibis,ibit,ibimus,ibitis,ibunt'],
    ['velle', 'coniunctivus-praesens', 'velim,velis,velit,velimus,velitis,velint'],
  ];
  for (const [inf, tense, f] of t) it(`${inf} – ${tense}`, () => expect(forms(la, inf, tense)).toBe(f));
  it('perfectum passief en imperativus', () => {
    expect(la.bare('laudare', 'perfectum-passief', 0)).toBe('laudatus sum');
    expect(ok(la, 'laudata est', 'laudare', 'perfectum-passief', 2)).toBe('goed');
    expect(la.bare('regere', 'perfectum-passief', 5)).toBe('recti sunt');
    expect(forms(la, 'laudare', 'imperativus')).toBe(',lauda,,,laudate,');
    expect(forms(la, 'regere', 'imperativus')).toBe(',rege,,,regite,');
    expect(forms(la, 'dicere', 'imperativus')).toBe(',dic,,,dicite,');
    expect(forms(la, 'audire', 'imperativus')).toBe(',audi,,,audite,');
  });
  it('geen passief bij komen, slapen en facere (fio)', () => {
    expect(forms(la, 'venire', 'praesens-passief')).toBe(',,,,,');
    expect(forms(la, 'facere', 'praesens-passief')).toBe(',,,,,');
  });
});

describe('alle nieuwe motoren: geen lege of kapotte vormen', () => {
  for (const e of [itE, pt, la])
    it(e.lang, () => {
      for (const v of e.verbs)
        for (const t of e.tenses)
          for (const f of e.conjugate(v.inf, t.id)) expect(f, `${v.inf} ${t.id}`).not.toMatch(/undefined|\s{2}/);
    });
});
