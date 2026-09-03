import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routeFamilies = [
  '/',
  '/projects/',
  '/projects/end-to-end-devops-pipeline/',
  '/blog/',
  '/blog/from-terraform-to-gitops/',
  '/blog/tag/kubernetes/',
  '/blog/category/devops/',
  '/about/',
  '/certifications/',
  '/resume/',
  '/404.html',
] as const;

for (const route of routeFamilies) {
  test(`${route} has no automatically detectable WCAG A/AA violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test('mobile navigation is keyboard operable and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await menu.focus();
  await expect(menu).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
});

test('keyboard focus is visibly styled', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skipLink).toBeFocused();
  const outlineWidth = await skipLink.evaluate((element) => getComputedStyle(element).outlineWidth);
  expect(Number.parseFloat(outlineWidth)).toBeGreaterThan(0);
});
