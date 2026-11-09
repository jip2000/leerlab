import { expect, test, type Page } from '@playwright/test';

const woorden = ['la maison = het huis', 'le chien = de hond', "l'école = de school", 'la mer = de zee', 'le pain = het brood'];
const vertaling: Record<string, string> = {
  'la maison': 'het huis', 'le chien': 'de hond', "l'école": 'de school', 'la mer': 'de zee', 'le pain': 'het brood',
};

async function maakLijst(page: Page) {
  await page.goto('/#/lijsten/importeren');
  await page.getByLabel(/Plak hier je woorden/).fill(woorden.join('\n'));
  await page.getByLabel('Titel van de nieuwe lijst').fill('Unité 1');
  await page.getByRole('button', { name: /Lijst opslaan/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Unité 1');
}

async function start(page: Page, modus: string, husselen = false) {
  await page.getByRole('link', { name: 'Oefenen' }).filter({ visible: true }).first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oefenen');
  await page.getByRole('radio', { name: new RegExp(`^${modus}`) }).click();
  if (!husselen) await page.getByRole('switch', { name: 'Husselen' }).click();
  await page.getByRole('button', { name: /Start met 5 woorden/ }).click();
}

/** Wacht tot de teller "x/5" (of verder) verandert. */
async function teller(page: Page) {
  return (await page.getByText(/^\d+\/\d+$/).textContent())!;
}

async function vraag(page: Page) {
  const text = await page.locator('main [lang="fr"]').first().textContent();
  return text!.trim();
}

test('flashcards: omdraaien, wist ik / wist ik niet, en de streak start', async ({ page }) => {
  await maakLijst(page);
  await page.goto('/#/lijsten');
  await page.getByRole('link', { name: /Unité 1/ }).click();
  await start(page, 'Flashcards');

  // Eerste kaart: niet geweten → komt later terug.
  await page.getByRole('button', { name: 'Omdraaien' }).click();
  await page.getByRole('button', { name: 'Wist ik niet' }).click();
  for (let i = 0; i < 5; i++) {
    await page.getByRole('button', { name: 'Omdraaien' }).click();
    await page.getByRole('button', { name: 'Wist ik', exact: true }).click();
  }
  await expect(page.getByText('80%')).toBeVisible();
  await expect(page.getByText('Deze had je fout')).toBeVisible();
  await expect(page.getByText(/1 dag op rij/)).toBeVisible();
  await expect(page.getByText('Van start')).toBeVisible(); // badge

  await page.getByRole('link', { name: 'Klaar' }).click();
  await expect(page.getByText(/1\s*dag op rij/).first()).toBeVisible();
});

test('typen: fout antwoord moet je overtypen en komt terug; typfout = bijna goed', async ({ page }) => {
  await maakLijst(page);
  await page.goto('/#/lijsten');
  await page.getByRole('link', { name: /Unité 1/ }).click();
  await start(page, 'Typen');

  const input = page.getByRole('textbox');
  // 1: fout
  await input.fill('iets anders');
  await input.press('Enter');
  await expect(page.getByText('Helaas, fout')).toBeVisible();
  await page.getByLabel('Typ het goede antwoord over').fill('het huis');
  await page.getByLabel('Typ het goede antwoord over').press('Enter');

  // 2: typfout (bijna goed) → telt als goed
  await expect(page.locator('main [lang="fr"]').first()).toHaveText('le chien');
  await input.fill('de hont');
  await input.press('Enter');
  await expect(page.getByText('Bijna goed')).toBeVisible();
  await page.getByRole('button', { name: 'Telt als goed' }).click();
  await expect(page.getByText('1/5')).toBeVisible();

  // De rest goed; "la maison" komt nog een keer terug.
  for (let i = 0; i < 4; i++) {
    const q = await vraag(page);
    const voor = await teller(page);
    await input.fill(vertaling[q]!);
    await input.press('Enter');
    if (i < 3) await expect(page.getByText(/^\d+\/\d+$/)).not.toHaveText(voor);
  }
  await expect(page.getByText('80%')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Oefen alleen je fouten (1)' })).toBeVisible();
});

test('meerkeuze met toetsen 1-4', async ({ page }) => {
  await maakLijst(page);
  await page.goto('/#/lijsten');
  await page.getByRole('link', { name: /Unité 1/ }).click();
  await start(page, 'Meerkeuze');
  for (let i = 0; i < 5; i++) {
    const q = await vraag(page);
    const opties = page.locator('main ul li button');
    await expect(opties).toHaveCount(4);
    const texts = await opties.allTextContents();
    const idx = texts.findIndex((t) => t.includes(vertaling[q]!));
    await page.keyboard.press(String(idx + 1));
    await expect(page.locator('main [lang="fr"]').first()).not.toHaveText(q, { timeout: 3000 }).catch(() => {});
  }
  await expect(page.getByText('100%')).toBeVisible();
});

test('toets: geen hulp, cijfer aan het eind, en alleen je fouten oefenen', async ({ page }) => {
  await maakLijst(page);
  await page.goto('/#/lijsten');
  await page.getByRole('link', { name: /Unité 1/ }).click();
  await start(page, 'Toets');
  const input = page.getByRole('textbox');
  for (let i = 0; i < 5; i++) {
    const q = await vraag(page);
    await input.fill(i < 1 ? 'weet ik niet' : vertaling[q]!);
    await input.press('Enter');
    if (i < 4) {
      await expect(page.getByText(`${i + 1}/5`)).toBeVisible();
      await expect(page.getByText('Helaas, fout')).toHaveCount(0);
    }
  }
  await expect(page.getByText('Je cijfer')).toBeVisible();
  await expect(page.getByText('8,2')).toBeVisible(); // 1 + 9 × 4/5
  await page.getByRole('button', { name: 'Oefen alleen je fouten (1)' }).click();
  await expect(page.getByText('0/1')).toBeVisible();
});

test('pauzeren en later verdergaan', async ({ page }) => {
  await maakLijst(page);
  await page.goto('/#/lijsten');
  await page.getByRole('link', { name: /Unité 1/ }).click();
  await start(page, 'Typen');
  const input = page.getByRole('textbox');
  await input.fill('het huis');
  await input.press('Enter');
  await expect(page.getByText('1/5')).toBeVisible();
  await page.getByRole('button', { name: 'Pauzeren en stoppen' }).click();
  await page.reload();
  await expect(page.getByText('Verder waar je was')).toBeVisible();
  await page.getByRole('button', { name: 'Verder' }).click();
  await expect(page.getByText('1/5')).toBeVisible();
});
