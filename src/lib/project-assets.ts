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

export interface ProjectScreenshot extends ProjectImage {
  type: "image";
  kind: string;
  label: string;
}

export function getProjectScreenshots(project: ProjectEntry): ProjectScreenshot[] {
  return Object.entries(project.data.screenshots).flatMap(([kind, visible]) => {
    if (!visible) return [];
    const asset = findConventionalImage(project.data.slug, [`img/screenshot-${kind}`]);
    if (!asset) {
      throw new Error(`Project「${project.data.slug}」の${kind} screenshotが見つかりません`);
    }
    return [{
      type: "image" as const,
      kind,
      label: mediaLabel(kind),
      src: createContentAssetUrl("/images/projects", project.data.slug, asset),
      alt: screenshotAlt(project.data.title, kind),
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

export type ProjectMedia = ProjectScreenshot | ProjectYoutubeVideo;

export function getProjectMedia(project: ProjectEntry): ProjectMedia[] {
  const videos = Object.entries(project.data.youtubeVideos).map(([kind, video]) => ({
    type: "youtube" as const,
    kind,
    label: mediaLabel(kind),
    title: video.title,
    src: `https://www.youtube-nocookie.com/embed/${video.videoId}?rel=0`,
  }));

  return [...getProjectScreenshots(project), ...videos];
}

function mediaLabel(kind: string): string {
  return kind.replaceAll("-", " ").toUpperCase();
}

function screenshotAlt(title: string, kind: string): string {
  if (kind === "desktop") return `${title}のPC版スクリーンショット`;
  if (kind === "mobile") return `${title}のSP版スクリーンショット`;
  return `${title}の${mediaLabel(kind)}スクリーンショット`;
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
