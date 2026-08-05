---
title: albasimia-ai-logos
slug: albasimia-ai-logos
summary: AIと長期的に共同制作するために、判断基準、プロジェクト知識、変更履歴をGitで管理する判断・知識管理基盤。
origin: ChatGPTやCodexとの共同制作では、スレッド、モデル、端末が変わるたびに、制作上の前提や判断理由が失われやすかった。
intention: AIが変わっても同じ制作思想と現在地を再現し、人間に最終判断を残したまま共同制作を継続できる状態をつくる。
status: operation
fields:
  - AI共同制作
  - 知識管理
  - 意思決定支援
  - 開発基盤
technologies:
  - Bash
  - Markdown
  - Git
  - GitHub Actions
  - OpenAI API
roles:
  - コンセプト設計
  - 情報設計
  - CLI実装
  - テスト
  - ドキュメント
startedAt: "2026.8"
relatedProjects:
  - amano-projects
draft: false
accent: "#8076b2"
---

<p class="eyebrow project-prose__eyebrow">ORIGIN</p>

## 発端

AIとの共同制作が長期化すると、会話の中では共有できていた目的、制約、過去の判断が、スレッドや利用環境の変更によって失われます。AIへ毎回説明し直すだけでは、制作の速度は上がっても、判断の一貫性と説明可能性を維持できませんでした。

<p class="eyebrow project-prose__eyebrow">IDEAL EXPERIENCE</p>

## 目指した体験

ChatGPT、Codex、APIなど、利用するAIやInterfaceが変わっても、同じ制作思想、プロジェクトの現在地、過去の判断を読み直し、継続して共同制作できる状態を目指しました。

AIが自動的に意思決定するのではなく、提案と実装を支援し、採用、却下、保留の最終判断は人間へ残します。

<p class="eyebrow project-prose__eyebrow">INFORMATION ARCHITECTURE</p>

## 情報設計

情報の役割を、現在、過去、未来、提案へ分離しています。

```text
project.md
現在有効な目的、制約、前提、決定

next.md
次に進めること

history/
何を変更したか

decisions/
なぜその判断をしたか

proposals/
まだ採用されていない変更案
```

AAL本体を判断基盤の正本とし、各Projectは採用した完全なCommit SHAを共有lockとして保持します。これにより、端末や作業者が変わっても同じ判断基盤を復元できます。

<p class="eyebrow project-prose__eyebrow">CONDITIONS</p>

## 成立条件

- Gitを制作知識の正本とすること
- AIが現在知識を無断で変更しないこと
- 人間が最終判断を保持すること
- 端末ローカルの実行状態と、Projectで共有する知識を分離すること
- AIやproviderの変更に依存しないこと
- 変更内容と履歴記録の一致を検証できること
- 人間がMarkdownとして読める状態を維持すること

<p class="eyebrow project-prose__eyebrow">DECISIONS</p>

## 判断

端末ローカルの実行環境を `.aal/`、Projectで共有する知識を `.ai/` として分離しました。

変更作業では、実装差分を `prepare` 時に固定し、historyとdecisionを確認した上で、同じChange IDを持つCommitとして記録します。Project知識の変更はproposalとして作成し、人間がacceptした場合だけ正本へ反映します。

<p class="eyebrow project-prose__eyebrow">IMPLEMENTATION</p>

## 実装

Bash CLIとして、初期化、同期、更新差分の確認、状態診断、変更準備、履歴作成、Commit、知識更新を実装しています。

```text
aal init
aal sync
aal outdated
aal diff
aal doctor
aal prepare
aal draft
aal commit
aal propose
aal accept
```

OpenAI APIへ履歴作成を依頼する場合は、複数のMarkdownへ分散したcore、Project、next、decision、personaを、context compilerによって決定論的な一つの文脈へ展開します。

<p class="eyebrow project-prose__eyebrow">DELIBERATION</p>

## 判断軸の外部化

複雑な判断では、構造、実地、持続性、表現衝動、長期的な接続という異なる評価軸を、`watarinshaft`の評議員として呼び出せます。

合議は多数決ではなく、対立する価値、成立条件、破綻条件、保留理由を可視化するために利用します。最終判断を行う議長は、常に人間です。

<p class="eyebrow project-prose__eyebrow">VERIFICATION</p>

## 検証

AAL自身の開発へAALを適用し、設計判断、変更履歴、proposal、Commitを同じ運用で記録しています。

共有lockによる版の再現、変更差分の固定、Project知識の全文置換、APIへ渡すcontextの安定生成を含む12件の統合テストを実装し、GitHub ActionsのUbuntuとmacOSで成功を確認しています。

<p class="eyebrow project-prose__eyebrow">LEARNING</p>

## 得られたこと

AIとの共同制作で必要なのは、長いPromptを保存することだけではありませんでした。

目的、現在地、過去の判断、未採用の未来を分離し、どの版を読み、何を変更し、誰が採用したかを検証できることで、AIを判断の代替ではなく、長期的な共同制作者として扱えるようになります。

AALは、もともと内面で行っていた制作判断の流れを、AIと共有可能な形へ外部化したProjectです。
