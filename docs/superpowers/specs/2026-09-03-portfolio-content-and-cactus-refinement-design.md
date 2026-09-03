# Portfolio Content and Cactus Refinement Design

## Objective

Refine the deployed Systems Console portfolio by adding Abdulrahman Gomaa Hassan's Kaggle, Medium, GitHub, and email links; importing all four articles currently published under `@agofficial`; improving site-wide writing and syntax; and removing development-only repository files without replacing the established visual identity.

## Approved Direction

The portfolio will adopt selected content and interaction patterns from Astro Cactus rather than migrate to the Astro Cactus starter.

Astro Cactus is an opinionated Astro starter with its own Tailwind-based design system, content conventions, optional search, generated images, and other integrations. Replacing the current project with that starter would discard the approved Systems Console visual system and add dependencies that do not serve the current portfolio. The refinement will instead adopt its content-first post presentation, compact metadata, direct social navigation, and clear original-publication attribution using the existing Astro 6 architecture and project-owned CSS.

The project remains:

- Astro 6 with strict TypeScript.
- A fully static GitHub Pages site.
- Dark-only and English-only.
- Framework-free in the browser, except for the existing small mobile-navigation script.
- Backed by schema-validated local Markdown and MDX content.
- Free of analytics, cookies, webmentions, databases, and contact-form services.

## Public Profiles and Contact Links

The site configuration will expose these public destinations:

- Email: `mailto:abdulrahman.gomaa.h05@gmail.com`
- GitHub: `https://github.com/abdulrahman-111`
- LinkedIn: `https://www.linkedin.com/in/abdulrahman-gomaa`
- Kaggle: `https://www.kaggle.com/abdulrahmanh05`
- Medium: `https://medium.com/@agofficial`

A reusable social-links component will render these destinations consistently. It will appear in the footer, the About page, and the contact call to action. Link text will remain visible and understandable without icons, JavaScript, or hover state. External links will use secure new-tab behavior when appropriate; email will use a normal `mailto:` link.

The Person structured-data `sameAs` list will include GitHub, LinkedIn, Kaggle, and Medium. Email remains in the structured `email` field rather than `sameAs`.

## Medium Article Import

The blog will contain seven published articles: the three existing site-native articles plus these four Medium imports, ordered by publication date:

1. **My Simple Guide to Git & GitHub: What I Learned While Figuring Things Out**
   - Published: 2025-12-04
   - Original: `https://medium.com/@agofficial/my-simple-guide-to-git-github-what-i-learned-while-figuring-things-out-899d02b985fc`
2. **My Journey Learning Bash Scripting: From Zero to Command Creation**
   - Published: 2025-11-22
   - Original: `https://medium.com/@agofficial/my-journey-learning-bash-scripting-from-zero-to-command-creation-e2afd645db16`
3. **From `mycat` to My Own Shell — a Comprehensive Story**
   - Published: 2025-08-29
   - Original: `https://medium.com/@agofficial/from-mycat-to-my-own-shell-a-comprehensive-story-3cc98de52957`
4. **My First Linux Utility: A Step Toward Building My Own Shell**
   - Published: 2025-08-24
   - Original: `https://medium.com/@agofficial/my-first-linux-utility-a-step-toward-building-my-own-shell-dc05b7b82872`

The two imported shell articles and the existing **Building a Unix Shell in Stages: Femto to Micro** article will remain separate. They represent different snapshots and levels of detail.

### Editorial Boundary

Imported Medium articles will preserve:

- The original section order and heading hierarchy.
- The original paragraphs, lists, examples, and conclusion order.
- Every code block exactly as published, including command spelling, paths, quoting, and implementation choices.
- The author's first-person voice and technical claims.

Only prose grammar, punctuation, capitalization, spacing, and obvious typographical mistakes will be corrected. The import will not modernize commands, repair code, introduce new technical claims, or restructure the tutorial. This boundary ensures the website is a faithful, lightly copyedited edition rather than a rewritten article.

Each imported entry will contain an optional `sourceUrl` frontmatter field. Article pages will render a visible **Originally published on Medium** link near the publication metadata. Site-native posts omit this field and render no source notice.

## Blog Content Contract

`BlogEntry` will retain its current fields and add:

```ts
sourceUrl?: string;
```

The schema will accept only valid HTTPS URLs for `sourceUrl`. This field will be available to the article layout and tests. Existing draft filtering, date sorting, related-post scoring, category pages, tag pages, previous/next navigation, reading time, RSS, and sitemap behavior will remain unchanged.

The imported articles will use existing category values:

- Git and GitHub guide: `devops`
- Bash scripting journey: `devops`
- Comprehensive shell story: `systems-programming`
- First Linux utility: `systems-programming`

Tags will use concise lower-case technical terms that work with the current static tag routes.

## Cactus-Inspired Presentation

The blog refinement will use the following patterns without copying Cactus's implementation or installing its dependencies:

- A compact post masthead that keeps publication date, reading time, category, tags, and original-source attribution close to the title.
- A calmer, content-first article column with predictable spacing for headings, lists, blockquotes, code blocks, and tables.
- Clear previous/next article navigation.
- A reusable social link list with direct labels.
- Consistent article-card metadata and publication dates.

The current navy engineering grid, cyan and amber accents, typography, components, route structure, and responsive behavior remain authoritative. Tailwind, Pagefind, Satori, Astro Icon, webmentions, notes, light mode, and Cactus theme synchronization are out of scope.

