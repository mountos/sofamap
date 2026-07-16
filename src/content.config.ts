import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.date(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    heroImage: z.string().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};
