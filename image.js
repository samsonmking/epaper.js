const PNGReader = require('png.js');

// https://www.w3.org/TR/AERT/#color-contrast
const getLuma = (r, g, b) => (r * 0.299) + (g * 0.587) + (b * 0.114);
const allocBuffer_8 = (devWidth, devHeight) => Buffer.alloc(Math.ceil(devWidth / 8) * devHeight, 0xff);
const allocBuffer_4 = (devWidth, devHeight) => Buffer.alloc(Math.ceil(devWidth / 4) * devHeight, 0xff);

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
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const [r, g, b, alpha] = png.getPixel(x, y);
                    const luma = getLuma(r, g, b);
                    if (luma < 50) {
                        out_index = Math.floor((x + y * width) / 8)
                        outBuffer[out_index] &= ~(0x80 >> Math.floor(x % 8));
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
                        out_index = Math.floor((outX + outY * devWidth) / 8)
                        outBuffer[out_index] &= ~(0x80 >> Math.floor(y % 8));
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

function convertPNGto1Bit4Grey(pngBytes) {
    const reader = new PNGReader(pngBytes);
    return new Promise((resolve, reject) => {
        reader.parse((err, png) => {
            if (err) {
                return reject(err);
            }
            const height = png.getHeight();
            const width = png.getWidth();
            const outBuffer = allocBuffer_4(width, height);
            var i = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    i++;
                    if (i % 4 == 0) {
                        out_index = Math.floor((x + y * width) / 4)
                        outBuffer[out_index] = (
                            (RGBAToHex(png.getPixel(x - 3, y)) & 0xc0) |
                            (RGBAToHex(png.getPixel(x - 2, y)) & 0xc0) >> 2 |
                            (RGBAToHex(png.getPixel(x - 1, y)) & 0xc0) >> 4 |
                            (RGBAToHex(png.getPixel(x, y)) & 0xc0) >> 6
                        )
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

function convertPNGto1Bit4GreyRotated(pngBytes) {
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
            const outBuffer = allocBuffer_4(devWidth, devHeight);
            var i = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const outX = y;
                    const outY = x;
                    i++;
                    if (i % 4 == 0) {
                        out_index = Math.floor((outX + outY * width) / 4)
                        outBuffer[out_index] = (
                            (RGBAToHex(png.getPixel(x, y - 3)) & 0xc0) |
                            (RGBAToHex(png.getPixel(x, y - 2)) & 0xc0) >> 2 |
                            (RGBAToHex(png.getPixel(x, y - 1)) & 0xc0) >> 4 |
                            (RGBAToHex(png.getPixel(x, y)) & 0xc0) >> 6
                        )
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

function RGBAToHex(rgba) {
    let r = (+rgba[0]).toString(16),
        g = (+rgba[1]).toString(16),
        b = (+rgba[2]).toString(16)

    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    return Number("0x" + r + g + b);
}

module.exports = { convertPNGto1BitBW, convertPNGto1BitBWRotated, convertPNGto1Bit4Grey, convertPNGto1Bit4GreyRotated };
