# Systems Console Portfolio

Recruiter-first portfolio and engineering blog for Abdulrahman Gomaa Hassan, built with Astro 6, TypeScript, local Markdown/MDX content, and project-owned CSS.

## Local development

Requirements: Node.js 22.23 or newer and npm.

```sh
npm ci
npm run dev
```

The production site is fully static. It has no backend, database, analytics, cookies, frontend framework, or contact-form service.

## Quality checks

```sh
npm run format:check
npm run lint
npm run check
npm run test:unit
npm run build
npm run test:e2e
```

The Playwright suite covers route families, local assets and downloads, keyboard navigation, visible focus, WCAG A/AA axe checks, internal links, reduced motion, and responsive overflow at 390×844, 768×1024, and 1440×900.

## Content

- Projects and articles live in `src/content/` and are schema-validated by `src/content.config.ts`.
- Site identity, education, experience, skills, public contact channels, and résumé records live in `src/data/site.ts`.
- Credential metadata lives in `src/data/certifications.json`.
- `scripts/build-certificate-previews.mjs` regenerates only the explicit allowlist of redacted WebP previews from locally available source PDFs. It never copies source certificate PDFs into the website.

## Deployment

Pull requests run the full CI gate on Node.js 24. Pushes to `main` and manual dispatches use the official `withastro/action@v6` build/upload action and `actions/deploy-pages@v5`.

Before the first publication:

1. Rename the repository to `abdulrahman-111.github.io` and make it public.
2. In **Settings → Pages**, select **GitHub Actions** as the source.
3. Merge the feature branch into `main` or manually dispatch the deployment workflow.
4. Verify the homepage, canonical URLs, `/sitemap-index.xml`, `/rss.xml`, résumé files, and certificate asset paths on the deployed origin.

The deployment workflow deliberately does not rename repositories, change visibility, or alter Pages settings.
