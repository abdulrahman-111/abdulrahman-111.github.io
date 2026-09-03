import { expect, test } from '@playwright/test';

const destinations = {
  Email: 'mailto:abdulrahman.gomaa.h05@gmail.com',
  GitHub: 'https://github.com/abdulrahman-111',
  LinkedIn: 'https://www.linkedin.com/in/abdulrahman-gomaa',
  Kaggle: 'https://www.kaggle.com/abdulrahmanh05',
  Medium: 'https://medium.com/@agofficial',
} as const;

for (const [route, expectedGroups] of [
  ['/', 2],
  ['/about/', 3],
] as const) {
  test(`${route} exposes every approved destination in each social link group`, async ({
    page,
  }) => {
    await page.goto(route);
    const groups = page.locator('.social-links');
    await expect(groups).toHaveCount(expectedGroups);

    for (const group of await groups.all()) {
      for (const [label, href] of Object.entries(destinations)) {
        await expect(group.getByRole('link', { name: label, exact: true })).toHaveAttribute(
          'href',
          href,
        );
      }
    }
  });
}

test('Person structured data lists public profiles and keeps email separate', async ({ page }) => {
  await page.goto('/');
  const person = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts
        .map((script) => JSON.parse(script.textContent ?? '{}'))
        .find((entry) => entry['@type'] === 'Person'),
    );

  expect(person.email).toBe('mailto:abdulrahman.gomaa.h05@gmail.com');
  expect(person.sameAs).toEqual([
    destinations.GitHub,
    destinations.LinkedIn,
    destinations.Kaggle,
    destinations.Medium,
  ]);
});
