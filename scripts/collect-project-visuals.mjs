import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { extname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import { parseDocument } from "yaml";
import { imageSize } from "image-size";

const repositoryRoot = resolve(process.cwd());
const projectsRoot = join(repositoryRoot, "src/content/projects");
const reportPath = join(repositoryRoot, "docs/project-visuals-report.md");
const cliArguments = process.argv.slice(2).map((value) => value.trim()).filter(Boolean);
const accentOnly = cliArguments.includes("--accent-only");
const forceAccent = cliArguments.includes("--force-accent");
const showHelp = cliArguments.includes("--help");
const unknownOptions = cliArguments.filter((value) => value.startsWith("--")
  && !["--accent-only", "--force-accent", "--help"].includes(value));
if (unknownOptions.length > 0) {
  throw new Error(`未対応のoptionです: ${unknownOptions.join(", ")}`);
}
if (showHelp) {
  console.log([
    "Usage: npm run collect:visuals -- [options] [slug ...]",
    "",
    "Options:",
    "  --accent-only   画像を更新せず、未設定のaccentだけを検出する",
    "  --force-accent  既存のaccentも再検出して更新する",
    "  --help          このhelpを表示する",
  ].join("\n"));
  process.exit(0);
}
const requestedSlugs = new Set(cliArguments.filter((value) => !value.startsWith("--")));
const githubToken = process.env.GITHUB_TOKEN?.trim();
const githubHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "amano-projects-visual-collector",
  ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
};

const IMAGE_EXTENSIONS = new Set([".avif", ".gif", ".jpg", ".jpeg", ".png", ".webp"]);
const MAX_ASSET_BYTES = 10 * 1024 * 1024;

const DEFAULT_CAPTURE_CONFIG = Object.freeze({
  force: false,
  delayMs: 1_800,
  timeoutMs: 45_000,
  networkIdleTimeoutMs: 10_000,
  waitFor: null,
  videoTime: 1.5,
  videoFrameFallback: false,
  hero: "og",
  click: [],
  desktopClick: [],
  mobileClick: [],
  closeMobileMenu: false,
  mobileMenuSelector: null,
  mobileMenuButtonSelector: null,
  mobileMenuClickAt: null,
  mobileMenuOpenTexts: [],
  consentSelectors: [],
  hideSelectors: [],
  sliderMode: "first",
  sliderIndex: 0,
  sliderSelectors: [],
  detectAccent: true,
});

// repositoryUrlを持たないProjectや、GitHub上のrepository名とslugが異なるProject用。
const WEBSITE_OVERRIDES = new Map([
  ["chachamaru-birthday", "https://albasimia.github.io/chachamaru_birthday/"],
]);

const COMMON_CONSENT_SELECTORS = [
  "#onetrust-accept-btn-handler",
  "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll",
  "#didomi-notice-agree-button",
  "button[data-testid='uc-accept-all-button']",
  "button[data-testid='cookie-policy-manage-dialog-accept-button']",
  "button[aria-label='Accept all']",
  "button[aria-label='すべて許可']",
];

const allEntries = await listProjectEntries(projectsRoot);
const entries = requestedSlugs.size === 0
  ? allEntries
  : allEntries.filter((entry) => requestedSlugs.has(entry.directory.split(/[\\/]/).at(-1)));
if (requestedSlugs.size > 0 && entries.length !== requestedSlugs.size) {
  const found = new Set(entries.map((entry) => entry.directory.split(/[\\/]/).at(-1)));
  const missing = [...requestedSlugs].filter((slug) => !found.has(slug));
  throw new Error(`指定されたProjectが見つかりません: ${missing.join(", ")}`);
}
const browser = await launchBrowser();
const report = [];

try {
  for (const entry of entries) {
    const entrySlug = entry.directory.split(/[\\/]/).at(-1);
    console.log(`[${entrySlug}] 開始`);
    const result = await processProject(entry);
    report.push(result);
    console.log(`[${result.slug}] ${result.notes.join(" / ") || "変更なし"}`);
  }
} finally {
  await browser.close();
}

if (requestedSlugs.size === 0 && !accentOnly) {
  await mkdir(join(repositoryRoot, "docs"), { recursive: true });
  await writeFile(reportPath, renderReport(report), "utf8");
}

