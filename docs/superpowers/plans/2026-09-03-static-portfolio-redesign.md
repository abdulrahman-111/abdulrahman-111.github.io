# Static Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a simple, accessible navy-and-mint portfolio with restrained motion and a static, progressively enhanced blog on GitHub Pages.

**Architecture:** Astro continues to render every route and article at build time. Small processed TypeScript scripts enhance pre-rendered HTML through custom elements and `data-*` attributes; no UI framework, runtime fetch, backend, or database is added. Shared tokens and focused components keep the redesign consistent without copying reference-site assets or implementation.

**Tech Stack:** Astro 6.4, TypeScript 5.8, Markdown/MDX, project-owned CSS, vanilla browser APIs, Vitest 3, Playwright 1.55, axe-core, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-03-static-portfolio-redesign-design.md`

## Global Constraints

- Keep Astro 6, MDX content collections, and static GitHub Pages output.
- Add no React, Tailwind, animation package, backend, database, authentication, analytics, cookies, newsletter service, comments, favorites, read tracking, or semantic search.
- Keep all seven blog posts, five projects, résumé files, certificate previews, canonical URLs, RSS, sitemap, structured data, and redaction guarantees.
- Use `#0a192f` canvas, `#112240` raised surface, `#ccd6f6` heading text, `#8892b0` body text, and `#64ffda` accent/focus.
- Keep content visible without JavaScript. Search, sorting, view switching, clipboard feedback, and reveal motion are progressive enhancements.
- Use Astro processed component scripts. Pass build-time values through `data-*` attributes; do not use `define:vars`, because it implies inline scripts and per-instance execution.
- Respect `prefers-reduced-motion: reduce`; no parallax, cursor follower, looping animation, or motion dependency.
- Preserve WCAG A/AA automated checks, keyboard operation, visible focus, responsive containment, and no page-level horizontal overflow.
- Preserve original article prose and code unless interface metadata must change.
- Use normal English in source, tests, documentation, commits, and pull-request text.

## File Structure

**Create**

- `src/lib/blog-discovery.ts` — browser-safe search and sort model.
- `src/scripts/reveal.ts` — progressive section reveal initialization.
- `src/components/SocialRail.astro` — desktop social and email rails.
- `src/components/CopyLinkButton.astro` — reusable progressively enhanced clipboard control.
- `src/components/BlogControls.astro` — blog search, sort, view, count, and query-state controller.
- `src/components/AuthorCard.astro` — article author summary and profile link.
- `tests/unit/blog-discovery.test.ts` — pure discovery behavior.
- `tests/e2e/design-system.spec.ts` — palette, layout, motion, header, and rails.
- `tests/e2e/blog-discovery.spec.ts` — search, sort, views, query state, and no-JS fallback.
- `tests/e2e/article-tools.spec.ts` — article back, copy, source, author, edit, and navigation utilities.

**Modify**

- `src/lib/content-schemas.ts` — optional blog `featured` flag.
- `src/content/blog/from-terraform-to-gitops.mdx` — launch featured marker.
- `src/styles/tokens.css` — approved palette and spacing.
- `src/styles/global.css` — simplified canvas, shared controls, reveal motion, and reduced-motion behavior.
- `src/layouts/BaseLayout.astro` — early enhancement class, social rails, and reveal script.
- `src/components/SiteHeader.astro` — sticky simple navigation, active route, résumé action, mobile animation.
- `src/components/SiteFooter.astro` — compact identity, social, RSS, and build credit.
- `src/components/SocialLinks.astro` — mint link states.
- `src/components/ContactCta.astro` — centered portfolio contact treatment.
- `src/pages/index.astro` — narrative homepage and numbered sections.
- `src/components/PostCard.astro` — featured/list variants and optional copy action.
- `src/pages/blog/index.astro` — featured article plus enhanced discovery wrapper.
- `src/layouts/ArticleLayout.astro` — article utilities and calmer reading layout.
- `src/components/ProjectCard.astro` — simplified hover/focus treatment.
- `src/components/CertificationCard.astro` — simplified hover/focus treatment.
- `src/components/TagList.astro` — navy/mint topic chips.
- `src/components/SectionHeader.astro` — numbered/minimal heading treatment.
- `tests/unit/content-schemas.test.ts` — featured schema contract.
- `tests/e2e/accessibility.spec.ts` — new controls and active navigation.
- `tests/e2e/content-routes.spec.ts` — preserve seven-post order while accepting featured styling.
- `tests/e2e/recruiter-pages.spec.ts` — new homepage structure.
- `tests/e2e/site-integrity.spec.ts` — reduced motion, rails, and responsive coverage.
- `tests/e2e/social-links.spec.ts` — rail destinations without changing existing social groups.

---

### Task 1: Blog Discovery Model and Featured Metadata

**Files:**
- Create: `src/lib/blog-discovery.ts`
- Create: `tests/unit/blog-discovery.test.ts`
- Modify: `src/lib/content-schemas.ts:12-29`
- Modify: `src/content/blog/from-terraform-to-gitops.mdx:1-14`
- Modify: `tests/unit/content-schemas.test.ts:1-70`

**Interfaces:**
- Produces: `BlogSort = 'newest' | 'oldest' | 'shortest' | 'longest'`.
- Produces: `BlogDiscoveryItem` with `id`, `title`, `description`, `category`, `tags`, `published`, and `readingMinutes`.
- Produces: `matchesBlogQuery(item: BlogDiscoveryItem, query: string): boolean`.
- Produces: `sortBlogItems<T extends BlogDiscoveryItem>(items: T[], sort: BlogSort): T[]`.
- Produces: `featured: boolean` on parsed blog metadata, defaulting to `false`.

