import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const digests = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/digests' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    sources: z.array(z.object({
      name: z.string(),
      url: z.string(),
    })).optional(),
  }),
});

export const collections = { digests };
