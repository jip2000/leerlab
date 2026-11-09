import { expect, test } from '@playwright/test';

const pages = [
  { label: 'Mijn lijsten', heading: 'Mijn lijsten', more: false },
  { label: 'Oefenen', heading: 'Oefenen', more: false },
  { label: 'Werkwoorden', heading: 'Werkwoorden', more: false },
  { label: 'Grammatica', heading: 'Grammatica', more: true },
  { label: 'Foto scannen', heading: 'Foto scannen', more: true },
  { label: "Video's", heading: "Video's", more: true },
  { label: 'Planner', heading: 'Planner', more: true },
  { label: 'Statistieken', heading: 'Statistieken', more: true },
  { label: 'Instellingen', heading: 'Instellingen', more: true },
];

test('de site start op Home', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Goede(morgen|middag|navond|nacht)/);
  await expect(page.getByText(/dagen op rij/).first()).toBeVisible();
});

test('je kunt naar alle pagina’s en terug naar Home', async ({ page, isMobile }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Hoofdmenu' }).filter({ visible: true });
  for (const p of pages) {
    if (isMobile && p.more) {
      await nav.getByRole('button', { name: 'Meer' }).click();
      await page.getByRole('dialog', { name: "Meer pagina's" }).getByRole('link', { name: p.label }).click();
    } else {
      await nav.getByRole('link', { name: isMobile && p.label === 'Mijn lijsten' ? 'Lijsten' : p.label }).click();
    }
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(p.heading);
  }
  await nav.getByRole('link', { name: 'Home' }).click();
  await expect(page.getByText(/dagen op rij/).first()).toBeVisible();
});

test('donkere modus blijft bewaard na herladen', async ({ page }) => {
  await page.goto('/#/instellingen');
  await page.getByRole('radio', { name: 'Donker' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('radio', { name: 'Licht' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('zoeken vindt een grammatica-onderwerp', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Zoeken', exact: true }).click();
  const box = page.getByRole('combobox', { name: 'Zoeken' }).filter({ visible: true });
  await box.fill('passe compose');
  await page.getByRole('option', { name: /Passé composé/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Passé composé (avoir/être, accord)');
});

test('geen horizontale scroll en knoppen groot genoeg', async ({ page, isMobile }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  if (isMobile) {
    const tabs = page.getByRole('navigation', { name: 'Hoofdmenu' }).filter({ visible: true }).locator('a, button');
    for (const box of await tabs.evaluateAll((els) => els.map((e) => e.getBoundingClientRect()))) {
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
  }
});

test('statistieken: grafiek, kalender en badges', async ({ page }) => {
  await page.goto('/#/statistieken');
  await expect(page.getByRole('heading', { name: 'Oefentijd in minuten' })).toBeVisible();
  await expect(page.getByRole('img', { name: /Kalender: \d+ dagen geoefend/ })).toBeVisible();
  await page.getByRole('radio', { name: /Per week/ }).click();
  await page.getByText('Als tabel').click();
  await expect(page.getByRole('cell', { name: /wk / }).first()).toBeVisible();
  await expect(page.getByText(/Badges/).first()).toBeVisible();
});
