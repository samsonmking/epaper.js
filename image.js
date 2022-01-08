const PNGReader = require('png.js');
const sharp = require('sharp');

// https://www.w3.org/TR/AERT/#color-contrast
const getLuma = (r, g, b) => r * 0.299 + g * 0.587 + b * 0.114;
const allocBuffer_8 = (devWidth, devHeight) =>
    Buffer.alloc(Math.ceil(devWidth / 8) * devHeight, 0xff);
const allocBuffer_4 = (devWidth, devHeight) =>
    Buffer.alloc(Math.ceil(devWidth / 4) * devHeight, 0xff);

function convertPNGto1BitBW(pngBytes) {
    const reader = new PNGReader(pngBytes);
    return new Promise((resolve, reject) => {
        reader.parse((err, png) => {
            if (err) {
                return reject(err);
            }
            const height = png.getHeight();
            const width = png.getWidth();
            const outBuffer = allocBuffer_8(width, height);

            const quants = (new Array(width).fill(1).map(() => new Array(height).fill(0)));
            const storeQuantErr = (x, y, v) => {
                if (x < 0 || x >= width || y >= height) return;
                quants[x][y] += v
            }

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const [r, g, b] = png.getPixel(x, y);
                    const luma = getLuma(r, g, b);


                    const oldValue = luma + quants[x][y];
                    const value = Math.round(oldValue / 255) * 255;
                    const qu_err = oldValue - value;

                    storeQuantErr(x+1, y  , qu_err * 7/16);
                    storeQuantErr(x-1, y+1, qu_err * 3/16);
                    storeQuantErr(x  , y+1, qu_err * 5/16);
                    storeQuantErr(x+1, y+1, qu_err * 1/16);

                    if (value < 128) {
                        const out_index = Math.floor((x + y * width) / 8);
                        outBuffer[out_index] &= ~(0x80 >> Math.floor(x % 8));
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

function convertPNGto1BitBW2in13V2(pngBytes) {
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

function convertPNGto1BitBW2in13V2Rotated(pngBytes) {
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
                        const out_index = Math.floor(outX / 8) + outY * lineWidth;
                        outBuffer[out_index] &= ~(0x80 >> y % 8);
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

function convertPNGto1BitBWRotated(pngBytes) {
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
                        const out_index = Math.floor((outX + outY * devWidth) / 8);
                        outBuffer[out_index] &= ~(0x80 >> Math.floor(y % 8));
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

async function convertPNGto4Grey(pngBytes) {
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
                            ((getGrayPixel(png.getPixel(x - 2, y)) & 0xc0) >>
                                2) |
                            ((getGrayPixel(png.getPixel(x - 1, y)) & 0xc0) >>
                                4) |
                            ((getGrayPixel(png.getPixel(x, y)) & 0xc0) >> 6);
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

async function convertPNGto4GreyRotated(pngBytes) {
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
                            ((getGrayPixel(png.getPixel(x, y - 2)) & 0xc0) >>
                                2) |
                            ((getGrayPixel(png.getPixel(x, y - 1)) & 0xc0) >>
                                4) |
                            ((getGrayPixel(png.getPixel(x, y)) & 0xc0) >> 6);
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

function getGrayPixel(rgba) {
    // In a grayscale image: r, g, b are all set to the same value and a == 255
    let [pixel] = rgba;
    if (pixel === 0xc0) {
        pixel = 0x80;
    } else if (pixel === 0x80) {
        pixel = 0x40;
    }
    return pixel;
}

module.exports = {
    convertPNGto1BitBW,
    convertPNGto1BitBWRotated,
    convertPNGto4Grey,
    convertPNGto4GreyRotated,
    convertPNGto1BitBW2in13V2,
    convertPNGto1BitBW2in13V2Rotated,
};
