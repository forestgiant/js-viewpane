"use strict";

import vector from "../common/vector";
import Loop from "../common/loop";


const FRICTION = 0.95;
const FPS = 1000/50;


export default function SpeedSnapAnimation(scene, options) {
    this.scene = scene;
    this.friction = options.friction || FRICTION;

    this.from = vector.create();
    this.work = vector.create();
    this.speedVector = vector.create();
    this.rubberband = vector.create();
}

SpeedSnapAnimation.prototype.start = function (speedVector, origin, cb) {
    this.cb = cb || Function.prototype;
    this.scene.convertToWorldTranslation(this.speedVector, speedVector, origin);

    var startSpeed = this.speedVector.getLength();
    var speedDuration = FPS * (- Math.log(startSpeed) / Math.log(FRICTION));
    this.startTime = Date.now();
    this.duration = Math.max(400, speedDuration);

    this.loopState = Loop.CONTINUE;
    Loop.add(this);
};

SpeedSnapAnimation.prototype.stop = function (time) {
    this.loopState = Loop.EXIT;
};

SpeedSnapAnimation.prototype.calculate = function (now) {
    var speedMovement = this.speedVector;
    var timeProgress = Math.min(1, (now - this.startTime) / this.duration);
    // !animate rubberband on time
    var rubberband = this.scene.getRubberband(this.rubberband);
    rubberband.multiplyScalar(timeProgress);
    // !animate speed by friction
    speedMovement.multiplyScalar(FRICTION);
    // ! ensure speed does not pull too much on rubberband
    // since rubberband only increases over time
    // if (rubberband.x) {speedMovement.x *= 0.25;}
    if (rubberband.x) {speedMovement.x *= timeProgress;}
    if (rubberband.y) {speedMovement.y *= timeProgress;}

    if (timeProgress >= 1) {
        this.scene.move(rubberband);
        this.stop();

    } else {
        this.work.set(rubberband).subtract(speedMovement);
        this.scene.move(this.work);
    }

    this.scene.calculate();
    return Loop.CONTINUE;
};

SpeedSnapAnimation.prototype.render = function () {
    this.scene.render();

    if (this.loopState === Loop.EXIT) {
        this.cb();
    }

    return this.loopState;
};
