/**
 * Created by Takuro on 2014/09/22.
 * HyperEstraierに関する色々を定義
 */

/**
 * HyperEstraierとのインターフェース
 *
 * XXX:
 * 現在はHyperEstraierのexeのコマンドを呼んでいるだけ。
 * 下記の理由により将来的にオリジナルのライブラリからコンパイルして使う方法はないんかな。
 * また、現在xmlのパースがjQueryに依存している。
 * 近いうちにxml操作部分は以下のいずれかのnode.jsモジュールに置き換えたい。
 * <ul>
 *     <li>elementtree</li>
 *     <li>xml2js</li>
 * </ul>
 * @constructor
 */

var path = require('path');
/**
 * コンストラクタ
 * @param estcmdPath HyperEstraierの配置パス
 * @constructor
 */
function HyperEstraier(estcmdPath) {
    /**
     * コマンド実行時に使う子プロセス
     */
    this.estcmdPath = estcmdPath + '/estcmd.exe';
    this.cp = require('child_process');
    if(path.sep == '\\'){
        this.estcmdPath = this.estcmdPath.replace(/\//g, path.sep);
    } else{
        this.estcmdPath = this.estcmdPath.replace(/\\/g, path.sep);
    }
}

/**
 * 検索実行メソッド
 * @param formattedSafeQuery
 * @param callback 検索が成功した時に呼ばれるメソッド
 * @return jQuery:xmlオブジェクト
 */
HyperEstraier.prototype = {

    constructor: HyperEstraier,

    search: function(keywords, callback){
        //検索コマンド実行
        var formattedSafeQuery = this._generateSearchQuery(keywords);
        var searchCommand = this.estcmdPath + ' search -ic cp932  -vx -max 50 casket "' + formattedSafeQuery + '"';

        var _this = this;
        var child = this.cp.exec(searchCommand, { encoding: 'SJIS' }, function (err, stdout, stderr) {

            //終わったらすぐ殺す。
            child.kill();

            //エラーならログ吐いて終わり
            if (err) {_this._errLog(err);return;}

            //うまくいってたらxmlの内容をXMLオブジェクトにパースする。
            var xml = String(stdout);
            var result = _this._parseResult(xml);
            callback(result);
        });
    },

    /**
     * クロール実行メソッド
     * @param docPath ドキュメントのパス
     * @param casketPath casketを保管するパス
     * @param callback クロール正常終了後に実行するコールバック関数
     * TODO:casketを吐き出す場所を指定できるようにする。gather前にcdすることでできる。
     * execの代わりにspawnを使うように修正が必要です。
     */
    crawl: function (docPath, casketPath, callback) {
        //'\\hyperestraier\\estcmd gather -il ja -sd casket ' + targetPath;'
        var child = this.cp.spawn(this.estcmdPath, ['gather','-il','ja','-sd','casket',docPath], { encoding: 'SJIS', stdio: 'ignore' });
        child.on('close', function (code) {
            callback();
        });
    },

    /**
     * キーワードの配列をHEのAND検索用クエリ(' AND '区切り文字列)に変換
     * @param keywords　キーワード
     * @returns {string} HEのAND検索用クエリ
     */
    _generateSearchQuery: function(keywords){
        var safeKeywords = this._sanitizeKeywords(keywords);
        var query = safeKeywords.compact(true).join(' AND ');
        return query;
    },

    /**
     * 入力キーワードを無害化(OSコマンドインジェクション対策)
     * @param keywords
     */
    _sanitizeKeywords: function(keywords){
         // XXX:正直十分かどうかわからない。
         //     わざとやる奴のPCがどうなっっても知らんが、意図せずやっちゃうのを防がねば。
        for(var i in keywords){
            keywords[i] = keywords[i].replace(/[\"\%]/g, '');
        }
        return keywords;
    },

    /**
     * エラー時はアラート＆コンソールへログ出力
     * TODO:エラー時はエラー用のコールバックメソッドを実行するべき。
     * @param err child_processのエラーオブジェクト
     */
    _errLog: function(err){
        alert('HyperEstraier実行エラー：詳細はコンソールログを確認してください。');
        console.log(err);
        console.log(err.code);
        console.log(err.signal);
    },

    /**
     * 検索結果のxmlを解析してデータを格納したオブジェクトを返す。
     * TODO: jQueryに依存しないようにしたい。
     * @param estResultXml
     * @returns {Array}
     */
    _parseResult: function (estResultXml) {
        var result = [];
        (function ($) {//jQueryを$で使えるようにするおまじない。XXX:これいるんか？
            //xmlをパース
            var xmlDoc = $.parseXML(estResultXml);
            var $xml = $(xmlDoc);
            $xml.find('document').each(function (i) {

                //スニペットのkeyタグをspanタグに置き換え。
                $snippet = $(this).find('snippet');
                $snippet.find('key').each(function () {
                    $(this).replaceWith($('<span>', {class: 'keyword'}).text($(this).text()));
                })
                $snippet.find('delimiter').each(function () {
                    $(this).replaceWith('...  ');
                });
                //this.unwrapSnippetKey($snippet);
                //タイトルを検索結果のドキュメントリンクに
                result.push({
                    index: (i + 1),
                    title: $(this).find('attribute[name=\\@title]').attr('value'),
                    uri: $(this).attr('uri'),
                    snippet: $snippet.html()
                });
            });
        }(jQuery));
        return result;
    }
};




/**
 * <参考>
 * hyperEstraierのドキュメントを、検索ワード"有効"で全文検索した際の結果例
 */
/*
 <!--
 <?xml version="1.0" encoding="UTF-8"?>
 <estresult xmlns="http://hyperestraier.sourceforge.net/xmlns/search" version="1.4.13">
 <meta>
 <hit number="3" auxiliary="off"/>
 <hit key="有効" number="3" auxiliary="off"/>
 <time time="0.000000"/> <total docnum="205" wordnum="12377"/>
 </meta>
 <document id="6" uri="file:///C|/nw/searchTarget/doc/intro-ja.html">
 <attribute name="@author" value="Mikio Hirabayashi"/>
 <attribute name="@digest" value="945afe703d311752bed1b1ed863557d3"/>
 <attribute name="@lang" value="ja"/>
 <attribute name="@mdate" value="2014-09-14T04:35:07Z"/>
 <attribute name="@size" value="24202"/>
 <attribute name="@title" value="Introduction of Hyper Estraier Version 1 (Japanese)"/>
 <attribute name="@type" value="text/html"/> <attribute name="_lfile" value="intro-ja.html"/>
 <attribute name="_lpath" value="file:///C|/nw/searchTarget/doc/intro-ja.html"/>
 <attribute name="_lreal" value="C:\nw\searchTarget\doc\intro-ja.html"/>
 <attribute name="author" value="Mikio Hirabayashi"/>
 <attribute name="content-language" value="ja"/>
 <attribute name="content-style-type" value="text/css"/>
 <attribute name="content-type" value="text/html; charset=UTF-8"/>
 <attribute name="description" value="Introduction of Hyper Estraier"/>
 <attribute name="keywords" value="Hyper Estraier, Estraier, full-text search, introduction"/>
 <snippet>イントロダクション Copyright (C) 2004-2007 Mikio Hirabayashi Last Update: Tue, 06 Mar 2007 12:05<delimiter/>75以降。 なお、QDBMをインストールする際には、zlibを<key normal="有効">有効</key>化（ ./configure --enable-zlib ）しておくことをお薦め<delimiter/>ebug : デバッグ用にビルドします。デバッグシンボルを<key normal="有効">有効</key>化し、最適化を行わず、静的にリンクします。 --enable-<delimiter/>devel : 開発用にビルドします。デバッグシンボルを<key normal="有効">有効</key>化し、最適化を行い、動的にリンクします。 --enable-me<delimiter/>cab : MeCabによるキーワード抽出を<key normal="有効">有効</key>にします。 --disable-zlib : ZLIBによる転置インデック<delimiter/>
 </snippet>
 </document>

 <document id="205" uri="file:///C|/nw/searchTarget/doc/uguide-ja.html">
 <attribute name="@author" value="Mikio Hirabayashi"/>
 <attribute name="@digest" value="d29f66ad7f5e6c147070082abdf4b8fc"/>
 <attribute name="@lang" value="ja"/>
 <attribute name="@mdate" value="2014-09-14T04:35:07Z"/>
 <attribute name="@size" value="165457"/>
 <attribute name="@title" value="User's Guide of Hyper Estraier Version 1 (Japanese)"/>
 <attribute name="@type" value="text/html"/>
 <attribute name="_lfile" value="uguide-ja.html"/>
 <attribute name="_lpath" value="file:///C|/nw/searchTarget/doc/uguide-ja.html"/>
 <attribute name="_lreal" value="C:\nw\searchTarget\doc\uguide-ja.html"/>
 <attribute name="author" value="Mikio Hirabayashi"/>
 <attribute name="content-language" value="ja"/>
 <attribute name="content-style-type" value="text/css"/>
 <attribute name="content-type" value="text/html; charset=UTF-8"/>
 <attribute name="description" value="User's Guide of Hyper Estraier"/>
 <attribute name="keywords" value="Hyper Estraier, Estraier, full-text search, API"/>
 <snippet>ユーザガイド Copyright (C) 2004-2007 Mikio Hirabayashi Last Update: Tue, 06 Mar 2007 12:05:18 +0<delimiter/>ると修飾表示は無効になります。 candetail : 詳細表示を<key normal="有効">有効</key>にするかどうかを指定します。「 true 」か「 false 」で<delimiter/>す。 candir : ディレクトリ表示を<key normal="有効">有効</key>にするかどうかを指定します。「 true 」か「 false 」で<delimiter/>=true 」または「 tfidf=false 」とすると、TF-IDF法の<key normal="有効">有効</key>無効を一時的に変えられます。「 scan=true 」または「 <delimiter/>scan=false 」とすると、検索フレーズの精密検査の<key normal="有効">有効</key>無効を一時的に変えられます。 検索結果の経過時間表示の<delimiter/></snippet>
 </document>

 <document id="43" uri="file:///C|/nw/searchTarget/doc/nguide-ja.html">
 <attribute name="@author" value="Mikio Hirabayashi"/>
 <attribute name="@digest" value="697c62d0e64697959c82fca1a2d40de7"/>
 <attribute name="@lang" value="ja"/>
 <attribute name="@mdate" value="2014-09-14T04:35:07Z"/>
 <attribute name="@size" value="134671"/>
 <attribute name="@title" value="P2P Guide of Hyper Estraier Version 1 (Japanese)"/>
 <attribute name="@type" value="text/html"/>
 <attribute name="_lfile" value="nguide-ja.html"/>
 <attribute name="_lpath" value="file:///C|/nw/searchTarget/doc/nguide-ja.html"/>
 <attribute name="_lreal" value="C:\nw\searchTarget\doc\nguide-ja.html"/>
 <attribute name="author" value="Mikio Hirabayashi"/>
 <attribute name="content-language" value="ja"/>
 <attribute name="content-style-type" value="text/css"/>
 <attribute name="content-type" value="text/html; charset=UTF-8"/>
 <attribute name="description" value="P2P Guide of Hyper Estraier"/>
 <attribute name="keywords" value="Hyper Estraier, Estraier, full-text search, API, Node, P2P"/>
 <snippet>P2Pガイド Copyright (C) 2004-2007 Mikio Hirabayashi Last Update: Tue, 06 Mar 2007 12:05:18 +0900<delimiter/>定ファイルの smlrvnum の値を1以上にすると、類似検索が<key normal="有効">有効</key>になります。この状態でノードサーバに文書を登録すると<delimiter/>et/_node/mikio label &quot;Mikio Hirabayashi&quot; 類似検索を<key normal="有効">有効</key>にする場合は、以下のコマンドも実行してキーワードデー<delimiter/></snippet>
 </document>
 </estresult>
 -->
 */
