import { expect, test } from '@playwright/test';

test('project and article route families expose their evidence navigation', async ({ page }) => {
  await page.goto('/projects/end-to-end-devops-pipeline/');
  await expect(page.getByRole('heading', { name: 'My contribution' })).toBeVisible();

  await page.goto('/blog/from-terraform-to-gitops/');
  await expect(page.getByRole('navigation', { name: 'On this page' })).toBeVisible();
});

test('Medium imports show their original source and the blog lists seven posts newest first', async ({
  page,
}) => {
  await page.goto('/blog/my-simple-guide-to-git-and-github/');
  await expect(page.getByRole('link', { name: 'Originally published on Medium' })).toHaveAttribute(
    'href',
    'https://medium.com/@agofficial/my-simple-guide-to-git-github-what-i-learned-while-figuring-things-out-899d02b985fc',
  );

  await page.goto('/blog/');
  const articleHeadings = page.locator('[data-blog-item] .post-card h2');
  await expect(articleHeadings).toHaveCount(7);
  const titles = await articleHeadings.allTextContents();
  expect(titles).toEqual([
    'From Terraform to GitOps: Building an End-to-End Kubernetes Delivery Pipeline',
    'Designing a Real-Time Multi-Model Smart Attendance Pipeline',
    'Building a Unix Shell in Stages: Femto to Micro',
    'My Simple Guide to Git & GitHub: What I Learned While Figuring Things Out',
    'My Journey Learning Bash Scripting: From Zero to Command Creation',
    'From mycat to My Own Shell — a Comprehensive Story',
    'My First Linux Utility: A Step Toward Building My Own Shell',
  ]);
});

test('sequence architecture aligns with its vertical and horizontal connectors', async ({
  page,
}) => {
  await page.setViewportSize({ width: 700, height: 900 });
  await page.goto('/projects/smart-attendance-system/');

  const diagram = page.getByRole('figure', { name: 'Smart attendance cooperating stages' });
  const nodes = diagram.getByRole('listitem');
  await expect(nodes).toHaveCount(5);

  const narrowBoxes = await nodes.evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, right: box.right, bottom: box.bottom };
    }),
  );

  for (const [index, box] of narrowBoxes.entries()) {
    expect(Math.abs(box.x - narrowBoxes[0]!.x)).toBeLessThan(1);
    if (index > 0) expect(box.y).toBeGreaterThan(narrowBoxes[index - 1]!.bottom);
  }

  await page.setViewportSize({ width: 900, height: 900 });

  const wideBoxes = await nodes.evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, right: box.right, bottom: box.bottom };
    }),
  );

  for (const [index, box] of wideBoxes.entries()) {
    expect(Math.abs(box.y - wideBoxes[0]!.y)).toBeLessThan(1);
    if (index > 0) expect(box.x).toBeGreaterThan(wideBoxes[index - 1]!.right);
  }
});
