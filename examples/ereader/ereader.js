const {devices, init} = require('epaperjs');

const render = (page, ws) => {
    page.onConsoleLog(console.log);

    ws.on('message', async (message) => {
        if (message === 'render') {
            await page.display();
        }
    });

    process.stdin.addListener('keypress', (key, data) => {
        if (data.name === 'left') {
            ws.send('left');
        }
        if (data.name === 'right') {
            ws.send('right');
        }
    });

}

init(devices.waveshare4in2, render, {
    staticDirectory: 'static'
});
