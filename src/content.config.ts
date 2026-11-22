import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

/** A label paired with a value — used by the about facts and the "now" list. */
const pairSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const site = defineCollection({
  loader: file('./src/content/site/site.json'),
  schema: z.object({
    name: z.string(),
    titleLine: z.string(),
    location: z.string(),
    hero: z.object({
      eyebrow: z.string(),
      intro: z.string(),
      status: z.string(),
      photoAlt: z.string(),
      photoCaption: z.string(),
    }),
    roles: z.array(z.string()),
    links: z.object({
      github: z.string(),
      linkedin: z.string(),
      email: z.string(),
      phone: z.string(),
    }),
    codingProfiles: z.array(linkSchema),
    resumes: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
        meta: z.string(),
      }),
    ),
    seo: z.object({
      description: z.string(),
    }),
    about: z.object({
      heading: z.string(),
      body: z.array(z.string()),
      facts: z.array(pairSchema),
    }),
    skills: z.object({
      intro: z.string(),
      groups: z.array(
        z.object({
          label: z.string(),
          items: z.array(z.string()),
        }),
      ),
    }),
    timeline: z.array(
      z.object({
        year: z.string(),
        tag: z.string(),
        title: z.string(),
        detail: z.string(),
      }),
    ),
    now: z.object({
      intro: z.string(),
      updated: z.string(),
      items: z.array(pairSchema),
    }),
    contact: z.object({
      heading: z.string(),
      intro: z.string(),
      note: z.string(),
      subject: z.string(),
      /** Web3Forms access key. Anything starting with "ADD-" leaves the form disabled. */
      accessKey: z.string(),
    }),
    gallery: z.object({
      heading: z.string(),
      intro: z.string(),
      photos: z.array(
        z.object({
          file: z.enum(['bottom-1', 'bottom-2']),
          alt: z.string(),
          caption: z.string(),
        }),
      ),
    }),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    domain: z.enum(['Web / SDE', 'AI / ML']),
    year: z.coerce.string(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    role: z.string(),
    timeframe: z.coerce.string(),
    stack: z.array(z.string()),
    links: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
        note: z.string().optional(),
      }),
    ),
  }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { site, projects, blog };