- [ ] **Step 1: Write failing discovery and schema tests**

```ts
// tests/unit/blog-discovery.test.ts
import { describe, expect, it } from 'vitest';
import { matchesBlogQuery, sortBlogItems, type BlogDiscoveryItem } from '../../src/lib/blog-discovery';

const posts: BlogDiscoveryItem[] = [
  {
    id: 'gitops',
    title: 'From Terraform to GitOps',
    description: 'Kubernetes delivery pipeline',
    category: 'devops',
    tags: ['Terraform', 'Kubernetes'],
    published: 2,
    readingMinutes: 8,
  },
  {
    id: 'shell',
    title: 'Building a Unix Shell',
    description: 'Processes and file descriptors',
    category: 'systems-programming',
    tags: ['C', 'Linux'],
    published: 1,
    readingMinutes: 5,
  },
];

describe('blog discovery', () => {
  it('matches every normalized query token across searchable fields', () => {
    expect(matchesBlogQuery(posts[0]!, 'kubernetes DEVOPS')).toBe(true);
    expect(matchesBlogQuery(posts[0]!, 'kubernetes shell')).toBe(false);
  });

  it('returns a sorted copy for every supported order', () => {
    expect(sortBlogItems(posts, 'newest').map(({ id }) => id)).toEqual(['gitops', 'shell']);
    expect(sortBlogItems(posts, 'oldest').map(({ id }) => id)).toEqual(['shell', 'gitops']);
    expect(sortBlogItems(posts, 'shortest').map(({ id }) => id)).toEqual(['shell', 'gitops']);
    expect(sortBlogItems(posts, 'longest').map(({ id }) => id)).toEqual(['gitops', 'shell']);
    expect(posts.map(({ id }) => id)).toEqual(['gitops', 'shell']);
  });
});
```

Add to `tests/unit/content-schemas.test.ts`:

```ts
it('defaults blog featured state to false and accepts an explicit featured post', () => {
  expect(blogSchema.parse(validBlog).featured).toBe(false);
  expect(blogSchema.parse({ ...validBlog, featured: true }).featured).toBe(true);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm run test:unit -- tests/unit/blog-discovery.test.ts tests/unit/content-schemas.test.ts`

Expected: FAIL because `blog-discovery.ts` does not exist and `featured` is absent.

- [ ] **Step 3: Implement pure discovery helpers and schema field**

```ts
// src/lib/blog-discovery.ts
export type BlogSort = 'newest' | 'oldest' | 'shortest' | 'longest';

export interface BlogDiscoveryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  published: number;
  readingMinutes: number;
}

const normalize = (value: string) => value.trim().toLocaleLowerCase('en-US');

export function matchesBlogQuery(item: BlogDiscoveryItem, query: string): boolean {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const searchable = normalize(
    [item.title, item.description, item.category, ...item.tags].join(' '),
  );
  return tokens.every((token) => searchable.includes(token));
}

export function sortBlogItems<T extends BlogDiscoveryItem>(items: T[], sort: BlogSort): T[] {
  const direction = sort === 'oldest' || sort === 'shortest' ? 1 : -1;
  const field = sort === 'newest' || sort === 'oldest' ? 'published' : 'readingMinutes';
  return [...items].sort((left, right) => {
    const difference = (left[field] - right[field]) * direction;
    return difference || left.id.localeCompare(right.id);
  });
}
```

Add `featured: z.boolean().default(false)` before `draft` in `blogSchema`. Add `featured: true` to the Terraform-to-GitOps frontmatter.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm run test:unit -- tests/unit/blog-discovery.test.ts tests/unit/content-schemas.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit task**

```bash
git add src/lib/blog-discovery.ts src/lib/content-schemas.ts src/content/blog/from-terraform-to-gitops.mdx tests/unit/blog-discovery.test.ts tests/unit/content-schemas.test.ts
git commit -m "feat: add static blog discovery model"
```

### Task 2: Navy-and-Mint Foundation and Progressive Motion

**Files:**
- Create: `src/scripts/reveal.ts`
- Create: `tests/e2e/design-system.spec.ts`
- Modify: `src/styles/tokens.css:1-32`
- Modify: `src/styles/global.css:1-126`
- Modify: `src/layouts/BaseLayout.astro:46-75`
- Modify: `tests/e2e/site-integrity.spec.ts:31-45`

**Interfaces:**
- Produces: global `[data-reveal]` and `.is-revealed` motion contract.
- Produces: `html.has-js` progressive-enhancement marker.
- Consumes: existing `page-shell`, `button-link`, focus, and reduced-motion contracts.

- [ ] **Step 1: Write failing palette and reduced-motion browser tests**

```ts
// tests/e2e/design-system.spec.ts
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
```

- [ ] **Step 2: Build and verify RED**

Run: `npm run build`

Run: `npm run test:e2e -- tests/e2e/design-system.spec.ts`

Expected: FAIL because old tokens/grid remain and no reveal contract exists.

- [ ] **Step 3: Replace tokens and shared canvas styles**

Set these exact token values in `tokens.css`:

```css
:root {
  color-scheme: dark;
  --color-canvas: #0a192f;
  --color-surface: #112240;
  --color-surface-raised: #172a45;
  --color-border: #233554;
  --color-border-strong: #3b5278;
  --color-text: #ccd6f6;
  --color-text-strong: #e6f1ff;
  --color-text-muted: #8892b0;
  --color-accent: #64ffda;
  --color-accent-soft: rgb(100 255 218 / 10%);
  --color-focus: #64ffda;
  --content-width: 70rem;
  --reading-width: 46rem;
  --radius: 0.35rem;
  --radius-pill: 999px;
  --transition-fast: 180ms ease;
  --transition-medium: 320ms ease;
}
```

