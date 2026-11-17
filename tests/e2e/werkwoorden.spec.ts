import { expect, test } from '@playwright/test';

test('werkwoordtrainer: aller · passé composé · nous', async ({ page }) => {
  await page.goto('/#/grammatica/fr?deel=werkwoorden');
  await page.getByRole('button', { name: 'Alle werkwoorden uitvinken' }).click();
  await page.getByLabel('Zoek een werkwoord').fill('aller');
  await page.getByRole('checkbox').first().check();
  await page.getByRole('button', { name: /^passé composé/ }).click();
  await page.getByRole('button', { name: /^présent/ }).click();
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
  await page.goto('/#/grammatica/de?deel=werkwoorden');
  await page.getByRole('button', { name: 'Alle werkwoorden uitvinken' }).click();
  await page.getByLabel('Zoek een werkwoord').fill('fahren');
  await page.getByRole('checkbox').first().check();
  await page.getByRole('radio', { name: /^Rijtje/ }).click();
  await page.getByLabel('Aantal vragen').selectOption('10');
  await page.getByRole('button', { name: 'Start' }).click();
  const forms = ['ich fahre', 'du fährst', 'er fährt', 'wir fahren', 'ihr fahrt', 'sie fahren'];
  const labels = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'];
  for (let i = 0; i < 6; i++) await page.getByLabel(labels[i]!, { exact: true }).fill(forms[i]!.replace('du fährst', 'du fahrst'));
  await page.getByRole('button', { name: 'Nakijken' }).click();
  await expect(page.getByText('✗ fährst')).toBeVisible();
});

test('werkwoordtrainer: alles in één keer aanvinken', async ({ page }) => {
  await page.goto('/#/grammatica/fr?deel=werkwoorden');
  await page.getByRole('button', { name: 'Alle werkwoorden uitvinken' }).click();
  await expect(page.getByRole('heading', { name: 'Werkwoorden (0)' })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveText(/Kies minstens/);
  await page.getByRole('button', { name: 'Alle werkwoorden aanvinken' }).click();
  await expect(page.getByRole('heading', { name: /Werkwoorden \((\d{2,})\)/ })).toBeVisible();
  for (const cb of await page.getByRole('checkbox').all()) await expect(cb).toBeChecked();
  await page.getByRole('button', { name: 'Alle tijden aanvinken' }).click();
  for (const t of ['présent', 'subjonctif présent', 'impératif']) await expect(page.getByRole('button', { name: new RegExp(`^${t}`) })).toHaveAttribute('aria-pressed', 'true');
  // Zoeken + aanvinken: alleen wat je ziet.
  await page.getByRole('button', { name: 'Alle werkwoorden uitvinken' }).click();
  await page.getByLabel('Zoek een werkwoord').fill('venir');
  await page.getByRole('button', { name: 'Alle gevonden werkwoorden aanvinken' }).click();
  await expect(page.getByRole('heading', { name: 'Werkwoorden (3)' })).toBeVisible(); // venir, devenir, revenir
});

test('werkwoorden en grammatica zijn één plek', async ({ page }) => {
  // Oude link stuurt door naar het tabblad van de laatst gebruikte taal.
  await page.goto('/#/werkwoorden');
  await expect(page).toHaveURL(/#\/grammatica\/fr\?deel=werkwoorden/);
  await expect(page.getByRole('tab', { name: 'Werkwoorden trainen' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: /Werkwoorden \(\d+\)/ })).toBeVisible();
  // Wisselen naar de uitleg op dezelfde pagina.
  await page.getByRole('tab', { name: 'Uitleg & oefeningen' }).click();
  await expect(page.getByRole('link', { name: /Passé composé/i }).first()).toBeVisible();
  // Na een oefening terug naar het tabblad werkwoorden.
  await page.getByRole('tab', { name: 'Werkwoorden trainen' }).click();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Stoppen' }).click();
  await expect(page).toHaveURL(/#\/grammatica\/fr\?deel=werkwoorden/);
});

test('in een zin: nooit dezelfde vraag, en moeilijke zinnen', async ({ page }) => {
  await page.goto('/#/grammatica/de?deel=werkwoorden');
  await page.getByRole('button', { name: /^Alle werkwoorden \(/ }).click();
  await expect(page.getByRole('button', { name: /^Alle werkwoorden \(/ })).toHaveAttribute('aria-pressed', 'true');
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
