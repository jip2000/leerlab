import { describe, expect, it } from 'vitest';
import { frEngine as fr } from '@/features/verbs/fr';
import { checkAnswer } from '@/lib/check';
import { defaultSettings } from '@/lib/settings';

/** Vormen zonder voornaamwoord, gescheiden door komma's. */
const forms = (inf: string, t: string) => [0, 1, 2, 3, 4, 5].map((i) => fr.bare(inf, t, i)).join(',');

// Per werkwoord: présent, imparfait, futur simple, subjonctif présent (los geschreven, uit een vervoegingsboek).
const tabel: Record<string, Record<string, string>> = {
  être: { present: 'suis,es,est,sommes,êtes,sont', imparfait: 'étais,étais,était,étions,étiez,étaient', 'futur-simple': 'serai,seras,sera,serons,serez,seront', subjonctif: 'sois,sois,soit,soyons,soyez,soient' },
  avoir: { present: 'ai,as,a,avons,avez,ont', imparfait: 'avais,avais,avait,avions,aviez,avaient', 'futur-simple': 'aurai,auras,aura,aurons,aurez,auront', subjonctif: 'aie,aies,ait,ayons,ayez,aient' },
  aller: { present: 'vais,vas,va,allons,allez,vont', imparfait: 'allais,allais,allait,allions,alliez,allaient', 'futur-simple': 'irai,iras,ira,irons,irez,iront', subjonctif: 'aille,ailles,aille,allions,alliez,aillent' },
  faire: { present: 'fais,fais,fait,faisons,faites,font', imparfait: 'faisais,faisais,faisait,faisions,faisiez,faisaient', 'futur-simple': 'ferai,feras,fera,ferons,ferez,feront', subjonctif: 'fasse,fasses,fasse,fassions,fassiez,fassent' },
  dire: { present: 'dis,dis,dit,disons,dites,disent', imparfait: 'disais,disais,disait,disions,disiez,disaient', 'futur-simple': 'dirai,diras,dira,dirons,direz,diront', subjonctif: 'dise,dises,dise,disions,disiez,disent' },
  pouvoir: { present: 'peux,peux,peut,pouvons,pouvez,peuvent', imparfait: 'pouvais,pouvais,pouvait,pouvions,pouviez,pouvaient', 'futur-simple': 'pourrai,pourras,pourra,pourrons,pourrez,pourront', subjonctif: 'puisse,puisses,puisse,puissions,puissiez,puissent' },
  vouloir: { present: 'veux,veux,veut,voulons,voulez,veulent', imparfait: 'voulais,voulais,voulait,voulions,vouliez,voulaient', 'futur-simple': 'voudrai,voudras,voudra,voudrons,voudrez,voudront', subjonctif: 'veuille,veuilles,veuille,voulions,vouliez,veuillent' },
  savoir: { present: 'sais,sais,sait,savons,savez,savent', imparfait: 'savais,savais,savait,savions,saviez,savaient', 'futur-simple': 'saurai,sauras,saura,saurons,saurez,sauront', subjonctif: 'sache,saches,sache,sachions,sachiez,sachent' },
  devoir: { present: 'dois,dois,doit,devons,devez,doivent', imparfait: 'devais,devais,devait,devions,deviez,devaient', 'futur-simple': 'devrai,devras,devra,devrons,devrez,devront', subjonctif: 'doive,doives,doive,devions,deviez,doivent' },
  venir: { present: 'viens,viens,vient,venons,venez,viennent', imparfait: 'venais,venais,venait,venions,veniez,venaient', 'futur-simple': 'viendrai,viendras,viendra,viendrons,viendrez,viendront', subjonctif: 'vienne,viennes,vienne,venions,veniez,viennent' },
  voir: { present: 'vois,vois,voit,voyons,voyez,voient', imparfait: 'voyais,voyais,voyait,voyions,voyiez,voyaient', 'futur-simple': 'verrai,verras,verra,verrons,verrez,verront', subjonctif: 'voie,voies,voie,voyions,voyiez,voient' },
  prendre: { present: 'prends,prends,prend,prenons,prenez,prennent', imparfait: 'prenais,prenais,prenait,prenions,preniez,prenaient', 'futur-simple': 'prendrai,prendras,prendra,prendrons,prendrez,prendront', subjonctif: 'prenne,prennes,prenne,prenions,preniez,prennent' },
  mettre: { present: 'mets,mets,met,mettons,mettez,mettent', imparfait: 'mettais,mettais,mettait,mettions,mettiez,mettaient', 'futur-simple': 'mettrai,mettras,mettra,mettrons,mettrez,mettront', subjonctif: 'mette,mettes,mette,mettions,mettiez,mettent' },
  partir: { present: 'pars,pars,part,partons,partez,partent', imparfait: 'partais,partais,partait,partions,partiez,partaient', 'futur-simple': 'partirai,partiras,partira,partirons,partirez,partiront', subjonctif: 'parte,partes,parte,partions,partiez,partent' },
  lire: { present: 'lis,lis,lit,lisons,lisez,lisent', imparfait: 'lisais,lisais,lisait,lisions,lisiez,lisaient', 'futur-simple': 'lirai,liras,lira,lirons,lirez,liront', subjonctif: 'lise,lises,lise,lisions,lisiez,lisent' },
  écrire: { present: 'écris,écris,écrit,écrivons,écrivez,écrivent', imparfait: 'écrivais,écrivais,écrivait,écrivions,écriviez,écrivaient', 'futur-simple': 'écrirai,écriras,écrira,écrirons,écrirez,écriront', subjonctif: 'écrive,écrives,écrive,écrivions,écriviez,écrivent' },
  boire: { present: 'bois,bois,boit,buvons,buvez,boivent', imparfait: 'buvais,buvais,buvait,buvions,buviez,buvaient', 'futur-simple': 'boirai,boiras,boira,boirons,boirez,boiront', subjonctif: 'boive,boives,boive,buvions,buviez,boivent' },
  connaître: { present: 'connais,connais,connaît,connaissons,connaissez,connaissent', imparfait: 'connaissais,connaissais,connaissait,connaissions,connaissiez,connaissaient', 'futur-simple': 'connaîtrai,connaîtras,connaîtra,connaîtrons,connaîtrez,connaîtront', subjonctif: 'connaisse,connaisses,connaisse,connaissions,connaissiez,connaissent' },
  recevoir: { present: 'reçois,reçois,reçoit,recevons,recevez,reçoivent', imparfait: 'recevais,recevais,recevait,recevions,receviez,recevaient', 'futur-simple': 'recevrai,recevras,recevra,recevrons,recevrez,recevront', subjonctif: 'reçoive,reçoives,reçoive,recevions,receviez,reçoivent' },
  parler: { present: 'parle,parles,parle,parlons,parlez,parlent', imparfait: 'parlais,parlais,parlait,parlions,parliez,parlaient', 'futur-simple': 'parlerai,parleras,parlera,parlerons,parlerez,parleront', subjonctif: 'parle,parles,parle,parlions,parliez,parlent' },
  manger: { present: 'mange,manges,mange,mangeons,mangez,mangent', imparfait: 'mangeais,mangeais,mangeait,mangions,mangiez,mangeaient', 'futur-simple': 'mangerai,mangeras,mangera,mangerons,mangerez,mangeront', subjonctif: 'mange,manges,mange,mangions,mangiez,mangent' },
  commencer: { present: 'commence,commences,commence,commençons,commencez,commencent', imparfait: 'commençais,commençais,commençait,commencions,commenciez,commençaient', 'futur-simple': 'commencerai,commenceras,commencera,commencerons,commencerez,commenceront', subjonctif: 'commence,commences,commence,commencions,commenciez,commencent' },
  appeler: { present: 'appelle,appelles,appelle,appelons,appelez,appellent', imparfait: 'appelais,appelais,appelait,appelions,appeliez,appelaient', 'futur-simple': 'appellerai,appelleras,appellera,appellerons,appellerez,appelleront', subjonctif: 'appelle,appelles,appelle,appelions,appeliez,appellent' },
  jeter: { present: 'jette,jettes,jette,jetons,jetez,jettent', 'futur-simple': 'jetterai,jetteras,jettera,jetterons,jetterez,jetteront' },
  acheter: { present: 'achète,achètes,achète,achetons,achetez,achètent', 'futur-simple': 'achèterai,achèteras,achètera,achèterons,achèterez,achèteront', subjonctif: 'achète,achètes,achète,achetions,achetiez,achètent' },
  lever: { present: 'lève,lèves,lève,levons,levez,lèvent' },
  préférer: { present: 'préfère,préfères,préfère,préférons,préférez,préfèrent', 'futur-simple': 'préférerai,préféreras,préférera,préférerons,préférerez,préféreront' },
  nettoyer: { present: 'nettoie,nettoies,nettoie,nettoyons,nettoyez,nettoient', 'futur-simple': 'nettoierai,nettoieras,nettoiera,nettoierons,nettoierez,nettoieront' },
  finir: { present: 'finis,finis,finit,finissons,finissez,finissent', imparfait: 'finissais,finissais,finissait,finissions,finissiez,finissaient', 'futur-simple': 'finirai,finiras,finira,finirons,finirez,finiront', subjonctif: 'finisse,finisses,finisse,finissions,finissiez,finissent' },
  vendre: { present: 'vends,vends,vend,vendons,vendez,vendent', imparfait: 'vendais,vendais,vendait,vendions,vendiez,vendaient', 'futur-simple': 'vendrai,vendras,vendra,vendrons,vendrez,vendront', subjonctif: 'vende,vendes,vende,vendions,vendiez,vendent' },
};

