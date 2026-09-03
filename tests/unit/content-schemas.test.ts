import { describe, expect, it } from 'vitest';
import { blogSchema, certificationSchema, projectSchema } from '../../src/lib/content-schemas';

const validBlog = {
  title: 'Shipping static content safely',
  description: 'A schema-validated content entry.',
  published: '2024-06-01',
  tags: ['astro'],
  category: 'devops',
  draft: false,
};

const validProject = {
  title: 'Static delivery pipeline',
  summary: 'A verified project summary.',
  rank: 1,
  featured: true,
  period: '2024',
  tags: ['kubernetes'],
  repoUrl: 'https://github.com/example/project',
  collaborative: true,
  contribution: ['Implemented the deployment workflow.'],
};

const validCertification = {
  name: 'Cloud Fundamentals',
  issuer: 'Example Issuer',
  issued: '2024-01-01',
  category: 'cloud-devops',
  verificationUrl: 'https://issuer.example/verify/123',
  previewPath: '/certificates/cloud-fundamentals.webp',
  featured: false,
  skills: ['cloud'],
};

describe('content schemas', () => {
  it('accepts a valid blog entry and coerces its publication date', () => {
    const result = blogSchema.safeParse(validBlog);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.published).toBeInstanceOf(Date);
    }
  });

  it('accepts an optional HTTPS source URL for a blog entry', () => {
    const result = blogSchema.safeParse({
      ...validBlog,
      sourceUrl: 'https://medium.com/@agofficial/example-123',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sourceUrl).toBe('https://medium.com/@agofficial/example-123');
    }
  });

  it('rejects a non-HTTPS source URL for a blog entry', () => {
    expect(
      blogSchema.safeParse({
        ...validBlog,
        sourceUrl: 'http://medium.com/@agofficial/example-123',
      }).success,
    ).toBe(false);
  });

  it('rejects a blog entry outside the approved category enum', () => {
    expect(blogSchema.safeParse({ ...validBlog, category: 'frontend' }).success).toBe(false);
  });

  it('accepts a valid collaborative project entry', () => {
    expect(projectSchema.safeParse(validProject).success).toBe(true);
  });

  it('rejects a project with a non-positive rank', () => {
    expect(projectSchema.safeParse({ ...validProject, rank: 0 }).success).toBe(false);
  });

  it('rejects a project repository URL that is not public', () => {
    expect(
      projectSchema.safeParse({ ...validProject, repoUrl: '/projects/pipeline' }).success,
    ).toBe(false);
  });

  it('requires collaborative projects to include a contribution', () => {
    expect(projectSchema.safeParse({ ...validProject, contribution: [] }).success).toBe(false);
  });

  it('accepts a valid certification entry and coerces its issue date', () => {
    const result = certificationSchema.safeParse(validCertification);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.issued).toBeInstanceOf(Date);
    }
  });

  it('rejects a certification entry outside the approved category enum', () => {
    expect(
      certificationSchema.safeParse({
        ...validCertification,
        category: 'identity',
      }).success,
    ).toBe(false);
  });

  it('rejects a certification verification URL that is not public', () => {
    expect(
      certificationSchema.safeParse({
        ...validCertification,
        verificationUrl: 'issuer.example/verify/123',
      }).success,
    ).toBe(false);
  });
});