Replace all `--color-cyan*` and `--color-amber` references with `--color-accent`, `--color-accent-soft`, or approved text tokens. Remove body grid gradients. Add shared reveal styles:

```css
.has-js [data-reveal] {
  opacity: 0;
  transform: translateY(1.25rem);
  transition: opacity 600ms ease var(--reveal-delay, 0ms),
    transform 600ms ease var(--reveal-delay, 0ms);
}

.has-js [data-reveal].is-revealed {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .has-js [data-reveal] { opacity: 1; transform: none; }
}
```

- [ ] **Step 4: Add progressive reveal initializer**

```ts
// src/scripts/reveal.ts
const elements = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  elements.forEach((element) => element.classList.add('is-revealed'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  elements.forEach((element) => observer.observe(element));
}
```

Add before page styles load in `BaseLayout.astro`:

```astro
<script is:inline>document.documentElement.classList.add('has-js');</script>
```

Add before `</body>`:

```astro
<script>
  import '../scripts/reveal';
</script>
```

- [ ] **Step 5: Build and verify GREEN**

Run: `npm run build`

Run: `npm run test:e2e -- tests/e2e/design-system.spec.ts tests/e2e/site-integrity.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit task**

```bash
git add src/styles/tokens.css src/styles/global.css src/scripts/reveal.ts src/layouts/BaseLayout.astro tests/e2e/design-system.spec.ts tests/e2e/site-integrity.spec.ts
git commit -m "feat: establish navy mint design system"
```

### Task 3: Header, Footer, and Desktop Contact Rails

**Files:**
- Create: `src/components/SocialRail.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/SiteHeader.astro`
- Modify: `src/components/SiteFooter.astro`
- Modify: `src/components/SocialLinks.astro`
- Modify: `tests/e2e/accessibility.spec.ts`
- Modify: `tests/e2e/design-system.spec.ts`
- Modify: `tests/e2e/social-links.spec.ts`

**Interfaces:**
- Produces: `<SocialRail side="social" | "email" />`.
- Produces: header `.is-scrolled` and active `aria-current="page"` state.
- Consumes: `siteConfig.navigation`, `siteConfig.social`, and `siteConfig.email`.

- [ ] **Step 1: Add failing header and rail tests**

```ts
test('header is sticky, marks current route, and gains scrolled state', async ({ page }) => {
  await page.goto('/blog/');
  const header = page.locator('.site-header');
  expect(await header.evaluate((node) => getComputedStyle(node).position)).toBe('sticky');
  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(navigation.getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute(
    'aria-current', 'page',
  );
  await page.evaluate(() => scrollTo(0, 300));
  await expect(header).toHaveClass(/is-scrolled/);
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
```

- [ ] **Step 2: Build and verify RED**

Run: `npm run build`

Run: `npm run test:e2e -- tests/e2e/design-system.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/social-links.spec.ts`

Expected: FAIL because rails, active route, and scroll state do not exist.

- [ ] **Step 3: Implement `SocialRail.astro`**

```astro
---
import { siteConfig } from '../data/site';
interface Props { side: 'social' | 'email' }
const { side } = Astro.props;
const profiles = [
  ['GitHub', siteConfig.social.github],
  ['LinkedIn', siteConfig.social.linkedin],
  ['Kaggle', siteConfig.social.kaggle],
  ['Medium', siteConfig.social.medium],
] as const;
---

{side === 'social' ? (
  <nav class="side-rail side-rail--social" aria-label="Desktop social links">
    <ul>{profiles.map(([label, href]) => <li><a href={href} target="_blank" rel="noreferrer">{label}</a></li>)}</ul>
  </nav>
) : (
  <aside class="side-rail side-rail--email">
    <a aria-label="Email Abdulrahman" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
  </aside>
)}
```

Style rails as fixed vertical elements below `70rem` content edges and hide them below `75rem`.

- [ ] **Step 4: Simplify header and footer**

In `SiteHeader.astro`, compute active routes with `Astro.url.pathname`, apply `aria-current`, keep existing accessible mobile behavior, add résumé action styling, and add scroll state:

```ts
const header = document.querySelector<HTMLElement>('.site-header');
const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
```

Use `position: sticky; top: 0; z-index: 20`, translucent navy, blur, and `200–250ms` mobile opacity/transform transitions. Keep the menu hidden from interaction when closed using `visibility` and `pointer-events`, not `display: none` during animation.

Render both rails in `BaseLayout.astro` outside `<main>`. Keep existing `.social-links` groups in contact/footer so social-link count tests remain stable. Footer copy becomes:

```astro
<p>Designed and built by {siteConfig.name} with Astro. Deployed on GitHub Pages.</p>
```

- [ ] **Step 5: Build and verify GREEN**

Run: `npm run build`

Run: `npm run test:e2e -- tests/e2e/design-system.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/social-links.spec.ts`

Expected: PASS at desktop and mobile sizes.

- [ ] **Step 6: Commit task**

```bash
git add src/components/SocialRail.astro src/components/SiteHeader.astro src/components/SiteFooter.astro src/components/SocialLinks.astro src/layouts/BaseLayout.astro tests/e2e/accessibility.spec.ts tests/e2e/design-system.spec.ts tests/e2e/social-links.spec.ts
git commit -m "feat: simplify portfolio navigation and rails"
```

### Task 4: Narrative Homepage and Contact Section

**Files:**
- Modify: `src/pages/index.astro:13-331`
- Modify: `src/components/ContactCta.astro:1-58`
- Modify: `src/components/SectionHeader.astro`
- Modify: `tests/e2e/recruiter-pages.spec.ts`
- Modify: `tests/e2e/design-system.spec.ts`

**Interfaces:**
- Consumes: featured projects, featured blog metadata, featured credentials, `ProjectCard`, `PostCard`, `CertificationCard`, and `ContactCta`.
- Produces: numbered `[data-reveal]` homepage sections and exact recruiter-facing hero copy.

- [ ] **Step 1: Write failing homepage structure test**

```ts
test('homepage uses simple narrative sections and preserves primary message', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', {
    level: 1,
    name: 'I build intelligent systems—and the infrastructure behind them.',
  })).toBeVisible();
  await expect(page.getByText('01. About')).toBeVisible();
  await expect(page.getByText('02. Selected Work')).toBeVisible();
  await expect(page.getByText('03. Writing')).toBeVisible();
  await expect(page.getByText('04. Contact')).toBeVisible();
  await expect(page.locator('.hero__console')).toHaveCount(0);
  await expect(page.locator('.status-strip')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Let’s build something reliable.' })).toBeVisible();
  await expect(page.locator('[data-reveal]').first()).toHaveClass(/is-revealed/);
});
```

- [ ] **Step 2: Build and verify RED**

Run: `npm run build`

Run: `npm run test:e2e -- tests/e2e/recruiter-pages.spec.ts tests/e2e/design-system.spec.ts`

Expected: FAIL because console/status layout and old contact treatment remain.

- [ ] **Step 3: Rebuild homepage markup**

Use this section order and labels:

```astro
<section class="hero page-shell" aria-labelledby="hero-title">
  <p class="hero__intro" data-reveal style="--reveal-delay: 80ms">Hi, my name is Abdulrahman.</p>
  <h1 id="hero-title" data-reveal style="--reveal-delay: 160ms">{siteConfig.tagline}</h1>
  <p class="hero__summary" data-reveal style="--reveal-delay: 240ms">Computer Engineering student building dependable ML pipelines, cloud delivery systems, and Linux software.</p>
  <div class="hero__actions" data-reveal style="--reveal-delay: 320ms">
    <a class="button-link" href="/projects/">View projects</a>
    <a class="button-link button-link--secondary" href="/resume/">Choose a résumé</a>
  </div>
