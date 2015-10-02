"use strict";

module.exports = {

    $camera: null,
    $viewpane: null,
    viewpaneBound: null,

    setupViewpane: function (page) {
        page = page || "viewpane.html";

        document.body.innerHTML = require("./" + page);

        this.$camera = document.getElementById("camera");
        this.$viewpane = document.getElementById("viewpane");
        this.viewpaneBound = this.$viewpane.getBoundingClientRect();

        return {
            camera: this.$camera,
            viewpane: this.$viewpane
        };
    },

    getProjection: function () {
        var objectBound = this.$viewpane.getBoundingClientRect();

        var screenPosition = {
            y: objectBound.top - this.viewpaneBound.top,
            x: objectBound.left - this.viewpaneBound.left,
            width: objectBound.width,
            height: objectBound.height
        };

        screenPosition.right = screenPosition.x + screenPosition.width;
        screenPosition.bottom = screenPosition.y + screenPosition.height;

        return screenPosition;
    },

    updateHtml: function (camera, position) {
        this.updateCameraPosition(camera);
        this.updateViewpanePosition(position);
    },

    updateCameraPosition: function (position) {
        if (position.z <= 0) {
            throw new Error("camera position must be > 0");
        }

        this.$camera.style.perspective = position.z + "px";
        this.$camera.style.perspectiveOrigin = position.x + "px " + position.y + "px";
    },

    updateViewpanePosition: function (position) {
        this.$viewpane.style.transform = "translate3d(" + position.x + "px, " + position.y + "px," + position.z + "px)";
    }
};
