# Static Portfolio Redesign Design

## Summary

Redesign Abdulrahman Gomaa Hassan's Astro portfolio around two complementary references without copying their assets or implementation. Brittany Chiang v4 supplies the dark navy and mint color language, spacious typography, numbered section labels, and focused contact presentation. Kent C. Dodds' current site supplies the simple content hierarchy, restrained staged motion, approachable rounded controls, and useful blog discovery patterns.

The result remains a fully static Astro 6 site deployed to GitHub Pages. It adds small, framework-free client scripts only for progressive enhancement. It introduces no backend, database, authentication, analytics, cookies, newsletter service, comments, favorites, read tracking, or semantic search.

## Goals

- Make the portfolio feel calmer, simpler, and more personal while preserving its recruiter-first technical evidence.
- Establish a coherent navy, slate, and mint visual system inspired by Brittany Chiang v4.
- Use restrained animation patterns inspired by Kent C. Dodds: staged hero reveals, subtle hover movement, and short state transitions.
- Give the seven-post blog useful static-site discovery features.
- Preserve accessibility, fast static delivery, existing content, canonical URLs, RSS, structured data, résumé files, and certificate redaction.
- Keep the codebase Astro-native, small, and maintainable.

## Non-goals

- Reproducing either reference site exactly.
- Reusing their illustrations, logos, fonts, copy, or other branded assets.
- Adopting React, React Router, Tailwind, Cloudflare Workers, or another frontend framework.
- Implementing server-dependent popularity sorting, recommendations, accounts, favorites, read status, comments, subscriptions, or AI search.
- Adding a light theme in this iteration. The launch remains dark-only.
- Rewriting project, résumé, certification, or article content beyond labels needed by the interface.

## Visual System

The canvas uses `#0a192f`, raised surfaces use `#112240`, primary headings use `#ccd6f6`, body text uses `#8892b0`, and the primary accent uses `#64ffda`. Additional slate shades may be derived for borders and subdued copy, but cyan and amber are removed as competing accents. Mint is also the visible focus color.

Typography remains project-owned and system-based. Large sans-serif headings carry the main hierarchy. Monospace is limited to numbered section labels, metadata, tags, code, and small technical details. Content width becomes narrower and whitespace increases. Corners remain modest, with rounded pills reserved for search, tags, and compact controls.

The current engineering grid background, dense console treatment, hard card borders, and status strip are removed. Technical credibility comes from content and structure rather than a dashboard metaphor.

## Global Layout

The header becomes a compact, sticky navigation bar with a small `AG` mark, the existing primary page links, and a mint-outlined résumé action. It uses a translucent navy background and blur after scrolling. Mobile navigation keeps its accessible button, Escape behavior, and keyboard support, but opens with a short fade and vertical slide.

Desktop viewports receive two quiet fixed rails: social links on the left and the public email address on the right. These disappear on smaller screens, where the same links remain available in the footer and contact section. The rails are decorative navigation aids, not required to complete any task.

The footer becomes shorter: identity, key social links, RSS, and a clear statement that the site is built with Astro and deployed on GitHub Pages.

## Homepage

The homepage becomes a spacious narrative rather than a console dashboard:

1. A near-viewport hero with a small introduction, the existing message "I build intelligent systems—and the infrastructure behind them," a short supporting paragraph, and two actions for projects and résumé selection.
2. A concise about/focus section describing the connection between ML systems, delivery infrastructure, and Linux foundations.
3. Selected projects, preserving the verified order and contribution boundaries.
4. Latest writing, including one visually prominent featured article and two supporting posts.
5. A compact credential preview linking to the full certifications page.
6. A centered contact section inspired by Brittany Chiang's v4 composition, using Abdulrahman's own copy and email.

Numbered labels such as `01. About`, `02. Selected Work`, and `03. Writing` create continuity without turning the homepage into a one-page replacement for the existing detail routes.

## Blog Index

The blog index remains pre-rendered with every article visible in its HTML. Progressive enhancement adds:

- A client-side search field matching title, description, category, and tags.
- A result count and accessible no-results message.
- Sorting by newest, oldest, shortest reading time, and longest reading time.
- Topic chips that continue to link to existing static tag and category pages.
- A featured article selected through an optional `featured` frontmatter field. The Terraform-to-GitOps article is featured for launch because it best represents the portfolio's combined ML systems and infrastructure positioning.
- Card and compact-list views, controlled by a small toggle.
- Copy-link actions on article cards with a two-second `Copied` status.
- Query parameters for search, sort, and view so enhanced states are shareable.

