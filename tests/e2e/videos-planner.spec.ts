import { expect, test } from '@playwright/test';

test('video toevoegen met aantekening, gekoppeld aan grammatica', async ({ page }) => {
  // YouTube is in de test niet bereikbaar: we controleren alleen onze eigen pagina.
  await page.route(/youtube|ytimg/, (r) => r.fulfill({ status: 200, body: '' }));
  await page.goto('/#/videos');
  await page.getByRole('button', { name: 'Video toevoegen' }).first().click();
  await page.getByLabel('YouTube-link').fill('https://youtu.be/dQw4w9WgXcQ?t=10');
  await page.getByLabel('Titel').fill('Uitleg subjonctif');
  await page.getByLabel('Vak').fill('Frans');
  await page.getByLabel(/Koppelen aan/).selectOption({ label: 'Frans: Subjonctif présent' });
  await page.getByRole('button', { name: 'Toevoegen' }).click();
  await page.getByRole('link', { name: /Uitleg subjonctif/ }).click();
  await expect(page.locator('iframe[src*="youtube-nocookie.com/embed/dQw4w9WgXcQ"]')).toBeAttached();
  await page.getByLabel('Tijd').fill('1:23');
  await page.getByLabel('Aantekening', { exact: true }).fill('Na il faut que komt de subjonctif');
  await page.getByRole('button', { name: 'Toevoegen' }).click();
  await expect(page.getByRole('button', { name: 'Spring naar 1:23' })).toBeVisible();
  await page.getByRole('switch', { name: 'Bekeken' }).click();

  await page.goto('/#/grammatica/fr/subjonctif');
  await expect(page.getByText("Uitlegvideo's")).toBeVisible();
  await expect(page.getByRole('link', { name: /Uitleg subjonctif/ })).toBeVisible();
});

test('toets plannen: leerschema en taak van vandaag', async ({ page }) => {
  await page.goto('/#/lijsten/importeren');
  await page.getByLabel(/Plak hier je woorden/).fill(Array.from({ length: 12 }, (_, i) => `mot${i} = woord${i}`).join('\n'));
  await page.getByLabel('Titel van de nieuwe lijst').fill('Toetslijst');
  await page.getByRole('button', { name: /Lijst opslaan/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Toetslijst');

  await page.goto('/#/planner');
  await page.getByRole('button', { name: 'Toets toevoegen' }).first().click();
  await page.getByLabel('Vak').fill('Frans');
  await page.getByRole('checkbox', { name: /Toetslijst/ }).check();
  await page.getByRole('button', { name: 'Plan de toets' }).click();
  await expect(page.getByText('Toets Frans', { exact: true })).toBeVisible();
  await expect(page.getByText(/Toetslijst: woord 1–/).first()).toBeVisible();

  await page.goto('/#/');
  await expect(page.getByText(/Toets Frans over 7 dagen/)).toBeVisible();
  await page.getByRole('button', { name: 'Start' }).first().click();
  await expect(page.getByText(/0 van 3 gekend/)).toBeVisible();
});
