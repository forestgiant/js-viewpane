"use strict";


var webpack = require("webpack");


module.exports = function (grunt) {
    var webpackServerConfig = require("./webpack.config");

    grunt.initConfig({

        // ERROR:
        // Running "webpack-dev-server:context" (webpack-dev-server) task
        // Warning: Object.keys called on non-object Use --force to continue.
        "webpack-dev-server": webpackServerConfig,

        "webpack": {

            // common settings
            "options": webpackServerConfig,

            // specific settings and overrides
            "dist": {

                output: {
                    path: "dist/",
                    filename: "viewpane.js",
                    // libraryTarget: "var",
                    library: "Viewpane"
                },

                devtool: null,

                plugins: [
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            drop_console: true,
                            unsafe: true
                        }
                    })
                ]
            }
        },

        "mochaTest": {

            "unit": {
                options: {
                    reporter: "spec",
                    quiet: false,
                    clearRequireCache: true,
                    require: ["babel-core/register"]
                },
                src: ["test/unit/**/*.test.js"]
            }
        },

        "watch": {
            "unit": {
                files: ["lib/**/*.js", "test/unit/**/*.test.js"],
                tasks: ["mochaTest:unit"],
                options: {
                    spawn: true
                },
            },
        },

        "karma": {

            "options": {
                configFile: "karma.conf.js",
                browsers: ["Chrome"]
            },

            "test": {
                singleRun: true,
                autoWatch: false
            },

            "tdd": {
                singleRun: true,
                autoWatch: false
            }
        }
    });

    // grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-webpack");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-contrib-watch");

    // test
    grunt.registerTask("test", "mochaTest:unit");
    grunt.registerTask("tdd", "watch:unit");
    grunt.registerTask("test-browser", "karma:test");

    // build
    grunt.registerTask("dist", "webpack:dist");
    grunt.registerTask("serve", "webpack-dev-server");
};
