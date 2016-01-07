"use strict";

var touch = require("./touch");
var mouse = require("./mouse");
var layoutService = require("../service/layoutService");


function UserInput($element, eventListener) {
    var self = this;
    this.$element = $element;
    this.elementBound = {};

    this.updateElementBound();
    layoutService.addObserver("end", function () {
        self.updateElementBound();
    });

    // receives startposition of user interaction
    this.onStart = eventListener.onStart || Function.prototype;
    // receives movement vector from last to current position, where z-value being scale instead of position
    this.onScale = eventListener.onScale || Function.prototype;
    // receives no arguments
    this.onEnd = eventListener.onEnd || Function.prototype;

    touch($element, this.elementBound, this.onStart, this.onScale, this.onEnd);
    mouse($element, this.elementBound, this.onStart, this.onScale, this.onEnd);
}

UserInput.prototype.updateElementBound = function () {
    var bound = this.$element.getBoundingClientRect();
    this.elementBound.top = bound.top + (document.documentElement.scrollTop || document.body.scrollTop);
    this.elementBound.left = bound.left + (document.documentElement.scrollLeft || document.body.scrollLeft);
    this.elementBound.width = bound.width;
    this.elementBound.height = bound.height;
}


module.exports = UserInput;
