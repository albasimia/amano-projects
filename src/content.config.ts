import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projectStatus = z.enum([
  "observation",
  "concept",
  "development",
  "verification",
  "operation",
  "paused",
  "completed",
]);

const projectInterface = z.enum([
  "creative",
  "engineering",
  "creative-to-engineering",
]);

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string().trim().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    summary: z.string().trim().min(1),
    origin: z.string().trim().min(1),
    intention: z.string().trim().min(1),
    status: projectStatus,
    interfaces: z.array(projectInterface).min(1),
    fields: z.array(z.string().trim().min(1)).min(1),
    technologies: z.array(z.string().trim().min(1)).default([]),
    roles: z.array(z.string().trim().min(1)).default([]),
    featured: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    startedAt: z.string().trim().min(1).optional(),
    endedAt: z.string().trim().min(1).optional(),
    repositoryUrl: z.url().optional(),
    websiteUrl: z.url().optional(),
    heroImage: z.string().trim().min(1).optional(),
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    relatedProjects: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
