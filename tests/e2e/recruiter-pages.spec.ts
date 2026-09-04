import { expect, test } from '@playwright/test';

const pages = [
  ['/', 'I build intelligent systems—and the infrastructure behind them.'],
  ['/about/', 'Engineering across model and infrastructure boundaries.'],
  ['/certifications/', 'Credentials organized by engineering domain.'],
  ['/resume/', 'Choose the résumé aligned with the role.'],
] as const;

for (const [path, heading] of pages) {
  test(`${path} exposes recruiter content and metadata`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://abdulrahman-111.github.io${path}`,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://abdulrahman-111.github.io/social-card.webp',
    );
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
    await expect(page.locator('body')).not.toContainText(/\+20\s*11\d+/);
  });
}

test('homepage uses simple narrative sections and preserves primary message', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'I build intelligent systems—and the infrastructure behind them.',
    }),
  ).toBeVisible();
  await expect(page.getByText('01. About')).toBeVisible();
  await expect(page.getByText('02. Selected Work')).toBeVisible();
  await expect(page.getByText('03. Writing')).toBeVisible();
  await expect(page.getByText('04. Contact')).toBeVisible();
  await expect(page.locator('.hero__console')).toHaveCount(0);
  await expect(page.locator('.status-strip')).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: 'Let’s build something reliable.' }),
  ).toBeVisible();
  await expect(page.locator('[data-reveal]').first()).toHaveClass(/is-revealed/);
});

test('certification page exposes all redacted previews and domain groups', async ({ page }) => {
  await page.goto('/certifications/');
  await expect(page.locator('body')).not.toContainText('Invalid Date');
  await expect(page.locator('img[src^="/certificates/"]')).toHaveCount(16);
  for (const group of [
    'Professional',
    'ML/AI',
    'Cloud and DevOps',
    'Programming and systems',
    'Networking',
    'Language',
  ]) {
    await expect(page.getByRole('heading', { name: group, exact: true })).toBeVisible();
  }
});

test('resume page links to both labeled PDF downloads', async ({ page }) => {
  await page.goto('/resume/');
  await expect(page.getByRole('link', { name: /Download ML\/AI résumé/i })).toHaveAttribute(
    'href',
    '/resume/ml-ai-resume.pdf',
  );
  await expect(
    page.getByRole('link', { name: /Download DevOps and Cloud résumé/i }),
  ).toHaveAttribute('href', '/resume/devops-cloud-resume.pdf');
});

test('RSS, robots, and 404 assets are available', async ({ request }) => {
  const rss = await request.get('/rss.xml');
  expect(rss.ok()).toBeTruthy();
  expect(await rss.text()).toContain('<rss');
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain(
    'Sitemap: https://abdulrahman-111.github.io/sitemap-index.xml',
  );
  const missing = await request.get('/definitely-missing/');
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain('Page not found.');
});
