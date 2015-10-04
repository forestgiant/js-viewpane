"use strict";

var withObservable = require("../common/withObservable");
var debounceUpdateListener = require("../common/debounceUpdateListener");


var windowService = withObservable.call({

    "viewportSize": {
        x: 0,
        y: 0
    },

    updateViewportSize: function () {
        this.viewportSize.x = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.viewportSize.y = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        return this.viewportSize;
    },

    getViewportSize: function () {
        return this.viewportSize;
    }
});

window.addEventListener("resize", debounceUpdateListener({

	"timeout": 500,
	"debounce": 250,

	start: function () {
		windowService.notify("start", windowService.updateViewportSize());
	},
	update: function () {
		windowService.notify("update", windowService.updateViewportSize());
	},
	end: function () {
		windowService.notify("end", windowService.updateViewportSize());
	}
}));

window.addEventListener("orientationchange", function () {
    var vpSize = windowService.updateViewportSize();
    windowService.notify("start", vpSize);
    windowService.notify("end", vpSize);
});

windowService.updateViewportSize();


module.exports = windowService;
