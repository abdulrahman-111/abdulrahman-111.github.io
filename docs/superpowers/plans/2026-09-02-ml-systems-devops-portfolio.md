# ML Systems + DevOps Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a production-ready, recruiter-first Astro 6 portfolio and engineering blog for Abdulrahman Hassan.

**Architecture:** Astro prerenders every route from local, schema-validated Markdown/MDX and JSON content. Focused TypeScript helpers own ordering, draft filtering, reading time, related-post ranking, and SEO composition; framework-free Astro components and project-owned CSS render the Systems Console interface.

**Tech Stack:** Astro 6, TypeScript strictest, MDX, Astro Sitemap, Astro RSS, CSS, Vitest, Playwright, axe-core, ESLint, Prettier, GitHub Actions, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-09-02-ml-systems-devops-portfolio-design.md`

## Global Constraints

- English-only, dark-only launch using the approved Systems Console direction.
- Static output only; no frontend framework, backend, database, analytics, cookies, or form service.
- JavaScript is limited to the accessible mobile navigation toggle.
- Use Astro 6's `src/content.config.ts` build-time collection model with `glob()` loaders and Zod schemas.
- Production canonical origin is exactly `https://abdulrahman-111.github.io`.
- Local development supports Node 22.23 or newer; CI and deployment use Node 24.
- Do not copy exam reports, transcripts, IEEE cards, or PLEDGE identity documents into the site.
- Redact birth dates and private student, candidate, registration, membership, phone, and identity data from credential previews.
- Do not invent dates, contributions, screenshots, results, or verification links.

## File Map

- `src/content.config.ts`: collection loaders and public content schemas.
- `src/data/site.ts`: typed identity, navigation, education, experience, skills, and resume data.
- `src/data/certifications.json`: sanitized credential metadata.
- `src/lib/content.ts`: production filtering, slug normalization, and stable ordering.
- `src/lib/reading-time.ts`: deterministic word-count reading time.
- `src/lib/related-posts.ts`: category/tag ranking and chronological neighbors.
- `src/lib/seo.ts`: canonical, social, and structured-data helpers.
- `src/layouts/BaseLayout.astro`: global shell, metadata, header, footer, and mobile navigation behavior.
- `src/layouts/ArticleLayout.astro`: article metadata, table of contents, related posts, and neighbors.
- `src/components/`: focused navigation, card, tag, section, TOC, architecture diagram, and CTA components.
- `src/content/projects/`: five verified project case studies.
- `src/content/blog/`: three publishable engineering articles.
- `src/pages/`: static pages, collection routes, tag/category routes, RSS, and 404.
- `src/styles/`: tokens, reset, global composition, content typography, and responsive rules.
- `public/certificates/`: redacted WebP credential previews.
- `public/resume/`: PDFs compiled directly from the two existing LaTeX sources.
- `tests/unit/`: Vitest behavior tests.
- `tests/e2e/`: Playwright accessibility, route, navigation, and asset tests.
- `.github/workflows/`: pull-request CI and Pages deployment.

---

### Task 1: Static Astro Foundation and Design Tokens

**Files:**
- Create: `package.json`, `package-lock.json`, `astro.config.ts`, `tsconfig.json`, `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `.gitignore`
- Create: `src/env.d.ts`, `src/data/site.ts`, `src/styles/tokens.css`, `src/styles/global.css`
- Create: `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`
- Create: `tests/unit/site-config.test.ts`, `vitest.config.ts`

**Interfaces:**
- Produces: `siteConfig: SiteConfig`, global CSS tokens, and `BaseLayout` props `{ title, description, image?, type?, structuredData? }`.
- Consumes: approved copy and canonical origin from the spec.

- [ ] **Step 1: Write the failing site configuration test**

```ts
import { describe, expect, it } from 'vitest';
import { siteConfig } from '../../src/data/site';

describe('siteConfig', () => {
  it('publishes the approved identity without a phone number', () => {
    expect(siteConfig.tagline).toBe('I build intelligent systems—and the infrastructure behind them.');
    expect(siteConfig.url).toBe('https://abdulrahman-111.github.io');
    expect(JSON.stringify(siteConfig)).not.toMatch(/phone/i);
  });
});
```

- [ ] **Step 2: Install the Astro 6 toolchain and verify the test fails**

Run: `npm install && npm run test:unit -- tests/unit/site-config.test.ts`

Expected: Vitest fails because `src/data/site.ts` does not exist.

- [ ] **Step 3: Add the strict static scaffold and minimum approved configuration**

Create the exact scripts `dev`, `build`, `preview`, `check`, `lint`, `format`, `format:check`, `test:unit`, `test:e2e`, and `test`. Configure `output: 'static'`, the production `site`, MDX, sitemap, Shiki syntax highlighting, and strictest TypeScript.

- [ ] **Step 4: Implement the base shell and first coherent homepage slice**

Render a skip link, semantic header/main/footer, accessible mobile navigation button with `aria-expanded`, hero copy, primary project CTA, resume CTA, and a compact systems-status proof strip. Use the navy grid, cyan, amber, sans, and mono token set from the spec.

- [ ] **Step 5: Run the foundation checks**

Run: `npm run test:unit -- tests/unit/site-config.test.ts && npm run check && npm run build`

Expected: all commands exit 0 and `dist/index.html` exists.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.ts tsconfig.json eslint.config.js .prettierrc.json .prettierignore .gitignore src tests/unit/site-config.test.ts vitest.config.ts
git commit -m "feat: scaffold systems console portfolio"
```

