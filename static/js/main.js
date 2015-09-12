$( document ).ready(function(){

function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
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
var youtubeUrl = "https://www.youtube.com/api/timedtext?hl=" + lang + "&sparams=asr_langs%2Ccaps%2Cv%2Cexpire&key=yttt1&caps=asr&lang=en&fmt=srv2&v=" + id;

// Download the subtitles
var xhr = new XMLHttpRequest();
xhr.open('POST', youtubeUrl, true);
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 ) {
        var lyrics = "";
        var subtitles = processSubtitle(xhr.responseText);
        var texts = subtitles.getElementsByTagName("text");
        for (var i=0; i<texts.length; i++) {
            lyrics += htmlDecode(texts[i].innerHTML) + "<br>";
        }
        console.log(lyrics);
        var lyrics_element = document.getElementById("lyrictext");
        lyrics_element.innerHTML = lyrics;
    }
}
xhr.send();
  
    }) //document-ready close

