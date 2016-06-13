"use strict";

var Userinput = require("./userinput/index");
var Scene = require("./scene");
var ViewpaneElement = require("./scene/Entity");
var vector = require("./common/vector");
var SpeedSnapAnimation = require("./scene/SpeedSnapAnimation");
var withObservable = require("./common/withObservable");


Viewpane.EVENT_CLICK = "onClick";
Viewpane.EVENT_UPDATE = "onUpdate";
Viewpane.EVENT_RENDER = "onRender";
Viewpane.EVENT_START = "onInputStart";
Viewpane.EVENT_STOP = "onInputStop";
Viewpane.EVENT_END = "onEnd";


function el(elementId) {
    if (elementId && Object.prototype.toString.call(elementId) === "[object String]") {
        return document.getElementById(elementId);
    } else if (elementId && elementId.tagName) {
        return elementId;
    }

    console.log("invalid element id given", elementId);
    return null;
}

/**
 * ViewpaneJS controller
 *
 * @param {HTMLElement} screenEl
 * @param {HTMLElement} viewpaneEl
 * @param {Object} options
 */
function Viewpane(screenEl, viewpaneEl, options) {
    withObservable.call(this, [
        Viewpane.EVENT_CLICK, Viewpane.EVENT_UPDATE, Viewpane.EVENT_RENDER,
        Viewpane.EVENT_START, Viewpane.EVENT_STOP, Viewpane.EVENT_END
    ]);

    screenEl = el(screenEl);
    viewpaneEl = el(viewpaneEl);

    var self = this;
    var viewpane = new ViewpaneElement(viewpaneEl);

    var viewpaneBound = viewpaneEl.getBoundingClientRect();
    var focus = options.focus || vector.create(viewpaneBound.width, viewpaneBound.height, 0);
    this.scene = new Scene(screenEl, focus, options);
    this.scene.addObserver(Scene.EVENT_UPDATE, function (position) {
        self.notify(Viewpane.EVENT_UPDATE, position);
    });
    this.scene.addObserver(Scene.EVENT_RENDER, function (position) {
        self.notify(Viewpane.EVENT_RENDER, position);
    });

    this.viewpane = viewpane;
    this.scene.addEntity(viewpane);
    this.speedSnap = new SpeedSnapAnimation(this.scene, options);

    this.speedSnap.addObserver(SpeedSnapAnimation.EVENT_STOP, function () {
        self.notify(Viewpane.EVENT_END);
    });

    var startTime;
    var measured = 0;
    var measureFrom = vector.create();
    var measureTo = vector.create();

    // listen to user input on element $viewport
    var inputOrigin = vector.create();
    this.userinput = new Userinput(screenEl, {

        // Remember: triggered again for each change in touch pointer count
        onStart: function (inputStartPosition) {
            inputOrigin.set(inputStartPosition);
            inputOrigin.z = self.scene.camera.getPosition().z;
            self.userInputStart();

            measured = 0;
            measureTo.set(inputOrigin);
            startTime = Date.now();
        },

        // Remember: scaleVector.z-value := scale factor; x, y := relativeMovement
        onScale: function (scaleVector, currentPosition) {
            inputOrigin.set(currentPosition);
            inputOrigin.z = self.scene.camera.getPosition().z;
            scaleVector.z = self.scene.convertZScaleToPosition(scaleVector.z);

            self.moveBy(scaleVector, inputOrigin);

            measured += 1;
            measureFrom.set(measureTo);
            measureTo.set(inputOrigin);
        },

        onEnd: function (event) {
            if (measured > 1) {
                measureFrom.subtract(measureTo);
                measureFrom.z = 0;
                if (measureFrom.getLength() > 5) {
                    return self.userInputStop(inputOrigin, measureFrom);
                }

            } else {
                // clicked.
                // Convert click point, to point on viewpane
                var viewpanePosition = self.scene.getPosition();
                // clickTarget in screen space
                var clickTarget = inputOrigin.clone();
                clickTarget.z = 0;
                // convert to screen position to position in viewpane z distance
                clickTarget.invertProject(self.scene.camera.eye, inputOrigin.z);
                // adjust target by viewpane translation
                clickTarget.subtract(viewpanePosition);
                clickTarget.z= 0;

                self.notify(Viewpane.EVENT_CLICK, event, clickTarget);
            }

            self.userInputStop(inputOrigin, vector.origin);
        }
    });

    this.fit();
}

Viewpane.prototype.deactivate = function () {
    this.userinput.deactivate();
}

Viewpane.prototype.activate = function () {
    this.userinput.activate();
}

Viewpane.prototype.isActive = function () {
    this.userinput.isActive();
}

Viewpane.prototype.userInputStart = function () {
    this.speedSnap.stop();
    this.scene.activate();
    this.notify(Viewpane.EVENT_START);
};

Viewpane.prototype.userInputStop = function (origin, speedVector) {
    this.scene.deactivate();
    this.speedSnap.from.set(this.scene.getPosition());
    this.speedSnap.start(speedVector, origin);
    this.notify(Viewpane.EVENT_STOP);
};

Viewpane.prototype.setFocus = function (width, height) {
    this.scene.setFocus(width, height);
};

Viewpane.prototype.repaint = function () {
    this.scene.calculate();
    this.scene.render();
};

Viewpane.prototype.moveBy = function (moveVector, origin) {
    this.scene.moveVisual(moveVector, origin);
};

Viewpane.prototype.addEntity = function (entity) {
    this.scene.addEntity(entity);
};

Viewpane.prototype.fit = function () {
    this.scene.fitToViewport();
};

Viewpane.prototype.createEntity = function (elementId) {
    var entity = new ViewpaneElement(el(elementId));
    this.addEntity(entity);
    return entity;
};

Viewpane.prototype.setPosition = function (position) {
    this.scene.setPosition(position);
};

Viewpane.prototype.getPosition = function (position) {
    // evaluate apis corrdinate system
    // return this.scene.getPosition().clone().project(this.scene.camera.eye);
    return this.scene.getPosition();
};

Viewpane.prototype.getScene = function (position) {
    return this.scene;
};

Viewpane.prototype.getViewpane = function (position) {
    return this.viewpane;
};


module.exports = Viewpane;
