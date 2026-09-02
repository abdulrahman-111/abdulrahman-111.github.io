import { describe, expect, it } from 'vitest';
import { getReadingTime } from '../../src/lib/reading-time';

describe('getReadingTime', () => {
  it('rounds a 201-word article up to two minutes', () => {
    expect(getReadingTime(Array.from({ length: 201 }, () => 'word').join(' '))).toBe(2);
  });

  it('returns zero for empty content', () => {
    expect(getReadingTime('   ')).toBe(0);
  });
});
