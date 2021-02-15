const image = require('./image.js');
const waveshare4In2Driver = require('bindings')('waveshare4in2.node');
const waveshare7in5v2Driver = require('bindings')('waveshare7in5v2.node');
const waveshare7in5bHDDriver = require('bindings')('waveshare7in5bHD.node');

const waveshare4in2Horizontal = {
    height: 300,
    width: 400,
    driver: waveshare4In2Driver,
    displayPNG: async function (imgContents) {
        const buffer = await image.convertPNGto1BitBW(imgContents);
        this.driver.display(buffer);
    },
    init: function () {
        this.driver.init();
    },
};

const waveshare4in2Vertical = {
    height: 400,
    width: 300,
    driver: waveshare4In2Driver,
    displayPNG: async function (imgContents) {
        const buffer = await image.convertPNGto1BitBWRotated(imgContents);
        this.driver.display(buffer);
    },
    init: function () {
        this.driver.init();
    },
};

const waveshare4in2HorizontalGray = {
    height: 300,
    width: 400,
    driver: waveshare4In2Driver,
    displayPNG: async function (imgContents) {
        const buffer = await image.convertPNGto4Grey(imgContents);
        this.driver.display_4GrayDisplay(buffer);
    },
    init: function () {
        this.driver.init_4Gray();
    },
};

const waveshare4in2VerticalGray = {
    height: 400,
    width: 300,
    driver: waveshare4In2Driver,
    displayPNG: async function (imgContents, color_depth) {
        const buffer = await image.convertPNGto4GreyRotated(imgContents);
        this.driver.display_4GrayDisplay(buffer);
    },
    init: function () {
        this.driver.init_4Gray();
    },
};

const waveshare7in5v2Horizontal = {
    height: 480,
    width: 800,
    driver: waveshare7in5v2Driver,
    displayPNG: async function (imgContents) {
        const buffer = await image.convertPNGto1BitBW(imgContents);
        this.driver.display(buffer);
    },
    init: function () {
        this.driver.init();
    },
};

const waveshare7in2v2Vertical = {
    height: 800,
    width: 480,
    driver: waveshare7in5v2Driver,
    displayPNG: async function (imgContents) {
        const buffer = await image.convertPNGto1BitBWRotated(imgContents);
        this.driver.display(buffer);
    },
    init: function () {
        this.driver.init();
    },
};

const waveshare7in5bHDHorizontal = {
    height: 528,
    width: 880,
    driver: waveshare7in5bHDDriver,
    displayPNG: async function (imgContents, redImgContents) {
        const buffer = await image.convertPNGto1BitBW(imgContents);
        const redImgBuffer = await image.convertPNGto1BitBW(redImgContents);
        this.driver.display(buffer, redImgBuffer);
    },
    init: function () {
        this.driver.init();
    },
};

const waveshare7in2bHDVertical = {
    height: 880,
    width: 528,
    driver: waveshare7in5bHDDriver,
    displayPNG: async function (imgContents, redImgContents) {
        const buffer = await image.convertPNGto1BitBWRotated(imgContents);
        const redImgBuffer = await image.convertPNGto1BitBWRotated(
            redImgContents
        );
        this.driver.display(buffer, redImgBuffer);
    },
    init: function () {
        this.driver.init();
    },
};

const devices = {
    // default waveshare4in2 kept for backwards compatibility with release 1.0.0
    waveshare4in2: waveshare4in2Horizontal,
    waveshare4in2Horizontal,
    waveshare4in2HorizontalGray,
    waveshare4in2Vertical,
    waveshare4in2VerticalGray,
    // default waveshare7in5v2 kept for backwards compatibility with releaes 1.1.0
    waveshare7in5v2: waveshare7in5v2Horizontal,
    waveshare7in5v2Horizontal,
    waveshare7in2v2Vertical,
    // default waveshare7in5bHD kept for backwards compatibility with releaes 1.1.0
    waveshare7in5bHD: waveshare7in5bHDHorizontal,
    waveshare7in5bHDHorizontal,
    waveshare7in2bHDVertical,
};

module.exports = devices;
