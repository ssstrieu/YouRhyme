$( document ).ready(function(){

$('.wordblock').on('click', function(){
        $( this ).addClass('hide');
   });
 
function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function updateRhymes(word, stopWord) {
    rhymeUrl = "http://rhymebrain.com/talk?function=getRhymes&word=" + word;
    $.getJSON( rhymeUrl, function( data ) {
            var items = [];
            for (var i=0; i<data.length; i++) {
                items.push(data[i]["word"]);
            }
            if (items[0] != stopWord && items[1] != stopWord && items[2] != stopWord && items[3] != stopWord) {
                items[2] = stopWord;
            }
            $("#word1").html(items[0]);
            $("#word2").html(items[1]);
            $("#word3").html(items[2]);
            $("#word4").html(items[3]);
        });
}

function processSubtitle(subtitle) {
    if( !subtitle ) return null;
    var tmp;
    if ( window.DOMParser )
        {
            // Standard
            tmp = new DOMParser();
            return tmp.parseFromString( subtitle , "text/xml" );
        }
    else
        {
            // IE
            tmp = new ActiveXObject( "Microsoft.XMLDOM" );
            tmp.async = "false";
            return tmp.loadXML( subtitle );
        }
}

var lang = "en_US";

var id = "fZ9WiuJPnNA";
var startWord = "four";
var endWord = "floor";

var youtubeUrl = "https://www.youtube.com/api/timedtext?hl=" + lang + "&sparams=asr_langs%2Ccaps%2Cv%2Cexpire&key=yttt1&caps=asr&lang=en&fmt=srv2&v=" + id;

// Download the subtitles
var xhr = new XMLHttpRequest();
xhr.open('POST', youtubeUrl, true);
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 ) {
        var inExcerpt = false;
        var lyrics = "";
        var subtitles = processSubtitle(xhr.responseText);
        var texts = subtitles.getElementsByTagName("text");
        for (var i=0; i<texts.length; i++) {
            var line = htmlDecode(texts[i].innerHTML);
            if (line.indexOf(startWord) >= 0) {
                inExcerpt = true;
            }
            if (inExcerpt) {
                lyrics += line + "<br>";
            }
            if (line.indexOf(endWord) >= 0) {
                break;
            }
        }
        console.log(lyrics);
        var lyrics_element = document.getElementById("lyricsbox");

        var revisedLyrics = lyrics.replace(endWord, "<span class=\"hole\" id=\"hole\">___</span>");
        revisedLyrics = revisedLyrics.replace(startWord, "<span class=\"startword\" id=\"startword\">" + startWord + "</span>");
        lyrics_element.innerHTML = revisedLyrics;

        var keyword_element = document.getElementById("keyword");
        keyword_element.innerHTML = startWord;

        updateRhymes(startWord, endWord);
    }
}
xhr.send();


    });