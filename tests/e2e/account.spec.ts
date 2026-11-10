import { expect, test, type Page } from '@playwright/test';

const USER = { id: '11111111-2222-4333-8444-555555555555', email: 'leerling@example.com', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() };

/** Nep-Supabase: vangt alle verzoeken naar het testadres af. */
async function fakeSupabase(page: Page, opts: { plan?: string; cloud?: unknown } = {}) {
  const saved: unknown[] = [];
  await page.route('https://test.supabase.invalid/**', async (route) => {
    const url = route.request().url();
    const method = route.request().method();
    if (url.includes('/auth/v1/token')) {
      const body = route.request().postDataJSON() as { password?: string };
      if (body.password === 'fout-wachtwoord') return route.fulfill({ status: 400, json: { error: 'invalid_grant', error_description: 'Invalid login credentials', msg: 'Invalid login credentials' } });
      return route.fulfill({ json: { access_token: 'tok', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: 'ref', user: USER } });
    }
    if (url.includes('/auth/v1/signup')) return route.fulfill({ json: { ...USER, identities: [{ id: 'x' }], confirmation_sent_at: new Date().toISOString() } });
    if (url.includes('/auth/v1/logout')) return route.fulfill({ status: 204, body: '' });
    if (url.includes('/rest/v1/profiles')) return route.fulfill({ json: [{ plan: opts.plan ?? 'gratis', plus_tot: null }] });
    if (url.includes('/rest/v1/backups') && method === 'GET') return route.fulfill({ json: opts.cloud ? [{ data: opts.cloud, updated_at: new Date().toISOString() }] : [] });
    if (url.includes('/rest/v1/backups')) {
      saved.push(route.request().postDataJSON());
      return route.fulfill({ status: 201, json: [] });
    }
    return route.fulfill({ status: 404, json: {} });
  });
  return saved;
}

test('inloggen, synchroniseren en uitloggen', async ({ page }) => {
  const saved = await fakeSupabase(page);
  await page.goto('/#/lijsten/importeren');
  await page.getByLabel(/Plak hier je woorden/).fill('la mer = de zee');
  await page.getByLabel('Titel van de nieuwe lijst').fill('Synclijst');
  await page.getByRole('button', { name: /Lijst opslaan/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Synclijst');

  await page.goto('/#/account');
  await page.getByLabel('E-mailadres').fill(USER.email);
  await page.getByLabel('Wachtwoord', { exact: true }).fill('fout-wachtwoord');
  await page.getByRole('button', { name: 'Inloggen', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('E-mailadres of wachtwoord klopt niet.');

  await page.getByLabel('Wachtwoord', { exact: true }).fill('goed-wachtwoord');
  await page.getByRole('button', { name: 'Inloggen', exact: true }).click();
  await expect(page.getByText(USER.email)).toBeVisible();
  // De lijst van dit apparaat is naar de (nep)wolk gestuurd.
  await expect.poll(() => saved.length).toBeGreaterThan(0);
  expect(JSON.stringify(saved[0])).toContain('Synclijst');

  await page.getByRole('button', { name: 'Uitloggen' }).click();
  await expect(page.getByRole('tab', { name: 'Account maken' })).toBeVisible();
});

test('account maken vraagt om bevestiging per mail', async ({ page }) => {
  await fakeSupabase(page);
  await page.goto('/#/account');
  await page.getByRole('tab', { name: 'Account maken' }).click();
  await page.getByLabel('E-mailadres').fill('nieuw@example.com');
  await page.getByLabel(/Wachtwoord/).fill('geheim123');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Account maken' }).click();
  await expect(page.getByRole('alert')).toHaveText(/Klik op de link in de mail/);
});

test('op een nieuw apparaat: lijsten uit het account ophalen', async ({ page }) => {
  const cloud = { app: 'woordwerk', version: 1, exportedAt: '', files: [], local: {}, tables: { lists: [{ id: 'l1', title: 'Uit de wolk', langLeft: 'fr', langRight: 'nl', tags: [], createdAt: 1, updatedAt: 1, photoIds: [] }], words: [{ id: 'w1', listId: 'l1', left: 'oui', right: 'ja', position: 0 }] } };
  await fakeSupabase(page, { cloud });
  await page.goto('/#/account');
  await page.getByLabel('E-mailadres').fill(USER.email);
  await page.getByLabel('Wachtwoord', { exact: true }).fill('goed');
  await page.getByRole('button', { name: 'Inloggen', exact: true }).click();
  await expect(page.getByText(/opgehaald uit je account/)).toBeVisible();
  await page.goto('/#/lijsten');
  await expect(page.getByRole('link', { name: /Uit de wolk/ })).toBeVisible();
});