Without JavaScript, the page shows the normal newest-first list and the existing static category and tag links work. Search, sort, view switching, and clipboard feedback are enhancements, not prerequisites for accessing content.

Popularity sorting is omitted because the site has no tracking data. Pagination and load-more behavior are omitted because seven posts do not justify them.

## Article Pages

Article pages retain their current content and routes while receiving a calmer reading layout. Each page includes:

- A back-to-blog link.
- Category, publication date, optional update date, and reading time.
- An optional original Medium link.
- A copy-link button with an accessible live status.
- Optional responsive article media.
- A sticky table of contents on wide screens and a normal in-flow table on narrow screens.
- Existing previous/next navigation and related-post ranking.
- A short visible author block linking to the About page.
- An "Edit on GitHub" link targeting the article's source file.
- A final contact prompt relevant to engineering discussion.

Code blocks, inline code, tables, blockquotes, lists, and long URLs must remain readable without horizontal page overflow. Code blocks may scroll internally.

## Components and Data Flow

Astro continues to load blog and project collections at build time. The blog schema gains only `featured?: boolean`. Reading time stays derived from article bodies.

The blog index renders searchable values and reading minutes as safe `data-*` attributes on each article element. A small module script reads those attributes, applies search and sorting in the browser, updates query parameters with `history.replaceState`, and announces result-count changes through an `aria-live` region. No content is fetched at runtime.

Reusable additions are limited to clear responsibilities:

- `SocialRail.astro`: desktop social and email rails.
- `BlogControls.astro`: accessible text search, sort, and view controls.
- `CopyLinkButton.astro`: reusable clipboard action and fallback.
- `AuthorCard.astro`: visible article author summary.
- `Reveal.astro` or a global `data-reveal` convention: progressive section motion.

Existing `PostCard`, `ArticleLayout`, `SiteHeader`, `SiteFooter`, `BaseLayout`, and page styles are updated rather than duplicated.

## Motion

Motion communicates hierarchy and state, not decoration:

- Hero label, title, paragraph, and actions reveal in a short stagger on initial load.
- Major sections fade upward once when they enter the viewport.
- Cards rise no more than `4px` on hover or keyboard focus.
- Button arrows translate a few pixels on interaction.
- Copy buttons crossfade between copy and success states.
- Mobile navigation fades and slides over `200–250ms`.

Durations remain between `150ms` and `700ms`. No parallax, cursor follower, continuous looping animation, or heavy animation dependency is added. When `prefers-reduced-motion: reduce` is active, transforms and staged motion are disabled and all content remains visible.

For progressive reveal, content is visible by default. The document receives a JavaScript-enabled class before reveal styles may hide pending elements; failure to load the enhancement therefore cannot hide content.

## Accessibility and Resilience

- Preserve skip navigation, semantic headings, landmarks, keyboard operation, and visible focus.
- Search has an explicit label and result status.
- View controls expose pressed state; sort uses a native `select`.
- Clipboard status uses a polite live region and never relies on color alone.
- Motion respects reduced-motion preferences.
- Fixed desktop rails never cover content and disappear before space becomes constrained.
- All enhanced controls have a usable static fallback.
- External links retain clear labels and safe `rel` attributes.

## Testing

Unit tests cover featured-post selection, reading-time sort order, search matching, and stable query-state helpers. Browser tests cover search, sort, view switching, copy feedback, query-state restoration, mobile navigation, keyboard access, reduced motion, responsive rails, article utilities, internal links, and no-JavaScript content availability.

Existing axe checks continue across every route family. Visual QA targets `390×844`, `768×1024`, and `1440×900`, including article code blocks and long content. Delivery gates remain formatting, lint, Astro checks, unit tests, Playwright tests, production build, GitHub Actions, and live Pages verification.

## Rollout and Completion Criteria

Implementation occurs on a dedicated `codex/` branch and reaches production through a reviewed pull request. The redesign is complete when:

- All current routes and seven posts remain available.
- Visual tokens, homepage, navigation, cards, contact section, blog index, and article layout match this design.
- Search, sorting, view switching, copy-link feedback, and motion work without backend services.
- Static fallbacks, reduced motion, accessibility, responsive behavior, metadata, RSS, sitemap, résumé downloads, and certificate previews pass automated and live verification.
- GitHub Pages deploys the merged production build successfully.
