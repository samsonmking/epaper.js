import tinycolor from 'tinycolor2';
import { RGBAPixel } from './pngReader';

export type HSVA = [h: number, s: number, v: number, a: number];

export function blackThreshold(pixel: RGBAPixel, thresh: number): boolean {
    const [r, g, b, a] = pixel;
    // r, g, and b will all have the same values if greyscale
    const { r: grey } = tinycolor({ r, g, b, a }).greyscale().toRgb();
    return grey < thresh;
}

export function hsvThreshold(pixel: RGBAPixel, lowerBound: HSVA, upperBound: HSVA): boolean {
    const [r, g, b, inputa] = pixel;
    const inputColor = tinycolor({ r, g, b, a: inputa });
    const { h, s, v, a } = inputColor.toHsv();
    const [hl, sl, vl, al] = lowerBound;
    const [hu, su, vu, au] = upperBound;

    const hInRange = hl > hu ? inRangeOr(h, hl, hu) : inRangeAnd(h, hl, hu);
    return hInRange && inRangeAnd(s, sl, su) && inRangeAnd(v, vl, vu) && inRangeAnd(a, al, au);
}

export function gray4Threshold(pixel: RGBAPixel): number {
    const [r, g, b, a] = pixel;
    // r, g, and b will all have the same values if greyscale
    let { r: grey } = tinycolor({ r, g, b, a }).greyscale().toRgb();

    if (grey === 0xc0) {
        grey = 0x80;
    } else if (grey === 0x80) {
        grey = 0x40;
    }
    return grey & 0xc0;
}

function inRangeAnd(value: number, lower: number, upper: number) {
    return value >= lower && value <= upper;
}

function inRangeOr(value: number, lower: number, upper: number) {
    return value >= lower || value <= upper;
}
