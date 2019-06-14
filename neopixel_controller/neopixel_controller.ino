#include <Adafruit_NeoPixel.h>
#include <avr/power.h>

#define PIN 6
#define NUM_PIXELS 150

// modes
#define MODE_FADE 0
#define MODE_WIPE 1
#define MODE_MARQUEE 2
#define MODE_RAINBOW 3
#define MODE_PULSE 4

// Parameter 1 = number of pixels in strip
// Parameter 2 = Arduino pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_PIXELS, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
    strip.begin();
    strip.show(); // Initialize all pixels to off.

    Serial.begin(9600);

    colorFade(strip.Color(255, 0, 0), 500, 20);
    colorFade(strip.Color(0, 0, 0), 500, 20);
    // colorWipe(strip.Color(0, 255, 0), 1000, false);
    // colorMarquee(strip.Color(0, 0, 255), 5, 2, 1000, false);
    // rainbowCycle(5000, 500, false);
}

void loop() {
    if (Serial.available()) {
        uint8_t mode = Serial.read();

        if (mode == MODE_FADE) {
            uint32_t fadeColor = readColor();
            uint16_t fadeDuration = readInt16();
            colorFade(fadeColor, fadeDuration, 20);
        }
        else if (mode == MODE_WIPE) {
            uint32_t wipeColor = readColor();
            uint16_t wipeDuration = readInt16();
            colorWipe(wipeColor, wipeDuration, true);
        }
        else if (mode == MODE_MARQUEE) {
            uint8_t marqueeCount = readInt8();
            uint32_t marqueeColors[100];
            uint16_t marqueeLengths[100];
            for (uint8_t i = 0; i < marqueeCount; i++) {
                marqueeColors[i] = readColor();
                marqueeLengths[i] = readInt16();
            }
            uint16_t marqueeDuration = readInt16();
            colorMarquee(marqueeCount, marqueeColors, marqueeLengths, marqueeDuration, true);
        }
        else if (mode == MODE_RAINBOW) {
            uint16_t rainbowDuration = readInt16();
            uint16_t rainbowLength = readInt16();
            rainbowCycle(rainbowDuration, rainbowLength, true);
        }
        else if (mode == MODE_PULSE) {
            uint32_t pulseColor1 = readColor();
            uint32_t pulseColor2 = readColor();
            uint16_t pulseDuration = readInt16();
            colorPulse(pulseColor1, pulseColor2, pulseDuration, 20);
        }
    }
}

uint8_t readInt8() {
    while (Serial.available() < 1) {}
    return Serial.read();
}

// Read a big-endian 16-bit int from serial.
uint16_t readInt16() {
    while (Serial.available() < 2) {}
    return (uint16_t)Serial.read() << 8 | Serial.read();
}

// Read a 32-bit RGB color from serial.
uint32_t readColor() {
    while (Serial.available() < 3) {}
    uint8_t r = Serial.read();
    uint8_t g = Serial.read();
    uint8_t b = Serial.read();
    return (uint32_t)r << 16 | (uint32_t)g << 8 | b;
}

// Fill all the dots with a color simultaneously.
void setColor(uint32_t color) {
    for (uint16_t p = 0; p < NUM_PIXELS; p++) {
        strip.setPixelColor(p, color);
    }
    strip.show();
}

// Fade all pixels smoothly from their current color to a target color.
void colorFade(uint32_t color, uint16_t duration, uint16_t stepDuration) {
    uint8_t r = (uint8_t)(color >> 16);
    uint8_t g = (uint8_t)(color >> 8);
    uint8_t b = (uint8_t)(color);
    uint8_t *pixels = strip.getPixels();

    uint16_t steps = (stepDuration && (duration > stepDuration)) ? duration / stepDuration : 1;

    for (uint16_t s = steps; s > 0; s--) {
        for (uint16_t p = 0; p < NUM_PIXELS; p++) {
            uint8_t *pixel = &pixels[p * 3];
            uint8_t pr = pixel[1];
            uint8_t pg = pixel[0];
            uint8_t pb = pixel[2];

            uint8_t sr = (r > pr) ? (pr + (r - pr) / s) : (pr - (pr - r) / s);
            uint8_t sg = (g > pg) ? (pg + (g - pg) / s) : (pg - (pg - g) / s);
            uint8_t sb = (b > pb) ? (pb + (b - pb) / s) : (pb - (pb - b) / s);

            strip.setPixelColor(p, sr, sg, sb);
        }
        strip.show();
        delay(stepDuration);
        if (Serial.available()) return;
    }
}

// Fill the dots one after the other with a color.
void colorWipe(uint32_t color, uint16_t duration, bool reverse) {
    uint16_t stepDuration = duration / NUM_PIXELS;

    uint8_t r = (uint8_t)(color >> 16);
    uint8_t g = (uint8_t)(color >> 8);
    uint8_t b = (uint8_t)(color);

    for (uint16_t p = 0; p < NUM_PIXELS; p++) {
        strip.setPixelColor(reverse ? NUM_PIXELS - p : p, color);
        strip.show();
        delay(stepDuration);
        if (Serial.available()) return;
    }
}

// Create a scrolling marquee of groups of pixels of varying colors and lengths.
void colorMarquee(uint8_t count, uint32_t *colors, uint16_t *lengths, uint16_t duration, bool reverse) {
    uint16_t length = 0;
    for (uint8_t i = 0; i < count; i++) {
        length += lengths[i];
    }
    if (length == 0) return;
    uint16_t stepDuration = duration / length;

    while (1) {
        for (uint16_t s = 0; s < length; s++) {
            uint16_t offset = reverse ? s : (length - s - 1);
            for (uint16_t p = 0; p < NUM_PIXELS; p++) {
                uint16_t pp = (p + offset) % length;
                uint16_t cend = 0;
                for (uint8_t c = 0; c < count; c++) {
                    cend += lengths[c];
                    if (pp < cend) {
                        strip.setPixelColor(p, colors[c]);
                        break;
                    }
                }
            }
            strip.show();
            delay(stepDuration);
            if (Serial.available()) return;
        }
    }
}

// Create a color-cycling rainbow covering the full spectrum over a certain pixel length.
void rainbowCycle(uint16_t duration, uint16_t length, bool reverse) {
    uint16_t stepDuration = duration / 256;

    while (1) {
        for (uint8_t c = 0; c < 256; c++) {
            if (!length) {
                setColor(wheel(c));
            }
            else {
                for (uint16_t p = 0; p < NUM_PIXELS; p++) {
                    strip.setPixelColor(p, wheel(((p * 256 / length) + (reverse ? c : -c)) & 255));
                }
                strip.show();
            }
            delay(stepDuration);
            if (Serial.available()) return;
        }
    }
}

// Fade alternately between two colors.
void colorPulse(uint32_t color1, uint32_t color2, uint16_t duration, uint16_t stepDuration) {
    while (1) {
        colorFade(color1, duration, stepDuration);
        if (Serial.available()) return;
        colorFade(color2, duration, stepDuration);
        if (Serial.available()) return;
    }
}

// Input a hue value 0 to 255 to get a 32-bit color value.
uint32_t wheel(uint8_t wheelPos) {
    wheelPos = 255 - wheelPos;
    if (wheelPos < 85) {
        return strip.Color(255 - wheelPos * 3, 0, wheelPos * 3);
    }
    else if (wheelPos < 170) {
        wheelPos -= 85;
        return strip.Color(0, wheelPos * 3, 255 - wheelPos * 3);
    }
    else {
        wheelPos -= 170;
        return strip.Color(wheelPos * 3, 255 - wheelPos * 3, 0);
    }
}
