import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";
import { chromium } from "playwright";
import { parseDocument } from "yaml";
import { imageSize } from "image-size";

const repositoryRoot = resolve(process.cwd());
const projectsRoot = join(repositoryRoot, "src/content/projects");
const reportPath = join(repositoryRoot, "docs/project-visuals-report.md");
const githubToken = process.env.GITHUB_TOKEN?.trim();
const githubHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "amano-projects-visual-collector",
  ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
};

const IMAGE_EXTENSIONS = new Set([".avif", ".gif", ".jpg", ".jpeg", ".png", ".webp"]);
const MAX_ASSET_BYTES = 10 * 1024 * 1024;
const entries = await listProjectEntries(projectsRoot);
const browser = await chromium.launch({ headless: true });
const report = [];

try {
  for (const entry of entries) {
    const result = await processProject(entry);
    report.push(result);
    console.log(`[${result.slug}] ${result.notes.join(" / ") || "変更なし"}`);
  }
} finally {
  await browser.close();
}

await mkdir(join(repositoryRoot, "docs"), { recursive: true });
await writeFile(reportPath, renderReport(report), "utf8");

async function processProject(entry) {
  const source = await readFile(entry.indexPath, "utf8");
  const parsed = parseFrontmatter(source, entry.indexPath);
  const document = parseDocument(parsed.frontmatter, { keepSourceTokens: true });
  const data = document.toJS();
  const slug = data.slug;
  const title = data.title;
  const notes = [];
  const assetsDir = join(entry.directory, "assets/img");
  await mkdir(assetsDir, { recursive: true });

  let repository = null;
  if (typeof data.repositoryUrl === "string") {
    repository = parseGitHubRepository(data.repositoryUrl);
    if (repository) {
      const metadata = await fetchGitHubRepository(repository.owner, repository.repo);
      if (!metadata || metadata.visibility !== "public") {
        document.delete("repositoryUrl");
        notes.push("非公開または参照不可のrepositoryUrlを削除");
        repository = null;
      } else {
        repository = { ...repository, metadata };
      }
    }
  }

  const website = await resolveWebsite(data.websiteUrl, repository);
  if (website?.url && data.websiteUrl !== website.url) {
    document.set("websiteUrl", website.url);
    notes.push(`websiteUrlを追加: ${website.url}`);
  }

  let ogAsset = null;
  let desktopAsset = null;
  let mobileAsset = null;
  let repositoryAsset = null;

  if (website?.url) {
    const captured = await captureWebsite({
      url: website.url,
      title,
      assetsDir,
    });
    ogAsset = captured.ogAsset;
    desktopAsset = captured.desktopAsset;
    mobileAsset = captured.mobileAsset;
    notes.push(...captured.notes);
  }

  if (repository) {
    repositoryAsset = await collectRepositoryImage({ repository, assetsDir, title });
    if (repositoryAsset) notes.push(`repository画像を保存: ${repositoryAsset}`);
  }

  const heroAsset = ogAsset ?? desktopAsset ?? repositoryAsset;
  if (heroAsset) {
    document.set("heroImage", {
      asset: `img/${heroAsset}`,
      alt: `${title}の代表画像`,
    });
    notes.push(`heroImageを設定: img/${heroAsset}`);
  }

  const nextFrontmatter = document.toString().trimEnd();
  const nextSource = `---\n${nextFrontmatter}\n---${parsed.body}`;
  if (nextSource !== source) {
    await writeFile(entry.indexPath, nextSource, "utf8");
  }

  return {
    slug,
    title,
    websiteUrl: website?.url ?? null,
    repositoryUrl: repository ? `https://github.com/${repository.owner}/${repository.repo}` : null,
    ogAsset,
    desktopAsset,
    mobileAsset,
    repositoryAsset,
    heroAsset,
    notes,
  };
}

