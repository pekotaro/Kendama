# HEonNW
HEonNWはローカルドキュメントの全文検索ツールです。  
以下のオープンソースプロジェクトを利用させていただいています。
+ 検索エンジン：HyperEstraier
+ プラットフォーム：node-webkit v10.0.6
+ ライブラリ：v1.4.13
  + jQuery v2.1.1
  + jQuery.highlight-4.js
  + sugar.js v1.4.1
  + shortcut.js
+ CSS：Bootstrap v3.1.1

# 機能
+ htmlファイル内の表示テキストを全て検索、表示できる。
+ macでも動きます。

# ダウンロード(ユーザ用)

使用する際は以下のリンクからアーカイブをダウンロードし、  
任意の場所に展開してください。  
Windows: 
[Win32](http://download4.getuploader.com/g/54a98c12-6358-4d77-9ea4-239ab63022d0/pekotaro_github/1/HEonNW.zip)  
Mac:
Coming soon...

# 使い方
## 検索開始まで
### Windows
1. "searchTarget"フォルダに検索したいファイルorフォルダを格納
2. HEonNW.exeを起動
3. 「インデックス作成」ボタンを押下
4. "検索できます"と表示されたら検索できます！！

### Mac
Coming soon...

## 操作方法

以下のキーボード操作により操作が可能です。  
特に最初の"検索バー表示"はキーボードからの操作でしか実行できないので、(※修正予定)  
覚えていてください。

Ctrl + e : 検索バー表示  
Esc : 検索バー非表示  
n : 表示ドキュメント内の次の検索ワードにフォーカス  
Shift + n : 表示ドキュメント内の前の検索ワードにフォーカス  
Alt + ← : ブラウザの戻ると同じ  
Alt + → : ブラウザの進むと同じ  

## 検索対象ファイルを置き換えたい場合
### Windows/Mac共通
1. HEonNWを閉じる。
2. "searchTarget"フォルダ内のファイルorフォルダを新しいものに置き換える。
3. "casket"フォルダを削除
4. HEonNWを再び起動
5. インデックス作成ボタンを押下

# ライセンス
このアプリのソースコードを利用する際は以下のライセンスに従ってください。  
GNU LESSER GENERAL PUBLIC LICENSE Version 2.1

# これから
+ UIを強化。
   + インデックス更新を自動化or画面から操作可能に。
   + ドキュメントマップの表示。
   + 類似検索結果の除外。
+ htmlファイル以外のファイル検索に対応。  
例えば以下のようなファイルです。
   + txtファイル
   + .c,.javaなどのソースコード
   + pdf
   + xls,docなどのofficeファイル
