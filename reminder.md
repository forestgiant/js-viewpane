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
