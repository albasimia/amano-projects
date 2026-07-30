---
title: アマノ Projects
slug: amano-projects
summary: 成果物の一覧ではなく、発端から判断、検証、学びまでをProjectとして見せるポートフォリオサイト。
origin: Web制作、個人開発、DJ、農業などを横断する活動が、職種や成果物だけでは一つの経歴として伝わりにくかった。
intention: 異なる活動の背景にある課題発見と構造設計を、Projectという共通単位で伝える。
status: operation
fields:
  - ポートフォリオ
  - 情報設計
  - 静的サイト
technologies:
  - Astro
  - TypeScript
  - Sass
  - GitHub API
  - Cloudflare Pages
  - albasimia-ssg-core
roles:
  - コンセプト設計
  - 情報設計
  - デザイン
  - 実装
  - コンテンツ制作
startedAt: "2026.7"
repositoryUrl: https://github.com/albasimia/amano-projects
# websiteUrl: https://amano-projects.pages.dev/
relatedProjects:
  - albasimia-ssg-core
  - watari-ea
draft: false
accent: "#d84a24"
heroImage:
  asset: img/og-image.png
  alt: Amano Projectsの代表画像
---

<p class="eyebrow project-prose__eyebrow">ORIGIN</p>

## 発端

これまでの活動には、Webサイトやアプリだけでなく、入力デバイス、イベント、農業、書体制作などが含まれます。成果物の種類で分類するだけでは、それらを生み出した課題発見や判断の共通性が見えにくい状態でした。

<p class="eyebrow project-prose__eyebrow">IDEAL EXPERIENCE</p>

## 目指した体験

肩書きから経歴を読むのではなく、一つひとつのProjectを入口に、その背景、成立条件、設計判断、検証、次の制作への接続を辿れるポートフォリオを目指しました。

<p class="eyebrow project-prose__eyebrow">INFORMATION ARCHITECTURE</p>

## 情報設計

Projectを基本単位とし、Creative Identity、Engineering Identity、職務経験を固定的な分類ではなく、活動へ接続するためのInterfaceとして扱っています。

<p class="eyebrow project-prose__eyebrow">CONDITIONS</p>

## 成立条件

- 成果物の完成度だけでなく、制作過程の判断を記録すること
- 個人活動と職務経験を同じProject構造で扱えること
- Gitをコンテンツの正本とすること
- 静的配信を維持し、低コストで運用できること
- Projectを追加してもサイト構造が崩れないこと

<p class="eyebrow project-prose__eyebrow">DECISIONS</p>

## 判断

各ProjectをMarkdownと画像で管理し、frontmatterに概要、発端、意図、状態、分野、技術、役割、関連Projectを持たせています。表示順はコンテンツ自体から分離し、サイト上の役割ごとに選定できる構成としました。

<p class="eyebrow project-prose__eyebrow">IMPLEMENTATION</p>

## 実装

Astroによる静的生成を基盤に、共通機能を `albasimia-ssg-core` から利用しています。コンテンツと画像をProject単位で同じディレクトリへまとめ、ビルド時に検証と公開用アセットの同期を行います。

<p class="eyebrow project-prose__eyebrow">VERIFICATION</p>

## 検証

Cloudflare Pages上で公開し、PCとスマートフォンの表示、Project間の関連、コンテンツ追加時の型検証、GitOpsによる更新フローを確認しています。

<p class="eyebrow project-prose__eyebrow">LEARNING</p>

## 得られたこと

活動を無理に一つの肩書きへ収束させなくても、発端から検証までの構造を揃えることで、異なる制作を同じ人物の連続した経験として提示できます。
