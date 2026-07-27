---
title: Aovista
slug: aovista
summary: 左右対称性と身体性を重視し、ジョイスティックを備えた左右分割自作キーボード。
origin: 既存キーボードの配列や姿勢が、自分の身体と操作感覚に合わなかった。
intention: 指、手首、視線の動きを含めて、身体に自然な入力体験を設計する。
status: paused
interfaces:
  - creative-to-engineering
fields:
  - Hardware
  - Keyboard
  - Interaction Design
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
featured: false
order: 70
startedAt: "2025"
repositoryUrl: https://github.com/albasimia/aovista_keyboard
relatedProjects: []
draft: false
---

## Origin

一般的なキーボードでは、手の位置、親指の役割、カーソル操作が身体感覚と一致しませんでした。

## Ideal Experience

左右対称の姿勢を保ちながら、文字入力、カーソル操作、ショートカットを両手の自然な動きで行える状態を目指しました。

## Conditions

- 左右分割であること
- 片側にジョイスティックとエンコーダーを持つこと
- QMKとVialへ対応すること
- WindowsとmacOSの差を吸収すること
- 初号機では無線や複雑な拡張を避けること

## Decisions

初号機では身体性と配列の成立を優先し、RP2040、TRRS、有線接続、磁石連結を採用しました。

## Implementation

片側39キー、ジョイスティック、エンコーダーを備え、独自EmacsキーとOS Detectionを実装しました。

## Verification

実機を組み立て、キーボードとして動作するところまで確認しました。一方で、薄型基板による振動、配線、物理構造などの問題が重なりました。

## Reconsideration

生活状況と他Projectの優先度を考え、開発を無期限休止としました。

## Learning

未完成でも、身体性、電子回路、ファームウェア、筐体設計を横断した検証から多くの設計知見を得ました。
