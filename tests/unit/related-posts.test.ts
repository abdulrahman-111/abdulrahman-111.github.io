import { describe, expect, it } from 'vitest';
import { getPostNeighbors, getRelatedPosts } from '../../src/lib/related-posts';

const current = {
  id: 'current',
  data: {
    category: 'devops',
    tags: ['kubernetes', 'gitops'],
    published: new Date('2024-06-01'),
  },
};

const candidates = [
  {
    id: 'same-category-and-tag',
    data: {
      category: 'devops',
      tags: ['kubernetes'],
      published: new Date('2024-01-01'),
    },
  },
  {
    id: 'same-category',
    data: {
      category: 'devops',
      tags: ['terraform'],
      published: new Date('2024-05-01'),
    },
  },
  {
    id: 'shared-tag',
    data: {
      category: 'ml-systems',
      tags: ['gitops'],
      published: new Date('2024-05-15'),
    },
  },
  {
    id: 'unrelated',
    data: {
      category: 'systems-programming',
      tags: ['shell'],
      published: new Date('2024-06-15'),
    },
  },
];

describe('related posts', () => {
  it('ranks category matches at two points and shared tags at one point', () => {
    expect(getRelatedPosts(current, candidates).map((post) => post.id)).toEqual([
      'same-category-and-tag',
      'same-category',
      'shared-tag',
    ]);
  });

  it('uses newer publication dates to break score ties and honors the limit', () => {
    const result = getRelatedPosts(
      current,
      [
        {
          id: 'older-category-match',
          data: {
            category: 'devops',
            tags: ['terraform'],
            published: new Date('2024-01-01'),
          },
        },
        {
          id: 'newer-category-match',
          data: {
            category: 'devops',
            tags: ['terraform'],
            published: new Date('2024-05-01'),
          },
        },
      ],
      1,
    );

    expect(result.map((post) => post.id)).toEqual(['newer-category-match']);
  });

  it('returns adjacent entries from newest-first publication order', () => {
    const ordered = [
      { id: 'newer', data: { published: new Date('2024-08-01') } },
      current,
      { id: 'older', data: { published: new Date('2024-04-01') } },
    ];

    expect(getPostNeighbors(current, ordered)).toMatchObject({
      previous: { id: 'newer' },
      next: { id: 'older' },
    });
  });
});
