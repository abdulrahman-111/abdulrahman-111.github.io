import { describe, expect, it } from 'vitest';
import {
  matchesBlogQuery,
  sortBlogItems,
  type BlogDiscoveryItem,
} from '../../src/lib/blog-discovery';

const posts: BlogDiscoveryItem[] = [
  {
    id: 'gitops',
    title: 'From Terraform to GitOps',
    description: 'Kubernetes delivery pipeline',
    category: 'devops',
    tags: ['Terraform', 'Kubernetes'],
    published: 2,
    readingMinutes: 8,
  },
  {
    id: 'shell',
    title: 'Building a Unix Shell',
    description: 'Processes and file descriptors',
    category: 'systems-programming',
    tags: ['C', 'Linux'],
    published: 1,
    readingMinutes: 5,
  },
];

describe('blog discovery', () => {
  it('matches every normalized query token across searchable fields', () => {
    expect(matchesBlogQuery(posts[0]!, 'kubernetes DEVOPS')).toBe(true);
    expect(matchesBlogQuery(posts[0]!, 'kubernetes shell')).toBe(false);
  });

  it('returns a sorted copy for every supported order', () => {
    expect(sortBlogItems(posts, 'newest').map(({ id }) => id)).toEqual(['gitops', 'shell']);
    expect(sortBlogItems(posts, 'oldest').map(({ id }) => id)).toEqual(['shell', 'gitops']);
    expect(sortBlogItems(posts, 'shortest').map(({ id }) => id)).toEqual(['shell', 'gitops']);
    expect(sortBlogItems(posts, 'longest').map(({ id }) => id)).toEqual(['gitops', 'shell']);
    expect(posts.map(({ id }) => id)).toEqual(['gitops', 'shell']);
  });
});