async function processProject(entry) {
  const source = await readFile(entry.indexPath, "utf8");
  const parsed = parseFrontmatter(source, entry.indexPath);
  const document = parseDocument(parsed.frontmatter, { keepSourceTokens: true });
  const data = document.toJS();
  const slug = data.slug;
  const title = data.title;
  const notes = [];
  const assetsDir = join(entry.directory, "assets/img");
  const captureConfig = await loadCaptureConfig(entry.directory, slug);
  const collectAccent = captureConfig.detectAccent && (forceAccent || !isHexColor(data.accent));
  let selectedAccent = data.accent ?? null;
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

  const website = await resolveWebsite({
    existingWebsiteUrl: data.websiteUrl,
    repository,
    slug,
    captureConfig,
  });

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
      config: captureConfig,
      captureVisuals: !accentOnly,
      collectAccent,
    });
    ogAsset = captured.ogAsset;
    desktopAsset = captured.desktopAsset;
    mobileAsset = captured.mobileAsset;
    if (captured.accent && (forceAccent || !isHexColor(data.accent)) && data.accent !== captured.accent) {
      document.set("accent", captured.accent);
      selectedAccent = captured.accent;
      notes.push(`accentを設定: ${captured.accent}`);
    }
    notes.push(...captured.notes);
  }

  if (repository && !accentOnly) {
    const existingRepositoryAsset = captureConfig.force
      ? null
      : await findExistingImageAsset(assetsDir, "repository-image");

    if (existingRepositoryAsset) {
      repositoryAsset = existingRepositoryAsset;
      notes.push(`repository画像があるため取得をスキップ: ${repositoryAsset}`);
    } else {
      repositoryAsset = await collectRepositoryImage({ repository, assetsDir });
      if (repositoryAsset) notes.push(`repository画像を保存: ${repositoryAsset}`);
    }
  }

  const existingHeroAsset = typeof data.heroImage?.asset === "string"
    ? data.heroImage.asset.replace(/^img\//, "")
    : null;

  const heroAsset = accentOnly ? existingHeroAsset : selectHeroAsset(captureConfig.hero, {
    ogAsset,
    desktopAsset,
    mobileAsset,
    repositoryAsset,
    existingHeroAsset,
  });

  if (heroAsset && data.heroImage?.asset !== `img/${heroAsset}`) {
    document.set("heroImage", {
      asset: `img/${heroAsset}`,
      alt: data.heroImage?.alt || `${title}の代表画像`,
      ...(data.heroImage?.position ? { position: data.heroImage.position } : {}),
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
    accent: selectedAccent,
    notes,
  };
}

async function captureWebsite({ url, assetsDir, config, captureVisuals, collectAccent }) {
  const notes = [];

  const existingOgAsset = !captureVisuals || config.force
    ? null
    : await findExistingImageAsset(assetsDir, "og-image", { representative: true });
  const existingDesktopAsset = !captureVisuals || config.force
    ? null
    : await findExistingImageAsset(assetsDir, "screenshot-desktop");
  const existingMobileAsset = !captureVisuals || config.force
    ? null
    : await findExistingImageAsset(assetsDir, "screenshot-mobile");

  const desktopResult = await captureViewport({
    url,
    assetsDir,
    config,
    viewportName: "PC",
    filename: "screenshot-desktop.jpg",
    existingAsset: existingDesktopAsset,
    existingOgAsset,
    contextOptions: {
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      colorScheme: "light",
      ignoreHTTPSErrors: true,
      reducedMotion: "reduce",
    },
    captureScreenshot: captureVisuals,
    collectOg: captureVisuals,
    collectAccent,
  });

  notes.push(...desktopResult.notes);

  const mobileResult = captureVisuals ? await captureViewport({
    url,
    assetsDir,
    config,
    viewportName: "SP",
    filename: "screenshot-mobile.jpg",
    existingAsset: existingMobileAsset,
    existingOgAsset: null,
    contextOptions: {
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
      colorScheme: "light",
      ignoreHTTPSErrors: true,
      reducedMotion: "reduce",
    },
    captureScreenshot: true,
    collectOg: false,
    collectAccent: false,
  }) : { asset: null, ogAsset: null, accent: null, notes: [] };

  notes.push(...mobileResult.notes);

  return {
    ogAsset: desktopResult.ogAsset,
    desktopAsset: desktopResult.asset,
    mobileAsset: mobileResult.asset,
    accent: desktopResult.accent,
    notes,
  };
}

async function captureViewport({
  url,
  assetsDir,
  config,
  viewportName,
  filename,
  existingAsset,
  existingOgAsset,
  contextOptions,
  captureScreenshot,
  collectOg,
  collectAccent,
}) {
  const notes = [];
  let asset = existingAsset ?? null;
  let ogAsset = existingOgAsset ?? null;
  let accent = null;

  const needsScreenshot = captureScreenshot && (config.force || !asset);
  const needsOg = collectOg && (config.force || !ogAsset);
  const needsAccent = collectAccent;

  if (!needsScreenshot && !needsOg && !needsAccent) {
    notes.push(`${viewportName}: 既存画像があるため取得をスキップ: ${asset}`);
    if (collectOg && ogAsset) notes.push(`OGP画像があるため取得をスキップ: ${ogAsset}`);
    return { asset, ogAsset, accent, notes };
  }

  const context = await browser.newContext(contextOptions);

  try {
    const page = await context.newPage();
    page.setDefaultTimeout(Math.min(config.timeoutMs, 15_000));

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: config.timeoutMs,
    });

    // OGPだけが未取得の場合は、画面準備をせずmeta情報だけ確認する。
    if (needsOg) {
      const ogImage = await page.locator('meta[property="og:image"]').first().getAttribute("content").catch(() => null)
        ?? await page.locator('meta[name="twitter:image"]').first().getAttribute("content").catch(() => null);

      if (ogImage) {
        const resolvedOg = new URL(ogImage, page.url()).href;
        const downloadedOg = await downloadOgImage(resolvedOg, assetsDir);
        ogAsset = downloadedOg.asset;
        if (ogAsset) notes.push(`OGP画像を保存: ${ogAsset}`);
        if (downloadedOg.note) notes.push(downloadedOg.note);
      }
    } else if (collectOg && ogAsset) {
      notes.push(`OGP画像があるため取得をスキップ: ${ogAsset}`);
    }

    if (needsScreenshot) {
      const preparation = await preparePage(page, config, viewportName);
      notes.push(...preparation.notes.map((note) => `${viewportName}: ${note}`));
    } else if (needsAccent) {
      const preparation = await preparePageForAccent(page, config);
      notes.push(...preparation.notes.map((note) => `${viewportName}: ${note}`));
    }

    if (needsAccent) {
      accent = await detectPageAccent(page);
      if (accent) notes.push(`${viewportName}: accent候補を検出: ${accent}`);
      else notes.push(`${viewportName}: accent候補を検出できませんでした`);
    }

    if (needsScreenshot) {
      asset = filename;
      await page.screenshot({
        path: join(assetsDir, asset),
        type: "jpeg",
        quality: 88,
        fullPage: false,
      });
      notes.push(`${viewportName}スクリーンショットを保存: ${asset}`);
    } else if (asset) {
      notes.push(`${viewportName}: 既存画像があるため取得をスキップ: ${asset}`);
    }
  } catch (error) {
    notes.push(`${viewportName}取得失敗: ${errorMessage(error)}`);
  } finally {
    await context.close();
  }

  return { asset, ogAsset, accent, notes };
}

async function preparePage(page, config, viewportName) {
  const notes = [];

  await page.waitForLoadState("networkidle", {
    timeout: config.networkIdleTimeoutMs,
  }).catch(() => {});

  const consentResult = await dismissConsent(page, config.consentSelectors);
  if (consentResult) notes.push(`Cookie同意を操作: ${consentResult}`);

  const viewportClicks = viewportName === "SP" ? config.mobileClick : config.desktopClick;
  for (const selector of [...config.click, ...viewportClicks]) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      await locator.click({ timeout: 3_000 }).catch(() => {});
      notes.push(`指定要素をクリック: ${selector}`);
      await page.waitForTimeout(350);
    }
  }

  await page.waitForLoadState("networkidle", {
    timeout: config.networkIdleTimeoutMs,
  }).catch(() => {});

  if (config.waitFor) {
    await page.locator(config.waitFor).first().waitFor({
      state: "visible",
      timeout: config.timeoutMs,
    });
    notes.push(`表示待機完了: ${config.waitFor}`);
  }

  await activateLazyVisuals(page);
  await waitForFonts(page);
  await waitForImages(page);
  const fixedVideoFrames = await prepareVideos(page, config.videoTime, config.videoFrameFallback);
  if (fixedVideoFrames > 0) notes.push(`動画frameを固定: ${fixedVideoFrames}件`);

  if (config.delayMs > 0) {
    await page.waitForTimeout(config.delayMs);
  }

  // 遅延ロードされたフォント・画像をもう一度確認する。
  await waitForFonts(page);
  await waitForImages(page);

  const stabilizedSliderCount = await stabilizeSliders(page, config);
  if (stabilizedSliderCount > 0) {
    notes.push(`スライダーを${config.sliderIndex + 1}枚目で固定: ${stabilizedSliderCount}件`);
    // 指定slideへ移動したことでlazy loadが始まる場合がある。
    await activateLazyVisuals(page);
    await waitForImages(page);
  }

  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  await hideConfiguredElements(page, config.hideSelectors);
  await freezeMotion(page);

  // animation停止によってmenuの初期表示状態が変わるsiteがあるため、
  // mobile menuの処理はfreezeMotion後に行う。
  if (viewportName === "SP" && config.closeMobileMenu) {
    const closedMenu = await closeOpenMobileMenu(page, {
      menuSelector: config.mobileMenuSelector,
      buttonSelector: config.mobileMenuButtonSelector,
      clickAt: config.mobileMenuClickAt,
      openTexts: config.mobileMenuOpenTexts,
    });
    if (closedMenu) notes.push(`開いていたmobile menuを閉じる: ${closedMenu}`);
  }

  await page.waitForTimeout(300);

  return { notes };
}

