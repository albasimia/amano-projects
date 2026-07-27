# AMANO PROJECT

課題の発見、構造化、実装、検証までの過程を記録するポートフォリオサイトです。Astroで静的生成し、共通のSite Meta、BaseLayout、sitemapには`albasimia-ssg-core`（ASC）を利用します。

## 開発

Node.js 22.12.0以上を使用します。

```sh
npm install
npm run dev
```

公開URLを含むcanonical、OGP、sitemap、robots.txtを確認する場合は、`SITE_URL`を指定します。

```sh
cp .env.example .env
```

```env
SITE_URL=https://example.com
```

## 検証

```sh
npm run check
npm run build
```

## コンテンツ

Projectは`src/content/projects/`のMarkdownで管理します。frontmatterには一覧、メタ情報、関連Projectなどの構造化データを置き、本文には制作過程を記述します。

```text
src/content/projects/
├─ watari-ea.md
├─ yasai-toretore.md
├─ kakasshy.md
├─ karirenjan.md
└─ albasimia-ssg-core.md
```

schemaは`src/content.config.ts`、取得と関連Project検証は`src/lib/projects.ts`にあります。未公開Projectには`draft: true`を設定します。

## ASCとの境界

ASCから利用しているもの：

- SiteConfigとページメタ情報
- HTML head、canonical、OGP、Twitter Card
- BaseLayout
- sitemap生成

アマノPJ側に保持するもの：

- Project schemaとコンテンツ
- Header、Footer、Hero、ProjectCard
- Identity、Process、Career Phase
- ブランド固有のコピーとスタイル

テーマ状態、SkipLink、Containerなどの小さなUI基盤は、ASC `v0.1.3`の公開componentを利用します。アマノPJ側ではASC tokenをブランド固有の色、書体、余白へ接続し、Header、Footer、ProjectCardなど固有の情報構造だけを保持します。
