"use strict";


var expect = require("chai").expect;
var Vector = require("../../../lib/common/vector");
var geo = require("../../browser/perspective");


describe("vector", function () {

    describe("creation", function () {

        it("should create a 3d vector", function () {
            var vector = Vector.create();

            expect(vector.x).to.eq(0);
            expect(vector.y).to.eq(0);
            expect(vector.z).to.eq(0);
        });

        it("should reuse objects", function () {
            var vector = Vector.create();
            vector.flagged = true;

            Vector.dispose(vector);
            vector = Vector.create();

            expect(vector.flagged).to.be.true;
        });

        it("should reset reused vectors", function () {
            var vector = Vector.create();
            vector.setValues(1, 2, 3);

            Vector.dispose(vector);
            vector = Vector.create();

            expect(vector.x).to.eq(0);
            expect(vector.y).to.eq(0);
            expect(vector.z).to.eq(0);
        });

        it("should set reused vector to given values", function () {
            var vector = Vector.create();
            vector.setValues(1, 2, 3);

            Vector.dispose(vector);
            vector = Vector.create(2, 3, 4);

            expect(vector.x).to.eq(2);
            expect(vector.y).to.eq(3);
            expect(vector.z).to.eq(4);
        });

        it("should clone vector", function () {
            var vector = Vector.create(1, 2, 3);

            var clone = vector.clone();

            expect(clone.x).to.eq(1);
            expect(clone.y).to.eq(2);
            expect(clone.z).to.eq(3);
        });
    });

    describe("math", function () {

        it("should set values by vector", function () {
            var vector = Vector.create(1, 2, 3);

            var copy = Vector.create().set(vector);

            expect(copy.x).to.eq(1);
            expect(copy.y).to.eq(2);
            expect(copy.z).to.eq(3);
        });

        it("should add vector", function () {
            var first = Vector.create(1, 2, 3);

            var vector = Vector.create(3, 3, 3).add(first);

            expect(vector.x).to.eq(4);
            expect(vector.y).to.eq(5);
            expect(vector.z).to.eq(6);
        });

        it("should subtract vector", function () {
            var first = Vector.create(1, 2, 3);

            var vector = Vector.create(3, 3, 3).subtract(first);

            expect(vector.x).to.eq(2);
            expect(vector.y).to.eq(1);
            expect(vector.z).to.eq(0);
        });

        it("should negate vector", function () {
            var vector = Vector.create(1, 2, 3).negate();

            expect(vector.x).to.eq(-1);
            expect(vector.y).to.eq(-2);
            expect(vector.z).to.eq(-3);
        });

        it("should multiply vector", function () {
            var first = Vector.create(1, 2, 3);

            var vector = Vector.create(1, 2, 3).multiply(first);

            expect(vector.x).to.eq(1);
            expect(vector.y).to.eq(4);
            expect(vector.z).to.eq(9);
        });

        it("should add value", function () {
            var vector = Vector.create(1, 2, 3).addScalar(-3);

            expect(vector.x).to.eq(-2);
            expect(vector.y).to.eq(-1);
            expect(vector.z).to.eq(0);
        });

        it("should multiply value", function () {
            var vector = Vector.create(1, 2, 3).multiplyScalar(-3);

            expect(vector.x).to.eq(-3);
            expect(vector.y).to.eq(-6);
            expect(vector.z).to.eq(-9);
        });


        describe("geometry", function () {

            it("should return length of vector", function () {
                var length = Vector.create(1, 2, 3).getLength();

                expect(length).to.be.eq(Math.sqrt(14));
            });

            it("should normalize Vector", function () {
                var vector = Vector.create(1, 2, 3);
                var length = vector.getLength();

                vector.normalize();

                expect(vector.x).to.eq(1/length);
                expect(vector.y).to.eq(2/length);
                expect(vector.z).to.eq(3/length);
            });

            it("should correctly zoomAt position", function () {
                var camera = Vector.create(200, 300, 1000);
                var position = Vector.create(-100, 200, -500);
                var lookAt = Vector.create(0, 200);

                var shouldBe = geo.zoomAt(position, camera, lookAt, 300);
                position.zoomAt(camera, lookAt, 300);

                expect(position.x).to.eq(shouldBe.x);
                expect(position.y).to.eq(shouldBe.y);
                expect(position.z).to.eq(shouldBe.z);
            });

            it("should correctly project to camera", function () {
                var camera = Vector.create(200, 300, 1000);
                var position = Vector.create(-100, 200, -500);

                var shouldBe = geo.getProjection(position, camera);
                position.project(camera);

                expect(position.x).to.eq(shouldBe.x);
                expect(position.y).to.eq(shouldBe.y);
                expect(position.z).to.eq(shouldBe.z);
            });

            it("should correctly invert projection", function () {
                var camera = Vector.create(200, 300, 1000);
                var position = Vector.create(-100, 200, -500);

                position.project(camera);
                position.invertProject(camera, -500);

                expect(position.x).to.eq(-100);
                expect(position.y).to.eq(200);
                expect(position.z).to.eq(-500);
            });

            it("should correctly map visual translation", function () {
                var camera = Vector.create(200, 300, 1000);
                var movement = Vector.create(100, 500, 0);
                var position = Vector.create(-100, 200, -500);

                var shouldBe = geo.moveVisual(position, camera, movement);
                position.moveVisual(camera, movement);

                expect(position.x).to.eq(shouldBe.x);
                expect(position.y).to.eq(shouldBe.y);
                expect(position.z).to.eq(shouldBe.z);
            });
        });
    });
});
