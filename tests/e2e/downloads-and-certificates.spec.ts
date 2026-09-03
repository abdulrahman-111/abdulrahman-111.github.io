import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';
import { certificationSchema } from '../../src/lib/content-schemas';

const resumePaths = ['/resume/devops-cloud-resume.pdf', '/resume/ml-ai-resume.pdf'] as const;
const certificatePreviewPaths = [
  '/certificates/aws-ai-practitioner-challenge.webp',
  '/certificates/aws-certified-cloud-practitioner.webp',
  '/certificates/duolingo-english-test.webp',
  '/certificates/mcit-python.webp',
  '/certificates/nti-natural-language-processing.webp',
  '/certificates/aws-academy-cloud-foundations.webp',
  '/certificates/nti-cloud-architect.webp',
  '/certificates/nvidia-deep-learning.webp',
  '/certificates/nti-network-essentials.webp',
  '/certificates/cisco-networking-essentials.webp',
  '/certificates/microsoft-azure-cloud-concepts.webp',
  '/certificates/sprints-devops-foundations.webp',
  '/certificates/udemy-docker.webp',
  '/certificates/udemy-system-programming-linux.webp',
  '/certificates/kodekloud-helm.webp',
  '/certificates/kodekloud-kubernetes.webp',
] as const;

test('resume downloads and redacted previews are served', async ({ request }) => {
  for (const path of resumePaths) {
    const response = await request.get(path);
    expect(response.ok(), `${path} should be served`).toBeTruthy();
    expect(response.headers()['content-type']).toContain('application/pdf');
  }
  for (const path of certificatePreviewPaths) {
    const response = await request.get(path);
    expect(response.ok(), `${path} should be served`).toBeTruthy();
    expect(response.headers()['content-type']).toContain('image/webp');
  }
});

test('certification metadata is schema-valid and uses each allowlisted preview once', async () => {
  const metadata = JSON.parse(
    await readFile(resolve(process.cwd(), 'src/data/certifications.json'), 'utf8'),
  ) as unknown;
  expect(Array.isArray(metadata)).toBe(true);
  if (!Array.isArray(metadata)) return;
  expect(metadata).toHaveLength(certificatePreviewPaths.length);
  for (const entry of metadata) expect(certificationSchema.safeParse(entry).success).toBe(true);
  const previewPaths = metadata.map((entry) => (entry as { previewPath?: unknown }).previewPath);
  expect(new Set(previewPaths).size).toBe(certificatePreviewPaths.length);
  expect([...previewPaths].sort()).toEqual([...certificatePreviewPaths].sort());
});
