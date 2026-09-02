import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const approvedTitles = [
  'End-to-End DevOps Pipeline',
  'Smart Attendance System',
  'FIFA Career Mode AI Assistant',
  'Warsha Hub',
  'Road to My Own Shell',
];

async function readCollectionFiles(directory: string) {
  try {
    return (await readdir(directory)).filter((file) => /\.mdx?$/.test(file));
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

describe('content inventory', () => {
  it('contains the approved project order and three publishable articles', async () => {
    const contentRoot = join(process.cwd(), 'src/content');
    const projectFiles = await readCollectionFiles(join(contentRoot, 'projects'));
    const postFiles = await readCollectionFiles(join(contentRoot, 'blog'));
    const projects = await Promise.all(
      projectFiles.map(async (file) => {
        const source = await readFile(join(contentRoot, 'projects', file), 'utf8');
        const title = source.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1];
        const rank = Number(source.match(/^rank:\s*(\d+)\s*$/m)?.[1]);

        return { rank, title };
      }),
    );
    const posts = await Promise.all(
      postFiles.map((file) => readFile(join(contentRoot, 'blog', file), 'utf8')),
    );

    expect(projects.sort((a, b) => a.rank - b.rank).map((entry) => entry.title)).toEqual(
      approvedTitles,
    );
    expect(posts.filter((post) => /^draft:\s*false\s*$/m.test(post))).toHaveLength(3);
  });
});
