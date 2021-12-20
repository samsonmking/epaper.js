import tinycolor from 'tinycolor2';
import { RGBAPixel } from './pngReader';

export function blackThreshold(pixel: RGBAPixel, thresh: number) {
    const [r, g, b, a] = pixel;
    // r, g, and b will all have the same values if greyscale
    const { r: grey } = tinycolor({ r, g, b, a }).greyscale().toRgb();
    return grey < thresh ? 0 : 255;
}
