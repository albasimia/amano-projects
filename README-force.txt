既存画像スキップ対応版です。

既定:
  force: false

動作:
- forceがfalseなら、既存の有効な画像を種類ごとに再利用して取得をスキップ
- forceがtrueなら、OGP・PC・SP・repository画像をすべて再取得して上書き
- 破損画像や不正サイズのOGPは「存在する画像」とみなさず削除して再取得
- PC画像だけ存在する場合、SPだけ取得
- OGPだけ欠けている場合、画面準備やスクリーンショットを行わずOGPだけ取得

Project別設定例:
{
  "force": true
}

House Tectは修正確認が終わるまでforce:trueにしてあります。
正常取得を確認したらfalseへ戻してください。
