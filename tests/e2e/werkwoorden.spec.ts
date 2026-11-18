import { expect, test } from '@playwright/test';

/** Knop van een tijd-kaartje (met ✓ als hij aan staat). */
const tijd = (t: string) => new RegExp(`^(✓ )?${t}$`);

test('werkwoordtrainer: aller · passé composé · nous', async ({ page }) => {
  await page.goto('/#/grammatica/fr');
  // Eerst kiezen wát je oefent, dan de tijd; daarna verschijnt de rest.
  await expect(page.getByText(/Klik hierboven aan wat je wilt oefenen/)).toBeVisible();
  await page.getByRole('button', { name: /Werkwoorden vervoegen/ }).click();
  await page.getByRole('button', { name: tijd('passé composé') }).click();
  await page.getByRole('button', { name: 'Alle werkwoorden uitvinken' }).click();
  await page.getByLabel('Zoek een werkwoord').fill('aller');
  await page.getByRole('checkbox').first().check();
  await page.getByRole('button', { name: 'Alle personen uitvinken' }).click();
  await page.getByRole('button', { name: 'nous', exact: true }).click();
  await page.getByLabel('Aantal vragen').selectOption('10');
  await expect(page.getByText('Met deze keuze zijn er 1 verschillende vragen.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Start' }).click();

  // Eerste keer fout: uitleg over être.
  await expect(page.getByText('aller', { exact: true })).toBeVisible();
  await page.getByLabel('Jouw antwoord').fill('nous avons allé');
  await page.getByRole('button', { name: 'Controleren' }).click();
  await expect(page.getByText('Helaas, fout')).toBeVisible();
  await expect(page.getByText(/vervoeg je met être/)).toBeVisible();
  await page.getByRole('button', { name: 'Volgende' }).click();

  // Er is maar één vraag mogelijk: die komt niet 10 keer, alleen nog één keer omdat hij fout was.
  await page.getByLabel('Jouw antwoord').fill('sommes allés');
  await page.getByRole('button', { name: 'Controleren' }).click();
  await expect(page.getByText('Goed!')).toBeVisible();
  await page.getByRole('button', { name: 'Volgende' }).click();
  await expect(page.getByRole('heading', { name: /Goed gedaan!/ })).toBeVisible();
  await expect(page.getByText('0/1')).toBeVisible();
  await expect(page.getByText('Deze had je fout')).toBeVisible();
  await page.getByRole('link', { name: 'Naar het hoofdmenu' }).click();
  await expect(page.getByText(/dag(en)? op rij/).first()).toBeVisible();
});

test('werkwoordtrainer: rijtje Duits', async ({ page }) => {
  await page.goto('/#/grammatica/de');
  await page.getByRole('button', { name: /Werkwoorden vervoegen/ }).click();
  await page.getByRole('button', { name: tijd('Präsens') }).click();
  await page.getByRole('button', { name: 'Alle werkwoorden uitvinken' }).click();
  await page.getByLabel('Zoek een werkwoord').fill('fahren');
  await page.getByRole('checkbox').first().check();
  await page.getByRole('radio', { name: /^Hele rijtje/ }).click();
  await page.getByLabel('Aantal vragen').selectOption('10');
  await page.getByRole('button', { name: 'Start' }).click();
  const forms = ['ich fahre', 'du fährst', 'er fährt', 'wir fahren', 'ihr fahrt', 'sie fahren'];
  const labels = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'];
  for (let i = 0; i < 6; i++) await page.getByLabel(labels[i]!, { exact: true }).fill(forms[i]!.replace('du fährst', 'du fahrst'));
  await page.getByRole('button', { name: 'Nakijken' }).click();
  await expect(page.getByText('✗ fährst')).toBeVisible();
  // Enter = volgende, ook als het fout was (zonder muis).
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: /Goed gedaan!/ })).toBeVisible();
});

