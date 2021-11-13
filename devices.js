const image = require('./image.js');
const waveshare4In2Driver = require('bindings')('waveshare4in2.node');
const waveshare7in5v2Driver = require('bindings')('waveshare7in5v2.node');
const waveshare3In7Driver = require('bindings')('waveshare3in7.node');
const waveshare2in13v2Driver = require('bindings')('waveshare2in13v2.node');
const waveshare2in13bcDriver = require('bindings')('waveshare2in13bc.node');
const waveshare2in7Driver = require('bindings')('waveshare2in7.node');
const waveshare2in7bDriver = require('bindings')('waveshare2in7b.node');
const waveshare2in7v2Driver = require('bindings')('waveshare2in7v2.node');
const waveshare2in7v2bDriver = require('bindings')('waveshare2in7bv2.node');

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

const waveshare3in7Vertical = {
    height: 480,
    width: 280,
    driver: waveshare3In7Driver,
    displayPNG: async function (imgContents) {
        const buffer = await image.convertPNGto1BitBW(imgContents);
        this.driver.display(buffer);
    },
    init: function () {
        this.driver.init();
    },
};

const waveshare3in7Horizontal = {
    height: 280,
    width: 480,
    driver: waveshare3In7Driver,
    displayPNG: async function (imgContents) {
        const buffer = await image.convertPNGto1BitBWRotated(imgContents);
        this.driver.display(buffer);
    },
    init: function () {
        this.driver.init();
    },
};

const waveshare3in7VerticalGray = {
    height: 480,
    width: 280,
    driver: waveshare3In7Driver,
    displayPNG: async function (imgContents) {
        const buffer = await image.convertPNGto4Grey(imgContents);
        this.driver.display_4Gray(buffer);
    },
    init: function () {
        this.driver.init_4Gray();
    },
};

const waveshare3in7HorizontalGray = {
    height: 280,
    width: 480,
    driver: waveshare3In7Driver,
    displayPNG: async function (imgContents, color_depth) {
        const buffer = await image.convertPNGto4GreyRotated(imgContents);
        this.driver.display_4Gray(buffer);
    },
    init: function () {
        this.driver.init_4Gray();
    },
};

const waveshare2in13v2Vertical = {
    height: 250,
    width: 122,
    driver: waveshare2in13v2Driver,
    displayPNG: async function (imgContents) {
        const buffer = await image.convertPNGto1BitBW2in13V2(imgContents);
        this.driver.display(buffer);
    },
    init: function () {
        this.driver.init();
    },
};

const waveshare2in13v2Horizontal = {
    height: 122,
    width: 250,
    driver: waveshare2in13v2Driver,
    displayPNG: async function (imgContents) {
        const buffer = await image.convertPNGto1BitBW2in13V2Rotated(
            imgContents
        );
        this.driver.display(buffer);
    },
    init: function () {
        this.driver.init();
    },
};

const waveshare2in13bcHorizontal = {
    height: 104,
    width: 212,
    driver: waveshare2in13bcDriver,
    displayPNG: async function (imgContents) {
        const blackBuffer = await image.convertPNGto1BitBWRotated(imgContents);
        const emptyBuffer = Buffer.alloc(blackBuffer.length, 0xff);
        this.driver.display(blackBuffer, emptyBuffer);
    },
    init: function () {
        this.driver.init();
    },
};

const waveshare2in13bcVertical = {
    height: 212,
    width: 104,
    driver: waveshare2in13bcDriver,
    displayPNG: async function (imgContents) {
        const blackBuffer = await image.convertPNGto1BitBW(imgContents);
        const emptyBuffer = Buffer.alloc(blackBuffer.length, 0xff);
        this.driver.display(blackBuffer, emptyBuffer);
    },
    init: function () {
        this.driver.init();
    },
};

