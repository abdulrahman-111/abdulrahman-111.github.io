import { expect, test } from '@playwright/test';

test('searches, sorts, switches view, and restores URL state', async ({ page }) => {
  await page.goto('/blog/');
  const search = page.getByRole('searchbox', { name: 'Search articles' });
  await search.fill('systems shell');
  await expect(page.locator('[data-blog-item]:visible')).toHaveCount(3);
  await expect(page.getByText('3 articles')).toBeVisible();

  await page.getByLabel('Sort articles').selectOption('oldest');
  const visibleTitles = page.locator('[data-blog-item]:visible .post-card h2');
  await expect(visibleTitles.first()).toContainText('My First Linux Utility');

  await page.getByRole('button', { name: 'Compact list' }).click();
  await expect(page.locator('blog-discovery')).toHaveAttribute('data-view', 'list');
  await expect(page).toHaveURL(/q=systems\+shell/);
  await expect(page).toHaveURL(/sort=oldest/);
  await expect(page).toHaveURL(/view=list/);

  await page.reload();
  await expect(search).toHaveValue('systems shell');
  await expect(page.locator('blog-discovery')).toHaveAttribute('data-view', 'list');
});

test('shows every article when JavaScript is disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/blog/');
  await expect(page.locator('.post-card h2')).toHaveCount(7);
  await expect(page.getByRole('link', { name: 'Kubernetes' }).first()).toBeVisible();
  await context.close();
});
