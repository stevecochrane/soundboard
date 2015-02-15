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

// An object to track the buffers to load {name: path}
var BUFFERS_TO_LOAD = {
    hearthstone: "audio/hearthstone.mp3",
    jobsDone: "audio/jobs-done.mp3",
    priceIsRight: "audio/price-is-right.mp3"
};

// Loads all sound samples into the buffers object.
function loadBuffers() {
    // Array-ify
    var names = [];
    var paths = [];
    for (var name in BUFFERS_TO_LOAD) {
        var path = BUFFERS_TO_LOAD[name];
        names.push(name);
        paths.push(path);
    }
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