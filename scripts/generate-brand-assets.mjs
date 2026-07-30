import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const fontPath = fileURLToPath(new URL("../public/fonts/WatarinoTsunoGothic-Regular.woff2", import.meta.url));
const heroPath = fileURLToPath(new URL("../public/images/home-hero-desktop.jpg", import.meta.url));
const faviconPath = fileURLToPath(new URL("../public/favicon.png", import.meta.url));
const ogPath = fileURLToPath(new URL("../public/og.png", import.meta.url));

const [font, hero] = await Promise.all([readFile(fontPath), readFile(heroPath)]);
const fontUrl = `data:font/woff2;base64,${font.toString("base64")}`;
const heroUrl = `data:image/jpeg;base64,${hero.toString("base64")}`;
const systemChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  ?? (existsSync(systemChrome) ? systemChrome : undefined);
const browser = await chromium.launch({ headless: true, executablePath });

try {
  const faviconPage = await browser.newPage({ viewport: { width: 512, height: 512 } });
  await faviconPage.setContent(`
    <!doctype html>
    <html lang="ja">
      <style>
        @font-face {
          font-family: "Watarino Tsuno Gothic";
          src: url("${fontUrl}") format("woff2");
        }
        * { box-sizing: border-box; }
        html, body { width: 100%; height: 100%; margin: 0; background: transparent; }
        #asset { width: 512px; height: 512px; display: grid; place-items: center; }
        .tile {
          width: 448px;
          height: 448px;
          display: grid;
          place-items: center;
          border-radius: 96px;
          color: #171717;
          background: #fff;
        }
        .glyph {
          font-family: "Watarino Tsuno Gothic", sans-serif;
          font-size: 316px;
          font-weight: 400;
          line-height: 1;
          transform: translateY(-5px);
        }
      </style>
      <body><div id="asset"><div class="tile"><span class="glyph">ア</span></div></div></body>
    </html>
  `);
  await faviconPage.evaluate(() => document.fonts.ready);
  await faviconPage.locator("#asset").screenshot({ path: faviconPath, omitBackground: true });

  const ogPage = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await ogPage.setContent(`
    <!doctype html>
    <html lang="ja">
      <style>
        @font-face {
          font-family: "Watarino Tsuno Gothic";
          src: url("${fontUrl}") format("woff2");
        }
        * { box-sizing: border-box; }
        html, body { width: 100%; height: 100%; margin: 0; }
        #asset { position: relative; width: 1200px; height: 630px; overflow: hidden; background: #f4f2ec; }
        .photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
        .overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(244, 242, 236, .99) 0%, rgba(244, 242, 236, .94) 24%, rgba(244, 242, 236, .52) 42%, rgba(244, 242, 236, 0) 66%),
            linear-gradient(0deg, rgba(244, 242, 236, .48) 0%, rgba(244, 242, 236, 0) 42%);
        }
        .brand {
          position: absolute;
          top: 291px;
          left: 54px;
          display: flex;
          align-items: center;
          color: #171717;
          line-height: 1;
          white-space: nowrap;
        }
        .amano {
          font-family: "Watarino Tsuno Gothic", sans-serif;
          font-size: 66px;
          font-weight: 400;
        }
        .projects {
          margin-left: .12em;
          font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
          font-size: 56px;
          letter-spacing: .01em;
        }
      </style>
      <body>
        <div id="asset">
          <img class="photo" src="${heroUrl}" alt="" />
          <div class="overlay"></div>
          <div class="brand"><span class="amano">アマノ</span><span class="projects">PROJECTS</span></div>
        </div>
      </body>
    </html>
  `);
  await ogPage.evaluate(() => document.fonts.ready);
  await ogPage.locator("#asset").screenshot({ path: ogPath });
} finally {
  await browser.close();
}

console.log("Generated public/favicon.png");
console.log("Generated public/og.png");
