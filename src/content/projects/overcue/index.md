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
  desktop: false
  mobile: false
startedAt: "2026.7"
completedAt: "2026.7"
accent: "#ae0006"
---

![OverCUE アプリ UI](/images/projects/overcue/img/screenshot-app.png)

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


<p class="eyebrow project-prose__eyebrow">EVALUATION</p>

## AIによる評価

> 結論は「機能設計は良い初期公開版。ただし、常駐入力アプリとしての異常終了・切断処理が安定版水準に届いていない」です。
> 
> 総合評価は、初期公開版として 7.5/10、安定版として 6/10 です。
> 
> ### 確認できた品質
> 
> `main`そのものを現在のSwift 6.3環境で検証しました。
> 
> - Releaseビルド成功
> - Coreチェック217件すべて成功
> - arm64＋x86_64 Universalアプリ生成成功
> - アプリ・CLI helperのad-hoc署名検証成功
> - 作業ツリーへの変更なし
> 
> したがって、「mainは現在の環境でビルド不能」という状態ではありません。
> 
> ### 良い実装判断
> 
> - IOHIDでACK05を直接かつ排他的に開き、元のショートカット入力を抑止する設計はmacOSでは素直で堅実です。
> - 物理入力、Action Layer、rekordbox commandId、キーボード出力を分離した設計は良好です。
> - Cue保持、Jump加速、任意数コード、キー＋ダイヤルなどを物理キーではなくActionの性質として扱っているため、再割り当てに耐えます。
> - rekordbox最前面時だけ操作し、未割り当てショートカットを推測しない安全設計は適切です。
> - 設定version 1〜7の段階移行、旧ファイルのバックアップ、atomic保存まで実装されています。
> - GUIと入力helperを別プロセスにしたこと自体は合理的です。設定編集時に排他的HIDを一時的にGUIへ渡せます。
> - 日本語・英語・簡体字中国語、権限、Gatekeeper、公証されていない点まで利用者向けに説明しているのは非常に良い判断です。
> 
> ### 安定版前に直したい問題
> 
> 1. ACK05切断時に保持状態が解放されません。
> 
>    デバイス切断処理はGUIへ空の押下状態を通知するだけで、`InputActionResolver`や`RekordboxKeyboardOutput`をリセットしていません。
> 
>    Cueを押したまま切断すると、rekordboxへ送ったkeydownが解放されず、Jumpリピートも継続する可能性があります。これは最優先です。
> 
> 2. helper停止が強制終了で、終了前クリーンアップが保証されません。
> 
>    GUIはhelperへ`terminate()`を送り、そのまま終了を待っています。
> 
>    helper側にSIGTERM処理がないため、Cue保持中やマウスドラッグ中に、入力OFF、設定編集、再起動、アプリ終了をすると、keyup／mouseUpを送らず終了し得ます。終了通知→`releaseAll()`→ドラッグ終了→run loop停止、という正常終了プロトコルが必要です。
> 
> 3. rekordboxキーマッピングの復旧性が弱いです。
> 
>    設定が参照するmapping IDのファイルが消えていると、標準プリセットが存在しても全体を失敗させます。
> 
>    rekordbox更新や設定初期化後に起こり得るため、既定Performance/Exportへのフォールバックが必要です。これは`develop`では既に改善されています。
> 
> 4. `main`にはCIがありません。
> 
>    Coreチェックは充実していますが、自動実行されず、配布スクリプトも`overcue-checks`を実行していません。v0.1.1時点では手動検証への依存が大きい状態です。`develop`で追加された両OS CIの導入判断は正しかったと言えます。
> 
> 5. 利用ガイドに実装との不一致があります。
> 
>    実装はK3=`Jump Forward`、K6=`Jump Backward`ですが、日本語・英語ガイドは逆方向と記載しています。
> 
>    また仕様書は「150チェック」と記載していますが、実際は217件です。
> ### 評価
> macOS単体の設計整合性は高く評価できます。Coreロジックや設定移行は初期版としてかなり充実しています。
> 一方、常駐入力アプリで最も危険な「デバイス切断」「helper終了」「保持入力の解放」がテスト対象外です。優先順位は以下です。
> 切断時の全入力解放
> helperの正常終了プロトコル
> mappingフォールバック
> CIをmainへ反映
> ガイド修正
> 1,675行のBridgeと1,151行の設定モデルを段階的に分割
> この5点目まで完了すれば、macOS版は「実験的ツール」から「安心して継続利用できる公開アプリ」へかなり近づきます。