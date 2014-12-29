/**
* Created by Pekotaro on 2014/09/22.
*/


/**
* 検索クエリを詰めとくオブジェクト
* @param input ユーザ入力のクエリ
* @constructor
*/
function SearchQuery(input){
    input = input || ' ';
    this.unsafeKeywords = input.replace(/　/g, ' ').split(' ');
    this.forHtml = this.htmlEscape(this.unsafeKeywords);
}

SearchQuery.prototype = {
    /**
     * この書き方だと定義しなきゃいけないらしい。
     * 出典：O'Reilly オブジェクト指向Javascriptの原則
     */
    constructor: SearchQuery,

    htmlEscape: function(keywords){
        //html表示用にエスケープしたkeyword配列を返す。
        for(var i in keywords){
            keywords[i] = escapeHTML(keywords[i]);
        }
        return keywords;
    }
};

/**
 * URLを絶対URLに変換。
 * 元々絶対URLだった場合もそのまんま
 * @param src
 * @returns{string|jQuery}
 */
function convertAbsUrl(base, src) { //HEのxml内では:が|に置き換わってるのでここで変更
    src = src.replace('|', ':');
    if (src.match(/^http:\/\//) || src.match(/^file:\/\//) || src.match(/^\\\\/)) {
        return src
    }
    return base + src;
}

/**
* 正規表現をエスケープする
* @param string
* @returns {XML|string|void}
*/
function escapeRegExp(string) { return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1"); }

/**
 * HTMLエスケープ
 * @param html
 * @returns {string}
 */
function escapeHTML(html) {
    var elem = document.createElement('div');
    elem.appendChild(document.createTextNode(html));
    return elem.innerHTML;
}
