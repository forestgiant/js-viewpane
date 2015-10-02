# Viewpane

> Simple feelgood pan and zoomable container

This is a small subset of iScroll, offering a container or image that may zoomed and moved within a given range. Changes
should be a smoother scrolling experience and a more natural (iOS) rubberband. As an addition, this viewpane toys with
being in 3D space, enabling perspective experiments with css or js.


`bower install viewpane`


## usage

```css

    #camera {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;    
    }

    #viewpane {
        position: absolute;
        transform-style: preserve-3d
    }
```


```html

    <div id="camera">
        <div id="viewpane"></div>
    </div>
```


```javascript

    var viewpane = new Viewpane("camera", "viewpane", options);

```


### options

```javascript
    {
        // friction used on animation to stop user input
        friction: 0.91,             
        // type of valid positions. May also be "fitBothDimensions"
        // Also `Viewpane.FOCUS_TYPE.BOTH` or `Viewpane.FOCUS_TYPE.LARGEST`
        typeOfFocus: "fitLargestDimension",     
        // The area to focus camera (bound, rubberband)
        // Default: viewpane-element dimensions
        focus: {x: 2048, y: 1024},
        // perspective of camera. Values 0+. Default 1000  
        perspective: 1000,      
        // perspective origin. Values [0, 1]. Default (0.5, 0.5)    
        origin: {x: 0.5, y: 0.5}
    }
```


## requirements

- [support of 3d transforms](http://caniuse.com/#feat=transforms3d)


## exported utilities

for details see the corresponding sourcefile

```javascript
    // viewpane entity (renderable)
    Viewpane.Entity
    // animation loop
    Viewpane.Loop
    // vector class
    Viewpane.Vector
    // types of viewpane bounds
    Viewpane.FOCUS_TYPE
```


## performance

- ensure images are a multiple of 2 (i.e. use 2048x1024, but NOT 2048x1025). Especially on iOS


## known bugs

- sometimes zoomIn does not trigger rubberband animation

- Browserbugs

    - iOS 9.0.x, `transform-style: preserve-3d` flickering 3d layers

        - overflow hidden destroys preserve3d
            http://stackoverflow.com/questions/32639639/ios-9-mobile-safari-has-a-blinking-bug-with-transform-scale3d-and-translate3d)

        - workaround: use js entities instead of css only setup
