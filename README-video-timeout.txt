動画frame取得の停止対策版です。

変更点:
- videoFrameFallbackの既定値をfalseへ変更
- 動画全体をNodeへdownloadせず、FFmpegがURLから指定秒数を直接取得
- FFmpegを45秒で強制終了
- 動画frame処理の開始・完了をActions logへ表示

TechnoLABOだけ次を指定してください。

src/content/projects/technonex-corporate/data/visual-capture.json

{
  "videoTime": 1.5,
  "videoFrameFallback": true,
  "hero": "desktop"
}
