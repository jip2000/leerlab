import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  '/', '/lijsten', '/lijsten/nieuw', '/lijsten/importeren', '/oefenen', '/grammatica', '/grammatica/fr', '/grammatica/fr/subjonctif',
  '/grammatica/la/declinaties', '/werkwoorden', '/scannen', '/videos', '/planner', '/statistieken', '/instellingen', '/lijsten/start/start-sv-eten',
];

for (const theme of ['light', 'dark'] as const) {
  test.describe(`kwaliteit (${theme})`, () => {
    test.use({ colorScheme: theme });
    for (const path of pages) {
      test(`${path}: geen fouten en toegankelijk`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (e) => errors.push(e.message));
        page.on('console', (m) => m.type() === 'error' && !/youtube|ytimg|Failed to load resource/.test(m.text()) && errors.push(m.text()));
        await page.goto(`/#${path}`);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await page.waitForTimeout(300);
        const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
        const serious = result.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
        expect(serious.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
        expect(errors).toEqual([]);
      });
    }
  });
}
