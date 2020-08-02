const waveshare4In2Driver = require('bindings')('waveshare4in2.node');

const devices = {
    waveshare4in2: {
        height: 300,
        width: 400,
        driver: waveshare4In2Driver
    }
}

module.exports = devices;
