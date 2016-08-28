/*
    I lifted all of this from here and then changed it slightly:
    http://www.html5rocks.com/en/tutorials/webaudio/intro/
*/

function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length) {
                    loader.onload(loader.bufferList);
                }
            },
            function(error) {
                console.error('decodeAudioData error', error);
            }
        );
    };

    request.onerror = function() {
        alert('BufferLoader: XHR error');
    };

    request.send();
};

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i) {
        this.loadBuffer(this.urlList[i], i);
    }
};


var CircusSample = {
};

CircusSample.play = function() {
    var source = context.createBufferSource();
    source.buffer = BUFFERS.circus;
    source.connect(context.destination);
    source.start(0);
};

var HearthstoneSample = {
};

HearthstoneSample.play = function() {
    var source = context.createBufferSource();
    source.buffer = BUFFERS.hearthstone;
    source.connect(context.destination);
    source.start(0);
};

var JobsDoneSample = {
};

JobsDoneSample.play = function() {
    var source = context.createBufferSource();
    source.buffer = BUFFERS.jobsDone;
    source.connect(context.destination);
    source.start(0);
};

var PriceIsRightSample = {
};

PriceIsRightSample.play = function() {
    var source = context.createBufferSource();
    source.buffer = BUFFERS.priceIsRight;
    source.connect(context.destination);
    source.start(0);
};


// Keep track of all loaded buffers.
var BUFFERS = {};
// Page-wide audio context.
var context = null;

// Loads all sound samples into the buffers object.
function loadBuffers() {
    // Array-ify
    var names = [];
    var paths = [];
    sounds.forEach(function(sound) {
        var path = "audio/" + sound.file;
        names.push(sound.id);
        paths.push(path);
    });
    bufferLoader = new BufferLoader(context, paths, function(bufferList) {
        for (var i = 0; i < bufferList.length; i++) {
            var buffer = bufferList[i];
            var name = names[i];
            BUFFERS[name] = buffer;
        }
    });
    bufferLoader.load();
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Fix up prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
    }
    catch(e) {
        alert("Web Audio API is not supported in this browser");
    }
    loadBuffers();
});
