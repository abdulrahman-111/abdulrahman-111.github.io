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
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test('every route family exposes exactly one main landmark', async ({ page }) => {
  for (const route of routeFamilies) {
    await page.goto(route);
    await expect(page.getByRole('main'), `${route} should expose one main landmark`).toHaveCount(1);
  }
});

test('article reading utilities have accessible names and landmarks', async ({ page }) => {
  await page.goto('/blog/my-simple-guide-to-git-and-github/');
  await expect(page.getByRole('link', { name: 'Back to all articles' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy article link' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Written by Abdulrahman Gomaa Hassan' }),
  ).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Article pagination' })).toBeVisible();
});

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

test('mobile navigation remains usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('/');

  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(navigation).toBeVisible();
  await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();
  await navigation.getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/$/);

  await context.close();
});

test('mobile navigation remains usable when header controller initialization fails', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const addEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if (
        type === 'click' &&
        this instanceof HTMLElement &&
        this.matches('.site-header__menu-toggle')
      ) {
        throw new Error('Simulated header controller initialization failure');
      }
      return addEventListener.call(this, type, listener, options);
    };
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.locator('html')).toHaveClass(/has-js/);
  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(navigation).toBeVisible();
  await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();
  await navigation.getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
});

test('header is sticky, marks the current route, and gains a scrolled state', async ({ page }) => {
  await page.goto('/blog/');
  const header = page.locator('.site-header');
  expect(await header.evaluate((node) => getComputedStyle(node).position)).toBe('sticky');
  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(navigation.getByRole('link', { name: 'Writing', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.evaluate(() => scrollTo(0, 300));
  await expect(header).toHaveClass(/is-scrolled/);
});

test('keyboard focus is visibly styled', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skipLink).toBeFocused();
  const outlineWidth = await skipLink.evaluate((element) => getComputedStyle(element).outlineWidth);
  expect(Number.parseFloat(outlineWidth)).toBeGreaterThan(0);
});

test('blog discovery exposes labeled controls and the selected view', async ({ page }) => {
  await page.goto('/blog/');
  await expect(page.getByRole('searchbox', { name: 'Search articles' })).toBeVisible();
  await expect(page.getByLabel('Sort articles')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cards' })).toHaveAttribute('aria-pressed', 'true');
});
