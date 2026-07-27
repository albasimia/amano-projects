---
title: ワタリEA
slug: watari-ea
summary: イベントの告知と記録を、ひとつのGit管理された静的サイトへまとめる取り組み。
origin: 告知がSNSへ流れ、開催後の記録が残りにくい状況から始まった。
intention: イベントの前後を通して情報へ辿り着ける、継続可能なアーカイブへ変える。
status: operation
interfaces:
  - creative-to-engineering
fields:
  - Event
  - Web
  - Archive
technologies:
  - Astro
  - TypeScript
  - Cloudflare Pages
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
websiteUrl: https://catharsiswatari-events.pages.dev/
relatedProjects:
  - yasai-toretore
  - albasimia-ssg-core
---

## Origin

イベントの告知はSNS上で流れやすく、開催後の情報も複数の投稿へ分散していました。告知と記録を同じ場所に残し、次の開催や別の企画へ経験をつなげる必要がありました。

## Ideal Experience

開催前には必要な情報へ迷わず到達でき、開催後には何が行われたかを振り返れる状態を目指しました。

## Conditions

- Gitを正本として履歴を残せること
- 静的配信で運用負荷を抑えること
- イベントごとの表現を許容しつつ、情報構造を揃えること
- スマートフォンで告知情報を読みやすいこと

## Interfaces

Creative Identityが現場でイベントを企画・観測し、Engineering Identityが情報構造と公開基盤へ変換しています。

## Decisions

SNSだけに情報を置かず、Astroによる静的サイトとGit管理のコンテンツを採用しました。イベント固有の表現と、共通のデータ構造を分離しています。

## Implementation

Astro Content Collectionsでイベントデータを検証し、GitHub ActionsとCloudflare Pagesで配信します。管理機能もデータベースを正本にせず、GitHub上のファイルを編集する構成です。

## Verification

実イベントの告知・開催記録を継続して掲載しながら、モバイル表示、テーマ、更新手順を検証しています。

## Reconsideration

イベントサイトで得た共通機能を、複数サイトから利用できるASCへ切り出しました。

## Social Connection

イベントへ参加する人、出演者、会場と、開催前後を通じて情報を共有する接点として運用しています。

## Learning

共通化すべきものは見た目ではなく、データ検証、公開、更新といった責務であると分かりました。