const waveshare2in7v2Vertical = {
    height: 176,
    width: 264,
    driver: waveshare2in7v2Driver,
    displayPNG: async function (imgContents) {
        const buffer = await image.convertPNGto1BitBW2in13V2(imgContents);
        this.driver.display(buffer);
    },
    init: function () {
        this.driver.init();
    },
};

const waveshare2in7Horizontal = {
    height: 176,
    width: 264,
    driver: waveshare2in7Driver,
    displayPNG: async function (imgContents) {
        const buffer = await image.convertPNGto1BitBW2in13V2Rotated(
            imgContents
        );
        this.driver.display(buffer);
    },
    init: function () {
        this.driver.init();
    },
};
const waveshare2in7Vertical = {
    height: 264,
    width: 176,
    driver: waveshare2in7Driver,
    displayPNG: async function (imgContents) {
        const buffer = await image.convertPNGto1BitBW2in13V2(imgContents);
        this.driver.display(buffer);
    },
    init: function () {
        this.driver.init();
    },
};

const waveshare2in7v2Horizontal = {
    height: 264,
    width: 176,
    driver: waveshare2in7v2Driver,
    displayPNG: async function (imgContents) {
        const buffer = await image.convertPNGto1BitBW2in13V2Rotated(
            imgContents
        );
        this.driver.display(buffer);
    },
    init: function () {
        this.driver.init();
    },
};

const waveshare2in7bHorizontal = {
    height: 264,
    width: 176,
    driver: waveshare2in7bDriver,
    displayPNG: async function (imgContents) {
        const blackBuffer = await image.convertPNGto1BitBWRotated(imgContents);
        const emptyBuffer = Buffer.alloc(blackBuffer.length, 0xff);
        this.driver.display(blackBuffer, emptyBuffer);
    },
    init: function () {
        this.driver.init();
    },
};

const waveshare2in7bVertical = {
    height: 176,
    width: 264,
    driver: waveshare2in7bDriver,
    displayPNG: async function (imgContents) {
        const blackBuffer = await image.convertPNGto1BitBW(imgContents);
        const emptyBuffer = Buffer.alloc(blackBuffer.length, 0xff);
        this.driver.display(blackBuffer, emptyBuffer);
    },
    init: function () {
        this.driver.init();
    },
};
const waveshare2in7V2bHorizontal = {
    height: 264,
    width: 176,
    driver: waveshare2in7v2bDriver,
    displayPNG: async function (imgContents) {
        const blackBuffer = await image.convertPNGto1BitBWRotated(imgContents);
        const emptyBuffer = Buffer.alloc(blackBuffer.length, 0xff);
        this.driver.display(blackBuffer, emptyBuffer);
    },
    init: function () {
        this.driver.init();
    },
};

const waveshare2in7V2bVertical = {
    height: 176,
    width: 264,
    driver: waveshare2in7v2bDriver,
    displayPNG: async function (imgContents) {
        const blackBuffer = await image.convertPNGto1BitBW(imgContents);
        const emptyBuffer = Buffer.alloc(blackBuffer.length, 0xff);
        this.driver.display(blackBuffer, emptyBuffer);
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
    // default
    waveshare3in7: waveshare3in7HorizontalGray,
    waveshare3in7Horizontal,
    waveshare3in7HorizontalGray,
    waveshare3in7Vertical,
    waveshare3in7VerticalGray,
    waveshare2in13v2: waveshare2in13v2Horizontal,
    waveshare2in13v2Horizontal,
    waveshare2in13v2Vertical,
    waveshare2in13bcHorizontal,
    waveshare2in13bcVertical,
    waveshare2in13bc: waveshare2in13bcHorizontal,
    waveshare2in7b: waveshare2in7bHorizontal,
    waveshare2in7bVertical,
    waveshare2in7v2: waveshare2in7v2Horizontal,
    waveshare2in7v2Vertical,
    waveshare2in7: waveshare2in7Horizontal,
    waveshare2in7Vertical,
    waveshare2in7V2b: waveshare2in7V2bHorizontal,
    waveshare2in7V2bVertical,
};

module.exports = devices;
