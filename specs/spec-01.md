# アマノPJ 初期実装

アマノPJの実制作に入る。

このタスクでは、既存の「ワタリEA」のデザインと実装を参照しながら、ポートフォリオサイト「アマノPJ」の初期構造を実装する。

## 前提

* アマノPJはAstroベースの静的サイトとする
* GitOpsを前提とし、Cloudflare Pages等の静的ホスティングへ接続可能な構成を維持する
* ワタリEAと共通化できる実装は `albasimia-ssg-core`（以下ASC）へ切り出す
* アマノPJ固有のコンテンツ・デザイン判断をASCへ混入させない
* 現在のリポジトリ構造、ASCの実装、ワタリEAの実装を先に確認してから変更する
* 不明点を推測で大きく作り込まず、既存実装との整合性を優先する

参照サイト：

https://catharsiswatari-events.pages.dev/

デザインは上記ワタリEAを踏襲するが、イベントサイトをそのまま複製するのではなく、同じデザインシステムを使ったポートフォリオとして再構成する。

---

# 1. 最初に行う調査

実装前に以下を確認する。

1. アマノPJの現在のファイル構成
2. ASCの現在の公開APIとディレクトリ構成
3. ワタリEAで使われている以下の実装

   * Base Layout
   * Header
   * Navigation
   * Footer
   * Light / Dark / Autoテーマ切替
   * CSS変数
   * タイポグラフィ
   * 余白設計
   * コンテンツ幅
   * カードUI
   * リンク・ボタン・矢印表現
   * レスポンシブ対応
   * SEO関連コンポーネント
   * アクセシビリティ対応
4. ワタリEA固有実装と、他サイトでも再利用できる実装の境界

調査後、実装へ入る前に簡潔に以下を報告する。

* ASCへ移すもの
* アマノPJ側に残すもの
* 既存ASCを変更せず利用できるもの
* 破壊的変更の可能性
* 今回の実装手順

ただし、明白な範囲について承認待ちで停止せず、そのまま実装を進める。

---

# 2. アマノPJの目的

アマノPJは、完成した成果物を並べるだけのポートフォリオではない。

各Projectについて、次の過程を見せる。

* 発端
* 課題発見
* 理想の体験
* 成立条件
* 判断
* 設計
* 制作
* 検証
* 前提の問い直し
* 社会への接続
* 学び

中心メッセージは以下。

> どのような思考で課題を発見し、構造化し、実装したか

サイト全体の情報構造は、次の循環を表現する。

```text
同じ人間が
異なるInterfaceを通して現実へ接続し、
そこで得た経験をProjectへ変換する
```

---

# 3. ページ構成

今回は次の4系統を実装する。

```text
/
├─ Home
├─ Projects
│  ├─ Project一覧
│  └─ Project詳細
├─ About
└─ Experience
```

Contactページは作成しない。

必要なルートの例：

```text
/
 /projects/
 /projects/[slug]/
 /about/
 /experience/
```

404ページが既存構成で必要なら用意する。

---

# 4. デザイン方針

## 基本方針

ワタリEAの以下の印象を維持する。

* モノクロを基調とする
* 太く明確なタイポグラフィ
* 大きな英字見出し
* 日本語本文との対比
* 線と余白による区切り
* 装飾より情報構造を優先する
* Light / Dark / Autoに対応する
* カード全体を過剰に箱で囲わない
* 矢印や罫線をナビゲーションとして使用する
* PCとスマートフォンの双方で読みやすくする
* ワタリEAと並べた時に同じ作者・同じ基盤だと分かる
* ただしイベントサイト特有の祝祭感や固有ビジュアルは持ち込まない

## アマノPJ側での調整

ワタリEAよりも長文を読むサイトになるため、次を考慮する。