## Responsive Media

Every visible image must fit its content container at mobile, tablet, and desktop widths without distortion or horizontal overflow.

- Global content images use `max-inline-size: 100%` and `block-size: auto` so their intrinsic aspect ratios are preserved.
- Article images are centered within the prose column and may not exceed its width.
- Project media uses the full available project-visual width with automatic height; it is never stretched to a fixed height.
- Certificate previews retain a consistent card frame and use `object-fit: contain`, ensuring the complete credential remains visible rather than cropped.
- Explicit `width` and `height` attributes remain on local raster images to reserve layout space and reduce layout shift.
- Small viewports must not create page-level horizontal scrolling. Wide code blocks and tables continue to scroll only inside their own containers.

Any content image imported with a Medium article will be stored locally only when it is part of the article itself. Author avatars, Medium interface graphics, duplicate thumbnails, and decorative publication chrome will not be copied. Imported raster media will be normalized to WebP with a practical display resolution before it is committed; the layout will not depend on Medium's image CDN.

## Writing and Syntax Review

The refinement includes a complete editorial pass over user-visible text in:

- The homepage.
- About, résumé, certification, project index, and blog index pages.
- Shared header, footer, contact, card, and article-layout components.
- Existing project and blog MDX entries.
- SEO titles, descriptions, labels, and RSS copy.

The review will correct grammar, punctuation, capitalization, terminology, parallel structure, and awkward phrasing while preserving verified facts and the existing professional voice. It will standardize these choices:

- **GitHub**, **Git**, **Kubernetes**, **DevOps**, **ML/AI**, and **résumé** use consistent capitalization.
- Headings use sentence case unless a proper noun requires otherwise.
- Dates and periods retain the existing display convention.
- Calls to action use specific destination-oriented labels.
- Em dashes and typographic apostrophes are used consistently in prose.

Code syntax and site implementation will be checked with Prettier, ESLint, `astro check`, schema tests, unit tests, and browser tests. Code blocks imported from Medium are excluded from code correction under the approved editorial boundary.

## Repository Hygiene

The current repository contains approximately 93 tracked files totaling 1.31 MB. It does not contain tracked `node_modules`, `dist`, browser reports, raw certificate PDFs, LaTeX sources, or unredacted identity documents. The certificate previews, résumé PDFs, application source, lockfile, CI workflows, and automated tests are necessary and will remain tracked.

After the specification and implementation plan have served their review purpose, the final implementation will remove these development-only files from the repository's current tree:

- `docs/superpowers/`
- `scripts/build-certificate-previews.mjs`

The generated redacted WebP previews remain under `public/certificates/`. The one-time generator is not part of the production build and depends on certificate source files that are intentionally absent from the public repository.

`.gitignore` will be expanded to exclude:

- `/worktrees/` and `/.worktrees/`
- `/docs/superpowers/`
- `/.local-tools/`
- LaTeX build artifacts such as `*.aux`, `*.fls`, `*.fdb_latexmk`, `*.out`, `*.synctex.gz`, and `*.toc`
- Local logs, caches, coverage, browser reports, test results, `.astro`, `dist`, and `node_modules`
- Local environment files while preserving a future `.env.example`

Deleting these paths affects only the current repository tree; their historical commits remain in Git history. History rewriting is out of scope.

## Components and Files

The implementation will primarily affect:

- `src/data/site.ts` for public profile links.
- `src/lib/content-schemas.ts` for `sourceUrl` validation.
- `src/components/SocialLinks.astro` as the reusable link presentation.
- `src/components/SiteFooter.astro` and `src/components/ContactCta.astro` for shared links.
- `src/layouts/BaseLayout.astro` for structured profile data.
- `src/layouts/ArticleLayout.astro` for original-publication attribution and article presentation.
- `src/pages/about.astro` and relevant page/component copy for the editorial pass.
- `src/content/blog/*.mdx` for the four imports and copyediting.
- `src/styles/global.css`, `src/components/CertificationCard.astro`, and project/article media styles for responsive image containment.
- `.gitignore` and the approved development-only files for cleanup.
- Unit and end-to-end tests for the expanded content and links.

## Testing and Acceptance Criteria

The change is complete when:

1. Seven blog posts build in production and appear in correct descending publication order.
2. Each of the four imported posts retains its original section order and code blocks and displays the correct Medium source link.
3. GitHub, email, LinkedIn, Kaggle, and Medium links are visible, keyboard accessible, and point to the approved destinations.
4. Person structured data includes the four public profiles.
5. Category, tag, related-post, previous/next, RSS, sitemap, and draft-exclusion behavior still works with seven posts.
6. The editorial pass introduces no unsupported claims and no changes to imported code.
7. The current tree contains no development-only Superpowers documents or certificate-generation script.
8. `.gitignore` covers the approved local and generated artifacts.
9. Article, project, and certificate images preserve their aspect ratios, fit their containers, and create no page-level overflow at 390×844, 768×1024, or 1440×900.
10. Formatting, linting, Astro type checks, unit tests, Playwright tests, axe checks, internal-link checks, production build, and responsive overflow checks pass.
11. GitHub Actions CI and deployment succeed, and the live site exposes the updated links and articles.

## Delivery

Work will be committed on `codex/portfolio-refinement`, pushed to GitHub, and proposed through a pull request. The deployment workflow will publish only after the tested changes reach `main`. The live site and its blog, RSS, sitemap, social links, and imported-source links will be verified after deployment.
