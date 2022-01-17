import tinycolor from 'tinycolor2';
import { PngReader, RGBAPixel } from './pngReader';

export type HSVA = [h: number, s: number, v: number, a: number];

export class Dither {
    private readonly quants: number[][];
    constructor(private readonly pngReader: PngReader, private readonly thresh: number) {
        const { height, width } = pngReader;
        this.quants = new Array(width).fill(1).map(() => new Array(height).fill(0));
    }

    public threshold(pixel: RGBAPixel, x: number, y: number): boolean {
        const grey = toGreyscale(pixel);
        const dithered = grey + this.quants[x][y];
        const value = Math.round(dithered / 255) * 255;
        const qu_err = dithered - value;

        this.storeQuantErr(x + 1, y, (qu_err * 7) / 16);
        this.storeQuantErr(x - 1, y + 1, (qu_err * 3) / 16);
        this.storeQuantErr(x, y + 1, (qu_err * 5) / 16);
        this.storeQuantErr(x + 1, y + 1, (qu_err * 1) / 16);

        return value < this.thresh;
    }

    private storeQuantErr(x: number, y: number, v: number) {
        const { height, width } = this.pngReader;

        if (x < 0 || x >= width || y >= height) return;
        this.quants[x][y] += v;
    }
}

export function blackThreshold(pixel: RGBAPixel, thresh: number): boolean {
    const grey = toGreyscale(pixel);
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
    let grey = toGreyscale(pixel);

    if (grey === 0xc0) {
        grey = 0x80;
    } else if (grey === 0x80) {
        grey = 0x40;
    }
    return grey & 0xc0;
}

function toGreyscale(pixel: RGBAPixel): number {
    const [r, g, b, a] = pixel;
    const { r: grey } = tinycolor({ r, g, b, a }).greyscale().toRgb();
    return grey;
    // https://www.w3.org/TR/AERT/#color-contrast
    // return r * 0.299 + g * 0.587 + b * 0.114;
}

function inRangeAnd(value: number, lower: number, upper: number) {
    return value >= lower && value <= upper;
}

function inRangeOr(value: number, lower: number, upper: number) {
    return value >= lower || value <= upper;
}
