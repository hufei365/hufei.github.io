import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    slug: z.string().optional(),
    sourceIssue: z.number().int().positive().optional(),
    sourceUrl: z.string().url().optional(),
    sourceHash: z.string().regex(/^[a-f0-9]{64}$/).optional(),
  }),
});

export const collections = { blog };
