import { expect, test } from '@playwright/test';

test('visitors can browse new projects by area and reach their source', async ({ page }) => {
  await page.goto('/projects/');
  await expect(page.locator('.project-card')).toHaveCount(11);
  await page
    .getByRole('navigation', { name: 'Project areas' })
    .getByRole('link', { name: /Web applications/ })
    .click();
  await expect(page).toHaveURL(/#web-applications$/);
  await page.getByRole('heading', { name: 'DarSak', exact: true }).getByRole('link').click();
  await expect(page.getByRole('link', { name: 'View repository' })).toHaveAttribute(
    'href',
    'https://github.com/abdulrahman-111/DarSak',
  );
  await expect(page.getByRole('link', { name: 'View demo' })).toHaveAttribute(
    'href',
    'https://darsak-platform.vercel.app',
  );
});

test('award and submitted research stay discoverable from the homepage', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /1st Place SolveThe17/ }).click();
  await expect(page).toHaveURL(/\/projects\/cityfix\/$/);
  await expect(page.locator('main')).toContainText('first place');
  await page.goto('/');
  await page.getByRole('link', { name: 'Read research details' }).click();
  await expect(page.locator('#research article')).toHaveCount(2);
  await expect(page.locator('#research .status-label')).toHaveText([
    'Submitted · Journal manuscript · 2026',
    'Submitted · Journal manuscript · 2026',
  ]);
});

test('new projects communicate prototype and public-source limits', async ({ page }) => {
  await page.goto('/projects/taxiflow/');
  await expect(page.locator('main')).toContainText(
    'implementation is not available there for inspection',
  );
  await page.goto('/projects/customer-complaint-analyzer/');
  await expect(page.locator('main')).toContainText('drafts requiring human review');
  await page.goto('/projects/cityfix/');
  await expect(page.locator('main')).toContainText('has not been validated as a physical build');
});

test('hackathon article and ongoing miniOS have accurate status and navigation', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('heading', { name: 'From CityFix to First Place: Our SolveThe17 2.0 Journey' })
    .getByRole('link')
    .click();
  await expect(page.locator('main')).toContainText('first place at SolveThe17 2.0');
  await page.getByRole('link', { name: 'Explore the CityFix / CityCycle case study' }).click();
  await expect(page).toHaveURL(/\/projects\/cityfix\/$/);
  await page.goto('/projects/rv32i-minios/');
  await expect(page.locator('.project-hero__meta')).toContainText('Ongoing');
  await expect(page.locator('main')).toContainText('completed CPU implementations');
  await expect(page.locator('main')).toContainText('in preparation for implementing a miniOS');
  await expect(page.getByRole('link', { name: 'View repository' })).toHaveCount(0);
});

test('CV experience and internships are present with the complete download', async ({ page }) => {
  await page.goto('/about/');
  const experience = page.locator('section[aria-labelledby="experience-title"]');
  for (const role of [
    'DevOps Engineer',
    'Research Assistant / Summer Research Intern',
    'Natural Language Processing Trainee',
    'DevOps Intern / Trainee',
    'Cloud Architect Intern / Trainee',
    'Network Essentials Intern / Trainee',
    'Junior Teaching Assistant',
  ]) {
    await expect(experience).toContainText(role);
  }
  await expect(page.locator('main')).toContainText('Vice Head');
  await expect(page.getByRole('link', { name: 'ORCID: 0009-0000-0790-9506' })).toBeVisible();
  await page.goto('/resume/');
  await expect(page.getByRole('link', { name: 'Download Complete CV' })).toHaveAttribute(
    'href',
    '/resume/master-cv.pdf',
  );
});
