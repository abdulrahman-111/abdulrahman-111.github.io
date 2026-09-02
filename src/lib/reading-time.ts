const WORDS_PER_MINUTE = 200;

export function getReadingTime(markdown: string): number {
  const content = markdown.trim();

  if (!content) {
    return 0;
  }

  return Math.ceil(content.split(/\s+/).length / WORDS_PER_MINUTE);
}
