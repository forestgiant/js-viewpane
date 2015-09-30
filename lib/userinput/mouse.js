"use strict";


import Timeout from "../common/Timeout";
import vector from "../common/vector";
import windowService from "../service/windowService";

var func = Function.prototype;
const mouseWheelRange = 1000;
const mouseWheelDelay = 50;

export default function mouse($element, onStart = func, onInput = func, onEnd = func) {

    var boundingBox = $element.getBoundingClientRect();
    windowService.addObserver("end", function () {
        boundingBox = $element.getBoundingClientRect();
    });

    var isInAction = false;
    var previousPosition = vector.create();
    var currentPosition = vector.create();
    var inputVector = vector.create();

    $element.addEventListener("mousedown", event => {
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

    $element.addEventListener("mousemove", event => {
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

    $element.addEventListener("mouseup", () => {
        if (isInAction === false) {
            return;
        }

        isInAction = false;
        onEnd();
    });

    var wheelTimeout = new Timeout(() => {
        if (isInAction === false) {
            return;
        }

        isInAction = false;
        onEnd();
    }, mouseWheelDelay);

    // second touchstart...
    $element.addEventListener("mousewheel", event => {
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
    $element.addEventListener("wheel", event => {
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
    document.body.addEventListener("mousemove", () => {
        if (isInAction === false) {
            return;
        }

        isInAction = false;
        onEnd();
    });
}
