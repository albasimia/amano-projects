---
title: kaka-see
slug: kaka-see
summary: 畑の地表温度と土壌水分を取得し、通信、蓄積、通知へ接続する農業IoT Project。
origin: 畑の状態を確認するために現地へ行く必要があり、気温や水分の変化を継続的に把握できなかった。
intention: 畑の状態を遠隔から把握し、必要な作業を判断できる小さな観測基盤をつくる。
status: development
currentPhase:
  label: Phase 0 — Sensor Reading
  description: Zephyr環境でHello WorldとUSBシリアル出力を確認し、センサー値取得の準備を進めています。
fields:
  - 農業
  - IoT
  - 組み込み
technologies:
  - nRF9151 DK
  - Zephyr
  - LTE-M
  - NB-IoT
  - DS18B20
roles:
  - 課題発見
  - 要件整理
  - センサー検証
  - 組み込み実装
startedAt: "2026"
relatedProjects:
  - yasai-toretore
draft: false
---

<p class="eyebrow project-prose__eyebrow">ORIGIN</p>

## 発端

畑の状態は現地へ行かなければ確認できず、地表温度や土壌水分がどのように変化しているかを継続的に把握できませんでした。

<p class="eyebrow project-prose__eyebrow">IDEAL EXPERIENCE</p>

## 目指した体験

現地へ行く前に畑の状態を確認し、水やりや作業の必要性を判断できる状態を目指します。

<p class="eyebrow project-prose__eyebrow">CONDITIONS</p>

## 成立条件

- 屋外で安定して動作すること
- 低消費電力で運用できること
- 地表温度と土壌水分を取得できること
- 将来的にLTE-MまたはNB-IoTで送信できること
- センサー、通信、クラウドを段階的に検証すること

<p class="eyebrow project-prose__eyebrow">ARCHITECTURE</p>

## 構成

nRF9151 DKを中心に、土壌水分センサーとDS18B20温度センサーを接続し、将来的にAWSへの蓄積とLINE通知へ接続する構成です。

<p class="eyebrow project-prose__eyebrow">CURRENT PHASE</p>

## 現在の段階

Phase 0 — Sensor Reading

Zephyr環境でHello WorldとUSBシリアル出力を確認し、センサー値取得の準備を進めています。

<p class="eyebrow project-prose__eyebrow">WHAT HAS BEEN VERIFIED</p>

## 確認できたこと

- nRF9151 DK上でZephyrが動作すること
- USBシリアルでログを確認できること

<p class="eyebrow project-prose__eyebrow">CURRENT QUESTIONS</p>

## 現在の問い

- 屋外でのセンサー値の安定性
- 5分間隔送信時の消費電力
- ソーラーと18650による電源設計
- 土壌水分値の校正方法

<p class="eyebrow project-prose__eyebrow">NEXT VERIFICATION</p>

## 次の検証

実センサーを接続し、取得値をシリアルへ定期出力して変化を確認します。

<p class="eyebrow project-prose__eyebrow">LEARNING</p>

## 得られたこと

未完成の大きな構成を一度に作らず、センサー、通信、電源、クラウドを独立した検証単位へ分けています。
