import { expect, test } from '@playwright/test';

const representativeRoutes = [
  '/',
  '/projects/',
  '/blog/from-terraform-to-gitops/',
  '/certifications/',
] as const;
const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
] as const;

for (const viewport of viewports) {
  test(`representative pages do not overflow at ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    for (const route of representativeRoutes) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(overflow, `${route} should not overflow`).toBe(false);
    }
  });
}

test('article code and tables remain contained with reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/blog/from-terraform-to-gitops/');
  await expect(page.locator('pre').first()).toBeVisible();
  await expect(page.locator('table').first()).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
  expect(
    await page.locator('html').evaluate((element) => getComputedStyle(element).scrollBehavior),
  ).toBe('auto');
});

test('all internal links found on the primary route families resolve', async ({
  page,
  request,
}) => {
  const links = new Set<string>();
  for (const route of representativeRoutes) {
    await page.goto(route);
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.getAttribute('href')).filter(Boolean),
      )) {
      if (typeof href === 'string') links.add(href);
    }
  }
  for (const href of links) {
    const response = await request.get(href);
    expect(response.status(), `${href} should resolve`).toBeLessThan(400);
  }
});
