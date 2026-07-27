import type { APIRoute } from "astro";
import { createSitemapXml } from "albasimia-ssg-core/sitemap";
import { getPublishedProjects } from "../lib/projects";
import { site } from "../site.js";

export const GET: APIRoute = async () => {
  const projects = await getPublishedProjects();
  const urls = [
    "/",
    "/projects/",
    "/about/",
    "/philosophy/",
    "/experience/",
    ...projects.map(({ data }) => `/projects/${data.slug}/`),
  ].map((pathname) => new URL(pathname, site.siteUrl));

  return new Response(createSitemapXml(urls), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
