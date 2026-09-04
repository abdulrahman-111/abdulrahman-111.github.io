import { expect, test } from '@playwright/test';

const representativeRoutes = [
  '/',
  '/projects/',
  '/blog/from-terraform-to-gitops/',
  '/blog/my-journey-learning-bash-scripting/',
  '/certifications/',
] as const;
const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
] as const;

test('cards use raised navy surfaces and restrained interaction distance', async ({ page }) => {
  for (const [route, selector] of [
    ['/projects/', '.project-card'],
    ['/blog/', '.post-card'],
    ['/certifications/', '.credential-card:has(a)'],
  ] as const) {
    await page.goto(route);
    const card = page.locator(selector).first();
    const styles = await card.evaluate((node) => {
      const style = getComputedStyle(node);
      return {
        background: style.backgroundColor,
        borderColor: style.borderColor,
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow,
        transitionDuration: style.transitionDuration,
        transitionProperty: style.transitionProperty,
      };
    });
    expect(styles.background).toBe('rgb(17, 34, 64)');
    expect(styles.borderColor).toBe('rgba(0, 0, 0, 0)');
    expect(styles.borderRadius).not.toBe('0px');
    expect(styles.boxShadow).not.toBe('none');
    expect(styles.transitionDuration).not.toBe('0s');
    expect(styles.transitionProperty).toContain('box-shadow');

    await card.hover();
    await expect
      .poll(() => card.evaluate((node) => getComputedStyle(node).transform))
      .toBe('matrix(1, 0, 0, 1, 0, -4)');
    const interaction = await card.evaluate((node) => {
      const style = getComputedStyle(node);
      return { borderColor: style.borderColor, boxShadow: style.boxShadow };
    });
    expect(interaction.borderColor).toBe('rgb(100, 255, 218)');
    expect(interaction.boxShadow).not.toBe(styles.boxShadow);
    expect(
      await card
        .locator('a')
        .last()
        .evaluate((node) => getComputedStyle(node).color),
    ).toBe('rgb(100, 255, 218)');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect.poll(() => card.evaluate((node) => getComputedStyle(node).transform)).toBe('none');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
});

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
  await expect(page.locator('html')).toHaveClass(/has-js/);
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

for (const viewport of viewports) {
  test(`article and certificate images fit at ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);

    for (const [route, selector] of [
      ['/blog/my-journey-learning-bash-scripting/', '.article-prose img'],
      ['/certifications/', '.credential-card img'],
    ] as const) {
      await page.goto(route);
      const images = page.locator(selector);
      const imageCount = await images.count();
      expect(imageCount, `${route} should contain testable media`).toBeGreaterThan(0);

      for (let index = 0; index < imageCount; index += 1) {
        const image = images.nth(index);
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth > 0))
          .toBe(true);
      }

      const measurements = await images.evaluateAll((elements) =>
        elements.map((element) => {
          const image = element as HTMLImageElement;
          const box = image.getBoundingClientRect();
          const parent = image.parentElement!.getBoundingClientRect();
          return {
            box: { left: box.left, right: box.right, width: box.width, height: box.height },
            parent: { left: parent.left, right: parent.right, width: parent.width },
            contentWidth: image.clientWidth,
            contentHeight: image.clientHeight,
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight,
          };
        }),
      );

      for (const {
        box,
        parent,
        contentWidth,
        contentHeight,
        naturalWidth,
        naturalHeight,
      } of measurements) {
        expect(box.left).toBeGreaterThanOrEqual(parent.left - 0.5);
        expect(box.right).toBeLessThanOrEqual(parent.right + 0.5);
        expect(box.width).toBeLessThanOrEqual(parent.width + 0.5);
        expect(Math.abs(contentWidth / contentHeight - naturalWidth / naturalHeight)).toBeLessThan(
          0.02,
        );
      }

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
      ).toBe(true);
    }
  });
}

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
