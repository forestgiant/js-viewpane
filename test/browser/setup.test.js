"use strict";


var html = require("./support/html");


describe("karma", function () {

    it("should have window.body defined", function () {
        expect(document.body).not.to.be.undefined;
    });

    it("should return camera and viewpane", function () {
        var elements = html.setupViewpane();
        var camera = elements.camera;
        var viewpane = elements.viewpane;

        expect(Object.prototype.toString.call(camera)).to.contain("HTMLDivElement");
        expect(Object.prototype.toString.call(viewpane)).to.contain("HTMLDivElement");
    });

    it("should correctly setup html", function () {
        html.setupViewpane();

        var camera = document.getElementById("camera");
        expect(camera.getBoundingClientRect()).to.deep.eq({
            top: 0,
            left: 0,
            right: 800,
            bottom: 600,
            width: 800,
            height: 600
        });
    });
});

describe("browser", function () {

    it("should apply perspective", function () {
        var camera = html.setupViewpane().camera;
        camera.style.perspective = "500px";
        camera = document.getElementById("camera");

        expect(camera.style.perspective).to.eq("500px");
    });

    it("should support css3d", function () {
        var elements = html.setupViewpane();
        elements.camera.style.perspective = "500px";
        elements.viewpane.style.transform = "translate3d(0, 0, -500px)";

        var bound = elements.viewpane.getBoundingClientRect();

        expect(bound.width).to.be.eq(512);
    });
});
