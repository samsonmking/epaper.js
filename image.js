const PNGReader = require('png.js');

function convertPNGto1BitBuffer(pngBytes) {
    const reader = new PNGReader(pngBytes);
    return new Promise((resolve, reject) => {
        reader.parse((err, png) => {
            if(err) {
                return reject(err);
            }
            const height = png.getHeight();
            const width = png.getWidth();
            const outBuffer = Buffer.alloc(Math.ceil(width / 8) * height, 0xff);
            for(let y = 0; y < height; y++) {
                for(let x = 0; x < width; x++) {
                    const [r, g, b, alpha] = png.getPixel(x, y);
                    // https://www.w3.org/TR/AERT/#color-contrast
                    const luma = (r * 0.299) + (g * 0.587) + (b * 0.114);
                    if (luma < 60) {
                        out_index = Math.floor((x + y * width) / 8)
                        outBuffer[out_index] &= ~(0x80 >> Math.floor(x % 8));
                    }
                }
            }
            resolve(outBuffer);
        });
    });
}

module.exports = convertPNGto1BitBuffer;
