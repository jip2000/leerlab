import { expect, test } from '@playwright/test';

test('werkwoordtrainer: aller · passé composé · nous', async ({ page }) => {
  await page.goto('/#/werkwoorden');
  await page.getByRole('tab', { name: /Frans/ }).click();
  await page.getByRole('button', { name: 'Geen', exact: true }).click();
  await page.getByLabel('Zoek een werkwoord').fill('aller');
  await page.getByRole('checkbox').first().check();
  await page.getByRole('button', { name: /^passé composé/ }).click();
  await page.getByRole('button', { name: /^présent/ }).click();
  for (const p of ['je', 'tu', 'il/elle', 'vous', 'ils/elles']) await page.getByRole('button', { name: p, exact: true }).click();
  await page.getByLabel('Aantal vragen').selectOption('10');
  await page.getByRole('button', { name: 'Start' }).click();

  // Eerste keer fout: uitleg over être.
  await expect(page.getByText('aller', { exact: true })).toBeVisible();
  await page.getByLabel('Jouw antwoord').fill('nous avons allé');
  await page.getByRole('button', { name: 'Controleren' }).click();
  await expect(page.getByText('Helaas, fout')).toBeVisible();
  await expect(page.getByText(/vervoeg je met être/)).toBeVisible();
  await page.getByRole('button', { name: 'Volgende' }).click();

  // Daarna steeds goed (de foute komt nog één keer terug).
  for (let i = 0; i < 10; i++) {
    await page.getByLabel('Jouw antwoord').fill(i % 2 ? 'nous sommes allées' : 'sommes allés');
    await page.getByRole('button', { name: 'Controleren' }).click();
    await expect(page.getByText('Goed!')).toBeVisible();
    await page.getByRole('button', { name: 'Volgende' }).click();
  }
  await expect(page.getByText('9/10')).toBeVisible();
  await expect(page.getByText('Deze had je fout')).toBeVisible();
});

test('werkwoordtrainer: rijtje Duits', async ({ page }) => {
  await page.goto('/#/werkwoorden');
  await page.getByRole('tab', { name: /Duits/ }).click();
  await page.getByRole('button', { name: 'Geen', exact: true }).click();
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
