---
title: 東西産業貿易株式会社 Webサイト
slug: tohzai-sangyo-corporate
summary: 多数の商品と複雑な関連性を整理し、ECサイトのカートに近いUIで選択した商品をまとめて問い合わせできる企業サイト。
origin: 幅広い事業と多数の商品を扱う中で、閲覧者が必要な商品を比較・選択し、複数の商品について一度に問い合わせできる導線が必要だった。
intention: 複雑な商品構造を、閲覧、選択、確認、問い合わせという分かりやすい行動へ変換する。
status: completed
projectType: client
fields:
  - コーポレートサイト
  - 商品情報設計
  - CMS
technologies:
  - WordPress
  - PHP
  - MySQL
  - JavaScript
  - jQuery
  - SVG
roles:
  - システム設計
  - フロントエンド
  - UI設計
  - CMS構築
  - テスト
  - メンテナンス
organization: BLOOMARK
team:
  - デザイナー 1名
  - エンジニア 1名
websiteUrl: https://www.tohzai-sangyo.co.jp/
relatedProjects: 
  - jss-corporate
  - technonex-corporate
  - housetect-corporate
draft: false
heroImage:
  asset: img/desktop.jpg
  alt: 東西産業貿易株式会社 オフィシャルWebサイトの代表画像
images:
  desktop: true
  mobile: true
startedAt: "2020.4"
endedAt: "2020.8"
accent: "#185301"
---

<p class="eyebrow project-prose__eyebrow">ORIGIN</p>

## 発端

東西産業貿易株式会社は、輸入食品、養鶏システム・鶏舎設計施工、食肉プラントなど、食と生産現場に関わる複数の事業を展開しています。

サイト内では多数の商品を扱い、商品同士にも関連があります。閲覧者が個別の商品ページを順番に見るだけでは、自分に必要な商品を整理しながら複数の商品について問い合わせることが難しい状態でした。

<p class="eyebrow project-prose__eyebrow">IDEAL EXPERIENCE</p>

## 目指した体験

商品を探しながら気になるものを一時的に保持し、最後に選んだ商品を確認して、まとめて問い合わせまで進める状態を目指しました。

専門的で関係性の複雑な商品であっても、利用者側にはECサイトで商品をカートへ入れるような馴染みのある操作として提示し、商品構造をすべて理解してからでなくても問い合わせへ進める体験を設計しました。

<p class="eyebrow project-prose__eyebrow">ROLE</p>

## 担当

BLOOMARK在籍時に、エンジニアとしてシステム設計、フロントエンド実装、WordPressによるCMS構築、テスト、公開後のメンテナンスを担当しました。デザイナー1名、エンジニア1名の体制で制作しています。

<p class="eyebrow project-prose__eyebrow">DECISIONS</p>

## 問い合わせを、カートの操作体系へ置き換える

商品をその場で購入するECサイトではありませんが、複数の商品を選びながら検討する行動はECと共通しています。

そこで、商品一覧や詳細を行き来するたびに問い合わせ内容を覚え直すのではなく、気になる商品をカートのような領域へ追加し、選択状態を保持したまま閲覧を続けられるUIとしました。最後に選択した商品をまとめて問い合わせフォームへ渡すことで、商品探索から連絡までを一つの流れへ接続しています。

<p class="eyebrow project-prose__eyebrow">CMS</p>

## 商品と情報を継続して更新できる構造

公開後にクライアント自身が商品や最新情報を更新できるよう、WordPressでCMSを構築しました。利用者側の選択体験だけでなく、その入口となる商品情報を社内で継続的に保守できることもサイトの成立条件としています。

<p class="eyebrow project-prose__eyebrow">IMPLEMENTATION</p>

## 実装

JavaScriptとjQueryを利用し、商品を選択、保持、確認し、問い合わせへ引き継ぐ一連のUIを実装しました。

トップページでは複数の事業領域を視覚的につなぐSVGアニメーションも実装し、当時の対象環境に含まれていたInternet Explorerを含めてブラウザ間の表示と動作を検証しています。

<p class="eyebrow project-prose__eyebrow">ACTION</p>

## 商品を見ることから、まとめて問い合わせることへ

複雑に関係する多数の商品を一つずつ見て終わるのではなく、利用者が必要だと思った商品を選び続け、その選択を保持したまま、最後にまとめて問い合わせまで進めるようにしました。

商品構造の複雑さを利用者へそのまま渡すのではなく、馴染みのある操作体系へ置き換えることで、「情報を読む」状態から「必要な商品について連絡する」行動へつなげています。

<p class="eyebrow project-prose__eyebrow">RESULT</p>

## 完成

2020年4月から8月にかけて設計・制作し、公開後のメンテナンスにも携わりました。商品選択から問い合わせまでの導線、クライアントによる更新運用、企業全体を伝える視覚表現を一つのWebサイトとして成立させたProjectです。
