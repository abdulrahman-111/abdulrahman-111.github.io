export interface RelatedPostEntry {
  id: string;
  data: {
    category: string;
    tags: readonly string[];
    published: Date;
  };
}

export interface PostNeighbors<T> {
  previous: T | undefined;
  next: T | undefined;
}

function getRelevanceScore(current: RelatedPostEntry, candidate: RelatedPostEntry): number {
  const categoryScore = current.data.category === candidate.data.category ? 2 : 0;
  const candidateTags = new Set(candidate.data.tags);
  const sharedTagCount = [...new Set(current.data.tags)].filter((tag) =>
    candidateTags.has(tag),
  ).length;

  return categoryScore + sharedTagCount;
}

export function getRelatedPosts<T extends RelatedPostEntry>(
  current: T,
  candidates: readonly T[],
  limit = 3,
): T[] {
  return candidates
    .filter((candidate) => candidate.id !== current.id)
    .map((candidate) => ({ candidate, score: getRelevanceScore(current, candidate) }))
    .filter(({ score }) => score > 0)
    .sort(
      (first, second) =>
        second.score - first.score ||
        second.candidate.data.published.getTime() - first.candidate.data.published.getTime(),
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function getPostNeighbors<T extends Pick<RelatedPostEntry, 'id'>>(
  current: T,
  ordered: readonly T[],
): PostNeighbors<T> {
  const currentIndex = ordered.findIndex((entry) => entry.id === current.id);

  if (currentIndex === -1) {
    return { previous: undefined, next: undefined };
  }

  return {
    previous: ordered[currentIndex - 1],
    next: ordered[currentIndex + 1],
  };
}