async function preparePageForAccent(page, config) {
  const notes = [];
  await page.waitForLoadState("networkidle", {
    timeout: config.networkIdleTimeoutMs,
  }).catch(() => {});
  const consentResult = await dismissConsent(page, config.consentSelectors);
  if (consentResult) notes.push(`Cookie同意を操作: ${consentResult}`);
  await waitForFonts(page);
  await page.waitForTimeout(Math.min(config.delayMs, 1_000));
  return { notes };
}

async function detectPageAccent(page) {
  return page.evaluate(() => {
    const probe = document.createElement("span");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:fixed;left:-9999px;top:-9999px;pointer-events:none";
    document.body.append(probe);

    const parseColor = (value) => {
      if (!value || value === "transparent" || value === "currentcolor") return null;
      probe.style.color = "";
      probe.style.color = value;
      if (!probe.style.color) return null;

      const normalized = getComputedStyle(probe).color;
      const rgb = normalized.match(/rgba?\(\s*([\d.]+)(?:\s|,\s*)+([\d.]+)(?:\s|,\s*)+([\d.]+)(?:\s*\/\s*|\s*,\s*)?([\d.]*)\s*\)/i);
      if (rgb) {
        const alpha = rgb[4] === "" ? 1 : Number(rgb[4]);
        return alpha < 0.5 ? null : rgb.slice(1, 4).map((channel) => Math.round(Number(channel)));
      }

      const srgb = normalized.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/i);
      if (srgb) {
        const alpha = srgb[4] === undefined ? 1 : Number(srgb[4]);
        return alpha < 0.5 ? null : srgb.slice(1, 4).map((channel) => Math.round(Number(channel) * 255));
      }

      return null;
    };

    const colorMetrics = ([red, green, blue]) => {
      const channels = [red, green, blue].map((channel) => channel / 255);
      const maximum = Math.max(...channels);
      const minimum = Math.min(...channels);
      const lightness = (maximum + minimum) / 2;
      const delta = maximum - minimum;
      const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
      return { lightness, saturation };
    };

    const toHex = (rgb) => `#${rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
    const candidates = new Map();
    const addCandidate = (value, weight) => {
      const rgb = parseColor(value);
      if (!rgb) return;
      const { lightness, saturation } = colorMetrics(rgb);
      if (saturation < 0.22 || lightness < 0.14 || lightness > 0.88) return;
      const hex = toHex(rgb);
      const score = weight + saturation * 60 - Math.abs(lightness - 0.52) * 24;
      const previous = candidates.get(hex) ?? { score: 0, count: 0 };
      candidates.set(hex, {
        score: Math.max(previous.score, score),
        count: previous.count + 1,
      });
    };

    const themeColor = document.querySelector('meta[name="theme-color"]')?.getAttribute("content");
    addCandidate(themeColor, 90);

    const variableNames = [
      "--accent", "--accent-color", "--color-accent", "--primary", "--primary-color",
      "--color-primary", "--brand", "--brand-color", "--theme-color", "--key-color",
    ];
    for (const root of [document.documentElement, document.body]) {
      const style = getComputedStyle(root);
      for (const name of variableNames) addCandidate(style.getPropertyValue(name).trim(), 110);
    }

    const elements = [...document.querySelectorAll([
      "a", "button", "[role='button']", "h1", "h2", "h3",
      "[class*='accent' i]", "[class*='primary' i]", "[class*='brand' i]", "svg",
    ].join(","))].slice(0, 600);

    for (const element of elements) {
      if (!(element instanceof Element)) continue;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      if (rect.width < 2 || rect.height < 2 || style.display === "none" || style.visibility === "hidden") continue;
      const prominence = Math.min((rect.width * rect.height) / 20_000, 18);
      const interactive = element.matches("a, button, [role='button']") ? 16 : 7;
      addCandidate(style.color, 24 + interactive + prominence);
      addCandidate(style.backgroundColor, 28 + interactive + prominence);
      addCandidate(style.borderTopColor, 16 + interactive);
      addCandidate(style.borderBottomColor, 16 + interactive);
      if (element instanceof SVGElement) {
        addCandidate(style.fill, 24 + prominence);
        addCandidate(style.stroke, 24 + prominence);
      }
    }

    probe.remove();
    return [...candidates.entries()]
      .map(([hex, candidate]) => ({ hex, score: candidate.score + Math.min(candidate.count, 20) * 2 }))
      .sort((a, b) => b.score - a.score)[0]?.hex ?? null;
  }).catch(() => null);
}

async function closeOpenMobileMenu(page, {
  menuSelector = null,
  buttonSelector = null,
  clickAt = null,
  openTexts = [],
} = {}) {
  const normalizedTexts = openTexts.map((value) => value.trim().replace(/\s+/g, " ").toLowerCase());

  // Project側でmenuとbuttonを特定できる場合は、site固有の状態classを
  // 撮影用DOMから確実に除去する。animation停止後でもmenuを残さない。
  if (menuSelector) {
    const forcedClosed = await page.evaluate(({ menuSelector: menuValue, buttonSelector: buttonValue }) => {
      const menu = document.querySelector(menuValue);
      if (!(menu instanceof HTMLElement)) return null;

      const button = buttonValue ? document.querySelector(buttonValue) : null;
      const openClasses = ["active", "is-active", "open", "is-open", "show", "is-show"];
      for (const className of openClasses) {
        menu.classList.remove(className);
        if (button instanceof HTMLElement) button.classList.remove(className);
      }

      menu.setAttribute("aria-hidden", "true");
      menu.style.setProperty("display", "none", "important");
      menu.style.setProperty("visibility", "hidden", "important");
      menu.style.setProperty("opacity", "0", "important");
      menu.style.setProperty("pointer-events", "none", "important");

      if (button instanceof HTMLElement) {
        button.setAttribute("aria-expanded", "false");
      }

      for (const root of [document.documentElement, document.body]) {
        for (const className of ["menu-open", "nav-open", "is-menu-open", "is-nav-open"]) {
          root.classList.remove(className);
        }
        root.style.removeProperty("overflow");
        root.style.removeProperty("position");
      }

      return menu.id || menu.className || menu.tagName.toLowerCase();
    }, { menuSelector, buttonSelector }).catch(() => null);

    if (forcedClosed) return `selector:${menuSelector} (${String(forcedClosed).trim().slice(0, 100)})`;
  }

  const isOpenByText = async () => {
    if (normalizedTexts.length === 0) return null;
    return page.evaluate((texts) => {
      const visible = (element) => {
        if (!(element instanceof HTMLElement)) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return rect.width > 2
          && rect.height > 2
          && rect.bottom > 0
          && rect.top < innerHeight
          && style.display !== "none"
          && style.visibility !== "hidden"
          && Number.parseFloat(style.opacity || "1") > 0;
      };
      const labels = [...document.querySelectorAll("a, button, [role='button']")]
        .filter(visible)
        .map((element) => (element.textContent || "").trim().replace(/\s+/g, " ").toLowerCase());
      const matched = texts.filter((text) => labels.includes(text));
      return matched.length >= Math.min(3, texts.length) ? matched : null;
    }, normalizedTexts).catch(() => null);
  };

  // Project別に座標が指定されている場合は、menuが開いていることをtextで確認してから
  // hamburger位置を直接操作する。selectorがないdiv実装でも確実に扱える。
  const matchedBeforeClick = await isOpenByText();
  if (matchedBeforeClick && clickAt) {
    await page.mouse.click(clickAt.x, clickAt.y).catch(() => {});
    await page.waitForTimeout(700);
    const matchedAfterClick = await isOpenByText();
    if (!matchedAfterClick) {
      return `座標(${clickAt.x}, ${clickAt.y})`;
    }
  }

  const result = await page.evaluate(() => {
    const isVisible = (element) => {
      if (!(element instanceof HTMLElement)) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return rect.width > 2
        && rect.height > 2
        && style.display !== "none"
        && style.visibility !== "hidden"
        && Number.parseFloat(style.opacity || "1") > 0;
    };

    const viewportArea = innerWidth * innerHeight;
    const menuCandidates = [...document.querySelectorAll([
      "nav",
      "[role='navigation']",
      "[class*='menu' i]",
      "[class*='nav' i]",
      "[id*='menu' i]",
      "[id*='nav' i]",
    ].join(","))].filter((element) => {
      if (!isVisible(element)) return false;
      const rect = element.getBoundingClientRect();
      const visibleLinks = [...element.querySelectorAll("a")].filter(isVisible).length;
      const largeOverlay = rect.width * rect.height >= viewportArea * 0.35
        && rect.width >= innerWidth * 0.6
        && rect.height >= innerHeight * 0.45;
      return visibleLinks >= 3 && largeOverlay;
    });

    if (menuCandidates.length === 0) return null;

    const controls = [...document.querySelectorAll("button, [role='button'], a, [onclick], [tabindex]")]
      .filter((element) => {
        if (!isVisible(element)) return false;
        const rect = element.getBoundingClientRect();
        return rect.top < 120 && rect.right > innerWidth - 120;
      });

    const score = (element) => {
      const value = [
        element.getAttribute("aria-label"),
        element.getAttribute("class"),
        element.getAttribute("id"),
        element.textContent,
      ].filter(Boolean).join(" ").toLowerCase();
      const rect = element.getBoundingClientRect();
      let points = 0;
      if (element.getAttribute("aria-expanded") === "true") points += 100;
      if (/(hamburger|menu-trigger|menu-button|menu-btn|nav-button|nav-btn)/.test(value)) points += 70;
      if (/(menu|メニュー|閉じる|close)/.test(value)) points += 40;
      if (rect.right > innerWidth - 70) points += 20;
      if (rect.width >= 24 && rect.width <= 90 && rect.height >= 20 && rect.height <= 90) points += 15;
      return points;
    };

    controls.sort((a, b) => score(b) - score(a));
    const control = controls[0];
    if (!control || score(control) <= 0) return null;

    const descriptor = control.getAttribute("aria-label")
      || control.getAttribute("id")
      || control.getAttribute("class")
      || control.tagName.toLowerCase();
    control.click();
    return String(descriptor).trim().slice(0, 120);
  }).catch(() => null);

  if (result) {
    await page.waitForTimeout(700);
    if (!await isOpenByText()) return result;
  }

  // clickで閉じられない場合は、指定されたmenu item群の共通祖先を撮影時だけ隠す。
  // body/html/headerは対象外とし、menu overlayだけに限定する。
  if (normalizedTexts.length > 0) {
    const hidden = await page.evaluate((texts) => {
      const visible = (element) => {
        if (!(element instanceof HTMLElement)) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return rect.width > 2
          && rect.height > 2
          && rect.bottom > 0
          && rect.top < innerHeight
          && style.display !== "none"
          && style.visibility !== "hidden"
          && Number.parseFloat(style.opacity || "1") > 0;
      };
      const elements = [...document.querySelectorAll("a, button")].filter((element) => {
        if (!visible(element)) return false;
        const label = (element.textContent || "").trim().replace(/\s+/g, " ").toLowerCase();
        return texts.includes(label);
      });
      if (elements.length < Math.min(3, texts.length)) return null;

      let candidate = elements[0].parentElement;
      while (candidate && candidate !== document.body && candidate !== document.documentElement) {
        if (elements.every((element) => candidate.contains(element))) {
          const rect = candidate.getBoundingClientRect();
          const tag = candidate.tagName.toLowerCase();
          if (tag !== "header" && rect.width >= innerWidth * 0.65 && rect.height >= innerHeight * 0.45) {
            candidate.style.setProperty("display", "none", "important");
            candidate.style.setProperty("visibility", "hidden", "important");
            candidate.style.setProperty("opacity", "0", "important");
            candidate.style.setProperty("pointer-events", "none", "important");
            return candidate.id || candidate.className || tag;
          }
        }
        candidate = candidate.parentElement;
      }
      return null;
    }, normalizedTexts).catch(() => null);

    if (hidden) return `menu overlayを非表示: ${String(hidden).trim().slice(0, 100)}`;
  }

  return null;
}

async function dismissConsent(page, projectSelectors) {
  const selectors = [...projectSelectors, ...COMMON_CONSENT_SELECTORS];

  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (!await locator.isVisible().catch(() => false)) continue;
    await locator.click({ timeout: 2_500 }).catch(() => {});
    await page.waitForTimeout(400);
    return selector;
  }

  // Cookie/consent領域の中にある「同意」系buttonだけを対象にする。
  const candidates = page.locator([
    '[id*="cookie" i] button',
    '[class*="cookie" i] button',
    '[id*="consent" i] button',
    '[class*="consent" i] button',
    '[aria-label*="cookie" i] button',
  ].join(","));

  const count = Math.min(await candidates.count().catch(() => 0), 30);
  const acceptedTexts = [
    "accept",
    "accept all",
    "allow all",
    "agree",
    "i agree",
    "ok",
    "同意",
    "同意する",
    "すべて許可",
    "許可する",
    "承諾",
  ];

  for (let index = 0; index < count; index += 1) {
    const candidate = candidates.nth(index);
    if (!await candidate.isVisible().catch(() => false)) continue;
    const text = normalizeButtonText(await candidate.innerText().catch(() => ""));
    if (!acceptedTexts.some((accepted) => text === accepted || text.startsWith(`${accepted} `))) continue;
    await candidate.click({ timeout: 2_500 }).catch(() => {});
    await page.waitForTimeout(400);
    return `text:${text}`;
  }

  return null;
}

async function activateLazyVisuals(page) {
  await page.evaluate(() => {
    const sourceAttributes = ["data-src", "data-lazy", "data-original", "data-lazy-src"];
    const srcsetAttributes = ["data-srcset", "data-lazy-srcset"];
    const backgroundAttributes = ["data-background", "data-bg", "data-bg-src", "data-lazy-bg"];

    for (const image of document.querySelectorAll("img")) {
      if (!image.getAttribute("src")) {
        const source = sourceAttributes.map((name) => image.getAttribute(name)).find(Boolean);
        if (source) image.setAttribute("src", source);
      }
      if (!image.getAttribute("srcset")) {
        const srcset = srcsetAttributes.map((name) => image.getAttribute(name)).find(Boolean);
        if (srcset) image.setAttribute("srcset", srcset);
      }
      image.loading = "eager";
    }

    for (const sourceElement of document.querySelectorAll("source")) {
      if (!sourceElement.getAttribute("srcset")) {
        const srcset = srcsetAttributes.map((name) => sourceElement.getAttribute(name)).find(Boolean);
        if (srcset) sourceElement.setAttribute("srcset", srcset);
      }
      if (!sourceElement.getAttribute("src")) {
        const source = sourceAttributes.map((name) => sourceElement.getAttribute(name)).find(Boolean);
        if (source) sourceElement.setAttribute("src", source);
      }
    }

    for (const element of document.querySelectorAll(backgroundAttributes.map((name) => `[${name}]`).join(","))) {
      const background = backgroundAttributes.map((name) => element.getAttribute(name)).find(Boolean);
      if (background && getComputedStyle(element).backgroundImage === "none") {
        element.style.setProperty("background-image", `url("${background.replaceAll('"', '\\"')}")`, "important");
      }
    }

    for (const video of document.querySelectorAll("video")) {
      let changed = false;
      if (!video.getAttribute("src")) {
        const source = sourceAttributes.map((name) => video.getAttribute(name)).find(Boolean);
        if (source) {
          video.setAttribute("src", source);
          changed = true;
        }
      }
      for (const sourceElement of video.querySelectorAll("source")) {
        if (sourceElement.getAttribute("src")) continue;
        const source = sourceAttributes.map((name) => sourceElement.getAttribute(name)).find(Boolean);
        if (source) {
          sourceElement.setAttribute("src", source);
          changed = true;
        }
      }
      if (changed) video.load();
    }
  }).catch(() => {});
}

async function waitForFonts(page) {
  await page.evaluate(async () => {
    if (!document.fonts?.ready) return;
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 12_000)),
    ]);
  }).catch(() => {});
}

async function waitForImages(page) {
  await page.evaluate(async () => {
    const images = [...document.images];
    for (const image of images) image.loading = "eager";

    await Promise.allSettled(images.map(async (image) => {
      if (!image.complete) {
        await Promise.race([
          new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          }),
          new Promise((resolve) => setTimeout(resolve, 10_000)),
        ]);
      }
      if (typeof image.decode === "function") {
        await Promise.race([
          image.decode().catch(() => {}),
          new Promise((resolve) => setTimeout(resolve, 5_000)),
        ]);
      }
    }));
  }).catch(() => {});
}

async function prepareVideos(page, videoTime, frameFallback) {
  if (videoTime === null || videoTime === false) return 0;

  // FFmpeg fallbackを使わない場合だけ、browser内で動画を再生・seekする。
  // video.play()はcodecや配信状態によってPromiseが未解決のまま残るため、
  // 必ず短いtimeoutを付ける。
  if (!frameFallback) {
    await page.evaluate(async (targetTime) => {
      const videos = [...document.querySelectorAll("video")];

      await Promise.allSettled(videos.map(async (video) => {
        video.muted = true;
        video.preload = "auto";
        video.setAttribute("playsinline", "");

        await Promise.race([
          Promise.resolve(video.play()).catch(() => {}),
          new Promise((resolve) => setTimeout(resolve, 1_500)),
        ]);

        if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
          await Promise.race([
            new Promise((resolve) => {
              video.addEventListener("loadedmetadata", resolve, { once: true });
              video.addEventListener("error", resolve, { once: true });
            }),
            new Promise((resolve) => setTimeout(resolve, 6_000)),
          ]);
        }

        const duration = Number.isFinite(video.duration) ? video.duration : 0;
        const nextTime = duration > 0
          ? Math.min(Math.max(Number(targetTime) || 0, 0), Math.max(duration - 0.05, 0))
          : 0;

        if (nextTime > 0 && Math.abs(video.currentTime - nextTime) > 0.05) {
          try {
            video.currentTime = nextTime;
            await Promise.race([
              new Promise((resolve) => video.addEventListener("seeked", resolve, { once: true })),
              new Promise((resolve) => setTimeout(resolve, 4_000)),
            ]);
          } catch {
            // seek不可のstream等は現在frameのまま撮影する。
          }
        }

        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          await Promise.race([
            new Promise((resolve) => {
              video.addEventListener("loadeddata", resolve, { once: true });
              video.addEventListener("error", resolve, { once: true });
            }),
            new Promise((resolve) => setTimeout(resolve, 5_000)),
          ]);
        }

        video.pause();
      }));
    }, videoTime).catch(() => {});

    return 0;
  }

  // FFmpeg fallback時はbrowser内のvideo.play()を呼ばない。
  // DOMからsource URLだけ取得し、指定秒数の静止画へ置換する。
  const candidates = await page.evaluate(() => {
    return [...document.querySelectorAll("video")].map((video, index) => {
      const rect = video.getBoundingClientRect();
      const style = getComputedStyle(video);
      const source = video.currentSrc
        || video.src
        || video.querySelector("source[src]")?.src
        || "";
      const visible = rect.width > 2
        && rect.height > 2
        && style.display !== "none"
        && style.visibility !== "hidden"
        && Number.parseFloat(style.opacity || "1") > 0;
      return { index, source, visible };
    }).filter((item) => item.visible && item.source);
  }).catch(() => []);

  let replaced = 0;
  for (const candidate of candidates) {
    try {
      const dataUrl = await extractVideoFrame(candidate.source, videoTime);
      const didReplace = await page.evaluate(({ index, dataUrl }) => {
        const video = [...document.querySelectorAll("video")][index];
        if (!video) return false;

        const style = getComputedStyle(video);
        const image = document.createElement("img");
        image.src = dataUrl;
        image.alt = "";
        image.setAttribute("aria-hidden", "true");
        image.setAttribute("data-project-visual-video-frame", "");

        const properties = [
          "display", "position", "top", "right", "bottom", "left", "inset",
          "width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight",
          "margin", "padding", "objectFit", "objectPosition", "transform",
          "transformOrigin", "opacity", "zIndex", "borderRadius", "clipPath",
          "filter", "mixBlendMode", "boxSizing",
        ];
        for (const property of properties) {
          const value = style[property];
          if (value) image.style[property] = value;
        }

        if (!image.style.objectFit || image.style.objectFit === "fill") {
          image.style.objectFit = "cover";
        }

        image.className = typeof video.className === "string" ? video.className : "";
        video.replaceWith(image);
        return true;
      }, { index: candidate.index, dataUrl }).catch(() => false);

      if (didReplace) replaced += 1;
    } catch (error) {
      console.warn(`[video-frame] failed: ${candidate.source}: ${errorMessage(error)}`);
    }
  }

  return replaced;
}

async function extractVideoFrame(sourceUrl, targetTime) {
  const directory = await mkdtemp(join(tmpdir(), "amano-project-video-"));
  const outputPath = join(directory, "frame.jpg");
  const seekTime = String(Math.max(Number(targetTime) || 0, 0));

  console.log(`[video-frame] extracting ${seekTime}s: ${sourceUrl}`);

  try {
    // 動画全体をNode側へdownloadせず、FFmpegにURLを直接読ませる。
    // -ssをinput前に置き、Range request可能な配信元では必要な位置まで高速seekする。
    await runCommand("ffmpeg", [
      "-hide_banner",
      "-loglevel", "error",
      "-rw_timeout", "20000000",
      "-user_agent", "amano-projects-visual-collector",
      "-ss", seekTime,
      "-i", sourceUrl,
      "-frames:v", "1",
      "-q:v", "2",
      "-y",
      outputPath,
    ], 45_000);

    const frame = await readFile(outputPath);
    console.log(`[video-frame] extracted: ${sourceUrl}`);
    return `data:image/jpeg;base64,${frame.toString("base64")}`;
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

function runCommand(command, args, timeoutMs = 45_000) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    let settled = false;

    const finish = (callback) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      callback();
    };

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      finish(() => rejectPromise(new Error(`${command} timed out after ${timeoutMs}ms`)));
    }, timeoutMs);

    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
      if (stderr.length > 16_000) stderr = stderr.slice(-16_000);
    });
    child.on("error", (error) => finish(() => rejectPromise(error)));
    child.on("close", (code) => finish(() => {
      if (code === 0) {
        resolvePromise();
      } else {
        rejectPromise(new Error(`${command} exited with ${code}: ${stderr.trim()}`));
      }
    }));
  });
}

async function hideConfiguredElements(page, selectors) {
  if (selectors.length === 0) return;
  await page.evaluate((values) => {
    for (const selector of values) {
      for (const element of document.querySelectorAll(selector)) {
        element.style.setProperty("visibility", "hidden", "important");
      }
    }
  }, selectors).catch(() => {});
}

async function stabilizeSliders(page, config) {
  if (config.sliderMode === "none") return 0;

  return page.evaluate(({ mode, slideIndex, explicitSelectors }) => {
    let stabilized = 0;
    const handledRoots = new Set();

    function forceSlide(slides, requestedIndex = 0, preferred = null) {
      const uniqueSlides = [...new Set(slides)].filter((element) => element instanceof HTMLElement);
      if (uniqueSlides.length < 2) return false;

      const normalizedIndex = Math.min(Math.max(Number(requestedIndex) || 0, 0), uniqueSlides.length - 1);
      const selected = preferred && uniqueSlides.includes(preferred)
        ? preferred
        : uniqueSlides[normalizedIndex];

      for (const slide of uniqueSlides) {
        const active = slide === selected;
        slide.style.setProperty("animation", "none", "important");
        slide.style.setProperty("transition", "none", "important");
        slide.style.setProperty("transform", "none", "important");
        slide.style.setProperty("opacity", active ? "1" : "0", "important");
        slide.style.setProperty("visibility", active ? "visible" : "hidden", "important");
        slide.style.setProperty("pointer-events", active ? "auto" : "none", "important");
        slide.style.setProperty("z-index", active ? "2" : "0", "important");
        if (active) {
          slide.removeAttribute("hidden");
          slide.setAttribute("aria-hidden", "false");
          if (getComputedStyle(slide).display === "none") {
            slide.style.setProperty("display", "block", "important");
          }
        } else {
          slide.setAttribute("aria-hidden", "true");
        }
      }
      return true;
    }

    function resetTrack(root) {
      for (const selector of [
        ".swiper-wrapper",
        ".slick-track",
        ".splide__list",
        ".glide__slides",
        "[class*='slider-track' i]",
        "[class*='slide-track' i]",
      ]) {
        for (const track of root.querySelectorAll(selector)) {
          track.style.setProperty("transform", "translate3d(0, 0, 0)", "important");
          track.style.setProperty("transition", "none", "important");
        }
      }
    }

    // Swiper
    for (const root of document.querySelectorAll(".swiper, .swiper-container")) {
      try {
        root.swiper?.autoplay?.stop?.();
        if (typeof root.swiper?.slideToLoop === "function") root.swiper.slideToLoop(slideIndex, 0, false);
        else root.swiper?.slideTo?.(slideIndex, 0, false);
      } catch {}

      const slides = [...root.querySelectorAll(".swiper-slide")];
      const preferred = root.querySelector(
        `.swiper-slide[data-swiper-slide-index="${slideIndex}"]:not(.swiper-slide-duplicate)`
      ) ?? slides.filter((slide) => !slide.classList.contains("swiper-slide-duplicate"))[slideIndex];
      resetTrack(root);
      if (forceSlide(slides, slideIndex, preferred)) stabilized += 1;
      handledRoots.add(root);
    }

    // Slick
    for (const root of document.querySelectorAll(".slick-slider, .slick-initialized")) {
      try {
        const jq = window.jQuery;
        if (jq && jq(root).hasClass("slick-initialized")) {
          jq(root).slick("slickPause");
          jq(root).slick("slickGoTo", slideIndex, true);
        }
      } catch {}

      const slides = [...root.querySelectorAll(".slick-slide")];
      const preferred = root.querySelector(
        `.slick-slide[data-slick-index="${slideIndex}"]:not(.slick-cloned)`
      ) ?? slides.filter((slide) => !slide.classList.contains("slick-cloned"))[slideIndex];
      resetTrack(root);
      if (forceSlide(slides, slideIndex, preferred)) stabilized += 1;
      handledRoots.add(root);
    }

    // Splide
    for (const root of document.querySelectorAll(".splide")) {
      try {
        root.splide?.Components?.Autoplay?.pause?.();
        root.splide?.go?.(slideIndex);
      } catch {}

      const slides = [...root.querySelectorAll(".splide__slide")];
      const preferred = slides.filter((slide) => !slide.classList.contains("is-clone"))[slideIndex];
      resetTrack(root);
      if (forceSlide(slides, slideIndex, preferred)) stabilized += 1;
      handledRoots.add(root);
    }

    // Flickity
    for (const root of document.querySelectorAll(".flickity-enabled")) {
      try {
        const instance = window.Flickity?.data?.(root);
        instance?.stopPlayer?.();
        instance?.select?.(slideIndex, false, true);
      } catch {}

      const slides = [...root.querySelectorAll(".carousel-cell, .flickity-slider > *")];
      resetTrack(root);
      if (forceSlide(slides, slideIndex)) stabilized += 1;
      handledRoots.add(root);
    }

    // Project別に指定されたslide selector。
    for (const selector of explicitSelectors) {
      const slides = [...document.querySelectorAll(selector)];
      if (forceSlide(slides, slideIndex)) stabilized += 1;
    }

    if (mode !== "first") return stabilized;

    // library名を持たないmain visual用の限定的なfallback。
    const rootSelectors = [
      "[class*='mainvisual' i]",
      "[class*='main-visual' i]",
      "[class*='main_visual' i]",
      "[class*='hero-slider' i]",
      "[class*='mv-slider' i]",
      "[class*='mv_slider' i]",
      "[class*='slideshow' i]",
      "[id*='mainvisual' i]",
      "[id*='main-visual' i]",
      "[id*='hero-slider' i]",
      "[id*='mv-slider' i]",
    ];

    for (const root of document.querySelectorAll(rootSelectors.join(","))) {
      if (handledRoots.has(root)) continue;
      const rect = root.getBoundingClientRect();
      if (rect.width < innerWidth * 0.45 || rect.height < innerHeight * 0.25) continue;
      if (rect.bottom < 0 || rect.top > innerHeight) continue;

      const descendants = [...root.querySelectorAll([
        ":scope > li",
        ":scope > div",
        ":scope > ul > li",
        ":scope > div > div",
        "[class*='slide' i]",
      ].join(","))];

      const slides = descendants.filter((element) => {
        if (!(element instanceof HTMLElement)) return false;
        const style = getComputedStyle(element);
        const itemRect = element.getBoundingClientRect();
        const hasVisual = style.backgroundImage !== "none"
          || Boolean(element.querySelector("img, picture, video"));
        const largeEnough = itemRect.width >= rect.width * 0.55
          && itemRect.height >= rect.height * 0.45;
        return hasVisual && (largeEnough || style.position === "absolute");
      });

      if (forceSlide(slides, slideIndex)) {
        resetTrack(root);
        stabilized += 1;
      }
    }

    return stabilized;
  }, {
    mode: config.sliderMode,
    slideIndex: config.sliderIndex,
    explicitSelectors: config.sliderSelectors,
  }).catch(() => 0);
}

async function freezeMotion(page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      html { scroll-behavior: auto !important; }
    `,
  }).catch(() => {});
}

