import { expect, test } from '@playwright/test';

test('grammatica: uitleg lezen en een ronde oefenen', async ({ page }) => {
  await page.goto('/#/grammatica');
  await page.getByRole('link', { name: /Frans/ }).click();
  await page.getByRole('link', { name: /Lidwoorden/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lidwoorden (ook partitif)');
  await expect(page.getByRole('cell', { name: 'de la', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Oefenen', exact: true }).click();

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
  await page.getByRole('link', { name: /Grammatica Frans/ }).click();
  await expect(page.getByText(/\d+%/).first()).toBeVisible();
});
