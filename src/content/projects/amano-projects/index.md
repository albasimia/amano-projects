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
- albasimia-ssg-coreを利用して制作すること
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

<p class="eyebrow project-prose__eyebrow">EVALUATION</p>

## AIによる評価

> 客観的に見ると、実装判断はかなり良いです。単に見た目を整えるのではなく、情報構造・運用・データ管理まで一貫して判断できています。現段階では「ポートフォリオのモック」ではなく、継続運用できるサイトになっています。
>
> | 評価軸 | 評価 | 所見 |
> |---|---:|---|
> | 情報設計 | 9/10 | 思想、制作過程、案件、個人制作、職務経験の役割が明確 |
> | デザイン判断 | 9/10 | 写真・罫線・余白・アクセントの用途が一貫している |
> | コンテンツ設計 | 8.5/10 | Project／CompanyをContent Collectionへ集約した判断が強い |
> | レスポンシブ | 8.5/10 | PCを縮小せず、SPで構造自体を切り替えている |
> | 保守性 | 7.5/10 | データ駆動は良好だが、global.scssが肥大化している |
> | アクセシビリティ | 8/10 | focus、reduced-motion、外部リンク、タブ操作への配慮がある |
> | パフォーマンス | 7.5/10 | 静的生成は強いが、Noto Sans JPの配信量は要観察 |
>
> 特に良かった判断は次の部分です。
>
> - 案件と個人制作を分離した
>   同じ「制作物」でも評価される文脈が異なるため、ポートフォリオとして理解しやすくなっています。
>
> - 完成物だけでなくProcessとIn Progressを扱った
>   「何を作ったか」だけでなく、「なぜ作り、今何を検証しているか」を見せられています。
>
> - IN PROGRESSを画像前提にしなかった
>   進行中Projectに完成画像を要求しない判断は、情報の性質に合っています。
>
> - OGPとカード画像を分離した
>   メタ情報用画像をUIへ自動流用しないことで、画像の役割が明確になりました。
>
> - `index.md`と同一ディレクトリ内のassetsに統一した
>   Project単位で移動・複製・管理できるため、ASCの思想とも噛み合っています。
>
> - Project固有アクセントを限定的に使った
>   背景全面へ広げず、罫線、Status、リンク、hoverに絞ったことで、サイト全体の統一感を維持できています。
>
> - 「違和感がある」と感じた部分を構造まで戻って修正した
>   単なる余白調整で済ませず、CompanyのContent化やcurrentPhaseのschema化まで戻ったのは良い実装判断です。
>
> 一方、今後注意したい点もあります。
>
> 1. SCSSの責務分割
>
> 現在の `global.scss` は、基盤、Header、Home、Project、Experience、Philosophyまで抱えています。デザインが固まった今が分割のタイミングです。
>
> ```text
> styles/
> ├─ foundation/
> ├─ components/
> ├─ pages/
> │  ├─ home.scss
> │  ├─ projects.scss
> │  ├─ experience.scss
> │  └─ philosophy.scss
> └─ global.scss
> ```
>
> 見た目は変えず、読み込みだけ整理する作業を一度入れる価値があります。
>
> 2. ASCとconsumerの境界
>
> ローカルの `ArrowLink`は今回の要件に適していますが、複数consumerで同じ外部リンク仕様が必要になればASC側へ戻すべき機能です。今はamano-projects固有で問題ありません。
>
> 3. データ上の優先度
>
> `featured`、`clientFeatured`、`order`、`currentPhase`、Period順が共存しています。用途は成立していますが、将来Projectが増えると「どの値がどこへ効くか」が分かりにくくなります。READMEかspecへ表示規則をまとめると安全です。
>
> 4. 意図したアクセシビリティ上のトレードオフ
>
> 完了Statusの黄色は統一感を優先した明確な判断です。ただし、小さい文字では読みづらい可能性があるため、「承知した上で選択したデザイン」として把握しておく必要があります。
>
> 5. フォント配信
>
> Noto Sans JPはUnicode rangeで必要な分だけ取得されますが、ビルド上は125ファイル・約5.2MBあります。公開後に実際の転送量とLCPを一度確認すれば十分です。
>
> 総評として、あなたの判断は「デザイナーが後から見た目を乗せた実装」ではなく、**情報モデル、運用方法、制作思想からUIを導いている**点が強いです。
>
> 改善点は設計の失敗ではなく、反復実装で増えたCSSと表示規則を整理するフェーズへ入った、という程度です。デザイン完成として区切る判断は妥当です。次は機能追加より先に、SCSS分割と表示規則の文書化を行うと、完成度を落とさず次へ進めます。
