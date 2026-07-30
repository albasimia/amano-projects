import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { createContentAssetUrl } from "albasimia-ssg-core/content-assets";
import type { ProjectEntry } from "./projects";

const projectContentRoot = resolve(process.cwd(), "src/content/projects");
const imageExtensions = [".avif", ".webp", ".png", ".jpg", ".jpeg", ".gif"] as const;

export interface ProjectImage {
  src: string;
  alt: string;
  position?: string;
}

export interface ProjectMediaImage extends ProjectImage {
  type: "image";
  kind: string;
  label: string;
}

export function getProjectImages(project: ProjectEntry): ProjectMediaImage[] {
  return Object.entries(project.data.images).flatMap(([kind, visible]) => {
    if (!visible) return [];
    const asset = findConventionalImage(project.data.slug, [`img/${kind}`]);
    if (!asset) {
      throw new Error(`Project「${project.data.slug}」の${kind}画像が見つかりません`);
    }
    return [{
      type: "image" as const,
      kind,
      label: mediaLabel(kind),
      src: createContentAssetUrl("/images/projects", project.data.slug, asset),
      alt: projectImageAlt(project.data.title, kind),
    }];
  });
}

export interface ProjectYoutubeVideo {
  type: "youtube";
  kind: string;
  label: string;
  title: string;
  src: string;
}

export type ProjectMedia = ProjectMediaImage | ProjectYoutubeVideo;

export function getProjectMedia(project: ProjectEntry): ProjectMedia[] {
  const videos = Object.entries(project.data.videos).map(([kind, video]) => ({
    type: "youtube" as const,
    kind,
    label: mediaLabel(kind),
    title: video.title,
    src: `https://www.youtube-nocookie.com/embed/${video.videoId}?rel=0`,
  }));

  return [...getProjectImages(project), ...videos];
}

function mediaLabel(kind: string): string {
  return kind.replaceAll("-", " ").toUpperCase();
}

function projectImageAlt(title: string, kind: string): string {
  if (kind === "desktop") return `${title}のPC版画面`;
  if (kind === "mobile") return `${title}のSP版画面`;
  return `${title}の${mediaLabel(kind)}画像`;
}

function findConventionalImage(slug: string, stems: readonly string[]): string | undefined {
  for (const stem of stems) {
    for (const extension of imageExtensions) {
      const relativePath = `${stem}${extension}`;
      if (existsSync(join(projectContentRoot, slug, "assets", relativePath))) return relativePath;
    }
  }
  return undefined;
}
