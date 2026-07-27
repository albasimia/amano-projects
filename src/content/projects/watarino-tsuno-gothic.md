---
title: Watarino Tsuno Gothic
slug: watarino-tsuno-gothic
summary: 固有名「ｶﾀﾙｼｽﾜﾀﾘ」を核に、ツノという造形規則から展開する専用書体。
origin: 既存書体では活動名の固有性と、制作物全体のIdentityを十分に表現できなかった。
intention: 文字ごとの装飾ではなく、一貫した造形規則を持つ書体としてIdentityを実装する。
status: development
interfaces:
  - creative-to-engineering
fields:
  - Typography
  - Identity
  - Font
technologies:
  - SVG
  - FontTools
  - Python
roles:
  - 造形設計
  - 文字設計
  - フォント生成
  - 実用検証
featured: false
order: 160
startedAt: "2026"
repositoryUrl: https://github.com/albasimia/Watarino-Tsuno-Gothic
relatedProjects:
  - karirenjan
draft: false
---

## Origin

固有表記 `ｶﾀﾙｼｽﾜﾀﾘ` を既存フォントで表現すると、活動名の持つ形やリズムが他の文字に埋もれてしまいました。

## Ideal Experience

活動名だけでなく、将来的に日本語と英字へ展開できる、一貫した造形規則を持つ書体を目指します。

## Conditions

- 各字最大1本のツノを持つこと
- ツノが字画と連続すること
- 終端を直線的に処理すること
- 文字間、ベースライン、既存フォントとの大きさを検証すること

## Decisions

造形ルールを複数の型へ分類し、カタカナ、記号、英字へ展開します。

## Implementation

SVGマスターからフォントを生成し、`Watarino Tsuno Gothic` として実用確認版を制作しています。

## Verification

`ｶﾀﾙｼｽﾜﾀﾘ` と「カリレンジャンPro」で必要な文字を先行し、余白、ベースライン、字面を実環境で検証しています。

## Learning

ロゴのような一枚絵ではなく、文字体系として成立させるには、例外より規則を先に定義する必要があります。
