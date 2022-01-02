import { defaultOptions, ImageOptions } from './imageOptions';
import { PngReader, RGBAPixel } from './pngReader';
import { blackThreshold, hsvThreshold } from './threshold';

export class MonochromeLR {
    private readonly pngReader;

    constructor(pngInput: Buffer) {
        this.pngReader = new PngReader(pngInput);
    }

    public toBlack(options: ImageOptions = {}): Promise<Buffer> {
        const fullOpts: Required<ImageOptions> = { ...defaultOptions, ...options };
        return this.toThreshold(fullOpts, (pixel) => blackThreshold(pixel, fullOpts.blackThreshold));
    }

    public toRed(options: ImageOptions = {}): Promise<Buffer> {
        const fullOpts: Required<ImageOptions> = { ...defaultOptions, ...options };
        return this.toThreshold(fullOpts, (pixel) =>
            hsvThreshold(pixel, fullOpts.redLowerThreshold, fullOpts.redUpperThreshold)
        );
    }

    private async toThreshold(
        options: Required<ImageOptions>,
        threshold: (pixel: RGBAPixel) => boolean
    ): Promise<Buffer> {
        const input = await this.pngReader.parse();
        const { height, width } = input;
        if (options.rotate90Degrees) {
            const devHeight = width;
            const devWidth = height;
            const outBuffer = allocBuffer_8(devWidth, devHeight);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const outX = y;
                    const outY = devHeight - x - 1;
                    const pixel = input.getPixel(x, y);
                    if (threshold(pixel)) {
                        const out_index = Math.floor((outX + outY * devWidth) / 8);
                        outBuffer[out_index] &= ~(0x80 >> Math.floor(y % 8));
                    }
                }
            }
            return outBuffer;
        } else {
            const outBuffer = allocBuffer_8(width, height);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const pixel = input.getPixel(x, y);
                    if (threshold(pixel)) {
                        const out_index = Math.floor((x + y * width) / 8);
                        outBuffer[out_index] &= ~(0x80 >> Math.floor(x % 8));
                    }
                }
            }
            return outBuffer;
        }
    }
}

export class MonochromeRL {
    private readonly pngReader;

    constructor(pngInput: Buffer) {
        this.pngReader = new PngReader(pngInput);
    }

    public async toBlack(options: ImageOptions = {}): Promise<Buffer> {
        const fullOpts: Required<ImageOptions> = { ...defaultOptions, ...options };
        const input = await this.pngReader.parse();
        const { height, width } = input;

        if (fullOpts.rotate90Degrees) {
            const devHeight = width;
            const devWidth = height;
            const lineWidth = devWidth % 8 === 0 ? Math.floor(devWidth / 8) : Math.floor(devWidth / 8) + 1;
            const outBuffer = allocBuffer_8(devWidth, devHeight);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const outX = y;
                    const outY = width - (devHeight - x - 1) - 1;
                    const pixel = input.getPixel(x, y);
                    if (blackThreshold(pixel, fullOpts.blackThreshold)) {
                        const out_index = Math.floor(outX / 8) + outY * lineWidth;
                        outBuffer[out_index] &= ~(0x80 >> y % 8);
                    }
                }
            }
            return outBuffer;
        } else {
            const lineWidth = width % 8 === 0 ? Math.floor(width / 8) : Math.floor(width / 8) + 1;
            const outBuffer = allocBuffer_8(width, height);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const pixel = input.getPixel(x, y);
                    const outX = width - x;
                    if (blackThreshold(pixel, fullOpts.blackThreshold)) {
                        const out_index = Math.floor(outX / 8) + y * lineWidth;
                        outBuffer[out_index] &= ~(0x80 >> outX % 8);
                    }
                }
            }
            return outBuffer;
        }
    }
}

function allocBuffer_8(devWidth: number, devHeight: number) {
    return Buffer.alloc(Math.ceil(devWidth / 8) * devHeight, 0xff);
}
