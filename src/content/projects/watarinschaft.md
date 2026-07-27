---
title: watarinschaft
slug: watarinschaft
summary: 複数視点のAIを評議員、人間を議長として扱う合議型の思考拡張エンジン。
origin: AIへ判断を委ねず、複数視点を利用しながら人間が最終決定を持つ仕組みが必要だった。
intention: 発散、対立、収束、記録を分離し、人間の主権を保った意思決定支援をつくる。
status: development
interfaces:
  - engineering
fields:
  - AI
  - Decision Support
  - CLI
technologies:
  - TypeScript
  - OpenAI API
  - JSON Schema
roles:
  - 設計
  - 実装
  - プロンプト設計
featured: false
order: 180
repositoryUrl: https://github.com/albasimia/watarinschaft
relatedProjects: []
draft: true
---

## Origin

単一のAI回答へ依存すると、発散、現実性、表現性、長期性など異なる観点が一つへ圧縮されます。

## Ideal Experience

複数の役割が異なる観点から意見を出し、人間が議長として最終判断できる状態を目指します。

## Conditions

- AIが最終決定者にならないこと
- 役割定義をハードコードしないこと
- 実行ログをrun単位で保存すること
- 発散と収束を分離すること

## Decisions

AIを評議員、人間を議長、ログを議事録として扱う構造を採用しました。

## Implementation

役割をMarkdownで定義し、CLIから合議を実行し、JSON形式で結果を保存します。

## Publication Note

現在は実験段階であり、運用結果や有効性を整理してから公開するためdraftとします。