* 本文の可読幅を制限する
* 見出し階層を明確にする
* 長いProject詳細でも現在位置を見失わない
* メタ情報と本文を視覚的に分離する
* 思想的な文章と技術的な事実情報を同じ密度で並べない
* Project間の関連を辿りやすくする

既存デザインを踏襲しつつ、ポートフォリオとして必要な可読性を追加する。

---

# 5. ASCへ共通化する範囲

共通化の判断基準は、

> ワタリEA、アマノPJ、将来のイベントサイトやサービスLPでも、固有名詞や固有コンテンツに依存せず利用できるか

とする。

## ASC候補

既存実装を確認した上で、原則として以下をASC側の責務とする。

### Site shell

* HTMLドキュメントの基本構造
* 共通head
* SEOの基礎
* viewport
* canonical
* OGPの基本インターフェース
* favicon等を受け取るためのインターフェース
* skip link
* main領域
* Header / Footerを配置できるBase Layout

### Theme

* Light / Dark / Auto切替
* 初期テーマ決定
* localStorageへの保存
* OS設定への追従
* FOUCの抑制
* テーマ切替UIの基本ロジック
* アクセシブルな状態表現

ラベルや表示位置など、サイト固有の見せ方はアプリ側から設定可能にする。

### Design tokens

* foreground / background
* muted
* border
* accent
* font family
* font size scale
* line height
* spacing
* content width
* breakpoint
* transition

ただしASCが特定サイトの色・書体を強制しないよう、CSS変数をアプリ側から上書きできる設計にする。

### Primitive components

必要性が確認できたものだけを共通化する。

例：

* Container
* Section
* SectionHeader
* TextLink
* ArrowLink
* Tag
* MetaList
* ThemeSwitcher
* SkipLink
* VisuallyHidden

以下は、抽象化が不自然なら無理にASCへ入れない。

* ProjectCard
* Identity表示
* Career Phase
* Project本文セクション
* アマノPJ固有のHero
* イベント固有カード
* 出演者カード

## 禁止事項

* アマノPJ固有の文言をASCへ入れない
* ワタリEA固有の名称やイベントデータをASCへ入れない
* ASC内で利用サイトを条件分岐しない
* `site === 'amano'` のような分岐を作らない
* 見た目が似ているだけのコンポーネントを無理に統合しない
* 巨大な万能コンポーネントを作らない
* 共通化のために各サイト側の可読性を下げない
* 現時点で利用箇所が一つしかなく、再利用性が確認できないものを先回りして抽象化しすぎない

共通化は「見た目の一致」ではなく「責務の一致」を基準にする。

---

# 6. Home

以下の順で構成する。

## Hero

メインコピー：

```text
作らなくていいなら作りたくない。
でも作らずにはいられない。
```

導入文：

```text
現実の中で心が動いたことから課題を見つけ、
体験を構想し、成立条件を整理し、
必要な技術と領域を越境して実装する。

アマノPJは、その過程を記録するポートフォリオです。
```

補助表記：

```text
AMANO PROJECT
Web Engineer / Frontend Developer
```

CTA：

* PROJECTS
* ABOUT

## Process

トップでは制作サイクルを3段階に圧縮して表示する。

```text
OBSERVE
心が動く／課題を発見する

STRUCTURE
体験と成立条件を構造化する

IMPLEMENT & VERIFY
実装し、現実世界で検証する
```

Aboutへの導線を置く。

## Featured Projects

初期データとして以下を表示する。

1. ワタリEA
2. やさいとれとれ祭り
3. かかっしー
4. カリレンジャン

カードには最低限、以下を表示する。

* Project名
* 発端を示す短文
* 何を変えようとしたか
* 関与Interface
* Status
* 詳細リンク

Projectデータが未完成の場合、仮のサマリーをデータファイル側へ置く。コンポーネント内へ直接文章を埋め込まない。

## Identities

見出し：

```text
IDENTITIES
One person, different interfaces.
```

表示内容：

