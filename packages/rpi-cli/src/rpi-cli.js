'use strict';

module.exports = rpiCli;
const {init, devices} = require('@epaperjs/core');

function rpiCli(device, url) {
    if(device === '2in13v2') {
        init(devices.waveshare2in13v2, url);
    } else {
        throw new Error('Unknown Device');
    }
}
