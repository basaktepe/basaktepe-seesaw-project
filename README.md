# Seesaw Simulation

## Project Description

A visual seesaw simulation built with pure HTML, CSS, and JavaScript. Users click on the seesaw area to drop random-weight objects onto the board. The seesaw tilts based on the combined torque of all placed objects, with smooth animations and persistent state across page refreshes.

## How It Works

Each object has a random weight (1-10 kg) and is placed at a specific distance from the center pivot. The simulation calculates torque for each side using `torque = weight x distance`. The tilt angle is determined by the difference between right and left torques, capped at +/-30 degrees:

```js
angle = Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10));
```

## Implementation Steps

1. **Initial setup** - Project scaffolding with empty HTML, CSS, and JS files
2. **Static seesaw layout** - Board, base (pivot), info panel cards, and reset button using only HTML and CSS
3. **Click detection** - Detecting click position on the seesaw, calculating side and distance from center
4. **Object creation** - Dropping colored balls with random weights, sized proportionally to weight
5. **Torque and tilt** - Calculating torque per side, applying smooth rotation to the board
6. **UI updates** - Dynamically updating left/right weight, tilt angle, and next weight in the info panel
7. **Falling animation** - Balls fall from the top of the card to the board before the seesaw tilts
8. **LocalStorage persistence** - Saving and restoring state so progress survives page refresh
9. **Reset functionality** - Clearing all objects, resetting the board, and updating localStorage

## Design Decisions

- **`getCenter()` as a function instead of a constant**: If the board hasn't fully rendered when the script loads, `offsetWidth` could return 0. A function ensures the value is always read at call time, making it safe regardless of render timing.

- **`onLand` callback before tilting**: The seesaw should only tilt after the ball lands on the board. Using a `transitionend` listener ensures the falling animation completes first, mimicking real physics where the weight affects the board on contact.

- **Ball size varies by weight**: Heavier objects render larger (`18 + weight * 4` px). This gives immediate visual feedback about an object's weight before reading the label, making the simulation more intuitive.

- **DOM manipulation over canvas**: The requirement explicitly prohibits canvas. DOM elements with CSS transitions provide smooth animations, easy event handling, and straightforward state management without a render loop.

## Trade-offs & Limitations

- **Approximate ball positioning on tilted board**: Balls are children of the rotating board wrapper, so they rotate with it. However, their vertical offset doesn't account for trigonometric positioning along the tilted surface. This is a visual approximation, not a physics-precise placement.

- **No framework by design**: The project uses only pure JavaScript, HTML, and CSS as required. This means manual DOM manipulation and state management, but results in zero dependencies and a lightweight build.

- **Single-file architecture**: All JavaScript lives in one file (~165 lines). At this scale, splitting would add complexity without meaningful benefit.

## AI Assistance

AI tools (Claude) were used for syntax help, debugging, commit message suggestions, and code review. All core logic was written and understood by me.
