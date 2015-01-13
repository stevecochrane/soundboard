var $ = require("jquery");

$(function() {

    var audioPriceIsRight = window.document.createElement("audio");
    audioPriceIsRight.setAttribute("src", "audio/price-is-right.mp3");

    $("#button-price-is-right").click(function() {
        audioPriceIsRight.currentTime = 0;
        audioPriceIsRight.play();
    });

});