```text
LEGAL IDENTITY
天野 浩平
社会と契約する入口

CREATIVE IDENTITY
ｶﾀﾙｼｽﾜﾀﾘ
現実を経験し、課題を観測する入口

ENGINEERING IDENTITY
albasimia
課題を構造化し、実装する入口
```

Aboutへの導線を置く。

## Experience導入

本文：

```text
この制作方法は、
個人活動だけで生まれたものではありません。

Web制作、VR、業務システム、CMS、
クライアントとの要件定義、チーム運用改善を通して、
現場と実装を往復する方法として形成されました。
```

Experienceへの導線を置く。

ページ末尾にContact導線は置かない。

---

# 7. Projects一覧

Projectsを作品一覧ではなく、課題と制作過程への索引として実装する。

各Projectはデータから生成する。

最低限のデータ項目：

```ts
type ProjectStatus =
  | 'observation'
  | 'concept'
  | 'development'
  | 'verification'
  | 'operation'
  | 'paused'
  | 'completed'

type ProjectInterface =
  | 'creative'
  | 'engineering'
  | 'creative-to-engineering'

type Project = {
  title: string
  slug: string
  summary: string
  origin: string
  intention: string
  status: ProjectStatus
  interfaces: ProjectInterface[]
  fields: string[]
  technologies: string[]
  featured: boolean
  order: number
  startedAt?: string
  endedAt?: string
  repositoryUrl?: string
  websiteUrl?: string
  heroImage?: string
  draft?: boolean
}
```

Astro Content Collectionsを使用する場合は、現行Astroの推奨方式と既存プロジェクトの設計に合わせる。

一覧では初期段階から複雑なフィルターUIを実装しない。

以下をタグまたはメタ情報として表示する。

* Origin
* Field
* Stage
* Interface

Project数が少ないため、まずは一覧性と読みやすさを優先する。

---

# 8. Project詳細

共通テンプレートを作成する。

標準構成：

```text
1. Overview
2. Origin
3. Ideal Experience
4. Conditions
5. Interfaces
6. Decisions
7. Implementation
8. Verification
9. Reconsideration
10. Social Connection
11. Learning
12. Facts
13. Related Projects
```

各セクションは、内容が存在する場合のみ表示できる構造にする。

## Overview

表示項目：

* Project名
* 一文説明
* 期間
* 状態
* 役割
* 主要技術
* 公開URL
* リポジトリ

## Origin

* 何をしている時に始まったか
* 何に違和感を覚えたか
* 誰のどのような体験を観測したか

## Ideal Experience

問題の列挙より先に、どうなれば自然かを示す。

## Conditions

理想を成立させるための制約・境界・要件を示す。

## Interfaces

Creative IdentityとEngineering Identityがどう関与したかを示す。

関与しないIdentityは表示しない。

## Decisions

* 採用した案
* 採用しなかった案
* 判断理由

を扱える構造にする。

## Implementation

* Architecture
* UI
* Data
* Deployment
* Operation

などを必要に応じて記述する。

## Verification

実環境や利用者による検証を書く。

## Reconsideration

検証後に変わった前提や、派生したProjectを書く。

## Social Connection

利用者、共同体、運用、公開範囲、継承可能性などを書く。

## Learning

次の制作へ持ち越す構造的な知見を書く。

## Facts

本文と分離して、採用担当者が確認しやすい事実情報をまとめる。

## Related Projects

関連Projectへのリンクを表示する。

本文はMarkdownまたはMDXで管理し、構造化メタデータと長文本文を適切に分ける。

初期詳細ページとして以下を作成する。

* ワタリEA
* やさいとれとれ祭り
* かかっしー

内容が確定していない箇所は、事実を捏造せずTODOまたは短い暫定文とする。

`albasimia-ssg-core` は、ワタリEAから派生した関連Projectとして最低限のデータとページを用意する。

---

# 9. About

以下の構成にする。

## Statement

