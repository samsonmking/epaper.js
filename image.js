const PNGReader = require('png.js');

// https://www.w3.org/TR/AERT/#color-contrast
const getLuma = (r, g, b) => (r * 0.299) + (g * 0.587) + (b * 0.114);
const allocBuffer = (devWidth, devHeight) => Buffer.alloc(Math.ceil(devWidth / 8) * devHeight, 0xff);

function convertPNGto1BitBW(pngBytes) {
    const reader = new PNGReader(pngBytes);
    return new Promise((resolve, reject) => {
        reader.parse((err, png) => {
            if (err) {
                return reject(err);
            }
            const height = png.getHeight();
            const width = png.getWidth();
            const outBuffer = allocBuffer(width, height);
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
            const outBuffer = allocBuffer(devWidth, devHeight);
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

module.exports = { convertPNGto1BitBW, convertPNGto1BitBWRotated };
