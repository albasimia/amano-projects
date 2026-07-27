---
title: カリレンジャン
slug: karirenjan
summary: 図書館の蔵書と利用条件を横断し、レア音源を借りる、買う、保存する判断を支援するサービス。
origin: 廃盤音源を探す中で、中古市場だけでなく図書館に保存されている音源へ辿り着いた。
intention: 自治体ごとに分断された蔵書情報と利用条件を、実際の行動へつながる探索体験へ変える。
status: development
interfaces:
  - creative-to-engineering
fields:
  - Music
  - Library
  - Search
  - Service Design
technologies:
  - Laravel
  - MariaDB
  - Python
  - GitHub Actions
roles:
  - 課題発見
  - サービス設計
  - 情報設計
  - 実装
featured: false
order: 40
startedAt: "2026"
relatedProjects:
  - watarino-tsuno-gothic
draft: false
---

## Origin

廃盤や高騰した音源を探す中で、購入以外に図書館という保存経路があることを発見しました。一方で、蔵書情報、広域利用、取り寄せ、郵送貸出などの条件は自治体ごとに分断されています。

## Ideal Experience

音源名から、どの図書館で借りられるか、どの順番で借りると効率がよいか、購入すべきか待つべきかを判断できる状態を目指します。

## Conditions

- 公開情報だけを扱うこと
- 図書館ごとの利用条件を区別すること
- 中古価格を一般公開しないこと
- レア音源の保存と利用を両立すること
- 単なる検索結果ではなく、行動判断を支援すること

## Decisions

中核機能を「カリタイリスト」とし、借りたい音源を保存して図書館ごとの回収効率や借り順を判断できる構成とします。

## Implementation

Laravel、MariaDBを中心に、図書館データ取得はPythonとGitHub Actionsによる定期更新を想定しています。

## Social Connection

音源を所有する人だけでなく、公共アーカイブを利用する人にも探索経路を開きます。

## Learning

情報検索だけでなく、制度、移動、郵送、関連音源まで含めて行動全体を設計する必要があります。
