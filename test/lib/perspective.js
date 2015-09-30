"use strict";


import vector from "../../lib/common/vector";


export default {

    moveVisual: function (position, camera, movement) {
        var point3D = vector.create();
        var rz = position.z / camera.z;
        // This calculation derived from
        // 1. project position to 2d plane (point2D)
        // 2. move point2D on 2d plane
        // 3. invert projection of point2D
        point3D.x = position.x + movement.x * (1 - rz);
        point3D.y = position.y + movement.y * (1 - rz);
        point3D.z = position.z;

        return point3D;
    },

    /**
     * Returns resulting position for a point moved visually at `point2D` vector. The point2D vector is given in
     * viewport coordinates and internally converted to coordinates relative to camera origin.
     *
     *  f  := final position
     *  p  := current position
     *  z' := relative z-tranlation of current position
     *  c  := camera position
     *
     *
     *   f  ^
     *    . | z'
     *     p|__
     *     .  |
     *      . |
     *       .|
     *        c
     *
     *
     * @param  {Vec4} point2D        - vector specified absolute from viewport dimensions
     * @param  {Number} zTranslation - zTranslation to move vector
     * @return {Vec4} resulting position of object placed in `position` and visually moved in z-direction from point2D
     */
    zoomAt: function (position, camera, point2D, zTranslation) {
        var rz = zTranslation / camera.z;
        // move given point in direction of camera view
        var finalPosition = vector.create();
        finalPosition.x = position.x + (camera.x - point2D.x) * rz;
        finalPosition.y = position.y + (camera.y - point2D.y) * rz;
        finalPosition.z = position.z + zTranslation;

        return finalPosition;
    },

    getProjection: function (position, camera) {
        var screenPosition = vector.create();
        screenPosition.setDelta(position, camera);

        // https://en.wikipedia.org/wiki/3D_projection
        // where eyeposition = -camera
        screenPosition.x = camera.x - screenPosition.x * (camera.z / screenPosition.z);
        screenPosition.y = camera.y - screenPosition.y * (camera.z / screenPosition.z);
        screenPosition.z = 0;

        return screenPosition;
    },

    getInverseProjection: function (point2D, camera, zPosition) {
        var point3D = vector.create(point2D.x, point2D.y, 0);
        return this.zoomAt(point3D, camera, point2D, zPosition);
    },
};
