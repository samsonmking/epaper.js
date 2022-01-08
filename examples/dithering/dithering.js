const { init, devices } = require('epaperjs');

const device = devices.waveshare7in5v2Horizontal;

init(device);

setTimeout(() => {
    device.driver.sleep();
    process.exit(0);
}, 30000);
