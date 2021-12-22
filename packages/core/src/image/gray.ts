import { defaultOptions, ImageOptions } from './imageOptions';
import { PngReader } from './pngReader';
import { gray4Threshold } from './threshold';

export class GrayHScan {
    private readonly pngReader;

    constructor(pngInput: Buffer) {
        this.pngReader = new PngReader(pngInput);
    }

    public async to4Gray(options: ImageOptions = {}): Promise<Buffer> {
        const fullOpts: Required<ImageOptions> = { ...defaultOptions, ...options };
        const input = await this.pngReader.parse();
        const { height, width } = input;

        if (fullOpts.rotate90Degrees) {
            const devHeight = width;
            const devWidth = height;
            const outBuffer = allocBuffer_4(devWidth, devHeight);
            let i = 0;
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    const outX = y;
                    const outY = devHeight - x - 1;
                    if (++i % 4 == 0) {
                        const out_index = Math.floor((outX + outY * devWidth) / 4);
                        outBuffer[out_index] =
                            gray4Threshold(input.getPixel(x, y - 3)) |
                            (gray4Threshold(input.getPixel(x, y - 2)) >> 2) |
                            (gray4Threshold(input.getPixel(x, y - 1)) >> 4) |
                            (gray4Threshold(input.getPixel(x, y)) >> 6);
                    }
                }
            }
            return outBuffer;
        } else {
            const outBuffer = allocBuffer_4(width, height);
            let i = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (++i % 4 == 0) {
                        const out_index = Math.floor((x + y * width) / 4);
                        outBuffer[out_index] =
                            gray4Threshold(input.getPixel(x - 3, y)) |
                            (gray4Threshold(input.getPixel(x - 2, y)) >> 2) |
                            (gray4Threshold(input.getPixel(x - 1, y)) >> 4) |
                            (gray4Threshold(input.getPixel(x, y)) >> 6);
                    }
                }
            }
            return outBuffer;
        }
    }
}

function allocBuffer_4(devWidth: number, devHeight: number) {
    return Buffer.alloc(Math.ceil(devWidth / 4) * devHeight, 0xff);
}
