"use strict";

var html = require("./support/html");
var perspective = require("./perspective");


var Tolerance = 0.0001;

describe("perspective", function () {

    var $camera;
    var $viewpane;
    var camera;
    var position;

    function setPosition(x, y, z) {
        position.x = x;
        position.y = y;
        position.z = z;
        html.updateViewpanePosition(position);
    }

    function setCameraPosition(x, y, z) {
        camera.x = x;
        camera.y = y;
        camera.z = z;
        html.updateCameraPosition(camera);
    }

    beforeEach(function () {
        var elements = html.setupViewpane();
        $camera = elements.camera;
        $viewpane = elements.viewpane;

        position = {};
        camera = {};
    });

    describe("getProjection", function () {

        it("should correctly project z translation", function () {
            setPosition(0, 0, -500);
            setCameraPosition(0, 0, 1000);

            var point2D = perspective.getProjection(position, camera);

            var measure2D = html.getProjection();
            expect(point2D.x).to.eq(measure2D.x);
            expect(point2D.y).to.eq(measure2D.y);
        });

        it("should correctly project positive z translation", function () {
            setPosition(0, 0, 750);
            setCameraPosition(0, 0, 1000);

            var point2D = perspective.getProjection(position, camera);

            var measure2D = html.getProjection();
            expect(point2D.x).to.eq(measure2D.x);
            expect(point2D.y).to.eq(measure2D.y);
        });

        it("should correctly project camera position", function () {
            setCameraPosition(300, 300, 1000);
            setPosition(0, 0, -500);

            var point2D = perspective.getProjection(position, camera);

            var measure2D = html.getProjection();
            expect(point2D.x).to.eq(measure2D.x);
            expect(point2D.y).to.eq(measure2D.y);
        });

        it("should return correct projection for different position", function () {
            setCameraPosition(300, 300, 1000);
            setPosition(100, 150, -500);

            var point2D = perspective.getProjection(position, camera);

            var measure2D = html.getProjection();
            expect(point2D.x).to.be.closeTo(measure2D.x, Tolerance);
            expect(point2D.y).to.be.closeTo(measure2D.y, Tolerance);
        });

        it("should return correct projection if position is on origin", function () {
            setCameraPosition(300, 300, 1000);
            setPosition(300, 300, -1000);

            var point2D = perspective.getProjection(position, camera);

            var measure2D = html.getProjection();
            expect(point2D.x).to.eq(measure2D.x);
            expect(point2D.y).to.eq(measure2D.y);
        });

        it("should also work if camera has a page offset", function () {
            var elements = html.setupViewpane("viewpanewindow.html");
            $camera = elements.camera;
            $viewpane = elements.viewpane;
            setCameraPosition(300, 300, 1000);
            setPosition(100, 150, -500);

            var point2D = perspective.getProjection(position, camera);

            var measure2D = html.getProjection();
            expect(point2D.x).to.be.closeTo(measure2D.x, Tolerance);
            expect(point2D.y).to.be.closeTo(measure2D.y, Tolerance);
        });
    });


    describe("getInverseProjection", function () {

        it("should point in 3d space", function () {
            setCameraPosition(111, 222, 1000);

            var point3D = perspective.getInverseProjection(position, camera, -500);

            expect(point3D.x).to.not.eq(0);
            expect(point3D.y).to.not.eq(0);
            expect(point3D.z).to.eq(-500);
        });

        it("should invert projection", function () {
            setCameraPosition(111, 222, 1000);
            setPosition(333, -111, 500);
            var point2D = perspective.getProjection(position, camera);

            var point3D = perspective.getInverseProjection({x: point2D.x, y: point2D.y}, camera, 500);

            expect(point3D.x).to.eq(333);
            expect(point3D.y).to.eq(-111);
            expect(point3D.z).to.eq(500);
        });
    });


    describe("moveVisual", function () {

        it("should map visual movement to 3d space", function () {
            setCameraPosition(111, 222, 1000);
            setPosition(333, -111, 500);
            var startPosition2D = html.getProjection();
            var movement = {x: 130, y: -90};

            var point3D = perspective.moveVisual(position, camera, movement);
            setPosition(point3D.x, point3D.y, point3D.z);

            var position2D = html.getProjection();
            expect(position2D.x - startPosition2D.x).to.eq(130);
            expect(position2D.y - startPosition2D.y).to.eq(-90);
        });

        it("should simply move on projectionplane", function () {
            setCameraPosition(111, 222, 1000);
            setPosition(333, -111, 0);

            var point3D = perspective.moveVisual(position, camera, {x: 130, y: -90});

            expect(point3D.x).to.eq(333 + 130);
            expect(point3D.y).to.eq(-111 - 90);
        });

        it("should also work if camera has a page offset", function () {
            var elements = html.setupViewpane("viewpanewindow.html");
            $camera = elements.camera;
            $viewpane = elements.viewpane;
            setCameraPosition(111, 222, 1000);
            setPosition(333, -111, 0);

            var point3D = perspective.moveVisual(position, camera, {x: 130, y: -90});

            expect(point3D.x).to.eq(333 + 130);
            expect(point3D.y).to.eq(-111 - 90);
        });
    });


    describe("zoomAt", function () {

        it("should zoom to top left of position", function () {
            setCameraPosition(0, 0, 500);
            setPosition(0, 0, -500);

            var point3D = perspective.zoomAt(position, camera, {x: 0, y: 0}, -300);
            setPosition(point3D.x, point3D.y, point3D.z);

            var measure2D = html.getProjection();
            expect(measure2D.x).to.eq(0);
            expect(measure2D.y).to.eq(0);
        });

        it("should zoom to top left of viewport", function () {
            setCameraPosition(500, 500, 500);
            setPosition(0, 0, 0);
            var startMeasure2D = html.getProjection();

            var point3D = perspective.zoomAt(position, camera, {x: 0, y: 0}, -300);
            setPosition(point3D.x, point3D.y, point3D.z);

            var measure2D = html.getProjection();
            expect(measure2D.x).to.eq(0);
            expect(measure2D.y).to.eq(0);
            expect(measure2D.right).to.be.below(startMeasure2D.right);
            expect(measure2D.bottom).to.be.below(startMeasure2D.bottom);
        });

        it("should zoom to bottom right position", function () {
            setCameraPosition(300, 200, 1000);
            setPosition(-250, 100, -200);
            var startMeasure2D = html.getProjection();

            var point3D = perspective.zoomAt(position, camera, {x: startMeasure2D.right, y: startMeasure2D.bottom}, -300);
            setPosition(point3D.x, point3D.y, point3D.z);

            var measure2D = html.getProjection();
            expect(startMeasure2D.right).to.be.closeTo(measure2D.right, Tolerance);
            expect(startMeasure2D.bottom).to.be.closeTo(measure2D.bottom, Tolerance);
        });

        it("should also work if camera has a page offset", function () {
            var elements = html.setupViewpane("viewpanewindow.html");
            $camera = elements.camera;
            $viewpane = elements.viewpane;
            setCameraPosition(300, 200, 1000);
            setPosition(-250, 100, -200);
            var startMeasure2D = html.getProjection();

            var point3D = perspective.zoomAt(position, camera, {x: startMeasure2D.right, y: startMeasure2D.bottom}, -300);
            setPosition(point3D.x, point3D.y, point3D.z);

            var measure2D = html.getProjection();
            expect(startMeasure2D.right).to.be.closeTo(measure2D.right, Tolerance);
            expect(startMeasure2D.bottom).to.be.closeTo(measure2D.bottom, Tolerance);
        });
    });

    // describe("restrictTo", function () {});
});
