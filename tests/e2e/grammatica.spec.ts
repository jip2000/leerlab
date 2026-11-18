import { expect, test } from '@playwright/test';

test('grammatica: uitleg lezen en een ronde oefenen', async ({ page }) => {
  await page.goto('/#/grammatica');
  await page.getByRole('link', { name: /Frans/ }).click();
  await page.getByRole('link', { name: /Lidwoorden/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lidwoorden (ook partitif)');
  await expect(page.getByRole('cell', { name: 'de la', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Ga oefenen' }).click();

  for (let i = 0; i < 8; i++) {
    await expect(page.getByText(`${i}/8`)).toBeVisible();
    const answer = page.getByLabel('Jouw antwoord');
    if (await answer.isVisible()) {
      await answer.fill('du');
      await page.getByRole('button', { name: 'Controleren' }).click();
    } else if (await page.getByRole('button', { name: 'Laatste weg' }).isVisible()) {
      for (const b of await page.locator('main .flex-wrap button').all()) await b.click();
      await page.getByRole('button', { name: 'Controleren' }).click();
    } else {
      await page.locator('main ul li button').first().click();
      await page.getByRole('button', { name: 'Controleren' }).click();
    }
    await expect(page.getByText(/Goed!|Helaas, fout/)).toBeVisible();
    await page.getByRole('button', { name: 'Volgende' }).click();
  }
  await expect(page.getByRole('button', { name: 'Nieuwe ronde' })).toBeVisible();
  await page.getByRole('main').getByRole('link', { name: 'Frans', exact: true }).click();
  await expect(page.getByText(/\d+%/).first()).toBeVisible();
});

test('naamvallen kiezen: Duits zonder Genitiv', async ({ page }) => {
  await page.goto('/#/grammatica/de');
  await expect(page.getByRole('button', { name: /Naamvallen: alle 4/ })).toBeVisible();
  await page.getByRole('button', { name: /Aanpassen/ }).click();
  const chooser = page.getByRole('group', { name: 'Naamvallen' });
  for (const n of ['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv']) await expect(chooser.getByRole('button', { name: new RegExp(n) })).toHaveAttribute('aria-pressed', 'true');
  await chooser.getByRole('button', { name: /Genitiv/ }).click();
  await expect(chooser.getByRole('button', { name: /Genitiv/ })).toHaveAttribute('aria-pressed', 'false');

  await page.getByRole('link', { name: /^Naamvallen/ }).click();
  await expect(page.getByRole('rowheader', { name: 'Dativ', exact: true }).first()).toBeVisible();
  await expect(page.getByRole('rowheader', { name: 'Genitiv', exact: true })).toHaveCount(0);
  // Keuze is ook hier te zien en blijft bewaard.
  await expect(page.getByRole('button', { name: /Naamvallen: Nominativ, Akkusativ, Dativ/ })).toBeVisible();
  await page.getByRole('button', { name: /Aanpassen/ }).click();
  await expect(page.getByRole('group', { name: 'Naamvallen' }).getByRole('button', { name: /Genitiv/ })).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await expect(page.getByRole('rowheader', { name: 'Genitiv', exact: true })).toHaveCount(0);

  // Minstens één naamval blijft aan.
  await page.getByRole('button', { name: /Aanpassen/ }).click();
  const g = page.getByRole('group', { name: 'Naamvallen' });
  for (const n of ['Nominativ', 'Akkusativ', 'Dativ']) await g.getByRole('button', { name: new RegExp(n) }).click();
  await expect(g.getByRole('button', { name: /Dativ/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('rowheader', { name: 'Dativ', exact: true }).first()).toBeVisible();
});

test('leerpad: begin hier, daarna ga verder', async ({ page }) => {
  await page.goto('/#/grammatica/fr');
  await expect(page.getByRole('tab', { name: /Grammatica/ })).toHaveAttribute('aria-selected', 'true');
  const begin = page.getByRole('link', { name: /Begin hier/ });
  await expect(begin).toBeVisible();
  await expect(page.getByText(/0 van \d+ onderwerpen gehaald/)).toBeVisible();
  await begin.click();
  await expect(page.getByRole('tab', { name: /Uitleg lezen/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('button', { name: 'Ga oefenen' })).toBeVisible();
});
