// Brook Seaton Copyright 2015
var PLAYER_YT = null;
var VIDEO_DIV_ID = null;
var VIDEO_DIV_WIDTH = '390';
var VIDEO_DIV_HEIGHT = '640';
var VIDEO_ID = null;
var VIDEO_START;
var VIDEO_END;
var VIDEO_CUR;
var VIDEO_INTERVAL;
var VIDEO_MILLI = 100.0;
var VIDEO_SECS = VIDEO_MILLI/1000.0;
var NEXT_ID;
var NEXT_START;
var NEXT_END;
var PREVIEW_ON = false;
var PLAYER_DATA = false;
var PLAYER_API = false;
var VIDEO_TIMEOUT = null;
var VIDEO_DURATION;

function centerParentChild(div)
{
    var child = $(div);
    var parent = $(child[0].parentNode);
    var width = parent.width() - child.width();
    width = width/2;
    var height = parent.height() - child.height();
    height = height/2;
    child.css({top: height, left: width});
}

// The API will call this function when the API is loaded.
function onYouTubeIframeAPIReady()
{
    console.log("api ready");
    $("#" + VIDEO_DIV_ID).hide();
    readyVideo();
}

// The API will call this function when the video player is ready.
function onPlayerReady(event)
{
    //console.log("player ready");
    changeVideo();
}

// The API calls this function when the player's state changes.
function onPlayerStateChange(event)
{
    destroyTime();
    
    if( event.data == YT.PlayerState.PLAYING )
    {
        //console.log("playing");
        $("#" + VIDEO_DIV_ID).show();
        VIDEO_CUR = PLAYER_YT.getCurrentTime();
        VIDEO_DURATION = PLAYER_YT.getDuration();
        
        durationVideo(); // SET THE DURATION!
        createTime();
    }
    else if( event.data == YT.PlayerState.ENDED )
    {
        console.log("bad result! video ended!");
        $("#" + VIDEO_DIV_ID).hide();
        endVideo();
    }
    else if( event.data == YT.PlayerState.PAUSED )
    {
    }
    
}

// -------------------- INTERMEDIATE FUNCTIONS -----------------------

function createVideo()
{
    //console.log("player create");
    PLAYER_YT = new YT.Player( VIDEO_DIV_ID, {
                           height: VIDEO_DIV_HEIGHT,
                           width: VIDEO_DIV_WIDTH,
                           //startSeconds: VIDEO_START, // DOESN'T WORK!
                           //endSeconds: VIDEO_END, // DOESN'T WORK!
                           videoId: VIDEO_ID,
                           events: {
                           'onReady': onPlayerReady,
                           'onStateChange': onPlayerStateChange
                           },
                           playerVars: {
                           'playsinline': 1, // Disable ios fullscreen
                           'autoplay': 1,
                           'controls': 0,
                           'showinfo': 0,
                           'modestbranding': 1, // DOESN'T WORK!
                           'wmode': 'transparent', // DOESN'T WORK!
                           }
                           });
}

function changeVideo()
{
    //console.log("player change");
    PLAYER_YT.loadVideoById({
                         startSeconds: VIDEO_START, // DOES WORK!
                         //endSeconds: VIDEO_DURATION, //VIDEO_END, // DOES WORK!
                         videoId: VIDEO_ID
                         });
}

function seekVideo()
{
    //console.log("player change");
    PLAYER_YT.seekTo(VIDEO_START, true);
    PLAYER_YT.playVideo();
}

function endVideo()
{
    // Pause the current video and start the next one!
    if( PLAYER_YT != null )
    {
        PLAYER_YT.pauseVideo();
        nextVideo();
    }
}

function destroyTime()
{
    if( VIDEO_INTERVAL )
    {
        clearInterval(VIDEO_INTERVAL);
        VIDEO_INTERVAL = null;
    }
    
    if( VIDEO_TIMEOUT )
    {
        clearTimeout(VIDEO_TIMEOUT);
        VIDEO_TIMEOUT = null;
    }
}

function completeTime()
{
    stopMyVideo();
    endVideo();
}

function createTime()
{
    if( VIDEO_END < VIDEO_CUR )
        VIDEO_END = VIDEO_DURATION;
    
    VIDEO_TIMEOUT = setTimeout(completeTime,(VIDEO_END-VIDEO_CUR)*1000);
    VIDEO_INTERVAL = setInterval(intervalVideo, VIDEO_MILLI);
}

function destroyVideo()
{
    if( PLAYER_YT != null )
    {
        PLAYER_YT.destroy();
        PLAYER_YT = null;
        PLAYER_YT_DATA = false;
        destroyTime();
        
    }
    var youtube = $("#" + VIDEO_DIV_ID);
    youtube.css({width:0, height:0});
}

function setVideo(videoId, start, end)
{
    // Set the next video from the list
    NEXT_ID = videoId;
    NEXT_START = start;
    NEXT_END = end;
    
    if( NEXT_END == null )
    {
        NEXT_END = 200000;
    }
    
    if( NEXT_START < 0 )
    {
        NEXT_START = 0;
    }
    
    if( NEXT_END < NEXT_START )
    {
        NEXT_END = NEXT_START;
    }
}

// OPTION #1: called by readyVideo(), nextVideo(), onPlayerReady()
function startVideo(sameVideo)
{
    if( PLAYER_API && PLAYER_DATA )
    {
        if( PLAYER_YT == null )
        {
            createVideo();
        }
        else
        {
            if( sameVideo )
            {
                seekVideo();
            }
            else
            {
                changeVideo();
            }
        }
    }
}

// called by API when ready
function readyVideo()
{
    PLAYER_API = true;
    startVideo(false); // option #1
}

// called by my functions before/after setVideo()
function nextVideo()
{
    if( NEXT_ID )
    {
        PLAYER_DATA = true;
        
        var sameVideo = false;
        if( VIDEO_ID == NEXT_ID )
            sameVideo = true;
        VIDEO_ID = NEXT_ID;
        VIDEO_START = NEXT_START;
        VIDEO_END = NEXT_END;
        
        setVideo(null,null,null);
        
        startVideo(sameVideo); // option #1
    }
    else
    {
        PLAYER_DATA = false;
    }
}

function pauseMyVideo(videoId, start, end)
{
    // NOTE: public function
    if( !stopMyVideo() )
    {
        setVideo(videoId,start,end);
        nextVideo(); // option #1
    }
}


function resumeMyVideo()
{
    // NOTE: public function
    if( PLAYER_YT && !VIDEO_INTERVAL )
    {
        PLAYER_YT.playVideo();
        return true;
    }
    return false;
}

function stopMyVideo()
{
    // NOTE: public function
    if( PLAYER_YT && VIDEO_INTERVAL )
    {
        PLAYER_YT.pauseVideo();
        return true;
    }
    return false;
}

function tagVideo(tag,width,height)
{
    // NOTE: public function
    VIDEO_DIV_ID = tag;
    VIDEO_DIV_WIDTH = width;
    VIDEO_DIV_HEIGHT = height;
    
    var youtube = $("#" + VIDEO_DIV_ID);
    youtube.css({width:width, height:height});
}

function sliderVideo(time)
{
    if( PLAYER_YT )
    {
        PLAYER_YT.seekTo(time, true);
        PLAYER_YT.pauseVideo();
    }
}

// --------------- CALLBACKS! ----------------------

function durationVideo()
{
    // UNUSED!
    //durationYouTube(VIDEO_DURATION);
}

function intervalVideo()
{
    intervalYouTube(VIDEO_MILLI);
    VIDEO_CUR += VIDEO_SECS;
}

function endVideo()
{
    endedYouTube();
}

