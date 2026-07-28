House Tect対応版です。

配置:
  scripts/collect-project-visuals.mjs
  src/content/projects/housetect-corporate/data/visual-capture.json

変更点:
- OGP画像を寸法・縦横比で検証
- 546×60のロゴ画像のような代表画像でないOGPを不採用
- 不採用になった古いog-image.*を削除
- PC/SP別click設定に対応
- SPで全画面menuが開いている場合だけmenu controlを検出して閉じる
- House Tectはdesktop screenshotをheroに指定

追加設定:
- desktopClick: PCだけでclickするselector array
- mobileClick: SPだけでclickするselector array
- closeMobileMenu: 開いた全画面mobile menuを撮影前に閉じるboolean
