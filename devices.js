const waveshare4In2Driver = require('bindings')('waveshare4in2.node');
const waveshare7in5v2Driver = require('bindings')('waveshare7in5v2.node');

const devices = {
    waveshare4in2: {
        height: 300,
        width: 400,
        driver: waveshare4In2Driver
    },
    waveshare7in5v2: {
        height: 480,
        width: 800,
        driver: waveshare7in5v2Driver
    }
}

module.exports = devices;
