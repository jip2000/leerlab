import { expect, test } from '@playwright/test';
import path from 'node:path';

// Nep-tekstherkenning: geeft woorden in twee kolommen terug, zoals een woordenlijst in een boek.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const row = (y: number, items: [string, number, number?][]) =>
      items.map(([text, x, conf = 92]) => ({ text, conf, x0: x, x1: x + text.length * 9, y0: y, y1: y + 18 }));
    (window as unknown as { __woordwerkOcr: unknown }).__woordwerkOcr = async (_c: unknown, _l: unknown, onProgress: (p: number, s: string) => void) => {
      onProgress(0.5, 'Tekst herkennen');
      return [
        ...row(10, [['Unité', 10], ['4', 70]]),
        ...row(40, [['la', 10], ['plage', 40], ['het', 300], ['strand', 340]]),
        ...row(70, [['le', 10], ['soleil', 40, 40], ['de', 300], ['zon', 330]]),
        ...row(100, [['la', 10], ['glace', 40], ['het', 300], ['ijsje', 340]]),
        ...row(130, [['57', 200]]),
      ];
    };
  });
});

test('foto uploaden, bijsnijden, controleren en meteen oefenen', async ({ page }) => {
  await page.goto('/#/scannen');
  await page.getByLabel('Afbeeldingen kiezen').setInputFiles(path.join(process.cwd(), 'public/icons/icon-512.png'));
  await expect(page.getByAltText('Je foto')).toBeVisible();
  await page.getByRole('button', { name: 'Rechtsom draaien' }).click();
  await page.getByRole('button', { name: 'Tekst herkennen' }).click();

  await expect(page.getByText('Controleer de woorden')).toBeVisible();
  await expect(page.getByLabel('Rij 1 links')).toHaveValue('la plage');
  await expect(page.getByLabel('Rij 1 rechts')).toHaveValue('het strand');
  await expect(page.getByLabel('Rij 3 rechts')).toHaveValue('het ijsje');
  await expect(page.getByText('1 regels niet als woordpaar herkend')).toBeVisible(); // "Unité 4"

  // Verbeteren en verwijderen
  await page.getByLabel('Rij 2 links').fill('le soleil');
  await page.getByRole('button', { name: 'Rij 3 verwijderen' }).click();

  await page.getByLabel('Titel van de nieuwe lijst').fill('Unité 4 – vakantie');
  await page.getByRole('button', { name: 'Opslaan en meteen oefenen' }).click();
  await expect(page.getByText('Flashcards')).toBeVisible();
  await expect(page.getByText('0/2')).toBeVisible();

  // De foto is bewaard bij de lijst.
  await page.goto('/#/lijsten');
  await page.getByRole('link', { name: /Unité 4 – vakantie/ }).click();
  await expect(page.getByAltText('Foto 1')).toBeVisible();
});