</section>
<section data-reveal aria-labelledby="about-focus-title">
  <p class="eyebrow">01. About</p>
  <h2 id="about-focus-title">Engineering across model, delivery, and operating-system boundaries.</h2>
</section>
<section data-reveal aria-labelledby="featured-projects-title">
  <p class="eyebrow">02. Selected Work</p>
  <h2 id="featured-projects-title">Systems backed by evidence.</h2>
  <div class="project-grid">{featuredProjects.map((project) => <ProjectCard project={project} />)}</div>
</section>
<section data-reveal aria-labelledby="writing-title">
  <p class="eyebrow">03. Writing</p>
  <h2 id="writing-title">Notes from building the systems.</h2>
  {featuredPost && <PostCard post={featuredPost} featured />}
  <div class="post-grid">{supportingPosts.map((post) => <PostCard post={post} headingLevel="h3" />)}</div>
</section>
<section data-reveal aria-labelledby="credentials-title">
  <p class="eyebrow">Credentials</p>
  <h2 id="credentials-title">Verified learning.</h2>
  <div class="credential-grid">{featuredCredentials.map((certification) => <CertificationCard certification={certification} />)}</div>
</section>
<ContactCta />
```

Select homepage writing with:

```ts
const posts = getPublishedEntries(await getCollection('blog'), import.meta.env.PROD);
const featuredPost = posts.find((post) => post.data.featured) ?? posts[0];
const supportingPosts = posts.filter((post) => post.id !== featuredPost?.id).slice(0, 2);
```

Remove the engineering-areas dashboard and status strip; merge their useful copy into the concise About section. Keep three verified project cards and three credential previews.

- [ ] **Step 4: Center and simplify contact CTA**

Use exact interface copy:

```astro
<aside class="contact-cta" data-reveal aria-labelledby="contact-cta-title">
  <p class="eyebrow">04. Contact</p>
  <h2 id="contact-cta-title">Let’s build something reliable.</h2>
  <p>I’m open to conversations about ML systems, DevOps, cloud infrastructure, and systems engineering.</p>
  <a class="button-link" href={`mailto:${siteConfig.email}`}>Say hello</a>
  <SocialLinks ariaLabel="Contact options" />
</aside>
```

- [ ] **Step 5: Build and verify GREEN**

Run: `npm run build`

Run: `npm run test:e2e -- tests/e2e/recruiter-pages.spec.ts tests/e2e/design-system.spec.ts tests/e2e/social-links.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit task**

```bash
git add src/pages/index.astro src/components/ContactCta.astro src/components/SectionHeader.astro tests/e2e/recruiter-pages.spec.ts tests/e2e/design-system.spec.ts
git commit -m "feat: rebuild portfolio homepage narrative"
```

### Task 5: Reusable Copy Link and Article Card Variants

**Files:**
- Create: `src/components/CopyLinkButton.astro`
- Modify: `src/components/PostCard.astro:1-84`
- Create: `tests/e2e/article-tools.spec.ts`

**Interfaces:**
- Produces: `<CopyLinkButton value={absoluteUrl} label="Copy article link" />`.
- Updates: `PostCard` props with `featured?: boolean` and `showCopy?: boolean`.
- Keeps: existing `headingLevel?: 'h2' | 'h3'`.

