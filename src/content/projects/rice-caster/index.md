---
title: rice_caster
slug: rice-caster
summary: 配信コメントを取得し、画面演出へ変換するElectronアプリ。
origin: 友人の配信でコメントを装飾したかったが、既存機能では表示件数や表現に制約があった。
intention: 配信コメントを独自に取得し、出演者や視聴者が楽しめる画面演出へ変える。
status: completed
fields:
  - 配信
  - デスクトップアプリ
  - リアルタイム
technologies:
  - Electron
  - Puppeteer
  - Socket.IO
roles:
  - 課題発見
  - 仕様設計
  - 実装
repositoryUrl: https://github.com/albasimia/rice_caster
relatedProjects: []
draft: false
---

<p class="eyebrow project-prose__eyebrow">ORIGIN</p>

## 発端

友人の配信でコメントを画面演出へ利用しようとした際、CSSだけでは件数制限や取得範囲の問題を解消できませんでした。

<p class="eyebrow project-prose__eyebrow">IDEAL EXPERIENCE</p>

## 目指した体験

配信サービスのコメントを独自に取得し、表示方法や演出を自由に制御できる状態を目指しました。

<p class="eyebrow project-prose__eyebrow">CONDITIONS</p>

## 成立条件

- デスクトップで動作すること
- 配信画面へ組み込みやすいこと
- コメント取得と表示を分離すること

<p class="eyebrow project-prose__eyebrow">DECISIONS</p>

## 判断

単純なCSSカスタマイズから、Puppeteerでコメントを取得するElectronアプリへ再設計しました。

<p class="eyebrow project-prose__eyebrow">IMPLEMENTATION</p>

## 実装

Electron、Puppeteer、Socket.IOを利用し、コメント取得と表示を接続しました。

<p class="eyebrow project-prose__eyebrow">LEARNING</p>

## 得られたこと

表面的な装飾では解決できない制約を見つけた時、データ取得層から設計し直す必要があります。
