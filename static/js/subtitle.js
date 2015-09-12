// Brook Seaton Copyright 2015
var DOM_OBJECT = document.createElement("p");
var SUBTITLE_ARRAY;
var SUBTITLE_CUR;
var SUBTITLE_DURATION;
var SUBTITLE_INDEX;
var NEXT_INDEX;

function setSubtitleCur(milli)
{
    var SUBTITLE_INDEX = -1;
    //window.alert("setSubtitleCur!");
    
    // Clear the data, just in case the data isn't found
    SUBTITLE_CUR = "";
    
    for( var i = 0; i < SUBTITLE_ARRAY.length; i++ )
    {
        var time = SUBTITLE_ARRAY[i].getAttribute("t");
        var delta = milli - time;
        if( delta > 0 )
        {
            // We've passed this time step, but is it inside of it?
            var duration = parseFloat(SUBTITLE_ARRAY[i].getAttribute("d"));
            if( delta < duration )
            {
                // It is inside the time step, so gather the data.
                SUBTITLE_INDEX = i;
                SUBTITLE_COUNT = i+1;
                SUBTITLE_CUR = SUBTITLE_ARRAY[i].textContent;
                SUBTITLE_DURATION = duration - delta;
                window.alert(SUBTITLE_DURATION + " = " + duration + " - " + delta );
                break;
            }
        }
        else
        {
            // The text was not found!
            SUBTITLE_INDEX = -1;
            SUBTITLE_COUNT = i;
            SUBTITLE_CUR = "";
            SUBTITLE_DURATION = time - milli;
            break;
        }
    }
    
    // This time slot text was found!
    // WARNING! The subtitles are html encoded, so it needs to be converted!
    DOM_OBJECT.innerHTML = SUBTITLE_CUR;
    $("#subtitle")[0].value = DOM_OBJECT.textContent;
}

function saveSubtitle(subtitle)
{
    if( !subtitle )
    {
        window.alert("Subtitle Not Found!");
        SUBTITLE_ARRAY = null;
        return;
        
    }
    var tmp;
    if ( window.DOMParser )
    {
        // Standard
        tmp = new DOMParser();
        SUBTITLE_ARRAY = tmp.parseFromString( subtitle , "text/xml" );
    }
    else
    {
        // IE
        tmp = new ActiveXObject( "Microsoft.XMLDOM" );
        tmp.async = "false";
        SUBTITLE_ARRAY = tmp.loadXML( subtitle );
    }
    SUBTITLE_ARRAY = $(SUBTITLE_ARRAY).find("text");
    setSubtitleCur(0);
    
    
    // This time slot text was found!
    // WARNING! The subtitles are html encoded, so it needs to be converted!
    DOM_OBJECT.innerHTML = SUBTITLE_ARRAY[0].textContent;
    $("#subtitle")[0].value = DOM_OBJECT.textContent;
    window.alert("SUCCESS");
    
}

function loadSubtitle(id,lang)
{
    // var id = getID("v"); Collect the idea later
    if( id && lang )
    {
        var url = "https://www.youtube.com/api/timedtext?hl=" + lang + "&sparams=asr_langs%2Ccaps%2Cv%2Cexpire&key=yttt1&caps=asr&lang=en&fmt=srv2&v=" + id;
        
        // Download the subtitles
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 ) {
                saveSubtitle(xhr.responseText);
            }
        }
        xhr.send();
    }
}

function intervalSubtitle(milli)
{
    SUBTITLE_DURATION -= milli;
    $("#duration")[0].value = SUBTITLE_DURATION;
    
    if( SUBTITLE_DURATION < 0 )
    {
        var i = SUBTITLE_COUNT;
        
        // NEXT SUBTITLE
        if( i < SUBTITLE_ARRAY.length )
        {
            var duration = parseFloat(SUBTITLE_ARRAY[i].getAttribute("d"));
            
            // It is inside the time step, so gather the data.
            SUBTITLE_INDEX = i;
            SUBTITLE_COUNT = i+1;
            SUBTITLE_CUR = SUBTITLE_ARRAY[i].textContent;
            SUBTITLE_DURATION = duration + SUBTITLE_DURATION;
        }
        else
        {
            // The text was not found!  ERROR!!!
            SUBTITLE_INDEX = -1;
            SUBTITLE_COUNT = i;
            SUBTITLE_CUR = "";
            SUBTITLE_DURATION = 2000000;
        }
        
        // This time slot text was found!
        // WARNING! The subtitles are html encoded, so it needs to be converted!
        DOM_OBJECT.innerHTML = SUBTITLE_CUR;
        $("#subtitle")[0].value = DOM_OBJECT.textContent;
    }
}

/*
function timeSubtitle()
{
    var test = $("#time");
    var time = $("#time")[0].value;
    setSubtitleCur(time);
}

function codeSubtitle()
{
    var code = $("#code")[0].value;
    var lang = "en_US";
    loadSubtitle(code,lang);
}
*/
