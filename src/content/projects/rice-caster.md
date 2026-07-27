---
title: rice_caster
slug: rice-caster
summary: 配信コメントを取得し、画面演出へ変換するElectronアプリ。
origin: 友人の配信でコメントを装飾したかったが、既存機能では表示件数や表現に制約があった。
intention: 配信コメントを独自に取得し、出演者や視聴者が楽しめる画面演出へ変える。
status: completed
interfaces:
  - creative-to-engineering
fields:
  - Streaming
  - Desktop App
  - Realtime
technologies:
  - Electron
  - Puppeteer
  - Socket.IO
roles:
  - 課題発見
  - 仕様設計
  - 実装
featured: false
order: 150
repositoryUrl: https://github.com/albasimia/rice_caster
relatedProjects: []
draft: false
---

## Origin

友人の配信でコメントを画面演出へ利用しようとした際、CSSだけでは件数制限や取得範囲の問題を解消できませんでした。

## Ideal Experience

配信サービスのコメントを独自に取得し、表示方法や演出を自由に制御できる状態を目指しました。

## Conditions

- デスクトップで動作すること
- 配信画面へ組み込みやすいこと
- コメント取得と表示を分離すること

## Decisions

単純なCSSカスタマイズから、Puppeteerでコメントを取得するElectronアプリへ再設計しました。

## Implementation

Electron、Puppeteer、Socket.IOを利用し、コメント取得と表示を接続しました。

## Learning

表面的な装飾では解決できない制約を見つけた時、データ取得層から設計し直す必要があります。
