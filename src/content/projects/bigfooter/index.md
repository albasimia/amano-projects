---
title: 除雪状況告知システム Bigfooter
slug: bigfooter
summary: 除雪業務の状況を市民に広く伝える為に管理、アウトプットする為のシステム。
origin: 除雪状況の不透明さが、市民の生活に影響を与えていた。
intention: 除雪状況を手軽に市民に分かりやすい情報に変える。
status: operation
projectType: client
fields:
  - 受託制作
  - 業務システム
  - 地図
technologies:
  - Laravel
  - Vue
  - OpenLayers
  - MySQL
  - Docker
roles:
  - 要件定義
  - システム設計
  - フロントエンド
  - バックエンド
  - 運用設計
startedAt: "2022"
relatedProjects: []
draft: false
accent: "#4B6370"
---

<p class="eyebrow project-prose__eyebrow">ORIGIN</p>

## 発端

市役所職員の知人から、わかりやすく市内の除雪状況を市民に告知する為の画像生成ツールが欲しいと打診がありました。

<p class="eyebrow project-prose__eyebrow">IDEAL EXPERIENCE</p>

## 目指した体験

現場の負担を極力減らしつつ、公開情報と非公開情報の状況を管理できるUI、  
多くの市民の方に情報が誤解なく正確に伝わるアウトプットを目指しました。

<p class="eyebrow project-prose__eyebrow">ROLE</p>

## 担当

クライアントワークとして要件定義、システム設計、実装、継続改修に関わっています。

<p class="eyebrow project-prose__eyebrow">CONDITIONS</p>

## 成立条件

- 市役所の端末の制限から、特定のアプリケーションを必要としないWebシステムであること
- 緊急時に操作方法を知らない職員でも直感的に操作できること
- 公開情報と非公開情報は市役所側で管理できること
- 多くの市民の方に除雪情報が誤解なく正確に伝わること

<p class="eyebrow project-prose__eyebrow">NAMING</p>

## 命名

除雪車の足跡を記録することから、大きな足跡を残す逸話があるビッグフットと、
雪が沢山降った時に使うシステムであることから「大きく 降ったー」をもじり、Bigfooterと名付けました。
市役所職員の方たちが降雪時でも呼びやすく、由来を聞けば忘れられない愛称を目指しました。


<p class="eyebrow project-prose__eyebrow">DECISIONS</p>

## 判断

市役所の端末でも安定動作させるために国土地理院の地理院地図Vectorでの地図描写を選択しました。

<p class="eyebrow project-prose__eyebrow">IMPLEMENTATION</p>

## 実装

オープンソースGISのOpenLayersとVue.jsを利用し、ランニングコストを抑えつつ快適なUXを実装しました。

<p class="eyebrow project-prose__eyebrow">VERIFICATION</p>

## 検証

実際にアウトプットした画像ではランドマークの表示がなく、一見してすぐに場所がわからないという問題がありました。

<p class="eyebrow project-prose__eyebrow">RECONSIDERATION</p>

## 前提の見直し

必要なランドマークを洗い出し、特に避難所となるような学校や施設を中心に表示するように修正しました。  
また、初期はダークテーマで画像をアウトプットしていましたが、危機感を煽りすぎるとの指摘があり、色調を和らげる判断をしました。

<p class="eyebrow project-prose__eyebrow">LEARNING</p>

## 得られたこと

地図情報や位置情報を扱った専門的な実装経験を学習することができました。  
また。アプリケーションを操作するユーザーと、実際にアウトプットされた情報に触れるユーザーが異なる場合の、双方のUXを両立する意識が得られました。
