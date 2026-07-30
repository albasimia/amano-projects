---
title: ぷりんちゃん非公式サイト
slug: purin-chang-unofficial
summary: ダンス活動を行う友人の人物像と活動を編集した、誕生日用の非公式サイト。
origin: ダンス活動をしている友人の魅力を、本人の活動全体が見えるWebサイトへまとめたかった。
intention: 名前、活動、ビジュアルをひとつの世界観へまとめ、本人のためのWeb上の入口をつくる。
status: completed
fields:
  - Web
  - アイデンティティ
  - ダンス
technologies:
  - Pug
  - Sass
  - JavaScript
  - Canvas API
  - Swiper
  - Axios
  - Webpack
roles:
  - 企画
  - 編集
  - デザイン
  - 実装
repositoryUrl: https://github.com/albasimia/purin_chang_unofficial
websiteUrl: https://albasimia.github.io/purin_chang_unofficial/
relatedProjects:
  - birthday-contents
draft: false
heroImage:
  asset: img/og-image.png
  alt: ぷりんちゃん非公式サイトの代表画像
accent: "#c492f2"
startedAt: "2021.9"
endedAt: "2021.9"
---

<p class="eyebrow project-prose__eyebrow">ORIGIN</p>

## 発端

ダンス活動をしている友人の誕生日に、活動内容と人物像をまとめた非公式サイトを制作しました。

<p class="eyebrow project-prose__eyebrow">IDEAL EXPERIENCE</p>

## 目指した体験

本人の魅力や活動を、断片的なSNS投稿ではなく、ひとつの世界観として閲覧できる状態を目指しました。

<p class="eyebrow project-prose__eyebrow">CONDITIONS</p>

## 成立条件

- 非公式サイトであることを明示すること
- 本人の活動を尊重すること
- 写真や名称の公開許可を確認すること
- PCとスマートフォンの両方で閲覧できること

<p class="eyebrow project-prose__eyebrow">IMPLEMENTATION</p>

## 実装

プロフィール、YouTube動画のギャラリー、友人によるレビューを一つのページへ構成しました。Canvasによるビジュアル演出とSwiperによるスライダーを加え、人物像と活動を複数の視点から見られるサイトにしています。

Pug、Sass、JavaScriptをWebpackでビルドし、Axiosを利用して外部データを取得する構成としました。PCとスマートフォンの双方に対応しています。

<p class="eyebrow project-prose__eyebrow">VERIFICATION</p>

## 検証

プロフィール情報だけで人物を説明するのではなく、本人の動画と友人からのレビューを並べることで、活動と周囲から見た人物像を同じページにまとめました。
