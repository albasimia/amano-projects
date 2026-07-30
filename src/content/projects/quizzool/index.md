---
title: Quizzool
slug: quizzool
summary: 管理者・参加者・会場表示をリアルタイムにつなぎ、ブラウザだけでクイズ大会を開催できるイベントプラットフォーム。
origin: 専用機材やアプリのインストールなしで、テレビ番組のような演出を持つクイズ大会を開催できる仕組みを個人制作した。
intention: 出題、回答、正解発表、ランキングまでを複数端末で共有し、その場にいる人が手軽に参加できるクイズイベントを成立させる。
status: completed
projectType: personal
fields:
  - リアルタイム
  - イベント
  - マルチデバイス
technologies:
  - Vue.js
  - Vuex
  - Vue Router
  - Firebase
roles:
  - 企画
  - 要件定義
  - UI設計
  - システム設計
  - 実装
  - 運用
websiteUrl: https://quizzool.web.app/
heroImage:
  asset: img/og-image.png
  alt: Quizzoolのロゴとサービス紹介
screenshots:
  desktop: true
  mobile: false
accent: "#5451a9"
relatedProjects:
  - hele-counter
draft: false
startedAt : "2019.10"
endedAt: "2020.8"
---

<p class="eyebrow project-prose__eyebrow">ORIGIN</p>

## 発端

クイズ大会には、問題を用意する人、進行する人、回答する参加者、全員が見る会場画面という複数の役割があります。これらを専用機材ではなく、それぞれのブラウザから利用できるひとつのサービスとしてまとめました。

<p class="eyebrow project-prose__eyebrow">IDEAL EXPERIENCE</p>

## 目指した体験

主催者がイベントと問題を作成し、参加者は手元のスマートフォンから回答する。会場では問題や正解、ランキングがテレビ番組のように切り替わる。インストール不要のWebアプリだけで、この一連のクイズイベントを開催できる状態を目指しました。

<div class="project-video">
  <iframe
    src="https://www.youtube.com/embed/n-rgXyzDx3o?autoplay=1&mute=1&loop=1&playlist=n-rgXyzDx3o&rel=0"
    title="Quizzool 紹介動画"
    loading="lazy"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>

<p class="eyebrow project-prose__eyebrow">STRUCTURE</p>

## 役割ごとに画面を分離

- 管理者画面：イベント作成、問題編集、出題進行、参加者・回答・ランキングの管理
- 参加者画面：イベントへの参加と、手元の端末からの回答
- 会場画面：問題、回答数、正解、解説、ランキング、個人成績の表示

参加者はGoogleまたはTwitterアカウントのほか、サインインせずに参加できる構成としました。管理者は問題文、4択の選択肢、正解、解説、問題画像を登録し、イベント中は各画面の状態を一括して切り替えます。

<p class="eyebrow project-prose__eyebrow">IMPLEMENTATION</p>

## 実装

Vue.jsで画面を構築し、Vue Routerで役割別の画面を分離、Vuexで状態を管理しました。Firebaseを利用してイベントルーム、出題状態、参加者、回答、ランキングを端末間で同期しています。

進行状態は、待機、出題、回答受付、正解発表、ランキング表示、個人成績通知などに分け、管理者の操作に応じて参加者画面と会場画面が同時に切り替わる構成です。

<p class="eyebrow project-prose__eyebrow">OPERATION</p>

## 公開と運用

個人運営の無料サービスとしてFirebase Hostingへ公開し、β版として提供しました。ランディングページでは、忘年会、結婚式の二次会、オンライン飲み会、習熟度チェックテストなどでの利用を想定しています。

<p class="eyebrow project-prose__eyebrow">LEARNING</p>

## 得られたこと

複数人が同じ場で使うシステムでは、機能をひとつの操作画面へ集めるより、主催者、参加者、会場という役割ごとに分離し、共有する状態だけをリアルタイムに同期する方が体験を単純にできます。後の参加型イベントコンテンツにもつながる、役割分担とリアルタイム設計の実践になりました。