async function captureWebsite({ url, title, assetsDir }) {
  const notes = [];
  let desktopAsset = null;
  let mobileAsset = null;
  let ogAsset = null;

  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: "light",
    ignoreHTTPSErrors: true,
  });

  try {
    const page = await desktop.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await waitForPage(page);

    const ogImage = await page.locator('meta[property="og:image"]').first().getAttribute("content").catch(() => null)
      ?? await page.locator('meta[name="twitter:image"]').first().getAttribute("content").catch(() => null);

    if (ogImage) {
      const resolvedOg = new URL(ogImage, page.url()).href;
      ogAsset = await downloadImage(resolvedOg, assetsDir, "og-image");
      if (ogAsset) notes.push(`OGP画像を保存: ${ogAsset}`);
    }

    desktopAsset = "screenshot-desktop.jpg";
    await page.screenshot({
      path: join(assetsDir, desktopAsset),
      type: "jpeg",
      quality: 84,
      fullPage: false,
    });
    notes.push(`PCスクリーンショットを保存: ${desktopAsset}`);
  } catch (error) {
    notes.push(`PC取得失敗: ${errorMessage(error)}`);
  } finally {
    await desktop.close();
  }

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    colorScheme: "light",
    ignoreHTTPSErrors: true,
  });

  try {
    const page = await mobile.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await waitForPage(page);
    mobileAsset = "screenshot-mobile.jpg";
    await page.screenshot({
      path: join(assetsDir, mobileAsset),
      type: "jpeg",
      quality: 84,
      fullPage: false,
    });
    notes.push(`SPスクリーンショットを保存: ${mobileAsset}`);
  } catch (error) {
    notes.push(`SP取得失敗: ${errorMessage(error)}`);
  } finally {
    await mobile.close();
  }

  return { ogAsset, desktopAsset, mobileAsset, notes };
}

async function waitForPage(page) {
  await page.waitForTimeout(3_000);
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  await page.waitForTimeout(300);
}

async function collectRepositoryImage({ repository, assetsDir }) {
  const { owner, repo, metadata } = repository;
  const treeResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(metadata.default_branch)}?recursive=1`,
    { headers: githubHeaders },
  );
  if (!treeResponse.ok) return null;

  const tree = await treeResponse.json();
  const candidates = (tree.tree ?? [])
    .filter((item) => item.type === "blob" && typeof item.path === "string")
    .filter((item) => IMAGE_EXTENSIONS.has(extname(item.path).toLowerCase()))
    .filter((item) => !/(?:^|\/)(?:node_modules|vendor|dist|build|coverage)(?:\/|$)/i.test(item.path))
    .map((item) => ({ ...item, score: imagePathScore(item.path) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));

  for (const candidate of candidates.slice(0, 20)) {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(metadata.default_branch)}/${candidate.path.split("/").map(encodeURIComponent).join("/")}`;
    const response = await fetch(rawUrl, { redirect: "follow" });
    if (!response.ok) continue;
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > MAX_ASSET_BYTES) continue;

    try {
      const dimensions = imageSize(buffer);
      if ((dimensions.width ?? 0) < 480 || (dimensions.height ?? 0) < 240) continue;
    } catch {
      continue;
    }

    const extension = normalizeExtension(extname(candidate.path));
    const filename = `repository-image${extension}`;
    await writeFile(join(assetsDir, filename), buffer);
    return filename;
  }

  return null;
}

async function resolveWebsite(existingWebsiteUrl, repository) {
  const candidates = [];
  if (typeof existingWebsiteUrl === "string") candidates.push(existingWebsiteUrl);
  if (repository?.metadata?.homepage) candidates.push(repository.metadata.homepage);
  if (repository) candidates.push(`https://${repository.owner}.github.io/${repository.repo}/`);

  for (const candidate of unique(candidates)) {
    const checked = await checkWebsite(candidate);
    if (checked) return checked;
  }
  return null;
}

