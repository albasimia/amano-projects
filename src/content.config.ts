import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { createContentAssetUrl } from "albasimia-ssg-core/content-assets";

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

const contentAssetPath = z.string().trim().min(1).refine((value) => {
  const segments = value.split("/");
  return !value.startsWith("/")
    && !value.includes("\\")
    && segments.every((segment) => segment !== "" && segment !== "." && segment !== "..")
    && /\.(?:avif|gif|jpe?g|png|webp)$/i.test(value);
}, "Contentのassets/からの安全な画像相対パスを指定してください");

const projects = defineCollection({
  loader: glob({ pattern: "*/index.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string().trim().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    summary: z.string().trim().min(1),
    origin: z.string().trim().min(1),
    intention: z.string().trim().min(1),
    status: projectStatus,
    projectType: z.enum(["client", "personal"]).default("personal"),
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
    heroImage: z.object({
      asset: contentAssetPath,
      alt: z.string().trim().min(1),
      position: z.string().trim().min(1).optional(),
    }).optional(),
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    relatedProjects: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).default([]),
    organization: z.string().trim().min(1).optional(),
    clientFeatured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }).transform((project) => ({
    ...project,
    heroImage: project.heroImage ? {
      ...project.heroImage,
      src: createContentAssetUrl("/images/projects", project.slug, project.heroImage.asset),
    } : undefined,
  })),
});

const companies = defineCollection({
  loader: glob({ pattern: "*/index.{md,mdx}", base: "./src/content/companies" }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    number: z.string().regex(/^\d{2}$/),
    company: z.string().trim().min(1),
    shortName: z.string().trim().min(1),
    label: z.string().trim().min(1),
    period: z.string().trim().min(1),
    summary: z.string().trim().min(1),
    areas: z.array(z.string().trim().min(1)).min(1),
    works: z.array(z.object({
      title: z.string().trim().min(1),
      description: z.string().trim().min(1).optional(),
      project: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    })).default([]),
    order: z.number().int().nonnegative(),
  }),
});

export const collections = { projects, companies };
