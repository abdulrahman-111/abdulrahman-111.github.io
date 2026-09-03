import { describe, expect, it } from 'vitest';
import { getPublishedEntries, slugify, sortByPublishedDesc } from '../../src/lib/content';

const entries = [
  { id: 'old', data: { draft: false, published: new Date('2024-01-01') } },
  { id: 'draft', data: { draft: true, published: new Date('2025-01-01') } },
  { id: 'new', data: { draft: false, published: new Date('2024-06-01') } },
];

describe('content utilities', () => {
  it('excludes drafts in production and sorts newest first', () => {
    const result = getPublishedEntries(entries, true);

    expect(result.map((entry) => entry.id)).toEqual(['new', 'old']);
  });

  it('keeps drafts outside production while retaining published order', () => {
    const result = getPublishedEntries(entries, false);

    expect(result.map((entry) => entry.id)).toEqual(['draft', 'new', 'old']);
  });

  it('sorts a copy by descending publication date', () => {
    const input = [entries[0]!, entries[2]!];

    expect(sortByPublishedDesc(input).map((entry) => entry.id)).toEqual(['new', 'old']);
    expect(input.map((entry) => entry.id)).toEqual(['old', 'new']);
  });

  it('normalizes titles into URL-safe slugs', () => {
    expect(slugify('  ML & AI — Systems: An Overview!  ')).toBe('ml-and-ai-systems-an-overview');
  });

  it('keeps C and C++ tag routes distinct', () => {
    expect(slugify('C')).toBe('c');
    expect(slugify('C++')).toBe('c-plus-plus');
  });
});
