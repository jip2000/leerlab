import { expect, test } from '@playwright/test';

// Een nieuwe bezoeker: niets bewaard.
test.use({ storageState: { cookies: [], origins: [] } });

test('nieuwe bezoeker ziet de rondleiding één keer', async ({ page }) => {
  await page.goto('/');
  const dialog = page.getByRole('dialog', { name: 'Welkom bij Woordwerk!' });
  await expect(dialog).toBeVisible();
  await page.getByRole('button', { name: 'Laat zien' }).click();
  await expect(page.getByRole('dialog', { name: 'Maak je eigen lijsten' })).toBeVisible();
  await page.getByRole('button', { name: 'Volgende' }).click();
  await expect(page.getByRole('dialog', { name: 'Oefen zoals jij wilt' })).toBeVisible();
  await page.getByRole('button', { name: 'Terug' }).click();
  await expect(page.getByRole('dialog', { name: 'Maak je eigen lijsten' })).toBeVisible();
  await page.getByRole('button', { name: 'Volgende' }).click();
  await page.getByRole('button', { name: 'Volgende' }).click();
  await expect(page.getByRole('dialog', { name: 'Grammatica & werkwoorden' })).toBeVisible();
  await page.getByRole('button', { name: 'Aan de slag!' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);

  // Na herladen niet nog een keer.
  await page.reload();
  await expect(page.getByText(/dag(en)? op rij/).first()).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);

  // Wel opnieuw te bekijken via Instellingen.
  await page.goto('/#/instellingen');
  await page.getByRole('button', { name: 'Rondleiding bekijken' }).click();
  await expect(page.getByRole('dialog', { name: 'Welkom bij Woordwerk!' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('rondleiding overslaan', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Overslaan', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
