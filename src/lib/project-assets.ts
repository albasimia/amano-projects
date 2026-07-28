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
  kind: "desktop" | "mobile";
  label: "DESKTOP" | "MOBILE";
}

export function getProjectCardImage(project: ProjectEntry): ProjectImage | undefined {
  const conventionalOgp = findConventionalImage(project.data.slug, ["img/ogp", "img/og-image"]);
  if (conventionalOgp) {
    return {
      src: createContentAssetUrl("/images/projects", project.data.slug, conventionalOgp),
      alt: project.data.heroImage?.asset === conventionalOgp
        ? project.data.heroImage.alt
        : `${project.data.title}の代表画像`,
      position: project.data.heroImage?.asset === conventionalOgp
        ? project.data.heroImage.position
        : undefined,
    };
  }
  return project.data.heroImage;
}

export function getProjectScreenshots(project: ProjectEntry): ProjectScreenshot[] {
  return (["desktop", "mobile"] as const).flatMap((kind) => {
    if (!project.data.screenshots[kind]) return [];
    const asset = findConventionalImage(project.data.slug, [`img/screenshot-${kind}`]);
    if (!asset) {
      throw new Error(`Project「${project.data.slug}」の${kind} screenshotが見つかりません`);
    }
    return [{
      kind,
      label: kind === "desktop" ? "DESKTOP" : "MOBILE",
      src: createContentAssetUrl("/images/projects", project.data.slug, asset),
      alt: `${project.data.title}の${kind === "desktop" ? "PC版" : "SP版"}スクリーンショット`,
    }];
  });
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
