//iframe内でjQueryが使われていた時に競合しないようにおまじない。
$j211 = $.noConflict();
(function ($) {

    var os = require('os');
    var hePath = os.type().has('Windows') ? './hyperestraier' : './hyperestraier_mac';
    const he = new HyperEstraier(hePath);

    //初期処理
    (function initialize() {

        //クロール未実施ならインデックス作成ボタン表示
        if (!hasCrawled()) {
            $('div#initialize').show();
            $('div#grep_box').hide();
            $('div#toolbar').hide();
            $('iframe#doc_box').hide();
        }

        /**
         * クロール済かどうかを判定
         * (casketフォルダの存在チェック)
         * @returns Boolean
         */
        function hasCrawled() {
            var fs = require('fs');
            return fs.existsSync("./casket")
        }

        /*
         * インデックス作成ボタン押下時
         */
        $('div#initialize button#createIndex').click(function () {
            $('div#please_wait span#loading_msg').show();
            $('div#please_wait img#loading').show();
            $('button#createIndex').prop("disabled", true);
            he.crawl('./searchTarget', '', function () {

                $('div#initialize').hide();
                $('div#grep_box').show();
                $('div#toolbar').show();
                $('iframe#doc_box').show();
                alert('インデックス作成完了。検索できます。');
            });
        })
    }());

    var path = require('path');
    const dirPath = process.cwd(); //node-webkit実行ファイルのあるフォルダのパス
    const BASE_URI = 'file:///' + dirPath.replace(/\\/g, '/'); //\は/に変更
    const DOC_URI = BASE_URI + '/searchTarget/doc/'; //検索対象のURL
    var searchQuery = new SearchQuery('');
    var traceHighLight = new TraceHighLight();

    /*
     * "新しいウィンドウでページを開く"操作をされた場合は、既定のブラウザで開かせる設定
     */
    var gui = require('nw.gui');
    var nwWindow = gui.Window.get();
    nwWindow.on('new-win-policy', function (frame, url, policy) {
        gui.Shell.openExternal(url);
        policy.ignore();
    });

    //index.html読み込み直後処理
    $(function () {
        addCommonKeyBind($('body')[0]); //共通キーバインドを設定

        //検索フォーム内でEnterキーが押されたら検索実行
        shortcut.add("Enter", function () {
            $('div#grep_form button#search').click();
        }, {
            'disable_in_input': false,
            'target': $('div#grep_form input#keyword')[0]
        });

        //検索ボタン押下時の処理
        $('div#grep_form button#search').on('click', function () {
            var $result_box = $('iframe#result_box').contents();

            //検索結果を空にする。
            $result_box.find('div#result').empty();

            //キーワード取得・検索実行
            var input = $("div#grep_form input#keyword").val();
            searchQuery = new SearchQuery(input);
            he.search(searchQuery.unsafeKeywords, function (results) {

                if (results.length == 0)return;

                //検索結果を表示
                var resultTip;
                for (var i = 0; resultTip = results[i]; i++) {
                    var $index = $('<span>', {class: 'index'}).text(resultTip.index + '.');
                    var $resultTip = $('<div>', {class: 'resultTip'});
                    if(resultTip.title == null) resultTip.title = ' ( No Title )';
                    var $link = $('<a>', {
                        class: "result_link",
                        href: resultTip.uri,
                        target: 'doc_box'
                    }).text(resultTip.title);
                    var $snippet = $('<div>', {class: 'snippet'}).html(resultTip.snippet);
                    $resultTip.append($index);
                    $resultTip.append($link);
                    $resultTip.append($snippet);

                    //結果表示領域に一件ずつ追加
                    $result_box.find('div#result').append($resultTip);
                }
                //検索結果の1件目にフォーカス
                $result_box.find('div#result div.resultTip a')[0].focus();
            });
        });
    });

    /*
     * 検索結果表示領域の読み込み時処理
     */
    $('iframe#result_box').load(function () {
        var $result_box = $('iframe#result_box').contents();
        addCommonKeyBind($result_box[0]);
    });

    /*
     * doc_boxがロードされた時の処理
     * doc_boxに表示されたページに以下のイベント処理を追加する。
     * <ul>
     *     <li>ページ内の検索ワードをハイライトする。</li>
     *     <li>外部リンククリック時に既定のブラウザで開く</li>
     * </ul>
     */
    $('iframe#doc_box').load(function () {
        var $doc_box = $('iframe#doc_box').contents();

        addCommonKeyBind($doc_box[0]); //共通キーバインドを設定
        denyExternalLink(); //外部サイトへのリンクを既定ブラウザで開くようにする。

        //doc_boxがクリックされたらresult_boxは消す。
        $doc_box.on('click', window, function () {
            $('div#grep_box').hide();
        });

        //highlight用のcssをdoc_boxに読み込ませる。
        var link = '<link rel="stylesheet" href="' + BASE_URI +  '/src/css/page.css">';
        $(this).contents().find('meta:last').after(link);

        //検索ワードにHighLightを設定
        searchQuery.forHtml.each(function (keyword) {
            $('iframe#doc_box').contents().find("body").highlight(keyword);
        });
        //HighLight追跡オブジェクト初期化
        traceHighLight = new TraceHighLight($doc_box.contents());
    });

    /* 全領域共通のショートカットを定義　*/
    function addCommonKeyBind(target) {
        var shortcuts = {
            'N': {
                'callback': function () {
                    traceHighLight.next();
                }
            },
            'Shift+N': {
                'callback': function () {
                    traceHighLight.prev();
                }
            },
            'Ctrl+E': {
                'callback': function () {
                    $('div#grep_box').show();
                    $('div#grep_form input#keyword').blur().focus();
                }
            },
            'Esc': {
                'callback': function () {
                    $('div#grep_box').hide();
                }
            },
            'Alt+Left': {
                'callback': function () {
                    window.history.back();
                }
            },
            'Alt+Right': {
                'callback': function () {
                    window.history.forward();
                }
            }
        };

        //shortcut.jsのaddメソッドに渡すオプションのデフォルト値
        var default_opt = {
            'disable_in_input': true,
            'target': target
        };
        Object.keys(shortcuts, function (key, action) {
            var opt = action['option'] == undefined ? default_opt : action['option'];
            shortcut.add(key, action['callback'], opt);
        });
    }

    /*
     * 外部サイトのリンクがクリックされた場合、既定のブラウザで表示する。
     */
    function denyExternalLink() {
        //const gui = require('nw.gui');
        $($('iframe#doc_box').contents()).on('click', 'a', function () {
            var absUrl = convertAbsUrl(DOC_URI, $(this).attr("href"));//絶対URLに変換
            var reg = new RegExp('^' + DOC_URI);
            if (!absUrl.match(reg)) {
                gui.Shell.openExternal(absUrl);
                return false;
            }
        });
    }

    /**
     * ドキュメント内の、検索ワードのトレースに使用するクラス
     * @param $contents
     * @constructor
     */
    function TraceHighLight($contents) {
        this.$contents = $contents;
        if (this.$contents == null)return;
        this.highlights = $contents.find('span.highlight');
        this.currentFocusId = -1;
    }

    TraceHighLight.prototype = {

        constructor: TraceHighLight,
        next: function () {
            if (this.$contents == null) {
                return false
            }

            $(this.highlights[this.currentFocusId]).removeClass('traced');
            /* TODO:循環インクリメントは別メソッド化 */
            ++this.currentFocusId;
            if (this.currentFocusId >= this.highlights.length) {
                this.currentFocusId = 0;
            }
            this.trace();
        },

        prev: function () {
            if (this.$contents == null) {
                return false
            }

            $(this.highlights[this.currentFocusId]).removeClass('traced');
            /* TODO:循環デクリメントは別メソッド化 */
            --this.currentFocusId;
            if (this.currentFocusId < 0) {
                this.currentFocusId = this.highlights.length - 1;
            }
            this.trace();
        },

        trace: function () {
            var $target = $(this.highlights[this.currentFocusId]);
            $target.addClass('traced');
            doc_box.scrollTo(0, $target.offset().top - 150);
        }
    };
}($j211))