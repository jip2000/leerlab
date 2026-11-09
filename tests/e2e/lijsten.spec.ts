import { expect, test, type Page } from '@playwright/test';

async function maakFransLijst(page: Page) {
  await page.goto('/#/lijsten/nieuw');
  await page.getByLabel('Titel', { exact: true }).fill('Unité 3');
  await page.getByLabel('Taal links').selectOption('fr');
  await page.getByLabel('Taal rechts').selectOption('nl');
  await page.getByLabel('Boek', { exact: true }).fill('Testboek Frans');
  await page.getByLabel('Leerjaar').selectOption('4');
  await page.getByLabel('Niveau').selectOption('vwo');
  await page.getByLabel('Hoofdstuk').fill('3');

  // Woord 1 typen, met Enter naar rechts en Enter naar een nieuwe rij.
  const links1 = page.getByLabel('Woord 1, Frans');
  await links1.fill('maison');
  await links1.press('Enter');
  await expect(page.getByLabel('Woord 1, Nederlands')).toBeFocused();
  await page.getByLabel('Woord 1, Nederlands').fill('huis; woning');

  // Speciale tekens-balk: é invoegen.
  await page.getByLabel('Woord 2, Frans').fill('l');
  await page.getByLabel('Woord 2, Frans').press('End');
  await page.getByLabel('Woord 2, Frans').pressSequentially("'");
  await page.getByLabel('Woord 2, Frans').pressSequentially('');
  await page.getByRole('toolbar', { name: 'Speciale tekens Frans' }).getByRole('button', { name: 'é', exact: true }).click();
  await page.getByLabel('Woord 2, Frans').pressSequentially('cole');
  await expect(page.getByLabel('Woord 2, Frans')).toHaveValue("l'école");
  await page.getByLabel('Woord 2, Nederlands').fill('school');

  // Extra velden: lidwoord.
  await page.getByRole('button', { name: /Meer velden/ }).first().click();
  await page.getByLabel('Lidwoord of geslacht (bij links)').fill('la');

  await page.getByRole('button', { name: 'Lijst opslaan' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Unité 3');
}

test('een lijst Frans–Nederlands maken; na herladen is hij er nog', async ({ page }) => {
  await maakFransLijst(page);
  await expect(page.getByText('la maison')).toBeVisible();
  await expect(page.getByText("l'école")).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Unité 3');
  await expect(page.getByText('huis; woning')).toBeVisible();

  // Via Mijn lijsten → boek → hoofdstuk weer terugvinden.
  await page.goto('/#/lijsten');
  await page.getByRole('link', { name: /Testboek Frans/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Testboek Frans');
  await expect(page.getByText('4 vwo')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hoofdstuk 3' })).toBeVisible();
  await page.getByRole('link', { name: /Unité 3/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Unité 3');
});

test('bewerken, omdraaien, verwijderen en ongedaan maken', async ({ page }) => {
  await maakFransLijst(page);
  await page.getByRole('link', { name: 'Bewerken' }).click();
  await page.getByLabel('Titel', { exact: true }).fill('Unité 3 – A');
  await page.getByRole('button', { name: 'Wijzigingen opslaan' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Unité 3 – A');

  await page.getByRole('button', { name: 'Meer acties' }).click();
  await page.getByRole('menuitem', { name: 'Links en rechts omdraaien' }).click();
  await expect(page.getByText('Nederlands – Frans')).toBeVisible();

  await page.getByRole('button', { name: 'Meer acties' }).click();
  await page.getByRole('menuitem', { name: 'Verwijderen' }).click();
  await expect(page.getByText('"Unité 3 – A" verwijderd')).toBeVisible();
  await page.getByRole('button', { name: 'Ongedaan maken' }).click();
  await page.goto('/#/lijsten');
  await expect(page.getByRole('link', { name: /Testboek Frans/ })).toBeVisible();
});

test('woorden plakken met automatische herkenning', async ({ page }) => {
  await page.goto('/#/lijsten/importeren');
  await page.getByLabel(/Plak hier je woorden/).fill('der Hund\tde hond\ndie Katze\tde kat\nKapitel 2');
  await expect(page.getByText('2 woordparen gevonden.')).toBeVisible();
  await expect(page.getByRole('listitem').filter({ hasText: 'Kapitel 2' })).toBeVisible(); // overgeslagen regel
  await page.getByLabel('Titel van de nieuwe lijst').fill('Tiere');
  await page.getByLabel('Taal links').selectOption('de');
  await page.getByRole('button', { name: 'Lijst opslaan met 2 woorden' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tiere');
  await expect(page.getByText('die Katze')).toBeVisible();
});

test('een lijst delen via een link en die bij een klasgenoot openen', async ({ page, context, browser }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await maakFransLijst(page);
  await page.evaluate(() => Object.defineProperty(navigator, 'share', { value: undefined }));
  await page.getByRole('button', { name: 'Meer acties' }).click();
  await page.getByRole('menuitem', { name: 'Delen met een link' }).click();
  const link = await page.getByLabel(/Deellink/).inputValue();
  expect(link).toContain('#/delen?d=');

  // Klasgenoot: een lege browser zonder lijsten.
  const other = await browser.newContext();
  const p2 = await other.newPage();
  await p2.goto(link);
  await expect(p2.getByRole('heading', { level: 1 })).toHaveText('Unité 3');
  await p2.getByRole('button', { name: 'Opslaan in mijn lijsten' }).click();
  await expect(p2.getByText('Opgeslagen in Mijn lijsten').or(p2.getByText('Lijst opgeslagen in Mijn lijsten'))).toBeVisible();
  await expect(p2.getByText('la maison')).toBeVisible();
  await other.close();
});

test('een startlijst Zweeds opslaan', async ({ page }) => {
  await page.goto('/#/lijsten');
  await page.getByRole('tab', { name: 'Zweeds' }).click();
  await page.getByRole('link', { name: /Eten en drinken/ }).click();
  await expect(page.getByText('ett bröd')).toBeVisible();
  await page.getByRole('button', { name: 'Opslaan in mijn lijsten' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Zweeds: Eten en drinken');
});

test('een map maken', async ({ page }) => {
  await page.goto('/#/lijsten');
  await page.getByRole('button', { name: 'Nieuwe map' }).click();
  await page.getByLabel('Naam van de map').fill('Aardrijkskunde');
  await page.getByRole('button', { name: 'Map maken' }).click();
  await page.getByRole('link', { name: /Aardrijkskunde/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Aardrijkskunde');
});
