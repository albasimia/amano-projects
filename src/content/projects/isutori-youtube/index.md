---
title: イストリYouTube
slug: isutori-youtube
summary: YouTube再生を自動制御し、曲を止める係も椅子取りゲームへ参加できるChrome拡張。
origin: 椅子取りゲームでは、曲を止める人だけがゲームに参加できなかった。
intention: 進行役を固定せず、その場にいる全員が同じ遊びへ参加できる状態をつくる。
status: completed
fields:
  - ブラウザ拡張
  - ゲーム
  - ファシリテーション
technologies:
  - JavaScript
  - Chrome Extension
  - YouTube
roles:
  - 課題発見
  - 仕様設計
  - 実装
  - 実地検証
repositoryUrl: https://github.com/albasimia/isutori_youtube
relatedProjects:
  - hele-counter
draft: false
startedAt : "2022.3"
endedAt: "2022.3"
---

<p class="eyebrow project-prose__eyebrow">ORIGIN</p>

## 発端

みんなで椅子取りゲームを行う時、誰か一人がYouTubeの曲を止める係になり、その人だけゲームへ参加できない問題がありました。

<p class="eyebrow project-prose__eyebrow">IDEAL EXPERIENCE</p>

## 目指した体験

操作担当者を置かず、再生と停止が自動で行われ、全員が参加者になれる状態を目指しました。

<p class="eyebrow project-prose__eyebrow">CONDITIONS</p>

## 成立条件

- YouTubeをそのまま音源として使えること
- ブラウザだけで導入できること
- 停止タイミングを参加者が予測しにくいこと
- 操作を最小限にすること

<p class="eyebrow project-prose__eyebrow">DECISIONS</p>

## 判断

専用プレイヤーを新規制作せず、既存のYouTube画面へ機能を加えるChrome拡張としました。

<p class="eyebrow project-prose__eyebrow">IMPLEMENTATION</p>

## 実装

YouTubeの再生状態を制御し、一定のルールで自動停止する拡張機能を実装しました。

<p class="eyebrow project-prose__eyebrow">VERIFICATION</p>

## 検証

実際の椅子取りゲームで使用し、進行役を固定せず全員が参加できる状態を確認しました。

<p class="eyebrow project-prose__eyebrow">LEARNING</p>

## 得られたこと

小さな不公平でも、既存サービスへ最小限の拡張を加えることで体験全体を変えられます。
