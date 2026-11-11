import { expect, test } from '@playwright/test';
import fs from 'node:fs';

test('hulp-tutor beantwoordt een vraag en brengt je naar de goede pagina', async ({ page }) => {
  await page.goto('/#/');
  await page.getByRole('button', { name: 'Hulp: vraag het de tutor' }).click();
  await expect(page.getByRole('dialog', { name: 'Hulp-tutor' })).toBeVisible();
  await page.getByLabel('Je vraag').fill('Hoe kan ik een foto van mijn boek scannen?');
  await page.getByRole('button', { name: 'Versturen' }).click();
  await expect(page.getByText(/Snijd het stuk met de woorden bij/)).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Foto scannen' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Foto scannen');
});

test('back-up exporteren en weer importeren', async ({ page }) => {
  await page.goto('/#/lijsten/importeren');
  await page.getByLabel(/Plak hier je woorden/).fill('le soleil = de zon');
  await page.getByLabel('Titel van de nieuwe lijst').fill('Backuplijst');
  await page.getByRole('button', { name: /Lijst opslaan/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Backuplijst');

  await page.goto('/#/instellingen');
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Exporteer alles' }).click()]);
  const file = await download.path();
  const json = JSON.parse(fs.readFileSync(file!, 'utf8'));
  expect(json.app).toBe('woordwerk');
  expect(json.tables.lists.some((l: { title: string }) => l.title === 'Backuplijst')).toBe(true);

  // Lijst verwijderen en de back-up terugzetten.
  await page.evaluate(() => indexedDB.deleteDatabase('woordwerk'));
  await page.reload();
  page.on('dialog', (d) => void d.accept());
  await page.goto('/#/instellingen');
  await page.locator('input[type=file][accept*="json"]').setInputFiles(file!);
  await expect(page.getByText(/Back-up teruggezet/)).toBeVisible();
  await page.goto('/#/lijsten');
  await expect(page.getByRole('link', { name: /Backuplijst/ })).toBeVisible();
});

test('werkt offline na de eerste keer laden', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload(); // nu met service worker
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText(/dagen op rij|dag op rij/).first()).toBeVisible();
  await page.goto('/#/statistieken');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Statistieken'); // los geladen pagina komt ook uit de cache
  await context.setOffline(false);
});

test('na een update: ontbrekend stukje → nette melding en verversen', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByText(/dag(en)? op rij/).first()).toBeVisible();
  // Doe alsof de pagina "Werkwoorden" van een oude versie niet meer bestaat.
  await page.route(/assets\/VerbsPage-.*\.js$/, (r) => r.fulfill({ status: 404, body: '' }));
  await page.evaluate(() => sessionStorage.setItem('woordwerk-herladen', '1')); // geen automatisch herladen in de test
  await page.goto('/#/werkwoorden');
  await expect(page.getByRole('heading', { name: 'Er is een nieuwe versie van Woordwerk' })).toBeVisible();
  await page.unroute(/assets\/VerbsPage-.*\.js$/);
  await page.getByRole('button', { name: 'Opnieuw laden' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Grammatica');
  await expect(page.getByRole('heading', { name: /^Werkwoorden \(\d+\)$/ })).toBeVisible();
});
