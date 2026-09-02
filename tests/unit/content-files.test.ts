import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const approvedProjects = [
  {
    id: 'end-to-end-devops-pipeline',
    title: 'End-to-End DevOps Pipeline',
    rank: 1,
  },
  {
    id: 'smart-attendance-system',
    title: 'Smart Attendance System',
    rank: 2,
  },
  {
    id: 'fifa-career-mode-ai-assistant',
    title: 'FIFA Career Mode AI Assistant',
    rank: 3,
  },
  { id: 'warsha-hub', title: 'Warsha Hub', rank: 4 },
  { id: 'road-to-my-own-shell', title: 'Road to My Own Shell', rank: 5 },
] as const;

const approvedArticles = [
  {
    id: 'from-terraform-to-gitops',
    title: 'From Terraform to GitOps: Designing Clear Delivery Boundaries',
  },
  {
    id: 'designing-a-real-time-multi-model-smart-attendance-pipeline',
    title: 'Designing a Real-Time Multi-Model Smart Attendance Pipeline',
  },
  {
    id: 'building-a-unix-shell-in-stages',
    title: 'Building a Unix Shell in Stages',
  },
] as const;

async function readCollectionFiles(directory: string) {
  try {
    return (await readdir(directory)).filter((file) => /\.mdx?$/.test(file)).sort();
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

function readOpeningFrontmatter(source: string, file: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

  if (!match?.[1]) {
    throw new Error(`${file} does not have a delimited opening frontmatter block.`);
  }

  return match[1];
}

function readScalar(frontmatter: string, key: string, file: string) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'));

  if (!match?.[1]) {
    throw new Error(`${file} is missing the ${key} frontmatter field.`);
  }

  const value = match[1];
  const hasMatchingQuotes =
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"));

  return hasMatchingQuotes ? value.slice(1, -1) : value;
}

function readBoolean(frontmatter: string, key: string, file: string) {
  const value = readScalar(frontmatter, key, file);

  if (value !== 'true' && value !== 'false') {
    throw new Error(`${file} has a non-boolean ${key} frontmatter field.`);
  }

  return value === 'true';
}

describe('content inventory', () => {
  it('reads publication state only from the delimited opening frontmatter', () => {
    const source = `---
title: Example article
draft: true
---

This body example must not change publication state:

draft: false
`;
    const frontmatter = readOpeningFrontmatter(source, 'example.mdx');

    expect(readBoolean(frontmatter, 'draft', 'example.mdx')).toBe(true);
  });

  it('contains the exact approved IDs, project order, and publishable article titles', async () => {
    const contentRoot = join(process.cwd(), 'src/content');
    const projectsRoot = join(contentRoot, 'projects');
    const articlesRoot = join(contentRoot, 'blog');
    const projectFiles = await readCollectionFiles(projectsRoot);
    const articleFiles = await readCollectionFiles(articlesRoot);

    expect(projectFiles).toEqual(approvedProjects.map((project) => `${project.id}.mdx`).sort());
    expect(articleFiles).toEqual(approvedArticles.map((article) => `${article.id}.mdx`).sort());

    const projects = await Promise.all(
      approvedProjects.map(async ({ id }) => {
        const file = `${id}.mdx`;
        const source = await readFile(join(projectsRoot, file), 'utf8');
        const frontmatter = readOpeningFrontmatter(source, file);

        return {
          title: readScalar(frontmatter, 'title', file),
          rank: Number(readScalar(frontmatter, 'rank', file)),
        };
      }),
    );
    const articles = await Promise.all(
      approvedArticles.map(async ({ id }) => {
        const file = `${id}.mdx`;
        const source = await readFile(join(articlesRoot, file), 'utf8');
        const frontmatter = readOpeningFrontmatter(source, file);

        return {
          title: readScalar(frontmatter, 'title', file),
          draft: readBoolean(frontmatter, 'draft', file),
        };
      }),
    );

    expect(projects.sort((a, b) => a.rank - b.rank)).toEqual(
      approvedProjects.map(({ title, rank }) => ({ title, rank })),
    );
    expect(articles.map(({ title }) => title)).toEqual(approvedArticles.map(({ title }) => title));
    expect(articles.map(({ draft }) => draft)).toEqual([false, false, false]);
  });
});
