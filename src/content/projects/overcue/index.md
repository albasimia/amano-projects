---
title: OverCUE
slug: overcue
summary: XPPen ACK05を、macOS版rekordboxのCUE仕込み専用コントローラーへ変換するアプリ。
origin: DJのCUE仕込みを大量に行う際、マウスとキーボードだけでは身体的な負担と操作の煩雑さが大きかった。
intention: 既製入力デバイスを再解釈し、DJ準備作業を片手で進められる専用ワークフローへ変える。
status: operation
fields:
  - 音楽
  - 入力デバイス
  - デスクトップアプリ
technologies:
  - Swift
  - macOS
  - IOHID
  - MIDI
roles:
  - 課題発見
  - 操作設計
  - 実装
  - 配布
  - ドキュメント
repositoryUrl: https://github.com/albasimia/OverCUE
websiteUrl: https://albasimia.github.io/OverCUE/
relatedProjects: []
draft: false
heroImage:
  asset: img/og-image.png
  alt: OverCUEの代表画像
screenshots:
  desktop: true
  mobile: true
startedAt: "2026.7"
endedAt: "2026.7"
accent: "#1e6bb8"
---

<p class="eyebrow project-prose__eyebrow">ORIGIN</p>

## 発端

大量の楽曲へCUEを設定する作業では、マウスとキーボードの往復が多く、DJプレイとは異なる準備作業の負担がありました。

<p class="eyebrow project-prose__eyebrow">IDEAL EXPERIENCE</p>

## 目指した体験

片手でダイヤルとキーを操作し、再生位置の移動、CUE設定、削除、再生を連続して行える状態を目指しました。

<p class="eyebrow project-prose__eyebrow">CONDITIONS</p>

## 成立条件

- 1万円以内の既製デバイスを利用すること
- macOS版rekordboxで動作すること
- 無線または可搬性を保つこと
- rekordbox本体を改変しないこと

<p class="eyebrow project-prose__eyebrow">DECISIONS</p>

## 判断

XPPen ACK05のHID入力を取得し、マウス操作またはMIDI操作へ変換する構成を採用しました。

<p class="eyebrow project-prose__eyebrow">IMPLEMENTATION</p>

## 実装

Swift 6のmacOS CLIを基盤に、IOHIDからキーとダイヤル入力を取得します。設定はJSONで保持し、Universal Binaryとして配布しています。

<p class="eyebrow project-prose__eyebrow">VERIFICATION</p>

## 検証

実際のrekordbox上でCUE仕込みに使用し、配布用アプリ、GitHub Releases、多言語ガイドまで整備しました。

<p class="eyebrow project-prose__eyebrow">SOCIAL CONNECTION</p>

## 社会との接続

同じデバイスとrekordboxを利用するDJが導入できるよう、公開リポジトリとドキュメントを用意しています。

<p class="eyebrow project-prose__eyebrow">LEARNING</p>

## 得られたこと

専用機器を新規制作しなくても、既製デバイスの入力特性を読み替えることで専用体験を作れます。
