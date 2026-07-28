動画MV対応版です。

配置:
  scripts/collect-project-visuals.mjs

GitHub Actionsの「Collect OGP images and screenshots」より前に、次のstepを追加してください。

- name: Install FFmpeg
  run: |
    sudo apt-get update
    sudo apt-get install -y ffmpeg

Project別設定例:
src/content/projects/technonex-corporate/data/visual-capture.json

{
  "videoTime": 1.5,
  "videoFrameFallback": true,
  "hero": "desktop"
}

videoTimeは秒数です。
