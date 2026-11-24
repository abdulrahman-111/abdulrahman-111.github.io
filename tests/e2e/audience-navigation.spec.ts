import { expect, test } from '@playwright/test';

test('project search combines with areas and survives reload, back, and reset', async ({
  page,
}) => {
  await page.goto('/projects/');
  const search = page.getByRole('searchbox', { name: 'Find a project' });
  await search.fill('Docker');
  await expect(page.locator('[data-project-item]:visible')).toHaveCount(2);
  await expect(page).toHaveURL(/q=Docker/);
  await page
    .getByRole('navigation', { name: 'Project areas' })
    .getByRole('link', { name: /Cloud and DevOps/ })
    .click();
  await expect(page).toHaveURL(/#cloud-and-devops$/);
  await page.reload();
  await expect(search).toHaveValue('Docker');
  await expect(page.locator('[data-project-item]:visible')).toHaveCount(2);
  await page
    .getByRole('navigation', { name: 'Project areas' })
    .getByRole('link', { name: /Web applications/ })
    .click();
  await expect(page.locator('[data-project-count]')).toHaveText('0 projects in Web applications');
  await expect(
    page.getByRole('heading', { name: 'No projects match these filters.' }),
  ).toBeVisible();
  await page.goBack();
  await expect(page.locator('[data-project-item]:visible')).toHaveCount(2);
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(page.locator('[data-project-item]:visible')).toHaveCount(11);
  await expect(search).toBeFocused();
  await expect(page).toHaveURL(/\/projects\/$/);
});

test('project areas and all case studies remain available without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/projects/');
  await expect(page.locator('[data-project-item]:visible')).toHaveCount(11);
  await expect(page.getByRole('searchbox')).toHaveCount(0);
  await page
    .getByRole('navigation', { name: 'Project areas' })
    .getByRole('link', { name: /Systems programming/ })
    .click();
  await page
    .getByRole('heading', { name: 'RV32I CPU and miniOS', exact: true })
    .getByRole('link')
    .click();
  await expect(page.locator('.project-hero__meta')).toContainText('Ongoing');
  await context.close();
});

test('research is reachable from primary navigation and retains submitted status', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Research', exact: true })
    .click();
  await expect(page).toHaveURL(/\/research\/$/);
  await expect(page.locator('#research article')).toHaveCount(2);
  await expect(page.locator('#research .status-label')).toHaveText([
    'Submitted · Journal manuscript · 2026',
    'Submitted · Journal manuscript · 2026',
  ]);
  await expect(
    page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Research', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
});

test('case-study contents and breadcrumbs keep readers oriented', async ({ page }) => {
  await page.goto('/projects/darsak/');
  await page
    .getByRole('navigation', { name: 'On this page' })
    .getByRole('link', { name: 'Engineering decisions' })
    .click();
  const heading = page.getByRole('heading', { name: 'Engineering decisions' });
  await expect(heading).toBeInViewport();
  const headingBox = await heading.boundingBox();
  const headerBox = await page.locator('.site-header').boundingBox();
  expect(headingBox!.y).toBeGreaterThanOrEqual(headerBox!.height);
  await page
    .getByRole('navigation', { name: 'Breadcrumb' })
    .getByRole('link', { name: 'Web applications' })
    .click();
  await expect(page).toHaveURL(/\/projects\/#web-applications$/);
  await expect(page.locator('[data-project-item]:visible')).toHaveCount(2);
});

test('mobile navigation closes on outside interaction and focus leaving the menu', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  await menu.click();
  await page.locator('.hero__current').click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page.locator('.hero__actions a').first().focus();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});
