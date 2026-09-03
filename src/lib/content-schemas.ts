import { z } from 'astro/zod';

export const blogCategories = ['devops', 'ml-systems', 'systems-programming'] as const;
export const certificationCategories = [
  'professional',
  'ml-ai',
  'cloud-devops',
  'programming-systems',
  'networking',
  'language',
] as const;

export const blogSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  published: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string().trim().min(1)).min(1),
  category: z.enum(blogCategories),
  image: z.string().url().optional(),
  draft: z.boolean(),
});

export const projectSchema = z
  .object({
    title: z.string().trim().min(1),
    summary: z.string().trim().min(1),
    rank: z.number().int().positive(),
    featured: z.boolean(),
    period: z.string().trim().min(1),
    tags: z.array(z.string().trim().min(1)).min(1),
    repoUrl: z.string().url(),
    demoUrl: z.string().url().optional(),
    collaborative: z.boolean(),
    contribution: z.array(z.string().trim().min(1)),
    image: z.string().url().optional(),
  })
  .superRefine((project, context) => {
    if (project.collaborative && project.contribution.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Collaborative projects require at least one contribution.',
        path: ['contribution'],
      });
    }
  });

export const certificationSchema = z.object({
  name: z.string().trim().min(1),
  issuer: z.string().trim().min(1),
  issued: z.coerce.date().optional(),
  expires: z.coerce.date().optional(),
  category: z.enum(certificationCategories),
  verificationUrl: z.string().url().optional(),
  previewPath: z.string().trim().min(1),
  featured: z.boolean(),
  skills: z.array(z.string().trim().min(1)).min(1),
});
