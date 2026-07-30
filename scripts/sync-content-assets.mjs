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
      if (heroImage !== undefined) {
        if (!isRecord(heroImage) || typeof heroImage.asset !== "string") {
          throw new Error(`${sourcePath}: heroImage.assetを指定してください`);
        }
        catalog.resolve(slug, heroImage.asset);
      }
      validateScreenshots(frontmatter, catalog, slug, sourcePath);
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

function validateScreenshots(frontmatter, catalog, slug, sourcePath) {
  const screenshots = frontmatter.screenshots;
  if (screenshots === undefined) return;
  if (!isRecord(screenshots)) {
    throw new Error(`${sourcePath}: screenshotsはobjectで指定してください`);
  }
  for (const [kind, visible] of Object.entries(screenshots)) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(kind)) {
      throw new Error(`${sourcePath}: screenshotsのキーは小文字英数字とハイフンで指定してください`);
    }
    if (typeof visible !== "boolean") {
      throw new Error(`${sourcePath}: screenshots.${kind}はbooleanで指定してください`);
    }
    if (visible === true && !findConventionalAsset(catalog, slug, `img/screenshot-${kind}`)) {
      throw new Error(`${sourcePath}: screenshots.${kind}に対応する画像がありません`);
    }
  }
}

function findConventionalAsset(catalog, slug, stem) {
  return catalog.assets.find((asset) => asset.entryName === slug && asset.relativePath.startsWith(`${stem}.`));
}
