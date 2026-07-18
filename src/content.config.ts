import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    role: z.string().optional(),
    team: z.string().optional(),
    time: z.string().optional(),
    deliverable: z.string().optional(),
    tools: z.string().optional(),
    blurb: z.string().optional(),
    tagline: z.string().optional(),
    overview: z.string().optional(),
    emoji: z.string().optional(),
    laptopMockup: z.string().optional(),
    lightColor: z.string().optional(),
    pageBackgroundColor: z.string().optional(),
    darkColor: z.string().optional(),
    order: z.number().optional(),
    draft: z.boolean().optional(),
    archived: z.boolean().optional(),
    publishedOn: z.string().optional(),
  }),
});

export const collections = { 'case-studies': caseStudies };