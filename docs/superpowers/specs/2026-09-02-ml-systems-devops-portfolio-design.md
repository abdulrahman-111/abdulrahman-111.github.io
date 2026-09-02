# ML Systems + DevOps Portfolio Design

**Status:** Approved for implementation on 2026-09-02  
**Direction:** Systems Console  
**Owner:** Abdulrahman Gomaa Hassan

## Purpose

Build an English-only, recruiter-first portfolio that makes Abdulrahman's combined ML systems and DevOps profile legible in the first screen, then backs every claim with case-study evidence, technical writing, credentials, and downloadable resumes.

The primary message is: **“I build intelligent systems—and the infrastructure behind them.”**

## Architecture

The site is a fully static Astro 6 project written in strict TypeScript. Local Markdown and MDX files are loaded at build time through schema-validated collections in `src/content.config.ts`. Astro components and project-owned CSS provide the interface; no client framework, backend, database, analytics, cookies, or form service is included. The only client-side JavaScript controls the accessible mobile navigation.

Production output targets the root GitHub Pages site `https://abdulrahman-111.github.io/`. Canonical URLs, sitemap entries, RSS links, and asset URLs all derive from this origin.

## Information Architecture

- `/` introduces the dual ML systems and infrastructure positioning, proof points, featured work, latest writing, selected credentials, profile summary, and contact methods.
- `/projects/` ranks five evidence-based case studies. `/projects/[slug]/` separates whole-system capability from Abdulrahman's verified contribution.
- `/blog/` lists publishable long-form engineering posts. Tag and category routes are static HTML filters. Article pages provide a generated table of contents, reading time, related posts, and chronological previous/next navigation.
- `/about/` covers education, DEPI and NTI experience, technical skills, interests, and IEEE Computer Society leadership.
- `/certifications/` groups public-safe credential previews by professional, ML/AI, cloud/DevOps, programming/systems, networking, and language.
- `/resume/` labels and downloads the ML/AI and DevOps/Cloud resumes.
- `/404.html`, `/rss.xml`, `/robots.txt`, the sitemap, favicon, social metadata, and structured data complete the public surface.
- `/notes` is intentionally omitted from v1.

## Content Contracts

`BlogEntry` contains `title`, `description`, `published`, optional `updated`, `tags`, a category enum, optional image, `draft`, and Markdown or MDX body content.

`ProjectEntry` contains `title`, `summary`, `rank`, `featured`, `period`, `tags`, `repoUrl`, optional `demoUrl`, `collaborative`, `contribution[]`, optional media, and case-study body content.

`CertificationEntry` contains `name`, `issuer`, optional issue and expiry dates, a category enum, optional public verification URL, redacted preview path, `featured`, and `skills[]`.

`SiteConfig` contains identity copy, navigation, Cairo location, public email, GitHub and LinkedIn links, education, experience, grouped skills, and two resume records.

Production collection queries exclude drafts. Related posts score `+2` for a matching category and `+1` for each shared tag, use publication date as the tie-breaker, and return three entries. Previous and next navigation follows publication order.

## Verified Content

The profile narrative comes from the existing `DevOps.tex` and `ML&AI_resume.tex` source documents without rewriting those resumes. The site publishes five case studies in this order:

1. End-to-End DevOps Pipeline
2. Smart Attendance System
3. FIFA Career Mode AI Assistant
4. Warsha Hub
5. Road to My Own Shell

Every collaborative case study visually separates the project's overall capabilities from Abdulrahman's verified personal contribution. Any metrics are attributed as project-reported results. When project media is unavailable, a code-native architecture diagram represents only verified components and flows; it never simulates a screenshot or result.

The initial article set is:

1. “From Terraform to GitOps: Building an End-to-End Kubernetes Delivery Pipeline”
2. “Designing a Real-Time Multi-Model Smart Attendance Pipeline”
3. “Building a Unix Shell in Stages: Femto to Micro”

## Credential Safety

Only technical credentials and the Duolingo English Test appear in the website. Previews are normalized WebP files produced from the original certificates. Birth dates and private student, candidate, registration, membership, phone, and identity data are visibly redacted before previews enter `public/`.

Exam reports, transcripts, IEEE cards, and PLEDGE identity documents are excluded. Unknown credential dates remain absent. Public verification links are used only when present in the source credential.

## Visual System

“Systems Console” uses a deep navy canvas with a fine engineering grid, cyan as the primary interactive and informational accent, and restrained amber for operational highlights. Strong sans-serif display typography establishes hierarchy; monospace labels carry status, metadata, commands, and technical wayfinding.

Cards use thin borders, deliberate spacing, and compact evidence modules rather than ornamental glass effects. The design is dark-only and responsive at 390×844, 768×1024, and 1440×900. Motion is brief and purposeful, with a complete reduced-motion fallback. Focus styles remain strongly visible against every surface.

## Accessibility and Quality

The document structure uses semantic landmarks, one descriptive `h1` per page, skip navigation, labeled mobile navigation controls, keyboard-safe interactions, sufficient color contrast, meaningful alternative text, and responsive overflow handling for code blocks and tables.

Vitest covers content helpers, slugs, reading time, production draft filtering, sorting, and related-post ranking. Playwright and axe cover every route family, mobile navigation, keyboard behavior, visible focus, internal links, metadata, certificate previews, and resume downloads. `astro check`, ESLint, Prettier, production build, and browser tests run in CI.

## Delivery

Pull requests run checks on Node 24. Deployment runs only from `main` or manual dispatch using `withastro/action` followed by the official GitHub Pages deployment action and environments permissions.

Publishing remains a separate owner action: rename the repository to `abdulrahman-111.github.io`, make it public, choose GitHub Actions as the Pages source, then verify the homepage, canonical URLs, sitemap, RSS, and asset paths. This implementation does not mutate those remote settings.

