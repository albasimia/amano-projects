---
title: albasimia-ssg-core
slug: albasimia-ssg-core
summary: 複数の静的サイトで再利用できる、AstroとGitOpsの共通基盤。
origin: ワタリEAで実装した共通責務を、サイト固有実装から分離する必要が生まれた。
intention: 一度設計した基盤を、異なるProjectで育て続けられる形へ変える。
status: development
interfaces:
  - engineering
fields:
  - Architecture
  - Static Site
  - GitOps
technologies:
  - Astro
  - TypeScript
  - GitHub API
  - Cloudflare Pages
roles:
  - 設計
  - 実装
  - テスト
  - ドキュメント
featured: false
order: 50
startedAt: "2026"
repositoryUrl: https://github.com/albasimia/albasimia-ssg-core
relatedProjects:
  - watari-ea
draft: false
---

## Origin

ワタリEAの制作を通して、SEO、静的配信、GitHub上のコンテンツ操作など、他のサイトでも再利用できる責務が見えてきました。

## Ideal Experience

派生サイトが固有のコンテンツと表現へ集中しながら、公開、更新、検証の基盤を再利用できる状態を目指します。

## Conditions

- Astroによる静的生成を維持すること
- Gitを正本とすること
- 固有名詞や業務ロジックを持ち込まないこと
- 公開APIを小さく保つこと

## Decisions

root exportを設けず、機能境界ごとのsubpathを公開しています。consumerへ不要なビルド依存を要求しないため、CSSやLayoutは生成済み成果物として配布します。

## Implementation

Site Meta、sitemap、content source、Git content、deployment status、BaseLayout、共通CSSをpackageとして提供しています。

## Verification

packed packageとGitHub tagの双方を、一時consumerへインストールしてAstro buildを検証しています。

## Learning

package内部の完成だけでなく、cleanなconsumerから利用できることを検証条件に含める必要があります。
