---
title: albasimia-ssg-core
slug: albasimia-ssg-core
summary: 複数の静的サイトで再利用できる、AstroとGitOpsの共通基盤。
origin: ワタリEAで実装した共通責務を、サイト固有実装から分離する必要が生まれた。
intention: 一度設計した基盤を、異なるProjectで育て続けられる形へ変える。
status: operation
fields:
  - 設計構造
  - 静的サイト
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
startedAt: "2026.7"
repositoryUrl: https://github.com/albasimia/albasimia-ssg-core
relatedProjects:
  - amano-projects
  - watari-ea
draft: false
---

<p class="eyebrow project-prose__eyebrow">ORIGIN</p>

## 発端

ワタリEAの制作を通して、SEO、静的配信、GitHub上のコンテンツ操作など、他のサイトでも再利用できる責務が見えてきました。

<p class="eyebrow project-prose__eyebrow">IDEAL EXPERIENCE</p>

## 目指した体験

静的サイト運用における、公開、編集、検証のための基盤を、シンプルかつ低コストで再利用できる形で実装します。

<p class="eyebrow project-prose__eyebrow">CONDITIONS</p>

## 成立条件

- Astroによる静的生成を維持すること
- Gitを正本とすること
- 固有名詞や業務ロジックを持ち込まないこと
- 公開APIを小さく保つこと

<p class="eyebrow project-prose__eyebrow">DECISIONS</p>

## 判断

ルートからの一括exportを設けず、機能境界ごとのサブパスを公開しています。利用側へ不要なビルド依存を要求しないため、CSSやLayoutは生成済み成果物として配布します。

<p class="eyebrow project-prose__eyebrow">IMPLEMENTATION</p>

## 実装

Site Meta、sitemap、content source、Git content、deployment status、BaseLayout、共通CSSをパッケージとして提供しています。

<p class="eyebrow project-prose__eyebrow">VERIFICATION</p>

## 検証

パッケージ化した成果物とGitHub tagの双方を一時的な利用環境へインストールし、Astroのビルドを検証しています。

<p class="eyebrow project-prose__eyebrow">LEARNING</p>

## 得られたこと

パッケージ内部の完成だけでなく、何も導入していない利用環境から使用できることを検証条件に含める必要があります。
