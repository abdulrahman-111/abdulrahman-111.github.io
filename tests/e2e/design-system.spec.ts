import { expect, test } from '@playwright/test';

test('uses approved navy and mint tokens without grid background', async ({ page }) => {
  await page.goto('/');
  const theme = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const body = getComputedStyle(document.body);
    return {
      canvas: root.getPropertyValue('--color-canvas').trim(),
      surface: root.getPropertyValue('--color-surface').trim(),
      text: root.getPropertyValue('--color-text').trim(),
      muted: root.getPropertyValue('--color-text-muted').trim(),
      accent: root.getPropertyValue('--color-accent').trim(),
      backgroundImage: body.backgroundImage,
    };
  });
  expect(theme).toEqual({
    canvas: '#0a192f',
    surface: '#112240',
    text: '#ccd6f6',
    muted: '#8892b0',
    accent: '#64ffda',
    backgroundImage: 'none',
  });
});

test('reveals content immediately when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/has-js/);
  const transform = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.dataset.reveal = '';
    document.body.append(probe);
    return getComputedStyle(probe).transform;
  });
  expect(transform).toBe('none');
});

test('desktop rails expose public profiles and email without covering mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Desktop social links' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Email Abdulrahman' })).toBeVisible();

  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page.getByRole('navigation', { name: 'Desktop social links' })).toBeHidden();
  await expect(page.getByRole('link', { name: 'Email Abdulrahman' })).toBeHidden();
});

test('desktop social rail stays outside the content shell at its display threshold', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto('/');

  const socialRail = page.getByRole('navigation', { name: 'Desktop social links' });
  const contentShell = page.locator('.page-shell').first();
  await expect(socialRail).toBeVisible();
  const [rail, shell] = await Promise.all([socialRail.boundingBox(), contentShell.boundingBox()]);

  expect(rail).not.toBeNull();
  expect(shell).not.toBeNull();
  expect(rail!.x + rail!.width).toBeLessThanOrEqual(shell!.x);
});
