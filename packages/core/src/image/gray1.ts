import PNGReader from 'png.js';

export function convertPNGto1BitBW(pngBytes: Buffer): Promise<Buffer> {
    const reader = new PNGReader(pngBytes);
    return new Promise((resolve, reject) => {
        reader.parse((err, png) => {
            if (err) {
                return reject(err);
            }
            const height = png.getHeight();
            const width = png.getWidth();
            const outBuffer = allocBuffer_8(width, height);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const [r, g, b, alpha] = png.getPixel(x, y);
                    const luma = getLuma(r, g, b);
                    if (luma < 50) {
                        const out_index = Math.floor((x + y * width) / 8);
                        outBuffer[out_index] &= ~(0x80 >> Math.floor(x % 8));
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

export function convertPNGto1BitBW2in13V2(pngBytes: Buffer): Promise<Buffer> {
    const reader = new PNGReader(pngBytes);
    return new Promise((resolve, reject) => {
        reader.parse((err, png) => {
            if (err) {
                return reject(err);
            }
            const height = png.getHeight();
            const width = png.getWidth();
            const lineWidth =
                width % 8 === 0
                    ? Math.floor(width / 8)
                    : Math.floor(width / 8) + 1;
            const outBuffer = allocBuffer_8(width, height);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const [r, g, b, alpha] = png.getPixel(x, y);
                    const luma = getLuma(r, g, b);
                    const outX = width - x;
                    if (luma < 50) {
                        const out_index = Math.floor(outX / 8) + y * lineWidth;
                        outBuffer[out_index] &= ~(0x80 >> outX % 8);
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

export function convertPNGto1BitBW2in13V2Rotated(
    pngBytes: Buffer
): Promise<Buffer> {
    const reader = new PNGReader(pngBytes);
    return new Promise((resolve, reject) => {
        reader.parse((err, png) => {
            if (err) {
                return reject(err);
            }
            const height = png.getHeight();
            const width = png.getWidth();
            const devHeight = width;
            const devWidth = height;
            const lineWidth =
                devWidth % 8 === 0
                    ? Math.floor(devWidth / 8)
                    : Math.floor(devWidth / 8) + 1;
            const outBuffer = allocBuffer_8(devWidth, devHeight);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const outX = y;
                    const outY = width - (devHeight - x - 1) - 1;
                    const [r, g, b, alpha] = png.getPixel(x, y);
                    const luma = getLuma(r, g, b);
                    if (luma < 50) {
                        const out_index =
                            Math.floor(outX / 8) + outY * lineWidth;
                        outBuffer[out_index] &= ~(0x80 >> y % 8);
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

export function convertPNGto1BitBWRotated(pngBytes: Buffer): Promise<Buffer> {
    const reader = new PNGReader(pngBytes);
    return new Promise((resolve, reject) => {
        reader.parse((err, png) => {
            if (err) {
                return reject(err);
            }
            const height = png.getHeight();
            const width = png.getWidth();
            const devHeight = width;
            const devWidth = height;
            const outBuffer = allocBuffer_8(devWidth, devHeight);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const outX = y;
                    const outY = devHeight - x - 1;
                    const [r, g, b, alpha] = png.getPixel(x, y);
                    const luma = getLuma(r, g, b);
                    if (luma < 50) {
                        const out_index = Math.floor(
                            (outX + outY * devWidth) / 8
                        );
                        outBuffer[out_index] &= ~(0x80 >> Math.floor(y % 8));
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

function allocBuffer_8(devWidth: number, devHeight: number) {
    return Buffer.alloc(Math.ceil(devWidth / 8) * devHeight, 0xff);
}

function getLuma(r: number, g: number, b: number) {
    // https://www.w3.org/TR/AERT/#color-contrast
    return r * 0.299 + g * 0.587 + b * 0.114;
}