async function collectRepositoryImage({ repository, assetsDir }) {
  const { owner, repo, metadata } = repository;
  const treeResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(metadata.default_branch)}?recursive=1`,
    { headers: githubHeaders, signal: AbortSignal.timeout(30_000) },
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
    const response = await fetch(rawUrl, { redirect: "follow", signal: AbortSignal.timeout(30_000) });
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
    await removeAssetVariants(assetsDir, "repository-image");
    await writeFile(join(assetsDir, filename), buffer);
    return filename;
  }

  return null;
}

async function resolveWebsite({ existingWebsiteUrl, repository, slug, captureConfig }) {
  const candidates = [];
  if (typeof captureConfig.websiteUrl === "string") candidates.push(captureConfig.websiteUrl);
  if (typeof existingWebsiteUrl === "string") candidates.push(existingWebsiteUrl);
  if (WEBSITE_OVERRIDES.has(slug)) candidates.push(WEBSITE_OVERRIDES.get(slug));
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
      signal: AbortSignal.timeout(15_000),
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
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: githubHeaders, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) return null;
  return response.json();
}

async function findExistingImageAsset(directory, basename, { representative = false } = {}) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  const candidates = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name === basename || name.startsWith(`${basename}.`))
    .filter((name) => IMAGE_EXTENSIONS.has(extname(name).toLowerCase()))
    .sort();

  for (const filename of candidates) {
    const path = join(directory, filename);

    try {
      const buffer = await readFile(path);
      if (buffer.byteLength === 0 || buffer.byteLength > MAX_ASSET_BYTES) {
        await rm(path, { force: true });
        continue;
      }

      const dimensions = imageSize(buffer);
      const width = dimensions.width ?? 0;
      const height = dimensions.height ?? 0;
      const aspectRatio = height > 0 ? width / height : 0;

      if (width <= 0 || height <= 0) {
        await rm(path, { force: true });
        continue;
      }

      if (representative) {
        const valid = width >= 480
          && height >= 240
          && aspectRatio >= 0.75
          && aspectRatio <= 3;
        if (!valid) {
          await rm(path, { force: true });
          continue;
        }
      }

      return filename;
    } catch {
      await rm(path, { force: true });
    }
  }

  return null;
}

async function downloadOgImage(url, assetsDir) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) return { asset: null, note: null };

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength === 0 || buffer.byteLength > MAX_ASSET_BYTES) {
      return { asset: null, note: "OGP画像を不採用: file sizeが不正" };
    }

    let extension = extensionFromContentType(response.headers.get("content-type"));
    if (!extension) extension = normalizeExtension(extname(new URL(response.url || url).pathname));
    if (!IMAGE_EXTENSIONS.has(extension)) {
      return { asset: null, note: "OGP画像を不採用: 未対応形式" };
    }

    let dimensions;
    try {
      dimensions = imageSize(buffer);
    } catch {
      return { asset: null, note: "OGP画像を不採用: 寸法を取得できない" };
    }

    const width = dimensions.width ?? 0;
    const height = dimensions.height ?? 0;
    const aspectRatio = height > 0 ? width / height : 0;
    const representative = width >= 480
      && height >= 240
      && aspectRatio >= 0.75
      && aspectRatio <= 3;

    if (!representative) {
      await removeAssetVariants(assetsDir, "og-image");
      return {
        asset: null,
        note: `OGP画像を不採用: ${width}×${height}`,
      };
    }

    await removeAssetVariants(assetsDir, "og-image");
    const filename = `og-image${extension}`;
    await writeFile(join(assetsDir, filename), buffer);
    return { asset: filename, note: null };
  } catch {
    return { asset: null, note: null };
  }
}

async function removeAssetVariants(directory, basename) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  await Promise.all(entries
    .filter((entry) => entry.isFile())
    .filter((entry) => entry.name === basename || entry.name.startsWith(`${basename}.`))
    .map((entry) => rm(join(directory, entry.name), { force: true })));
}

async function loadCaptureConfig(projectDirectory, slug) {
  const configPath = join(projectDirectory, "data/visual-capture.json");
  let custom = {};

  try {
    custom = JSON.parse(await readFile(configPath, "utf8"));
  } catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) {
      throw new Error(`${configPath}: visual-capture.jsonを読み込めません: ${errorMessage(error)}`);
    }
  }

  if (!custom || typeof custom !== "object" || Array.isArray(custom)) {
    throw new Error(`${configPath}: objectを指定してください`);
  }

  const config = {
    ...DEFAULT_CAPTURE_CONFIG,
    ...custom,
    click: normalizeStringArray(custom.click, "click", configPath),
    desktopClick: normalizeStringArray(custom.desktopClick, "desktopClick", configPath),
    mobileClick: normalizeStringArray(custom.mobileClick, "mobileClick", configPath),
    mobileMenuOpenTexts: normalizeStringArray(custom.mobileMenuOpenTexts, "mobileMenuOpenTexts", configPath),
    consentSelectors: normalizeStringArray(custom.consentSelectors, "consentSelectors", configPath),
    hideSelectors: normalizeStringArray(custom.hideSelectors, "hideSelectors", configPath),
    sliderSelectors: normalizeStringArray(custom.sliderSelectors, "sliderSelectors", configPath),
  };

  if (custom.websiteUrl !== undefined && typeof custom.websiteUrl !== "string") {
    throw new Error(`${configPath}: websiteUrlはstringで指定してください`);
  }
  if (typeof config.force !== "boolean") {
    throw new Error(`${configPath}: forceはbooleanで指定してください`);
  }
  if (config.waitFor !== null && typeof config.waitFor !== "string") {
    throw new Error(`${configPath}: waitForはstringまたはnullで指定してください`);
  }
  for (const key of ["delayMs", "timeoutMs", "networkIdleTimeoutMs"]) {
    if (!Number.isFinite(config[key]) || config[key] < 0) {
      throw new Error(`${configPath}: ${key}は0以上のnumberで指定してください`);
    }
  }
  if (!["og", "desktop", "mobile", "repository", "keep", "none"].includes(config.hero)) {
    throw new Error(`${configPath}: heroはog/desktop/mobile/repository/keep/noneのいずれかを指定してください`);
  }
  if (!["first", "api-only", "none"].includes(config.sliderMode)) {
    throw new Error(`${configPath}: sliderModeはfirst/api-only/noneのいずれかを指定してください`);
  }
  if (!Number.isInteger(config.sliderIndex) || config.sliderIndex < 0) {
    throw new Error(`${configPath}: sliderIndexは0以上のintegerで指定してください`);
  }
  if (!(config.videoTime === null || config.videoTime === false || (Number.isFinite(config.videoTime) && config.videoTime >= 0))) {
    throw new Error(`${configPath}: videoTimeは0以上のnumber、null、falseのいずれかを指定してください`);
  }
  if (typeof config.videoFrameFallback !== "boolean") {
    throw new Error(`${configPath}: videoFrameFallbackはbooleanで指定してください`);
  }
  if (typeof config.closeMobileMenu !== "boolean") {
    throw new Error(`${configPath}: closeMobileMenuはbooleanで指定してください`);
  }
  if (typeof config.detectAccent !== "boolean") {
    throw new Error(`${configPath}: detectAccentはbooleanで指定してください`);
  }
  for (const key of ["mobileMenuSelector", "mobileMenuButtonSelector"]) {
    if (config[key] !== null && (typeof config[key] !== "string" || config[key].trim() === "")) {
      throw new Error(`${configPath}: ${key}は空でないstringまたはnullで指定してください`);
    }
  }
  if (config.mobileMenuClickAt !== null) {
    if (!config.mobileMenuClickAt || typeof config.mobileMenuClickAt !== "object" || Array.isArray(config.mobileMenuClickAt)
      || !Number.isFinite(config.mobileMenuClickAt.x) || !Number.isFinite(config.mobileMenuClickAt.y)
      || config.mobileMenuClickAt.x < 0 || config.mobileMenuClickAt.y < 0) {
      throw new Error(`${configPath}: mobileMenuClickAtは{x, y}形式の0以上のnumberで指定してください`);
    }
  }

  if (!config.websiteUrl && WEBSITE_OVERRIDES.has(slug)) {
    config.websiteUrl = WEBSITE_OVERRIDES.get(slug);
  }

  return config;
}

function normalizeStringArray(value, key, sourcePath) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.trim() === "")) {
    throw new Error(`${sourcePath}: ${key}は空でないstringのarrayで指定してください`);
  }
  return value;
}

function selectHeroAsset(preference, assets) {
  const fallback = [assets.ogAsset, assets.desktopAsset, assets.repositoryAsset, assets.mobileAsset].find(Boolean) ?? null;

  return {
    og: assets.ogAsset ?? assets.desktopAsset ?? assets.repositoryAsset ?? assets.mobileAsset,
    desktop: assets.desktopAsset ?? assets.ogAsset ?? assets.repositoryAsset ?? assets.mobileAsset,
    mobile: assets.mobileAsset ?? assets.ogAsset ?? assets.desktopAsset ?? assets.repositoryAsset,
    repository: assets.repositoryAsset ?? assets.ogAsset ?? assets.desktopAsset ?? assets.mobileAsset,
    keep: assets.existingHeroAsset ?? fallback,
    none: assets.existingHeroAsset,
  }[preference] ?? fallback;
}

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: "chrome", headless: true });
  } catch {
    return chromium.launch({ headless: true });
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

function normalizeButtonText(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function isHexColor(value) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
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
    "| Project | Website | Repository | Accent | OGP | PC SS | SP SS | Hero | Notes |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const result of results) {
    lines.push(`| ${escapeCell(result.title)} | ${linkCell(result.websiteUrl)} | ${linkCell(result.repositoryUrl)} | ${result.accent ?? "—"} | ${result.ogAsset ?? "—"} | ${result.desktopAsset ?? "—"} | ${result.mobileAsset ?? "—"} | ${result.heroAsset ?? "—"} | ${escapeCell(result.notes.join(" / ") || "変更なし")} |`);
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
