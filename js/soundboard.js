/*
    A large portion of the following comes from this tutorial:
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
                    alert("error decoding file data: " + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length) {
                    loader.onload(loader.bufferList);
                }
            },
            function(error) {
                console.error("decodeAudioData error", error);
            }
        );
    };

    request.onerror = function() {
        alert("BufferLoader: XHR error");
    };

    request.send();
};

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i) {
        this.loadBuffer(this.urlList[i], i);
    }
};

// Page-wide audio context.
var context = null;

// Loads all sound samples into the buffers object.
function loadBuffers() {
    var paths = [];

    sounds.forEach(function(sound) {
        var path = sound.file;
        paths.push(path);
    });

    bufferLoader = new BufferLoader(context, paths, function(bufferList) {
        bufferList.forEach(function(buffer, index) {
            sounds[index].buffer = buffer;
        });
    });

    bufferLoader.load();

    sounds.forEach(function(sound) {
        var soundButton = document.createElement("button");
        var soundButtonText = document.createTextNode(sound.label);
        var container = document.getElementById("sounds");

        soundButton.onclick = function() {
            var source = context.createBufferSource();
            source.buffer = sound.buffer;
            source.connect(context.destination);
            source.start(0);
        };

        soundButton.appendChild(soundButtonText);
        container.appendChild(soundButton);
    });
}

document.addEventListener("DOMContentLoaded", function() {
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
