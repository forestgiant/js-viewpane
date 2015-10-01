"use strict";


var vector = require("../common/vector");
var Loop = require("../common/loop");


// center point between first and second touch point
function getCenterPosition(vector, firstTouch, secondTouch) {
    vector.x = 0.5 * (secondTouch.pageX - firstTouch.pageX) + firstTouch.pageX;
    vector.y = 0.5 * (secondTouch.pageY - firstTouch.pageY) + firstTouch.pageY;
    vector.z = 0;
    return vector;
}

function getLengthOfLine(firstTouch, secondTouch) {
    var x = -firstTouch.pageX + secondTouch.pageX;
    var y = -firstTouch.pageY + secondTouch.pageY;
    return Math.sqrt(x*x + y*y);
}


function touch($element, onStart, onInput, onEnd) {
    var currentTouches = 0;
    var currentPosition = vector.create();
    var previousPosition = vector.create();
    var inputVector = vector.create();

    var currentLength = 0;
    var previousLength = 0;


    var Processor = {

        currentEvent: null,

        start: function () {
            this.loopState = Loop.CONTINUE;
            Loop.add(this);
        },

        stop: function () {
            this.loopState = Loop.EXIT;
        },

        calculate: function () {
            var event = this.currentEvent;
            if (event == null) {
                return;
            }

            previousLength = currentLength;
            previousPosition.set(currentPosition);

            if (event.touches.length > 1) {
                currentLength = getLengthOfLine(event.touches[0], event.touches[1]);
                currentPosition = getCenterPosition(currentPosition, event.touches[0], event.touches[1]);

                inputVector.setDelta(currentPosition, previousPosition);
                // z = scale factor
                inputVector.z = previousLength === 0 ? 1 : currentLength / previousLength;

            } else {
                currentPosition.setValues(event.touches[0].pageX, event.touches[0].pageY, 0);
                inputVector.setDelta(currentPosition, previousPosition);
                inputVector.z = 1;
            }

            this.currentEvent = null;
            onInput(inputVector, currentPosition);
            return this.loopState;
        },

        render: Function.prototype
    };


    function startSingleTouch(touchItem) {
        currentLength = 0;
        previousLength = 0;
        currentPosition.setValues(touchItem.pageX, touchItem.pageY, 0);
        previousPosition.set(currentPosition);
    }

    function startDoubleTouch(firstTouch, secondTouch) {
        currentLength = getLengthOfLine(firstTouch, secondTouch);
        currentPosition = getCenterPosition(currentPosition, firstTouch, secondTouch);
        previousPosition.set(currentPosition);
    }

    function startTouch(event) {
        event.preventDefault();
        considerStart = false;
        currentTouches = event.touches.length;

        if (event.touches.length === 1) {
            startSingleTouch(event.touches[0]);

        } else {
            startDoubleTouch(event.touches[0], event.touches[1]);
        }

        Processor.start();
        onStart(currentPosition);
    }

    var startEventTime;
    var considerStart = true;
    function considerInputStart(event) {
        considerStart = true;
        startEventTime = Date.now();
    }

    // touchstart
    $element.addEventListener("touchstart", function (event) {
        if (event.touches.length > 2) {
            return;
        }

        if (event.touches.length === 1 && currentTouches === 0) {
            considerInputStart(event);

        } else {
            startTouch(event);
        }
    });

    // touchmove
    $element.addEventListener("touchmove", function (event) {
        if (currentTouches === 0 && considerStart === false) {
            return;

        } else if (considerStart === true /*&& Date.now() - startEventTime > 200*/) {
            startTouch(event);
        }

        event.preventDefault();
        event.stopPropagation();
        Processor.currentEvent = event;
    });

    // touchend
    $element.addEventListener("touchend", function (event) {

        if (considerStart === true) {
            console.log("click", Date.now() - startEventTime);
        }

        if (currentTouches === 0 || event.touches.length > 1) {
            return;

        } else if (event.touches.length === 1) {
            // reset
            startSingleTouch(event.touches[0]);
            onStart(currentPosition);
            return;
        }

        currentTouches = 0;
        Processor.stop();
        onEnd();
    });

    // left container
    document.body.addEventListener("touchmove", function (event) {
        if (currentTouches === 0 || event.touches.length > 0) {
            return;
        }

        currentTouches = 0;
        onEnd();
    });
}


module.exports = touch;