### Task 2: Content Schemas and Tested Content Utilities

**Files:**
- Create: `src/content.config.ts`
- Create: `src/lib/content.ts`, `src/lib/reading-time.ts`, `src/lib/related-posts.ts`, `src/lib/seo.ts`
- Create: `tests/unit/content.test.ts`, `tests/unit/reading-time.test.ts`, `tests/unit/related-posts.test.ts`, `tests/unit/seo.test.ts`

**Interfaces:**
- Produces: `getPublishedEntries<T>()`, `slugify(value: string)`, `sortByPublishedDesc<T>()`, `getReadingTime(markdown: string)`, `getRelatedPosts(current, candidates, limit = 3)`, `getPostNeighbors(current, ordered)`, and `buildCanonical(pathname: string)`.
- Consumes: `siteConfig.url` from Task 1.

- [ ] **Step 1: Write failing helper tests**

```ts
it('excludes drafts in production and sorts newest first', () => {
  const result = getPublishedEntries(entries, true);
  expect(result.map((entry) => entry.id)).toEqual(['new', 'old']);
});

it('ranks category matches at two points and shared tags at one point', () => {
  expect(getRelatedPosts(current, candidates).map((post) => post.id)).toEqual([
    'same-category-and-tag',
    'same-category',
    'shared-tag',
  ]);
});
```

- [ ] **Step 2: Run the utility tests and confirm missing-module failures**

Run: `npm run test:unit -- tests/unit/content.test.ts tests/unit/reading-time.test.ts tests/unit/related-posts.test.ts tests/unit/seo.test.ts`

Expected: FAIL because the four helper modules are absent.

- [ ] **Step 3: Implement minimal pure helpers and typed collection schemas**

Use `glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' })` and the equivalent projects loader. Use `z.coerce.date()` for dates, enums for blog and certification categories, `z.string().url()` for public URLs, positive integer ranks, and non-empty contribution arrays for collaborative work.

- [ ] **Step 4: Run unit tests and schema checks**

Run: `npm run test:unit && npm run check`

Expected: all tests and Astro schema/type validation pass.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/lib tests/unit
git commit -m "feat: add validated content architecture"
```

### Task 3: Verified Project and Article Content

**Files:**
- Create: `src/content/projects/end-to-end-devops-pipeline.mdx`, `src/content/projects/smart-attendance-system.mdx`, `src/content/projects/fifa-career-mode-ai-assistant.mdx`, `src/content/projects/warsha-hub.mdx`, `src/content/projects/road-to-my-own-shell.mdx`
- Create: `src/content/blog/from-terraform-to-gitops.mdx`, `src/content/blog/designing-a-real-time-multi-model-smart-attendance-pipeline.mdx`, `src/content/blog/building-a-unix-shell-in-stages.mdx`
- Create: `tests/unit/content-files.test.ts`

**Interfaces:**
- Produces: five ranked `projects` entries and three non-draft `blog` entries accepted by `src/content.config.ts`.
- Consumes: verified repository evidence and contribution boundaries in the spec.

- [ ] **Step 1: Write a failing content inventory test**

```ts
it('contains the approved project order and three publishable articles', async () => {
  const projects = await getCollection('projects');
  const posts = await getCollection('blog');
  expect(projects.sort((a, b) => a.data.rank - b.data.rank).map((entry) => entry.data.title)).toEqual(approvedTitles);
  expect(posts.filter((entry) => !entry.data.draft)).toHaveLength(3);
});
```

- [ ] **Step 2: Run the inventory test and confirm it fails**

Run: `npm run test:unit -- tests/unit/content-files.test.ts`

Expected: FAIL because the collections contain no entries.

- [ ] **Step 3: Write all five evidence-based project case studies**

Each case study includes context, architecture, constraints, implementation, verified project outcomes, and an explicit “My contribution” section. Label collaborative entries accurately and prefix repository-sourced metrics with “Project-reported.”

- [ ] **Step 4: Write the three complete engineering articles**

Each post includes concrete architecture or code examples, operational trade-offs, descriptive headings for TOC generation, and a conclusion. Do not add unsupported personal claims.

- [ ] **Step 5: Validate content and run tests**

Run: `npm run test:unit -- tests/unit/content-files.test.ts && npm run check && npm run build`

Expected: collection inventory, schemas, rendered MDX, and production build all pass.

- [ ] **Step 6: Commit**

```bash
git add src/content tests/unit/content-files.test.ts
git commit -m "content: add verified projects and engineering articles"
```

### Task 4: Projects, Blog, Filtering, and Article Navigation

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/components/ArchitectureDiagram.astro`, `src/components/TagList.astro`, `src/components/PostCard.astro`, `src/components/TableOfContents.astro`, `src/components/SectionHeader.astro`, `src/components/ContactCta.astro`
- Create: `src/layouts/ArticleLayout.astro`
- Create: `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`
- Create: `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`, `src/pages/blog/tag/[tag].astro`, `src/pages/blog/category/[category].astro`
- Create: `tests/e2e/content-routes.spec.ts`

