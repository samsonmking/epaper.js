import { defaultOptions, ImageOptions } from './imageOptions';
import { PngReader, RGBAPixel } from './pngReader';
import { blackThreshold, Dither, hsvThreshold } from './threshold';

export class Monochrome {
    private readonly pngReader;

    constructor(pngInput: Buffer) {
        this.pngReader = new PngReader(pngInput);
    }

    public async toBlack(options: ImageOptions = {}): Promise<Buffer> {
        const fullOpts: Required<ImageOptions> = { ...defaultOptions, ...options };
        await this.pngReader.parse();
        if (fullOpts.dither) {
            const dither = new Dither(this.pngReader, 127);
            return await this.toThreshold(fullOpts, (pixel, x, y) => dither.threshold(pixel, x, y));
        } else {
            return await this.toThreshold(fullOpts, (pixel) => blackThreshold(pixel, fullOpts.blackThreshold));
        }
    }

    public async toRed(options: ImageOptions = {}): Promise<Buffer> {
        const fullOpts: Required<ImageOptions> = { ...defaultOptions, ...options };
        await this.pngReader.parse();
        return await this.toThreshold(fullOpts, (pixel) =>
            hsvThreshold(pixel, fullOpts.redLowerThreshold, fullOpts.redUpperThreshold)
        );
    }

    private async toThreshold(
        options: Required<ImageOptions>,
        threshold: (pixel: RGBAPixel, x: number, y: number) => boolean
    ): Promise<Buffer> {
        const { height, width } = this.pngReader;
        if (options.rotate90Degrees) {
            const devHeight = width;
            const devWidth = height;
            const lineWidth = devWidth % 8 === 0 ? Math.floor(devWidth / 8) : Math.floor(devWidth / 8) + 1;
            const outBuffer = allocBuffer_8(devWidth, devHeight);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const outX = y;
                    const outY = options.rightToLeft ? width - (devHeight - x - 1) - 1 : devHeight - x - 1;
                    const pixel = this.pngReader.getPixel(x, y);
                    if (threshold(pixel, x, y)) {
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
                    const pixel = this.pngReader.getPixel(x, y);
                    const outX = options.rightToLeft ? width - x : x;
                    if (threshold(pixel, x, y)) {
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