```text
私は、作ること自体を目的にしていません。

現実の中で心が動き、
既存の仕組みでは成立しない体験が見えた時、
必要な構造を考え、実装します。
```

## Identities as Interfaces

### Legal Identity

```text
天野 浩平

契約、就職、職務経歴など、
社会制度上の本人として接続するInterface。
```

### Creative Identity

```text
ｶﾀﾙｼｽﾜﾀﾘ

DJ、イベント、農業、フィールドワークを通して、
現実の場へ入り、体験と課題を観測するInterface。
```

### Engineering Identity

```text
albasimia

観測した課題を構造化し、
Web、IoT、Tool、Architectureとして
実装するInterface。
```

締め：

```text
These are not different personas,
but different interfaces to the same person.
```

Creative IdentityからX等のSNSへのリンクは置かない。

## Process

以下の制作サイクルを全文掲載する。

```text
心が動く
↓
理想の体験を構想する
↓
成立条件を構造化する
↓
必要な領域へ越境する
↓
実装する
↓
実世界で検証する
↓
前提を問い直す
↓
社会へ接続する
↓
経験を取り込む
```

各段階に短い説明を付けられるデータ構造にする。

## Roots

以下の形成過程を簡潔に示す。

```text
映像
↓
Web技術
↓
インタラクティブ表現
↓
業務システム
↓
要件定義と運用設計
↓
現実世界を含むProject
```

---

# 10. Experience

Experienceは履歴書のWeb化ではなく、現在の制作思想が職務経験の中でも形成されてきたことを示すページとする。

## Professional Summary

```text
2016年から、VRアプリ、キャンペーンサイト、
Webサイト、CMS、業務システムの設計・開発に従事。

フロントエンド実装を起点に、
顧客ヒアリング、要件定義、技術選定、
チームへの技術展開、CI/CDや運用改善まで担当領域を広げてきた。
```

## Career Phases

### PHASE 1 — PHYSICAL AND IMMERSIVE MEDIA

```text
2016–2017
株式会社ユニモト

GearVRアプリ
360°VR動画
撮影・編集・リアルタイム通信
```

### PHASE 2 — INTERACTIVE FRONTEND

```text
2017–2018
株式会社カヤック

キャンペーンサイト
Canvas / SVG
Vue.js / Firebase
インタラクティブコンテンツ
```

### PHASE 3 — SYSTEMS AND OPERATIONS

```text
2019–2025
株式会社Bloomark

Webサイト運用
CMS
業務システム
要件定義
CI/CD
チーム運用
```

## Selected Professional Projects

初期掲載候補：

* クラロワ日本一決定戦
* SUBARU公式サイト
* 個人情報台帳管理システム
* 社内向け勉強会・業務改善

各項目は以下を持つ。

* Project名
* 期間
* 背景または制約
* 担当
* 判断・工夫
* 結果
* 技術

## Earlier Personal Projects

初期掲載候補：

* へぇボタン
* Quizzool
* rice_caster

現在のProject群につながる制作の系譜として表示する。

## Capabilities

年数やパーセンテージではなく、制作工程に沿って分類する。

```text
OBSERVE
Client Interview
Field Observation
Operational Analysis
User Experience

STRUCTURE
Requirement Definition
Information Architecture
System Design
Data Design
Technical Selection

IMPLEMENT
HTML / CSS / JavaScript / TypeScript
Vue / React / Astro
PHP / Laravel / WordPress
Node.js / Electron
Firebase / MySQL

DELIVER AND OPERATE
Git / GitHub
Docker
GitHub Actions
Cloudflare
CMS
Maintenance Design

SHARE AND IMPROVE
Code Review
Technical Guidance
Workflow Standardization
Testing
Documentation
```

履歴書・職務経歴書のPDFや原本は今回公開しない。

住所、電話番号等の個人情報をサイトへ含めない。

---

# 11. Header / Navigation / Footer

## Header

