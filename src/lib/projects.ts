import { getCollection, type CollectionEntry } from "astro:content";

export type ProjectEntry = CollectionEntry<"projects">;
export type ProjectStatus = ProjectEntry["data"]["status"];
export type ProjectInterface = ProjectEntry["data"]["interfaces"][number];

export const statusLabels: Record<ProjectStatus, string> = {
  observation: "観測",
  concept: "構想",
  development: "制作中",
  verification: "検証中",
  operation: "運用中",
  paused: "休止中",
  completed: "完了",
};

export const interfaceLabels: Record<ProjectInterface, string> = {
  creative: "Creative",
  engineering: "Engineering",
  "creative-to-engineering": "Creative → Engineering",
};

export async function getPublishedProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  const slugs = new Set<string>();

  for (const project of projects) {
    if (slugs.has(project.data.slug)) {
      throw new Error(`Project slug「${project.data.slug}」が重複しています`);
    }
    slugs.add(project.data.slug);
  }

  for (const project of projects) {
    for (const relatedSlug of project.data.relatedProjects) {
      if (!slugs.has(relatedSlug)) {
        throw new Error(`Project「${project.data.slug}」の関連Project「${relatedSlug}」が存在しません`);
      }
    }
  }

  return projects.sort((a, b) => a.data.order - b.data.order);
}

export function projectPeriod(project: ProjectEntry): string | undefined {
  const { startedAt, endedAt } = project.data;
  if (!startedAt) return undefined;
  return endedAt ? `${startedAt}–${endedAt}` : `${startedAt}–`;
}
