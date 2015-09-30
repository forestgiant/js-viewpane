"use strict";

import { withObservable } from "../common/withObservable";
import debounceUpdateListener from "../common/debounceUpdateListener";


var windowService = withObservable.call({

    "viewportSize": {
        x: 0,
        y: 0
    },

    updateViewportSize() {
        this.viewportSize.x = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.viewportSize.y = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        return this.viewportSize;
    },

    getViewportSize() {
        return this.viewportSize;
    }
});

window.addEventListener("resize", debounceUpdateListener({

	"timeout": 500,
	"debounce": 250,

	start() {
		windowService.notify("start", windowService.updateViewportSize());
	},
	update () {
		windowService.notify("update", windowService.updateViewportSize());
	},
	end () {
		windowService.notify("end", windowService.updateViewportSize());
	}
}));

windowService.updateViewportSize();


export default windowService;
