const { init, devices } = require('epaperjs');

const [isPortrait] = process.argv.slice(2);

const device = isPortrait
    ? devices.waveshare7in5v2Vertical
    : devices.waveshare7in5v2Horizontal;
const config = {
    enableDithering: false,
};

init(device, config);

setTimeout(() => {
    device.driver.sleep();
    process.exit(0);
}, 30000);
