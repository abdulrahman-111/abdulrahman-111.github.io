import { expect, test } from '@playwright/test';

test('project and article route families expose their evidence navigation', async ({ page }) => {
  await page.goto('/projects/end-to-end-devops-pipeline/');
  await expect(page.getByRole('heading', { name: 'My contribution' })).toBeVisible();

  await page.goto('/blog/from-terraform-to-gitops/');
  await expect(page.getByRole('navigation', { name: 'On this page' })).toBeVisible();
});
