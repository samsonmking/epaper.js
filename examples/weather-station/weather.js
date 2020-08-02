const {devices, init} = require('epaperjs');

const render = (page, ws) => {
    page.onConsoleLog(msg => console.log(msg));

    ws.on('message', async (message) => {
        if (message === 'render') {
            await page.display();
        }
    });
}

init(devices.waveshare4in2, render, {
    staticDirectory: 'static'
});
