"use strict";

var touch = require("./touch");
var mouse = require("./mouse");


function UserInput($element, eventListener) {
    this.$element = $element;

    // receives startposition of user interaction
    this.onStart = eventListener.onStart || Function.prototype;
    // receives movement vector from last to current position, where z-value being scale instead of position
    this.onScale = eventListener.onScale || Function.prototype;
    // receives no arguments
    this.onEnd = eventListener.onEnd || Function.prototype;

    touch($element, this.onStart, this.onScale, this.onEnd);
    mouse($element, this.onStart, this.onScale, this.onEnd);
}


module.exports = UserInput;
