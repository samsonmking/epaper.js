import { HSVA } from './threshold';

export interface ImageOptions {
    rotate90Degrees?: boolean;
    blackThreshold?: number;
    redLowerThreshold?: HSVA;
    redUpperThreshold?: HSVA;
    dither?: boolean;
    ditherThreshold?: number;
}

export const defaultOptions: Required<ImageOptions> = {
    rotate90Degrees: false,
    blackThreshold: 90,
    redLowerThreshold: [340, 0.5, 0.5, 0.75],
    redUpperThreshold: [20, 1, 1, 1],
    dither: false,
    ditherThreshold: 127,
};
