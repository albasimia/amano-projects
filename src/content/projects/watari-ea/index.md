---
title: ワタリEA
slug: watari-ea
summary: イベント告知、開催記録、管理画面、GitOps運用をひとつにまとめた静的イベントサイト基盤。
origin: 告知がSNSへ流れ、開催後の記録も分散する状況から始まった。
intention: 開催前後を通して情報へ辿り着ける、継続可能なイベントアーカイブへ変える。
status: operation
interfaces:
  - creative-to-engineering
fields:
  - イベント
  - Web
  - アーカイブ
technologies:
  - Astro
  - TypeScript
  - React
  - Cloudflare Pages
  - Cloudflare Pages Functions
  - GitHub Actions
roles:
  - 企画
  - 情報設計
  - デザイン
  - 実装
  - 運用
featured: true
order: 10
startedAt: "2025"
repositoryUrl: https://github.com/albasimia/catharsiswatari-events
websiteUrl: https://catharsiswatari-events.pages.dev/
relatedProjects:
  - yasai-toretore
  - albasimia-ssg-core
draft: false
---

<p class="eyebrow project-prose__eyebrow">ORIGIN</p>

## 発端

イベント告知はSNS上で流れやすく、開催後の情報も複数の投稿へ分散していました。告知と記録を同じ場所に残し、次の開催や別の企画へ経験をつなげる必要がありました。

<p class="eyebrow project-prose__eyebrow">IDEAL EXPERIENCE</p>

## 目指した体験

開催前には必要な情報へ迷わず到達でき、開催後には何が行われたかを振り返れる状態を目指しました。

<p class="eyebrow project-prose__eyebrow">CONDITIONS</p>

## 成立条件

- Gitを正本として履歴を残せること
- 静的配信で運用負荷を抑えること
- イベントごとの表現を許容しつつ、情報構造を揃えること
- 非技術者でも管理画面から更新できること
- 管理画面と公開画面の責務を分けること
- モバイルで読みやすいこと

<p class="eyebrow project-prose__eyebrow">INTERFACES</p>

## 接続方法

Creative Identityが現場でイベントを企画・観測し、Engineering Identityが情報構造と公開基盤へ変換しています。

<p class="eyebrow project-prose__eyebrow">DECISIONS</p>

## 判断

SNSだけに情報を置かず、Astroによる静的サイトとGit管理のコンテンツを採用しました。公開ページは静的HTML、管理画面はReact SPA、管理APIはCloudflare Pages Functionsとして分離しています。

<p class="eyebrow project-prose__eyebrow">IMPLEMENTATION</p>

## 実装

Astro Content Collectionsでイベントデータを検証し、GitHub ActionsとCloudflare Pagesで配信します。管理画面からGitHub上のMarkdown、YAML、画像を更新し、差分確認、競合検知、Actions進行状況の確認まで行える構成です。

<p class="eyebrow project-prose__eyebrow">VERIFICATION</p>

## 検証

実イベントの告知・開催記録を継続して掲載しながら、モバイル表示、テーマ、更新手順、管理画面、GitHub連携を検証しています。

<p class="eyebrow project-prose__eyebrow">RECONSIDERATION</p>

## 前提の見直し

イベントサイトで得た共通機能を、複数サイトから利用できるASCへ切り出しました。

<p class="eyebrow project-prose__eyebrow">SOCIAL CONNECTION</p>

## 社会との接続

イベントへ参加する人、出演者、会場と、開催前後を通じて情報を共有する接点として運用しています。

<p class="eyebrow project-prose__eyebrow">LEARNING</p>

## 得られたこと

共通化すべきものは見た目ではなく、データ検証、公開、更新、認証、Git操作といった責務であると分かりました。
