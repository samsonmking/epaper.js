import PNGReader from 'png.js';
import sharp from 'sharp';

export async function convertPNGto4Grey(pngBytes: Buffer) {
    const pngBytes_L = await sharp(pngBytes).greyscale().png().toBuffer();
    const reader = new PNGReader(pngBytes_L);
    return new Promise((resolve, reject) => {
        reader.parse((err, png) => {
            if (err) {
                return reject(err);
            }
            const height = png.getHeight();
            const width = png.getWidth();
            const outBuffer = allocBuffer_4(width, height);
            let i = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (++i % 4 == 0) {
                        const out_index = Math.floor((x + y * width) / 4);
                        outBuffer[out_index] =
                            (getGrayPixel(png.getPixel(x - 3, y)) & 0xc0) |
                            ((getGrayPixel(png.getPixel(x - 2, y)) & 0xc0) >> 2) |
                            ((getGrayPixel(png.getPixel(x - 1, y)) & 0xc0) >> 4) |
                            ((getGrayPixel(png.getPixel(x, y)) & 0xc0) >> 6);
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

export async function convertPNGto4GreyRotated(pngBytes: Buffer) {
    const pngBytes_L = await sharp(pngBytes).greyscale().png().toBuffer();
    const reader = new PNGReader(pngBytes_L);
    return new Promise((resolve, reject) => {
        reader.parse((err, png) => {
            if (err) {
                return reject(err);
            }
            const height = png.getHeight();
            const width = png.getWidth();
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
                            (getGrayPixel(png.getPixel(x, y - 3)) & 0xc0) |
                            ((getGrayPixel(png.getPixel(x, y - 2)) & 0xc0) >> 2) |
                            ((getGrayPixel(png.getPixel(x, y - 1)) & 0xc0) >> 4) |
                            ((getGrayPixel(png.getPixel(x, y)) & 0xc0) >> 6);
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

function getGrayPixel(rgba: [number, number, number, number]) {
    // In a grayscale image: r, g, b are all set to the same value and a == 255
    let [pixel] = rgba;
    if (pixel === 0xc0) {
        pixel = 0x80;
    } else if (pixel === 0x80) {
        pixel = 0x40;
    }
    return pixel;
}

function allocBuffer_4(devWidth: number, devHeight: number) {
    return Buffer.alloc(Math.ceil(devWidth / 4) * devHeight, 0xff);
}
