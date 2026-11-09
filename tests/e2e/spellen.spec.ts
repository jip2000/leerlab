import { expect, test, type Page } from '@playwright/test';

const paren: [string, string][] = [['la maison', 'het huis'], ['le chien', 'de hond'], ['la mer', 'de zee'], ['le pain', 'het brood']];

async function maakLijst(page: Page) {
  await page.goto('/#/lijsten/importeren');
  await page.getByLabel(/Plak hier je woorden/).fill(paren.map(([a, b]) => `${a} = ${b}`).join('\n'));
  await page.getByLabel('Titel van de nieuwe lijst').fill('Spel');
  await page.getByRole('button', { name: /Lijst opslaan/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Spel');
}

async function start(page: Page, modus: RegExp) {
  await page.getByRole('link', { name: 'Oefenen' }).filter({ visible: true }).first().click();
  await page.getByRole('radio', { name: modus }).click();
  await page.getByRole('switch', { name: 'Husselen' }).click();
  await page.getByRole('button', { name: /Start met 4 woorden/ }).click();
}

test('koppelen: alle paren aantikken', async ({ page }) => {
  await maakLijst(page);
  await start(page, /^Koppelen/);
  // Eerst één foute combinatie.
  await page.getByRole('button', { name: 'la maison', exact: true }).click();
  await page.getByRole('button', { name: 'de zee', exact: true }).click();
  for (const [fr, nl] of paren) {
    await page.getByRole('button', { name: fr, exact: true }).click();
    await page.getByRole('button', { name: nl, exact: true }).click();
  }
  await expect(page.getByText(/Tijd: \d+ seconden/)).toBeVisible();
  await expect(page.getByText('50%')).toBeVisible(); // la maison en la mer waren eerst fout
});

test('leren: flashcard → meerkeuze → typen per woord', async ({ page }) => {
  await maakLijst(page);
  await start(page, /^Leren/);
  const vertaal = Object.fromEntries(paren);
  for (let i = 0; i < 12; i++) {
    const vraag = (await page.locator('main [lang="fr"]').first().textContent())!.trim();
    if (await page.getByRole('button', { name: 'Omdraaien' }).isVisible()) {
      await page.getByRole('button', { name: 'Omdraaien' }).click();
      await page.getByRole('button', { name: 'Wist ik', exact: true }).click();
    } else if (await page.getByRole('textbox').isVisible()) {
      await page.getByRole('textbox').fill(vertaal[vraag]!);
      await page.getByRole('textbox').press('Enter');
    } else {
      await page.locator('main ul li button').filter({ hasText: vertaal[vraag]! }).click();
    }
    await page.waitForTimeout(800);
  }
  await expect(page.getByText('100%')).toBeVisible();
});

test('luisteren: typ het Franse woord', async ({ page }) => {
  await maakLijst(page);
  await start(page, /^Luisteren/);
  await expect(page.getByText('Typ wat je hoort.').or(page.getByText(/geen stem beschikbaar/))).toBeVisible();
  for (const [fr] of paren) {
    await page.getByRole('textbox').fill(fr);
    await page.getByRole('textbox').press('Enter');
    await page.waitForTimeout(300);
  }
  await expect(page.getByText('100%')).toBeVisible();
});

test('snel-ronde: na 60 seconden een score', async ({ page }) => {
  await page.clock.install();
  await maakLijst(page);
  await start(page, /^Snel-ronde/);
  await expect(page.getByText('Score: 0')).toBeVisible();
  await page.locator('main ul li button').first().click();
  await page.clock.runFor(61_000);
  await expect(page.getByText(/Score: \d+, beste combo/)).toBeVisible();
});
