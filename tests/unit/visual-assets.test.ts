import { readFile, readdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

const approvedPalette = ['#0a192f', '#112240', '#64ffda', '#8892b0', '#ccd6f6'];
const legacyIdentity = /#07131f|#3dd9e8|#f4b942|color-grid|hero__console|status-strip/gi;
const textExtensions = new Set(['.astro', '.css', '.json', '.md', '.mdx', '.svg', '.ts']);

async function collectTextFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return collectTextFiles(path);
      return textExtensions.has(extname(entry.name)) ? [path] : [];
    }),
  );
  return nested.flat();
}

describe('code-native brand assets', () => {
  it('keeps legacy console colors and motifs out of src and public text assets', async () => {
    const roots = [resolve('src'), resolve('public')];
    const files = (await Promise.all(roots.map(collectTextFiles))).flat();
    const violations: string[] = [];

    for (const file of files) {
      const contents = await readFile(file, 'utf8');
      const matches = contents.match(legacyIdentity);
      if (matches) violations.push(`${file}: ${matches.join(', ')}`);
    }

    expect(violations).toEqual([]);
  });

  it('uses only the approved palette and no grid motif in SVG brand assets', async () => {
    const [favicon, socialCard] = await Promise.all([
      readFile(resolve('public/favicon.svg'), 'utf8'),
      readFile(resolve('public/social-card.svg'), 'utf8'),
    ]);
    const colors = [
      ...favicon.matchAll(/#[0-9a-f]{6}/gi),
      ...socialCard.matchAll(/#[0-9a-f]{6}/gi),
    ].map(([color]) => color.toLowerCase());

    expect(colors.every((color) => approvedPalette.includes(color))).toBe(true);
    expect(new Set(colors)).toEqual(new Set(approvedPalette));
    expect(socialCard).not.toMatch(/grid|pattern/iu);
  });

  it('keeps the WebP social card pixel-identical to the SVG source', async () => {
    const [svg, webp] = await Promise.all([
      sharp(resolve('public/social-card.svg'))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true }),
      sharp(resolve('public/social-card.webp'))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true }),
    ]);

    expect(webp.info).toMatchObject(svg.info);
    expect(webp.data.equals(svg.data)).toBe(true);
  });
});
