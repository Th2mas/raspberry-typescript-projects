import * as rpio from 'rpio';

/**
 * Defines the physical pin we want to use
 * We want to use GPIO 24, which has the physical pin 18
 */
const pinNumber = 18;

/**
 * Defines the pin as an output with an initial state of LOW
 */
rpio.open(pinNumber, rpio.OUTPUT, rpio.LOW);

/**
 * Defines the blinking speed in seconds
 */
const speedInSeconds = 1;

/**
 * Toggles the state of a pin
 * The pin can either be on ("1") or off ("0")
 * If the pin is on (high), then turn it off (low); otherwise the other way around
 *
 * @param pin the GPIO pin whose state should be toggled
 */
function toggleState(pin: number): void {
    const pinState = rpio.read(pin);
    const outputState = pinState === rpio.HIGH ? rpio.LOW : rpio.HIGH;
    rpio.write(pin, outputState);
}

/**
 * A simple 'sleep' method, which stops the program for a number of seconds
 * @param seconds defines the duration of the stop
 */
function sleep(seconds: number): void {
    const start = Date.now();
    let end;
    do {
        end = Date.now();
    }
    while ((end - start) < seconds * 1000);
}

for (let i = 0; i < 3; i++) {
    toggleState(pinNumber);
    sleep(speedInSeconds);
    toggleState(pinNumber);
    sleep(speedInSeconds);
}
