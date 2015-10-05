"use strict";

var withObservable = require("../common/withObservable");
var debounceUpdateListener = require("../common/debounceUpdateListener");


var layoutService = withObservable.call({

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
		layoutService.notify("start", layoutService.updateViewportSize());
	},
	update: function () {
		layoutService.notify("update", layoutService.updateViewportSize());
	},
	end: function () {
		layoutService.notify("end", layoutService.updateViewportSize());
	}
}));

window.addEventListener("orientationchange", function () {
    var vpSize = layoutService.updateViewportSize();
    layoutService.notify("start", vpSize);
    layoutService.notify("end", vpSize);
});

layoutService.updateViewportSize();


module.exports = layoutService;
