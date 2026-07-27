---
title: 椅子取りYouTube
slug: isutori-youtube
summary: YouTube再生を自動制御し、曲を止める係も椅子取りゲームへ参加できるChrome拡張。
origin: 椅子取りゲームでは、曲を止める人だけがゲームに参加できなかった。
intention: 進行役を固定せず、その場にいる全員が同じ遊びへ参加できる状態をつくる。
status: completed
interfaces:
  - creative-to-engineering
fields:
  - Browser Extension
  - Game
  - Facilitation
technologies:
  - JavaScript
  - Chrome Extension
  - YouTube
roles:
  - 課題発見
  - 仕様設計
  - 実装
  - 実地検証
featured: true
order: 80
repositoryUrl: https://github.com/albasimia/isutori_youtube
relatedProjects:
  - hele-button
draft: false
---

## Origin

みんなで椅子取りゲームを行う時、誰か一人がYouTubeの曲を止める係になり、その人だけゲームへ参加できない問題がありました。

## Ideal Experience

操作担当者を置かず、再生と停止が自動で行われ、全員が参加者になれる状態を目指しました。

## Conditions

- YouTubeをそのまま音源として使えること
- ブラウザだけで導入できること
- 停止タイミングを参加者が予測しにくいこと
- 操作を最小限にすること

## Decisions

専用プレイヤーを新規制作せず、既存のYouTube画面へ機能を加えるChrome拡張としました。

## Implementation

YouTubeの再生状態を制御し、一定のルールで自動停止する拡張機能を実装しました。

## Verification

実際の椅子取りゲームで使用し、進行役を固定せず全員が参加できる状態を確認しました。

## Learning

小さな不公平でも、既存サービスへ最小限の拡張を加えることで体験全体を変えられます。
