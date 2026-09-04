export type BlogSort = 'newest' | 'oldest' | 'shortest' | 'longest';

export interface BlogDiscoveryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  published: number;
  readingMinutes: number;
}

const normalize = (value: string) => value.trim().toLocaleLowerCase('en-US');

export function matchesBlogQuery(item: BlogDiscoveryItem, query: string): boolean {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const searchable = normalize(
    [item.title, item.description, item.category, ...item.tags].join(' '),
  );
  return tokens.every((token) => searchable.includes(token));
}

export function sortBlogItems<T extends BlogDiscoveryItem>(items: T[], sort: BlogSort): T[] {
  const direction = sort === 'oldest' || sort === 'shortest' ? 1 : -1;
  const field = sort === 'newest' || sort === 'oldest' ? 'published' : 'readingMinutes';
  return [...items].sort((left, right) => {
    const difference = (left[field] - right[field]) * direction;
    return difference || left.id.localeCompare(right.id);
  });
}
