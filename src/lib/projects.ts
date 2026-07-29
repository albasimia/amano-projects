import { getCollection, type CollectionEntry } from "astro:content";

export type ProjectEntry = CollectionEntry<"projects">;
export type ProjectStatus = ProjectEntry["data"]["status"];

export const statusLabels: Record<ProjectStatus, string> = {
  observation: "観測",
  concept: "構想",
  development: "制作中",
  verification: "検証中",
  operation: "運用中",
  paused: "休止中",
  completed: "完了",
};

function projectDateValue(value?: string): number {
  if (!value) return Number.NEGATIVE_INFINITY;

  const match = value.match(/^(\d{4})(?:[.-](\d{1,2}))?(?:[.-](\d{1,2}))?$/);
  if (!match) return Number.NEGATIVE_INFINITY;

  const [, year, month = "0", day = "0"] = match;
  return Number(year) * 10_000 + Number(month) * 100 + Number(day);
}

export function compareProjectsByPeriod(a: ProjectEntry, b: ProjectEntry): number {
  const aOngoing = a.data.status !== "completed" && !a.data.endedAt;
  const bOngoing = b.data.status !== "completed" && !b.data.endedAt;

  if (aOngoing !== bOngoing) return aOngoing ? -1 : 1;

  if (aOngoing && bOngoing) {
    const startedDifference = projectDateValue(b.data.startedAt) - projectDateValue(a.data.startedAt);
    return startedDifference || a.data.slug.localeCompare(b.data.slug);
  }

  const endedDifference = projectDateValue(b.data.endedAt) - projectDateValue(a.data.endedAt);
  if (endedDifference) return endedDifference;

  const startedDifference = projectDateValue(b.data.startedAt) - projectDateValue(a.data.startedAt);
  return startedDifference || a.data.slug.localeCompare(b.data.slug);
}

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

  return projects.sort(compareProjectsByPeriod);
}

export function projectPeriod(project: ProjectEntry): string | undefined {
  const { startedAt, endedAt } = project.data;
  if (startedAt && endedAt) return startedAt === endedAt ? startedAt : `${startedAt}–${endedAt}`;
  if (endedAt) return endedAt;
  return startedAt ? `${startedAt}–` : undefined;
}
