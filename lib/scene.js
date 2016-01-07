"use strict";


var Loop = require("./common/loop");
var Camera = require("./scene/Camera");
var layoutService = require("./service/layoutService");
var vector = require("./common/vector");


function Scene($screen, focus, options) {
    var self = this;
    var camera = new Camera($screen, focus, options);

    this.camera = camera;
    this.entities = [];

    layoutService.addObserver("end", function () {
        camera.update();
        self.moveToFocus(camera.position);
        self.calculate();
        self.render();
    });
}

Scene.prototype.activate = function () {
    this.loopState = Loop.CONTINUE;
    Loop.add(this);
};

Scene.prototype.deactivate = function () {
    this.loopState = Loop.EXIT;
};

Scene.prototype.convertZScaleToPosition = function (scale) {
    return this.camera.getZTranslationOfScale(scale);
};

Scene.prototype.addEntity = function (entity) {
    this.entities.push(entity);
};

Scene.prototype.convertToWorldTranslation = function (out, userInput, origin) {
    var position = this.camera.getPosition();
    out.set(position);
    out.zoomAtAndMoveVisual(this.camera.eye, origin, userInput);
    out.subtract(position);
    return out;
};

Scene.prototype.getRubberband = function (out) {
    var restrictedZ = this.camera.getRestrictToFocusZ();
    var restrictedXY = this.camera.getRestrictToFocusXY();
    out.x = restrictedXY.left + restrictedXY.right;
    out.y = restrictedXY.top + restrictedXY.bottom;
    out.z = restrictedZ - this.camera.getPosition().z;
    return out;
};

// sets camera back within boundaries
Scene.prototype.moveToFocus = function (origin) {
    var position = this.camera.getPosition();
    var restrictedZ = this.camera.getRestrictToFocusZ();
    this.camera.zoomAt(origin, restrictedZ - position.z);
    var restrictedXY = this.camera.getRestrictToFocusXY();
    position.setValues(
        position.x + restrictedXY.right + restrictedXY.left,
        position.y + restrictedXY.top + restrictedXY.bottom,
        position.z
    );
};

Scene.prototype.setPosition = function (position) {
    this.camera.setPosition(position);
};

Scene.prototype.getPosition = function (position) {
    return this.camera.getPosition();
};

Scene.prototype.move = function (movement) {
    return this.camera.getPosition().add(movement);
};

// move and apply rubberband based on inputvector
Scene.prototype.moveVisual = function (moveVector, origin, rubberForce) {
    rubberForce = rubberForce || 0.3;
    var worldTranslation = vector.create();
    this.convertToWorldTranslation(worldTranslation, moveVector, origin);

    var position = this.camera.getPosition();
    var majorZ = Math.abs(moveVector.z) > (Math.abs(moveVector.x) + Math.abs(moveVector.y));

    // rubberZ
    // not really necessary (tiny image is feedback enough)
    var zoomOut = worldTranslation.z < 0;
    var zoomIn = worldTranslation.z > 0;
    var restrictedZ = this.camera.getRestrictToFocusZ(worldTranslation);
    var deltaZ = restrictedZ - this.camera.getPosition().z - worldTranslation.z;
    // !z might need hard limits
    if (deltaZ < 0 && zoomIn || deltaZ > 0 && zoomOut) {
        // zoom back
        position.zoomAt(this.camera.eye, origin, - worldTranslation.z * (1 - rubberForce));
    }

    // adjust movement by rubber, if any and not currently zooming
    if (majorZ === false) {
        var restrictedXY = this.camera.getRestrictToFocusXY();
        if ((restrictedXY.left + restrictedXY.right) !== 0) {
            worldTranslation.x *= rubberForce;
        }
        if ((restrictedXY.top + restrictedXY.bottom) !== 0) {
            worldTranslation.y *= rubberForce;
        }
    }

    position.add(worldTranslation);
    worldTranslation.dispose();
};

Scene.prototype.calculate = function () {
    var entities = this.entities;
    var position = this.camera.getPosition();
    for (var i = 0, l = entities.length; i < l; i += 1) {
        entities[i].calculate(position);
    }
    return Loop.CONTINUE;
};

Scene.prototype.render = function () {
    var entities = this.entities;
    var position = this.camera.getPosition();
    for (var i = 0, l = entities.length; i < l; i += 1) {
        entities[i].render(position);
    }
    return this.loopState;
};


module.exports = Scene;

