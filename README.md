# ViewpaneJS

> Feelgood pan and zoomable container


# api


```javascript
    
    var viewpane = new Viewpane($camera, $viewpane, options);

```


# options

```javascript
    {
        friction: 0.91,             // friction used on animation to stop user input
        typeOfFocus: "fitLargestDimension",     // type of valid positions. May also be "fitBothDimensions"
        focus: {x: 2048, y: 1024},  // The area to focus camera (bound, rubberband). Default: viewpane dimensions
        perspective: 1000,          // perspective of camera. Values 0+. Default 1000
        origin: {x: 0.5, y: 0.5}    // perspective origin. Values [0, 1]. Default (0.5, 0.5)
    }
```


# todos


- Release v0.1.0


## performance

- ensure images are a multiple of 2 (i.e. use 2048x1024, but NOT 20148x1025). Especially on iOS


## bugs

- sometimes zoomIn does not trigger rubberband animation

- Browserbugs
    - iOS 9.0.x, `transform-style: preserve-3d` flickering 3d layers
        - overflow hidden destroys preserve3d
            http://stackoverflow.com/questions/32639639/ios-9-mobile-safari-has-a-blinking-bug-with-transform-scale3d-and-translate3d)
        -workaround: use js entities instead of css only setup


## possible features

- usability: on orientation change keep center-position
- use zoomAt for SnapFrictionAnimation (Currently origins aways from center cause different animations)
- usability: for type 'Fit Largest': snap to 'Fit both'
- input: 3d rotation
- api: animate move to position
- api options: set initial camera placement
- internal: use Typescript
- change perspective tests to use vector implementation; remove geometry
- sort of snap positions
- move indicator


## tryouts

- do **not** zoom by changing `perspective-origin`
    - reason: 3d layout for 3d scenes has (of course) flips in perspective
    - still requires calculation on changing origin
    - unindentified bug when zooming and changing origin again
