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


Projectカードには、frontmatterで明示した`heroImage`だけを使用します。`heroImage`がない場合は、Projectの`accent`を背景色としたプレースホルダーを表示します。`assets/img/ogp.*`と`assets/img/og-image.*`はSNS共有用として保持しますが、カード画像には自動利用しません。

Project詳細ページへスクリーンショットを表示する場合は、規定名の画像を配置し、`index.md`でPC版とSP版を個別に有効化します。

```text
assets/img/
├─ screenshot-desktop.jpg
└─ screenshot-mobile.jpg
```

```yaml
screenshots:
  desktop: true
  mobile: true
```

`screenshots`には任意のキーを追加できます。キー`app`を有効にした場合は、同じキーを持つ`assets/img/screenshot-app.*`を表示します。

```text
assets/img/
└─ screenshot-app.png
```

```yaml
screenshots:
  desktop: false
  mobile: false
  app: true
```

キーには小文字英数字とハイフンを使用します。`false`または未指定のスクリーンショットは表示しません。表示対象の画像が存在しない場合は、Asset同期時にエラーになります。

同じエリアへYouTube動画を表示する場合は、11文字の動画IDとiframe用のタイトルを指定します。動画にはプライバシー強化版のYouTube埋め込みURLを使用します。

```yaml
youtubeVideos:
  demo:
    videoId: nvRCi3HtjGg
    title: We are the Makoto
```

### アクセントカラーの自動取得

Projectの公開サイトからアクセントカラーを検出し、frontmatterの`accent`へ設定できます。通常は明示済みの`accent`を保護し、未設定のProjectだけを更新します。

Projectを指定して、未設定のアクセントカラーだけを取得します。

```sh
npm run collect:visuals:accent -- technonex-corporate
```

既存の`accent`も再検出して更新する場合は、`--force-accent`を指定します。

```sh
npm run collect:visuals:accent -- --force-accent technonex-corporate
```

利用可能なオプションは、次のコマンドで確認できます。

```sh
npm run collect:visuals:accent -- --help
```

Project slugを省略すると、対象となるすべてのProjectを処理します。アクセントカラー専用コマンドでは、OGPやスクリーンショットを更新しません。

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
