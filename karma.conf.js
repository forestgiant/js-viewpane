"use strict";


module.exports = function (config) {
    config.set({

        basePath: "",

        frameworks: ["mocha", "chai"],

        files: [
            "test/browser/**/*.test.js"
        ],

        preprocessors: {
            "test/browser/**/*.js": ["webpack"],
            "lib/**/*.js": ["webpack"]
        },

        webpack: require("./webpack.config"),

        reporters: ["progress"],

        port: 9876,
        colors: true,
        autoWatch: false,
        singleRun: true,

        // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        browsers: ["Chrome"]
    });
};