- [ ] **Step 1: Write failing clipboard component test through blog card**

```ts
// tests/e2e/article-tools.spec.ts
import { expect, test } from '@playwright/test';

test('copy-link control reports success and uses canonical article URL', async ({ page }) => {
  await page.goto('/blog/');
  const button = page.getByRole('button', { name: 'Copy article link' }).first();
  await expect(button).toBeVisible();
  await button.click();
  await expect(button).toContainText('Copied');
  await expect(page.locator('[data-copy-status]').first()).toHaveText('Article link copied.');
});
```

- [ ] **Step 2: Build and verify RED**

Run: `npm run build`

Run: `npm run test:e2e -- tests/e2e/article-tools.spec.ts`

Expected: FAIL because copy controls do not exist.

- [ ] **Step 3: Implement progressive clipboard custom element**

```astro
---
interface Props { value: string; label?: string; class?: string }
const { value, label = 'Copy link', class: className } = Astro.props;
---
<copy-link data-value={value} class:list={['copy-link', className]}>
  <button type="button" aria-label={label} hidden><span data-copy-label>Copy link</span></button>
  <span class="sr-only" aria-live="polite" data-copy-status></span>
</copy-link>

<script>
  class CopyLinkElement extends HTMLElement {
    connectedCallback() {
      const button = this.querySelector('button');
      const label = this.querySelector<HTMLElement>('[data-copy-label]');
      const status = this.querySelector<HTMLElement>('[data-copy-status]');
      if (!(button instanceof HTMLButtonElement) || !label || !status) return;
      button.hidden = false;
      button.addEventListener('click', async () => {
        const value = this.dataset.value ?? location.href;
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          const input = document.createElement('textarea');
          input.value = value;
          document.body.append(input);
          input.select();
          document.execCommand('copy');
          input.remove();
        }
        label.textContent = 'Copied';
        status.textContent = 'Article link copied.';
        window.setTimeout(() => {
          label.textContent = 'Copy link';
          status.textContent = '';
        }, 2000);
      });
    }
  }
  if (!customElements.get('copy-link')) customElements.define('copy-link', CopyLinkElement);
</script>
```

- [ ] **Step 4: Add card variants without duplicating markup**

Add `featured` and `showCopy` props to `PostCard`. Apply class `post-card--featured` through `class:list`. When `showCopy`, render `CopyLinkButton` with `${siteConfig.url}/blog/${post.id}/`. Use card hover/focus translation no larger than `4px`; disable transform under reduced motion.

- [ ] **Step 5: Build and verify GREEN**

Run: `npm run build`

Run: `npm run test:e2e -- tests/e2e/article-tools.spec.ts tests/e2e/content-routes.spec.ts`

Expected: PASS with seven article headings still present.

- [ ] **Step 6: Commit task**

```bash
git add src/components/CopyLinkButton.astro src/components/PostCard.astro tests/e2e/article-tools.spec.ts tests/e2e/content-routes.spec.ts
git commit -m "feat: add reusable article link controls"
```

### Task 6: Static Blog Search, Sort, Featured View, and List View

**Files:**
- Create: `src/components/BlogControls.astro`
- Create: `tests/e2e/blog-discovery.spec.ts`
- Modify: `src/pages/blog/index.astro:1-104`
- Modify: `tests/e2e/content-routes.spec.ts:10-30`
- Modify: `tests/e2e/accessibility.spec.ts:4-26`

**Interfaces:**
- Consumes: `matchesBlogQuery`, `sortBlogItems`, `BlogSort`, `PostCard`, and server-derived reading minutes.
- Produces: `<BlogControls total={number}><ol data-blog-results><slot /></ol></BlogControls>` custom-element wrapper.
- Produces: `q`, `sort`, and `view` query parameters.
- Produces: `[data-blog-item]` records and `[data-blog-results]` list.

- [ ] **Step 1: Write failing discovery interaction tests**

```ts
// tests/e2e/blog-discovery.spec.ts
import { expect, test } from '@playwright/test';

test('searches, sorts, switches view, and restores URL state', async ({ page }) => {
  await page.goto('/blog/');
  const search = page.getByRole('searchbox', { name: 'Search articles' });
  await search.fill('systems shell');
  await expect(page.locator('[data-blog-item]:visible')).toHaveCount(3);
  await expect(page.getByText('3 articles')).toBeVisible();

  await page.getByLabel('Sort articles').selectOption('oldest');
  const visibleTitles = page.locator('[data-blog-item]:visible .post-card h2');
  await expect(visibleTitles.first()).toContainText('My First Linux Utility');

  await page.getByRole('button', { name: 'Compact list' }).click();
  await expect(page.locator('blog-discovery')).toHaveAttribute('data-view', 'list');
  await expect(page).toHaveURL(/q=systems\+shell/);
  await expect(page).toHaveURL(/sort=oldest/);
  await expect(page).toHaveURL(/view=list/);

  await page.reload();
  await expect(search).toHaveValue('systems shell');
  await expect(page.locator('blog-discovery')).toHaveAttribute('data-view', 'list');
});

test('shows every article when JavaScript is disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/blog/');
  await expect(page.locator('.post-card h2')).toHaveCount(7);
  await expect(page.getByRole('link', { name: 'Kubernetes' }).first()).toBeVisible();
  await context.close();
});
```

- [ ] **Step 2: Build and verify RED**

Run: `npm run build`

Run: `npm run test:e2e -- tests/e2e/blog-discovery.spec.ts`

