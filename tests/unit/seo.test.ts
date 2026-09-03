import { describe, expect, it } from 'vitest';
import { buildCanonical } from '../../src/lib/seo';

describe('buildCanonical', () => {
  it('uses the configured site origin and a trailing slash', () => {
    expect(buildCanonical('projects/end-to-end-devops-pipeline')).toBe(
      'https://abdulrahman-111.github.io/projects/end-to-end-devops-pipeline/',
    );
  });

  it('preserves the canonical root URL', () => {
    expect(buildCanonical('/')).toBe('https://abdulrahman-111.github.io/');
  });
});