test('werkwoordtrainer: alles in één keer aanvinken', async ({ page }) => {
  await page.goto('/#/grammatica/fr');
  await page.getByRole('button', { name: /Werkwoorden vervoegen/ }).click();
  await page.getByRole('button', { name: 'Alle tijden aanvinken' }).click();
  for (const t of ['présent', 'subjonctif présent', 'impératif']) await expect(page.getByRole('button', { name: tijd(t) })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Alle werkwoorden uitvinken' }).click();
  await expect(page.getByRole('heading', { name: /Welke werkwoorden\? \(0 van/ })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveText(/Kies minstens/);
  await page.getByRole('button', { name: 'Alle werkwoorden aanvinken' }).click();
  await expect(page.getByRole('heading', { name: /Welke werkwoorden\? \(alle\)/ })).toBeVisible();
  for (const cb of await page.getByRole('checkbox').all()) await expect(cb).toBeChecked();
  // Zoeken + aanvinken: alleen wat je ziet.
  await page.getByRole('button', { name: 'Alle werkwoorden uitvinken' }).click();
  await page.getByLabel('Zoek een werkwoord').fill('venir');
  await page.getByRole('button', { name: 'Alle gevonden werkwoorden aanvinken' }).click();
  await expect(page.getByRole('heading', { name: /Welke werkwoorden\? \(3 van/ })).toBeVisible(); // venir, devenir, revenir
});

test('werkwoorden en grammatica zijn één plek', async ({ page }) => {
  // Oude link stuurt door naar de taalpagina van de laatst gebruikte taal.
  await page.goto('/#/werkwoorden');
  await expect(page).toHaveURL(/#\/grammatica\/fr/);
  await expect(page.getByRole('heading', { name: /Wat wil je oefenen\?/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Uitleg lezen' })).toBeVisible();
  await page.getByRole('button', { name: /Werkwoorden vervoegen/ }).click();
  await expect(page.getByRole('heading', { name: /In welke tijden\?/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'uitleg' }).first()).toBeVisible();
  // Twee tijden door elkaar, oefenen, en terug op dezelfde pagina.
  await page.getByRole('button', { name: tijd('présent') }).click();
  await page.getByRole('button', { name: tijd('imparfait') }).click();
  await expect(page.getByText(/présent \+ imparfait/)).toBeVisible();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Stoppen' }).click();
  await expect(page).toHaveURL(/#\/grammatica\/fr/);
});

test('in een zin: nooit dezelfde vraag, en moeilijke zinnen', async ({ page }) => {
  await page.goto('/#/grammatica/de');
  await page.getByRole('button', { name: /Werkwoorden vervoegen/ }).click();
  await page.getByRole('button', { name: 'Alle tijden aanvinken' }).click();
  // Werkwoorden en personen staan standaard allemaal aan.
  await expect(page.getByRole('heading', { name: /Welke werkwoorden\? \(alle\)/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Wie\? \(alle\)/ })).toBeVisible();
  await page.getByRole('radio', { name: /^In een zin/ }).click();
  await page.getByRole('radio', { name: /Moeilijk/ }).click();
  await page.getByLabel('Aantal vragen').selectOption('10');
  await page.getByRole('button', { name: 'Start' }).click();
  const seen = new Set<string>();
  for (let i = 0; i < 10; i++) {
    const zin = (await page.locator('main p.text-xl').first().innerText()).trim();
    expect(zin.length).toBeGreaterThan(60); // lange zin
    expect(seen.has(zin)).toBe(false);
    seen.add(zin);
    await page.getByLabel('Jouw antwoord').fill('xxx');
    await page.getByRole('button', { name: 'Controleren' }).click();
    await page.getByRole('button', { name: 'Volgende' }).click();
    if (i === 9) break;
    // Foute vragen komen pas aan het eind terug; die tellen we hier niet.
  }
});

test('extra taal: Pools via Nieuwe taal proberen, werkwoorden oefenen', async ({ page }) => {
  await page.goto('/#/nieuwe-taal');
  await page.getByRole('button', { name: 'Pools' }).click();
  await page.getByRole('link', { name: /Naar Pools/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Pools');
  await page.getByRole('button', { name: /Werkwoorden vervoegen/ }).click();
  await page.getByRole('button', { name: tijd('czas teraźniejszy') }).click();
  await page.getByRole('button', { name: 'Alle werkwoorden uitvinken' }).click();
  await page.getByLabel('Zoek een werkwoord').fill('być');
  await page.getByRole('checkbox').first().check();
  await page.getByRole('button', { name: 'Alle personen uitvinken' }).click();
  await page.getByRole('button', { name: 'my', exact: true }).click();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByLabel('Jouw antwoord').fill('jesteśmy');
  await page.getByRole('button', { name: 'Controleren' }).click();
  await expect(page.getByText('Goed!')).toBeVisible();
});

test('talenkiezer: schooltalen bovenaan, extra talen eronder', async ({ page }) => {
  await page.goto('/#/grammatica');
  const school = page.getByRole('region', { name: /Talen op school/ });
  for (const t of ['Engels', 'Frans', 'Duits', 'Spaans', 'Latijn', 'Oudgrieks']) await expect(school.getByRole('link', { name: new RegExp(t) })).toBeVisible();
  const extra = page.getByRole('region', { name: /Extra talen/ });
  await expect(extra.getByRole('link', { name: /Zweeds/ })).toBeVisible();
  await expect(extra.getByRole('link', { name: /Frans/ })).toHaveCount(0);
});

test('wisselvoorzetsels oefenen in het Perfekt, met Enter door', async ({ page }) => {
  await page.goto('/#/grammatica/de');
  await page.getByRole('button', { name: /Voorzetsels en wisselvoorzetsels/ }).click();
  const delen = page.getByRole('group', { name: 'Onderdelen' });
  for (const n of [/Akkusativ/, /\+ Dativ/, /Samentrekkingen/]) await delen.getByRole('button', { name: n }).click();
  await expect(page.getByText(/Geldt voor: Voorzetsels en wisselvoorzetsels/)).toBeVisible();
  await page.getByRole('button', { name: tijd('Perfekt') }).click();
  // Zelf het aantal vragen invullen.
  await page.getByLabel('Aantal vragen').selectOption('eigen');
  await page.getByLabel('Eigen aantal vragen').fill('4');
  await expect(page.getByText(/^4 vragen/)).toBeVisible();
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page).toHaveURL(/#\/grammatica\/de\/oefenen/);
  await expect(page.getByText('0/4')).toBeVisible();
  await expect(page.getByText(/Perfekt/).first()).toBeVisible(); // hint met de tijd
  for (let i = 0; i < 4; i++) {
    await page.getByLabel('Jouw antwoord').fill('xxx');
    await page.keyboard.press('Enter'); // nakijken
    await expect(page.getByText(/Helaas, fout|Goed!/)).toBeVisible();
    await page.keyboard.press('Enter'); // volgende
  }
  await expect(page.getByRole('heading', { name: /Goed gedaan!/ })).toBeVisible();
  await expect(page.getByText('Deze had je fout')).toBeVisible();
});
