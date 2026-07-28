# アマノPROJECTS

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

ProjectとCompanyは、どちらも`src/content/{collection}/{slug}/`単位で管理します。各Markdownのfrontmatterに構造化データを置き、画像などが必要なContentだけ、同じディレクトリに`assets/`を作成します。

```text
src/content/projects/
└─ watari-ea/
   ├─ index.md
   └─ assets/
      ├─ hero.webp
      └─ gallery-01.webp

src/content/companies/
└─ kayac/
   ├─ index.md
   └─ assets/
      └─ hero.webp
```

Hero画像は`index.md`から`assets/`内の相対パスで参照します。

```yaml
heroImage:
  asset: hero.webp
  alt: ワタリEAのメインビジュアル
  position: center
```

`npm run dev`、`npm run check`、`npm run build`の前に、ASCのContent Asset同期が自動実行されます。画像は`public/images/{collection}/{slug}/`へ生成されますが、この出力はGit管理しません。存在しない参照画像、不正な相対パス、ディレクトリ名と`slug`の不一致はビルド前にエラーになります。

schemaは`src/content.config.ts`、取得と関連Project検証は`src/lib/projects.ts`、Asset同期は`scripts/sync-content-assets.mjs`にあります。未公開Projectには`draft: true`を設定します。

## ASCとの境界

ASCから利用しているもの：

- SiteConfigとページメタ情報
- HTML head、canonical、OGP、Twitter Card
- BaseLayout
- sitemap生成
- Project画像の同期、公開URL生成、参照検証

アマノPJ側に保持するもの：

- Project schemaとコンテンツ
- Header、Footer、Hero、ProjectCard
- Identity、Process、Career Phase
- ブランド固有のコピーとスタイル

テーマ状態、SkipLink、Containerなどの小さなUI基盤は、ASC `v0.1.5`の公開componentを利用します。アマノPJ側ではASC tokenをブランド固有の色、書体、余白へ接続し、Header、Footer、ProjectCardなど固有の情報構造だけを保持します。
