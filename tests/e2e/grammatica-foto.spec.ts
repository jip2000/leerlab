import { expect, test } from '@playwright/test';
import path from 'node:path';

// Nep-tekstherkenning: een bladzijde uit een Franse grammatica over de passé composé met être.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const tekst = 'Grammaire Le passé composé avec être Je suis allé au cinéma . Tu es venu hier ? Nous sommes arrivés . aller venir arriver partir';
    (window as unknown as { __woordwerkOcr: unknown }).__woordwerkOcr = async (_c: unknown, _l: unknown, onProgress: (p: number, s: string) => void) => {
      onProgress(0.5, 'Tekst herkennen');
      return tekst.split(' ').map((text, i) => ({ text, conf: 90, x0: i * 40, x1: i * 40 + 35, y0: 10, y1: 30 }));
    };
  });
});

test('foto van je boek: herkennen en klaarzetten met moeilijkheid gemiddeld', async ({ page }) => {
  await page.goto('/#/grammatica/fr');
  await page.getByRole('link', { name: /Foto van je boek/ }).click();
  await page.getByLabel("Foto's van je grammaticaboek kiezen").setInputFiles(path.join(process.cwd(), 'public/icons/icon-512.png'));
  await expect(page.getByRole('heading', { name: /Dit staat op je foto/ })).toBeVisible();
  await expect(page.getByText('passé composé', { exact: true })).toBeVisible();
  for (const v of ['aller', 'venir', 'arriver']) await expect(page.getByText(new RegExp(`\\b${v}\\b`)).first()).toBeVisible();
  await expect(page.getByText('Passé simple (herkennen)')).toHaveCount(0);
  await page.getByRole('button', { name: 'Zet klaar om te oefenen' }).click();

  // Terug op de taalpagina: alles staat al aangevinkt.
  await expect(page).toHaveURL(/#\/grammatica\/fr$/);
  await expect(page.getByRole('button', { name: /Werkwoorden vervoegen/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: /^(✓ )?passé composé$/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('radio', { name: /^In een zin/ })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('radio', { name: /Gemiddeld/ })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('heading', { name: /Welke werkwoorden\? \(\d+ van/ })).toBeVisible();
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.getByLabel('Jouw antwoord')).toBeVisible();
});

test('foto zonder herkenbare grammatica: tips en zelf kiezen', async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { __woordwerkOcr: unknown }).__woordwerkOcr = async () => [{ text: 'Bonjour', conf: 90, x0: 0, x1: 50, y0: 0, y1: 20 }];
  });
  await page.goto('/#/grammatica/fr/foto');
  await page.getByLabel("Foto's van je grammaticaboek kiezen").setInputFiles(path.join(process.cwd(), 'public/icons/icon-512.png'));
  await expect(page.getByRole('heading', { name: 'Ik herken nog niets op deze foto' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Zelf kiezen' })).toBeVisible();
});