Expected: FAIL because controls and discovery wrapper do not exist.

- [ ] **Step 3: Build `BlogControls.astro` semantic wrapper**

Render controls hidden by default and reveal them in `connectedCallback()`:

```astro
---
interface Props { total: number }
const { total } = Astro.props;
---
<blog-discovery data-view="cards">
  <div class="blog-controls" data-blog-controls hidden>
    <label>Search articles<input type="search" name="q" autocomplete="off" /></label>
    <label>Sort articles<select name="sort">
      <option value="newest">Newest</option><option value="oldest">Oldest</option>
      <option value="shortest">Shortest read</option><option value="longest">Longest read</option>
    </select></label>
    <div role="group" aria-label="Article view">
      <button type="button" data-view="cards" aria-pressed="true">Cards</button>
      <button type="button" data-view="list" aria-pressed="false">Compact list</button>
    </div>
    <p aria-live="polite" data-result-count>{total} articles</p>
  </div>
  <slot />
  <p data-blog-empty hidden>No articles match this search.</p>
</blog-discovery>
```

In the processed script, import `matchesBlogQuery` and `sortBlogItems` and use this state flow:

```ts
import {
  matchesBlogQuery,
  sortBlogItems,
  type BlogDiscoveryItem,
  type BlogSort,
} from '../lib/blog-discovery';

class BlogDiscoveryElement extends HTMLElement {
  connectedCallback() {
    const controls = this.querySelector<HTMLElement>('[data-blog-controls]');
    const results = this.querySelector<HTMLElement>('[data-blog-results]');
    const count = this.querySelector<HTMLElement>('[data-result-count]');
    const empty = this.querySelector<HTMLElement>('[data-blog-empty]');
    const search = this.querySelector<HTMLInputElement>('input[name="q"]');
    const sortSelect = this.querySelector<HTMLSelectElement>('select[name="sort"]');
    const viewButtons = [...this.querySelectorAll<HTMLButtonElement>('button[data-view]')];
    if (!controls || !results || !count || !empty || !search || !sortSelect) return;

    type BrowserItem = BlogDiscoveryItem & { element: HTMLElement };
    const items: BrowserItem[] = [...this.querySelectorAll<HTMLElement>('[data-blog-item]')]
      .map((element) => ({
        element,
        id: element.dataset.id ?? '',
        title: element.dataset.title ?? '',
        description: element.dataset.description ?? '',
        category: element.dataset.category ?? '',
        tags: JSON.parse(element.dataset.tags ?? '[]') as string[],
        published: Number(element.dataset.published ?? 0),
        readingMinutes: Number(element.dataset.readingMinutes ?? 0),
      }));

    const parameters = new URLSearchParams(location.search);
    const allowedSorts: BlogSort[] = ['newest', 'oldest', 'shortest', 'longest'];
    let query = parameters.get('q') ?? '';
    let sort: BlogSort = allowedSorts.includes(parameters.get('sort') as BlogSort)
      ? (parameters.get('sort') as BlogSort)
      : 'newest';
    let view = parameters.get('view') === 'list' ? 'list' : 'cards';

    const updateUrl = () => {
      const next = new URL(location.href);
      query ? next.searchParams.set('q', query) : next.searchParams.delete('q');
      sort === 'newest' ? next.searchParams.delete('sort') : next.searchParams.set('sort', sort);
      view === 'cards' ? next.searchParams.delete('view') : next.searchParams.set('view', view);
      history.replaceState({}, '', next);
    };

    const apply = (updateHistory = true) => {
      const ordered = sortBlogItems(items, sort);
      const visible = ordered.filter((item) => matchesBlogQuery(item, query));
      const visibleIds = new Set(visible.map(({ id }) => id));
      ordered.forEach((item) => {
        item.element.hidden = !visibleIds.has(item.id);
        results.append(item.element);
      });
      count.textContent = `${visible.length} ${visible.length === 1 ? 'article' : 'articles'}`;
      empty.hidden = visible.length !== 0;
      this.dataset.view = view;
      this.dataset.filtering = query ? 'true' : 'false';
      viewButtons.forEach((button) =>
        button.setAttribute('aria-pressed', String(button.dataset.view === view)),
      );
      if (updateHistory) updateUrl();
    };

    search.value = query;
    sortSelect.value = sort;
    controls.hidden = false;
    search.addEventListener('input', () => { query = search.value.trim(); apply(); });
    sortSelect.addEventListener('change', () => { sort = sortSelect.value as BlogSort; apply(); });
    viewButtons.forEach((button) => button.addEventListener('click', () => {
      view = button.dataset.view === 'list' ? 'list' : 'cards';
      apply();
    }));
    apply(false);
  }
}

if (!customElements.get('blog-discovery')) {
  customElements.define('blog-discovery', BlogDiscoveryElement);
}
```

Behavior on connect:

1. Read query parameters, accepting only the four sort values and two view values.
2. Map each `[data-blog-item]` dataset into a `BlogDiscoveryItem` plus its element.
3. Filter with `matchesBlogQuery`.
4. Sort visible items with `sortBlogItems` and append them to `[data-blog-results]` in order.
5. Set `hidden` on nonmatches.
6. Update count, no-results message, pressed states, wrapper `data-view`, and `data-filtering`.
7. Update URL with `history.replaceState` after input/change/click.

- [ ] **Step 4: Render all seven records and featured state in blog index**

Wrap the list with `BlogControls`. Each list item receives:

