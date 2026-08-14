---
title: チャナごっち
slug: chana-birthday-2022
summary: 2泊3日の名古屋オフ会と連動して進行する、ブラウザ育成ゲーム。
origin: チャナマサラの誕生日とオフ会そのものを、ひとつの連続した体験にしたかった。
intention: 現実の時間とブラウザゲームの進行を接続し、参加者全員が共有できる誕生日体験をつくる。
status: completed
fields:
  - ゲーム
  - イベント
  - コミュニティ
technologies:
  - TypeScript
  - Phaser
  - Vite
  - LocalStorage
roles:
  - 企画
  - ゲーム設計
  - 実装
  - 演出
repositoryUrl: https://github.com/albasimia/chana_birthday_2022
relatedProjects:
  - birthday-contents
draft: false
websiteUrl: https://albasimia.github.io/chana_birthday_2022/
heroImage:
  asset: img/og-image.png
  alt: チャナごっちの代表画像
images:
  desktop: false
  mobile: true
startedAt: "2022.5"
endedAt: "2023.5"
---

<p class="eyebrow project-prose__eyebrow">ORIGIN</p>

## 発端

誕生日当日だけでなく、2泊3日の名古屋オフ会全体をコンテンツとして扱うところから始まりました。

<p class="eyebrow project-prose__eyebrow">IDEAL EXPERIENCE</p>

## 目指した体験

移動、宿泊、交流の時間とゲーム内の育成が連動し、オフ会の記憶そのものがゲーム体験へ残る状態を目指しました。

<p class="eyebrow project-prose__eyebrow">CONDITIONS</p>

## 成立条件

- ブラウザだけで動作すること
- 複数日にまたがる進行を扱えること
- 現地での行動とゲームを接続できること
- 参加者が同じ文脈を共有できること

<p class="eyebrow project-prose__eyebrow">IMPLEMENTATION</p>

## 実装

PhaserとTypeScriptを使い、現実の経過時間に応じてキャラクターが成長するブラウザ育成ゲームとして実装しました。与えたアイテムによって体力、知性、音楽などの能力値が変化し、経過時間と能力値の組み合わせによって進化先が分岐します。

キャラクター、アイテム、能力値、セーブデータを設定ファイルへ分離し、時間管理と進化判定を独立したクラスとして構成しました。進行状況はLocalStorageへ保存し、複数日にまたがるオフ会の途中でも育成を継続できるようにしています。

<p class="eyebrow project-prose__eyebrow">VERIFICATION</p>

## 検証

2泊3日のオフ会中に実際に使用し、現実の時間とゲームの進行を重ねました。

<p class="eyebrow project-prose__eyebrow">ACTION</p>

## 旅行の時間そのものを、ゲームへ

ゲームを遊ぶために現実の行動を止めるのではなく、移動、宿泊、交流というオフ会の時間をそのまま育成体験へ重ねました。参加者は画面の中だけで完結するゲームを遊ぶのではなく、2泊3日の行動と記憶をゲームの進行と一緒に持ち帰る体験になりました。

<p class="eyebrow project-prose__eyebrow">DEVELOPMENT</p>

## 開発期間

2022年の誕生日コンテンツとして着手しましたが、ゲーム設計と実装が想定以上に長引き、完成まで約1年かかりました。実時間に基づく成長、複数の能力値、アイテム、進化分岐を相互に矛盾なく動かすことが、制作上の大きな難所でした。

<p class="eyebrow project-prose__eyebrow">LEARNING</p>

## 得られたこと

Webコンテンツは画面内だけで完結せず、旅行やイベントの時間構造そのものと接続できます。
