import { describe, expect, it } from 'vitest';
import { deEngine as de, needsE } from '@/features/verbs/de';
import { checkAnswer } from '@/lib/check';
import { defaultSettings } from '@/lib/settings';

const forms = (inf: string, t: string) => [0, 1, 2, 3, 4, 5].map((i) => de.bare(inf, t, i)).join(',');

// Präsens, Präteritum en het voltooid deelwoord (via Perfekt "ich") — los geschreven.
const tabel: [string, string, string, string][] = [
  ['sein', 'bin,bist,ist,sind,seid,sind', 'war,warst,war,waren,wart,waren', 'bin gewesen'],
  ['haben', 'habe,hast,hat,haben,habt,haben', 'hatte,hattest,hatte,hatten,hattet,hatten', 'habe gehabt'],
  ['werden', 'werde,wirst,wird,werden,werdet,werden', 'wurde,wurdest,wurde,wurden,wurdet,wurden', 'bin geworden'],
  ['wissen', 'weiß,weißt,weiß,wissen,wisst,wissen', 'wusste,wusstest,wusste,wussten,wusstet,wussten', 'habe gewusst'],
  ['können', 'kann,kannst,kann,können,könnt,können', 'konnte,konntest,konnte,konnten,konntet,konnten', 'habe gekonnt'],
  ['müssen', 'muss,musst,muss,müssen,müsst,müssen', 'musste,musstest,musste,mussten,musstet,mussten', 'habe gemusst'],
  ['wollen', 'will,willst,will,wollen,wollt,wollen', 'wollte,wolltest,wollte,wollten,wolltet,wollten', 'habe gewollt'],
  ['mögen', 'mag,magst,mag,mögen,mögt,mögen', 'mochte,mochtest,mochte,mochten,mochtet,mochten', 'habe gemocht'],
  ['machen', 'mache,machst,macht,machen,macht,machen', 'machte,machtest,machte,machten,machtet,machten', 'habe gemacht'],
  ['arbeiten', 'arbeite,arbeitest,arbeitet,arbeiten,arbeitet,arbeiten', 'arbeitete,arbeitetest,arbeitete,arbeiteten,arbeitetet,arbeiteten', 'habe gearbeitet'],
  ['öffnen', 'öffne,öffnest,öffnet,öffnen,öffnet,öffnen', 'öffnete,öffnetest,öffnete,öffneten,öffnetet,öffneten', 'habe geöffnet'],
  ['tanzen', 'tanze,tanzt,tanzt,tanzen,tanzt,tanzen', 'tanzte,tanztest,tanzte,tanzten,tanztet,tanzten', 'habe getanzt'],
  ['reisen', 'reise,reist,reist,reisen,reist,reisen', 'reiste,reistest,reiste,reisten,reistet,reisten', 'bin gereist'],
  ['fahren', 'fahre,fährst,fährt,fahren,fahrt,fahren', 'fuhr,fuhrst,fuhr,fuhren,fuhrt,fuhren', 'bin gefahren'],
  ['schlafen', 'schlafe,schläfst,schläft,schlafen,schlaft,schlafen', 'schlief,schliefst,schlief,schliefen,schlieft,schliefen', 'habe geschlafen'],
  ['halten', 'halte,hältst,hält,halten,haltet,halten', 'hielt,hieltest,hielt,hielten,hieltet,hielten', 'habe gehalten'],
  ['geben', 'gebe,gibst,gibt,geben,gebt,geben', 'gab,gabst,gab,gaben,gabt,gaben', 'habe gegeben'],
  ['nehmen', 'nehme,nimmst,nimmt,nehmen,nehmt,nehmen', 'nahm,nahmst,nahm,nahmen,nahmt,nahmen', 'habe genommen'],
  ['essen', 'esse,isst,isst,essen,esst,essen', 'aß,aßest,aß,aßen,aßt,aßen', 'habe gegessen'],
  ['lesen', 'lese,liest,liest,lesen,lest,lesen', 'las,lasest,las,lasen,last,lasen', 'habe gelesen'],
  ['sehen', 'sehe,siehst,sieht,sehen,seht,sehen', 'sah,sahst,sah,sahen,saht,sahen', 'habe gesehen'],
  ['gehen', 'gehe,gehst,geht,gehen,geht,gehen', 'ging,gingst,ging,gingen,gingt,gingen', 'bin gegangen'],
  ['kommen', 'komme,kommst,kommt,kommen,kommt,kommen', 'kam,kamst,kam,kamen,kamt,kamen', 'bin gekommen'],
  ['finden', 'finde,findest,findet,finden,findet,finden', 'fand,fandest,fand,fanden,fandet,fanden', 'habe gefunden'],
  ['sitzen', 'sitze,sitzt,sitzt,sitzen,sitzt,sitzen', 'saß,saßest,saß,saßen,saßt,saßen', 'habe gesessen'],
  ['bringen', 'bringe,bringst,bringt,bringen,bringt,bringen', 'brachte,brachtest,brachte,brachten,brachtet,brachten', 'habe gebracht'],
  ['denken', 'denke,denkst,denkt,denken,denkt,denken', 'dachte,dachtest,dachte,dachten,dachtet,dachten', 'habe gedacht'],
  ['besuchen', 'besuche,besuchst,besucht,besuchen,besucht,besuchen', 'besuchte,besuchtest,besuchte,besuchten,besuchtet,besuchten', 'habe besucht'],
  ['studieren', 'studiere,studierst,studiert,studieren,studiert,studieren', 'studierte,studiertest,studierte,studierten,studiertet,studierten', 'habe studiert'],
  ['aufstehen', 'stehe auf,stehst auf,steht auf,stehen auf,steht auf,stehen auf', 'stand auf,standest auf,stand auf,standen auf,standet auf,standen auf', 'bin aufgestanden'],
  ['anfangen', 'fange an,fängst an,fängt an,fangen an,fangt an,fangen an', 'fing an,fingst an,fing an,fingen an,fingt an,fingen an', 'habe angefangen'],
  ['einkaufen', 'kaufe ein,kaufst ein,kauft ein,kaufen ein,kauft ein,kaufen ein', 'kaufte ein,kauftest ein,kaufte ein,kauften ein,kauftet ein,kauften ein', 'habe eingekauft'],
];

