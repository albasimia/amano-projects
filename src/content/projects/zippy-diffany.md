---
title: Zippy Diffany
slug: zippy-diffany
summary: 任意の2コミット間の差分ファイルを抽出し、必要なものだけZIP化するCLI・GUIツール。
origin: Git差分を納品用ファイルとして手作業で抽出する工程が煩雑だった。
intention: Gitの履歴を利用し、必要な変更ファイルだけを安全にまとめられる道具をつくる。
status: development
interfaces:
  - engineering
fields:
  - Developer Tool
  - Git
  - Desktop App
technologies:
  - Node.js
  - Electron
  - Vitest
  - npm workspaces
roles:
  - 設計
  - 実装
  - テスト
featured: false
order: 170
repositoryUrl: https://github.com/albasimia/zippy-diffany
relatedProjects: []
draft: false
---

## Origin

Web制作の納品で、2つのGitコミット間に含まれる変更ファイルだけを抽出し、ZIPへまとめる作業が必要でした。

## Ideal Experience

リポジトリと比較対象を指定するだけで、差分ファイルを確認し、必要なものだけZIPとして出力できる状態を目指します。

## Conditions

- CLIとGUIの両方から利用できること
- Git操作とZIP生成ロジックを共通化すること
- クロスプラットフォームを想定すること
- テスト可能な構造にすること

## Implementation

npm workspacesを使い、共通ライブラリ、CLI、Electronアプリを分離したモノレポとして構成しています。

## Learning

同じユースケースでも、自動化用途のCLIと手動確認用途のGUIでは入口が異なります。ロジックを分離することで両方を支えられます。