```astro
<li
  data-blog-item
  data-id={post.id}
  data-title={post.data.title}
  data-description={post.data.description}
  data-category={post.data.category}
  data-tags={JSON.stringify(post.data.tags)}
  data-published={post.data.published.getTime()}
  data-reading-minutes={getReadingTime(post.body ?? '')}
  data-featured={post.data.featured ? 'true' : 'false'}
>
  <PostCard post={post} featured={post.data.featured} showCopy />
</li>
```

Use CSS Grid so the featured card spans the full width in default card view. In list view, remove card minimum height, collapse description spacing, and keep metadata/copy controls readable. Keep category and tag routes outside the enhanced control so they work without JavaScript.

- [ ] **Step 5: Build and verify GREEN**

Run: `npm run build`

Run: `npm run test:e2e -- tests/e2e/blog-discovery.spec.ts tests/e2e/content-routes.spec.ts tests/e2e/accessibility.spec.ts`

Expected: PASS with search, sort, view, query restoration, seven-post no-JS output, and axe checks.

- [ ] **Step 6: Commit task**

```bash
git add src/components/BlogControls.astro src/pages/blog/index.astro tests/e2e/blog-discovery.spec.ts tests/e2e/content-routes.spec.ts tests/e2e/accessibility.spec.ts
git commit -m "feat: add static blog discovery controls"
```

### Task 7: Article Reading Utilities and Author Context

**Files:**
- Create: `src/components/AuthorCard.astro`
- Modify: `src/layouts/ArticleLayout.astro:1-363`
- Modify: `tests/e2e/article-tools.spec.ts`
- Modify: `tests/e2e/accessibility.spec.ts`

**Interfaces:**
- Produces: `<AuthorCard />` using `siteConfig` identity data.
- Consumes: `CopyLinkButton`, `post.data.sourceUrl`, `post.data.updated`, existing TOC, neighbors, and related posts.
- Produces: deterministic GitHub edit URL for `src/content/blog/${post.id}.mdx`.

- [ ] **Step 1: Add failing article utility test**

```ts
test('article exposes navigation, source, author, copy, and edit utilities', async ({ page }) => {
  await page.goto('/blog/my-simple-guide-to-git-and-github/');
  await expect(page.getByRole('link', { name: 'Back to all articles' })).toHaveAttribute('href', '/blog/');
  await expect(page.getByRole('link', { name: 'Originally published on Medium' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy article link' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Written by Abdulrahman Gomaa Hassan' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Edit this article on GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/abdulrahman-111/abdulrahman-111.github.io/edit/main/src/content/blog/my-simple-guide-to-git-and-github.mdx',
  );
  await expect(page.getByRole('navigation', { name: 'Article pagination' })).toBeVisible();
});
```

- [ ] **Step 2: Build and verify RED**

Run: `npm run build`

Run: `npm run test:e2e -- tests/e2e/article-tools.spec.ts`

Expected: FAIL because back, author, copy, and edit controls are absent.

- [ ] **Step 3: Implement visible author card**

```astro
---
import { siteConfig } from '../data/site';
---
<aside class="author-card" aria-labelledby="article-author-title">
  <p class="eyebrow">Author</p>
  <h2 id="article-author-title">Written by {siteConfig.name}</h2>
  <p>Computer Engineering student building ML systems, cloud delivery infrastructure, and Linux software.</p>
  <a href="/about/">More about Abdulrahman</a>
</aside>
```

- [ ] **Step 4: Recompose article header and footer utilities**

Add before article metadata:

```astro
<a class="article-back" href="/blog/">← Back to all articles</a>
```

Render publication date, optional `Updated {formattedUpdated}`, reading time, category, Medium source, and `CopyLinkButton`. After prose, render `AuthorCard` and:

```astro
<a
  class="article-edit"
  href={`https://github.com/abdulrahman-111/abdulrahman-111.github.io/edit/main/src/content/blog/${post.id}.mdx`}
  target="_blank"
  rel="noreferrer"
>Edit this article on GitHub</a>
```

Keep TOC sticky only above `64rem`. Keep article content within `--reading-width`, code blocks internally scrollable, and neighbors stacked below `44rem`.

- [ ] **Step 5: Build and verify GREEN**

Run: `npm run build`

Run: `npm run test:e2e -- tests/e2e/article-tools.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/site-integrity.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit task**

```bash
git add src/components/AuthorCard.astro src/layouts/ArticleLayout.astro tests/e2e/article-tools.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/site-integrity.spec.ts
git commit -m "feat: improve article reading utilities"
```

### Task 8: Unify Cards and Remaining Page Surfaces

**Files:**
- Modify: `src/components/ProjectCard.astro`
- Modify: `src/components/CertificationCard.astro`
- Modify: `src/components/TagList.astro`
- Modify: `src/components/SectionHeader.astro`
- Modify: `src/pages/projects/index.astro`
- Modify: `src/pages/projects/[slug].astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/certifications.astro`
- Modify: `src/pages/resume.astro`
- Modify: `src/pages/404.astro`
- Modify: `tests/e2e/site-integrity.spec.ts`
- Modify: `tests/e2e/downloads-and-certificates.spec.ts`

**Interfaces:**
- Consumes: approved global tokens, shared `.button-link`, `[data-reveal]`, and existing content schemas.
- Produces: consistent raised-surface cards, mint interactions, and responsive spacing across every route family.

- [ ] **Step 1: Add failing cross-route visual contract test**

