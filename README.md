# Seesaw Simulation

## Project Description

A visual seesaw simulation built with pure HTML, CSS, and JavaScript. Users click on the seesaw area to drop random-weight objects onto the board. The seesaw tilts based on the combined torque of all placed objects, with smooth animations and persistent state across page refreshes.

## How It Works

Each object has a random weight (1-10 kg) and is placed at a specific distance from the center pivot. The simulation calculates torque for each side using `torque = weight x distance`. The tilt angle is determined by the difference between right and left torques, capped at +/-30 degrees:

```js
angle = Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10));
```

