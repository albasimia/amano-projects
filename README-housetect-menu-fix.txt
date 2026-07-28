House Tect SP menu再修正版です。

原因:
- mobile menuを閉じる処理がfreezeMotionより前にあり、animation停止後にmenuが再表示される可能性がありました。

変更:
- freezeMotion後にmobile menuを処理
- menu item textでopen状態を確認
- House Tectのhamburger座標を直接click
- click後も開いていればmenu itemの共通祖先overlayを撮影時だけ非表示

配置:
- scripts/collect-project-visuals.mjs
- src/content/projects/housetect-corporate/data/visual-capture.json
