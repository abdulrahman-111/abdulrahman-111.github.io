import { describe, expect, it } from 'vitest';
import { siteConfig } from '../../src/data/site';

describe('siteConfig', () => {
  it('publishes the approved identity without a phone number', () => {
    expect(siteConfig.tagline).toBe(
      'I build intelligent systems—and the infrastructure behind them.',
    );
    expect(siteConfig.url).toBe('https://abdulrahman-111.github.io');
    expect(siteConfig.email).toBe('abdulrahman.gomaa.h05@gmail.com');
    expect(siteConfig.social.github).toBe('https://github.com/abdulrahman-111');
    expect(siteConfig.resumes.map(({ href }) => href)).toEqual([
      '/resume/ml-ai-resume.pdf',
      '/resume/devops-cloud-resume.pdf',
    ]);
    expect(JSON.stringify(siteConfig)).not.toMatch(/phone/i);
  });
});