describe('Duitse vervoegingen', () => {
  for (const [inf, praes, praet, perf] of tabel) {
    it(`${inf}`, () => {
      expect(forms(inf, 'praesens')).toBe(praes);
      expect(forms(inf, 'praeteritum')).toBe(praet);
      expect(de.bare(inf, 'perfekt', 0)).toBe(perf);
    });
  }

  it('e-invoeging', () => {
    expect(needsE('arbeit')).toBe(true);
    expect(needsE('öffn')).toBe(true);
    expect(needsE('atm')).toBe(true);
    expect(needsE('lern')).toBe(false);
    expect(needsE('wohn')).toBe(false);
    expect(needsE('komm')).toBe(false);
  });

  it('Plusquamperfekt en Futur I', () => {
    expect(forms('gehen', 'plusquamperfekt')).toBe('war gegangen,warst gegangen,war gegangen,waren gegangen,wart gegangen,waren gegangen');
    expect(forms('machen', 'futur1')).toBe('werde machen,wirst machen,wird machen,werden machen,werdet machen,werden machen');
  });

  it('Konjunktiv II', () => {
    expect(forms('sein', 'konjunktiv2')).toBe('wäre,wärst,wäre,wären,wärt,wären');
    expect(forms('haben', 'konjunktiv2')).toBe('hätte,hättest,hätte,hätten,hättet,hätten');
    expect(forms('können', 'konjunktiv2')).toBe('könnte,könntest,könnte,könnten,könntet,könnten');
    expect(forms('mögen', 'konjunktiv2')).toBe('möchte,möchtest,möchte,möchten,möchtet,möchten');
    expect(forms('machen', 'konjunktiv2')).toBe('würde machen,würdest machen,würde machen,würden machen,würdet machen,würden machen');
    const r = defaultSettings.nakijkregels;
    expect(checkAnswer('ich käme', de.answer('kommen', 'konjunktiv2', 0), r).result).toBe('goed');
    expect(checkAnswer('ich würde kommen', de.answer('kommen', 'konjunktiv2', 0), r).result).toBe('goed');
    expect(checkAnswer('du wärest', de.answer('sein', 'konjunktiv2', 1), r).result).toBe('goed');
  });

  it('Imperativ', () => {
    expect(de.conjugate('machen', 'imperativ')).toEqual(['', 'mach!', '', '', 'macht!', 'machen Sie!']);
    expect(forms('geben', 'imperativ')).toBe(',gib,,,gebt,geben Sie');
    expect(forms('lesen', 'imperativ')).toBe(',lies,,,lest,lesen Sie');
    expect(forms('fahren', 'imperativ')).toBe(',fahr,,,fahrt,fahren Sie');
    expect(forms('arbeiten', 'imperativ')).toBe(',arbeite,,,arbeitet,arbeiten Sie');
    expect(forms('sein', 'imperativ')).toBe(',sei,,,seid,seien Sie');
    expect(forms('aufstehen', 'imperativ')).toBe(',steh auf,,,steht auf,stehen Sie auf');
    expect(checkAnswer('mache', de.answer('machen', 'imperativ', 1), defaultSettings.nakijkregels).result).toBe('goed');
  });

  it('antwoord met er, sie of es', () => {
    const r = { ...defaultSettings.nakijkregels, allowTypos: false };
    for (const p of ['er', 'sie', 'es']) expect(checkAnswer(`${p} fährt`, de.answer('fahren', 'praesens', 2), r).result).toBe('goed');
    expect(checkAnswer('fährt', de.answer('fahren', 'praesens', 2), r).result).toBe('goed');
    expect(checkAnswer('er fahrt', de.answer('fahren', 'praesens', 2), r).result).toBe('fout');
  });

  it('elk werkwoord heeft alle vormen', () => {
    for (const v of de.verbs)
      for (const t of de.tenses) {
        const f = de.conjugate(v.inf, t.id);
        for (const p of t.persons ?? [0, 1, 2, 3, 4, 5]) {
          if (t.id === 'imperativ' && (v.tags.includes('modaal') || v.inf === 'wissen')) continue;
          expect(f[p], `${v.inf} ${t.id} ${p}`).toMatch(/\S/);
          expect(f[p]).not.toMatch(/undefined|\s{2}/);
        }
      }
  });
});
