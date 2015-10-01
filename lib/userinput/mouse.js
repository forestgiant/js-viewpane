"use strict";


var Timeout = require("../common/Timeout");
var vector = require("../common/vector");
var windowService = require("../service/windowService");

var mouseWheelRange = 1000;
var mouseWheelDelay = 50;

function mouse($element, onStart, onInput, onEnd) {

    var boundingBox = $element.getBoundingClientRect();
    windowService.addObserver("end", function () {
        boundingBox = $element.getBoundingClientRect();
    });

    var isInAction = false;
    var previousPosition = vector.create();
    var currentPosition = vector.create();
    var inputVector = vector.create();

    $element.addEventListener("mousedown", function (event) {
        if (isInAction === true) {
            return;
        }

        var x = event.pageX - boundingBox.left;
        var y = event.pageY - boundingBox.top;

        isInAction = true;
        event.preventDefault();

        currentPosition.setValues(x, y, currentPosition.z);
        onStart(currentPosition);
    });

    $element.addEventListener("mousemove", function (event) {
        if (isInAction === false) {
            return;
        }

        var x = event.pageX - boundingBox.left;
        var y = event.pageY - boundingBox.top;

        event.preventDefault();
        event.stopPropagation(); // stop event to bubble to document.body, which aborts dragging

        previousPosition.set(currentPosition);
        currentPosition.setValues(x, y, currentPosition.z);
        inputVector.setDelta(currentPosition, previousPosition);
        // convert position to scale
        inputVector.z = 1;

        onInput(inputVector, currentPosition);
    });

    $element.addEventListener("mouseup", function () {
        if (isInAction === false) {
            return;
        }

        isInAction = false;
        onEnd();
    });

    var wheelTimeout = new Timeout(function () {
        if (isInAction === false) {
            return;
        }

        isInAction = false;
        onEnd();
    }, mouseWheelDelay);

    // second touchstart...
    $element.addEventListener("mousewheel", function (event) {
        event.preventDefault();

        var x = event.pageX - boundingBox.left;
        var y = event.pageY - boundingBox.top;
        var z = event.wheelDelta;

        if (isInAction === false) {
            isInAction = true;

            wheelTimeout.start();
            currentPosition.set(x, y, z);
            onStart(currentPosition);

        } else {

            wheelTimeout.keepAlive();
            previousPosition.set(currentPosition);
            currentPosition.set(x, y, currentPosition.z + z);
            inputVector.setDelta(currentPosition, previousPosition);
            // convert position to scale
            inputVector.z = 1 + inputVector.z / mouseWheelRange;
            onInput(inputVector, currentPosition);
        }
    });

    // second touchstart...
    $element.addEventListener("wheel", function (event) {
        event.preventDefault();

        var x = event.pageX - boundingBox.left;
        var y = event.pageY - boundingBox.top;
        var z = event.deltaY;

        if (isInAction === false) {
            isInAction = true;

            wheelTimeout.start();
            currentPosition.setValues(x, y, z);
            onStart(currentPosition);

        } else {

            wheelTimeout.keepAlive();
            previousPosition.set(currentPosition);
            currentPosition.setValues(x, y, currentPosition.z + z);
            inputVector.setDelta(currentPosition, previousPosition);
            // convert position to scale
            inputVector.z = 1 + inputVector.z / mouseWheelRange;

            onInput(inputVector, currentPosition);
        }
    });

    // mouse left container
    document.body.addEventListener("mousemove", function () {
        if (isInAction === false) {
            return;
        }

        isInAction = false;
        onEnd();
    });
}


module.exports = mouse;

