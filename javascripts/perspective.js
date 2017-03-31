var columnDimensions = {
    w: 80,
    h: 640,
    d: 80
};

function setTransform(element, transform) {
    "use strict";
    element.style.webkitTransform = transform;
    element.style.mozTransform = transform;
    element.style.transform = transform;
}

function createFig(box, type) {
    "use strict";
    var fig = document.createElement("figure");
    fig.className = type;
    box.appendChild(fig);
    return fig;
}

function createBox(w, h, d) {
    "use strict";
    var box = document.createElement("div");
    box.className = "box";
    box.style.cssText = "position: absolute; transform-style: preserve-3d;";

    var front = createFig(box, "front");
    front.style.cssText = "width: " + w + "px; height: " + h + "px;";
    setTransform(front, "translateZ(" + (d/2) + "px)");

    var back = createFig(box, "back");
    back.style.cssText = "width: " + w + "px; height: " + h + "px;";
    setTransform(back, "translateZ(" + (-d/2) + "px) rotateY(180deg)");

    var left = createFig(box, "left");
    left.style.cssText = "width: " + d + "px; height: " + h + "px;";
    setTransform(left, "translateX(" + (-d/2) + "px) rotateY(270deg)");

    var right = createFig(box, "right");
    right.style.cssText = "width: " + d + "px; height: " + h + "px;";
    setTransform(right, "translateX(" + (d/2) + "px) rotateY(-270deg)");

    var top = createFig(box, "top");
    top.style.cssText = "width: " + w + "px; height: " + d + "px;";
    setTransform(top, "translateY(" + (-d/2) + "px) rotateX(-90deg)");

    var bottom = createFig(box, "bottom");
    bottom.style.cssText = "width: " + w + "px; height: " + d + "px;";
    setTransform(bottom, "translateY(" + (h - d/2) + "px) rotateX(90deg)");

    return box;
}

function createColumn(viewpaneEl, x, y, z) {
    "use strict";
    var w = columnDimensions.w; var h = columnDimensions.h; var d = columnDimensions.d;
    var box = createBox(w, h, d);
    box.className += " column";
    setTransform(box, "translate3d(" + x + "px, " + y + "px, " + z + "px)");
    viewpaneEl.appendChild(box);

    var pedestral = createBox(260, 40, 260);
    pedestral.className += " pedestral";
    setTransform(pedestral, "translate3d(" + (x - 90) + "px, " + (y + h) + "px, " + (z) + "px)");
    viewpaneEl.appendChild(pedestral);
    return pedestral;
}