describe('Franse vervoegingen', () => {
  for (const [inf, tijden] of Object.entries(tabel)) {
    for (const [t, verwacht] of Object.entries(tijden)) {
      it(`${inf} – ${t}`, () => expect(forms(inf, t)).toBe(verwacht));
    }
  }

  it('conditionnel = futurstam + imparfait-uitgangen', () => {
    expect(forms('être', 'conditionnel')).toBe('serais,serais,serait,serions,seriez,seraient');
    expect(forms('venir', 'conditionnel')).toBe('viendrais,viendrais,viendrait,viendrions,viendriez,viendraient');
  });

  it('passé composé met avoir en met être (met overeenkomst)', () => {
    expect(fr.conjugate('parler', 'passe-compose')).toEqual(["j'ai parlé", 'tu as parlé', 'il/elle a parlé', 'nous avons parlé', 'vous avez parlé', 'ils/elles ont parlé']);
    expect(fr.conjugate('aller', 'passe-compose')).toEqual(['je suis allé(e)', 'tu es allé(e)', 'il/elle est allé(e)', 'nous sommes allé(e)s', 'vous êtes allé(e)(s)', 'ils/elles sont allé(e)s']);
    expect(fr.bare('naître', 'passe-compose', 0)).toBe('suis né(e)');
    expect(fr.bare('mourir', 'passe-compose', 2)).toBe('est mort');
    expect(fr.bare('descendre', 'plus-que-parfait', 3)).toBe('étions descendu(e)s');
    expect(fr.bare('avoir', 'passe-compose', 0)).toBe('ai eu');
    expect(fr.bare('être', 'passe-compose', 0)).toBe('ai été');
  });

  it('futur proche, passé récent en conditionnel passé', () => {
    expect(fr.conjugate('manger', 'futur-proche')[0]).toBe('je vais manger');
    expect(fr.conjugate('arriver', 'passe-recent')[3]).toBe("nous venons d'arriver");
    expect(fr.conjugate('faire', 'conditionnel-passe')[0]).toBe("j'aurais fait");
    expect(fr.conjugate('partir', 'conditionnel-passe')[4]).toBe('vous seriez parti(e)(s)');
  });

  it('impératif', () => {
    expect(fr.conjugate('parler', 'imperatif')).toEqual(['', 'parle !', '', 'parlons !', 'parlez !', '']);
    expect(forms('aller', 'imperatif')).toBe(',va,,allons,allez,');
    expect(forms('être', 'imperatif')).toBe(',sois,,soyons,soyez,');
    expect(forms('avoir', 'imperatif')).toBe(',aie,,ayons,ayez,');
    expect(forms('savoir', 'imperatif')).toBe(',sache,,sachons,sachez,');
    expect(forms('ouvrir', 'imperatif')).toBe(',ouvre,,ouvrons,ouvrez,');
    expect(forms('finir', 'imperatif')).toBe(',finis,,finissons,finissez,');
    expect(forms('faire', 'imperatif')).toBe(',fais,,faisons,faites,');
  });

  it('j\' vóór een klinker of h', () => {
    expect(fr.conjugate('habiter', 'present')[0]).toBe("j'habite");
    expect(fr.conjugate('aimer', 'futur-simple')[0]).toBe("j'aimerai");
    expect(fr.conjugate('aller', 'subjonctif')[0]).toBe("que j'aille");
    expect(fr.conjugate('aller', 'subjonctif')[2]).toBe("qu'il/elle aille");
  });

  it('payer: beide vormen zijn goed', () => {
    const rules = defaultSettings.nakijkregels;
    expect(checkAnswer('je paye', fr.answer('payer', 'present', 0), rules).result).toBe('goed');
    expect(checkAnswer('je paie', fr.answer('payer', 'present', 0), rules).result).toBe('goed');
    expect(checkAnswer('payerai', fr.answer('payer', 'futur-simple', 0), rules).result).toBe('goed');
  });

  it('antwoorden: met of zonder voornaamwoord, il én elle', () => {
    const rules = { ...defaultSettings.nakijkregels, allowTypos: false };
    const ok = (given: string, inf: string, t: string, p: number) => checkAnswer(given, fr.answer(inf, t, p), rules).result;
    expect(ok('nous sommes allées', 'aller', 'passe-compose', 3)).toBe('goed');
    expect(ok('elle est allée', 'aller', 'passe-compose', 2)).toBe('goed');
    expect(ok('il est allé', 'aller', 'passe-compose', 2)).toBe('goed');
    expect(ok('elles sont venues', 'venir', 'passe-compose', 5)).toBe('goed');
    expect(ok('sommes allés', 'aller', 'passe-compose', 3)).toBe('goed');
    expect(ok('nous avons allé', 'aller', 'passe-compose', 3)).toBe('fout');
    expect(ok("qu'elle vienne", 'venir', 'subjonctif', 2)).toBe('goed');
  });

  it('elk werkwoord heeft in elke tijd alle vormen', () => {
    for (const v of fr.verbs) {
      for (const t of fr.tenses) {
        const persons = t.persons ?? [0, 1, 2, 3, 4, 5];
        const f = fr.conjugate(v.inf, t.id);
        for (const p of persons) {
          if (t.id === 'imperatif' && (v.inf === 'pouvoir' || v.inf === 'devoir')) continue;
          expect(f[p], `${v.inf} ${t.id} ${p}`).toMatch(/\S/);
          expect(f[p], `${v.inf} ${t.id} ${p}`).not.toMatch(/undefined|\s{2}/);
        }
      }
    }
  });

  it('heeft uitleg bij lastige vormen', () => {
    expect(fr.explain('aller', 'passe-compose', 3)).toMatch(/être/);
    expect(fr.explain('commencer', 'present', 3)).toMatch(/ç/);
    expect(fr.explain('venir', 'futur-simple', 0)).toMatch(/viendr/);
  });
});