async function checkWebsite(candidate) {
  try {
    const url = new URL(candidate);
    if (!/^https?:$/.test(url.protocol)) return null;
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "amano-projects-visual-collector" },
    });
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) return null;
    return { url: ensureTrailingSlash(response.url || url.href) };
  } catch {
    return null;
  }
}

async function fetchGitHubRepository(owner, repo) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: githubHeaders });
  if (!response.ok) return null;
  return response.json();
}

async function downloadImage(url, assetsDir, basename) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > MAX_ASSET_BYTES) return null;

    let extension = extensionFromContentType(response.headers.get("content-type"));
    if (!extension) extension = normalizeExtension(extname(new URL(response.url || url).pathname));
    if (!IMAGE_EXTENSIONS.has(extension)) return null;

    const filename = `${basename}${extension}`;
    await writeFile(join(assetsDir, filename), buffer);
    return filename;
  } catch {
    return null;
  }
}

function parseFrontmatter(source, sourcePath) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---([\s\S]*)$/);
  if (!match) throw new Error(`${sourcePath}: frontmatterが見つかりません`);
  return { frontmatter: match[1], body: match[2] };
}

async function listProjectEntries(root) {
  const { readdir } = await import("node:fs/promises");
  const directories = await readdir(root, { withFileTypes: true });
  return directories
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      directory: join(root, entry.name),
      indexPath: join(root, entry.name, "index.md"),
    }))
    .sort((a, b) => a.directory.localeCompare(b.directory));
}

function parseGitHubRepository(repositoryUrl) {
  try {
    const url = new URL(repositoryUrl);
    if (url.hostname !== "github.com") return null;
    const [owner, repoWithSuffix] = url.pathname.split("/").filter(Boolean);
    if (!owner || !repoWithSuffix) return null;
    return { owner, repo: repoWithSuffix.replace(/\.git$/i, "") };
  } catch {
    return null;
  }
}

function imagePathScore(path) {
  const normalized = path.toLowerCase();
  let score = 0;
  if (/(?:^|\/)(?:og|ogp|social|open-graph)(?:[._\/-]|$)/.test(normalized)) score += 120;
  if (/(?:screenshot|screen-shot|preview|hero|cover|keyvisual|key-visual|mainvisual|main-visual)/.test(normalized)) score += 100;
  if (/(?:^|\/)(?:docs?|images?|img|assets?|screenshots?)(?:\/|$)/.test(normalized)) score += 30;
  if (/(?:icon|favicon|logo|sprite|button|badge|avatar|thumb)/.test(normalized)) score -= 80;
  return score;
}

function extensionFromContentType(contentType) {
  const value = (contentType ?? "").split(";", 1)[0].trim().toLowerCase();
  return {
    "image/avif": ".avif",
    "image/gif": ".gif",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  }[value] ?? null;
}

function normalizeExtension(extension) {
  const lower = extension.toLowerCase();
  return lower === ".jpeg" ? ".jpg" : lower;
}

function ensureTrailingSlash(url) {
  const parsed = new URL(url);
  if (!parsed.pathname.endsWith("/") && !extname(parsed.pathname)) parsed.pathname += "/";
  return parsed.href;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function renderReport(results) {
  const lines = [
    "# Project Visuals Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "| Project | Website | Repository | OGP | PC SS | SP SS | Hero | Notes |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const result of results) {
    lines.push(`| ${escapeCell(result.title)} | ${linkCell(result.websiteUrl)} | ${linkCell(result.repositoryUrl)} | ${result.ogAsset ?? "—"} | ${result.desktopAsset ?? "—"} | ${result.mobileAsset ?? "—"} | ${result.heroAsset ?? "—"} | ${escapeCell(result.notes.join(" / ") || "変更なし")} |`);
  }
  lines.push("");
  return lines.join("\n");
}

function linkCell(url) {
  return url ? `[link](${url})` : "—";
}

function escapeCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}