ワタリEAの基本構造を踏襲する。

サイト名候補：

```text
AMANO PROJECT
```

ナビゲーション：

```text
PROJECTS
ABOUT
EXPERIENCE
```

Homeリンクはロゴまたはサイト名に持たせる。

Light / Dark / Auto切替を設置する。

モバイル時もJavaScript依存の複雑なメニューにしすぎず、少数のナビゲーションを明快に表示する。

## Footer

Contact導線は置かない。

最低限：

```text
AMANO PROJECT
© KOHEI AMANO
```

必要に応じて以下への導線のみ置く。

* Projects
* About
* Experience
* GitHub

Creative IdentityのSNSは置かない。

---

# 12. アクセシビリティ

最低限、以下を満たす。

* 適切なランドマーク
* skip link
* 見出し階層
* キーボード操作
* focus-visible
* テーマ切替の状態通知
* 十分なコントラスト
* 意味のあるリンクテキスト
* 装飾画像の適切なalt
* `prefers-reduced-motion`
* JavaScript無効時も主要コンテンツを閲覧可能
* hoverだけに依存しない
* カード全体リンクを使用する場合も内部リンクとの衝突を避ける

---

# 13. SEO

以下を実装または既存ASC機能へ接続する。

* title
* description
* canonical
* OGP
* Twitter Card相当のメタ情報
* favicon
* sitemap
* robots.txt
* Project詳細ごとの固有title / description
* 構造化データを導入する場合は、実際の情報だけを記述する

個人名、Identity、Project名の表記揺れを避ける。

基本表記：

```text
天野 浩平
ｶﾀﾙｼｽﾜﾀﾘ
albasimia
AMANO PROJECT
```

---

# 14. 実装品質

* TypeScriptの型を適切に使用する
* `any`を安易に使わない
* コンテンツと表示ロジックを分離する
* 文章をコンポーネントへ散在させない
* コンポーネントを過剰分割しない
* サイト固有コンポーネントとASCのPrimitiveを区別する
* CSS変数を使用し、テーマ差分を一元管理する
* 不要なクライアントJavaScriptを追加しない
* Astroで完結する箇所はAstroで実装する
* Island化はテーマ切替など必要な範囲に限定する
* 既存のlint、format、test、build設定に従う
* 新しい依存パッケージは必要性が明確な場合のみ追加する
* 既存ワタリEAを壊す変更をしない

---

# 15. 検証

実装後に以下を実行する。

* install
* lint
* typecheck
* test（存在する場合）
* build

さらに以下を目視またはブラウザで確認する。

* Home
* Projects一覧
* Project詳細
* About
* Experience
* 404
* Light
* Dark
* Auto
* PC幅
* タブレット幅
* スマートフォン幅
* キーボード操作
* リロード時のテーマちらつき
* 内部リンク切れ
* コンテンツ欠落
* console error
* overflow

---

# 16. 完了条件

以下を満たした時点で完了とする。

* 4系統のページが実装されている
* ナビゲーションですべてのページへ移動できる
* ワタリEAを踏襲したデザインになっている
* アマノPJ固有の情報設計になっている
* Light / Dark / Autoが動作する
* Projectデータが構造化されている
* Project詳細テンプレートが動作する
* ASCとアマノPJの責務が分離されている
* ASCへの変更がワタリEAを破壊していない
* ビルドが成功する
* READMEまたは適切なドキュメントに、開発方法とASCとの関係が記載されている

---

# 17. 作業完了時の報告

最後に以下を報告する。

1. 実装したページ
2. 作成・変更した主要ファイル
3. ASCへ追加・変更した機能
4. アマノPJ側に残した固有実装
5. Projectコンテンツの管理方法
6. 実行した検証
7. 残っているTODO
8. 設計上判断したこと
9. ワタリEAへの影響の有無

変更内容を要約するだけでなく、ASCとの境界について明示すること。
