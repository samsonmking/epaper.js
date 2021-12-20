import { PNG } from 'pngjs';

export type RGBAPixel = [r: number, g: number, b: number, a: number];

export class PngReader {
    private readonly emptyBuffer = Buffer.alloc(0);
    private png?: PNG;

    constructor(private readonly inputPng: Buffer) {}

    public get height() {
        return this.png?.height ?? 0;
    }

    public get width() {
        return this.png?.width ?? 0;
    }

    public get buffer() {
        return this.png?.data ?? this.emptyBuffer;
    }

    public async parse(): Promise<PngReader> {
        return new Promise((resolve, reject) => {
            const png = new PNG({
                filterType: -1,
            });
            png.parse(this.inputPng, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    this.png = data;
                    resolve(this);
                }
            });
        });
    }

    public getPixel(x: number, y: number): RGBAPixel {
        const idx = (this.width * y + x) << 2;
        return [this.buffer[idx], this.buffer[idx + 1], this.buffer[idx + 2], this.buffer[idx + 3]];
    }
}
