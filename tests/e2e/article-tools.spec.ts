import { expect, test } from '@playwright/test';

test('article exposes navigation, source, author, copy, and edit utilities', async ({ page }) => {
  await page.goto('/blog/my-simple-guide-to-git-and-github/');
  await expect(page.getByRole('link', { name: 'Back to all articles' })).toHaveAttribute(
    'href',
    '/blog/',
  );
  await expect(page.getByRole('link', { name: 'Originally published on Medium' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy article link' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Written by Abdulrahman Gomaa Hassan' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Edit this article on GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/abdulrahman-111/abdulrahman-111.github.io/edit/main/src/content/blog/my-simple-guide-to-git-and-github.mdx',
  );
  await expect(page.getByRole('navigation', { name: 'Article pagination' })).toBeVisible();
});

test('table-of-contents links leave their target below the sticky header', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/blog/from-terraform-to-gitops/');

  const tocLink = page.getByRole('navigation', { name: 'On this page' }).getByRole('link').nth(5);
  const targetSelector = await tocLink.getAttribute('href');
  expect(targetSelector).toMatch(/^#[a-z0-9-]+$/);
  await tocLink.click();

  await expect(page).toHaveURL(new RegExp(`${targetSelector}$`));
  await expect
    .poll(async () => {
      const [headerBox, targetBox, spacing] = await Promise.all([
        page.locator('.site-header').boundingBox(),
        page.locator(targetSelector!).boundingBox(),
        page.evaluate(() =>
          Number.parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--space-3'),
          ),
        ),
      ]);
      if (!headerBox || !targetBox) return false;
      return targetBox.y >= headerBox.y + headerBox.height + spacing - 1;
    })
    .toBe(true);
});

test('copy-link control reports clipboard success and writes the canonical article URL', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          document.documentElement.dataset.copiedValue = value;
        },
      },
    });
  });

  await page.goto('/blog/');
  const button = page.getByRole('button', { name: 'Copy article link' }).first();
  await expect(button).toBeVisible();
  await expect(button.locator('xpath=..')).toHaveAttribute(
    'data-value',
    'https://abdulrahman-111.github.io/blog/from-terraform-to-gitops/',
  );
  await button.click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-copied-value',
    'https://abdulrahman-111.github.io/blog/from-terraform-to-gitops/',
  );
  await expect(button).toContainText('Copied');
  await expect(page.locator('[data-copy-status]').first()).toHaveText('Article link copied.');
  await page.waitForTimeout(2100);
  await expect(button).toHaveText('Copy link');
  await expect(page.locator('[data-copy-status]').first()).toHaveText('');
});

for (const fallbackFailure of ['returns false', 'throws'] as const) {
  test(`copy-link reports failure when the fallback ${fallbackFailure}`, async ({ page }) => {
    await page.addInitScript((failure) => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: async () => Promise.reject(new Error('clipboard denied')) },
      });
      document.execCommand = () => {
        if (failure === 'throws') throw new Error('fallback denied');
        return false;
      };
    }, fallbackFailure);

    await page.goto('/blog/');
    const button = page.getByRole('button', { name: 'Copy article link' }).first();
    await button.click();

    await expect(page.locator('[data-copy-status]').first()).toHaveText(
      'Unable to copy article link.',
    );
    await expect(button).toHaveText('Copy link');
  });
}