```ts
test('cards use raised navy surfaces and restrained interaction distance', async ({ page }) => {
  for (const [route, selector] of [
    ['/projects/', '.project-card'],
    ['/blog/', '.post-card'],
    ['/certifications/', '.credential-card'],
  ] as const) {
    await page.goto(route);
    const card = page.locator(selector).first();
    const styles = await card.evaluate((node) => {
      const style = getComputedStyle(node);
      return { background: style.backgroundColor, transition: style.transitionDuration };
    });
    expect(styles.background).toBe('rgb(17, 34, 64)');
    expect(styles.transition).not.toBe('0s');
  }
});
```

- [ ] **Step 2: Build and verify RED**

Run: `npm run build`

Run: `npm run test:e2e -- tests/e2e/site-integrity.spec.ts tests/e2e/downloads-and-certificates.spec.ts`

Expected: FAIL while old surfaces remain.

- [ ] **Step 3: Apply shared visual contract**

For project, post, and certification cards use:

```css
background: var(--color-surface);
border: 1px solid transparent;
border-radius: var(--radius);
box-shadow: 0 0.625rem 1.875rem rgb(2 12 27 / 35%);
transition: transform var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
```

On `:hover` and `:focus-within`, use `transform: translateY(-0.25rem)` and mint border/link color. Under reduced motion, use no transform. Tags become mint-outline pills with at least `2rem` touch height. Certification images retain natural aspect ratio and existing redaction.

Apply `data-reveal` to primary page sections without hiding content by default. Replace leftover cyan/amber/grid/console visual references on About, Projects, Certifications, Résumé, project details, and 404 pages. Do not alter factual content or route structure.

- [ ] **Step 4: Build and verify GREEN across route families**

Run: `npm run build`

Run: `npm run test:e2e -- tests/e2e/site-integrity.spec.ts tests/e2e/downloads-and-certificates.spec.ts tests/e2e/recruiter-pages.spec.ts`

Expected: PASS at `390×844`, `768×1024`, and `1440×900` with no overflow or distorted images.

- [ ] **Step 5: Run axe sweep**

Run: `npm run test:e2e -- tests/e2e/accessibility.spec.ts`

Expected: PASS across all route families.

- [ ] **Step 6: Commit task**

```bash
git add src/components/ProjectCard.astro src/components/CertificationCard.astro src/components/TagList.astro src/components/SectionHeader.astro src/pages/projects src/pages/about.astro src/pages/certifications.astro src/pages/resume.astro src/pages/404.astro tests/e2e/site-integrity.spec.ts tests/e2e/downloads-and-certificates.spec.ts tests/e2e/recruiter-pages.spec.ts tests/e2e/accessibility.spec.ts
git commit -m "feat: unify portfolio page surfaces"
```

### Task 9: Full Verification, Review, and GitHub Pages Delivery

**Files:**
- Inspect: all changed files from Tasks 1–8.
- Modify only if verification finds scoped defects.
- Verify: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `astro.config.mjs`.

**Interfaces:**
- Consumes: complete redesign branch.
- Produces: reviewed pull request, passing CI, merged `main`, successful Pages deployment, and live verification.

- [ ] **Step 1: Run formatting and static checks**

Run: `npm run format`

Run: `npm run format:check`

Run: `npm run lint`

Run: `npm run check`

Expected: all exit `0`; Astro reports `0 errors` and `0 warnings`.

- [ ] **Step 2: Run complete automated suite**

Run: `npm run test:unit`

Run: `npm run build`

Run: `npm run test:e2e`

Expected: all tests pass; production build emits all current routes with no duplicate-route or content-schema warnings.

- [ ] **Step 3: Audit generated output**

Run:

```bash
rg -n "#07131f|#3dd9e8|#f4b942|color-grid|hero__console|status-strip" src
rg -n "abdulrahman-111.github.io" dist/index.html dist/blog/index.html dist/rss.xml dist/sitemap-index.xml
git diff --check
git status --short
```

Expected: first search returns no legacy visual references; generated canonical URLs use production origin; diff check is clean; status contains only intended formatted changes.

- [ ] **Step 4: Perform focused code review**

Use `superpowers:requesting-code-review` or `cavecrew-reviewer` against the complete branch diff. Fix only correctness, accessibility, responsive, performance, or spec-compliance findings. Repeat relevant tests after each fix.

- [ ] **Step 5: Commit verification fixes when present**

```bash
git add src tests
git commit -m "fix: address portfolio redesign review"
```

If review produces no code changes, skip this commit.

- [ ] **Step 6: Push branch and open pull request**

```bash
git push -u origin codex/static-portfolio-redesign
gh pr create --base main --head codex/static-portfolio-redesign --title "feat: simplify portfolio design and blog" --body-file /tmp/portfolio-redesign-pr.md
```

PR body must summarize visual redesign, static blog features, progressive enhancement, accessibility, tests, and absence of backend/database changes in normal English.

- [ ] **Step 7: Verify GitHub Actions and merge**

Run: `gh pr checks --watch`

Expected: CI formatting, lint, Astro check, unit, browser, and build jobs pass.

Merge through GitHub using squash or repository-default method after checks pass.

- [ ] **Step 8: Verify production deployment**

Confirm Pages workflow succeeds, then verify:

```text
https://abdulrahman-111.github.io/
https://abdulrahman-111.github.io/blog/
https://abdulrahman-111.github.io/blog/from-terraform-to-gitops/
https://abdulrahman-111.github.io/resume/
https://abdulrahman-111.github.io/rss.xml
https://abdulrahman-111.github.io/sitemap-index.xml
https://abdulrahman-111.github.io/robots.txt
```

Check exact homepage heading, navy/mint theme, search/sort/view controls, copy feedback, responsive rails, article utilities, two résumé PDFs, seven posts, 16 certificate previews, RSS, sitemap, robots, and no horizontal overflow.
