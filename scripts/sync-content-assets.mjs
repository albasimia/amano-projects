import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { parseMarkdownFrontmatter } from "albasimia-ssg-core/content-source";
import { syncContentAssets } from "albasimia-ssg-core/content-assets";

const collections = [
  {
    name: "projects",
    entryFile: "index.md",
    validateAssets(frontmatter, catalog, slug, sourcePath) {
      const heroImage = frontmatter.heroImage;
      if (heroImage === undefined) return;
      if (!isRecord(heroImage) || typeof heroImage.asset !== "string") {
        throw new Error(`${sourcePath}: heroImage.assetを指定してください`);
      }
      catalog.resolve(slug, heroImage.asset);
    },
  },
  {
    name: "companies",
    entryFile: "index.md",
  },
];

let assetCount = 0;

for (const collection of collections) {
  const contentRoot = fileURLToPath(new URL(`../src/content/${collection.name}/`, import.meta.url));
  const outputRoot = fileURLToPath(new URL(`../public/images/${collection.name}/`, import.meta.url));
  const publicBasePath = `/images/${collection.name}`;
  const catalog = await syncContentAssets({
    sourceRoot: contentRoot,
    outputRoot,
    publicBasePath,
    maxFileBytes: 10 * 1024 * 1024,
  });

  const entries = await readdir(contentRoot, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const sourcePath = join(contentRoot, entry.name, collection.entryFile);
    const source = await readFile(sourcePath, "utf8");
    const { frontmatter } = parseMarkdownFrontmatter(source, { sourceName: sourcePath });

    if (!isRecord(frontmatter) || frontmatter.slug !== entry.name) {
      throw new Error(`${sourcePath}: directory名とfrontmatter.slugを一致させてください`);
    }

    collection.validateAssets?.(frontmatter, catalog, entry.name, sourcePath);
  }

  assetCount += catalog.assets.length;
}

console.log(`${assetCount} content assets synced`);

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
