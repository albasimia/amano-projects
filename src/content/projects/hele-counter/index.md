---
title: へぇカウンター
slug: hele-counter
summary: 会場の参加者がスマートフォンからボタンを押し、反応をリアルタイム集計する参加型Webコンテンツ。
origin: 観客が見るだけでなく、その場の反応を全員で共有できる仕組みが必要だった。
intention: 多人数の反応を同時に集め、会場演出の一部として可視化する。
status: completed
fields:
  - リアルタイム
  - イベント
  - 観客参加
technologies:
  - Firebase
  - JavaScript
roles:
  - 企画
  - リアルタイム設計
  - 実装
  - 運用
repositoryUrl: https://github.com/albasimia/hele-button
websiteUrl: https://helebutton-6cf30.firebaseapp.com/
relatedProjects:
  - isutori-youtube
draft: false
heroImage:
  asset: img/desktop.jpg
  alt: へぇカウンターの代表画像
images:
  desktop: true
  mobile: true
accent: "#4ea3e5"
startedAt: "2018.1"
endedAt: "2018.2"
---

<p class="eyebrow project-prose__eyebrow">ORIGIN</p>

## 発端

会場コンテンツでは、観客が見るだけになりやすく、その場の反応を全員で共有する仕組みがありませんでした。

<p class="eyebrow project-prose__eyebrow">IDEAL EXPERIENCE</p>

## 目指した体験

参加者が各自のスマートフォンから反応を送り、会場全体で結果を共有できる状態を目指しました。

<p class="eyebrow project-prose__eyebrow">CONDITIONS</p>

## 成立条件

- 多人数の同時接続に対応すること
- ボタン画面、集計画面、管理画面を分けること
- 会場進行に合わせて状態を制御できること

<p class="eyebrow project-prose__eyebrow">IMPLEMENTATION</p>

## 実装

Firebaseを利用し、参加者画面、カウンター画面、管理画面を分離したリアルタイムWebアプリとして実装しました。

<p class="eyebrow project-prose__eyebrow">VERIFICATION</p>

## 検証

結婚式余興で実際に約200人が同時利用し、参加者の反応をリアルタイムに集計しました。2018年2月に制作を完了し、同年8月に一般公開のための最終整備を行いました。

<p class="eyebrow project-prose__eyebrow">LEARNING</p>

## 得られたこと

観客を参加者へ変えるには、入力方法を極端に単純化し、進行側の制御を別画面へ分離することが有効でした。
