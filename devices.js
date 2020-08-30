const {convertPNGto1BitBW, convertPNGto1BitBWRotated} = require('./image.js');
const waveshare4In2Driver = require('bindings')('waveshare4in2.node');
const waveshare7in5v2Driver = require('bindings')('waveshare7in5v2.node');

const waveshare4in2Horizontal = {
    height: 300,
    width: 400,
    driver: waveshare4In2Driver,
    displayPNG: async function(imgContents) {
        const buffer = await convertPNGto1BitBW(imgContents);
        this.driver.display(buffer);
    }
};

const waveshare4in2Vertical = {
    height: 400,
    width: 300,
    driver: waveshare4In2Driver,
    displayPNG: async function(imgContents) {
        const buffer = await convertPNGto1BitBWRotated(imgContents);
        this.driver.display(buffer);
    }
};

const waveshare7in5v2Horizontal = {
    height: 480,
    width: 800,
    driver: waveshare7in5v2Driver,
    displayPNG: async function(imgContents) {
        const buffer = await convertPNGto1BitBW(imgContents);
        this.driver.display(buffer);
    }
};

const waveshare7in2v2Vertical = {
    height: 800,
    width: 480,
    driver: waveshare7in5v2Driver,
    displayPNG: async function(imgContents) {
        const buffer = await convertPNGto1BitBWRotated(imgContents);
        this.driver.display(buffer);
    }
};

const devices = {
    // default waveshare4in2 kept for backwards compatibility with release 1.0.0
    waveshare4in2: waveshare4in2Horizontal,
    waveshare4in2Horizontal,
    waveshare4in2Vertical,
    // default waveshare7in5v2 kept for backwards compatibility with releaes 1.1.0
    waveshare7in5v2: waveshare7in5v2Horizontal,
    waveshare7in5v2Horizontal,
    waveshare7in2v2Vertical
}

module.exports = devices;
