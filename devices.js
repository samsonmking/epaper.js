const waveshare4In2Driver = require('bindings')('waveshare4in2.node');
const waveshare2In7Driver = require('bindings')('waveshare2in7.node');

const devices = {
  waveshare4in2: {
    height: 300,
    width: 400,
    driver: waveshare4In2Driver,
  },
  waveshare2in7: {
    height: 264,
    width: 176,
    driver: waveshare2In7Driver,
  },
};

module.exports = devices;