**Interfaces:**
- Produces: prerendered project, article, tag, and category route families.
- Consumes: Task 2 helpers and Task 3 content entries.

- [ ] **Step 1: Write failing route assertions**

```ts
test('project and article route families expose their evidence navigation', async ({ page }) => {
  await page.goto('/projects/end-to-end-devops-pipeline/');
  await expect(page.getByRole('heading', { name: 'My contribution' })).toBeVisible();
  await page.goto('/blog/from-terraform-to-gitops/');
  await expect(page.getByRole('navigation', { name: 'On this page' })).toBeVisible();
});
```

- [ ] **Step 2: Run the production build and route test to confirm missing routes**

Run: `npm run build && npm run test:e2e -- tests/e2e/content-routes.spec.ts`

Expected: FAIL because project and blog routes are absent.

- [ ] **Step 3: Implement project routes and verified architecture diagrams**

Sort cards by rank, show collaborative contribution labels, and use code-native HTML/CSS diagrams when media is absent. Every diagram node and connector must map to the case-study text.

- [ ] **Step 4: Implement article routes and static filters**

Generate paths from content entry IDs. Build TOC links from Astro-rendered headings, show reading time, score three related posts, and expose previous/next by publication order. Tag and category pages remain useful with JavaScript disabled.

- [ ] **Step 5: Run route tests, accessibility smoke checks, and build**

Run: `npm run test:e2e -- tests/e2e/content-routes.spec.ts && npm run check && npm run build`

