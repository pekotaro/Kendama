//iframe内でjQueryが使われていた時に競合しないようにおまじない。
$j211 = $.noConflict();
(function ($) {

    var os = require('os');
    var hePath = os.type().has('Windows') ? './hyperestraier' : './hyperestraier_mac';
    const he = new HyperEstraier(hePath);

    var db = openDatabase('heonnwDb', '1.0', 'for saving heonnw settings', 256 * 1024);
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS settings (id integer primary key autoincrement, key unique, val)');
    });

    //初期処理
    (function initialize() {

        //クロール未実施ならインデックス作成ボタン表示
        if (!hasCrawled()) {
            $('div#initialize').show();
            $('div#grep_box').hide();
            $('div#toolbar').hide();
            $('iframe#doc_box').hide();
            $('div#initialize input#searchTarget').focus();
            $('div#initialize input#searchTargetWrap').on('focus', function () {
                $('div#initialize input#searchTarget').click();
                $(this).blur();
                return false;
            });
            $('div#initialize input#searchTarget').on('change', function () {
                var path = $(this).val();
                if(path != '') {
                    $('div#initialize button#createIndex').show();
                    $('div#initialize input#searchTargetWrap').val(path);
                }
            });
        }else{
            var searchTargetPath;
            $('div#grep_form button#search').prop("disabled", true);
            db.transaction(function (tx) {
                tx.executeSql('SELECT key, val FROM settings WHERE key = "path"', [], function (tx, results) {
                    searchTargetPath = results.rows.item(0).val
                });
            });
            he.updateIndex(searchTargetPath, function(){
                he.purge(function(){
                    $('div#grep_form button#search').prop("disabled", false);
                    console.log('インデックス更新完了');
                });
            });
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
            var path = $('input#searchTargetWrap').val();
            he.crawl(path, '', function () {

                $('div#initialize').remove();
                $('div#grep_box').show();
                $('div#toolbar').show();
                $('iframe#doc_box').show();
                db.transaction(function (tx) {
                    tx.executeSql('INSERT OR REPLACE INTO settings (key, val) VALUES ("path", ?)',[path]);
                });
                alert('インデックス作成完了。検索できます。');
            });
        })
    }());

    var path = require('path');
    const dirPath = process.cwd(); //node-webkit実行ファイルのあるフォルダのパス
    const BASE_URI = 'file:///' + dirPath.replace(/\\/g, '/'); //\は/に変更
    const DOC_URI = BASE_URI + '/searchTarget/'; //検索対象のURL
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

        shortcut.add("Shift+Tab", function () {
            return false;
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

                if (results.length == 0){
                    var $noResult = $('<p>', {class: 'noResult'}).text('"' + input + '" に一致する情報は見つかりませんでした。');
                    $result_box.find('div#result').append($noResult);
                    return;
                }

                //検索結果を表示
                var resultTip;
                for (var i = 0; resultTip = results[i]; i++) {
                    var $resultTip = $('<div>', {class: 'resultTip'});
                    if(resultTip.title == null) resultTip.title = ' ( No Title )';
                    var $link = $('<a>', {
                        class: "result_link",
                        href: resultTip.uri,
                        target: 'doc_box'
                    });
                    var $index = $('<span>', {class: 'index'}).text(resultTip.index + '.');
                    var $title = $('<span>', {class: 'title'}).text(resultTip.title);
                    var $titleBlock = $('<div>', {class: 'title_block'});
                    var $snippet = $('<p>', {class: 'snippet'}).html(resultTip.snippet); //XXX: snippetの部分htmlでそのまま出してるけどXSSされない？hyperestraierの仕様要確認
                    $titleBlock.append($index);
                    $titleBlock.append($title);
                    $resultTip.append($titleBlock);
                    $resultTip.append($snippet);
                    $link.append($resultTip);

                    //結果表示領域に一件ずつ追加
                    $result_box.find('div#result').append($link);
                }
                //検索結果の1件目にフォーカス
                $result_box.find('div#result a.result_link')[0].focus();
            });
        });
    });

    /*
     * 検索結果表示領域の読み込み時処理
     */
    $('iframe#result_box').load(function () {
        var $result_box = $('iframe#result_box').contents();
        addCommonKeyBind($result_box[0]);

        $result_box.on('click', 'a.result_link' , function () {
            this.focus();
            $(this).find('.title').css('color', 'rgba(150, 140, 210, 0.875').focus();
        });

        //最後の要素だった時はtab次に行かせないようにする。
        $result_box.on('keydown', 'a:last', function (e) {
            if(e.keyCode == 9 /*Tab*/&& !e.shiftKey)return false;
        });

        $result_box.on('focus', 'a.result_link', function(e){
            focusedResultLink = this;;
            var $result = $result_box.find('div#result');
            var resultTipHeight = $result.height() / $result.find('a.result_link').length;
            var scrollTopOrz = $result_box.scrollTop(); //focusすると勝手にスクロール時があるので、元々の高さを先に取得

            //次の要素がiframeの表示範囲外ならちょうど収まる位置にスクロールする。
            var scrollTo;
            if($(this).offset().top + resultTipHeight > scrollTopOrz + $('iframe#result_box').height()){
                scrollTo = $(this).offset().top - $('iframe#result_box').height() + resultTipHeight;
            }else if($(this).offset().top < scrollTopOrz){
                scrollTo  = $(this).offset().top;
            }else{
                scrollTo = scrollTopOrz;
            }
            $result_box.scrollTop(scrollTo);

            /* FIXME:上のロジックでスクロールさせた後、iframeが謎の位置に勝手にスクロールすることがある。
                     この問題は画面サイズ小さい時によく起こる。
                     原因がわからないため、以下のようにもう一度スクロールさせて一時的な対策としている。
             */
            window.setTimeout(function(){
                $result_box.scrollTop(scrollTo);
            }, 1);
        });

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
                    //このようにhiddenとvisibleで挟んで再描画させないと、二周目以降かつ、スクロールが無い場合にcssがすぐに適用されない。
                    doc_box.document.body.style.visibility = 'hidden';
                    traceHighLight.next();
                    doc_box.document.body.style.visibility = 'visible';
                }
            },
            'Shift+N': {
                'callback': function () {
                    //このようにhiddenとvisibleで挟んで再描画させないと、二周目以降かつ、スクロールが無い場合にcssがすぐに適用されない。
                    doc_box.document.body.style.visibility = 'hidden';
                    traceHighLight.prev();
                    doc_box.document.body.style.visibility = 'visible';
                }
            },
            'Ctrl+E': {
                'callback': function () {
                    var isVisible = $('div#grep_form').is(':visible');
                    $('div#grep_box').show();
                    if(focusedResultLink != null)focusedResultLink.focus();
                    if(isVisible || $('iframe#result_box').contents().find('a.result_link:focus').length == 0){
                        $('div#grep_form input#keyword').focus();
                    }
                }
            },
            'Esc': {
                'callback': function () {
                    $('div#grep_box').hide();
                    return false;
                },
                option:{
                    'disable_in_input': false,
                    'target': target
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

}($j211));