---
title: らぶ♡マコ
slug: love-mako
summary: 友人たちを登場人物にした、伊東マコト誕生日用の恋愛シミュレーションゲーム。
origin: 本人と友人たちの関係性を、内輪の物語として遊べる形へ変えたかった。
intention: 実在のコミュニティを登場人物、選択肢、分岐へ再構成し、誕生日の共有体験をつくる。
status: completed
fields:
  - ゲーム
  - 物語
  - コミュニティ
technologies:
  - TyranoScript
  - JavaScript
  - HTML
  - CSS
roles:
  - 企画
  - シナリオ
  - キャラクター設計
  - 実装
repositoryUrl: https://github.com/albasimia/love_mako
relatedProjects:
  - birthday-contents
draft: false
websiteUrl: https://albasimia.github.io/love_mako/
heroImage:
  asset: img/og-image.png
  alt: love_makoの代表画像
images:
  desktop: true
  mobile: false
startedAt: "2022.8"
endedAt: "2022.10"
---

<p class="eyebrow project-prose__eyebrow">ORIGIN</p>

## 発端

伊東マコトと友人たちの関係性を、そのまま誕生日用の物語とゲームへ変換しました。

<p class="eyebrow project-prose__eyebrow">IDEAL EXPERIENCE</p>

## 目指した体験

本人が友人たちとの関係を別の角度から楽しみ、周囲も同じ内輪文脈で参加できる状態を目指しました。

<p class="eyebrow project-prose__eyebrow">CONDITIONS</p>

## 成立条件

- 実在人物を扱うこと
- 内輪の関係性を損なわず笑いへ変えること
- 分岐と選択肢によってゲームとして成立させること
- 1週間の行動と好感度を一貫して管理すること

<p class="eyebrow project-prose__eyebrow">IMPLEMENTATION</p>

## 実装

昔のバンド仲間とのライブを1週間後に控えた主人公が、昼と夜の行動を選びながら5人の登場人物と交流する恋愛シミュレーションとして実装しました。選択内容によって好感度が変化し、ライブチケットを誰に渡すかによって個別ルート、複数のエンディング、バッドエンドへ分岐します。

TyranoScriptを用い、シナリオを登場人物と日程ごとのファイルへ分割しました。好感度と進行状態はゲーム変数として管理し、セーブ、ロード、メッセージ速度、音量設定も備えています。

<p class="eyebrow project-prose__eyebrow">VERIFICATION</p>

## 検証

実在する友人関係を、本人たちが共有している文脈を保ったまま、選択と分岐を持つ7日間の物語へ再構成しました。
