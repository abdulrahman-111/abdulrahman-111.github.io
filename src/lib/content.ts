export interface PublishableEntry {
  data: {
    draft?: boolean;
    published: Date;
  };
}

export function sortByPublishedDesc<T extends PublishableEntry>(entries: readonly T[]): T[] {
  return [...entries].sort(
    (first, second) => second.data.published.getTime() - first.data.published.getTime(),
  );
}

export function getPublishedEntries<T extends PublishableEntry>(
  entries: readonly T[],
  isProduction: boolean,
): T[] {
  return sortByPublishedDesc(entries.filter((entry) => !isProduction || !entry.data.draft));
}

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
