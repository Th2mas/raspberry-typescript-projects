# traffic-light

## Table of contents
1. [Components](#components)
2. [Design](#design)
3. [Circuit Diagram](#circuit-diagram)
4. [Dependencies](#dependencies)
5. [Code](#code)
6. [Run application](#run-application)
7. [Notes](#notes)
8. [Further reading](#further-reading)

## Components
- 1x Raspberry Pi 3
- 1x Breadboard
- 3x 100&Omega; resistor
- 1x Red LED
- 1x Yellow LED
- 1x Green LED
- 3x Female-to-male jumper wire
- 1x Male-to-male jumper wire

## Design
![Fritzing diagram of the traffic light example](./images/traffic-light.design.svg)

*Diagram created using [Fritzing](https://fritzing.org/home/)*

## Circuit Diagram
Assuming, that the Raspberry is just an AC source, we can calculate the required resistor values for each of the LED.
For the green LED, we have already calculated the necessary resistance value in the [Blinking LED](../blinking-led) project.

![Resistance value for the green LED](./images/resistor-green.equation.svg)

For the yellow LED we assume a voltage drop of 1.9V and therefore the resistance value is

![Resistance value for the yellow LED](./images/resistor-yellow.equation.svg)

For the red LED we assume a voltage drop of 1.8V and therefore the resistance value is

![Resistance value for the red LED](./images/resistor-red.equation.svg)

You can see, that for all three LEDs we have three different resistance values.

We can now decide what we want to do: either we use the exact values by putting resistors in series for the red and yellow 
LEDs, or we just use one single resistance value (100&Omega;) for all three LEDs.
In the latter case we have to check if the current, which will flow through the LEDs, does not exceed the maximum the LED 
can take.

A general thumb rule is a current of 20mA. If the resulting current is below that, then we can use the 100&Omega; resistors.
For the red LED we get

![Current value for the red LED with a resistance of 100 Ohm](./images/current-red.equation.svg)

and for the yellow LED we get

![Current value for the yellow LED with a resistance of 100 Ohm](./images/current-yellow.equation.svg)

Since both values are below 20mA, we can safely use just the 100&Omega; resistors.

## Dependencies
In order to be able to use TypeScript and the other packages, we need to include these dependencies in a package.json file.
The packages needed in this project are

- [onoff](https://www.npmjs.com/package/onoff)
- [typescript](https://www.npmjs.com/package/typescript)
- [ts-node](https://www.npmjs.com/package/ts-node)

As a reference, the full can be found in the [package.json](./package.json) file.

## Code
First we need to include the `onoff` package, which handles the communication with the Raspberry Pi.
```typescript
import { Gpio } from 'onoff';
``` 
Now we can configure the pins we're going to use.
We use GPIO 16 for the red LED, GPIO 20 for the yellow LED and GPIO 21 for the green LED.
This means we have to create three different Gpio objects with their respective GPIO numbers.
The second parameter of the constructor indicates, if the pin should be used as an 'in' or 'out' pin.
We only tell the LEDs to turn on and off, so we can just use 'out' as the second parameter.
```typescript
const RED = new Gpio(16, 'out');
const YELLOW = new Gpio(20, 'out');
const GREEN = new Gpio(21, 'out');
const LEDs = [RED, YELLOW, GREEN];
```
Before the program starts, all three LEDs are off.
By using timeouts, we can turn each of the LEDs on or off.

First, the red LED must be turned on while the others stay off.
Next, the yellow LED must be turned on, and the red LED must be turned off.
Finally, the green LED must be turned on, and the yellow LED must be turned off.

We want to be able to turn on one LED at a time. 
Therefore, we create a function, which turns on the given pin and turns off the remaining ones.
```typescript
function switchTo(pin: Gpio): void {
    switch (pin) {
        case RED:
            RED.writeSync(Gpio.HIGH);
            YELLOW.writeSync(Gpio.LOW);
            GREEN.writeSync(Gpio.LOW);
            break;
        case YELLOW:
            RED.writeSync(Gpio.LOW);
            YELLOW.writeSync(Gpio.HIGH);
            GREEN.writeSync(Gpio.LOW);
            break;
        case GREEN:
            RED.writeSync(Gpio.LOW);
            YELLOW.writeSync(Gpio.LOW);
            GREEN.writeSync(Gpio.HIGH);
            break;
        default:
            break;
    }
}
```
We give each LED a time of about 2 seconds.
The code will then look like this
```typescript
setTimeout(() => switchTo(RED), 0);
setTimeout(() => switchTo(YELLOW), 2000);
setTimeout(() => switchTo(GREEN), 4000);
```

The last part we have to do is freeing all resources.
```typescript
function freePin(pin: Gpio): void {
    // Turn the pin off
    pin.writeSync(Gpio.LOW);
    // Free resources
    pin.unexport();
}
```
This can be done over an iteration over the LED array.
This code must run after we have completed all steps and just need to clean up before the program finishes.
For this we can use another timeout.

As a reference, the full code can be found in the [index.ts](./src/index.ts) file.

## Run application
Open the console in the directory in which you stored the package.json file on your Raspberry Pi.

To run the application, type
```
npm run start
```
in the console.
After a short time, you should see how the traffic light is first red, then only yellow and then finally only green.  

## Notes
### User input

## Further reading