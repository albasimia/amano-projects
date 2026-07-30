---
title: Aovista
slug: aovista
summary: 左右対称性と身体性を重視し、ジョイスティックを備えた左右分割自作キーボード。
origin: 既存キーボードの配列や姿勢が、自分の身体と操作感覚に合わなかった。
intention: 指、手首、視線の動きを含めて、身体に自然な入力体験を設計する。
status: paused
fields:
  - ハードウェア
  - キーボード
  - インタラクション設計
technologies:
  - QMK
  - Vial
  - RP2040
  - KiCad
roles:
  - コンセプト設計
  - 回路設計
  - 筐体設計
  - ファームウェア
  - 実機検証
startedAt: "2025.12"
repositoryUrl: https://github.com/albasimia/aovista_keyboard
relatedProjects: []
draft: false
heroImage:
  asset: img/aovista.jpg
  alt: Aovistaの代表画像
accent: "#00a9fc"
---

![Aovista 本体](/images/projects/aovista/img/aovista.jpg)


<p class="eyebrow project-prose__eyebrow">ORIGIN</p>

## 発端

Windows環境でMacのようなemacsキーバインディングが使用できないことから身体的な記憶がパフォーマンスに直結することを実感しました。


<p class="eyebrow project-prose__eyebrow">IDEAL EXPERIENCE</p>

## 目指した体験

Windows向けのキーボードでは物理的に修飾キーが足りないことからオンボードでemacsキーバインディングをサポートするキーボードの作成を目指しました。

<p class="eyebrow project-prose__eyebrow">CONDITIONS</p>

## 成立条件

- 左右分割であること
- 片側にジョイスティックとエンコーダーを持つこと
- QMKとVialへ対応すること
- WindowsとmacOSの差を吸収すること
- Windowsでemacsキーバインディングが使用できること

<p class="eyebrow project-prose__eyebrow">DECISIONS</p>

## 判断

初号機では身体性と配列の成立を優先し、RP2040、TRRS、有線接続を採用しました。

<p class="eyebrow project-prose__eyebrow">IMPLEMENTATION</p>

## 実装

片側39キー、ジョイスティック、エンコーダーを備え、独自EmacsキーとOS Detectionを実装しました。

<p class="eyebrow project-prose__eyebrow">VERIFICATION</p>

## 検証

実機を組み立て、キーボードとして動作するところまで確認しました。一方で、薄型基板による振動、配線、物理構造などの問題が重なりました。

<p class="eyebrow project-prose__eyebrow">RECONSIDERATION</p>

## 前提の見直し

生活状況と他Projectの優先度を考え、開発を無期限休止としました。  
つまり、お金がなくなりました。

<p class="eyebrow project-prose__eyebrow">LEARNING</p>

## 得られたこと

未完成でも、身体性、電子回路、ファームウェア、筐体設計を横断した検証から多くの設計知見を得ました。  
未完成部分はジョイスティック部分のみで、emacsキーバインディングが標準搭載されたキーボードとしては動作するため、実制作で使用しています。