Expected: all commands exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/components src/layouts/ArticleLayout.astro src/pages/projects src/pages/blog tests/e2e/content-routes.spec.ts
git commit -m "feat: add project and blog experiences"
```

### Task 5: Recruiter Pages, SEO, RSS, and Static Assets

**Files:**
- Modify: `src/pages/index.astro`, `src/layouts/BaseLayout.astro`
- Create: `src/components/CertificateCard.astro`, `src/pages/about.astro`, `src/pages/certifications.astro`, `src/pages/resume.astro`, `src/pages/404.astro`, `src/pages/rss.xml.ts`, `src/pages/robots.txt.ts`
- Create: `public/favicon.svg`, `public/social-card.webp`
- Create: `tests/e2e/site-pages.spec.ts`, `tests/e2e/seo.spec.ts`

**Interfaces:**
- Produces: all non-content route pages, RSS, robots, Person/Article JSON-LD, canonical and social metadata.
- Consumes: Task 1 site data, Task 2 SEO helper, Tasks 3–4 content routes.

- [ ] **Step 1: Write failing recruiter-page and metadata tests**

```ts
test('home page communicates the approved positioning and canonical URL', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('intelligent systems');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://abdulrahman-111.github.io/');
});
```

- [ ] **Step 2: Run tests and confirm missing page/metadata failures**

Run: `npm run test:e2e -- tests/e2e/site-pages.spec.ts tests/e2e/seo.spec.ts`

Expected: FAIL on missing routes and metadata.

- [ ] **Step 3: Complete the homepage and profile pages**

Add the credibility strip, three featured projects, technical areas, latest posts, credential preview, About preview, contact CTA, education, experience, skills, interests, IEEE leadership, certification groups, and clearly labeled resume downloads.

- [ ] **Step 4: Implement site-wide discovery metadata**

Add canonical, Open Graph, Twitter, favicon, Person and Article JSON-LD, RSS, sitemap integration, robots, and a designed 404 page. Generate a purpose-built Systems Console social card without fabricated project imagery.

- [ ] **Step 5: Run page, metadata, check, and build suites**

Run: `npm run test:e2e -- tests/e2e/site-pages.spec.ts tests/e2e/seo.spec.ts && npm run check && npm run build`

Expected: every route and metadata assertion passes.

- [ ] **Step 6: Commit**

```bash
git add src public/favicon.svg public/social-card.webp tests/e2e/site-pages.spec.ts tests/e2e/seo.spec.ts
git commit -m "feat: complete recruiter pages and discovery metadata"
```

### Task 6: Resume PDFs and Redacted Certificate Previews

**Files:**
- Create: `public/resume/devops-cloud-resume.pdf`, `public/resume/ml-ai-resume.pdf`
- Create: `public/certificates/*.webp`
- Create: `src/data/certifications.json`
- Create: `scripts/build-certificate-previews.mjs`
- Create: `tests/e2e/downloads-and-certificates.spec.ts`

**Interfaces:**
- Produces: two downloadable resumes and public-safe WebP previews referenced by `src/data/certifications.json`.
- Consumes: the two existing LaTeX sources and the approved certificate source allowlist.

- [ ] **Step 1: Write failing asset integrity tests**

```ts
test('resume downloads and redacted previews are served', async ({ request }) => {
  for (const path of ['/resume/devops-cloud-resume.pdf', '/resume/ml-ai-resume.pdf']) {
    const response = await request.get(path);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('application/pdf');
  }
});
```

- [ ] **Step 2: Run tests and confirm missing asset failures**

Run: `npm run test:e2e -- tests/e2e/downloads-and-certificates.spec.ts`

Expected: FAIL because final resume and preview assets are absent.

- [ ] **Step 3: Compile the unmodified LaTeX resumes**

Use a temporary Tectonic or available TeX working directory, keeping the source files untouched. Copy only the successful PDFs to their exact public paths. Render the final PDFs to PNG and visually inspect every page.

- [ ] **Step 4: Generate and inspect redacted WebP previews**

Render only allowlisted credentials, cover sensitive fields with opaque redaction blocks, normalize the public previews, and verify the redaction in the raster output. The script must contain an explicit source allowlist and output map; no directory-wide copying is allowed.

- [ ] **Step 5: Run asset tests and production build**

Run: `npm run test:e2e -- tests/e2e/downloads-and-certificates.spec.ts && npm run build`

Expected: both PDFs and every JSON-referenced WebP return 200 and the build passes.

- [ ] **Step 6: Commit**

```bash
git add public/resume public/certificates src/data/certifications.json scripts/build-certificate-previews.mjs tests/e2e/downloads-and-certificates.spec.ts
git commit -m "assets: add resumes and redacted credentials"
```

### Task 7: Accessibility, Responsive QA, CI, and Pages Deployment

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/accessibility.spec.ts`, `tests/e2e/mobile-navigation.spec.ts`, `tests/e2e/internal-links.spec.ts`, `tests/e2e/visual-regression.spec.ts`
- Create: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`
- Modify: `README.md`, `package.json`

**Interfaces:**
- Produces: automated route-family accessibility coverage, responsive screenshots, link validation, PR CI, and Pages deployment from `main` or manual dispatch.
- Consumes: the complete static site and public assets from Tasks 1–6.

- [ ] **Step 1: Write failing accessibility and mobile-navigation tests**

```ts
test('mobile navigation is keyboard-operable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open navigation' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});
```

- [ ] **Step 2: Run browser suites and capture initial failures**

Run: `npm run test:e2e -- tests/e2e/accessibility.spec.ts tests/e2e/mobile-navigation.spec.ts tests/e2e/internal-links.spec.ts`

Expected: the suite identifies any remaining accessibility, overflow, link, or interaction issues.

- [ ] **Step 3: Fix verified issues and add responsive visual coverage**

Capture stable full-page screenshots at 390×844, 768×1024, and 1440×900. Cover reduced motion, code blocks, tables, focus, and overflow. Fix only issues reproduced by the tests or visual inspection.

- [ ] **Step 4: Add official CI and deployment workflows**

CI checks out code, sets up Node 24 with npm cache, runs `npm ci`, `npm run format:check`, `npm run lint`, `npm run check`, `npm run test:unit`, installs Chromium, runs browser tests, and builds. Deployment uses `pages: write`, `id-token: write`, the `github-pages` environment, `withastro/action`, and `actions/deploy-pages` from `main` or `workflow_dispatch`.

- [ ] **Step 5: Run the complete local verification matrix**

Run: `npm run format:check && npm run lint && npm run check && npm run test:unit && npm run test:e2e && npm run build`

Expected: every command exits 0 with no accessibility violations, broken internal links, missing assets, or build errors.

- [ ] **Step 6: Commit**

```bash
git add playwright.config.ts tests/e2e .github/workflows README.md package.json package-lock.json src public
git commit -m "ci: verify and deploy the portfolio"
```

## Plan Self-Review

- Every route, content contract, verified content source, safety restriction, test family, and deployment requirement in the approved spec maps to a task above.
- All cross-task interfaces use the same helper and data names.
- No task depends on a live backend or client framework.
- Remote repository rename, visibility, and Pages-source mutations remain an explicit owner action after review.
